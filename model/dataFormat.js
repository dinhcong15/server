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
                }
            })
            
        }  
    },
    //nhan tu server
    disassembleStandardServer(message){             
        // var date = new Date();
        // var sql ='INSERT INTO standard (room, temp, humi, light, smoke, time) VALUES (?,?,?,?,?,?)'
        // var params =[message.room, message.temp,message.hummi,message.light,message.smoke, message.time]
            
    },
    
}