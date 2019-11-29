import React, { useState } from 'react';
import MusicFileForm from './components/MusicFiles/MusicFileForm';
import Navbar from './components/layout/Navbar'
import Landing from './components/Landing'
import SignOut from './components/SignOut'
import SignUp from './components/SignUp'
import Recorder from './components/Recorder'
import SignIn from './components/SignIn'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Settings from './components/Settings'
import { auth } from './services/firebase'
import ResetPassword from './components/ResetPassword';
import "./App.css"
import { useDispatch, useSelector } from 'react-redux'

function App() {

  const dispatch = useDispatch()
  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn)
  const uid = useSelector(state => state.authReducer.uid)

  auth.onAuthStateChanged(firebaseUser => {
    console.log('firebase user', firebaseUser.uid)
    if (firebaseUser) {
      dispatch({type:'SET_EMAIL', email : firebaseUser.email})
      dispatch({type:'SET_FIRSTNAME', firstName : firebaseUser.email})
      dispatch({type:'SET_UID', uid : firebaseUser.uid})
      dispatch({type:'SET_ISLOGGEDIN', isLoggedIn : true })
    } else {
      dispatch({type:'SET_ISLOGGEDIN', isLoggedIn : false })
    }
  });

  return (
    <div class="container">
      <BrowserRouter>
        { !isLoggedIn ? <Redirect to="/signin" /> : <Redirect to="/landing" />}
        <Navbar />
        <Switch>
          <Route path='/landing' component={Landing} />
          <Route path='/upload' component={MusicFileForm} />
          <Route path='/settings' component={Settings} />
          <Route path='/signin' component={SignIn} />
          <Route path='/signup' component={SignUp} />
          <Route path='/signout' component={SignOut} />
          <Route path='/recorder' component={Recorder} />
          <Route path='/reset' component={ResetPassword} />
          <Route path="*" component={Landing} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
