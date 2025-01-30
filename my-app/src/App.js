import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { GroceryList } from './components/GroceryList';
import { RecipeFinder } from './components/RecipeFinder';
import { AllergenAlert } from './components/AllergenAlert';
import Favorites from './components/Favorites'; 
import Account from './components/Account'; 
import RecipeRatings from './components/RecipeRatings'; 
import PrivateRoute from './components/auth/PrivateRoute';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import { AuthProvider, useAuth } from './components/auth/AuthProvider';
//import Authentication from './components/auth/Authentication';

import './App.css';

export default function App() {
  const [groceryItems, setGroceryItems] = useState([]);
  const [allergens, setAllergens] = useState([]);
  const [recipes, setRecipes] = useState([]); 
  const [favoriteRecipes, setFavoriteRecipes] = useState([]); // New state for favorite recipes
  const { currentUser } = useAuth();

  const handleAddToFavorites = (recipeName) => {
    if (!favoriteRecipes.includes(recipeName)) {
      setFavoriteRecipes([...favoriteRecipes, recipeName]);
    } else {
      alert(`${recipeName} is already in your favorites.`);
    }
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
        {/* <Route path="/auth" element={<Authentication />} /> */}
        <Route path="/account" element={<Account />} /> 
          <Route 
            path="/" 
            element={currentUser ? <Navigate to="/recipe-finder" /> : <Navigate to="/signup" />} 
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route 
            path="/recipe-finder" 
            element={
              <PrivateRoute>
                <div className="min-h-screen">
                  <header className="header">
                    <div className="header-container">
                      <h1 className="header-title">FlavourFind- An Intelligent Recipe Finder App</h1>
                    </div>
                  </header>
                  <nav className="bg-gray-100 p-4 flex justify-end space-x-4">
                    <Link to="/account" className="btn mr-4">
                      Account
                    </Link>
                    <Link to="/favorites" className="btn">
                      Favorites
                    </Link>
                  </nav>
                  <main className="main-content">
                    <div>
                      <GroceryList items={groceryItems} setItems={setGroceryItems} />
                      <AllergenAlert allergens={allergens} setAllergens={setAllergens} />
                    </div>
                    <div>
                      <RecipeFinder 
                        groceryItems={groceryItems} 
                        allergens={allergens} 
                        setRecipes={setRecipes}
                        currentUser={currentUser}
                        onAddToFavorites={handleAddToFavorites} // Pass the handler
                      />
                    </div>
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route 
            path="/favorites" 
            element={
              <PrivateRoute>
                <Favorites favoriteRecipes={favoriteRecipes} />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/recipe-ratings" 
            element={
              <PrivateRoute>
                <RecipeRatings />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
