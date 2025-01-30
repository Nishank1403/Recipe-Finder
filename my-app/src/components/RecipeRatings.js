import React, { useState } from 'react';
import './RecipeRatings.css'; // Import the CSS file

export function RecipeRatings() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Handle rating submission locally
    console.log('Rating submitted:', rating);
    console.log('Review submitted:', review);

    setRating(0);
    setReview('');
    setSuccessMessage('Thank you! Your review has been submitted.'); // Show success message

    // Clear the success message after a few seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="recipe-ratings-container">
      <h2>Rate this Recipe</h2>

      {/* Display success message */}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Rating:
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value, 10))}
            min="1"
            max="5"
          />
        </label>
        <label>
          Review:
          <textarea value={review} onChange={(e) => setReview(e.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default RecipeRatings;
