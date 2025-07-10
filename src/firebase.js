// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZELmb4vgXOTVwV_Nj9ZGTPseWoW_dg88",
  authDomain: "careerguidance-b68fb.firebaseapp.com",
  databaseURL: "https://careerguidance-b68fb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "careerguidance-b68fb",
  storageBucket: "careerguidance-b68fb.firebasestorage.app",
  messagingSenderId: "169340937702",
  appId: "1:169340937702:web:19ea68b2801f6173b0e227",
  measurementId: "G-NWTFY99GZY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);