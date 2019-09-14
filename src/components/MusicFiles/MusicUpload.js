import React, { useState, useRef } from 'react';
import firebase from 'firebase'
import { storage } from '../../services/firebase'
import { v4 } from 'uuid';

const MusicUpload = () => {

  const [progress, setProgress] = useState(0)
  const [files, setFiles] = useState({})
  const fileInput = useRef();

  const handleChange = e => {
    e.preventDefault();

    const files = e.target.files
    console.log(files)
    console.log(typeof(files))
    let obj = { files: files, value : e.target.value }
    setFiles(obj);

    Object.keys(obj.files).forEach(k => {
      let file = obj.files[k]
      let rnd = v4()
      console.log(rnd)
      var storageRef = firebase.storage().ref(`football_pics/${rnd}_${file.name}`);
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

  }

  const fileUploadHandler = () => {
    console.log("file uploader button fired")
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
