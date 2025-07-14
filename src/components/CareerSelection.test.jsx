import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CareerSelection from './CareerSelection';

// Mock Firebase auth and Firestore
jest.mock('../firebase', () => ({
  auth: { currentUser: { uid: 'test-uid', email: 'test@example.com' } },
  db: {},
}));

test('renders career selection form', () => {
  render(
    <BrowserRouter>
      <CareerSelection />
    </BrowserRouter>
  );
  expect(screen.getByText(/Select Your Career Field/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Career Field/i)).toBeInTheDocument();
  expect(screen.getByText(/Save Career/i)).toBeInTheDocument();
});

test('displays error for no career selected', async () => {
  render(
    <BrowserRouter>
      <CareerSelection />
    </BrowserRouter>
  );
  const saveButton = screen.getByText(/Save Career/i);
  fireEvent.click(saveButton);
  expect(screen.getByText(/Please select a career field/i)).toBeInTheDocument();
});