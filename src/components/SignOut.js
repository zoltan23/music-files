import React, { useState } from 'react'
import firebase from '../services/firebase'

const SignOut = (props) => {   
    console.log("props.isloggedin", props.isLoggedIn)
    const handleSignOut = (e) => {
        e.preventDefault()
        console.log("Sign out handled");
        firebase.auth.signOut()
            .then(() => console.log("Signed Out!!!"))
    }
    return(
        <div>
            <button className="btn btn-primary" onClick={handleSignOut}>Sign Out</button>
        </div>
    )
}

export default SignOut