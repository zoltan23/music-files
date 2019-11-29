import React, { useState } from 'react'
import firebase from '../services/firebase'
import { db } from '../services/firebase'
import "./SignUp.css"
import { useSelector, useDispatch } from 'react-redux'
import { CodeGenerator } from '@babel/generator'

const SignUp = () => {
    
    const dispatch = useDispatch()
    //State variables
    //const firstName = useSelector(state => state.firstName)
    const [firstName, setFirstName] = useState('')
   const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [choosePassword, setChoosePassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [instrument, setInstrument] = useState('-- Please select your instrument. --')
    const [experience, setExperience] = useState('')
    const [levelOfExperience, setLevelOfExperience] = useState('-- Please choose your level of experience. --')

    //Validation flag variables
    const [isFirstNameValid, setIsFirstNameValid] = useState(false)
    const [isLasttNameValid, setIsLastNameValid] = useState(false)
    const [isEmailValid, setIsEmailValid] = useState(false)
    const [isChoosePasswordValid, setIsChoosePasswordValid] = useState(false)
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false)
    const [isInstrumentValid, setIsInstrumentValid] = useState(false)
    const [isExperienceValid, setIsExperienceValid] = useState(false)
    const [firebaseError, setFirebaseError] = useState(false)
    const [shouldValidate, setShouldValidate] = useState(false)

    const validateFirstName = (e) => {
        setShouldValidate(true)
        setIsFirstNameValid(e.target.value.length > 0)
        setFirstName(e.target.value)
        
        dispatch({
            type: "SET_FIRSTNAME"
        })
        console.log('firstName', firstName)
        
    }

    const validateLastName = (e) => {
        setShouldValidate(true)
        setIsLastNameValid(e.target.value.length > 0)
        setLastName(e.target.value)
        dispatch({
            type: "SET_LASTNAME"
        })
    }

    const validateEmail = (e) => {
        setShouldValidate(true)
        setIsEmailValid(e.target.value.length > 0)
        setEmail(e.target.value)
    }
    const validateChoosePassword = (e) => {
        setShouldValidate(true)
        setIsChoosePasswordValid(e.target.value.length >= 6)
        setChoosePassword(e.target.value)
    }
    const validateConfirmPassword = (e) => {
        setShouldValidate(true)
        setIsConfirmPasswordValid((e.target.value.length >= 6) && (e.target.value === choosePassword))
        setConfirmPassword(e.target.value)
    }

    const isDisabled = () => {


        return (firstName && lastName && email && choosePassword && (choosePassword === confirmPassword) && isInstrumentValid && isExperienceValid) ? false : true
    }

    const handleSignUp = async (e) => {
        e.preventDefault()
        try {
            const user = await firebase.auth.createUserWithEmailAndPassword(email, choosePassword)
            await db.collection("music").doc(user.user.uid).collection('userInfo').doc().set({
                firstName: firstName,
                lastName: lastName,
                instrument: instrument,
                experience: experience
            })
        } catch (e) {
            console.log(e)
            setFirebaseError(e.message)
        }
        
    }

    const getValidString = (stateBool) => {
        if (shouldValidate) {
            return stateBool ? "form-control is-valid" : "form-control is-invalid"
        } else {
            // Display an unvalidated page.  Looks neater.  When the user starts typing something, then validate 
            return "form-control is-valid"
        }
        
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

    const setExperienceLevel = (num) => {
        const experience = [
            '-- Please choose your level of experience. --',
            'Beginner',
            'Junior High',
            'High School',
            'College',
            'Post Collegiate/Community Band',
            'Professional'
        ]
        setShouldValidate(true)
        setLevelOfExperience(experience[num])
        console.log('Level of Experience num >= 1', num >= 1)
        setIsExperienceValid(num >= 1)
    }
    const setInstrumentType = (num) => {
        const instruments = [
            '-- Please select your instrument. --',
            'Trumpet',
            'Clarinet',
            'Saxophone',
            'Trombone',
            'Baritone',
            'Tuba'
        ]
        setShouldValidate(true)
        setInstrument(instruments[num])
        console.log('Instrument num >= 1', num >= 1)
        setIsInstrumentValid(num >= 1)
    }

    return (
        <form>
            <div className="container">
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
                    <div className="col-md-6 mb-3">
                        <div className="dropdown" >
                            <button className={`btn btn-primary dropdown-toggle w-100 ${getValidString(isInstrumentValid)}`}  type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {instrument}
                            </button>
                            <div class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item" href="#" onClick={e => setInstrumentType(1)}>Trumpet</a>
                                <a class="dropdown-item" href="#" onClick={e => setInstrumentType(2)}>Clarinet</a>
                                <a class="dropdown-item" href="#" onClick={e => setInstrumentType(3)}>Saxophone</a>
                                <a class="dropdown-item" href="#" onClick={e => setInstrumentType(4)}>Trombone</a>
                                <a class="dropdown-item" href="#" onClick={e => setInstrumentType(5)}>Baritone</a>
                                <a class="dropdown-item" href="#" onClick={e => setInstrumentType(6)}>Tuba</a>
                            </div>
                            <div class="invalid-feedback">
                            Please select your instrument.
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="dropdown">
                            <button className={`btn btn-primary dropdown-toggle w-100 ${getValidString(isExperienceValid)}`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {levelOfExperience}
                            </button>
                            <div class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item" href="#" onClick={e => setExperienceLevel(1)}>Beginner</a>
                                <a class="dropdown-item" href="#" onClick={e => setExperienceLevel(2)}>Junior High</a>
                                <a class="dropdown-item" href="#" onClick={e => setExperienceLevel(3)}>High School</a>
                                <a class="dropdown-item" href="#" onClick={e => setExperienceLevel(4)}>College</a>
                                <a class="dropdown-item" href="#" onClick={e => setExperienceLevel(5)}>Post Collegiate/Community Band</a>
                                <a class="dropdown-item" href="#" onClick={e => setExperienceLevel(6)}>Professional</a>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="btn btn-primary w-100" disabled={isDisabled()} onClick={e => handleSignUp(e)}>Sign Up</button>
            </div>
            <div class="bottom-padding"/>
            
        </form>
        
    )
}

export default SignUp
