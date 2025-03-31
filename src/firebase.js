import {initializeApp} from 'firebase/app'

import {getAuth} from 'firebase/auth'

import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDrvpxfhq3fIk8ABS2oB-O2BBw09iop4RQ",
    authDomain: "cinemaelk-4b6fe.firebaseapp.com",
    projectId: "cinemaelk-4b6fe",
    storageBucket: "cinemaelk-4b6fe.firebasestorage.app",
    messagingSenderId: "255453873720",
    appId: "1:255453873720:web:9c0afd32ce8f375b7ac8cd"
  };
  
const app=initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const db = getFirestore(app);

