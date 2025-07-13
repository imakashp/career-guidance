import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './CollegeSignUp.css';

function CollegeSignUp() {
  const [collegeName, setCollegeName] = useState('');
  const [location, setLocation] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in and has admin privileges
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // TODO: Replace with actual admin check (e.g., Firestore role)
        setIsAdmin(true); // For now, assume logged-in user is admin
        console.log(`Admin check: User ${user.email} is logged in`);
      } else {
        console.log('No user logged in, redirecting to login');
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleCollegeSignUp = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setError('You do not have permission to register colleges.');
      console.error('Unauthorized college signup attempt');
      return;
    }

    try {
      // Store college data in Firestore
      const collegeId = `${collegeName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
      await setDoc(doc(db, 'colleges', collegeId), {
        name: collegeName,
        location,
        contactEmail,
        createdAt: new Date(),
      });
      console.log(`College registered: ${collegeName} (ID: ${collegeId})`);
      setSuccess('College registered successfully!');
      setError(null);
      setCollegeName('');
      setLocation('');
      setContactEmail('');
    } catch (err) {
      setError(err.message);
      console.error(`College signup failed: ${err.message}`);
      setSuccess(null);
    }
  };

  if (!isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="college-signup-container">
      <h2>College Sign Up</h2>
      <form onSubmit={handleCollegeSignUp}>
        <div>
          <label>College Name:</label>
          <input
            type="text"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contact Email:</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit">Register College</button>
      </form>
    </div>
  );
}

export default CollegeSignUp;