import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import { auth } from '../../firebase';
import './SignIn.css'; // Import the CSS file

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in successfully");
      navigate('/recipe-finder');
    } catch (err) {
      console.error("Sign-in error:", err);
      if (err.code === 'auth/user-not-found') {
        setError(
          <>
            User not found.{' '}
            <Link to="/signup" className="signup-link">
              Click here to sign up.
            </Link>
          </>
        );
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format. Please check and try again.');
      } else {
        setError('Error signing in. Please try again later.');
      }
    }
  };

  return (
    <div className="signin-container">
      <h2 className="signin-header">Sign In</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSignIn}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className="signin-input"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          className="signin-input"
        />
        <button type="submit" className="signin-button">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
