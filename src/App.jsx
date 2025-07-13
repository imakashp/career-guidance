import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CollegeSignUp from './components/CollegeSignUp';

function App() {
  console.log('App component rendered');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/college-signup" element={<CollegeSignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;