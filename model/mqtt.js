var mqtt = require('mqtt');
var mySqlite = require('./db')
var sqlite3 = require('sqlite3').verbose()

var settings = {
    mqttServerUrl : "192.168.137.66",
    port : 18833,
    topic : "AAA"
}
var client = mqtt.connect('mqtt://' + settings.mqttServerUrl);

module.exports={
    connect(){
        console.log('Connect Mqtt')
        client.on('connect', function(){
            client.subscribe(settings.topic)
            console.log("Subscribed topic " + settings.topic);
        })
        
        client.on('message', function(topic, message){
            console.log(message.toString());
            disassemble(message);
        })

        
        function disassemble (message) {
            // console.log(message);
            var arrDB =[] ;
            var arr = String(message).split('|');
            arr.forEach(function(value){
                arrT = String(value).split(':') 
                arrDB.push(arrT[1])
            })
            console.log(arrDB)  
            
            checkData(arrDB)

            let db = new sqlite3.Database('./dataBase/test', (err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('Connected to the test database.');
            });
            var sql ='INSERT INTO Data (Topic, timer, nhietdo, doam) VALUES (?,?,?,?)'
            var params =[arrDB[0],arrDB[1], arrDB[2], arrDB[3]]
            db.run(sql, params, function (err, result) {
                if (err){
                    console.error(err)
                    return;
                }
                else{
                    console.log(result)
                }
            });
        }

        function checkData(arr){
            if(arr[2]>50){
                console.log("canh bao nhiet do cao")
            }
        }
        
    }


}