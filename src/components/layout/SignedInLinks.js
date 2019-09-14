import React from 'react'
import { NavLink } from 'react-router-dom'

const SignedInLinks = () => {
    return(
        <ul class="navbar-nav bg-light">
            <li className="navbar-item"><NavLink className="nav-link" to ='/settings'>Settings</NavLink></li>
            <li className="navbar-item"><NavLink className="nav-link" to ='/'>Sign In Link 2</NavLink></li>
            <li className="navbar-item"><NavLink className="nav-link" to ='/'>Sign In Link 3</NavLink></li>            
        </ul>
    )
}

export default SignedInLinks