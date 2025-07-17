import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import '../../styles/Navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Redirect to home page after logout
        navigate('/');
      })
      .catch((error) => {
        console.error("Logout Error:", error);
      });
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Career Guidance</Link>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/student-dashboard">Dashboard</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Student Login</Link>
            <Link to="/admin/login">Admin Login</Link>
            <Link to="/signup" className="signup-button">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;