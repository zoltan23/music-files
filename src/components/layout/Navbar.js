import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import SignIn from '../SignIn'
import SignedInLinks from './SignedInLinks'
import SignOut from '../SignOut'

const Navbar = () => {
    return (
      
            <nav className="navbar  navbar-expand-sm bg-primary navbar-dark justify-content-center navbar-font">
                <div className="navbar-nav ">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to='/upload' >Upload</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to='/record' >Record</Link>        
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to ='/settings'>Settings</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to ='/signin'>Sign In</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to ='/signup'>Sign Up</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to ='/signout'>Sign Out</Link>
                        </li>
                    </ul>               
                </div>
            </nav>
   
        
    )
}

export default Navbar