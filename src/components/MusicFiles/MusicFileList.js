import React, { useState, useEffect } from 'react'
import { db, storage, auth } from '../../services/firebase'
import './MusicFileList.css'

function MusicFileList(props) {
  console.log("props in list", props)
  const [musicFiles, setMusicFiles] = useState([])

  const [authId, setAuthId] = useState('')
  auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      setAuthId(firebaseUser.uid)
      console.log("firebaseUSer", firebaseUser);
    } else {
      setAuthId('')
    }
  });

  useEffect(() => {
    const user = auth.currentUser
    let musicRef = db.collection('music').doc(user.uid).collection('musicId');
    musicRef.onSnapshot(snapshot => {
      var p = []
      snapshot.forEach((doc) => {
        let pp = new Promise((resolve, reject) => {
          var docData = doc.data()
          var pathReference = storage.ref(docData.filePath);
          pathReference.getDownloadURL().then(url => {
            docData.url = url
            console.log('docData', docData)
            var asdf = { ...docData, id: doc.id }
            resolve(asdf)
          })
        })
        p.push(pp)
      })

      Promise.all(p).then(arr => {
        console.log("arr ######", arr)
        setMusicFiles(arr)
      })
    })
  }, [])

  function deleteItem(e) {
    let id = e.target.id
    const user = auth.currentUser
    db.collection('music').doc(user.uid).collection('musicId').doc(id).delete().then(function () {
      console.log("Doc successfully deleted");
    }).catch(function (error) {
      console.log("Error removing document", error);
    })
  }

  function updateItem(e) {
    console.log("update item fired!!!:", e.target.value)
    //   let id = e.target.id
    //   db.collection("music").doc(id).set({
    //     filename: e.target.value
    //   })
    //     .then(function () {
    //       console.log("Document successfully written!");
    //     })
    //     .catch(function (error) {
    //       console.error("Error writing document: ", error);
    //     })
  }
  const downloadFile = (e, name) => {
    console.log('name', name)

  }

  return (
    <section className="">
      <h2>Uploaded Files</h2>

      <ul className="music-list ul">

        {musicFiles.map(file => (
          <li className="music-list li" key={file.id} >
            <span>Filename: <a href={file.url}>{file.filename}</a></span>
            <span>Note: {file.note}</span>
            <span>User id: {authId}</span>
            <span><button id={file.id} onClick={deleteItem}>Remove File</button></span>
            <img src={file.url} height="50" width="50" />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default MusicFileList