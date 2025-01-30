import React from 'react';
import { Button } from './ui/Button'; 
import { Card, CardHeader, CardContent } from './ui/Card'; 

export function RecipeSharing({ recipes }) {
  const shareRecipe = (recipe) => {
    console.log('Sharing recipe:', recipe);
  };

  const calculateAverageRating = (recipe) => {
    if (!recipe.ratings || recipe.ratings.length === 0) {
      return 0; 
    }

    const total = recipe.ratings.reduce((sum, rating) => sum + rating, 0);
    return total / recipe.ratings.length;
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Recipes</h2>
      <div className="space-y-4">
        {recipes.map((recipe, index) => (
          <Card key={index}>
            <CardHeader>
              <h3 className="text-xl font-semibold">{recipe.title}</h3>
              <p className="text-gray-500">Ready in {recipe.readyInMinutes} minutes</p>
              <p className="text-gray-500">Average Rating: {calculateAverageRating(recipe).toFixed(1)} / 5</p>
            </CardHeader>
            <CardContent>
              <p>{recipe.summary}</p>
              <Button onClick={() => shareRecipe(recipe)} className="mt-2">
                Share Recipe
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


 export default RecipeSharing;