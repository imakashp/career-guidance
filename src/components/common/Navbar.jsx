import { Link } from 'react-router-dom';
import { auth } from '../../firebase/firebase';
import '../../styles/Navbar.css';

function Navbar() {
  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Career Guidance</Link>
      </div>
      <div className="navbar-links">
        {auth.currentUser ? (
          <>
            <Link to="/student-dashboard">Dashboard</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/admin/login">Admin Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;