import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './CollegeList.css';

function CollegeList() {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [userCareer, setUserCareer] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [rankingFilter, setRankingFilter] = useState('');
  const [feeFilter, setFeeFilter] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in and fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(`User ${user.email} accessed College List Page`);
        // Fetch user data for filters
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserCareer(userData.career || '');
            setUserLocation(userData.location || '');
          }
        } catch (err) {
          console.error(`Failed to fetch user data: ${err.message}`);
          setError('Failed to load user preferences.');
        }
      } else {
        console.log('No user logged in, redirecting to login');
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch colleges from Firestore
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'colleges'));
        const collegeList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(`Fetched ${collegeList.length} colleges from Firestore`);
        setColleges(collegeList);
        setFilteredColleges(collegeList);
      } catch (err) {
        console.error(`Failed to fetch colleges: ${err.message}`);
        setError('Failed to load colleges.');
      }
    };
    fetchColleges();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = colleges;
    if (userCareer) {
      filtered = filtered.filter((college) =>
        college.courses?.includes(userCareer)
      );
    }
    if (userLocation) {
      filtered = filtered.filter((college) => college.location === userLocation);
    }
    if (rankingFilter) {
      filtered = filtered.filter(
        (college) => college.ranking <= parseInt(rankingFilter)
      );
    }
    if (feeFilter) {
      filtered = filtered.filter(
        (college) => college.fees <= parseInt(feeFilter)
      );
    }
    setFilteredColleges(filtered);
    console.log(`Applied filters: ${filtered.length} colleges displayed`);
  }, [colleges, userCareer, userLocation, rankingFilter, feeFilter]);

  return (
    <div className="college-list-container">
      <h2>College List</h2>
      {error && <p className="error">{error}</p>}
      <div className="filters">
        <div>
          <label>Ranking (max):</label>
          <input
            type="number"
            value={rankingFilter}
            onChange={(e) => setRankingFilter(e.target.value)}
            placeholder="e.g., 100"
          />
        </div>
        <div>
          <label>Max Fees (in lakhs):</label>
          <input
            type="number"
            value={feeFilter}
            onChange={(e) => setFeeFilter(e.target.value)}
            placeholder="e.g., 10"
          />
        </div>
      </div>
      {filteredColleges.length === 0 ? (
        <p>No colleges found matching your criteria.</p>
      ) : (
        <div className="college-grid">
          {filteredColleges.map((college) => (
            <div key={college.id} className="college-card">
              <h3>{college.name}</h3>
              <p>Location: {college.location}</p>
              <p>Contact: {college.contactEmail}</p>
              <p>Ranking: {college.ranking || 'N/A'}</p>
              <p>Fees: {college.fees ? `${college.fees} lakhs` : 'N/A'}</p>
              <p>Courses: {college.courses?.join(', ') || 'N/A'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CollegeList;