from django.db import models
from django.contrib.auth.models import User

class Collection(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
class Favorite(models.Model):
    recipe_id = models.CharField(max_length=100)  
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)

class Rating(models.Model):
    recipe_id = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  
    review = models.TextField(blank=True, null=True)