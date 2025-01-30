import React, { useState } from 'react';
import { Button } from './ui/Button'; 
import { Input } from './ui/Input'; 

export function AllergenAlert({ allergens, setAllergens }) {
  const [newAllergen, setNewAllergen] = useState('');

  const addAllergen = () => {
    if (newAllergen.trim() !== '') {
      setAllergens([...allergens, newAllergen.trim()]);
      setNewAllergen('');
    }
  };

  const removeAllergen = (index) => {
    setAllergens(allergens.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Allergen Alert</h2>
      <div className="flex mb-4">
        <Input
          type="text"
          value={newAllergen}
          onChange={(e) => setNewAllergen(e.target.value)}
          placeholder="Add allergen"
          className="flex-grow mr-2"
        />
        <Button onClick={addAllergen}>Add</Button>
      </div>
      <ul className="space-y-2">
        {allergens.map((allergen, index) => (
          <li key={index} className="flex justify-between items-center">
            <span>{allergen}</span>
            <Button variant="destructive" size="sm" onClick={() => removeAllergen(index)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
