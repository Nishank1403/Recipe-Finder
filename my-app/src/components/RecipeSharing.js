import React, { useState } from 'react';
import { Button } from './ui/Button';
import './RecipeSharing.css'; // Import the CSS file

function RecipeSharing({ recipe, onClose }) {
  const [shareMethod, setShareMethod] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const handleSend = () => {
    if (!recipient) {
      alert('Please enter a recipient.');
      return;
    }
    console.log(`Recipe shared via ${shareMethod} to ${recipient}`);
    setMessageSent(true);
    setRecipient('');
  };

  return (
    <div className="recipe-sharing-container">
      <h3 className="recipe-sharing-title">Share Recipe: {recipe.title}</h3>
      {!shareMethod ? (
        <div className="share-method-buttons">
          <Button onClick={() => setShareMethod('email')}>
            Share via Email
          </Button>
          <Button onClick={() => setShareMethod('message')}>
            Share via Message
          </Button>
        </div>
      ) : (
        <div className="mt-4">
          <label className="input-container">
            {shareMethod === 'email' ? 'Recipient Email:' : 'Recipient Mobile Number:'}
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder={shareMethod === 'email' ? 'Enter email address' : 'Enter mobile number'}
            />
          </label>
          <Button onClick={handleSend} className="send-button">
            Send
          </Button>
          {messageSent && (
            <p className="success-message">Recipe shared successfully via {shareMethod}!</p>
          )}
        </div>
      )}
      <Button onClick={onClose} className="close-button">
        Close
      </Button>
    </div>
  );
}

export default RecipeSharing;

