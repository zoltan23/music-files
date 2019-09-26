import React, { useState } from 'react'
import firebase from '../services/firebase'
import { db } from '../services/firebase'

const SignUp = () => {

    //State variables
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [choosePassword, setChoosePassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [instrument, setInstrument] = useState('')
    const [experience, setExperience] = useState('')

    //Validation flag variables
    const [isFirstNameValid, setIsFirstNameValid] = useState(false)
    const [isLasttNameValid, setIsLastNameValid] = useState(false)
    const [isEmailValid, setIsEmailValid] = useState(false)
    const [isChoosePasswordValid, setIsChoosePasswordValid] = useState(false)
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false)
    const [isInstrumentValid, setIsInstrumentValid] = useState(false)
    const [isExperienceValid, setIsExperienceValid] = useState(false)
    const [firebaseError, setFirebaseError] = useState(false)


    const validateFirstName = (e) => {
        setIsFirstNameValid(e.target.value.length > 0)
        setFirstName(e.target.value)
    }

    const validateLastName = (e) => {
        setIsLastNameValid(e.target.value.length > 0)
        setLastName(e.target.value)
    }

    const validateEmail = (e) => {
        setIsEmailValid(e.target.value.length > 0)
        setEmail(e.target.value)
    }
    const validateChoosePassword = (e) => {
        setIsChoosePasswordValid(e.target.value.length >= 6)
        setChoosePassword(e.target.value)
    }
    const validateConfirmPassword = (e) => {
        setIsConfirmPasswordValid((e.target.value.length >= 6) && (e.target.value === choosePassword))
        setConfirmPassword(e.target.value)
    }

    const validateInstrument = (e) => {
        setIsInstrumentValid(e.target.value > 0)
        console.log("e value", e.target.options[e.target.selectedIndex].value)
        setInstrument(e.target.options[e.target.selectedIndex].text)
        console.log("instrument e", instrument)
    }

    const validateExperience = (e) => {
        setIsExperienceValid(e.target.value > 0)
        setExperience(e.target.value)
    }

    //Test that password and confirm password fields match
    const checkPassword = (e) => {
        setConfirmPassword(e.target.value)
        if (choosePassword != confirmPassword) {
            console.log("not a match")
        }
    }

    const isDisabled = () => {
        return (firstName && lastName && email && choosePassword && instrument && experience && (choosePassword === confirmPassword)) ? false : true
    }

    const handleSignUp = (e) => {
        console.log("disabled", isDisabled)

        firebase.auth.createUserWithEmailAndPassword(email, choosePassword)
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
                setFirebaseError(error)
            })
    }

    const getValidString = (stateBool) => {
        return stateBool ? "form-control is-valid" : "form-control is-invalid"
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

    return (
        <div className="card">
            {viewFirebaseError()}
            <div className="form-row">
                <div className="col-md-6 mb-3">
                    <label for="validationServer03">First Name</label>
                    <input className={getValidString(isFirstNameValid)} type="text" id="firstName" placeholder="First Name" onChange={validateFirstName} />
                    <div className="valid-feedback">
                        Looks good.
            </div>
                </div>
                <div className="col-md-6 mb-3">
                    <label for="validationServer03">Last Name</label>
                    <input className={getValidString(isLasttNameValid)} type="text" id="lastName" placeholder="Last Name" onChange={validateLastName} />
                    <div className="valid-feedback">
                        Looks good.
            </div>
                </div>
            </div>
            <div className="form-row">
                <div class="col-md-6">
                    <label for="validationServer03">Email</label>
                    <input className={getValidString(isEmailValid)} type="email" id="email" placeholder="Email" onChange={validateEmail} required />
                    <div class="invalid-feedback">
                        Please provide a valid email.
            </div>
                </div>
            </div>
            <div className="form-row">
                <div class="col-md-6 mb-3">
                    <label for="validationServer03">Choose Password (must be at least 6 characters long)</label>
                    <input className={getValidString(isChoosePasswordValid)} type="password" id="choosePassword" placeholder="Choose Password" onChange={validateChoosePassword} />
                    <div class={"invalid-feedback"}>
                        Please provide a valid password.
            </div>
                </div>
            </div>
            <div className="form-row">
                <div class="col-md-6 mb-3">
                    <label for="validationServer03">Confirm Password</label>
                    <input className={getValidString(isConfirmPasswordValid)} type="password" id="choosePassword" placeholder="Choose Password" onChange={validateConfirmPassword} />
                    <div class="invalid-feedback">
                        Password does not match.
            </div>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label>Please choose your instrument.</label>
                    <select className={getValidString(isInstrumentValid)} onChange={validateInstrument}>
                        <option defaultValue="0">Instrument used for recordings:</option>
                        <option value="1">Trumpet</option>
                        <option value="2">Clarinet</option>
                        <option value="3">Saxophone</option>
                        <option value="4">Trombone</option>
                        <option value="5">Baritone</option>
                        <option value="6">Tuba</option>
                    </select>
                    <div class="invalid-feedback">
                        Please choose your instrument.
            </div>
                </div>
                <div className="form-group col-md-6">
                    <label>Please select your level of experience.</label>
                    <select className={getValidString(isExperienceValid)} onChange={validateExperience}>
                        <option defaultValue="0">Level of experience</option>
                        <option value="1">Beginner</option>
                        <option value="2">Junior High</option>
                        <option value="3">High School</option>
                        <option value="4">College</option>
                        <option value="5">Post Collegiate/Community Band</option>
                        <option value="6">Professional</option>
                    </select>
                    <div class="invalid-feedback">
                        Please choose your level of experience.
            </div>
                </div>
            </div>
            <button className="btn btn-dark" disabled={isDisabled()} onClick={handleSignUp}>Sign Up</button>
        </div>
    )}

export default SignUp
