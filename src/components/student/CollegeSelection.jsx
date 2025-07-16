import { useState, useEffect } from 'react';
     import { collection, getDocs } from 'firebase/firestore';
     import { doc, getDoc, updateDoc } from 'firebase/firestore';
     import { auth, db } from '../../firebase/firebase';
     import { onAuthStateChanged } from 'firebase/auth';
     import { useNavigate } from 'react-router-dom';
     import '../../styles/CollegeSelection.css';

     function CollegeSelection() {
       const [colleges, setColleges] = useState([]);
       const [selectedCollege, setSelectedCollege] = useState('');
       const [userCareer, setUserCareer] = useState('');
       const [userLocation, setUserLocation] = useState('');
       const [error, setError] = useState(null);
       const [success, setSuccess] = useState(null);
       const navigate = useNavigate();

       // Check if user is logged in and fetch user data
       useEffect(() => {
         const unsubscribe = onAuthStateChanged(auth, async (user) => {
           if (user) {
             console.log(`User ${user.email} accessed College Selection Page`);
             try {
               const userDoc = await getDoc(doc(db, 'users', user.uid));
               if (userDoc.exists()) {
                 const userData = userDoc.data();
                 setUserCareer(userData.career || '');
                 setUserLocation(userData.location || '');
               } else {
                 setError('User preferences not found. Please complete your profile.');
                 console.error('User document not found');
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
             const collegeList = querySnapshot.docs
               .map((doc) => ({
                 id: doc.id,
                 ...doc.data(),
               }))
               .filter(
                 (college) =>
                   (!userCareer || college.courses?.includes(userCareer)) &&
                   (!userLocation || college.location === userLocation)
               );
             console.log(`Fetched ${collegeList.length} colleges from Firestore`);
             setColleges(collegeList);
           } catch (err) {
             console.error(`Failed to fetch colleges: ${err.message}`);
             setError('Failed to load colleges.');
           }
         };
         if (userCareer || userLocation) {
           fetchColleges();
         }
       }, [userCareer, userLocation]);

       const handleCollegeSelection = async (e) => {
         e.preventDefault();
         if (!selectedCollege) {
           setError('Please select a college.');
           console.error('College selection failed: No college selected');
           return;
         }

         try {
           const user = auth.currentUser;
           await updateDoc(doc(db, 'users', user.uid), {
             selectedCollege,
             updatedAt: new Date(),
           });
           console.log(`College selected: ${selectedCollege} for user ${user.email}`);
           setSuccess('College selected successfully!');
           setError(null);
           setSelectedCollege('');
         } catch (err) {
           setError(err.message);
           console.error(`College selection failed: ${err.message}`);
           setSuccess(null);
         }
       };

       return (
         <div className="college-selection-container">
           <h2>Select Your College</h2>
           {error && <p className="error">{error}</p>}
           {success && <p className="success">{success}</p>}
           {colleges.length === 0 ? (
             <p>No colleges available for your preferences.</p>
           ) : (
             <form onSubmit={handleCollegeSelection}>
               <div>
                 <label>Select College:</label>
                 <select
                   value={selectedCollege}
                   onChange={(e) => setSelectedCollege(e.target.value)}
                   required
                 >
                   <option value="">Choose a college</option>
                   {colleges.map((college) => (
                     <option key={college.id} value={college.id}>
                       {college.name} ({college.location})
                     </option>
                   ))}
                 </select>
               </div>
               <button type="submit">Confirm Selection</button>
             </form>
           )}
         </div>
       );
     }

     export default CollegeSelection;