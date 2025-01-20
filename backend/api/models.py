from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class User(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)

    def __str__(self):
        return self.email

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

class Buyer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="subscription")
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    
    

class Marker(models.Model):
    ICON_CHOICES = [
        ('like', 'Like'),
        ('dislike', 'Dislike'),
        ('comment', 'Comment'),
    ]
    icon_type = models.CharField(max_length=20, choices=ICON_CHOICES)
    longitude = models.FloatField()
    latitude = models.FloatField()
    comment = models.TextField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    project = models.ForeignKey('ProjectsModel', on_delete=models.CASCADE, related_name='markers', null=True, blank=True)
    interaction_count = models.PositiveIntegerField(default=0)  # New field

    def __str__(self):
        return f"{self.icon_type} at ({self.latitude}, {self.longitude})"


class MarkerInteraction(models.Model):
    marker = models.ForeignKey(Marker, on_delete=models.CASCADE, related_name='interactions')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    icon_type = models.CharField(max_length=20, choices=Marker.ICON_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} {self.icon_type} on marker {self.marker.id}"



class Comment(models.Model):
    marker = models.ForeignKey(Marker, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    parent = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    project = models.ForeignKey('ProjectsModel', on_delete=models.CASCADE, related_name='comments', null=True, blank=True)

    def __str__(self):
        return f"Comment by {self.user.email} on {self.marker.icon_type}"

class CouponLink(models.Model):
    buyer = models.ForeignKey(Buyer, on_delete=models.CASCADE, related_name='coupon_links')
    link = models.URLField(max_length=900)
    users_connected = models.ManyToManyField(User, related_name='connected_links', blank=True)
    users_connected_count = models.PositiveIntegerField(default=0)

    def increment_users_connected(self):
        self.users_connected_count += 1
        self.save()

    def __str__(self):
        return self.link

class ProjectsModel(models.Model):
    name = models.CharField(max_length=255)
    buyer = models.ForeignKey(Buyer, on_delete=models.CASCADE, related_name='projects')
    coupon_link = models.OneToOneField(CouponLink, on_delete=models.CASCADE, related_name='project', null=True, blank=True)

    def __str__(self):
        return self.name

    def get_comments(self):
        return self.comments.all()  # Fetch all comments for this project