let fetch = require('node-fetch');
// let myProcess = require('./process')
module.exports = {
    sendSenSorOneMin(obj) {
        let a ={
            room: obj.room,
            temp: {temp: obj.temp.temp, x:false, y:false},
            humid: {humid: obj.humi.humi, x:false, y:false},
            light: {light: obj.light.light, x:false, y:false},
            smoke:{smoke: obj.smoke.smoke, x:false, y:false},
            time: obj.time,
        }

        fetch("http://localhost:8400/data/add", {    
            method:"post",
            headers:{
                "content-Type":"application/json"
            },
            body:JSON.stringify(a)
        })
        .then(res=> res.json())
        .then(data=>{
            console.log(data)
            
        }).catch(err=>{
        console.log(err)
        })
    },
    
    reSendData(data){
        fetch("http://localhost:8400/data/resend", {
          method:"post",
          headers:{
              "content-Type":"application/json"
          },
          body:JSON.stringify(data)
        }).then(res=>res.json())
        .then(data1=>{
            console.log(data1)
            if(data1.error){
                console.log("error!!!")
            }
            else{
              console.log("reSend ok!!!")
            }
        }).catch(err=>(
            console.log(err)
        ))
      },

    sendevice(data){
        fetch("http://localhost:8400/room/device", {
            method:"post",
            headers:{
                "content-Type":"application/json"
            },
            body:JSON.stringify(data)
        }).then(res=>res.json())
        .then(data1=>{
            console.log(data1)
            if(data1.error){
                console.log("error!!!")
            }
            else{
                console.log("Send device!!!")
            }
        }).catch(err=>(
            console.log(err)
        ))
    },


    // checkServer() {    
    //     function checkStatus(res) {
    //         if (res.ok) { // res.status >= 200 && res.status < 300
    //             myProcess.connected();
    //             // console.log('1')
    //             return res;
    //         } else {
    //             // console.log('2')
    //             myProcess.disconnected();
    //         }
    //     }

    //     fetch('http://localhost:8400/data/check')
    //     .then(checkStatus)
    //     .then(res => console.log('will not get here...'))
    //     .catch(err=>{
    //         myProcess.disconnected();
    //         console.log(err)
    //     })
    // },

    sendSenSor(obj) {
        console.log('sendsensor')
        let a ={
            room: obj.room,
            temp: {temp: obj.temp.temp, x:false, y:false},
            humid: {humid: obj.humi.humi, x:false, y:false},
            light: {light: obj.light.light, x:false, y:false},
            smoke:{smoke: obj.smoke.smoke, x:false, y:false},
            time: obj.time,
        }
        fetch("http://localhost:8400/data/add2", {
        method:"post",
        headers:{
            "content-Type":"application/json"
        },
        body:JSON.stringify(a)
        }).then(res=>res.json())
        .then(data=>{
            console.log("/////////////////")
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
}