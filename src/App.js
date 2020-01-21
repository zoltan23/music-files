import React, { Fragment } from 'react';
import MusicFileForm from './components/MusicFiles/MusicFileForm';
import Navbar from './components/layout/Navbar'
import Landing from './components/Landing'
import SignUp from './components/SignUp'
import Recorder from './components/Recorder'
import SignIn from './components/SignIn'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Settings from './components/Settings'
import { auth } from './services/firebase'
import ResetPassword from './components/ResetPassword';
import "./App.css"
import { useDispatch, useSelector } from 'react-redux'

// THis is a test
function App() {
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn)

  auth.onAuthStateChanged(firebaseUser => {
    console.log('firebase user', firebaseUser)
    if (firebaseUser) {
      dispatch({type:'SET_EMAIL', email : firebaseUser.email})
      dispatch({type:'SET_FIRSTNAME', firstName : firebaseUser.email})
      dispatch({type:'SET_UID', uid : firebaseUser.uid})
      dispatch({type:'SET_ISLOGGEDIN', isLoggedIn : true })
    } else {
      dispatch({type:'SET_EMAIL', email : ''})
      dispatch({type:'SET_FIRSTNAME', firstName : ''})
      dispatch({type:'SET_UID', uid : ''})
      dispatch({type:'SET_ISLOGGEDIN', isLoggedIn : false })
    }
  });

  return (
 <Fragment>
      <BrowserRouter>
        { !isLoggedIn ? <Redirect to="/signin" /> : <Redirect to="/landing" />} 
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
