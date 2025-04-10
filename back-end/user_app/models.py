from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework.authtoken.models import Token
from django.core import validators as v
# Create your models here.

class App_User(AbstractUser):
    first_name = models.CharField(max_length=50, null=True, blank=True, default="The Name-less One")
    last_name = models.CharField(max_length=50, null=True, blank=True, default="")
    email = models.EmailField(max_length=100, unique=True, validators = [v.EmailValidator])

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def change_password(self, new_password):
        self.set_password(new_password)
        self.save()

    def delete(self, *args, **kwargs):
        Token.objects.filter(user=self).delete()
        super().delete(*args, **kwargs)