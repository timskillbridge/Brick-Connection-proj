from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework.authtoken.models import Token
from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver
from django.core import validators as v
import os
# Create your models here.

class App_User(AbstractUser):
    first_name = models.CharField(max_length=50, null=True, blank=True, default="The Name-less One")
    last_name = models.CharField(max_length=50, null=True, blank=True, default="")
    email = models.EmailField(max_length=100, unique=True, validators = [v.EmailValidator])
    image = models.ImageField(upload_to='user/profile_images', null =True, blank=True)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def change_password(self, new_password):
        self.set_password(new_password)
        self.save()

    def delete(self, *args, **kwargs):
        if self.image and self.image.path:
            if os.path.isfile(self.image.path):
                os.remove(self.image.path)
        Token.objects.filter(user=self).delete()
        super().delete(*args, **kwargs)


@receiver(pre_save, sender=App_User)
def delete_old_image(sender, instance, **kwargs):
    if not instance.pk:
        return
    try:
        old_image = App_User.objects.get(pk=instance.pk).image
    except App_User.DoesNotExist:
        return
    new_impage = instance.image
    if old_image and old_image != new_impage:
        if os.path.isfile(old_image.path):
            os.remove(old_image.path)
