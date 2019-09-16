import React, { useState } from 'react'
import firebase from '../services/firebase'

const SignOut = () => {   

    const handleSignOut = (e) => {
        e.preventDefault()
        console.log("Sign out handled");
        firebase.auth.signOut()
            .then(() => console.log("Signed Out!!!"))
    }
    return(
        <div>
            <div>
              
            </div>
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    )
}

export default SignOut