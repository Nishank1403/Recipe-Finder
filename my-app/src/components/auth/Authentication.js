// import React, { useState } from 'react';
// import { auth } from './firebaseConfig';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// import './Authentication.css';

// function Authentication() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [error, setError] = useState(null);

//   const handleAuth = async (e) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       if (isRegistering) {
//         // Register a new user
//         await createUserWithEmailAndPassword(auth, email, password);
//         alert('Registration successful! You can now sign in.');
//       } else {
//         // Sign in an existing user
//         await signInWithEmailAndPassword(auth, email, password);
//         alert('Sign-in successful!');
//       }
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <h2>{isRegistering ? 'Register' : 'Sign In'}</h2>
//       <form onSubmit={handleAuth}>
//         <div>
//           <label>Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">
//           {isRegistering ? 'Register' : 'Sign In'}
//         </button>
//       </form>
//       {error && <p className="error">{error}</p>}
//       <button onClick={() => setIsRegistering(!isRegistering)}>
//         {isRegistering ? 'Already have an account? Sign In' : 'New user? Register'}
//       </button>
//     </div>
//   );
// }

// export default Authentication;


// components/auth/Authentication.js
import React from 'react';

function Authentication() {
  return (
    <div>
      {/* Your authentication logic here */}
      <h1>Authentication Page</h1>
    </div>
  );
}

export default Authentication;

