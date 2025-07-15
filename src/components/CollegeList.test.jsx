import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CollegeList from './CollegeList';

// Mock Firebase auth and Firestore
jest.mock('../firebase', () => ({
  auth: { currentUser: { uid: 'test-uid', email: 'test@example.com' } },
  db: {},
}));

test('renders college list page', () => {
  render(
    <BrowserRouter>
      <CollegeList />
    </BrowserRouter>
  );
  expect(screen.getByText(/College List/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Ranking/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Max Fees/i)).toBeInTheDocument();
});