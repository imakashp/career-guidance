import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../../styles/LocationSelection.css';

function LocationSelection() {
  const [location, setLocation] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log('No user logged in, redirecting to login');
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLocationSelection = async (selectedLocation) => {
    try {
      const user = auth.currentUser;
      await updateDoc(doc(db, 'users', user.uid), {
        location: selectedLocation,
        updatedAt: new Date(),
      });
      console.log(`Location selected: ${selectedLocation} for user ${user.email}`);
      setSuccess(`Location (${selectedLocation}) saved successfully!`);
      setError(null);
      setLocation(selectedLocation);
    } catch (err) {
      setError(err.message);
      console.error(`Location selection failed: ${err.message}`);
      setSuccess(null);
    }
  };

  return (
    <div className="location-selection-container">
      <h2>Select Your Preferred Location</h2>
      <div className="button-group">
        <button
          type="button"
          className={location === 'India' ? 'active' : ''}
          onClick={() => handleLocationSelection('India')}
        >
          India
        </button>
        <button
          type="button"
          className={location === 'Abroad' ? 'active' : ''}
          onClick={() => handleLocationSelection('Abroad')}
        >
          Abroad
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}

export default LocationSelection;