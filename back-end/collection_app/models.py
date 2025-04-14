from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core import validators as v
from user_app.models import App_User
from django.db.models.signals import pre_save
from django.dispatch import receiver
import os
# Create your models here.

class Collection(models.Model):
    num_of_sets = models.PositiveIntegerField(default = 0)
    total_pieces = models.PositiveIntegerField(default = 0)
    App_user = models.OneToOneField(App_User, on_delete=models.CASCADE, related_name = 'collection', blank = True, null = True)

class Set_Group(models.Model):
    set_name = models.CharField(unique=True, max_length=100)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE, related_name = 'set_group')
    #blank = True, null = True

    def change_set_name(self, name):
        self.set_name = name
        self.save()

class Single_Set(models.Model):
    name = models.CharField(max_length=100, unique=True)
    theme_id = models.PositiveIntegerField(blank = True, null = True)
    num_parts = models.PositiveIntegerField(blank = True, null = True)
    difficulty_url = models.CharField(max_length=255, null = True, blank = True)
    set_img_url = models.CharField(max_length=255, null = True, blank = True)
    custom = models.BooleanField(default=False)
    set_group = models.ForeignKey(Set_Group, on_delete=models.CASCADE, related_name='single_set', blank=True, null=True)
    image = models.ImageField(upload_to='user/custom_sets', null =True, blank=True)



@receiver(pre_save, sender=Single_Set)
def delete_old_set_image(sender, instance, **kwargs):
    if not instance.pk:
        return  # new user, nothing to delete

    try:
        old_image = Single_Set.objects.get(pk=instance.pk).image
    except Single_Set.DoesNotExist:
        return

    new_image = instance.image
    if old_image and old_image != new_image:
        if os.path.isfile(old_image.path):
            os.remove(old_image.path)