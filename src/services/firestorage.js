import React from 'react'
 const firebase = require("firebase");
// require("firebase/storage");

function firestorage () {
    console.log("this is firestore.js");
    // var firebaseConfig = {
    //     apiKey: "AIzaSyCV9k_NxmqvPzdXPVK0S3ct3H6f5HBTU4g",
    //     authDomain: "fir-1-cc935.firebaseapp.com",
    //     databaseURL: "https://fir-1-cc935.firebaseio.com",
    //     projectId: "fir-1-cc935",
    //     storageBucket: "fir-1-cc935.appspot.com",
    //     messagingSenderId: "427472136142",
    //     //appId: "1:427472136142:web:6f3b26a30037ac8b"
    //   };
    //   // Initialize Firebase
    //   firebase.initializeApp(firebaseConfig);
    
      //Get elements
      var uploader = document.getElementById('uploader');
      var fileButton =  document.getElementById('fileButton');
    
      //Listen for file selection
      fileButton.addEventListener('change', function(e) {
      
      //Get file
      var file = e.target.files[0];
        console.log("file" , file);
      //Create a storage ref
      var storageRef = firebase.storage().ref('sweet_gifs/' + file.name);
        console.log("storageRef", storageRef);
      //Upload file
      var task = storageRef.put(file);
    
      //Update progress bar
      task.on('state_changed', 
      
          function progress(snapshot) {
              var percentage = (snapshot.bytesTransferred /
              snapshot.totalBytes ) * 100;
              uploader.value = percentage;
          },
    
          function error(err) {
              console.log("error uploading file");
          },
    
          function complete() {
              console.log("upload complete");
          }
      );
    
      });
    
}

export default firestorage;


