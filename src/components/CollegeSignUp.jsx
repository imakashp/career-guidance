import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './CollegeSignUp.css';

function CollegeSignUp() {
  const [collegeName, setCollegeName] = useState('');
  const [location, setLocation] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [ranking, setRanking] = useState('');
  const [fees, setFees] = useState('');
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log('No user logged in, redirecting to login');
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleCollegeSignUp = async (e) => {
    e.preventDefault();
    try {
      const collegeId = `${collegeName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
      await setDoc(doc(db, 'colleges', collegeId), {
        name: collegeName,
        location,
        contactEmail,
        ranking: parseInt(ranking) || null,
        fees: parseFloat(fees) || null,
        courses: courses.length > 0 ? courses : null,
        createdAt: new Date(),
      });
      console.log(`College registered: ${collegeName} (ID: ${collegeId})`);
      setSuccess('College registered successfully!');
      setError(null);
      setCollegeName('');
      setLocation('');
      setContactEmail('');
      setRanking('');
      setFees('');
      setCourses([]);
    } catch (err) {
      setError(err.message);
      console.error(`College signup failed: ${err.message}`);
      setSuccess(null);
    }
  };

  const handleCourseChange = (e) => {
    const value = e.target.value;
    setCourses((prev) =>
      prev.includes(value)
        ? prev.filter((course) => course !== value)
        : [...prev, value]
    );
  };

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
        <div>
          <label>Ranking:</label>
          <input
            type="number"
            value={ranking}
            onChange={(e) => setRanking(e.target.value)}
            placeholder="e.g., 50"
          />
        </div>
        <div>
          <label>Fees (in lakhs):</label>
          <input
            type="number"
            value={fees}
            onChange={(e) => setFees(e.target.value)}
            placeholder="e.g., 5"
          />
        </div>
        <div>
          <label>Courses Offered:</label>
          <label>
            <input
              type="checkbox"
              value="Engineering"
              checked={courses.includes('Engineering')}
              onChange={handleCourseChange}
            />
            Engineering
          </label>
          <label>
            <input
              type="checkbox"
              value="Management"
              checked={courses.includes('Management')}
              onChange={handleCourseChange}
            />
            Management
          </label>
          <label>
            <input
              type="checkbox"
              value="Medical"
              checked={courses.includes('Medical')}
              onChange={handleCourseChange}
            />
            Medical
          </label>
          <label>
            <input
              type="checkbox"
              value="Arts"
              checked={courses.includes('Arts')}
              onChange={handleCourseChange}
            />
            Arts
          </label>
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit">Register College</button>
      </form>
    </div>
  );
}

export default CollegeSignUp;