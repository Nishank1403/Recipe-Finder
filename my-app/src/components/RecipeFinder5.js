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
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');

  const cuisines = ['Any', 'Italian', 'Mexican', 'Chinese', 'Indian']; // Add more cuisines as needed
  const diets = ['Any', 'Vegetarian', 'Vegan', 'Gluten Free', 'Paleo'];

  const handleCuisineChange = (cuisine) => {
    setSelectedCuisine(cuisine === 'Any' ? '' : cuisine);
  };

  const handleDietChange = (diet) => {
    setSelectedDiet(diet === 'Any' ? '' : diet);
  };

  const handleShareClick = (recipe) => {
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
        body: JSON.stringify({ ingredients: groceryItems, allergens, cuisine: selectedCuisine, diet: selectedDiet }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
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
      return;
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
    <div className="recipe-finder-container">
      <h2 className="recipe-finder-header">Recipe Finder</h2>

      {/* Cuisine selection section */}
      <div className="input-section">
        <h4 className="label">Select Cuisine:</h4>
        <div className="button-group">
          {cuisines.map((cuisine) => (
            <Button
              key={cuisine}
              className={`cuisine-button ${selectedCuisine === cuisine ? 'active' : ''}`}
              onClick={() => handleCuisineChange(cuisine)}
            >
              {cuisine}
            </Button>
          ))}
        </div>
      </div>

      {/* Diet selection section */}
      <div className="input-section">
        <h4 className="label">Select Diet:</h4>
        <div className="button-group">
          {diets.map((diet) => (
            <Button
              key={diet}
              className={`diet-button ${selectedDiet === diet ? 'active' : ''}`}
              onClick={() => handleDietChange(diet)}
            >
              {diet}
            </Button>
          ))}
        </div>
      </div>

      {/* Recipe search button */}
      <button onClick={findRecipes} className="recipe-button" disabled={loading}>
        {loading ? 'Finding Recipes...' : 'Find Recipes'}
      </button>

      <div className="recipe-list-container">
        {loading && <p>Loading recipes...</p>}
        {!loading && recipes.length > 0 && (
          <ul className="recipe-list">
            {recipes.map((recipe) => (
              <li key={recipe.id} className="recipe-item">
                <div className="recipe-header">
                  <h3 className="recipe-title">{recipe.title}</h3>
                  <button onClick={() => handleFavoriteClick(recipe)} className="recipe-item-button">
                    ⭐ Add to Favorites
                  </button>
                </div>
                <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                <button onClick={() => fetchRecipeDetails(recipe.id)} className="recipe-item-button">
                  View Details
                </button>
                <button onClick={() => handleShareClick(recipe)} className="recipe-item-button">
                  Share Recipe
                </button>
                {showRecipeSharing && selectedRecipe?.id === recipe.id && (
                  <RecipeSharing recipe={selectedRecipe} onClose={closeSharing} />
                )}
                {recipeDetails && selectedRecipe?.id === recipe.id && (
                  <div className="recipe-details">
                    <h3 className="details-title">{recipeDetails.title}</h3>
                    <p><strong>Servings:</strong> {recipeDetails.servings}</p>
                    <p><strong>Ready in:</strong> {recipeDetails.readyInMinutes} minutes</p>
                    <h4>Ingredients:</h4>
                    <ul>
                      {recipeDetails.extendedIngredients.map((ingredient, index) => (
                        <li key={index}>{ingredient.original}</li>
                      ))}
                    </ul>
                    <h4>Nutrients:</h4>
                    <ul>
                      {recipeDetails.nutrition && recipeDetails.nutrition.nutrients ? (
                        recipeDetails.nutrition.nutrients.map((nutrient, index) => (
                          <li key={index}>
                            {nutrient.name}: {nutrient.amount} {nutrient.unit}
                          </li>
                        ))
                      ) : (
                        <p>Nutrient information not available</p>
                      )}
                    </ul>
                    <h4>Instructions:</h4>
                    <p>{recipeDetails.instructions || 'Instructions not available'}</p>
                    <button onClick={closeDetails} className="close-details-button">
                      Close Details
                    </button>
                  </div>
                )}
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
