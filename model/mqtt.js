var mqtt = require('mqtt');
var mySqlite = require('./db')
var sqlite3 = require('sqlite3').verbose()

var settings = {
    mqttServerUrl : "192.168.137.66",
    port : 18833,
    topic : "HOME01"
}
var client = mqtt.connect('mqtt://' + settings.mqttServerUrl);

module.exports={
    connect(){
        console.log('Connect Mqtt')
        client.on('connect', function(){
            client.subscribe(settings.topic, function(err){
                if (!err) {
                    console.log("Subscribed topic " + settings.topic);
                }
                else 
                    console.error(err);
            })
        })
        
        client.on('message', function(topic, message){
            console.log("Message: " + message.toString());
            disassemble(message);
            
        })

        

        function disassemble (message) {
            // console.log(message);
            var arrSaveDB =[] ;
            var arr = String(message).split('|');
            arr.forEach(function(value){
                arrT = String(value).split(':') 
                arrSaveDB.push(arrT[1])
            })
            // console.log(arrSaveDB) 
            // setInterval(function(){
            //     
            // }, 5000) 
           

            if(!isNaN(arrSaveDB[2])){
                let db = new sqlite3.Database('./dataBase/test', (err) => {
                    if (err) {
                        console.error(err.message);
                    }
                    console.log('Connected to the test database.');
                });
    
                var date = new Date();
                var sql ='INSERT INTO Data (Topic, timer, nhietdo, doam) VALUES (?,?,?,?)'
                var params =[arrSaveDB[0], date, parseFloat(arrSaveDB[2]).toFixed(2), parseFloat(arrSaveDB[3]).toFixed(2)]
                db.run(sql, params, function (err) {
                    if (err){
                        console.error(err)
                        return;
                    }
                    else{
                        console.log("Rows inserted")
                    }
                });

                db.close((err) => {
                    if (err) {
                      console.error(err.message);
                    }
                    console.log('Close the database connection.');
                  });
            }
        }
        
    }


}