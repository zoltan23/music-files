import React from 'react'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'


const Navbar = (props) => {
    console.log("islogged in", props.isLoggedIn)
    const links = props.isLoggedIn ? <SignedInLinks /> : <SignedOutLinks /> 
    return (      
        <nav className="nav-wrapper grey darken-3">
            <div className="container">
                <Link to='/landing' className="brand-logo">Home</Link>
                {links}
            </div>
        </nav>        
    )
}

export default Navbar