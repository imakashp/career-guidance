import { render, screen, fireEvent } from '@testing-library/react';
     import { BrowserRouter } from 'react-router-dom';
     import CollegeRegistration from './CollegeRegistration';

     // Mock Firebase auth and Firestore
     jest.mock('../firebase', () => ({
       auth: { currentUser: { uid: 'test-uid', email: 'test@example.com' } },
       db: {},
     }));

     test('renders college registration form', () => {
       render(
         <BrowserRouter>
           <CollegeRegistration />
         </BrowserRouter>
       );
       expect(screen.getByText(/College Registration/i)).toBeInTheDocument();
       expect(screen.getByLabelText(/Entrance Exam Score/i)).toBeInTheDocument();
       expect(screen.getByText(/Submit Registration/i)).toBeInTheDocument();
     });

     test('displays error for missing exam score', async () => {
       render(
         <BrowserRouter>
           <CollegeRegistration />
         </BrowserRouter>
       );
       const submitButton = screen.getByText(/Submit Registration/i);
       fireEvent.click(submitButton);
       expect(screen.getByText(/Please enter your exam score/i)).toBeInTheDocument();
     });