from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import \
HTTP_200_OK,\
HTTP_201_CREATED,\
HTTP_204_NO_CONTENT,\
HTTP_400_BAD_REQUEST
from user_app.views import LoggedInView
from .models import Set_Group, Single_Set, Collection
from .serializers import Set_GroupSerializer, Single_SetSerializer, CollectionSerializer
from user_app.serializers import App_UserSerializer
import requests
from requests_oauthlib import OAuth1
from .utility import get_icon


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
    def put(self, request, set_group):
        data = request.data.copy()
        if 'set_name' in data:
            collection_id = Collection.objects.get(App_user = request.user).id
            # set = Set_Group.objects.get(id=set_group, collection = collection_id)
            try:
                a_set_group = get_object_or_404(request.user.collection.set_group, id = set_group, collection=collection_id)
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

    def delete(self, request, set_group):
        collection_id = Collection.objects.get(App_user = request.user).id
        # set = Set_Group.objects.get(id=set_group, collection = collection_id)
        try:
            a_set_group = get_object_or_404(request.user.collection.set_group, id = set_group, collection=collection_id)
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