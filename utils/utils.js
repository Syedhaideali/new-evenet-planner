// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import { getAuth, 
        createUserWithEmailAndPassword,
        onAuthStateChanged,
        signInWithEmailAndPassword,
        signOut
      } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, 
         doc,
         setDoc,
         getDoc,
         getDocs, 
         collection,
         addDoc,
         updateDoc,
         arrayUnion,
         arrayRemove,
         query,
         where,
         deleteDoc,
      } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getStorage, 
         ref, 
         uploadBytes, 
         getDownloadURL 
      } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxNiVASsRv-X7OWUOyKE5xtS-XQCKBCRU",
  authDomain: "new-app-c4781.firebaseapp.com",
  projectId: "new-app-c4781",
  storageBucket: "new-app-c4781.appspot.com",
  messagingSenderId: "356942504381",
  appId: "1:356942504381:web:afc8dca81030084ef5f2d4"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export {
  auth,
  db,
  storage,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  doc,
  setDoc,
  ref,
  uploadBytes,
  getDownloadURL,
  getDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  deleteDoc,
};
