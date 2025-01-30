import React, { useState } from 'react';
import { useAuth } from './auth/AuthProvider';

export default function Favorites({ favoriteRecipes }) {
  const { currentUser } = useAuth();

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Your Favorite Recipes</h2>
      {favoriteRecipes.length === 0 ? (
        <p>No recipes added to favorites yet.</p>
      ) : (
        <ul className="list-disc list-inside">
          {favoriteRecipes.map((recipe, index) => (
            <li key={index} className="p-2 border-b">
              {recipe}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
