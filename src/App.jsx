import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import AdminLogin from './components/auth/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageColleges from './components/admin/ManageColleges';
import StudentDashboard from './components/student/StudentDashboard';
import CareerSelection from './components/student/CareerSelection';
import LocationSelection from './components/student/LocationSelection';
import CollegeList from './components/student/CollegeList';
import CollegeRegistration from './components/student/CollegeRegistration';
import StudentDetails from './components/student/StudentDetails';
import Navbar from './components/common/Navbar';
import StudentDashboard from './components/student/StudentDashboard';
import AptitudeTest from './components/student/AptitudeTest';
import CollegeDetails from './components/student/CollegeDetails';
import Navbar from './components/common/Navbar';

function App() {
  console.log('App component rendered');
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<StudentDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-colleges" element={<ManageColleges />} />
        <Route path="/career-selection" element={<CareerSelection />} />
        <Route path="/location-selection" element={<LocationSelection />} />
        <Route path="/college-list" element={<CollegeList />} />
        <Route path="/college-registration" element={<CollegeRegistration />} />
        <Route path="/student-details" element={<StudentDetails />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/aptitude-test" element={<AptitudeTest />} />
        <Route path="/college/:collegeId" element={<CollegeDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;