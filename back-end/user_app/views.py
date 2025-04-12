from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import \
HTTP_200_OK,\
HTTP_201_CREATED,\
HTTP_204_NO_CONTENT,\
HTTP_400_BAD_REQUEST,\
HTTP_401_UNAUTHORIZED
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout, authenticate
from .models import App_User
from .serializers import App_UserSerializer, Manage_UserSerializer
from collection_app.models import Collection
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
# Create your views here.

# inherit from this to verify use is logged in before attempting to do anything
class LoggedInView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

# Sign up, does not require logged-in user
class Register_New_User(APIView):
    def post(self, request):
        data = request.data.copy()
        create_username = data.get('email')
        data['username'] = create_username[0:create_username.index('@')]
        try:
            new_user = App_User.objects.create_user(**data)
            token = Token.objects.create(user=new_user)
            collection, created = Collection.objects.get_or_create(App_user = new_user, defaults={'App_user':new_user})
            login(request, new_user)
            return Response({
                'App_User':new_user.email,
                'token':token.key,
                'collection': f'created with id {collection.id}'
            }, status= HTTP_201_CREATED
            )
        except Exception as e:
            return Response({'error':str(e)})
        
@method_decorator(csrf_exempt, name='dispatch')
class Register_Super(APIView):
    def post(self, request):
        data = request.data.copy()
        create_username = data.get('email')
        data['username'] = create_username[0:create_username.index('@')]
        try:
            new_user = App_User.objects.create_superuser(**data)
            token = Token.objects.create(user=new_user)
            collection, created = Collection.objects.get_or_create(App_user = new_user, defaults={'App_user':new_user})
            login(request, new_user)
            return Response({
                'App_User':new_user.email,
                'token':token.key,
                'collection': f'created with id {collection.id}'
            }, status= HTTP_201_CREATED
            )
        except Exception as e:
            return Response({'error':str(e)})

# Logging in does not require user to be logged in
class Log_In(APIView):
    def post(self, request):
        data = request.data.copy()
        # data['username'] = request.data.get('username', request.data.get('email'))
        print(f"username: {data['username']} password: {data['password']}")
        # sliceMail = data.get['email']
        # data['username'] = sliceMail[0:sliceMail.index('@')]
        user = authenticate(
            username = data.get('username'),
            password = data.get('password')
        )
        if user:
            print(f"USER FOUND: {user.username}")
            user_token, created = Token.objects.get_or_create(user = user)
            login(request, user)
            return Response(
                {
                    'user': user.username,
                    'token': user_token.key,
                    'is_super': user.is_superuser
                },
                status = HTTP_200_OK
            )
        print('USER NOT FOUND FOR SOME REASON')
        return Response('No user matching the provided credentials', HTTP_400_BAD_REQUEST)

class UserInfo(LoggedInView):
    def get(self, request):
        return Response({
            'username': request.user.username,
            'email' : request.user.email,
            'first name': request.user.first_name,
            'last name': request.user.last_name if request.user.last_name != "" else 'None Provided',
            **({'site administrator':request.user.is_superuser}
               if request.user.is_superuser
               else {'is_active':request.user.is_active})
        }, status= HTTP_200_OK
        
        )
    def put(self, request):
        data = request.data.copy()
        if 'password' in data:
            if not data['password']:
                return Response({
                    'Error':'Password cannot be empty'
                },
                status=HTTP_400_BAD_REQUEST
                )
            request.user.set_password(data['password'])
            request.user.save()
            return Response("Password has been changed", status=HTTP_200_OK)
        
        serialized_user = App_UserSerializer(request.user, data = data, partial = True)
        if serialized_user.is_valid():
            serialized_user.save()
            return Response(serialized_user.data, status=HTTP_200_OK)
        return Response(serialized_user.errors, status=HTTP_400_BAD_REQUEST)


class LogOut(LoggedInView):
    def post(self, request):
        request.user.auth_token.delete()
        logout(request)
        return Response(
            "You have been successfully logged out",
            status=HTTP_204_NO_CONTENT
        )

class UserDeleteView(LoggedInView):
    def post(self, request, user_id):
        
        user = get_object_or_404(App_User, id=user_id)

        if request.user.is_superuser:
        
            try:
                collection = getattr(user, 'collection', None)
                if collection:
                    for group in collection.set_group.all():
                        group.single_set.all().delete()

                    collection.set_group.all().delete()

                    collection.delete()

                user.delete()

                return Response('User was successfully deleted',status=HTTP_200_OK)

            except Exception as e:
                return Response({'error': str(e)}, status=500)
        else:
            return Response('Insufficient permission to delete user', status=HTTP_401_UNAUTHORIZED)

class All_Users(LoggedInView):
    def get(self, request):
        if not request.user.is_superuser:
            return Response('You have insufficient access to this feature',status=HTTP_401_UNAUTHORIZED)
        user_list = App_User.objects.all()
        serialized_users = Manage_UserSerializer(user_list, many=True)
        return Response({
            'user': serialized_users.data
        },
        status=HTTP_200_OK
        )