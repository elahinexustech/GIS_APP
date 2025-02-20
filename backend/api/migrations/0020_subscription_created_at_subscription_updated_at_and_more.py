# Generated by Django 5.1.2 on 2024-12-24 17:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_alter_subscription_trial_start_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='subscription',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='subscription',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
        migrations.AlterField(
            model_name='subscription',
            name='payment_status',
            field=models.CharField(blank=True, choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed'), ('cancelled', 'Cancelled')], max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='subscription',
            name='trial_start_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
