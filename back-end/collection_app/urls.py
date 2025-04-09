from django.urls import path
from .views import Whole_Collection, Set_Groups, A_Set_Group, Single_Sets

# from api/v1/collection/
urlpatterns = [
    path('', Whole_Collection.as_view(), name='whole-collection'),
    path('set_groups/', Set_Groups.as_view(), name='set-groups'),
    path('set_groups/<int:set_groups>/',A_Set_Group.as_view(), name='set-group' ),
    path('set_groups/<int:set_groups>/single_sets/', Single_Sets.as_view(), name = 'single-sets')
    # path('<int_or_str:theme>/', Theme.as_view(), name='theme'),
    # path('<str:keyword>/', Keyword.as_view(), name='keyword'),
    # path('<int:count>/', ByCount.as_view(), name='by-count')
]

##########################  Need a collection/sets/<int:set>/ path