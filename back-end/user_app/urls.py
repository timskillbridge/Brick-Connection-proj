
from django.urls import path
from .views import Register_New_User, Log_In, Register_Super, UserInfo, LogOut
from os import environ, getenv
from dotenv import load_dotenv

if 'SUPER_ENDPOINT' not in environ:
    load_dotenv()

urlpatterns = [
    path('register/',Register_New_User.as_view(), name='register'),
    path(
        f"{getenv('SUPER_ENDPOINT')}", Register_Super.as_view(), name='register-super'),
    path('login/', Log_In.as_view(), name='login'),
    path('user-details/',UserInfo.as_view(), name='user-view'),
    path('logout/',LogOut.as_view(), name='logout')

]