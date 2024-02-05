// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtyxGoW72u3d24vB35m0dbmZGRSj7DGps",
  authDomain: "classificasanremo.firebaseapp.com",
  projectId: "classificasanremo",
  storageBucket: "classificasanremo.appspot.com",
  messagingSenderId: "937245435591",
  appId: "1:937245435591:web:d601f445144906a71800e2",
  measurementId: "G-GF78Y0H82W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
