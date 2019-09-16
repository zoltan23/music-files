import React from 'react'
import { NavLink } from 'react-router-dom'


const SignedInLinks = () => {
    return(
        <ul class="navbar navbar-expand-sm bg-primary navbar-dark">
            <li className="navbar-item"><NavLink className="nav-link" to ='/settings'>Settings</NavLink></li>
            <li className="navbar-item"><NavLink className="nav-link" to ='/signup'>Sign Up</NavLink></li>
            <li className="navbar-item"><NavLink className="nav-link" to ='/signout'>Sign Out</NavLink></li>            
        </ul>
    )
}

export default SignedInLinks