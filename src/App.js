import React, { useState } from 'react';
//import './App.css';
import MusicFileForm from './components/MusicFiles/MusicFileForm';
import LoginPage from './components/LoginPage';
import Navbar from './components/layout/Navbar'
import Landing from './components/Landing'
import Header from './components/Header'
import SignOut from './components/SignOut'
import SignUp from './components/SignUp'
import Recorder from './components/Recorder'
import SignIn from './components/SignIn'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Settings from './services/Settings'
import firebase from './services/firebase'

function App(props) {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState("")

  console.log("app rendered")
  //Add a realtime listener
  firebase.auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      setIsLoggedIn(true)
      setUser(firebaseUser.email)
      console.log("firebaseUser:", firebaseUser);
    } else {
      setUser("")
      setIsLoggedIn(false)
    }
  });

  console.log("App: isloggedin", isLoggedIn)

  return (
    <div class="container">
      
      <BrowserRouter>
        { !user ? <Redirect to="/signin" /> : <Redirect to="/landing" />}
        <Navbar isLoggedIn={isLoggedIn} user={user} />
        <Switch>
          <Route path='/landing' component={Landing} />
          <Route path='/upload' component={MusicFileForm} />
          <Route path='/settings' component={Settings} />
          <Route path='/signin' component={SignIn} />
          <Route path='/signup' component={SignUp} />
          <Route path='/signout' component={SignOut} />
          <Route path='/recorder' component={Recorder} />
          <Route path="*" component={Landing} />
          {/* <Route
            path='/signout'
            render={(props) => <SignOut {...props} isLoggedIn="true" />}
          /> */}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
