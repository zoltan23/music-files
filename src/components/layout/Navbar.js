import React from 'react'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'
import { useSelector } from "react-redux";

const Navbar = () => {

    const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn)

    const links = isLoggedIn ? <SignedInLinks /> : <SignedOutLinks />

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse container" id="navbarNavAltMarkup">
            {links}
        </div>
    </nav>
    )
}

export default Navbar