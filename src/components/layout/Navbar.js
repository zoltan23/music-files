import React from 'react'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'

const Navbar = () => {
    return (
        <nav className="nav-wrapper grey-darken-3">
            <div>
                <Link to='/' >Link 1</Link>
                <SignedInLinks />
            </div>
        </nav>

    )
}

export default Navbar