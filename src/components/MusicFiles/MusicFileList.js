import React, { useState, useEffect } from 'react'
import { db, storage, auth } from '../../services/firebase'
import './MusicFileList.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Classify from './Classify.js'
import '../../../src/icons/my-icons-collection/font/flaticon.css'

let musicRef
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

const MusicFileList = (props) => {
  console.log("props in list", props)
  const [musicFiles, setMusicFiles] = useState([])
  const [authId, setAuthId] = useState('')

  useEffect(() => {

    auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        setAuthId(firebaseUser.uid)
        console.log("firebaseUSer", firebaseUser);
        const user = auth.currentUser
        musicRef = db.collection('music').doc(user.uid).collection('musicId');
        musicRef.onSnapshot(snapshot => {
          var p = []
          let count = 0
          snapshot.forEach(doc => {
            p.push(new Promise((resolve, reject) => {
              var docData = doc.data()
              console.log('docData', docData)
              try {
                var pathReference = storage.ref(docData.filePath);
                pathReference.getDownloadURL().then(path => {
                  docData.filePath = path
                  console.log("pathReference", pathReference.location.path)
                  docData.fileLocation = pathReference.location.path
                  console.log('count', ++count)
                  resolve({ ...docData, id: doc.id })
                })
              } catch (e) {
                console.log('error processing url', e)
                console.log('count', ++count)
                resolve({ ...docData, id: doc.id })
              }
            }))
          })
          Promise.all(p).then(pp => {
            console.log('setting music files', pp.length)
            console.log('pp', pp)
            setMusicFiles(pp)
          })
        })
      } else {
        setAuthId('')
      }
    });
  }, [])

  const listHeader = () => {
    if (musicFiles.length > 0) {
      return (
        <div>
          <h2>Uploaded Files</h2>
        </div>
      )
    }
  }

  return (
    <div className="container">

      {listHeader()}
      {musicFiles.map(file => (
        <div className="row h-100 justify-content-center align-items-center" key={file.id} >
          <div className="col-sm-3">Filename: <a href={file.filePath}>{file.filename}</a></div>
          <div className="col-sm-1"><Classify /></div>
          <div className="col-sm-3"><FontAwesomeIcon icon={faMusic} />&nbsp;{file.note}</div>
          <div className="col-sm-4">
            <audio controls>
              <source src={file.filePath} type="audio/wav" />
            </audio>&nbsp; &nbsp;
            <FontAwesomeIcon className="fa-3x align" id="buttonAlert" color="red" icon={faTrashAlt} id={file.id} onClick={e => deleteItem(file.id, file.fileLocation)} />
          </div>

        </div>
      ))}
    </div>
  )
}
export default MusicFileList
