// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import "firebase/compat/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpGse11P50s4a1cQkLuSdqE0yB162aRXU",
  authDomain: "accessmap-a1d55.firebaseapp.com",
  projectId: "accessmap-a1d55",
  storageBucket: "accessmap-a1d55.appspot.com",
  messagingSenderId: "734689583423",
  appId: "1:734689583423:web:906d4aacd3f99cb0d4b38a",
  measurementId: "G-C40TZ30YPJ"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app, "gs://accessmap-a1d55.appspot.com");
export const auth = getAuth(app)
export const db = getFirestore(app); 
export const googleProvider = new GoogleAuthProvider(); 
export default app; 