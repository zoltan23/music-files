import React, { useEffect, useState } from 'react'
import { auth, db } from '../../services/firebase'
import { useDispatch, useSelector } from 'react-redux'
import './SignIn.css'

const SignIn = (props) => {
    console.log("Sign in Called!!!")
    const dispatch = useDispatch()

    // const authInfo = useSelector(state => state.authReducer.uid)
    // const { uid } = authInfo
    // console.log('uid', uid)

    // useEffect(() => {
    //  const auth = async () => auth.onAuthStateChanged(firebaseUser => {
    //         console.log('firebase user [signin]', firebaseUser)
    //         if (firebaseUser) {
    //             dispatch({ type: 'SET_EMAIL', email: firebaseUser.email })
    //             dispatch({ type: 'SET_UID', uid: firebaseUser.uid })
    //             dispatch({ type: 'SET_ISLOGGEDIN', isLoggedIn: true })
      
    //         } else {
    //             dispatch({ type: 'SET_EMAIL', email: '' })
    //             dispatch({ type: 'SET_UID', uid: '' })
    //             dispatch({ type: 'SET_ISLOGGEDIN', isLoggedIn: false })
    //         }
    //     })
  
    // }, [])

    const getUserInfo = async (uid) => {
        console.log("get user called")
        const snapshot = await db.collection('music').doc(uid).collection('userInfo').get()
        snapshot.docs.forEach(doc => {
            console.log('doc_id', doc.ref.id)
            dispatch({ type: 'SET_FIRSTNAME', firstName: doc.data().firstName})
            dispatch({ type: 'SET_LASTNAME', lastName: doc.data().lastName})
            dispatch({ type: 'SET_EXPERIENCE', experience: doc.data().experience})
            dispatch({ type: 'SET_INSTRUMENT', instrument: doc.data().instrument})
            dispatch({ type: 'SET_DOCREF', docRef: doc.ref.id})
        })
        console.log('snapshot', snapshot)
    }

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [renderFlag, setRenderFlag] = useState(true)
    const [firebaseError, setFirebaseError] = useState(false)

    const handleSignIn = (e) => {
        e.preventDefault()
        auth.signInWithEmailAndPassword(email, password)
            .then((user) => {
                console.log('signin', user)
                getUserInfo(user.user.uid)
            })
            .catch(error => setFirebaseError(error))
    }

    const handlePasswordReset = (e) => {
        e.preventDefault()
        auth.sendPasswordResetEmail(email).then(function () {
        }).catch(function (error) {

        });
        setRenderFlag(false)

        setTimeout(() => {
            props.history.push('/landing')
        }, 5000)
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

    const form = (<form className="form-signin">
        {viewFirebaseError()}
        <div className="text-center mb-4">
            <img className="mb-4" src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72" />
            <h1 className="h3 mb-3 font-weight-normal">Jam with our Band</h1>
            <p>Welcome to our interactive musician assistant</p>
        </div>
        <div className="form-label-group">
            <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required autoFocus onChange={e => setEmail(e.target.value)} value={email} />
            <label htmlFor="inputEmail">Email address</label>
        </div>
        <div className="form-label-group">
            <input type="password" id="inputPassword" className="form-control" placeholder="Password" required onChange={e => setPassword(e.target.value)} value={password} />
            <label htmlFor="inputPassword">Password</label>
        </div>
        <div className="form-group">
            <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={handleSignIn}>Sign in</button>
        </div>
        <div className="form-group">
            <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={handlePasswordReset}>Password Reset</button>
        </div>
        <p className="mt-5 mb-3 text-muted text-center">&copy; 2017-2018</p>
    </form>)

    const reset = (<div>
        <p>An email has been sent to reset your password. You will be redirected to the hompage shortly.</p>
    </div>)

    const html = renderFlag ? form : reset

    return (
        <div>
            {html}
        </div>
    )
}

export default SignIn