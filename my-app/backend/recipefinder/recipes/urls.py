from django.urls import path, include
from .views import get_recipes, get_recipe_details
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'collections', views.CollectionViewSet, basename='collection')
router.register(r'favorites', views.FavoriteViewSet, basename='favorite')  
router.register(r'ratings', views.RatingViewSet, basename='rating') 

urlpatterns = [
    path('get-recipes/', get_recipes, name='get_recipes'),
    path('get-recipe-details/<int:recipe_id>/', get_recipe_details, name='get_recipe_details'),
    path('', include(router.urls)),
]