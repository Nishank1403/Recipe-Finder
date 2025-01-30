import React, { useState } from 'react';
import { Button } from './ui/Button';
import RecipeSharing from './RecipeSharing';
import RecipeRatings from './RecipeRatings';
import './RecipeFinder.css';


export function RecipeFinder({ groceryItems, allergens, setRecipes, currentUser, onAddToFavorites }) {
  const [loading, setLoading] = useState(false);
  const [recipes, setLocalRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeSharing, setShowRecipeSharing] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [selectedCuisine, setSelectedCuisine] = useState(''); // State for cuisine type
  const [selectedDiet, setSelectedDiet] = useState(''); // State for diet type

  const handleCuisineChange = (e) => {
    setSelectedCuisine(e.target.value);
  };

  const handleDietChange = (e) => {
    setSelectedDiet(e.target.value);
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
      const response = await fetch('http://127.0.0.1:8000/api/get-recipes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: groceryItems, allergens, cuisine: selectedCuisine, diet: selectedDiet }), // Pass cuisine and diet
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Recipes fetched:', data);

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
      setSelectedRecipe(recipes.find((recipe) => recipe.id === recipeId));
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
      <div className="mb-4">
        <label htmlFor="cuisine" className="mr-2">Select Cuisine:</label>
        <select id="cuisine" value={selectedCuisine} onChange={handleCuisineChange} className="border p-2 rounded">
          <option value="">Any</option>
          <option value="Italian">Italian</option>
          <option value="Mexican">Mexican</option>
          <option value="Chinese">Chinese</option>
          <option value="Indian">Indian</option>
          {/* Add more cuisines as needed */}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="diet" className="mr-2">Select Diet:</label>
        <select id="diet" value={selectedDiet} onChange={handleDietChange} className="border p-2 rounded">
          <option value="">Any</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="gluten free">Gluten Free</option>
          <option value="paleo">Paleo</option>
          {/* Add more diet options as needed */}
        </select>
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
                  <button
                    onClick={() => handleFavoriteClick(recipe)}
                    className="mt-2 text-yellow-500"
                  >
                    ⭐ Add to Favorites
                  </button>
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
              </li>
            ))}
          </ul>
        )}
        {!loading && recipes.length === 0 && <p>No recipes found.</p>}
      </div>
    </div>
  );
}
