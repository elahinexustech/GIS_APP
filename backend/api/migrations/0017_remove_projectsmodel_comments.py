# Generated by Django 5.1.2 on 2024-12-20 16:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_remove_couponlink_created_at_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='projectsmodel',
            name='comments',
        ),
    ]
