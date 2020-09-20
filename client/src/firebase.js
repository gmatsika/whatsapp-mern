import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAF2tvkrZq8BNHLVNENxOCTxJQal3H3c_8",
  authDomain: "whatsapp-mern-72bcd.firebaseapp.com",
  databaseURL: "https://whatsapp-mern-72bcd.firebaseio.com",
  projectId: "whatsapp-mern-72bcd",
  storageBucket: "whatsapp-mern-72bcd.appspot.com",
  messagingSenderId: "24703823379",
  appId: "1:24703823379:web:ae1e91ad42547ec5c359e6",
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const provider = new firebase.auth.GoogleAuthProvider();

