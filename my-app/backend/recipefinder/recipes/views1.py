from django.shortcuts import render
import requests
import logging
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Collection, Favorite, Rating
from .serializers import CollectionSerializer, FavoriteSerializer, RatingSerializer

class CollectionViewSet(viewsets.ModelViewSet):
    serializer_class = CollectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Collection.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(collection__user=self.request.user)

class RatingViewSet(viewsets.ModelViewSet):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Rating.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


logger = logging.getLogger(__name__)

@api_view(['POST'])
def get_recipes(request):
    ingredients = request.data.get('ingredients', [])
    allergens = request.data.get('allergens', [])

    url = 'https://api.spoonacular.com/recipes/findByIngredients'
    params = {
        'apiKey': settings.SPOONACULAR_API_KEY,
        'ingredients': ','.join(ingredients),
        'number': 10,
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        recipes = response.json()

        filtered_recipes = [
            recipe for recipe in recipes
            if not any(allergen in recipe['usedIngredients'] or allergen in recipe['missedIngredients'] for allergen in allergens)
        ]

        return Response(filtered_recipes, status=status.HTTP_200_OK)

    except requests.exceptions.RequestException as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_recipe_details(request, recipe_id):
    url = f'https://api.spoonacular.com/recipes/{recipe_id}/information'
    params = {
        'apiKey': settings.SPOONACULAR_API_KEY
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        recipe_details = response.json()
        return Response(recipe_details, status=status.HTTP_200_OK)

    except requests.exceptions.RequestException as e:
        logger.error("Error fetching recipe details from Spoonacular: %s", e)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
