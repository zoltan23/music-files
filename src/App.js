import React, { Fragment, useState } from 'react';
import MusicFileForm from './components/MusicFiles/MusicFileForm';
import Navbar from './components/layout/Navbar'
import Landing from './components/Landing'
import SignUp from './components/SignUp'
import Recorder from './components/Recorder'
import SignIn from './components/SignIn'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Settings from './components/Settings'
import { auth, db } from './services/firebase'
import ResetPassword from './components/ResetPassword';
import "./App.css"
import { useDispatch, useSelector } from 'react-redux'


function App() {
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
    
  auth.onAuthStateChanged(async firebaseUser => {
    console.log('firebase user', firebaseUser)
    if (firebaseUser) {
      console.log('firebaseUser', firebaseUser)
      dispatch({ type: 'SET_EMAIL', email: firebaseUser.email })
      //dispatch({type:'SET_FIRSTNAME', firstName : firebaseUser.firstName})
      dispatch({ type: 'SET_UID', uid: firebaseUser.uid })
      dispatch({ type: 'SET_ISLOGGEDIN', isLoggedIn: true })
     
      const snapshot = await db.collection('music').doc(firebaseUser.uid).collection('userInfo').get()
      snapshot.docs.forEach(doc =>  {setFirstName(doc.data().firstName)
                                setLastName(doc.data().lastName)})
      dispatch({ type: 'SET_FIRSTNAME', firstName: firstName })
      dispatch({ type: 'SET_LASTNAME', lastName: lastName })
    } else {
      dispatch({ type: 'SET_EMAIL', email: '' })
      dispatch({ type: 'SET_FIRSTNAME', firstName: '' })
      dispatch({ type: 'SET_UID', uid: '' })
      dispatch({ type: 'SET_ISLOGGEDIN', isLoggedIn: false })
    }
  });
 
  return (
    <Fragment>
      <BrowserRouter>
        {!isLoggedIn ? <Redirect to="/signin" /> : <Redirect to="/landing" />}
        <Navbar />
        <Switch>
          <Route path='/landing' component={Landing} />
          <Route path='/upload' component={MusicFileForm} />
          <Route path='/settings' component={Settings} />
          <Route path='/signin' component={SignIn} />
          <Route path='/signup' component={SignUp} />
          <Route path='/recorder' component={Recorder} />
          <Route path='/reset' component={ResetPassword} />
          <Route path="*" component={Landing} />
        </Switch>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
