import React from 'react';
import './App.css';
import MusicFileForm from './components/MusicFiles/MusicFileForm';
import MusicFileList from './components/MusicFiles/MusicFileList';
import Navbar from './components/layout/Navbar'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Settings from './services/Settings'

function App() {

  return (
    <div className="App">
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route path='/upload' component={MusicFileForm}  />
        <Route path='/settings' component={Settings} />
      </Switch>
    </BrowserRouter>
      {/* <MusicFileForm /> */}
      <MusicFileList />
    </div>
  );
}

export default App;
