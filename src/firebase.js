import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyABO6yob_NV2ljSfunjGsvpu8RFFNncEyI",
  authDomain: "lugar-store-99182.firebaseapp.com",
  projectId: "lugar-store-99182",
  storageBucket: "lugar-store-99182.firebasestorage.app",
  messagingSenderId: "336487255017",
  appId: "1:336487255017:web:3bba0f07984c5bc4a19978",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
