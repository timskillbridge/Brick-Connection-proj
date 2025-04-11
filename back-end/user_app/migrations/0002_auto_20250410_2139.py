# Generated by Django 5.2 on 2025-04-10 21:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_app', '0001_initial'),
        ('collection_app', '0010_alter_set_group_collection_and_more')
    ]

operations = [
        migrations.RunSQL(
            sql="""
                ALTER TABLE collection_app_collection
                DROP CONSTRAINT IF EXISTS collection_app_colle_App_user_id_beb92b8e_fk_user_app_;

                ALTER TABLE collection_app_collection
                ADD CONSTRAINT collection_app_colle_App_user_id_beb92b8e_fk_user_app_
                FOREIGN KEY ("App_user_id")
                REFERENCES user_app_app_user(id)
                ON DELETE CASCADE;
            """,
            reverse_sql="""
                ALTER TABLE collection_app_collection
                DROP CONSTRAINT IF EXISTS collection_app_colle_App_user_id_beb92b8e_fk_user_app_;

                ALTER TABLE collection_app_collection
                ADD CONSTRAINT collection_app_colle_App_user_id_beb92b8e_fk_user_app_
                FOREIGN KEY ("App_user_id")
                REFERENCES user_app_app_user(id)
                ON DELETE NO ACTION;
            """
        )
    ]