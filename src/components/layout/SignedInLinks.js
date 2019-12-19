import React from 'react'
import { NavLink } from 'react-router-dom'
import { auth } from '../../services/firebase'

const signOut = (e) => {
    e.preventDefault()
    let signOut = window.confirm("Are you sure you want to log out?")
    if (signOut === true){
            auth.signOut()
            .then(() => console.log("Signed Out!!!"))
    }
}

const SignedInLinks = () => {
    return (
        <div className="navbar-nav">
            <NavLink className="nav-item nav-link" to='/settings'>Settings</NavLink>
            <NavLink className="nav-item nav-link" to='/recorder'>Record</NavLink>
            <NavLink className="nav-item nav-link" to='/upload'>Upload</NavLink>
            <a href="/#" onClick={signOut} className="nav-item nav-link" >Sign Out</a>
        </div>)
}

export default SignedInLinks