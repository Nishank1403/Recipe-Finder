import React, { useState } from 'react';
import { Button } from './ui/Button';
import RecipeSharing from './RecipeSharing';

export function RecipeFinder({ groceryItems, allergens, setRecipes }) {
  const [loading, setLoading] = useState(false);
  const [recipes, setLocalRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeSharing, setShowRecipeSharing] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState(null);

  const handleShareClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeSharing(true);
  };

  const findRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/get-recipes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: groceryItems, allergens }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);

      setLocalRecipes(data);
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setLocalRecipes([]);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipeDetails = async (recipeId) => {
    if (selectedRecipe === recipeId && recipeDetails) {
      return; // Do nothing if the same recipe is clicked again
    }
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/get-recipe-details/${recipeId}/`);

      if (!response.ok) {
        throw new Error('Failed to fetch recipe details');
      }

      const details = await response.json();
      setRecipeDetails(details);
      setSelectedRecipe(recipeId);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeDetails = () => {
    setRecipeDetails(null);
    setSelectedRecipe(null);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Recipe Finder</h2>
      <Button onClick={findRecipes} disabled={loading}>
        {loading ? 'Finding Recipes...' : 'Find Recipes'}
      </Button>
      <div className="mt-4 space-y-4">
        {loading && <p>Loading recipes...</p>}
        {!loading && recipes.length > 0 && (
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.id} className="border p-4 rounded mb-4">
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
                <img src={recipe.image} alt={recipe.title} className="w-full h-auto rounded" />
                <button
                  onClick={() => fetchRecipeDetails(recipe.id)}
                  className="mt-2 text-blue-500"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleShareClick(recipe)} // Properly handle the click event
                  className="mt-2 text-blue-500"
                >
                  Share Recipe
                </button>
              </li>
            ))}
          </ul>
        )}
        {recipeDetails && selectedRecipe && (
          <div className="mt-6 p-4 border rounded">
            <h3 className="text-xl font-bold">{recipeDetails.title}</h3>
            <img
              src={recipeDetails.image}
              alt={recipeDetails.title}
              className="w-full h-auto rounded mb-4"
            />
            <p>
              <strong>Servings:</strong> {recipeDetails.servings}
            </p>
            <p>
              <strong>Ready in:</strong> {recipeDetails.readyInMinutes} minutes
            </p>
            <h4 className="mt-4 font-semibold">Ingredients:</h4>
            <ul className="list-disc list-inside">
              {recipeDetails.extendedIngredients.map((ingredient, index) => (
                <li key={index}>{ingredient.original}</li>
              ))}
            </ul>
            <h4 className="mt-4 font-semibold">Instructions:</h4>
            <p>{recipeDetails.instructions}</p>
            <button onClick={closeDetails} className="mt-4 text-red-500">
              Close Details
            </button>
          </div>
        )}
        {showRecipeSharing && selectedRecipe && <RecipeSharing recipe={selectedRecipe} />}
        {!loading && recipes.length === 0 && <p>No recipes found.</p>}
      </div>
    </div>
  );
}
