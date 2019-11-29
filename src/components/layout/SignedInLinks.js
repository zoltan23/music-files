import React from 'react'
import { NavLink } from 'react-router-dom'
import { auth } from '../../services/firebase'

const signOut = (e) => {
    e.preventDefault()
    auth.signOut()
        .then(() => console.log("Signed Out!!!"))
}

const SignedInLinks = () => {

    return (
        <div class="navbar-nav">
            <NavLink className="nav-item nav-link" to='/settings'>Settings</NavLink>
            <NavLink className="nav-item nav-link" to='/recorder'>Record</NavLink>
            <NavLink className="nav-item nav-link" to='/upload'>Upload</NavLink>
            {/* <NavLink className="nav-item nav-link" to ='/signout'>Sign Out</NavLink>   */}
            <a href="#" onClick={signOut} className="nav-item nav-link" >Sign Out</a>
        </div>)
}

export default SignedInLinks