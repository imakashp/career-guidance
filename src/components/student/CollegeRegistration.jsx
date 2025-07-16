import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './CollegeRegistration.css';

function CollegeRegistration() {
  const [userData, setUserData] = useState(null);
  const [collegeData, setCollegeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const fetchedUserData = userDoc.data();
            setUserData(fetchedUserData);
            if (fetchedUserData.selectedCollege) {
              const collegeDoc = await getDoc(doc(db, 'colleges', fetchedUserData.selectedCollege));
              if (collegeDoc.exists()) {
                setCollegeData(collegeDoc.data());
              } else {
                setError('Selected college not found.');
              }
            } else {
              setError('No college selected. Please select a college first.');
              navigate('/college-list');
            }
          }
        } catch (err) {
          setError('Failed to load data.');
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleConfirmRegistration = async () => {
    setError(null);
    setSuccess(null);
    try {
      const user = auth.currentUser;
      const registrationId = `${user.uid}-${userData.selectedCollege}`;
      await setDoc(doc(db, 'registrations', registrationId), {
        userId: user.uid,
        userName: userData.name,
        userEmail: userData.email,
        collegeId: userData.selectedCollege,
        collegeName: collegeData.name,
        userDetails: { ...userData },
        registrationDate: new Date(),
        status: 'pending', // Admins can later update this status
      });
      setSuccess('Registration confirmed! The college will review your application.');
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error("Registration error:", err);
    }
  };

  if (loading) return <div>Loading Registration Details...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="college-registration-container">
      <h2>Confirm Your Registration</h2>
      {success && <p className="success">{success}</p>}
      {userData && collegeData && !success && (
        <div className="registration-summary">
          <h3>Review Your Details</h3>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Applying to:</strong> {collegeData.name}</p>
          <p><strong>Aptitude Score:</strong> {userData.aptitudeScores?.total || 'N/A'}</p>
          <p><strong>High School Marks:</strong> {userData.highSchoolMarks}%</p>
          <button onClick={handleConfirmRegistration}>Confirm & Submit Application</button>
        </div>
      )}
    </div>
  );
}

export default CollegeRegistration;