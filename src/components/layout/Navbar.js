import React from 'react'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'

const Navbar = (props) => {
    console.log("islogged in", props.isLoggedIn)
    const links = props.isLoggedIn ? <SignedInLinks /> : <SignedOutLinks />
    return (
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link to='/landing' className="navbar-brand">{props.user}</Link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                {links}
            </div>
        </nav>
    )
}

export default Navbar