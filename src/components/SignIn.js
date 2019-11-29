import React, { useState } from 'react'
import { auth } from '../services/firebase'
import './SignIn.css'

const SignIn = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [renderFlag, setRenderFlag] = useState(true)
    const [firebaseError, setFirebaseError] = useState(false)

    const handleSignIn = (e) => {
        e.preventDefault()
        auth.signInWithEmailAndPassword(email, password)
            .then((user) => {
                console.log('sign in with email and password')
            })
            .catch(error => setFirebaseError(error))
    }

    const handlePasswordReset = (e) => {
        e.preventDefault()
        auth.sendPasswordResetEmail(email).then(function () {
        }).catch(function (error) {

        });
        setRenderFlag(false)

        setTimeout(() => {
            props.history.push('/landing')
        }, 5000)
    }

    const viewFirebaseError = () => {
        if (firebaseError) {
            console.log("Firebase error", firebaseError)
            return (
                <div class="alert alert-danger" role="alert">
                    {firebaseError.message}
                </div>
            )
        }
    }

    const form = <form className="form-signin">
        {() => viewFirebaseError() }
        <div className="text-center mb-4">
            <img className="mb-4" src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72" />
            <h1 className="h3 mb-3 font-weight-normal">Jam with our Band</h1>
            <p>Welcome to our interactive musician assistant</p>
        </div>
        <div className="form-label-group">
            <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus onChange={e => setEmail(e.target.value)} value={email} />
            <label for="inputEmail">Email address</label>
        </div>
        <div className="form-label-group">
            <input type="password" id="inputPassword" class="form-control" placeholder="Password" required onChange={e => setPassword(e.target.value)} value={password} />
            <label for="inputPassword">Password</label>
        </div>
        <div className="form-group">
            <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={handleSignIn}>Sign in</button>
        </div>
        <div className="form-group">
            <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={handlePasswordReset}>Password Reset</button>
        </div>
        <p class="mt-5 mb-3 text-muted text-center">&copy; 2017-2018</p>
    </form>

    const reset = <div>
        <p>An email has been sent to reset your password. You will be redirected to the hompage shortly.</p>
    </div>

    const html = renderFlag ? form : reset
    return (
        <div>
            {html}
        </div>
    )
}

export default SignIn