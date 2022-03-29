import React from 'react'
import { useState, useEffect } from 'react'

import { db, auth } from '../firebase'

import {
    onSnapshot, collection, query, where

} from "firebase/firestore";

import { getFirestore } from 'firebase/firestore';


export default function Userhome() {




    const [user, setUser] = useState(localStorage.getItem('name'))
    const [token, setToken] = useState(localStorage.getItem('accessToken'))

    const [userList, setUserList] = useState([])

    const user1 = localStorage.getItem('uid');

    useEffect(() => {
        
        const userRef = collection(getFirestore(), "users")
        const q = query(userRef, where("uid", "!=", ["Jab2fK78s8RXNYx0c8UJfDEgRt12"]));
        // execute query
        const unsub = onSnapshot(q, (querySnapshot) => {
            let users = [];
            querySnapshot.forEach((doc) => {
                users.push(doc.data());
            });
            console.log(users)
            setUserList(users);
        });
        return () => unsub();
    }, [])
    return (
        <div>Userhome</div>
    )
}
