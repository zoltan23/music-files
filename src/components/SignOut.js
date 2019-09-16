import React from 'react'
import firebase from '../services/firebase'
import { auth } from 'firebase'


const SignOut = () => {
    var user = firebase.auth.currentUser;
    
    if (user) {
        console.log("user", user.email)
    // User is signed in.
    } else {
    // No user is signed in.
    }

   
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