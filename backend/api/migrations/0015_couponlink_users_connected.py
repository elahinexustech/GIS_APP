# Generated by Django 5.1.2 on 2024-12-19 22:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_remove_couponlink_users_connected_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='couponlink',
            name='users_connected',
            field=models.ManyToManyField(related_name='coupon_links', to='api.user'),
        ),
    ]
