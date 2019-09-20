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

    const isDisabled = () => {
        return (firstName && lastName && email && password && instrument && experience) ? false : true
    }

    const handleSignUp = (e) => {
        console.log("disabled", isDisabled)
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
        <div className="card">
            <div className="form-row">
                <div className="form-group col-md-6">
                    <input className="form-control" type="text" name="txtFname" placeholder="First Name" onChange={getFirstName} required />
                </div>
                <div className="form-group col-md-6">
                    <input className="form-control" type="text" name="txtLname" placeholder="Last Name" onChange={getLastName} required />
                </div>
            </div>
            <input type="email" id="txtEmail" placeholder="Email" onChange={e => setEmail(e.target.value)} value={email} />
            <input type="password" id="txtPassword" placeholder="Password" onChange={e => setPassword(e.target.value)} value={password} />
            <div className="form-row">
                <div className="form-group col-md-6">
                    <select className="form-control" onChange={getInstrument}>
                        <option defaultValue="selected">Instrument used for recordings:</option>
                        <option value="trumpet">Trumpet</option>
                        <option value="clarinet">Clarinet</option>
                        <option value="saxophone">Saxophone</option>
                        <option value="trombone">Trombone</option>
                        <option value="baritone">Baritone</option>
                    </select>
                </div>
                <div className="form-group col-md-5">
                    <span className="form-inline justify-content-center">Number of years of experience:</span>
                </div>
                <div className="form-group col-md-1">
                    <input className="" type="number" name="quantity" min="1" max="40" defaultValue="0" onChange={getExperience}></input>
                </div>
            </div>
            <button className="btn btn-dark" disabled={isDisabled()} onClick={handleSignUp}>Sign Up</button>
        </div>
    )
}

export default SignUp
