var mqtt = require('mqtt');
var format = require('./dataFormat')

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
            // if(err){
            //     console.error("err: "+err);
            // }
            
            client.subscribe(settings.topic, function(err){
                if (!err) {
                    console.log("Subscribed topic " + settings.topic);
                }
                else 
                    console.error(err);
            })
            
           
        });
        
        client.on('message', function(topic, message){
            console.log("Message: " + message.toString());
            format.disassembleEsp(message);           
        })       
    },
    sendEsp(message){
        client.publish(settings.topic, message);
        console.log("send esp")
    }
}