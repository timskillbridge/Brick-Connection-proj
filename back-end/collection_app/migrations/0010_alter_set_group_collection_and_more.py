# Generated by Django 5.2 on 2025-04-10 21:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collection_app', '0009_rename_app_user_temp_collection_app_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='set_group',
            name='collection',
            field=models.ForeignKey(db_constraint=False, on_delete=django.db.models.deletion.CASCADE, related_name='set_group', to='collection_app.collection'),
        ),
        migrations.AlterField(
            model_name='single_set',
            name='set_group',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='single_set', to='collection_app.set_group'),
        ),
    ]
