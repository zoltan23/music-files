import React, { useState, useEffect } from 'react'
import firebase from '../services/firebase'
import { db } from '../services/firebase'

const Settings = () => {
    // const uid = useSelector(state => state.authReducer.uid)
    const uid = 'dOBcQk0Iz6XhnfK7ma10HDUCUcB2'

    //State variables
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [updateChoosePassword, setUpdateChoosePassword] = useState('')
    const [updateConfirmPassword, setUpdateConfirmPassword] = useState('')
    const [instrument, setInstrument] = useState('')
    const [experience, setExperience] = useState('')
    const [docId, setDocId] = useState('uYYq0889hzM7D0MeDu8N')
    const [didUpdate, setDidUpdate ] = useState(false)
    const [upDated, setUpdated] = useState('Updated')
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
        console.log("UseEffect called in Settings!")
        getMusicCollection()
    }, [])

    const getMusicCollection = async () => {
        console.log("getMusicCollection callled!")
        let snapshot = await db.collection('music').doc(uid).collection('userInfo')
            .get()

        snapshot.docs.forEach(doc => {
            setFirstName(doc.data().firstName)
            setLastName(doc.data().lastName)
            setInstrument(doc.data().instrument)
            setExperience(doc.data().experience)
            setDocId(doc.id)
            setIsFirstNameValid(doc.data().firstName ? true : false)
            setIsLastNameValid(doc.data().lastName ? true : false)
            setIsInstrumentValid(doc.data().instrument !== 0 ? true : false)
            setIsExperienceValid(doc.data().experience !== 0 ? true : false)
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
        console.log('[Settings] email', email)
        setIsEmailValid(e.target.value.length > 0)
        setEmail(e.target.value)
    }

    const validateChoosePassword = (e) => {
        setIsChoosePasswordValid(e.target.value.length >= 6)
        setUpdateChoosePassword(e.target.value)
    }
    const validateConfirmPassword = (e) => {
        setIsConfirmPasswordValid((e.target.value.length >= 6) && (e.target.value === updateChoosePassword))
        setUpdateConfirmPassword(e.target.value)
        setIsUpdatePasswordValid(e.target.value === updateChoosePassword ? false : true)
        setIsConfirmPasswordValid(e.target.value === updateChoosePassword ? true : false)
    }

    const handleUpdatePassword = e => {
        var user = firebase.auth.currentUser;
        var newPassword = updateConfirmPassword;
        user.updatePassword(newPassword).then(function () {
            console.log("password updated")
        }).catch(function (error) {
            console.log("password update error", error)
            setFirebaseError(error)
        });
    }

    const isDisabled = () => {
        return (firstName && lastName && email && instrument && experience) ? false : true
    }

    const updateUserInfo = () => {
        let updateBool = window.confirm("Click OK to update your user information!")
        if (updateBool) {
            db.collection("music").doc(uid).collection('userInfo').doc(docId).update({
                firstName: firstName,
                lastName: lastName,
                instrument: instrument,
                experience: experience
            }).then(function () {
                setDidUpdate(true)
            })
                .catch(function (error) {
                    // The document probably doesn't exist.
                    console.log("Error updating document: ", error);
                });
        }
    }
    
    const mess = () => {
        if(didUpdate){
            setTimeout(() => setUpdated('d-none'), 6000)
            return (<div className={`alert alert-success ${upDated}`} role="alert">
                Your user information has been successfully updated!
            </div>)
    }  
}

    const deleteUser = () => {
        var user = firebase.auth.currentUser;
        console.log('[delete] user', user)
        let deleteBool = window.confirm("Delete")
        if (deleteBool) {
            user.delete().then(function () {
            }).catch(function (error) {
                console.log('[delete] error', error)
            });
        }
    }

    const getValidString = (stateBool) => {
        return stateBool ? "form-control is-valid" : "form-control is-invalid"
    }

    const viewFirebaseError = () => {
        if (firebaseError) {
            return (
                <div className="alert alert-danger" role="alert">
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
        //setLevelOfExperience(experience[num])
        setExperience(experience[num])
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
        setInstrument(instruments[num])
        setIsInstrumentValid(num >= 1)
    }

    return (
        <div className="card">
            {mess()}
            {viewFirebaseError()}
            <div className="form-row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="validationServer03">First Name</label>
                    <input className={getValidString(isFirstNameValid)} type="text" id="firstName" placeholder="First Name" onChange={validateFirstName} value={firstName} />
                    <div className="valid-feedback">
                        Looks good.
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="validationServer03">Last Name</label>
                    <input className={getValidString(isLasttNameValid)} type="text" id="lastName" placeholder="Last Name" onChange={validateLastName} value={lastName} />
                    <div className="valid-feedback">
                        Looks good.
            </div>
                </div>
            </div>
            <div className="form-row">
                <div className="col-md-6">
                    <label htmlFor="validationServer03">Email</label>
                    <input className={getValidString(isEmailValid)} type="email" id="email" placeholder="Email" onChange={validateEmail} value={email} autoComplete="off" required />
                    <div className="invalid-feedback">
                        Please provide a valid email.
            </div>
                </div>
            </div>
            <div className="form-row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="validationServer03">Choose New Password (must be at least 6 characters long)</label>
                    <input className={getValidString(isChoosePasswordValid)} type="password" id="choosePassword" placeholder="Choose New Password" onChange={validateChoosePassword} value={updateChoosePassword} />
                    <div className={"invalid-feedback"}>
                        Please provide a valid password.
            </div>
                </div>
            </div>
            <div className="form-row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="validationServer03">Confirm New Password</label>
                    <input className={getValidString(isConfirmPasswordValid)} type="password" id="confirmPassword" placeholder="Confirm New Password" onChange={validateConfirmPassword} defaultValue={updateChoosePassword} />
                    <div className="invalid-feedback">
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
                    <div className="dropdown" >
                        <button className={`btn btn-primary dropdown-toggle w-100 ${getValidString(isInstrumentValid)}`} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {instrument}
                        </button>
                        <div className="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                            <a className="dropdown-item" href="#!" onClick={e => setInstrumentType(1)}>Trumpet</a>
                            <a className="dropdown-item" href="#!" onClick={e => setInstrumentType(2)}>Clarinet</a>
                            <a className="dropdown-item" href="#!" onClick={e => setInstrumentType(3)}>Saxophone</a>
                            <a className="dropdown-item" href="#!" onClick={e => setInstrumentType(4)}>Trombone</a>
                            <a className="dropdown-item" href="#!" onClick={e => setInstrumentType(5)}>Baritone</a>
                            <a className="dropdown-item" href="#!" onClick={e => setInstrumentType(6)}>Tuba</a>
                        </div>
                        <div className="invalid-feedback">
                            Please select your instrument.
                            </div>
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <div className="dropdown">
                        <button className={`btn btn-primary dropdown-toggle w-100 ${getValidString(isExperienceValid)}`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {experience}
                        </button>
                        <div className="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                            <a className="dropdown-item" href="#!" onClick={e => setExperienceLevel(1)}>Beginner</a>
                            <a className="dropdown-item" href="#!" onClick={e => setExperienceLevel(2)}>Junior High</a>
                            <a className="dropdown-item" href="#!" onClick={e => setExperienceLevel(3)}>High School</a>
                            <a className="dropdown-item" href="#!" onClick={e => setExperienceLevel(4)}>College</a>
                            <a className="dropdown-item" href="#!" onClick={e => setExperienceLevel(5)}>Post Collegiate/Community Band</a>
                            <a className="dropdown-item" href="#!" onClick={e => setExperienceLevel(6)}>Professional</a>
                        </div>
                    </div>
                    <div className="invalid-feedback">
                        Please choose your level of experience.
            </div>
                </div>
            </div>
            <div className="form-row ">
                <div className="form-group col-md-12">

                    <button className="btn form-control btn-primary " disabled={isDisabled()} onClick={updateUserInfo}>Update User Information</button>
                    <button className="btn form-control btn-danger mt-3" disabled={false} onClick={deleteUser}>Delete Your Profile</button>
                </div>

            </div>
        </div>
    )
}

export default Settings
