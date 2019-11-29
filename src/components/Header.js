import React, { useState } from 'react'
import firebase from '../services/firebase'
import { useDispatch, useSelector } from 'react-redux'

function Header () {
    
    const isLoggedIn = useSelector(state => state.isLoggedIn)
    const [userId, setUserId] = useState('')
    
    firebase.auth.onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
        //  setIsLoggedIn(true)
          setUserId(firebaseUser.email)
          console.log("firebaseUSer", firebaseUser);
        } else {
            setUserId('')
          console.log('not logged in');
        }
      });

    return (
        <div>
          <h1>Logged in: {isLoggedIn ? "true" : "false"}</h1>
          <h1>{userId ? `You are signed in as ${userId}` : 'Please Sign-In'}</h1>
        </div>
    )
}

export default Header