import  React, { useState } from  'react'
import firebase from '../services/firebase'

const SignUp = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
                                                                            
    const handleSignUp = () => {
     firebase.auth.createUserWithEmailAndPassword(email, password)
        .then(console.log("user created!!!"))
    }
    return(
        <div>
            <input type="email" id="txtEmail" placeholder="Email" onChange={e => setEmail(e.target.value)} value ={email}/>
            <input type="password" id="txtPassword" placeholder="Password" onChange={e => setPassword(e.target.value)} value={password} />
            <button  onClick={handleSignUp}>Sign Up</button>
        </div>
    )
}

export default SignUp