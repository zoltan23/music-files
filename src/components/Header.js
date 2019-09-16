import React, { useState } from 'react'
import firebase from '../services/firebase'

function Header () {
    
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userId, setUserId] = useState('')
    
    firebase.auth.onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
          setIsLoggedIn(true)
          setUserId(firebaseUser.email)
          console.log("firebaseUSer", firebaseUser);
        } else {
            setUserId('')
          console.log('not logged in');
        }
      });

    return (
        <h1>{userId ? `You are signed in as ${userId}` : 'Please Sign-In'}</h1>
    )
}

export default Header