# Generated by Django 5.1.2 on 2024-12-15 19:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_alter_projectsmodel_users_couponlink'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='couponlink',
            name='users_connected',
        ),
        migrations.AddField(
            model_name='couponlink',
            name='users_connected_count',
            field=models.IntegerField(default=0),
        ),
    ]
