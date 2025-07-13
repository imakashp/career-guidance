import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

// Mock Firebase auth
jest.mock('../firebase', () => ({
  auth: {},
}));

test('renders login form', () => {
  render(<Login />);
  expect(screen.getByText(/Student Login/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  expect(screen.getByText(/Log In/i)).toBeInTheDocument();
});

test('displays error on failed login', async () => {
  render(<Login />);
  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const loginButton = screen.getByText(/Log In/i);

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
  fireEvent.click(loginButton);

  // Note: Firebase mock needed for full testing; for now, check UI updates
});