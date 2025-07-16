import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

function StudentDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="student-dashboard-container">
      <h2>Welcome, {userData?.name || 'Student'}!</h2>
      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate('/student-details')}>
          <h3>My Profile</h3>
          <p>Complete your profile to get better recommendations.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/career-selection')}>
          <h3>Career & Location</h3>
          <p>Select your preferred career and location.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/college-list')}>
          <h3>Find Colleges</h3>
          <p>Explore colleges based on your preferences.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/aptitude-test')}>
          <h3>Aptitude Test</h3>
          <p>Take the test to assess your skills.</p>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;