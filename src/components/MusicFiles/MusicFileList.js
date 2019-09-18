import React, {useState, useEffect} from 'react'
import firebase from '../../services/firebase'
import { db } from '../../services/firebase'
import './MusicFileList.css'

function MusicFileList(props) {  
    
    const [musicFiles, setMusicFiles] = useState([])

    const [authId, setAuthId] = useState('')
    firebase.auth.onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {        
          setAuthId(firebaseUser.uid)
          console.log("firebaseUSer", firebaseUser);
        } else {
          setAuthId('')
        }
      });
     
      
    useEffect(() => {  
        const user = firebase.auth.currentUser
        let musicRef = db.collection('music').doc(user.uid).collection('musicId');
        musicRef.onSnapshot(snapshot => {
          let musicArr = []
          snapshot.forEach(doc => {
          musicArr.push({...doc.data(), id: doc.id})
          })
        setMusicFiles(musicArr)
        })
    }, [])

function deleteItem (e) {
        let id = e.target.id
        const user = firebase.auth.currentUser
        db.collection('music').doc(user.uid).collection('musicId').doc(id).delete().then(function () {
            console.log("Doc successfully deleted");
        }).catch(function (error) {
            console.log("Error removing document", error);
        })
    }

  function updateItem (e) {
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

    return (
    <section className="">
      <h2>Uploaded Files</h2>
        <ul className="music-list ul">
        {musicFiles.map(file => (
          <li className="music-list li" key={file.id} >
            <span>Filename: {props.filename}</span>
            <span><input type="text" onChange={updateItem} defaultValue={updateItem}></input></span>
            <span>{file.note}</span>
            <span>User id: {authId}</span>
            <span><button id={file.id} onClick={deleteItem}>Remove File</button></span>
          </li>
        ))}
      </ul>
    </section>
    )
}

export default MusicFileList