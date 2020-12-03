var sqlite3 = require('sqlite3').verbose()
// const db = require('./db');
// var dataBase = require('./db')
// dataBase.connect('./dataBase/test', function(err) {
//     if(err)
//     throw err;
// });
let db = new sqlite3.Database('./dataBase/test');

module.exports = {
    async disassembleEsp(message) {
        let arrSaveDB =[] ;
        let arr = String(message).split('|');
        arr.forEach(function(value){
            arrT = String(value).split(':') 
            arrSaveDB.push(arrT[1])
        })       

        let date = new Date();
        if(Number(arrSaveDB[0])==1){
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
        else if (Number(arrSaveDB[0])==2){
            let sql ="select * from devices where id = ?"
            let params = [arrSaveDB[2]]
            db.get(sql, params, function(err, result){
                if(err)
                    console.log(err);
                else if(result==null){
                    sql ="insert into devices (id, room, status) values (?,?,?)"
                    params = [arrSaveDB[2], arrSaveDB[1], arrSaveDB[3]]
                    db.run(sql, params, function(err){
                        if(err)
                            console.log(err);
                    })
                }else{
                    sql ="update devices set status = ? where id = ?"
                    params = [arrSaveDB[3], arrSaveDB[2]]
                    db.run(sql, params, function(err){
                        if(err)
                            console.log(err);
                    })
                }
            })
            
        }  
    },
    //nhan tu server
    disassembleStandardServer(message){             
        let db = new sqlite3.Database('./dataBase/test');
        var date = new Date();
        var sql ='INSERT INTO standard (room, temp, humi, light, smoke, time) VALUES (?,?,?,?,?,?)'
        var params =[message.room, message.temp,message.hummi,message.light,message.smoke, message.time]
            
    },
    
}