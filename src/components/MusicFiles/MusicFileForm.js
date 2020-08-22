import React, { useState, useRef } from 'react'
import { db } from 'firebase'
import MusicFileList from './MusicFileList'
import { storage } from 'firebase'
import { v4 } from 'uuid';
import { useSelector } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css';
import './MusicFileForm.css'

function MusicFileForm() {
  var storageRef, file, rnd, storagePath
  const fileInput = useRef();
  const [note, setNote] = useState('')
  const [progress, setProgress] = useState(0)
  const [files, setFiles] = useState({})
  const [isUploaded, setIsUploaded] = useState(false)

  const uid = useSelector(state => state.authReducer.uid)

  const submitHandler = event => {
    event.preventDefault()
  }

  const addFile = e => {
    e.preventDefault();
    Object.keys(files.files).forEach(k => {
      file = files.files[k]
      rnd = v4()
      storagePath = `music_files/${uid}/${rnd}.wav`
      storageRef = storage.ref(storagePath);
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
          const fileNameTemp = file.name
          const filePathTemp = storageRef.location.path
          db.collection("music").doc(uid).collection('musicId').doc().set({
            filePath: filePathTemp,
            filename: fileNameTemp,
            note: note
          }).then(s => {
            fileInput.current.value = null
            setIsUploaded(false)
          });
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
    setIsUploaded(true)
  }

  return (
    <>
      <div className="card">
        <div className="card-body">
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
              <button className="btn btn-primary" type="submit" disabled={(isUploaded && note) ? false : true} onClick={addFile}>Upload File</button>
            </div>
          </form>
        </div>
      </div>
      <div><MusicFileList userId={uid} /></div>
    </>
  )
}

export default MusicFileForm