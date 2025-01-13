from rest_framework import viewsets, generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse

from .models import (
    User,
    Comment,
    Marker,
    MarkerInteraction,
    ProjectsModel,
    CouponLink,
    Buyer
)

from .serializers import (
    CouponLinkSerializer,
    UserSerializer,
    CommentSerializer,
    MarkerSerializer,
    ProjectSerializer,
    BuyerSerializer
)

from django.shortcuts import get_object_or_404
from django.middleware.csrf import get_token
import logging

logger = logging.getLogger(__name__)

# UserViewSet for handling user-related CRUD operations


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# Login View to handle user authentication
class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        region = request.data.get('region')
            

        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(password):
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)

        request.session['user_id'] = user.id
        request.session.save()

        response_data = {
            'message': 'Login successful',
            'user_id': user.id,
            'email': user.email,
            'is_buyer': Buyer.objects.filter(user=user).exists(),
            'project': None
        }

        if region:
            link = CouponLink.objects.filter(link=region).first()
            project = ProjectsModel.objects.filter(coupon_link=link).first()
            
            if link and project:
                # Add user to the coupon link's users_connected
                link.users_connected.add(user)
                link.increment_users_connected()
                response_data['project'] = ProjectSerializer(project).data

        response = Response(response_data, status=status.HTTP_200_OK)
        response.set_cookie(
            key='sessionid',
            value=request.session.session_key,
            httponly=True,
            secure=True,
            samesite='Lax'
        )

        return response


# Check session to see if the user is logged in
class CheckSession(APIView):
    def get(self, request):
        user_id = request.session.get('user_id')

        if user_id:
            user = get_object_or_404(User, id=user_id)
            is_buyer = Buyer.objects.filter(user=user).exists()
            return Response({'isLoggedIn': True, 'user_id': user.id, 'email': user.email, 'is_buyer': is_buyer})
        return Response({'isLoggedIn': False}, status=status.HTTP_200_OK)


# Logout View to handle user logout
class LogoutView(APIView):
    def post(self, request):
        request.session.flush()
        response = JsonResponse({'message': 'Logout successful'})
        response.delete_cookie('sessionid')
        return response


class UserView(APIView):
    def get(self, req):
        user_id = req.session.get('user_id')
        user = get_object_or_404(User, id=user_id)
        is_buyer = Buyer.objects.filter(user=user).exists()
        buyer_id = Buyer.objects.filter(user=user).first().id if is_buyer else None
        return JsonResponse({"is_buyer": is_buyer, "buyer_id": buyer_id, **UserSerializer(user).data})
        return JsonResponse(UserSerializer(user).data)


class AddBuyer(APIView):
    def get(self, req):
        
        user_id = req.session.get('user_id')
        user = get_object_or_404(User, id=user_id)
        # Create a new buyer instance
        try:
            buyer = Buyer.objects.create(user=user)
        except Exception as e:
            return JsonResponse({"msg": "Server Error!"})

        return JsonResponse({"msg": "Buyer Added Successfully"})


class IsBuyer(APIView):
    def post(self, req):
        link = req.data.get('link')
        email = req.data.get('email')
        isCoupon = CouponLink.objects.filter(link=link).first()
        # Return a success message
        return JsonResponse({"msg": "Buyer Fetched Successfully", "isBuyer": isCoupon.buyer.email == email})


# Marker views for interacting with Marker objects
class MarkerListCreateView(generics.ListCreateAPIView):
    queryset = Marker.objects.all()
    serializer_class = MarkerSerializer

    def get(self, request, format=None):
        markers = Marker.objects.all()

        marker_data = []

        for marker in markers:
            serializer = MarkerSerializer(marker)
            comments = Comment.objects.filter(
                marker=marker, parent__isnull=True)
            comments_serializer = CommentSerializer(comments, many=True)

            marker_info = serializer.data
            marker_info['comments'] = comments_serializer.data
            marker_info['interaction_count'] = marker.interaction_count

            marker_data.append(marker_info)

        return JsonResponse(marker_data, safe=False, status=status.HTTP_200_OK)

    def post(self, request):
        # Extract necessary fields from the request data
        data = request.data

        # Step 1: Validate required fields
        required_fields = ['icon_type', 'longitude', 'latitude', 'project']
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return Response(
                {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Step 2: Validate the 'project' field
        print(data)
        try:
            project_id = data['project']['id']
        except TypeError as e:
            project_id = data['project']
        project = get_object_or_404(ProjectsModel, id=project_id)

        # Step 3: Additional validation logic (if needed)
        if data.get('longitude') < -180 or data.get('longitude') > 180:
            return Response(
                {"error": "Longitude must be between -180 and 180 degrees."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if data.get('latitude') < -90 or data.get('latitude') > 90:
            return Response(
                {"error": "Latitude must be between -90 and 90 degrees."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Step 4: Save marker instance
        try:
            marker = Marker.objects.create(
                icon_type=data['icon_type'],
                longitude=data['longitude'],
                latitude=data['latitude'],
                comment=data.get('comment', ""),  # Optional field
                project=project,  # Default interaction count
                user=User.objects.get(id=request.session.get('user_id'))
            )
            marker.interaction_count += 1
            marker.save()

            # Serialize the saved marker instance
            serializer = MarkerSerializer(marker)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(e)
            return Response(
                {"error": f"An error occurred while saving the marker: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )




class MarkerRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Marker.objects.all()
    serializer_class = MarkerSerializer


# Marker Interaction Count
class MarkerInteractionCountView(APIView):
    def post(self, request):
        marker_id = request.data.get('marker_id')
        user_id = request.data.get('user')
        icon_type = request.data.get('icon_type')

        marker = get_object_or_404(Marker, id=marker_id)
        user = get_object_or_404(User, id=user_id)

        if MarkerInteraction.objects.filter(marker=marker, user=user, icon_type=icon_type).exists():
            return Response({"message": "User has already interacted with this icon."}, status=status.HTTP_400_BAD_REQUEST)

        MarkerInteraction.objects.create(
            marker=marker, user=user, icon_type=icon_type)

        # Increment interaction count
        marker.interaction_count += 1
        marker.save()

        interaction_count = marker.interaction_count

        return Response({"message": "Interaction saved successfully.", "interaction_count": interaction_count}, status=status.HTTP_201_CREATED)


# Comment views for saving and fetching comments
class SaveComment(APIView):
    def post(self, request):
        # Get the marker instance
        marker = get_object_or_404(Marker, id=request.data.get('marker'))

        # Get the user who is making the comment
        user = get_object_or_404(User, id=request.data.get('user'))

        # Handle parent comment if exists
        parent_comment = None
        if 'parent_id' in request.data and request.data['parent_id']:
            parent_comment = get_object_or_404(
                Comment, id=request.data['parent_id'])

        # Save the comment instance manually
        comment = Comment(
            marker=marker,  # Link the marker
            text=request.data.get('text'),  # Comment text
            parent=parent_comment,  # Link the parent comment if it exists
            project=marker.project  # Link the project from the marker
        )
        comment.user = user
        comment.save()  # Save again to associate the user
        
        marker.interaction_count += 1
        marker.save()

        # Now serialize the comment and return the response
        serializer = CommentSerializer(comment)

        # Return the serialized data
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class FetchComments(APIView):
    def get(self, request):
        marker_id = request.query_params.get('marker_id')
        if marker_id:
            comments = Comment.objects.filter(
                marker_id=marker_id, parent__isnull=True)
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)
        return Response({"error": "Marker ID not provided"}, status=status.HTTP_400_BAD_REQUEST)


class Projects(APIView):
    def get(self, request):
        user_id = request.session.get('user_id')

        if not user_id:
            return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            # Get the user based on the session data
            user = User.objects.get(id=user_id)
            buyer = Buyer.objects.filter(user=user).first()
            projects = ProjectsModel.objects.filter(buyer=buyer)
            
            merged_data = []
            
            
            for project in projects:
                project_data = ProjectSerializer(project).data
                
                # FETCH COUPON LINK
                coupon_link = CouponLink.objects.filter(link=project.coupon_link).first()
                users_connected = coupon_link.users_connected.all()
                cupon_data = CouponLinkSerializer(coupon_link).data
                cupon_data['users_connected'] = UserSerializer(users_connected, many=True).data
                
                # FETCH COMMENTS
                comments = Comment.objects.filter(project=project)
                comments_data = CommentSerializer(comments, many=True).data
                
                # FETCH MARKER FOR LIKES & DISLIKES
                markers = Marker.objects.filter(project=project)
                likes = []
                dislikes = []

                for marker in markers:
                    marker_data = MarkerSerializer(marker).data
                    marker_data['user'] = UserSerializer(marker.user).data
                    if marker.icon_type == 'like':
                        likes.append(marker_data)
                    elif marker.icon_type == 'dislike':
                        dislikes.append(marker_data)
                
                
                
                merged_data.append({"project: ": project_data, "coupon": cupon_data, "comment": comments_data, "likes": likes, "dislikes": dislikes})

            # Return the merged data as the response
            return Response({"merged_data": merged_data}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            print(e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetProjects(APIView):
    def post(self, req):
        project_link = req.data.get('project_link')
        if not project_link:
            return JsonResponse({"error": "Project ID is required"}, status=400)

        try:
            coupon_link = CouponLink.objects.get(link=project_link)
            project = ProjectsModel.objects.get(coupon_link=coupon_link)
            
            user_id = req.session.get('user_id')
            if user_id:
                user = User.objects.get(id=user_id)
                if user not in coupon_link.users_connected.all():
                    coupon_link.users_connected.add(user)
                    coupon_link.increment_users_connected()
            
            return JsonResponse({"project": ProjectSerializer(project).data}, status=200)
        except ProjectsModel.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)
        except Exception as e:
            print(e)
            return JsonResponse({"error": str(e)}, status=500)


class ProjectsMarkers(APIView):
    def post(self, req):
        user_id = req.session.get('user_id')

        # Check for authenticated user
        if not user_id:
            return Response({"error": "User not authenticated"}, status=401)

        project_data = req.data.get('project')
        
        if not project_data or 'id' not in project_data:
            return Response({"error": "Invalid project data"}, status=400)

        try:
            # Fetch the user
            user = User.objects.get(id=user_id)

            # Fetch the project
            project = ProjectsModel.objects.filter(id=project_data['id']).first()
            if not project:
                return Response({"error": "Project not found"}, status=404)

            # Fetch markers associated with the project
            markers = Marker.objects.filter(project=project)

            # Serialize marker data and add interaction counts
            marker_data = []
            for marker in markers:
                serializer = MarkerSerializer(marker)
                comments = Comment.objects.filter(marker=marker, parent__isnull=True)
                comments_serializer = CommentSerializer(comments, many=True)

                marker_info = serializer.data
                marker_info['comments'] = comments_serializer.data
                marker_info['interaction_count'] = marker.interaction_count

                marker_data.append(marker_info)

            return Response({"markers": marker_data}, status=200)

        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)



class GenerateLink(APIView):
    def post(self, req):
        # Get the user ID from the session
        user_id = req.session.get('user_id')
        coordinates = req.data.get("coordinates")
        if not user_id:
            return JsonResponse({"msg": "User not authenticated."}, status=401)

        try:
            # Retrieve the user object based on the user_id from the session
            user = User.objects.get(id=user_id)

            # Check if the user is a buyer
            buyer = Buyer.objects.filter(user=user).first()
            if not buyer:
                return JsonResponse({"msg": "User is not a buyer."}, status=400)

            # Get the polygon coordinates from the request data
            if not coordinates or not isinstance(coordinates, list):
                return JsonResponse({"msg": "Invalid coordinates data."}, status=400)

            # Generate a unique link with the coordinates
            encoded_coordinates = ",".join(
                # Assuming GeoJSON-style array
                [f"{point[0]}_{point[1]}" for point in coordinates[0]]
            )
            generated_link = f"http://localhost:5173/buyers/maps?region={encoded_coordinates}/invite"

            # Create the CouponLink object
            coupon_link = CouponLink.objects.create(
                buyer=buyer,
                link=generated_link,
            )

            # Create the ProjectsModel object
            project = ProjectsModel.objects.create(
                name=f"Project for {user.email}",
                buyer=buyer,
                coupon_link=coupon_link
            )

            return JsonResponse({"msg": "Link generated successfully!", "link": generated_link}, status=200)

        except User.DoesNotExist:
            return JsonResponse({"msg": "User does not exist."}, status=404)

        except Exception as e:
            return JsonResponse({"msg": f"An error occurred: {str(e)}"}, status=500)



# CSRF Token view
class CSRFTokenView(APIView):
    def get(self, request):
        return JsonResponse({'csrfToken': get_token(request)})
