import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth(); 

  // If the user is authenticated, render the children (protected routes), otherwise redirect to "/signin"
  return currentUser ? children : <Navigate to="/signin" />;
}

export default PrivateRoute;