from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    LoginView,
    LogoutView,
    CheckSession,
    UserView,
    AddBuyer,
    MarkerListCreateView,
    MarkerRetrieveUpdateDestroyView,
    MarkerInteractionCountView,
    SaveComment,
    FetchComments,
    CSRFTokenView,
    Projects,
    GetProjects,
    ProjectsMarkers,
    GenerateLink,
    IsBuyer
)

# Set up the router
router = DefaultRouter()
router.register(r'users', UserViewSet, basename="user")

# Define urlpatterns
urlpatterns = [
    path('', include(router.urls)),  # Include router URLs for User and SubscriptionPlan
    
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('check-session/', CheckSession.as_view(), name='check-session'),

    path('users', UserView.as_view(), name='check-session'),
    path('users/addbuyer', AddBuyer.as_view(), name='check-session'),
    path('users/isBuyer', IsBuyer.as_view(), name='generate-link'),
    
    # Marker-related routes
    path('markers/', MarkerListCreateView.as_view(), name='marker-list-create'),
    path('markers/<int:pk>/', MarkerRetrieveUpdateDestroyView.as_view(), name='marker-detail'),
    path('markers/interactions/', MarkerInteractionCountView.as_view(), name='marker-interaction-count'),
    
    # Comment-related routes
    path('comments/', SaveComment.as_view(), name='save-comment'),
    path('comments/fetch/', FetchComments.as_view(), name='fetch-comments'),
    
    # CSRF Token route
    path('csrf-token/', CSRFTokenView.as_view(), name='csrf-token'),
    
    # Projects
    path('projects/', Projects.as_view(), name='projects'),
    path('projects/get', GetProjects.as_view(), name='projects'),
    path('projects/markers/', ProjectsMarkers.as_view(), name='projects'),
    
    # Coupon Generation
    path('generate/link', GenerateLink.as_view(), name='generate-link'),
]
