// Import the functions you need from the SDKs you need
// import firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwvcUiOjTLK9374GL62GxST0JFMBqhzEU",
  authDomain: "expensemanagement-8ebca.firebaseapp.com",
  projectId: "expensemanagement-8ebca",
  storageBucket: "expensemanagement-8ebca.appspot.com",
  messagingSenderId: "808312420372",
  appId: "1:808312420372:web:57acbb31f16695599fcf01",
  measurementId: "G-R33JGJQF2W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
// const analytics = getAnalytics(app);
