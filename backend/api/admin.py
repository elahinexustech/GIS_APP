from django.contrib import admin
from .models import Buyer, User, Marker, Comment, MarkerInteraction, CouponLink, ProjectsModel
# Register your models here.


class UserAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email')

admin.site.register(User, UserAdmin)


class MarkerAdmin(admin.ModelAdmin):
    list_display = ('icon_type', 'longitude', 'latitude', 'user')
    list_filter = ('icon_type',)
    search_fields = ('icon_type', 'comment')

admin.site.register(Marker, MarkerAdmin)



class MarkerInteractionAdmin(admin.ModelAdmin):
    list_display = ('marker', 'user', 'icon_type', 'created_at')

admin.site.register(MarkerInteraction, MarkerInteractionAdmin)



class CommentAdmin(admin.ModelAdmin):
    list_display = ('marker', 'user', 'text', 'created_at')
    list_filter = ('marker', 'user', 'parent', 'created_at')
    search_fields = ('text', 'user__username', 'marker__icon_type')
    ordering = ('-created_at',)

admin.site.register(Comment, CommentAdmin)


class BuyerAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')  
admin.site.register(Buyer, BuyerAdmin) 

class ProjectsModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'buyer', 'coupon_link')  # Example of customizations

admin.site.register(ProjectsModel, ProjectsModelAdmin)


class CouponLinkAdmin(admin.ModelAdmin):
    list_display = ('buyer', 'link', 'users_connected_count')

admin.site.register(CouponLink, CouponLinkAdmin)