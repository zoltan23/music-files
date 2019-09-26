import React, { useState, useEffect } from 'react'
import firebase from '../services/firebase'
import { db, auth } from '../services/firebase'

const Settings = (props) => {

    //State variables
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [updateChoosePassword, setUpdateChoosePassword] = useState('')
    const [updateConfirmPassword, setUpdateConfirmPassword] = useState('')
    const [instrument, setInstrument] = useState('')
    const [experience, setExperience] = useState('')
    //const [uid, setUid] = useState(props.uid)
    const [docId, setDocId] = useState('')

    //Validation flag variables
    const [isFirstNameValid, setIsFirstNameValid] = useState(false)
    const [isLasttNameValid, setIsLastNameValid] = useState(false)
    const [isEmailValid, setIsEmailValid] = useState(false)
    const [isChoosePasswordValid, setIsChoosePasswordValid] = useState(false)
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true)
    const [isInstrumentValid, setIsInstrumentValid] = useState(false)
    const [isExperienceValid, setIsExperienceValid] = useState(false)
    const [isUpdatePasswordValid, setIsUpdatePasswordValid] = useState(true)
    const [firebaseError, setFirebaseError] = useState(false)

    useEffect(() => {
        console.log("email", email)
        getMusicCollection()
    }, [])

    
    const getMusicCollection = async () => {
        console.log("auth", auth.currentUser.uid)
        let snapshot = await db.collection('music').doc(auth.currentUser.uid).collection('userInfo')
            .get()

        snapshot.docs.forEach(doc => {
            setFirstName(doc.data().firstName)
            //Why is the following value null?
            console.log("First name,", firstName)
            setLastName(doc.data().lastName)
            setInstrument(doc.data().instrument)
            setExperience(doc.data().experience)
            setDocId(doc.id)

            setIsFirstNameValid(doc.data().firstName ? true : false)
            setIsLastNameValid(doc.data().lastName ? true : false)
            setIsInstrumentValid(doc.data().instrument != 0 ? true : false)
            setIsExperienceValid(doc.data().experience != 0 ? true : false)
        })
    }

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
        console.log("email", email)
        setEmail(e.target.value)
    }

    const validateChoosePassword = (e) => {
        console.log("choose pass e.target.value", e.target.value)
        setIsChoosePasswordValid(e.target.value.length >= 6)
        setUpdateChoosePassword(e.target.value)
    }
    const validateConfirmPassword = (e) => {
        console.log("confirm pass e.target.value", e.target.value)
        setIsConfirmPasswordValid((e.target.value.length >= 6) && (e.target.value === updateChoosePassword))
        setUpdateConfirmPassword(e.target.value)            
        setIsUpdatePasswordValid(e.target.value === updateChoosePassword ? false : true)
        setIsConfirmPasswordValid(e.target.value === updateChoosePassword ? true : false)
    }

    const handleUpdatePassword = e => {
        console.log("e", e)
        var user = firebase.auth.currentUser;
        var newPassword = updateConfirmPassword;
        user.updatePassword(newPassword).then(function () {
            console.log("password updated")
        }).catch(function (error) {
            console.log("password update error", error)
            setFirebaseError(error)
        });

    }

    const validateInstrument = (e) => {
        setIsInstrumentValid(e.target.value > 0)
        setInstrument(e.target.options[e.target.selectedIndex].text)
    }

    const validateExperience = (e) => {
        setIsExperienceValid(e.target.value > 0)
        setExperience(e.target.value)
    }

    const isDisabled = () => {
        return (firstName && lastName && email && updateChoosePassword && updateConfirmPassword && instrument && experience) ? false : true
    }

    const updateUserInfo = (e) => {
        console.log("props update user: ", props.uid)
        setDocId(db.collection("music").doc(props.uid).collection('userInfo').doc.id)
        console.log("docID", docId)
        db.collection("music").doc(props.uid).collection('userInfo').doc(docId).update({
            firstName: firstName,
            lastName: lastName,
            instrument: instrument,
            experience: experience
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
                    <input className={getValidString(isFirstNameValid)} type="text" id="firstName" placeholder="First Name" onChange={validateFirstName} value={firstName} />
                    <div className="valid-feedback">
                        Looks good.
            </div>
                </div>
                <div className="col-md-6 mb-3">
                    <label for="validationServer03">Last Name</label>
                    <input className={getValidString(isLasttNameValid)} type="text" id="lastName" placeholder="Last Name" onChange={validateLastName} value={lastName} />
                    <div className="valid-feedback">
                        Looks good.
            </div>
                </div>
            </div>
            <div className="form-row">
                <div class="col-md-6">
                    <label for="validationServer03">Email</label>
                    <input className={getValidString(isEmailValid)} type="email" id="email" placeholder="Email" onChange={validateEmail} value={email} required />
                    <div class="invalid-feedback">
                        Please provide a valid email.
            </div>
                </div>
            </div>
            <div className="form-row">
                <div class="col-md-6 mb-3">
                    <label for="validationServer03">Choose New Password (must be at least 6 characters long)</label>
                    <input className={getValidString(isChoosePasswordValid)} type="password" id="choosePassword" placeholder="Choose New Password" onChange={validateChoosePassword} value={updateChoosePassword} />
                    <div class={"invalid-feedback"}>
                        Please provide a valid password.
            </div>
                </div>
            </div>
            <div className="form-row">
                <div class="col-md-6 mb-3">
                    <label for="validationServer03">Confirm New Password</label>
                    <input className={getValidString(isConfirmPasswordValid)} type="password" id="confirmPassword" placeholder="Confirm New Password" onChange={validateConfirmPassword} defaultValue={updateChoosePassword} />
                    <div class="invalid-feedback">
                        Password does not match.
            </div>
                </div>
            </div>

            <div className="form-row">
                <div className="col-md-6 mb-3">
                    <button className="form-control btn btn-dark" disabled={isUpdatePasswordValid} onClick={handleUpdatePassword}>Change Password</button>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group col-md-6">
                    <label>Please choose your instrument.</label>
                    <select className={getValidString(isInstrumentValid)} onChange={validateInstrument} defaultValue={instrument}>
                        <option defaultValue="0">{instrument}</option>x
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
                    <select className={getValidString(isExperienceValid)} onChange={validateExperience} defaultValue={experience}>
                        <option defaultValue="0">{experience}</option>
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
            <button className="btn btn-dark" disabled={isDisabled()} onClick={updateUserInfo}>Update User Information</button>
        </div>
    )
}

export default Settings
