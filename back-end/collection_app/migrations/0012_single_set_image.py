# Generated by Django 5.2 on 2025-04-14 16:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collection_app', '0011_alter_set_group_collection_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='single_set',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='user/custom_sets'),
        ),
    ]
