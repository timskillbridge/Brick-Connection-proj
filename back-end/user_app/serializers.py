
from .models import App_User
from rest_framework.serializers import ModelSerializer
from django.shortcuts import get_object_or_404

class App_UserSerializer(ModelSerializer):

    class Meta:
        model = App_User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'image',
            'is_active'

        ]
        read_only_fields = ['id']

class Manage_UserSerializer(ModelSerializer):
    class Meta:
        model = App_User
        fields = [
            'id',
            'username',
            'email',
            'is_superuser',
            'image',
            'is_active'
        ]
        read_only_fields = ['id']
