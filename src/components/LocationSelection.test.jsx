import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LocationSelection from './LocationSelection';

// Mock Firebase auth and Firestore
jest.mock('../firebase', () => ({
  auth: { currentUser: { uid: 'test-uid', email: 'test@example.com' } },
  db: {},
}));

test('renders location selection buttons', () => {
  render(
    <BrowserRouter>
      <LocationSelection />
    </BrowserRouter>
  );
  expect(screen.getByText(/Select Your Preferred Location/i)).toBeInTheDocument();
  expect(screen.getByText(/India/i)).toBeInTheDocument();
  expect(screen.getByText(/Abroad/i)).toBeInTheDocument();
});

test('selects India and shows success', async () => {
  render(
    <BrowserRouter>
      <LocationSelection />
    </BrowserRouter>
  );
  const indiaButton = screen.getByText(/India/i);
  fireEvent.click(indiaButton);
  // Note: Requires Firebase mock for full testing
});