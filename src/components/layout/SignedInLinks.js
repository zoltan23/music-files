import React from 'react'
import { NavLink } from 'react-router-dom'
import { auth } from '../../services/firebase'
import { useDispatch } from 'react-redux'



const SignedInLinks = () => {
    const dispatch = useDispatch()

const signOut = (e) => {
    e.preventDefault()
    auth.signOut()
            .then(() => console.log("Signed Out!!!"))
    

}
    return(
        <div class="navbar-nav">
            <NavLink className="nav-item nav-link" to ='/settings'>Settings</NavLink>
            <NavLink className="nav-item nav-link" to ='/recorder'>Record</NavLink>
            <NavLink className="nav-item nav-link" to ='/upload'>Upload</NavLink>         
            {/* <NavLink className="nav-item nav-link" to ='/signout'>Sign Out</NavLink>   */}
            <a href="#" onClick={signOut} className="nav-item nav-link" >Sign Out</a>
        </div>)
}

export default SignedInLinks