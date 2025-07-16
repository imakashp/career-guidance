import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import './CollegeList.css';

function CollegeList() {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Filters
  const [rankingFilter, setRankingFilter] = useState('');
  const [feeFilter, setFeeFilter] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
        fetchColleges();
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);
  
  const fetchColleges = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, 'colleges'));
    const collegeList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setColleges(collegeList);
    setLoading(false);
  };

  useEffect(() => {
    let filtered = colleges;
    
    // Filter by user's career and location preferences
    if (userData?.career) {
      filtered = filtered.filter(college => college.courses?.includes(userData.career));
    }
    if (userData?.location) {
        filtered = filtered.filter(college => college.location === userData.location);
    }

    // Filter by ranking and fees
    if (rankingFilter) {
      filtered = filtered.filter(college => college.ranking && college.ranking <= parseInt(rankingFilter));
    }
    if (feeFilter) {
      filtered = filtered.filter(college => college.tuitionFees && college.tuitionFees <= parseInt(feeFilter));
    }

    // Filter by Aptitude Score
    if (userData?.aptitudeScores?.total) {
        filtered = filtered.filter(college => !college.minAptitudeScore || userData.aptitudeScores.total >= college.minAptitudeScore);
    }

    setFilteredColleges(filtered);
  }, [colleges, userData, rankingFilter, feeFilter]);

  if (loading) return <div>Loading colleges...</div>;

  return (
    <div className="college-list-container">
      <h2>Recommended Colleges</h2>
      <div className="user-info-bar">
        <p>Your Aptitude Score: <strong>{userData?.aptitudeScores?.total || 'Not Taken'}</strong></p>
        <p>Your Career Choice: <strong>{userData?.career || 'Not Selected'}</strong></p>
      </div>
      <div className="filters">
        <input type="number" value={rankingFilter} onChange={(e) => setRankingFilter(e.target.value)} placeholder="Max Ranking" />
        <input type="number" value={feeFilter} onChange={(e) => setFeeFilter(e.target.value)} placeholder="Max Tuition Fees" />
      </div>
      <div className="college-grid">
        {filteredColleges.length > 0 ? (
          filteredColleges.map((college) => (
            <div key={college.id} className="college-card">
              <h3>{college.name}</h3>
              <p><strong>Location:</strong> {college.location}</p>
              <p><strong>Ranking:</strong> {college.ranking || 'N/A'}</p>
              <p><strong>Min Aptitude Score:</strong> {college.minAptitudeScore || 'None'}</p>
              <Link to={`/college/${college.id}`} className="details-link">View Details</Link>
            </div>
          ))
        ) : (
          <p>No colleges found matching your criteria. Try adjusting your filters or completing your profile.</p>
        )}
      </div>
    </div>
  );
}

export default CollegeList;