var sqlite3 = require('sqlite3').verbose()
const fetch = require('node-fetch');

module.exports = {
  sendSenSorOneMin(data) {
    fetch("http://localhost:3000/rasp/onemin", {
      method:"post",
      headers:{
          "content-Type":"application/json"
      },
      body:JSON.stringify(data)
    }).then(res=>res.json())
    .then(data=>{
        console.log(data)
        if(data.error){
            console.log("error!!!")
        }
        else{
          console.log("OK!!!")
        }
    }).catch(err=>(
        console.log(err)
    ))
  },

  sendSenSor(data) {
    fetch("http://localhost:3000/rasp/async", {
      method:"post",
      headers:{
          "content-Type":"application/json"
      },
      body:JSON.stringify(data)
    }).then(res=>res.json())
    .then(data=>{
        console.log(data)
        if(data.error){
            console.log("error!!!")
        }
        else{
          console.log("OK!!!")
        }
    }).catch(err=>(
        console.log(err)
    ))
  },


  sendevice(data){
      fetch("http://localhost:3000/rasp/device", {
        method:"post",
        headers:{
            "content-Type":"application/json"
        },
        body:JSON.stringify(data)
      }).then(res=>res.json())
      .then(data=>{
          console.log(data)
          if(data.error){
              console.log("error!!!")
          }
          else{
            console.log("Send device!!!")
          }
      }).catch(err=>(
          console.log(err)
      ))
  },

}

