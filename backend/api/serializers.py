from rest_framework import serializers
from .models import (
    CouponLink,
    User,
    Marker,
    MarkerInteraction,
    Comment,
    ProjectsModel,
    Buyer
)


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'full_name', 'email', 'password')

    def create(self, validated_data):
        # Extract the password from validated_data
        password = validated_data.pop('password', None)
        # Create the user instance
        user = User.objects.create(**validated_data)
        # Set the password (this hashes it)
        if password:
            user.set_password(password)
        user.save()
        return user


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment  # Assuming you have a Comment model
        fields = '__all__'


class CouponLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = CouponLink
        fields = ['id', 'buyer', 'users_connected', 'users_connected_count', 'link']


class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectsModel
        # Include comments field here
        fields = ['id', 'name', 'buyer', 'coupon_link']


class MarkerSerializer(serializers.ModelSerializer):
    interaction_count = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Marker
        fields = '__all__'

    def get_interaction_count(self, obj):
        # Get the count of MarkerInteraction only for the marker's specific icon_type
        return MarkerInteraction.objects.filter(marker=obj).count()

    def get_comments(self, obj):
        # Get the top-level comments (where parent is None) for this marker
        comments = Comment.objects.filter(
            marker=obj, parent=None).order_by('-created_at')
        return CommentSerializer(comments, many=True).data


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'marker', 'user', 'text',
                  'parent', 'created_at', 'replies']

    def get_replies(self, obj):
        replies = Comment.objects.filter(parent=obj)
        return CommentSerializer(replies, many=True).data


class MarkerInteractionCountSerializer(serializers.ModelSerializer):
    interaction_count = serializers.SerializerMethodField()

    class Meta:
        model = Marker
        fields = ['id', 'icon_type', 'interaction_count']



class BuyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Buyer
        fields = '__all__'
