import React, { useState, useEffect } from 'react'
import { db, storage, auth } from '../../services/firebase'
import './MusicFileList.css'
let musicRef
const deleteItem = (e) => {
 let id = e.target.id
 const user = auth.currentUser
 db.collection('music').doc(user.uid).collection('musicId').doc(id).delete().then(function () {
   console.log("Doc successfully deleted");
 }).catch(function (error) {
   console.log("Error removing document", error);
 })
}
const MusicFileList = (props) => {
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
       setMusicFiles(pp)
     })
   })
 }, [])
 console.log('musicFIles', musicFiles)
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
           <audio controls>
             <source src={file.filePath} type="audio/wav" />
           </audio>
         </li>
       ))}
     </ul>
   </section>
 )
}
export default MusicFileList
