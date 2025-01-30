import React, { useState } from 'react';
import { Button } from './ui/Button';

export function GroceryList({ items, setItems }) {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim() !== '') {
      // Add a new item as an object with `name` and `completed` properties
      setItems([...items, { name: newItem.trim(), completed: false }]);
      setNewItem('');
    }
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const toggleItemCompletion = (index) => {
    setItems(
      items.map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Grocery List</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add grocery item"
          className="flex-grow mr-2 border rounded p-2"
        />
        <Button onClick={addItem}>Add</Button>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex justify-between items-center">
            <span className={item.completed ? 'line-through text-gray-500' : ''}>
              {item.name}
            </span>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleItemCompletion(index)}
                className="mr-2"
              />
              <Button variant="destructive" size="sm" onClick={() => removeItem(index)}>
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


