import React from 'react'
import { NavLink } from 'react-router-dom'

const SignedOutLinks = () => {
  return (
    <div className="navbar-nav">
      <NavLink className="nav-item nav-link" to='/signin'>Sign In</NavLink>
      <NavLink className="nav-item nav-link" to='/signup'>Sign Up</NavLink>
    </div>
  )
}

export default SignedOutLinks