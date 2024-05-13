import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAsX0XIWRZABTRSp-aMSOQe0NoPdc7Z10c",
  authDomain: "chatbox-fe596.firebaseapp.com",
  projectId: "chatbox-fe596",
  storageBucket: "chatbox-fe596.appspot.com",
  messagingSenderId: "654747137311",
  appId: "1:654747137311:web:65654bb4f0762228e2ec2a",
  measurementId: "G-QQVS283NK8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
export const storage = getStorage();
