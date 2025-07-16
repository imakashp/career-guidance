import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import '../../styles/ManageColleges.css';

function ManageColleges() {
  const [colleges, setColleges] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCollege, setCurrentCollege] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [ranking, setRanking] = useState('');
  // ... add other fields as state variables

  // Fetch colleges on component mount
  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    const querySnapshot = await getDocs(collection(db, 'colleges'));
    const collegeList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setColleges(collegeList);
  };

  const handleEdit = (college) => {
    setIsEditing(true);
    setCurrentCollege(college);
    setName(college.name);
    setLocation(college.location);
    setRanking(college.ranking || '');
    // ... set other form fields from college data
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this college?")) {
      try {
        await deleteDoc(doc(db, 'colleges', id));
        alert('College deleted successfully!');
        fetchColleges(); // Refresh the list
      } catch (error) {
        console.error("Error deleting college: ", error);
        alert("Failed to delete college.");
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const collegeData = {
      name,
      location,
      ranking: Number(ranking),
      // ... other fields
    };

    if (isEditing) {
      // Update existing college
      try {
        await updateDoc(doc(db, 'colleges', currentCollege.id), collegeData);
        alert('College updated successfully!');
      } catch (error) {
        console.error("Error updating college: ", error);
        alert("Failed to update college.");
      }
    } else {
      // Add new college
      try {
        await addDoc(collection(db, 'colleges'), { ...collegeData, createdAt: new Date() });
        alert('College added successfully!');
      } catch (error) {
        console.error("Error adding college: ", error);
        alert("Failed to add college.");
      }
    }

    resetForm();
    fetchColleges();
  };
  
  const resetForm = () => {
    setIsEditing(false);
    setCurrentCollege(null);
    setName('');
    setLocation('');
    setRanking('');
    // ... reset other fields
  };

  return (
    <div className="manage-colleges-container">
      <div className="college-form-section">
        <h2>{isEditing ? 'Edit College' : 'Add New College'}</h2>
        <form onSubmit={handleFormSubmit}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="College Name" required />
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" required />
          <input type="number" value={ranking} onChange={(e) => setRanking(e.target.value)} placeholder="Ranking" />
          // ... inside the form
          <input type="number" value={minAptitudeScore} onChange={(e) => setMinAptitudeScore(e.target.value)} placeholder="Min Aptitude Score" />
          {/* Add other input fields here */}
          <button type="submit">{isEditing ? 'Update College' : 'Add College'}</button>
          {isEditing && <button type="button" onClick={resetForm} className="cancel-btn">Cancel Edit</button>}
        </form>
      </div>

      <div className="existing-colleges-list">
        <h2>Existing Colleges</h2>
        <ul>
          {colleges.map(college => (
            <li key={college.id}>
              <span>{college.name} - {college.location}</span>
              <div className="college-actions">
                <button onClick={() => handleEdit(college)}>Edit</button>
                <button onClick={() => handleDelete(college.id)} className="delete-btn">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ManageColleges;