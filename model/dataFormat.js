var sqlite3 = require('sqlite3').verbose()
var dataBase = require('./db')
dataBase.connect('./dataBase/test', function(err) {
    if(err)
    throw err;
});

module.exports = {
    async disassembleEsp(message) {
        var arrSaveDB =[] ;
        var arr = String(message).split('|');
        arr.forEach(function(value){
            arrT = String(value).split(':') 
            arrSaveDB.push(arrT[1])
        })       

        var date = new Date();
        if(Number(arrSaveDB[0])==1){
            var sql ='INSERT INTO rawData (room, temp, humi, light, smoke, time) VALUES (?,?,?,?,?,?)'
            var params = [  
                arrSaveDB[1],
                parseFloat(parseFloat(arrSaveDB[2]).toFixed(2)),
                parseFloat(parseFloat(arrSaveDB[3]).toFixed(2)),
                parseFloat(parseFloat(arrSaveDB[4]).toFixed(2)),
                parseFloat(parseFloat(arrSaveDB[5]).toFixed(2)),
                date
            ]
            //sqlite3 khong ho tro async nen chi dung callback
            dataBase.insert(sql, params, function(err){
                if(err)
                    console.log(err);
            });
        }
        else if (Number(arrSaveDB[0])==2){
            var sql ='INSERT INTO device (room, led01, led02, led03) VALUES (?,?,?,?)'
            var params = [arrSaveDB[1],arrSaveDB[2],arrSaveDB[3],arrSaveDB[4]]
            dataBase.insert(sql, params, function(err){
                if(err)
                    console.log(err);
            })
        }
        return  
    },
    //nhan tu server
    disassembleStandardServer(message){             
        let db = new sqlite3.Database('./dataBase/test');
        var date = new Date();
        var sql ='INSERT INTO standard (room, temp, humi, light, smoke, time) VALUES (?,?,?,?,?,?)'
        var params =[message.room, message.temp,message.hummi,message.light,message.smoke, message.time]
            
    },
    
}