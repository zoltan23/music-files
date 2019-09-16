import  React, { useState } from  'react'
import firebase from '../services/firebase'


const SignIn = () => {  
      
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
                                                                            
    const handleSignIn = () => {
     firebase.auth.signInWithEmailAndPassword(email, password)
        .then(console.log("user signed in!!!", firebase.auth.currentUser))
    }
    return(
        <div>
            <input type="email" id="txtEmail" placeholder="Email" onChange={e => setEmail(e.target.value)} value ={email}/>
            <input type="password" id="txtPassword" placeholder="Password" onChange={e => setPassword(e.target.value)} value={password} />
            <button  onClick={handleSignIn}>Sign In</button>
        </div>
    )
}

export default SignIn