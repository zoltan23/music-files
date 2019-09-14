import React, {useState, useEffect} from 'react'
import { db } from '../../services/firebase'
import './MusicFileList.css'


function MusicFileList() {
    const [musicFiles, setMusicFiles] = useState([])

    useEffect(() => {
        db.collection('music').onSnapshot(snapshot => {
            let musicArr = []
            snapshot.forEach(doc => musicArr.push({...doc.data(), id: doc.id}))
            setMusicFiles(musicArr)
        })
    }, [])

function deleteItem (e) {
        let id = e.target.id
        db.collection("music").doc(id).delete().then(function () {
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
            <span>Filname: {file.filename}</span>
            <span><input type="text" onChange={updateItem} defaultValue={updateItem}></input></span>
            <span>{file.note}</span>
            <span><button id={file.id} onClick={deleteItem}>Remove File</button></span>
          </li>
        ))}
      </ul>
    </section>
    )
}

export default MusicFileList