import React from 'react'
import { NavLink } from 'react-router-dom'

const SignedInLinks = () => {
    return(
        <ul class="">
            <li><NavLink to ='/settings'>Settings</NavLink></li>
            <li><NavLink to ='/'>Sign In Link 2</NavLink></li>
            <li><NavLink to ='/'>Sign In Link 3</NavLink></li>            
        </ul>
    )
}

export default SignedInLinks