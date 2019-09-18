import React, {useState} from 'react'
import Card from '../UI/Card'
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from '../../services/firebase'
import './MusicFileForm.css'
import './MusicUpload'
import MusicUpload from './MusicUpload';
import MusicFileList from './MusicFileList'
import firebase from '../../services/firebase'

function MusicFileForm () {
    

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userId, setUserId] = useState('')
    firebase.auth.onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
          setIsLoggedIn(true)
          setUserId(firebaseUser.uid)
          console.log("firebaseUSer", firebaseUser);
        } else {
          setUserId('')
        }
      });  

    const [filename, setFilename] = useState('')
    const [note, setNote] = useState('')
    const submitHandler = event => {
        event.preventDefault()
        console.log("submit handler fired")
    }
    
    const getFilename = (filename) => {
        setFilename(filename)
    }

    const addFile = e => {
        console.log("addFile submited")
        e.preventDefault();
        db.collection("music").doc(userId).collection('musicId').doc().set({
            filename: filename,
            note: note   
        });
        console.log("addFile filename", filename)
    }

    const getNote = e => {
        setNote(e.target.options[e.target.selectedIndex].text)
    }   

    return (
        <section> 
            <form className="form-inline justify-content-center" onSubmit={submitHandler}>                        
                <div className="form-group mr-2">                                       
                    <MusicUpload fileref={getFilename}/>
                    <p>{filename}</p>
                </div>
                <div className="form-group mr-2">                        
                    <select className="form-control" onChange={getNote}>
                                 <option defaultValue="selected">Note associated with file:</option>
                                 <option value="Gb">G-Flat</option>
                                 <option value="G">G-Natural</option>
                                 <option value="G#">G-Sharp</option>
                    </select>
                </div>                       
                <div className="form-group mr-2">
                    <button className="btn btn-primary" type="submit" onClick={addFile}>Upload File</button>  
                </div>                       
                 </form>
                 <div><MusicFileList userId={userId}/></div> 
             </section> 
    )
}

export default MusicFileForm