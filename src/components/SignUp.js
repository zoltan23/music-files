import React, { useState } from 'react'
import firebase from '../services/firebase'
import { db } from '../services/firebase'

const SignUp = () => {

    //State variables
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [instrument, setInstrument] = useState('')
    const [experience, setExperience] = useState('')

    const getFirstName = (e) => {
        setFirstName(e.target.value)
    }

    const getLastName = (e) => {
        setLastName(e.target.value)
    }

    const getExperience = (e) => {
        setExperience(e.target.value)
    }

    const getInstrument = (e) => {
        setInstrument(e.target.options[e.target.selectedIndex].text)
        console.log("instrument e", instrument)
    }

    const handleSignUp = (e) => {
        firebase.auth.createUserWithEmailAndPassword(email, password)
            .then(function (user) {
                console.log("user", user)
                db.collection("music").doc(user.user.uid).collection('userInfo').doc().set({
                    firstName: firstName,
                    lastName: lastName,
                    instrument: instrument,
                    experience: experience
                })
                //Here if you want you can sign in the user
            }).catch(function (error) {
                console.log("error", error)
            })
    }

    return (
        <div>
            <input type="text" name="txtFname" placeholder="First Name" onChange={getFirstName} required />
            <input type="text" name="txtLname" placeholder="Last Name" onChange={getLastName} required />
            <input type="email" id="txtEmail" placeholder="Email" onChange={e => setEmail(e.target.value)} value={email} />
            <input type="password" id="txtPassword" placeholder="Password" onChange={e => setPassword(e.target.value)} value={password} />
            <div className="row">
                <div className="col-sm-4">
                    <select className="form-control" onChange={getInstrument}>
                        <option defaultValue="selected">Instrument used for recordings:</option>
                        <option value="trumpet">Trumpet</option>
                        <option value="clarinet">Clarinet</option>
                        <option value="saxophone">Saxophone</option>
                        <option value="trombone">Trombone</option>
                        <option value="baritone">Baritone</option>
                    </select>
                </div>
                <span className="col-sm-4" >Number of years of experience:</span>
                <div className="col-sm-4">
                    <input type="number" name="quantity" min="1" max="20" onChange={getExperience}></input>
                </div>
            </div>
            <button onClick={handleSignUp}>Sign Up</button>
        </div>
    )
}

export default SignUp
