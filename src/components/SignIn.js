import React, { useState } from 'react'
import firebase from '../services/firebase'
import './SignIn.css'


const SignIn = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignIn = (e) => {
        e.preventDefault()
        firebase.auth.signInWithEmailAndPassword(email, password)
            .then(console.log("user signed in!!!", firebase.auth.currentUser))
    }
    return (
        // <div>
        //     <input type="email" id="txtEmail" placeholder="Email" onChange={e => setEmail(e.target.value)} value ={email}/>
        //     <input type="password" id="txtPassword" placeholder="Password" onChange={e => setPassword(e.target.value)} value={password} />
        //     <button  onClick={handleSignIn}>Sign In</button>
        // </div>
        <form class="form-signin">
            <div class="text-center mb-4">
                <img class="mb-4" src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72" />
                <h1 class="h3 mb-3 font-weight-normal">Jam with our Band</h1>
                <p>Welcome to our interactive musician assistant</p>
            </div>

            <div class="form-label-group">
                <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus onChange={e => setEmail(e.target.value)} value={email} />
                <label for="inputEmail">Email address</label>
            </div>

            <div class="form-label-group">
                <input type="password" id="inputPassword" class="form-control" placeholder="Password" required onChange={e => setPassword(e.target.value)} value={password} />
                <label for="inputPassword">Password</label>
            </div>

            {/* <div class="checkbox mb-3">
                <label>
                    <input type="checkbox" value="remember-me" /> Remember me
                </label>
            </div> */}
            <button class="btn btn-lg btn-primary btn-block" type="submit"  onClick={handleSignIn}>Sign in</button>
            <p class="mt-5 mb-3 text-muted text-center">&copy; 2017-2018</p>
        </form>
    )
}

export default SignIn