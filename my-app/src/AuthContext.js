import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; // Ensure Firebase is properly imported

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Update the currentUser when Firebase authentication state changes
    });

    return () => unsubscribe(); // Cleanup the subscription
  }, []);

  const value = {
    currentUser,
    login: () => { /* login logic */ },
    logout: () => { /* logout logic */ },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}