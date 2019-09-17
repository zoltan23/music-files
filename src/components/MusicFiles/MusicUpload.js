import React, { useState, useRef } from 'react';
import firebase from 'firebase'
import { storage } from '../../services/firebase'
import { v4 } from 'uuid';

const MusicUpload = () => {
  let uid = firebase.auth().currentUser.uid
  console.log("firebase auth id: ", uid)

  
  const [progress, setProgress] = useState(0)
  const [files, setFiles] = useState({})
  const fileInput = useRef();
  var storageRef, file, rnd , img
   
  const handleChange = e => {
    e.preventDefault();

    const files = e.target.files
    console.log(files)
    console.log(typeof(files))
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
          setFiles(obj)
          fileInput.current.value = null
        }
        
      );
        
    })
    var storageRef2 = firebase.storage().ref();
     img = storageRef2.child('football_pics/25d3a732-0842-4f50-af90-764a9cf1bcb7_lsu1.jpg').getDownloadURL().then( url => {
      console.log("url", url)
    })
  }
  
 


  return (
    <div className="App">
      <progress value={progress} max="100" id="uploader">0%</progress>
      <input ref={fileInput} type="file" onChange={handleChange} />
      <span>Filename: {files[0] && files[0].name}</span>
      
    </div>
  );
}

export default MusicUpload;
