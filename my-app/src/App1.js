
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GroceryList } from './components/GroceryLis';
import { RecipeFinder } from './components/RecipeFinder2';
import { AllergenAlert } from './components/AllergenAlert';
// import { RecipeSharing } from './components/RecipeSharing';
import Favorites from './components/Favorites'; 
import RecipeRatings from './components/RecipeRatings'; 
import PrivateRoute from './components/auth/PrivateRoute';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import { AuthProvider, useAuth } from './components/auth/AuthProvider';
import './App.css';

export default function App() {
  const [groceryItems, setGroceryItems] = useState([]);
  const [allergens, setAllergens] = useState([]);
  const [recipes, setRecipes] = useState([]); 
  const { currentUser } = useAuth();

  return (
    <AuthProvider> {/* Wrapping with AuthProvider */}
      <Router>
        <Routes>
          {/* Default route to redirect to signup or recipe-finder if the user is logged in */}
          <Route 
            path="/" 
            element={currentUser ? <Navigate to="/recipe-finder" /> : <Navigate to="/signup" />} 
          />

          {/* Route for SignUp */}
          <Route path="/signup" element={<SignUp />} />
          
          {/* Route for SignIn */}
          <Route path="/signin" element={<SignIn />} />

          {/* Private route for Recipe Finder */}
          <Route 
            path="/recipe-finder" 
            element={
              <PrivateRoute>
                <div className="min-h-screen">
                  <header className="header">
                    <div className="header-container">
                      <h1 className="header-title">Recipe Finder & Grocery List</h1>
                    </div>
                  </header>
                  <main className="main-content">
                    <div>
                      <GroceryList items={groceryItems} setItems={setGroceryItems} />
                      <AllergenAlert allergens={allergens} setAllergens={setAllergens} />
                    </div>
                    <div>
                      <RecipeFinder groceryItems={groceryItems} allergens={allergens} setRecipes={setRecipes} />
                      {/* <RecipeSharing recipes={recipes || []} /> Provide an empty array as a fallback */}
                    </div>
                  </main>
                </div>
              </PrivateRoute>
            }
          />

          {/* New Route for Favorites */}
          <Route 
            path="/favorites" 
            element={
              <PrivateRoute>
                <Favorites />
              </PrivateRoute>
            } 
          />

          {/* New Route for Recipe Ratings and Reviews */}
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