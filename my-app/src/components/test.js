import React from 'react';
import RecipeSharing from './RecipeSharing';

function TestComponent() {
  return (
    <div>
      <h2>Testing RecipeSharing Component</h2>
      <RecipeSharing recipe={{ title: 'Direct Test Recipe' }} onClose={() => console.log('Closed')} />
    </div>
  );
}

export default TestComponent;
