import React, { useState, useRef, useEffect } from 'react';
import firebase from 'firebase'
import { storage } from '../../services/firebase'
import { v4 } from 'uuid';

const MusicUpload = (props) => {

  let uid = firebase.auth().currentUser.uid
  console.log("firebase auth id: ", uid)

  const [progress, setProgress] = useState(0)
  const [files, setFiles] = useState({})
  console.log("files ", typeof(files))
  const fileInput = useRef();
  var storageRef, file, rnd , fileref
   
  
  const handleChange = e => {
    e.preventDefault();
    
    const files = e.target.files
    let obj = { files: files, value : e.target.value }
    setFiles(obj);     
  
    Object.keys(obj.files).forEach(k => {
       file = obj.files[k]
      rnd = v4()
      console.log("rnd", rnd)
      storageRef = firebase.storage().ref(`football_pics/${uid}/${rnd}_${file.name}`);
      var task = storageRef.put(file);

      task.on('state_changed',

        function progress(snapshot) {
          var percentage = (snapshot.bytesTransferred /
            snapshot.totalBytes) * 100;
          setProgress(percentage);
        },

        function error(err) {
          console.log("error uploading file", err);
        },

        function complete() {
          console.log("upload complete");
          setProgress(0)
          setFiles(obj)  
          console.log("obj", fileInput.current.value)   
             
          fileInput.current.value = null
        }        
      );        
    })    
  }
  
  //The following code needs to be in a promise
  console.log("files before send", files)
  
  const sendFilename = () => {
      
      props.fileref("test ")
    }
 
  return (
    <div className="App">
      <progress value={progress} max="100" id="uploader">0%</progress>
      <input ref={fileInput} type="file" onChange={handleChange} />
      <span>Filename: {files[0] && files[0].name}</span>  
      {sendFilename()}    
    </div>
  );
}

export default MusicUpload;
