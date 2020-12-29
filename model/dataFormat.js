var sqlite3 = require('sqlite3').verbose()
var Data = require('./object')
let db = new sqlite3.Database('./dataBase/test');
var send = require('./aSend')
var mqttRouter = require('./mqtt');

module.exports = {
    async disassembleEsp(message) {
        let arrSaveDB =[] ;
        let arrCheck=[];
        let arr = []
        arr = String(message).split('|');
        // console.log(arr)
        arr.forEach(function(value){
            let arrT = String(value).split(':') 
            arrCheck.push(arrT[0])
            arrSaveDB.push(arrT[1])
        })       

        let date = new Date();
        if(Number(arrSaveDB[0])===1 && arrCheck[0]== "flag"){
            let sql ='INSERT INTO rawData (room, temp, humi, light, smoke, time) VALUES (?,?,?,?,?,?)'
            let params = [  
                arrSaveDB[1],
                parseFloat(parseFloat(arrSaveDB[2]).toFixed(2)),
                parseFloat(parseFloat(arrSaveDB[3]).toFixed(2)),
                parseFloat(parseFloat(arrSaveDB[4]).toFixed(2)),
                parseFloat(parseFloat(arrSaveDB[5]).toFixed(2)),
                date
            ]
            //sqlite3 khong ho tro async nen chi dung callback
            db.run(sql, params, function(err){
                if(err)
                    console.log(err);
            });
        }
        if (Number(arrSaveDB[0])===2 && arrCheck[0]== "flag"){
            let data = new Data.DataDevice();
            data.room = Number(arrSaveDB[1]);
            data.id = arrSaveDB[2];
            data.status = arrSaveDB[3];

            let sql ="select * from devices where id = ?"
            let params = [arrSaveDB[2]]
            db.get(sql, params, function(err, result){
                if(err)
                    console.log(err);
                else if(result==null){
                    sql ="insert into devices (id, room, status) values (?,?,?)"
                    params = [arrSaveDB[2], arrSaveDB[1], arrSaveDB[3]]
                    db.run(sql, params, function(errr){
                        if(err)
                            console.log(errr);
                    })
                }else{
                    sql ="update devices set status = ? where id = ?"
                    params = [arrSaveDB[3], arrSaveDB[2]]
                    db.run(sql, params, function(errr){
                        if(errr)
                            console.log(err);
                    })
                    // send.sendevice(data);
                }
            })
            
        }  
    },
    //nhan chuan tu server
    disassembleStandardServer(message){             
        var time = new Date();
        var sql ='INSERT INTO standard (room, temp, humi, light, smoke, time) VALUES (?,?,?,?,?,?)'
        var params =[message.room, message.temp,message.hummi,message.light,message.smoke, time]
        db.run(sql, params, function(errr){
            if(err)
                console.log(errr);
        })           
    },


    //nhan device tu server
    disassembleDeviceServer(message){  
        console.log(message)           
        var sql ='update devices set status = ? where id = ?'
        var params =["ON", message.id]
        db.run(sql, params, function(errr){
            if(errr)
                console.log(errr);
        }) 
        let idd = message.id.slice(2, 7)
        //send esp
        let mess = ''
        mess = 'room:0' + message.room + '|Id:'+ idd +'|status:' + "ON"
        mqttRouter.sendEsp(mess)          
    },
    
}