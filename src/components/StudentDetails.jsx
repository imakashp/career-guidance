import { useState, useEffect } from 'react';
     import { doc, getDoc, updateDoc } from 'firebase/firestore';
     import { auth, db } from '../firebase';
     import { onAuthStateChanged } from 'firebase/auth';
     import { useNavigate } from 'react-router-dom';
     import './StudentDetails.css';

     function StudentDetails() {
       const [phone, setPhone] = useState('');
       const [address, setAddress] = useState('');
       const [highSchoolMarks, setHighSchoolMarks] = useState('');
       const [userData, setUserData] = useState(null);
       const [error, setError] = useState(null);
       const [success, setSuccess] = useState(null);
       const navigate = useNavigate();

       // Check if user is logged in and fetch user data
       useEffect(() => {
         const unsubscribe = onAuthStateChanged(auth, async (user) => {
           if (user) {
             console.log(`User ${user.email} accessed Student Details Page`);
             try {
               const userDoc = await getDoc(doc(db, 'users', user.uid));
               if (userDoc.exists()) {
                 const data = userDoc.data();
                 setUserData(data);
                 setPhone(data.phone || '');
                 setAddress(data.address || '');
                 setHighSchoolMarks(data.highSchoolMarks || '');
               } else {
                 setError('User profile not found.');
                 console.error('User document not found');
               }
             } catch (err) {
               setError('Failed to load user data.');
               console.error(`Failed to fetch user data: ${err.message}`);
             }
           } else {
             console.log('No user logged in, redirecting to login');
             navigate('/login');
           }
         });
         return () => unsubscribe();
       }, [navigate]);

       const handleSubmit = async (e) => {
         e.preventDefault();
         if (!phone || !address || !highSchoolMarks) {
           setError('Please fill in all fields.');
           console.error('Form submission failed: Missing fields');
           return;
         }

         try {
           const user = auth.currentUser;
           await updateDoc(doc(db, 'users', user.uid), {
             phone,
             address,
             highSchoolMarks: parseFloat(highSchoolMarks),
             updatedAt: new Date(),
           });
           console.log(`Student details updated for user ${user.email}`);
           setSuccess('Details saved successfully!');
           setError(null);
           // Refresh user data
           const userDoc = await getDoc(doc(db, 'users', user.uid));
           setUserData(userDoc.data());
         } catch (err) {
           setError(err.message);
           console.error(`Failed to update student details: ${err.message}`);
           setSuccess(null);
         }
       };

       return (
         <div className="student-details-container">
           <h2>Student Details</h2>
           {error && <p className="error">{error}</p>}
           {success && <p className="success">{success}</p>}
           <div className="details-form">
             <h3>Update Your Details</h3>
             <form onSubmit={handleSubmit}>
               <div>
                 <label>Phone Number:</label>
                 <input
                   type="tel"
                   value={phone}
                   onChange={(e) => setPhone(e.target.value)}
                   placeholder="e.g., +91 1234567890"
                   required
                 />
               </div>
               <div>
                 <label>Address:</label>
                 <textarea
                   value={address}
                   onChange={(e) => setAddress(e.target.value)}
                   placeholder="Enter your full address"
                   required
                 />
               </div>
               <div>
                 <label>High School Marks (%):</label>
                 <input
                   type="number"
                   value={highSchoolMarks}
                   onChange={(e) => setHighSchoolMarks(e.target.value)}
                   placeholder="e.g., 85.5"
                   step="0.1"
                   required
                 />
               </div>
               <button type="submit">Save Details</button>
             </form>
           </div>
           {userData && (
             <div className="profile-view">
               <h3>Your Profile</h3>
               <p><strong>Name:</strong> {userData.name || 'N/A'}</p>
               <p><strong>Email:</strong> {userData.email || 'N/A'}</p>
               <p><strong>Phone:</strong> {userData.phone || 'N/A'}</p>
               <p><strong>Address:</strong> {userData.address || 'N/A'}</p>
               <p><strong>High School Marks:</strong> {userData.highSchoolMarks ? `${userData.highSchoolMarks}%` : 'N/A'}</p>
               <p><strong>Career Field:</strong> {userData.career || 'N/A'}</p>
               <p><strong>Location:</strong> {userData.location || 'N/A'}</p>
               <p><strong>Selected College:</strong> {userData.selectedCollege || 'N/A'}</p>
             </div>
           )}
         </div>
       );
     }

     export default StudentDetails;                 