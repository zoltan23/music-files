import React, { useState, useRef } from 'react'
import Card from '../UI/Card'
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from '../../services/firebase'
import './MusicFileForm.css'
import './MusicUpload'
import MusicFileList from './MusicFileList'
import firebase from '../../services/firebase'
import { v4 } from 'uuid';
import { callbackify } from 'util';
function MusicFileForm() {
  var storageRef, file, rnd, fileref, storagePath
  const fileInput = useRef();
  //State varialbes
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState('')
  const [filePath, setFilePath] = useState('')
  const [filename, setFileName] = useState('')
  const [note, setNote] = useState('')
  const [progress, setProgress] = useState(0)
  const [files, setFiles] = useState({})
  let uid = firebase.auth.currentUser.uid
  console.log("firebase auth id: ", uid)
  firebase.auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      console.log('id', firebaseUser.uid)
      setIsLoggedIn(true)
      setUserId(firebaseUser.uid)
      console.log("firebaseUSer", firebaseUser);
    } else {
      setUserId('')
    }
  });
  const submitHandler = event => {
    event.preventDefault()
    console.log("submit handler fired")
  }
  const addFile = e => {
    e.preventDefault();
    console.log("addFile submited")
    Object.keys(files.files).forEach(k => {
      file = files.files[k]
      rnd = v4()
      console.log("rnd", rnd)
      storagePath = `football_pics/${uid}/${rnd}_${file.name}`
      storageRef = firebase.storage.ref(storagePath);
      var task = storageRef.put(file)
      task.then(s => console.log('sssssss', s))
      task.on('state_changed',
        function progress(snapshot) {
          var percentage = (snapshot.bytesTransferred /
            snapshot.totalBytes) * 100;
          setProgress(percentage);
        },
        function error(err) {
          console.log("error uploading file", err);
        },
        function complete(c) {
          console.log("upload complete");
          setProgress(0)
          console.log("C upload completed:", c)
          // callbackSetFileName(storagePath)
          setFileName(fileInput.current.value)
          setFilePath(storagePath)
          fileInput.current.value = null
          db.collection("music").doc(userId).collection('musicId').doc().set({
            //db.collection(userId).doc().set({
            filePath: filePath,
            filename: filename,
            note: note
          });
          console.log("addFile filename", filePath)
        }
      );
    })
  }
  const getNote = e => {
    setNote(e.target.options[e.target.selectedIndex].text)
  }
  const handleChange = e => {
    e.preventDefault();
    const files = e.target.files
    let obj = { files: files, value: e.target.value }
    setFiles(obj);
    
  }
  return (
    <div>
      <div class="card">
        <div class="card-body">
          <form className="form-inline justify-content-center" onSubmit={submitHandler}>
            <div className="App">
              <progress value={progress} max="100" id="uploader">0%</progress>
              <input ref={fileInput} type="file" onChange={handleChange} />
              <span>{files[0] && files[0].name}</span>
            </div>
            <div className="form-group mr-2">
              <select className="form-control" onChange={getNote}>
                <option defaultValue="selected">Note associated with file:</option>
                <option value="Fb">Concert F-flat</option>
                <option value="F">Concert F-natural</option>
                <option value="F#">Concert F-sharp</option>
              </select>
            </div>
            <div className="form-group mr-2">
              <button className="btn btn-primary" type="submit" onClick={addFile}>Upload File</button>
            </div>
          </form>
        </div>
      </div>
      <div>Filename: {filePath} </div>
      <div><MusicFileList userId={userId} /></div>
    </div>
  )
}
export default MusicFileForm