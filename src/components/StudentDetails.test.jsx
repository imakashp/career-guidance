import { render, screen, fireEvent } from '@testing-library/react';
     import { BrowserRouter } from 'react-router-dom';
     import StudentDetails from './student/StudentDetails';

     // Mock Firebase auth and Firestore
     jest.mock('../firebase', () => ({
       auth: { currentUser: { uid: 'test-uid', email: 'test@example.com' } },
       db: {},
     }));

     test('renders student details form and profile view', () => {
       render(
         <BrowserRouter>
           <StudentDetails />
         </BrowserRouter>
       );
       expect(screen.getByText(/Student Details/i)).toBeInTheDocument();
       expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
       expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
       expect(screen.getByLabelText(/High School Marks/i)).toBeInTheDocument();
       expect(screen.getByText(/Save Details/i)).toBeInTheDocument();
       expect(screen.getByText(/Your Profile/i)).toBeInTheDocument();
     });

     test('displays error for missing fields', async () => {
       render(
         <BrowserRouter>
           <StudentDetails />
         </BrowserRouter>
       );
       const saveButton = screen.getByText(/Save Details/i);
       fireEvent.click(saveButton);
       expect(screen.getByText(/Please fill in all fields/i)).toBeInTheDocument();
     });