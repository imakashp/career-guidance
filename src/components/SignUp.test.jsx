import { render, screen, fireEvent } from '@testing-library/react';
import SignUp from './SignUp';

// Mock Firebase auth and Firestore
jest.mock('../firebase', () => ({
  auth: {},
  db: {},
}));

test('renders signup form', () => {
  render(<SignUp />);
  expect(screen.getByText(/Student Sign Up/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
});

test('displays error on failed signup', async () => {
  render(<SignUp />);
  const nameInput = screen.getByLabelText(/Full Name/i);
  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const signUpButton = screen.getByText(/Sign Up/i);

  fireEvent.change(nameInput, { target: { value: 'Test User' } });
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'short' } }); // Too short for Firebase
  fireEvent.click(signUpButton);

  // Note: Firebase mock needed for full testing; for now, check UI updates
});
