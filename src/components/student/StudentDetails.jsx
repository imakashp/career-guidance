import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../../styles/StudentDetails.css';

function StudentDetails() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Form State
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [highSchoolMarks, setHighSchoolMarks] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            // Pre-fill form with existing data
            setPhone(data.phone || '');
            setAddress(data.address || '');
            setHighSchoolMarks(data.highSchoolMarks || '');
             // Fetch college name if selectedCollege exists
             if (data.selectedCollege) {
                const collegeDoc = await getDoc(doc(db, "colleges", data.selectedCollege));
                if (collegeDoc.exists()) {
                  // This is a common pattern to merge related data
                  setUserData(prevData => ({...prevData, selectedCollegeName: collegeDoc.data().name}));
                }
              }
          } else {
            setError('User profile not found.');
          }
        } catch (err) {
          setError('Failed to load user data.');
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const user = auth.currentUser;
      await updateDoc(doc(db, 'users', user.uid), {
        phone,
        address,
        highSchoolMarks: parseFloat(highSchoolMarks),
        updatedAt: new Date(),
      });
      setSuccess('Details saved successfully!');
       // Refresh user data after update
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) setUserData(userDoc.data());

    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="student-details-container">
      <h2>My Profile & Details</h2>
      <div className="details-layout">
        <div className="profile-view-section">
          <h3>Your Profile</h3>
          {userData ? (
            <div className="profile-card">
              <p><strong>Name:</strong> {userData.name || 'N/A'}</p>
              <p><strong>Email:</strong> {userData.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {userData.phone || 'N/A'}</p>
              <p><strong>Address:</strong> {userData.address || 'N/A'}</p>
              <p><strong>High School Marks:</strong> {userData.highSchoolMarks ? `${userData.highSchoolMarks}%` : 'N/A'}</p>
              <p><strong>Career Field:</strong> {userData.career || 'Not Selected'}</p>
              <p><strong>Preferred Location:</strong> {userData.location || 'Not Selected'}</p>
              <p><strong>Selected College:</strong> {userData.selectedCollegeName || 'Not Selected'}</p>
            </div>
          ) : <p>Could not load profile data.</p>}
        </div>

        <div className="details-form-section">
          <h3>Update Your Details</h3>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <form onSubmit={handleSubmit} className="details-form">
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" required />
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your Full Address" required />
            <input type="number" value={highSchoolMarks} onChange={(e) => setHighSchoolMarks(e.target.value)} placeholder="High School Marks (%)" step="0.1" required/>
            <button type="submit">Save Details</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentDetails;