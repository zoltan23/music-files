import React, { useState, useEffect } from 'react'
import ReusableInputField from '../reusable/ReusableInputField';
import firebase from '../../services/firebase'
import { db } from '../../services/firebase'
import DropDown from '../reusable/DropDown';

export default function SignUp(props) {

    const [isDisabled, setIsDisabled] = useState(true)
    const [firebaseError, setFirebaseError] = useState(false)

    const [userInfo, setUserInfo] = useState({
        firstName: "",
        lastName: "",
        password: "",
        email: "",
        confirmPassword: "",
        instrument: "",
        experience: ""
    })

    useEffect(() => {
        const isUser = Object.values(userInfo).every(el => Boolean(el))
        const { password, confirmPassword } = userInfo
        isUser && (password === confirmPassword) ? setIsDisabled(false) : setIsDisabled(true)
    }, [userInfo])

    function handleOnChange(input, name) {
        setUserInfo(prevState => ({ ...prevState, [name]: input }))
        console.log('userInfo', userInfo)
    }

    const handleSignUp = async (e) => {
        console.log('userInfo', userInfo)
        const { firstName, lastName, instrument, experience, email, password } = userInfo
        e.preventDefault()
        try {
            const user = await firebase.auth.createUserWithEmailAndPassword(email, password)
            console.log('[Signup] user', user)
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

    const viewFirebaseError = () => {
        if (firebaseError) {
            console.log("Firebase error", firebaseError)
            return (
                <div className="alert alert-danger" role="alert">
                    {firebaseError.message}
                </div>
            )
        }
    }

    return (
        <form className="mt-5">
            <div className="container">
                {viewFirebaseError()}
                <div className="form-row">
                    <div className="col-md-6 mb-3">
                        <ReusableInputField label="First Name" id="firstName" name="firstName" type="text" placeholder="First Name" onUpdateInput={handleOnChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <ReusableInputField label="Last Name" id="lastName" name="lastName" type="text" placeholder="First Name" onUpdateInput={handleOnChange} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-md-6 mb-3">
                        <ReusableInputField label="Email" id="exampleInputEmail1" name="email" type="email" placeholder="Enter email" onUpdateInput={handleOnChange} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-md-6 mb-3">
                        <ReusableInputField label="Password" type="password" name="password" placeholder="password" onUpdateInput={handleOnChange} />
                    </div>
                </div>
                <div className="form-row">
                    <div class="col-md-6 mb-3">
                        <ReusableInputField label="Confirm Password" type="password" name="confirmPassword" placeholder="password" onUpdateInput={handleOnChange} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-md-6 mb-3">
                        <DropDown name="instrument" dropArr={['-- Please select your instrument. --',
                            'Trumpet',
                            'Clarinet',
                            'Saxophone',
                            'Trombone',
                            'Baritone',
                            'Tuba']} placeholder="-- Please select your instrument. --" onUpdateInput={handleOnChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <DropDown name="experience" dropArr={[
                            '-- Please choose your level of experience. --',
                            'Beginner',
                            'Junior High',
                            'High School',
                            'College',
                            'Post Collegiate/Community Band',
                            'Professional'
                        ]} placeholder="-- Please choose your level of experience. --" onUpdateInput={handleOnChange} />
                    </div>
                </div>
                    <button type="submit" class="btn btn-primary w-100" disabled={isDisabled} onClick={handleSignUp}>Submit</button>
            </div>
        </form>
    )
}