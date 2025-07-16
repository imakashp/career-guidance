import { render, screen, fireEvent } from '@testing-library/react';
     import { BrowserRouter } from 'react-router-dom';
     import CollegeSelection from './CollegeSelection';

     // Mock Firebase auth and Firestore
     jest.mock('../firebase', () => ({
       auth: { currentUser: { uid: 'test-uid', email: 'test@example.com' } },
       db: {},
     }));

     test('renders college selection form', () => {
       render(
         <BrowserRouter>
           <CollegeSelection />
         </BrowserRouter>
       );
       expect(screen.getByText(/Select Your College/i)).toBeInTheDocument();
       expect(screen.getByLabelText(/Select College/i)).toBeInTheDocument();
       expect(screen.getByText(/Confirm Selection/i)).toBeInTheDocument();
     });

     test('displays error for no college selected', async () => {
       render(
         <BrowserRouter>
           <CollegeSelection />
         </BrowserRouter>
       );
       const submitButton = screen.getByText(/Confirm Selection/i);
       fireEvent.click(submitButton);
       expect(screen.getByText(/Please select a college/i)).toBeInTheDocument();
     });