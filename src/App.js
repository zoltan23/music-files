import React from 'react';
import MusicFileForm from './components/MusicFiles/MusicFileForm';
import Navbar from './components/layout/Navbar'
import Landing from './components/screens/Landing'
import SignUp from './components/screens/SignUp'
import Recorder from './components/screens/Recorder'
import SignIn from './components/screens/SignIn'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Settings from './components/screens/Settings'
import { auth, db } from './services/firebase'
import ResetPassword from './components/screens/ResetPassword';
import { useDispatch, useSelector } from 'react-redux'
import Settings2 from './components/screens/Settings2';
import "./App.css"

function App() {
  console.log("App .js called")
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn)

  auth.onAuthStateChanged(firebaseUser => {
    console.log('firebase user', firebaseUser)
    if (firebaseUser) {
      dispatch({ type: 'SET_EMAIL', email: firebaseUser.email })
      dispatch({ type: 'SET_UID', uid: firebaseUser.uid })
      dispatch({ type: 'SET_ISLOGGEDIN', isLoggedIn: true })
    } else {
      dispatch({ type: 'SET_EMAIL', email: '' })
      dispatch({ type: 'SET_UID', uid: '' })
      dispatch({ type: 'SET_ISLOGGEDIN', isLoggedIn: false })
    }
  });

  return (
    <>
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
    </>
  );
}

export default App;
