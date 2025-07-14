import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CollegeSignUp from './components/CollegeSignUp';
import CareerSelection from './components/CareerSelection';
import LocationSelection from './components/LocationSelection';

function App() {
  console.log('App component rendered');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/college-signup" element={<CollegeSignUp />} />
        <Route path="/career-selection" element={<CareerSelection />} />
        <Route path="/location-selection" element={<LocationSelection />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;