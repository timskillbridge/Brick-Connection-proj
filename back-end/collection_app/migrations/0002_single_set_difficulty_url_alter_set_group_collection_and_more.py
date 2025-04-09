# Generated by Django 5.2 on 2025-04-08 16:33

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collection_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='single_set',
            name='difficulty_url',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='set_group',
            name='collection',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='set_group', to='collection_app.collection'),
        ),
        migrations.AlterField(
            model_name='set_group',
            name='set_name',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]
