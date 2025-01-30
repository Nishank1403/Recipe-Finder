import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; // Import a user icon
import './Account.css'; // Import the CSS file

const Account = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check the current user's authentication state
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log('Current user:', currentUser); // Debugging log
      if (currentUser) {
        setUser(currentUser);
      } else {
        console.log('No user is logged in'); // Debugging log
        navigate('/signin'); // Redirect to sign-in if no user is logged in
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleForgotPassword = async () => {
    if (user && user.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        alert('Password reset email sent. Please check your inbox.');
      } catch (err) {
        console.error('Error sending password reset email:', err);
        setError('Error sending password reset email. Please try again.');
      }
    }
  };

  return (
    <div className="account-container">
      <h2 className="account-header">Account Details</h2>
      {user ? (
        <div className="account-info">
          {/* Display user's photo or a placeholder icon */}
          {user.photoURL ? (
            <img src={user.photoURL} alt="User profile" className="account-profile-image" />
          ) : (
            <FaUserCircle size={100} className="account-profile-image" />
          )}
          <p><strong>Username:</strong> {user.displayName || 'No username available'}</p>
          <p><strong>Email:</strong> {user.email}</p>

          <button onClick={handleForgotPassword} className="account-button">Forgot Password</button>
          {error && <p className="error-message">{error}</p>}
        </div>
      ) : (
        <p>Loading or no user data available...</p>
      )}
    </div>
  );
};

export default Account;
