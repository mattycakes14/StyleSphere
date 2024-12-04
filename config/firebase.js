// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage"; //import AsyncStorage not ReactNativeAsyncStorage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC36Gvy6qpTrWiq1W14OKB5FdNUBOW2ryA",
  authDomain: "rebuild-style-sphere.firebaseapp.com",
  projectId: "rebuild-style-sphere",
  storageBucket: "rebuild-style-sphere.appspot.com", //CORRECT STORAGEBUCKET URL
  messagingSenderId: "850122440832",
  appId: "1:850122440832:web:485aea473959bdce9be665",
  measurementId: "G-ZVEQ6JRCQJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage), //correct implementation
});

export { app, auth, db, storage };
