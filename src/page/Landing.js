import React from 'react'
import SignIn from '../componets/Signin'
import { useState, useEffect, useContext } from 'react'



import Userhome from '../componets/Userhome'


import { getFirestore } from 'firebase/firestore';
import { userContext } from '../firebase';
export default function Landing() {

    // const [login, setLogin] = useState(localStorage.getItem('accessToken'))
    const login = useContext(userContext);
    useEffect(() => {

      console.log(login.islogin)
    }, [])



    return (!login.islogin ? <SignIn /> : <Userhome />)



}
