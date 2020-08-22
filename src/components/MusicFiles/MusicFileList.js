import React, { useState, useEffect } from 'react'
import { db, storage, auth } from '../../services/firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Classify from './Classify.js'
import '../../../src/icons/my-icons-collection/font/flaticon.css'
import { useSelector } from 'react-redux'
import './MusicFileList.css'

const MusicFileList = (props) => {

  const [musicFiles, setMusicFiles] = useState([])
  const uid = useSelector(state => state.authReducer.uid)

  const listHeader = () => {
    if (musicFiles.length > 0) {
      return (
        <div>
          <h2>Uploaded Files</h2>
        </div>
      )
    } else {
      return (
        <div>
          <h2>You don't have any uploaded files currently!</h2>
        </div>
      )
    }
  }

  // Prevent inifinte loop caused by rerender
  useEffect(() => {
    const musicRef = db.collection('music').doc(uid).collection('musicId');
    musicRef.onSnapshot(snapshot => {
      var p = []
      snapshot.forEach(doc => {
        p.push(new Promise((resolve, reject) => {
          var docData = doc.data()
          try {
            var pathReference = storage.ref(docData.filePath);
            pathReference.getDownloadURL().then(path => {
              docData.filePath = path
              docData.fileLocation = pathReference.location.path
              resolve({ ...docData, id: doc.id })
            })
          } catch (e) {
            resolve({ ...docData, id: doc.id })
          }
        }))
      })
      Promise.all(p).then(pp => {
        setMusicFiles(pp)
      })
    })
  }, [uid])

  return (
    <div className="container">
      {listHeader()}
      {musicFiles.map(file => (
        <div className="row h-100 justify-content-center align-items-center" key={file.id} >
          <div className="col-sm-3">Filename: <a href={file.filePath}>{file.filename}</a></div>
          <div className="col-sm-1"><Classify /></div>
          <div className="col-sm-3"><FontAwesomeIcon icon={faMusic} />&nbsp;{file.note}</div>
          <div className="col-sm-4">
            <AudioComponent file={file} />
            <FontAwesomeIcon className="fa-3x align" color="red" icon={faTrashAlt} id={file.id} onClick={e => deleteItem(file.id, file.fileLocation)} />
          </div>
        </div>
      ))}
    </div>
  )
}

const deleteItem = (docId, fileLocation) => {
  let confirmDelete = window.confirm("Are you sure you want to delete me?")
  if (confirmDelete === true) {
    const user = auth.currentUser
    db.collection('music').doc(user.uid).collection('musicId').doc(docId).delete().then(function () {
      console.log("Doc successfully deleted");
    }).catch(function (error) {
      console.log("Error removing document", error);
    })

    //Delete from Storage
    let storageRef = storage.ref()
    console.log("storageRef", storageRef)
    let s = storageRef.child(fileLocation)
    s.delete().then(function () {
      // File deleted successfully
    }).catch(function (error) {
      // Uh-oh, an error occurred!
    });
  }
}

const AudioComponent = (props) => {
  console.log("Audio Component Rendered", props)
  return (<audio controls>
    <source src={props.file.filePath} type="audio/wav" />
  </audio>)
}

export default MusicFileList
