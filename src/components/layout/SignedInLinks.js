import React from 'react'
import { NavLink } from 'react-router-dom'
import { auth } from '../../services/firebase'
import { Link } from 'react-router-dom'
import Initials from './Initials'

const signOut = (e) => {
    e.preventDefault()
    let signOut = window.confirm("Are you sure you want to log out?")
    if (signOut === true) {
        auth.signOut()
            .then(() => console.log("Signed Out!!!"))
    }
}

const SignedInLinks = () => {
    return (
        <>
            <div className="navbar-nav">
                <NavLink className="nav-item nav-link" to='/settings'>Settings</NavLink>
                <NavLink className="nav-item nav-link" to='/recorder'>Record</NavLink>
                <NavLink className="nav-item nav-link" to='/upload'>Upload</NavLink>

                <a href="/#" onClick={signOut} className="nav-item nav-link" >Sign Out</a>
            </div>
            <div className="navbar-nav ml-auto" style={{ marginRight: 45 }}>
                <Link to='/landing' className="navbar-brand" data-tip data-for="userIDToolTip"><Initials /></Link>
            </div>
        </>
    )
}

export default SignedInLinks