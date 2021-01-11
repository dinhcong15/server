let fetch = require('node-fetch');
let dataFormat = require('./dataFormat')
let sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./dataBase/test');
module.exports = {
    sendSenSorOneMin(obj) {
        let a ={
            room: obj.room,
            temp: {temp: obj.temp.temp, x:false, y:false},
            humi: {humi: obj.humi.humi, x:false, y:false},
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
            // dataFormat.disassembleStandardServer(data)
            var time = new Date();
            var sql = 'update standard set temp = ?, humi = ?, light = ?, smoke = ?, time = ? where room = ?'
            var params = [data.temp, data.humi, data.light, data.smoke, time, data.id]
            db.run(sql, params, function (errr) {
                if (errr)
                    console.log(errr);
            })
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

    sendSenSor(obj) {
        console.log('sendsensor')
        let a ={
            room: obj.room,
            temp: {temp: obj.temp.temp, x:false, y:false},
            humi: {humi: obj.humi.humi, x:false, y:false},
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
}