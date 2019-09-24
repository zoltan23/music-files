import React, { useState, useEffect } from 'react'
import firebase from '../services/firebase'
import { db, auth } from '../services/firebase'

const Settings = (props) => {


    //State variables
    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [instrument, setInstrument] = useState('')
    const [experience, setExperience] = useState('')
    const [uid, setUid] = useState(props.uid)
    const [docId, setDocId] = useState('')


    console.log("user id", uid)
    //     db.collection('music').doc(uid).collection('userInfo')
    let musicRef

    useEffect(() => {
        getMusicCollection()
    }, [])

    const getMusicCollection = async () => {
        let snapshot = await db.collection('music').doc(auth.currentUser.uid).collection('userInfo')
            .get()

        snapshot.docs.forEach(doc => {
            console.log("doc.id", doc.id)
            console.log("doc data", doc.data())
            setFirstName(doc.data().firstName)
            setLastName(doc.data().lastName)
            setInstrument(doc.data().instrument)
            setExperience(doc.data().experience)
            setDocId(doc.id)
        })
    }

    const updateFirstName = (e) => {
        setFirstName(e.target.value)
        console.log("fname", firstName)

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

    return (
        <div className="card">
            <form>
                <div className="form-group row">
                    <div className="form-group col-md-6">
                        <label for="firstName">First Name</label>
                        <input className="form-control" id="firstName" type="text" name="txtFname" placeholder={firstName} onChange={updateFirstName} required />
                    </div>
                    <div className="form-group col-md-6">
                        <label for="lastName">Last Name</label>
                        <input className="form-control" id="lastName" type="text" name="txtLname" placeholder={lastName} onChange={getLastName} required />
                    </div>
                </div>

                <div className="form-group row">
                <div className="form-group col-md-6">
                    <label for="txtEmail">Email address</label>
                    <input className="form-control" type="email" id="txtEmail" placeholder="Email" onChange={e => setEmail(e.target.value)} value={email} />
                    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div class="form-group col-md-6">
                    <label  for="txtPassword">Password</label>
                    <input className="form-control" type="password" id="txtPassword" placeholder="Password" onChange={e => setPassword(e.target.value)} value={password} />
                </div>
                </div>
                <div className="form-group row">
                    <div className="form-group col-md-6">
                        <select className="form-control" onChange={getInstrument}>
                            <option defaultValue="selected">{instrument}</option>
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
                        <input className="" type="number" name="quantity" min="1" max="40" defaultValue={experience} onChange={getExperience}></input>
                    </div>
                </div>
                <button className="btn btn-dark" disabled={isDisabled()} onClick={updateUserInfo}>Update User Info</button>
            </form>
        </div>
    )
}

export default Settings
