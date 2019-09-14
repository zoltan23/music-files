import React from 'react'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-sm bg-light">
            <div className="navbar-nav">
                <Link className="nav-link" to='/upload' >Upload</Link>
                <Link className="nav-link" to='/' >Link 2</Link>
                <SignedInLinks />
            </div>
        </nav>

    )
}

export default Navbar