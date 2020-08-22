import React from 'react'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'
import { useSelector } from "react-redux";
import Initials from './Initials';

const Navbar = () => {

    const firstName = useSelector(state => state.userInfoReducer.firstName)
    const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn)

    const links = isLoggedIn ? <SignedInLinks /> : <SignedOutLinks />

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            {links}
        </div>
        <div style={{marginRight: 45}}>
        <Link to='/landing' className="navbar-brand" data-tip data-for="userIDToolTip"><Initials /></Link>
        </div>
    </nav>
    )
}

export default Navbar