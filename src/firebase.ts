import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyC_ySz4WBsybrJCDuAD3wkAtmlpu7exUUs",

    authDomain: "cis371-term-project-85d91.firebaseapp.com",
  
    projectId: "cis371-term-project-85d91",
  
    storageBucket: "cis371-term-project-85d91.firebasestorage.app",
  
    messagingSenderId: "439534148880",
  
    appId: "1:439534148880:web:55c23e11154a66bc121995" 

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
