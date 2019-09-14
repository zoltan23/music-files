import React, { useState } from 'react';
import firebase from 'firebase'
import { storage } from '../../services/firebase'

const MusicUpload = () => {

 const [progress, setProgress] = useState(0)  
 const [filename, setFilename] = useState('')

 const handleChange = e => {
    e.preventDefault();
    var file = e.target.files[0];
  
    //Create a storage ref
    var storageRef = firebase.storage().ref('sweet_gifs/' + file.name);
    console.log(file.name)
    setFilename(file.name)
    //Upload file
    var task = storageRef.put(file);

    //Update progress bar
    task.on('state_changed', 
        
    function progress(snapshot) {
        var percentage = (snapshot.bytesTransferred /
        snapshot.totalBytes ) * 100;
        setProgress(percentage);
    },

    function error(err) {
        console.log("error uploading file", err);
    },

    function complete() {
        console.log("upload complete");
    }
  ); 
   
  }

  const fileUploadHandler = () => {
    console.log("file uploader button fired")
  }

  return (
    <div className="App">
      <progress value={progress} max="100" id="uploader">0%</progress>
      <input type="file" onChange={handleChange}/>
      <span>Filename: {filename}</span>
    </div>
  );
}

export default MusicUpload;
