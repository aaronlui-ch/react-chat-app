import React from 'react'
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import {  db } from '../firebase';
import { userContext } from '../firebase';
import { Firestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect,useContext } from 'react';
import { collection } from 'firebase/firestore';
export default function Signout() {
    const auth = getAuth();
    const { islogin, setIslogin } = useContext(userContext);

    const handleSignout = async () => {


        onAuthStateChanged(auth, (user) => {
            if (user) {


            } else {
                // User is signed out
                // ...
            }
        });

        try {
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                isOnline: false,
            });




        } catch (err) {
            console.error(err);
            alert(err.message);
        }

        try {
            await signOut(auth);
            localStorage.clear();
            setIslogin(prev => false)


        } catch (err) {
            console.error(err);
            alert(err.message);
        }



    };

    useEffect(() => {

  
    }, [])
    



    return (
        <button onClick={handleSignout}>Sign out</button>)
}
