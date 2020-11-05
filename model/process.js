var sqlite3 = require('sqlite3').verbose()
const fetch = require('node-fetch');
let db = new sqlite3.Database('./dataBase/test');
var calculate = require('./calculate')
var mqttRouter = require('./mqtt');


module.exports = {
  myProcess() {
    db.serialize(() => {
      var sql = 'select * from rawData order by time desc limit ?'
      var params = 5
      db.all(sql, params, function (err, result) {
        if (err) {
          console.error(err)
          return;
        }
        else {
          console.log(result);
          var x = parseFloat("0.0");
          count = 0;
          result.forEach(function (row) {
            var y = parseFloat(row.NhietDo);
            if (!isNaN(y)) {
              x = x + y;
              count++;
            }
          })
          if (count != 0) {
            x = x / count;
            x = parseFloat((x).toFixed(2));
          } else {
            console.log("Input err")
          }
          // x = Math.round(x,-2)
          console.log(x)
        }
      });
    });
    db.close();
  },  

   checkData(){           
    var sql = 'select * from rawData order by time desc limit ?'
    var params = 5

    var x = parseFloat("0.0");
    var count = 0;
    db.all(sql, params,async function (err, result) {
          if (err) {
              console.error(err)
              return;
          }
          else {
              let average =await calculate.average(result);
              console.log(average)
              let max = await calculate.max(result)
              console.log(max);
              let min = await calculate.min(result)
              console.log(min);
              // mqttRouter.sendEsp("server get stauts device")
              mqttRouter.sendEsp("room:01|Id:01led01|status:ON|700")
          }
      });
    db.close((err)=>{
      console.log('close db')
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

