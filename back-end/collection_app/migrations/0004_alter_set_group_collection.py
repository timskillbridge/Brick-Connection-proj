# Generated by Django 5.2 on 2025-04-08 17:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collection_app', '0003_alter_set_group_collection'),
    ]

    operations = [
        migrations.AlterField(
            model_name='set_group',
            name='collection',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='set_group', to='collection_app.collection'),
        ),
    ]
