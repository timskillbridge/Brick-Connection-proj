
from django.urls import path
from .views import Register_New_User, Log_In, Register_Super, UserInfo, LogOut, UserDeleteView, All_Users, A_user
from os import environ, getenv
from dotenv import load_dotenv

if 'SUPER_ENDPOINT' not in environ:
    load_dotenv()

urlpatterns = [
    path('register/',Register_New_User.as_view(), name='register'),
    path(
        f"{getenv('SUPER_ENDPOINT')}", Register_Super.as_view(), name='register-super'),
    path('manage-users/', All_Users.as_view(), name='manage-users'),
    path('delete/<int:user_id>/',UserDeleteView.as_view(), name='user-delete-view'),
    path('login/', Log_In.as_view(), name='login'),
    path('',UserInfo.as_view(), name='user-view'),
    path('logout/',LogOut.as_view(), name='logout'),
    path('a-user/<int:user_id>/', A_user.as_view(), name='a_user')

]