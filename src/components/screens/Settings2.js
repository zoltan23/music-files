import React, { useEffect, useState } from 'react'
import ReusableInputField from '../reusable/ReusableInputField'
import firebase from '../../services/firebase'
import { db } from '../../services/firebase'
import { useSelector } from 'react-redux'
import DropDown from '../reusable/DropDown'

export default function Settings2() {

    const authReducer = useSelector(state => state.authReducer)
    console.log('authReducer', authReducer)
    const userInfoReducer = useSelector(state => state.userInfoReducer)
    const { firstName, lastName, instrument, experience, docRef } = userInfoReducer
    const { uid } = authReducer

    console.log('userInfoReducer', userInfoReducer)

    const [isDisabled, setIsDisabled] = useState(true)
    const [firebaseError, setFirebaseError] = useState(false)

    const [userInfo, setUserInfo] = useState({
        firstName: firstName,
        lastName: lastName,
        // password: "",
        // email: "",
        // confirmPassword: "",
        instrument: instrument,
        experience: experience
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

    const updateUserInfo = (e) => {
        e.preventDefault()
        let updateBool = window.confirm("Click OK to update your user information!")
        const { firstName, lastName, instrument, experience } = userInfo        
        if (updateBool) {
            console.log('uid', firstName)
            db.collection("music").doc(uid).collection('userInfo').doc(docRef).update({
                firstName: firstName,
                lastName: lastName,
                instrument: instrument,
                experience: experience
            }).then(function () {
                //setDidUpdate(true)
            })
                .catch(function (error) {
                    // The document probably doesn't exist.
                    console.log("Error updating document: ", error);
                });
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

    return (
        <form>
            <div className="container">
                {/* {viewFirebaseError()} */}
                <div className="form-row">
                    <div className="col-md-6 mb-3">
                        <ReusableInputField label="First Name" id="firstName" name="firstName" type="text" placeholder={firstName} onUpdateInput={handleOnChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <ReusableInputField label="Last Name" id="lastName" name="lastName" type="text" placeholder={lastName} onUpdateInput={handleOnChange} />
                    </div>
                </div>
                {/* <div className="form-row">
                    <div className="col-md-6 mb-3">
                        <ReusableInputField label="Instrument" id="instrument" name="instrument" type="text" placeholder={instrument} onUpdateInput={handleOnChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <ReusableInputField label="Experience" id="experience" name="experience" type="text" placeholder={experience} onUpdateInput={handleOnChange} />
                    </div>
                </div> */}
                <div className="form-row">
                    <div className="col-md-6 mb-3">
                        <DropDown name="instrument" dropArr={['-- Please select your instrument. --',
                            'Trumpet',
                            'Clarinet',
                            'Saxophone',
                            'Trombone',
                            'Baritone',
                            'Tuba']} onUpdateInput={handleOnChange} />
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
                        ]} onUpdateInput={handleOnChange}/>
                    </div>
                </div>
                
                <div className="form-row ">
                <div className="form-group col-md-12">
                    <button className="btn form-control btn-primary " disabled={isDisabled} onClick={updateUserInfo}>Update User Information</button>
                    <button className="btn form-control btn-danger mt-3" disabled={false} onClick={deleteUser}>Delete Your Profile</button>
                </div>
            </div>
            </div>
        </form>
    )
}
