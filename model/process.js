var sqlite3 = require('sqlite3').verbose()
const fetch = require('node-fetch');
module.exports = {
  myProcess() {
    let db = new sqlite3.Database('./dataBase/test', (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the test database.');
    });

    db.serialize(() => {
      var sql = 'select * from data order by timer desc limit ?'
      var params = 4
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
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Close the database connection.');
    });
  },

  checkData(){           
    // if(parseFloat(arr[2])>27){              
    //     var message = "1";
    //     client.publish(settings.topic, message);  
    // }
    // else if(parseFloat(arr[2])<=27){
    //     var message = "2";
    //     client.publish(settings.topic, message);
    // }
    let db = new sqlite3.Database('./dataBase/test');
    var sql = 'select * from data order by timer desc limit ?'
    var params = 5
    db.each(sql, params, function (err, result) {
        if (err) {
            console.error(err)
            return;
        }
        else {
            console.log(result)
            console.log("--------------------------")
        }
    });
    db.close();   
  },

  sendServer() {
    // let emai = "dd"
    // let password = "ddx"
    let todo = {
      userId: 123,
      title: "Ok thông đường",
      completed: false
    }

    fetch("http://localhost:3000/s", {
      method:"post",
      headers:{
          "content-Type":"application/json"
      },
      body:JSON.stringify({
          todo
      })
    }).then(res=>res.json())
    .then(data=>{
        console.log(data)
        if(data.error){
            console.log("error!!!@")
        }
        else{
          console.log("OK!!!")
            // history.push('/home')
        }
    }).catch(err=>(
        console.log(err)
    ))
  },

}

