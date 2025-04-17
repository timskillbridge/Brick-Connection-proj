
# Django and rest_framework
from django.shortcuts import render, get_object_or_404
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.status import \
HTTP_200_OK,\
HTTP_201_CREATED,\
HTTP_204_NO_CONTENT,\
HTTP_400_BAD_REQUEST,\
HTTP_404_NOT_FOUND,\
HTTP_500_INTERNAL_SERVER_ERROR

#My code
from user_app.views import LoggedInView
from .models import Set_Group, Single_Set, Collection
from .serializers import Set_GroupSerializer, Single_SetSerializer, CollectionSerializer, CustomSetSerializer
from user_app.serializers import App_UserSerializer

#additional needed libraries
import requests
from requests_oauthlib import OAuth1
from .utility import get_icon
import os
from PIL import Image
from rembg import remove
from io import BytesIO
from urllib.parse import urlparse




'''
-----------------------------------------------------------------------------------------------------
|                                                                                                   |
|                               COLLECTION VIEW (ONE COLLECTION PER USER)                           |
|                                                                                                   |
-----------------------------------------------------------------------------------------------------
'''

class Whole_Collection(LoggedInView):
    def get(self, request):
        collection = Collection.objects.get(App_user = request.user)
        set_groups = Set_Group.objects.filter(collection = collection)
        serialized_collection = CollectionSerializer(collection)
        serialized_set_groups = Set_GroupSerializer(set_groups, many=True)

        return Response({
            'Collection':serialized_collection.data,
            'set_groups':serialized_set_groups.data 
        },
        status = HTTP_200_OK
        )
'''
-----------------------------------------------------------------------------------------------------
|                                                                                                   |
|                         SET GROUP VIEWS, MANY SET GROUPS PER COLLECTION                           |
|                                                                                                   |
-----------------------------------------------------------------------------------------------------
'''


'''
-----------------------------------------
|           GET ALL OR POST             |
-----------------------------------------
'''
class Set_Groups(LoggedInView):
# 
# ---------------------
# |     GET ALL       |
# ---------------------
# 
    def get(self, request):
        collection = Collection.objects.get(App_user = request.user)
        # print(collection.id)
        set_groups = Set_Group.objects.filter(collection = collection)
        serialized_set_groups = Set_GroupSerializer(set_groups, many=True)
        return Response({
            'set_groups': serialized_set_groups.data
        },
        status=HTTP_200_OK
        )
# 
# ---------------------
# |       POST        |
# ---------------------
# 
    def post(self, request):
        collection_id = Collection.objects.get(App_user = request.user).id
        data = request.data.copy()
        data['collection'] = collection_id
        serialized_set_group = Set_GroupSerializer(data = data)
        if serialized_set_group.is_valid():
            instance = serialized_set_group.save()
            instance.refresh_from_db()
            return Response({
                'set_group':Set_GroupSerializer(instance).data                 
            },
            status=HTTP_201_CREATED
            )
        return Response(
            serialized_set_group.errors, status = HTTP_400_BAD_REQUEST
        )

'''
-----------------------------------------
|           GET 1, PUT, DELETE          |
-----------------------------------------
'''

class A_Set_Group(LoggedInView):
# '''
# ---------------------
# |        GET 1      |
# ---------------------
# '''
    def get(self, request, set_groups):
        collection_id = Collection.objects.get(App_user = request.user).id
        # set = Set_Group.objects.get(id=set_group, collection = collection_id)
        try:
            set = get_object_or_404(request.user.collection.set_group, id = set_groups, collection=collection_id)
        except:
            return Response('Invalid set group or the specified set group belongs to another user', status=HTTP_400_BAD_REQUEST)
        if set:
            return Response(
                Set_GroupSerializer(set).data, status= HTTP_200_OK
            )
        return Response('Invalid group or group belongs to another user', status=HTTP_400_BAD_REQUEST)

# 
# ---------------------
# |       PUT         |
# ---------------------
# 
    def put(self, request, set_groups):
        data = request.data.copy()
        if 'set_name' in data:
            collection_id = Collection.objects.get(App_user = request.user).id
            # set = Set_Group.objects.get(id=set_group, collection = collection_id)
            try:
                a_set_group = get_object_or_404(request.user.collection.set_group, id = set_groups, collection=collection_id)
            except:
                return Response('Invalid set group or the specified set group belongs to another user', status=HTTP_400_BAD_REQUEST)
            a_set_group.change_set_name(data['set_name'])
            return Response(f'Updated set group name to {data['set_name']}', status=HTTP_200_OK)
            
        return Response('request did not include required field: set_name', status=HTTP_400_BAD_REQUEST)

# 
# ---------------------
# |       DELETE      |
# ---------------------
# 

    def delete(self, request, set_groups):
        collection_id = Collection.objects.get(App_user = request.user).id
        # set = Set_Group.objects.get(id=set_group, collection = collection_id)
        try:
            a_set_group = get_object_or_404(request.user.collection.set_group, id = set_groups, collection=collection_id)
        except:
            return Response('Invalid set group or the specified set group belongs to another user', status=HTTP_400_BAD_REQUEST)
        a_set_group.delete()
        return Response('Deleted',status=HTTP_204_NO_CONTENT)
    

'''
-----------------------------------------------------------------------------------------------------
|                                                                                                   |
|                              SINGLE SETS, GET, POST, OR DELETE                                  |
|                                                                                                   |
-----------------------------------------------------------------------------------------------------
'''  
class Single_Sets(LoggedInView):
# 
# ---------------------
# |       GET         |
# ---------------------
# 
    def get(self, request, set_groups):
        
        collection = Collection.objects.get(App_user = request.user)
        try:
            the_set_group = Set_Group.objects.filter(collection = collection, id = set_groups)[0]
        except IndexError:
            return Response('the set group proived does not exist or belongs to another user',status=HTTP_400_BAD_REQUEST)   
        single_sets = Single_Set.objects.filter(set_group = the_set_group)
        print(single_sets)

        serialized_single_sets = Single_SetSerializer(single_sets, many=True)
        return Response({
            'single_sets': serialized_single_sets.data
        },
        status=HTTP_200_OK
        )
# 
# ---------------------
# |       POST        |
# ---------------------
# 
    def post(self, request, set_groups):
        
        collection = Collection.objects.get(App_user = request.user)
        try:
            the_set_group = Set_Group.objects.filter(collection = collection, id = set_groups)[0]
        except:
            return Response('the set group proived does not exist or belongs to another user',status=HTTP_400_BAD_REQUEST)
        data = request.data.copy()
        data["set_group"] = the_set_group.id
        if data['num_parts']:
            complexity = int(data['num_parts'])
            try:
                data['difficulty_url'] = get_icon(complexity)
            except:
                pass
        serialized_single_set = Single_SetSerializer(data = data)
        if serialized_single_set.is_valid():
            instance = serialized_single_set.save()
            instance.refresh_from_db()
            return Response({
                'single_set':Single_SetSerializer(instance).data
            },
            status=HTTP_201_CREATED
            )
        return Response(serialized_single_set.errors, status=HTTP_400_BAD_REQUEST)
    
class ProcessJPEG(APIView):
    def post(self, request):
        image_address = request.data.get('image_address')
        if not image_address:
            return Response({"error":"No valid image provided"}, status = HTTP_400_BAD_REQUEST)
        try:
            image_name = os.path.basename(urlparse(image_address).path)
            base = os.path.splitext(image_name)[0]
            output_name = f"{base}.png"
            assets_dir = os.path.join(settings.BASE_DIR,'assets')
            os.makedirs(assets_dir, exist_ok=True)
            output=os.path.join(assets_dir, output_name)
            if os.path.exists(output):
                return Response({
                    'path':output_name
                }, status=HTTP_200_OK)
            response = requests.get(image_address)
            if response.status_code != 200:
                return Response({'error':'could not grab image'}
                ,status=HTTP_404_NOT_FOUND )
            grab_image = Image.open(BytesIO(response.content)).convert("RGBA")
            output_image = remove(grab_image)
            output_image.save(output)
            image_url = requests.build_absolute_url(f"/assets/{output_name}")
            return Response({
                'path':image_url
            }, status=HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'error':str(e)
            },
            status=HTTP_500_INTERNAL_SERVER_ERROR
            )

'''
-----------------------------------------
|           GET ALL             |
-----------------------------------------
'''
class Custom_Set(APIView):
# 
# ---------------------
# |     GET ALL       |
# ---------------------
# 
    def get(self, request):
        custom_sets = Single_Set.objects.filter(custom = True).select_related("set_group__collection__App_user")
        serialized_sets = CustomSetSerializer(custom_sets, many=True)
        return Response({
            'all_sets': serialized_sets.data,
        },
        status=HTTP_200_OK
        )
    

    
class Official_Sets(APIView):
    def get(self, request):
        official_sets = Single_Set.objects.filter(custom = False)
        serialized_sets = Single_SetSerializer(official_sets,many=True)
        return Response({
            'sets':serialized_sets
        },
        status=HTTP_200_OK
        )
    
class All_User_Sets(LoggedInView):
    def get(self, request, user_id):
        try: 
            all_sets = Single_Set.objects.filter(user_id = user_id)
            serialized_sets = Single_SetSerializer(all_sets, many=True)
            return Response({
                'sets':serialized_sets
            },
            status=HTTP_200_OK
            )
        except:
            return Response("Error gathering user's sets", status=HTTP_400_BAD_REQUEST)
