import React, { useState } from 'react';
import { Button } from './ui/Button';
import RecipeSharing from './RecipeSharing';
import RecipeRatings from './RecipeRatings'; // Import the RecipeRatings component

export function RecipeFinder({ groceryItems, allergens, setRecipes, currentUser }) {
  const [loading, setLoading] = useState(false);
  const [recipes, setLocalRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeSharing, setShowRecipeSharing] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [selectedCuisine, setSelectedCuisine] = useState(''); // New state for cuisine
  const [selectedDiet, setSelectedDiet] = useState(''); // New state for diet

  const cuisines = ['Any', 'Italian', 'Mexican', 'Chinese', 'Indian'];
  const diets = ['Any', 'Vegetarian', 'Vegan', 'Gluten Free', 'Paleo'];

  const handleCuisineChange = (cuisine) => {
    setSelectedCuisine(cuisine === 'Any' ? '' : cuisine);
  };

  const handleDietChange = (diet) => {
    setSelectedDiet(diet === 'Any' ? '' : diet);
  };

  const handleShareClick = (recipe) => {
    console.log('Share button clicked for recipe:', recipe);
    setSelectedRecipe(recipe);
    setShowRecipeSharing(true);
  };

  const closeSharing = () => {
    setShowRecipeSharing(false);
    setSelectedRecipe(null);
  };

  const findRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/get-recipes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ingredients: groceryItems, 
          allergens, 
          cuisine: selectedCuisine, 
          diet: selectedDiet 
        }),
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
    if (selectedRecipe?.id === recipeId && recipeDetails) {
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
      setSelectedRecipe(recipes.find((recipe) => recipe.id === recipeId)); // Ensure the correct recipe is selected
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
      
      {/* Cuisine Selection Buttons */}
      <div className="mb-4">
        <h4 className="font-semibold">Select Cuisine:</h4>
        <div className="flex flex-wrap gap-2">
          {cuisines.map((cuisine) => (
            <Button 
              key={cuisine} 
              onClick={() => handleCuisineChange(cuisine)} 
              className={`p-2 rounded ${selectedCuisine === cuisine ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            >
              {cuisine}
            </Button>
          ))}
        </div>
      </div>

      {/* Diet Selection Buttons */}
      <div className="mb-4">
        <h4 className="font-semibold">Select Diet:</h4>
        <div className="flex flex-wrap gap-2">
          {diets.map((diet) => (
            <Button 
              key={diet} 
              onClick={() => handleDietChange(diet)} 
              className={`p-2 rounded ${selectedDiet === diet ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            >
              {diet}
            </Button>
          ))}
        </div>
      </div>

      <Button onClick={findRecipes} disabled={loading}>
        {loading ? 'Finding Recipes...' : 'Find Recipes'}
      </Button>

      <div className="mt-4 space-y-4">
        {loading && <p>Loading recipes...</p>}
        {!loading && recipes.length > 0 && (
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.id} className="border p-4 rounded mb-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{recipe.title}</h3>
                </div>
                <img src={recipe.image} alt={recipe.title} className="w-full h-auto rounded" />
                <button
                  onClick={() => fetchRecipeDetails(recipe.id)}
                  className="mt-2 text-blue-500"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleShareClick(recipe)}
                  className="mt-2 text-blue-500"
                >
                  Share Recipe
                </button>

                {/* Render RecipeSharing below the selected recipe */}
                {showRecipeSharing && selectedRecipe?.id === recipe.id && (
                  <RecipeSharing recipe={selectedRecipe} onClose={closeSharing} />
                )}

                {/* Render recipe details below the selected recipe */}
                {recipeDetails && selectedRecipe?.id === recipe.id && (
                  <div className="mt-6 p-4 border rounded bg-gray-100">
                    <h3 className="text-xl font-bold">{recipeDetails.title}</h3>
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
                    <ul className="list-decimal list-inside mt-2">
                      {recipeDetails.instructions.split(/<\/?li>/).filter(step => step.trim()).map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                    <button onClick={closeDetails} className="mt-4 text-red-500">
                      Close Details
                    </button>
                  </div>
                )}

                {/* Render the RecipeRatings component */}
                <RecipeRatings recipeId={recipe.id} currentUser={currentUser} />
              </li>
            ))}
          </ul>
        )}
        {!loading && recipes.length === 0 && <p>No recipes found.</p>}
      </div>
    </div>
  );
}
