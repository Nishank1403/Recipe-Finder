import React, { useState } from 'react';
import { Button } from './ui/Button';
import RecipeSharing from './RecipeSharing';
import RecipeRatings from './RecipeRatings'; // Import the RecipeRatings component
import './RecipeFinder.css';

export function RecipeFinder({ groceryItems, allergens, setRecipes, currentUser, onAddToFavorites }) {
  const [loading, setLoading] = useState(false);
  const [recipes, setLocalRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeSharing, setShowRecipeSharing] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [selectedCuisine, setSelectedCuisine] = useState(''); // State for the selected cuisine
  const [selectedDiet, setSelectedDiet] = useState(''); // State for the selected diet

  // List of cuisines for dropdown
  const cuisines = ['Select a Cuisine', 'Italian', 'Mexican', 'Chinese', 'Indian', 'French', 'Japanese', 'Thai', 'Spanish'];

  // List of diets for dropdown
  const diets = ['Select a Diet', 'Gluten Free', 'Ketogenic', 'Vegetarian', 'Vegan', 'Pescetarian', 'Paleo', 'Primal', 'Whole30'];

  const handleCuisineChange = (event) => {
    setSelectedCuisine(event.target.value);
  };

  const handleDietChange = (event) => {
    setSelectedDiet(event.target.value);
  };

  const handleShareClick = (recipe) => {
    console.log('Share button clicked for recipe:', recipe);
    setSelectedRecipe(recipe);
    setShowRecipeSharing(true);
  };

  const handleFavoriteClick = (recipe) => {
    onAddToFavorites(recipe.title);
  };

  const closeSharing = () => {
    setShowRecipeSharing(false);
    setSelectedRecipe(null);
  };

  const findRecipes = async () => {
    setLoading(true);
    try {
      // Spoonacular API endpoint with the selected cuisine, diet, and addRecipeNutrition parameters
      const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?cuisine=${selectedCuisine}&diet=${selectedDiet}&addRecipeNutrition=true&apiKey=4725beb825204224853d46786a10dc6b`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);

      setLocalRecipes(data.results); // Update with results from Spoonacular API
      setRecipes(data.results);
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
    <div className="centered-container">
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Recipe Finder</h2>

      {/* Cuisine selection dropdown */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold">Select Cuisine:</h4>
        <select
          value={selectedCuisine}
          onChange={handleCuisineChange}
          className="mt-2 p-2 border rounded w-full"
        >
          {cuisines.map((cuisine, index) => (
            <option key={index} value={cuisine === 'Select a Cuisine' ? '' : cuisine}>
              {cuisine}
            </option>
          ))}
        </select>
      </div>

      {/* Diet selection dropdown */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold">Select Diet:</h4>
        <select
          value={selectedDiet}
          onChange={handleDietChange}
          className="mt-2 p-2 border rounded w-full"
        >
          {diets.map((diet, index) => (
            <option key={index} value={diet === 'Select a Diet' ? '' : diet}>
              {diet}
            </option>
          ))}
        </select>
      </div>

      {/* Add space between the diet dropdown and the Find Recipes button */}
      <div className="mb-4"></div>

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
                  <button
                    onClick={() => handleFavoriteClick(recipe)}
                    className="mt-2 text-yellow-500"
                  >
                    ⭐ Add to Favorites
                  </button>
                </div>
                <img src={recipe.image} alt={recipe.title} className="w-full h-auto rounded mb-4" />
                {recipeDetails && selectedRecipe?.id === recipe.id && (
                  <div className="mt-4 p-4 border rounded bg-gray-100">
                    <div className="flex flex-wrap justify-between">
                      <div className="w-full md:w-1/3 p-2">
                        <h4 className="font-semibold">Ingredients:</h4>
                        <p>
                          {recipeDetails.extendedIngredients.map(ingredient => ingredient.original).join(', ')}
                        </p>
                      </div>
                      <div className="w-full md:w-1/3 p-2">
                        <h4 className="font-semibold">Nutrients:</h4>
                        {recipeDetails.nutrition && recipeDetails.nutrition.nutrients ? (
                          <p>
                            {recipeDetails.nutrition.nutrients.map(nutrient => `${nutrient.name}: ${nutrient.amount} ${nutrient.unit}`).join(', ')}
                          </p>
                        ) : (
                          <p>Nutrient information not available</p>
                        )}
                      </div>
                      <div className="w-full md:w-1/3 p-2">
                        <h4 className="font-semibold">Instructions:</h4>
                        <p>
                          {recipeDetails.instructions.split(/<\/?li>/).filter(step => step.trim()).join(', ')}
                        </p>
                      </div>
                    </div>
                    <button onClick={closeDetails} className="mt-4 text-red-500">
                      Close Details
                    </button>
                  </div>
                )}
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

                {/* Render the RecipeRatings component */}
                <RecipeRatings recipeId={recipe.id} currentUser={currentUser} />
              </li>
            ))}
          </ul>
        )}
        {!loading && recipes.length === 0 && <p>No recipes found.</p>}
      </div>
    </div>
    </div>
  );
}
