import React, { useState } from 'react';
import MusicFileForm from './components/MusicFiles/MusicFileForm';
import Navbar from './components/layout/Navbar'
import Landing from './components/Landing'
import SignOut from './components/SignOut'
import SignUp from './components/SignUp'
import Recorder from './components/Recorder'
import SignIn from './components/SignIn'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Settings from './services/Settings'
import { auth } from './services/firebase'
import ResetPassword from './components/ResetPassword';
import "./App.css"
import Header from './components/Header';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState("")
  const [uid, setUid] = useState("")

  console.log("app rendereded")
  //Add a realtime listener
  auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      setIsLoggedIn(true)
      setUser(firebaseUser.email)
      console.log("firebaseUserID:", firebaseUser.uid);
      setUid(firebaseUser.uid)
      // console.log("firebaseUser:", firebaseUser);
    } else {
      setUser("")
      setIsLoggedIn(false)
    }
  });

  console.log("App: isloggedin", isLoggedIn)

  return (
    <div class="container">
      <Header />
      <BrowserRouter>
        { !user ? <Redirect to="/signin" /> : <Redirect to="/landing" />}
        <Navbar isLoggedIn={isLoggedIn} user={user} />
        <Switch>
          <Route path='/landing' component={Landing} />
          <Route path='/upload' component={MusicFileForm} />
          {/* <Route path='/settings' component={Settings} /> */}
          <Route 
            path='/settings' 
            render={props => <Settings {...props} isLoggedIn="true" uid={uid} />}
            />
          <Route path='/signin' component={SignIn} />
          <Route path='/signup' component={SignUp} />
          <Route path='/signout' component={SignOut} />
          <Route path='/recorder' component={props => <Recorder {...props} isLoggedIn="true" uid={uid} />} />
          <Route path='/reset' component={ResetPassword} />
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
