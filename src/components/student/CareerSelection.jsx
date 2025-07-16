import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './CareerSelection.css';

function CareerSelection() {
  const [career, setCareer] = useState('');
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

  const handleCareerSelection = async (e) => {
    e.preventDefault();
    if (!career) {
      setError('Please select a career field.');
      console.error('Career selection failed: No career selected');
      return;
    }

    try {
      const user = auth.currentUser;
      await updateDoc(doc(db, 'users', user.uid), {
        career,
        updatedAt: new Date(),
      });
      console.log(`Career selected: ${career} for user ${user.email}`);
      setSuccess('Career field saved successfully!');
      setError(null);
      setCareer('');
    } catch (err) {
      setError(err.message);
      console.error(`Career selection failed: ${err.message}`);
      setSuccess(null);
    }
  };

  return (
    <div className="career-selection-container">
      <h2>Select Your Career Field</h2>
      <form onSubmit={handleCareerSelection}>
        <div>
          <label>Career Field:</label>
          <select
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            required
          >
            <option value="">Select a field</option>
            <option value="Engineering">Engineering</option>
            <option value="Management">Management</option>
            <option value="Medical">Medical</option>
            <option value="Arts">Arts</option>
          </select>
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit">Save Career</button>
      </form>
    </div>
  );
}

export default CareerSelection;