import React, { useState } from 'react'
import firebase from '../services/firebase'

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
        
    const loginHandler = () => {        
        firebase.auth.signInWithEmailAndPassword(email, password)
        .then((resp) => {
            console.log("resp", resp)
        })
        .catch(e => console.log("e.message", e.message));
    }

    return (
        <div class="container">
            <input type="email" id="txtEmail" placeholder="Email" onChange={e => setEmail(e.target.value)} value ={email}/>
            <input type="password" id="txtPassword" placeholder="Password" onChange={e => setPassword(e.target.value)} value={password} />
            <button id="btnLogin" class="btn btn-action" onClick={loginHandler}>Login</button>
            <button id="btnSignUp" class="btn btn-secondary">Sign Up</button>
        </div>
    )
}

export default LoginPage