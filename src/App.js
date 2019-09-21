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
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Settings from './services/Settings'
import firebase from './services/firebase'

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  console.log("app rendered")
  //Add a realtime listener
  firebase.auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      setIsLoggedIn(true)
      console.log("firebaseUser:", firebaseUser);
    } else {
      setIsLoggedIn(false)
    }
  });

  console.log("App: isloggedin", isLoggedIn)
  let pageRender
  if (isLoggedIn) {
    pageRender = (
      <BrowserRouter>
        <Navbar isLoggedIn={isLoggedIn} />
        <Switch>
          {/* Pass userid into Route */}
          <Route path='/landing' component={Landing} />
          <Route path='/upload' component={MusicFileForm} />
          <Route path='/settings' component={Settings} />
          <Route path='/signout' component={SignOut} />
          <Route path='/recorder' component={Recorder} />
          <Route path="*" component={Landing} />
          <Route
            path='/signout'
            render={(props) => <SignOut {...props} isLoggedIn="true" />}
          />
        </Switch>
      </BrowserRouter>
    )
  } else {
    pageRender =
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route path='/landing' component={Landing} />
          <Route path='/signin' component={SignIn} />
          <Route path='/signup' component={SignUp} />
          <Route path="*" component={Landing} />
        </Switch>
      </BrowserRouter>
  }

  return (
    <div className="App">
      <div class="container">
        <Header />
        {pageRender}
      </div>
    </div>
  );
}

export default App;
