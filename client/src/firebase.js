import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "xxxxxxxxxxxxxxxxxx",
  databaseURL: "XXXXXXXXXXXXXXXXXXXX",
  projectId: "XXXXXXXXXXXXXXXXXXXXXXX",
  storageBucket: "XXXXXXXXXXXXXXXXX",
  messagingSenderId: "XXXXXXXXXXXXXXXXX",
  appId: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const provider = new firebase.auth.GoogleAuthProvider();

