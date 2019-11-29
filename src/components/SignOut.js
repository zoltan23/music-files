import React from 'react'
import firebase from '../services/firebase'
import { useDispatch } from 'react-redux'

const SignOut = () => {   
    //console.log("props.isloggedin", props.isLoggedIn)
    const dispatch = useDispatch()
    const handleSignOut = (e) => {
        e.preventDefault()
        console.log("Sign out handled");
        firebase.auth.signOut()
            .then(dispatch({
                type: "TOGGLE_ISLOGGEDIN"
              }))
              .catch(console.log("$$$$singed out"))
    }
    return(
        <div>
            <button className="btn btn-primary" onClick={handleSignOut}>Sign Me Out</button>
        </div>
    )
}

export default SignOut