# Generated by Django 5.2 on 2025-04-17 19:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collection_app', '0012_single_set_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='single_set',
            name='instructions',
            field=models.CharField(blank=True, null=True),
        ),
    ]
