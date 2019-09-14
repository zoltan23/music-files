import React, {useState} from 'react'
import Card from '../UI/Card'
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from '../../services/firebase'
import firestorage from '../../services/firestorage'
import './MusicFileForm.css'


function MusicFileForm () {
    const [filename, setFilename] = useState('')
    const [note, setNote] = useState('')
    const submitHandler = event => {
        event.preventDefault()
        console.log("submit handler fired")
    }

    const addFile = e => {
        console.log("addFile submited")
        e.preventDefault();
        db.collection("music").add({
            filename: filename,
            note: note
        });
    }

    const getFilename = e => {
        setFilename(e.target.value)
    }

    const getNote = e => {
        setNote(e.target.options[e.target.selectedIndex].text)
    }   

    const onChange = e => {
        console.log("onChange fired!!!");
        firestorage();
    }
    return (
        <section> 
            <form className="form-inline justify-content-center" onSubmit={submitHandler}>                        
                <div className="form-group mr-2">                                       
                    <input type="file"  id="fileButton" onChange={onChange}/>
                    <progress value="0" max="100 " id="uploader">0%</progress>
                </div>
                <div className="form-group mr-2">                        
                    <select className="form-control" onChange={getNote}>
                                 <option defaultValue="selected">Note associated with file:</option>
                                 <option value="Gb">G-Flat</option>
                                 <option value="G">G-Natural</option>
                                 <option value="G#">G-Sharp</option>
                    </select>
                </div>                       
                <div className="form-group mr-2">
                    <button className="btn btn-primary" type="submit" onClick={addFile}>Upload File</button>  
                </div>                        
                 </form>
             </section>        
 
    )
}

export default MusicFileForm