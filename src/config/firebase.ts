import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCUi0-8IFe0yMO2-pRId4fPCJ47obKsd84",
  authDomain: "prorent-f0df3.firebaseapp.com",
  projectId: "prorent-f0df3",
  storageBucket: "prorent-f0df3.firebasestorage.app",
  messagingSenderId: "988794350639",
  appId: "1:988794350639:web:30a8b26bfeb0895d796ada",
  measurementId: "G-2T8CB0WSN4",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
