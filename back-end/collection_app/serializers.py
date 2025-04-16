from rest_framework.serializers import ModelSerializer, StringRelatedField, SerializerMethodField, PrimaryKeyRelatedField
from .models import Single_Set, Set_Group, Collection
from user_app.serializers import App_UserSerializer

class CollectionSerializer(ModelSerializer):
    App_User = StringRelatedField(read_only = True)

    class Meta:
        model = Collection
        fields = '__all__'

        read_only_fields = ['id']

class Single_SetSerializer(ModelSerializer):
    set_group = PrimaryKeyRelatedField(queryset=Set_Group.objects.all())

    class Meta:
        model = Single_Set
        fields = "__all__"
        read_only_fields = ['id']

class Set_GroupSerializer(ModelSerializer):
    collection = PrimaryKeyRelatedField(queryset=Collection.objects.all())
    single_set = Single_SetSerializer(many=True, read_only=True)

    class Meta:
        model = Set_Group
        fields = "__all__"

class CustomSetSerializer(ModelSerializer):
    owner_username = SerializerMethodField()
    class Meta:
        model = Single_Set
        fields = "__all__"

    def get_owner_username(self, obj):
        return getattr(obj.set_group.collection.App_user, "username", None)