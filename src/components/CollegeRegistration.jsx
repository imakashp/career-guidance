import { useState, useEffect } from 'react';
     import { doc, getDoc, setDoc } from 'firebase/firestore';
     import { auth, db } from '../firebase';
     import { onAuthStateChanged } from 'firebase/auth';
     import { useNavigate } from 'react-router-dom';
     import './CollegeRegistration.css';

     function CollegeRegistration() {
       const [name, setName] = useState('');
       const [email, setEmail] = useState('');
       const [examScore, setExamScore] = useState('');
       const [selectedCollege, setSelectedCollege] = useState('');
       const [collegeName, setCollegeName] = useState('');
       const [error, setError] = useState(null);
       const [success, setSuccess] = useState(null);
       const navigate = useNavigate();

       // Check if user is logged in and fetch user data
       useEffect(() => {
         const unsubscribe = onAuthStateChanged(auth, async (user) => {
           if (user) {
             console.log(`User ${user.email} accessed College Registration Page`);
             try {
               const userDoc = await getDoc(doc(db, 'users', user.uid));
               if (userDoc.exists()) {
                 const userData = userDoc.data();
                 setName(userData.name || '');
                 setEmail(user.email);
                 setSelectedCollege(userData.selectedCollege || '');
                 // Fetch college name for display
                 if (userData.selectedCollege) {
                   const collegeDoc = await getDoc(doc(db, 'colleges', userData.selectedCollege));
                   if (collegeDoc.exists()) {
                     setCollegeName(collegeDoc.data().name);
                   } else {
                     setError('Selected college not found.');
                     console.error('Selected college not found in Firestore');
                   }
                 } else {
                   setError('Please select a college first.');
                   console.error('No college selected by user');
                   navigate('/college-selection');
                 }
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

       const handleRegistration = async (e) => {
         e.preventDefault();
         if (!examScore) {
           setError('Please enter your exam score.');
           console.error('Registration failed: Exam score missing');
           return;
         }

         try {
           const user = auth.currentUser;
           const registrationId = `${user.uid}-${selectedCollege}-${Date.now()}`;
           await setDoc(doc(db, 'registrations', registrationId), {
             userId: user.uid,
             collegeId: selectedCollege,
             collegeName,
             name,
             email,
             examScore: parseFloat(examScore),
             createdAt: new Date(),
           });
           console.log(`Registration submitted for college: ${collegeName} by user ${email}`);
           setSuccess('Registration submitted successfully!');
           setError(null);
           setExamScore('');
         } catch (err) {
           setError(err.message);
           console.error(`Registration failed: ${err.message}`);
           setSuccess(null);
         }
       };

       return (
         <div className="college-registration-container">
           <h2>College Registration</h2>
           {error && <p className="error">{error}</p>}
           {success && <p className="success">{success}</p>}
           {selectedCollege ? (
             <form onSubmit={handleRegistration}>
               <div>
                 <label>Selected College:</label>
                 <input type="text" value={collegeName} disabled />
               </div>
               <div>
                 <label>Full Name:</label>
                 <input type="text" value={name} disabled />
               </div>
               <div>
                 <label>Email:</label>
                 <input type="email" value={email} disabled />
               </div>
               <div>
                 <label>Entrance Exam Score:</label>
                 <input
                   type="number"
                   value={examScore}
                   onChange={(e) => setExamScore(e.target.value)}
                   placeholder="e.g., 85.5"
                   required
                 />
               </div>
               <button type="submit">Submit Registration</button>
             </form>
           ) : (
             <p>Please select a college first at <a href="/college-selection">College Selection</a>.</p>
           )}
         </div>
       );
     }

     export default CollegeRegistration;