import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

import { setDoc, doc } from 'firebase/firestore';

import { query, where, addDoc } from 'firebase/firestore';

import React from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyCqa6ojylMBPocEp5EaJFNfLQLIQVCH1YA",
  authDomain: "react-chat-c8f72.firebaseapp.com",
  projectId: "react-chat-c8f72",
  storageBucket: "react-chat-c8f72.appspot.com",
  messagingSenderId: "89862418257",
  appId: "1:89862418257:web:499cdeb82d7c932bfcad70",
  measurementId: "G-LTC67F9PX0"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth();

const GoogleProvider = new GoogleAuthProvider()


// const signInWithGoogle = () => {
//   signInWithPopup(auth, GoogleProvider).then((respone) => {
//     console.log(respone)
//     const name = respone.user.displayName;
//     const email = respone.user.email;
//     const profilePic = respone.user.photoURL;

//     localStorage.setItem("name", name)
//     localStorage.setItem("email", email)
//     localStorage.setItem("photo", profilePic)
//     localStorage.setItem("uid", respone.user.uid)
//     localStorage.setItem("accessToken", respone.user.accessToken)

//   }).catch((err) => {
//     console.log(err)
//   })
// }

const signInWithGoogle = async () => {

  try {
    const res = await signInWithPopup(auth, GoogleProvider);
    console.log(res)
    const user = res.user;
    const q = query(collection(getFirestore(), "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);


    localStorage.setItem("name", user.displayName)
    localStorage.setItem("email", user.email)
    localStorage.setItem("photo", user.profilePic)
    localStorage.setItem("uid", user.uid)
    localStorage.setItem("accessToken", user.accessToken)

    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const userContext = React.createContext();

var islogin = false






export { auth, db, signInWithGoogle, userContext, islogin }