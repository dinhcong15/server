var sqlite3 = require('sqlite3').verbose()
const fetch = require('node-fetch');
let db = new sqlite3.Database('./dataBase/test');
var calculate = require('./calculate')
var mqttRouter = require('./mqtt');
var check = require('./checking')

module.exports = {
  myProcess() {
    this.checkData('01', 5);
    this.checkData('02', 5);
    this.checkData('03', 5);
    this.checkData('04', 5);  
  },  

   checkData(room, number){           
    var sql = 'select * from rawData where room = ? order by time desc limit ?'
    var params = [room, number]

    db.all(sql, params ,async function (err, result) {
          if (err) {
              console.error(err)
              return;
          }
          else {
              // console.log(result)
              let average = await calculate.average(result);
              // console.log(average)
              let max = await calculate.max(result);
              // console.log(max);
              let min = await calculate.min(result);
              // console.log(min);
              check.compareDataSendServer(average,min,max, function(result){
                // console.log(result)
                if(result==null){
                  console.log('data empty!')
                }
                else if(result.light.flag ==true){
                  var message="";
                  message = message+'room:'+result.room+'|Id:led01|status:ON|999'
                  console.log(result)
                  mqttRouter.sendEsp(message)
                }else{
                  // var message="";
                  // message = message+'room:01|Id:led01|status:ON|1000'
                  console.log(result)
                  // mqttRouter.sendEsp(message)
                  console.log('Normal data!')
                }
              })
          }
      });
      
  },

  sendServer() {
    // let emai = "dd"
    // let password = "ddx"
    let data = {
      id: 123,
      temp: 33,
      humi: 80,
      light:400
    }

    fetch("http://localhost:3000/rasp", {
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

}

