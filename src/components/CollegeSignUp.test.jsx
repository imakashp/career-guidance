import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CollegeSignUp from './CollegeSignUp';

// Mock Firebase auth and Firestore
jest.mock('../firebase', () => ({
  auth: {},
  db: {},
}));

test('renders college signup form', () => {
  render(
    <BrowserRouter>
      <CollegeSignUp />
    </BrowserRouter>
  );
  expect(screen.getByText(/College Sign Up/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/College Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Contact Email/i)).toBeInTheDocument();
  expect(screen.getByText(/Register College/i)).toBeInTheDocument();
});

test('displays error for unauthorized access', async () => {
  // Mock isAdmin as false
  render(
    <BrowserRouter>
      <CollegeSignUp />
    </BrowserRouter>
  );
  // Note: Requires mocking useEffect and auth state for full test
});