import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebase';
import './CollegeDetails.css';

function CollegeDetails() {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const collegeDoc = await getDoc(doc(db, 'colleges', collegeId));
        if (collegeDoc.exists()) {
          setCollege({ id: collegeDoc.id, ...collegeDoc.data() });
        } else {
          console.error("No such college!");
        }
      } catch (error) {
        console.error("Error fetching college:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollege();
  }, [collegeId]);
  
  const handleSelectCollege = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login to select a college.");
      navigate('/login');
      return;
    }
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        selectedCollege: college.id,
        selectedCollegeName: college.name,
      });
      alert(`${college.name} has been selected!`);
      navigate('/college-registration');
    } catch (error) {
      console.error("Error selecting college: ", error);
      alert("Failed to select college.");
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!college) {
    return <div>College not found.</div>;
  }

  return (
    <div className="college-details-container">
      <div className="college-header">
        <h1>{college.name}</h1>
        <p>{college.location}</p>
      </div>
      <div className="details-grid">
        <div className="detail-card">
          <h4>Ranking</h4>
          <p>{college.ranking || 'N/A'}</p>
        </div>
        <div className="detail-card">
          <h4>Courses</h4>
          <p>{college.courses?.join(', ') || 'N/A'}</p>
        </div>
        <div className="detail-card">
          <h4>Tuition Fees</h4>
          <p>${college.tuitionFees?.toLocaleString() || 'N/A'} / year</p>
        </div>
        <div className="detail-card">
          <h4>Hostel Fees</h4>
          <p>${college.hostelFees?.toLocaleString() || 'N/A'} / year</p>
        </div>
        <div className="detail-card">
          <h4>Average Package</h4>
          <p>{college.placementStats?.averagePackage || 'N/A'} LPA</p>
        </div>
      </div>
       <button className="select-college-btn" onClick={handleSelectCollege}>
        Select this College & Register
      </button>
    </div>
  );
}

export default CollegeDetails;