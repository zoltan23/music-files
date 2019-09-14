import React, { useState} from 'react';
import './App.css';
import MusicFileForm from './components/MusicFiles/MusicFileForm';
import LoginPage from './components/LoginPage';
import Navbar from './components/layout/Navbar'
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
      console.log(firebaseUser);
    } else {
      console.log('not logged in');
    }
  });


  let pageRender
  if (isLoggedIn) {
    pageRender = (
      <BrowserRouter>
        <Navbar />
        <Switch>
          {/* Pass userid into Route */}
          <Route path='/upload' component={MusicFileForm} />
          <Route path='/settings' component={Settings} />
        </Switch>
      </BrowserRouter>
    )
  } else {
    pageRender = (<LoginPage />)
  }
  return (
    <div className="App">
      {pageRender}
    </div>
  );
}

export default App;
