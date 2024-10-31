// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACt7h6DXQNZZyW9jcrM521_dI_iXblDkE",
  authDomain: "sxcndhxnd.firebaseapp.com",
  projectId: "sxcndhxnd",
  storageBucket: "sxcndhxnd.appspot.com",
  messagingSenderId: "980640136292",
  appId: "1:980640136292:web:7b052b21ec34c532cf3371",
  measurementId: "G-PTZ1GHRTNS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);