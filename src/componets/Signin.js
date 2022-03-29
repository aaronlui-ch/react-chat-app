import React from 'react'
import firebase from 'firebase/compat/app';
import { auth } from '../firebase';
import { signInWithGoogle } from '../firebase';
import { userContext } from '../firebase';
import { useContext } from 'react';
import { async } from '@firebase/util';
function SignIn() {


    const { islogin, setIslogin } = useContext(userContext);

    const handleSignin = async () => {
        await signInWithGoogle()
        if (localStorage.getItem('accessToken')) {
            setIslogin(prev => true)

        }

    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}>
            <button style={{ padding: '30px', fontSize: '20px', borderRadius: '0', fontWeight: '600' }} onClick={handleSignin}>Sign In With Google</button>
        </div>
    )
}

export default SignIn
