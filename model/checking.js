var sqlite3 = require('sqlite3').verbose()
var dataBase = require('./db')
dataBase.connect('./dataBase/test', function (err) {
    if (err)
        throw err;
});
var calculate = require('./calculate')
var mqttRouter = require('./mqtt');


module.exports = {
    // cStandard() {
    //     var sql = 'select * from standard where room = ? order by time desc '
    //     db.get(sql, '01', function (err, result) {
    //         if (err) {
    //             console.error(err)
    //             return;
    //         }
    //         else {
    //             console.log(result)
    //         }
    //     });

    //     db.close();
    // },

    selectCheckData(sql, params) {
        db.all(sql, params, async function (err, result) {
            if (err) {
                console.error(err)
                return;
            }
            else {
                let average = await calculate.average(result);
                console.log(average)
                let max = await calculate.max(result)
                console.log(max);
                let min = await calculate.min(result)
                console.log(min);
                // mqttRouter.sendEsp("server get stauts device")
                // mqttRouter.sendEsp("room:01|Id:01led01|status:ON|700")
            }
        });
        db.close((err) => {
            console.log('close db')
        });

    },

    compareDataStandard(data, callback) {
        let obj = {
            room: '',
            temp: {
                value: 0,
                flag: false
            },
            humi: {
                value: 0,
                flag: false
            },
            light: {
                value: 0,
                flag: false
            },
            smoke: {
                value: 0,
                flag: false
            },
        }
        obj.room = ave.room;

        var sql = 'select * from standard where room = ? order by time desc limit 1'
        dataBase.selectEach(sql, ave.room, function (err, result) {
            if(err){
                callback(err);
            }
            else if(result==''){
                callback(null);
            
            }else{
                if (Math.abs(ave.temp - result[0].temp) > 1) {
                    obj.temp.flag = true;
                    // obj.temp.value= ave.temp - result[0].temp;
                }  
                if (Math.abs(ave.humi - result[0].humi) > 5) {
                    obj.humi.flag = true;
                    // obj.temp.value = ave.temp - result[0].temp
                }  
                if (Math.abs(ave.light - result[0].light) > 50) {
                    obj.light.flag = true;
                    // obj.light.value = ave.light - result[0].light
                }  
                if (ave.smoke - result[0].smoke > 0) {
                    obj.smoke.flag = true;
                    // obj.smoke.value = ave.smoke - result[0].smoke
                }
                obj.temp.value = ave.temp - result[0].temp
                obj.temp.value = parseFloat(obj.temp.value.toFixed(2))
                obj.humi.value = ave.humi - result[0].humi
                obj.humi.value = parseFloat(obj.humi.value.toFixed(2))
                obj.light.value = ave.light - result[0].light
                obj.light.value = parseFloat(obj.light.value.toFixed(2))
                obj.smoke.value = ave.smoke - result[0].smoke
                obj.smoke.value = parseFloat(obj.smoke.value.toFixed(2))
                
                callback(obj);
            }               
        });
    },

    compareDataSendServer(ave, min, max, callback) {
        let obj = {
            room: '',
            temp: {
                value: 0,
                flag: false
            },
            humi: {
                value: 0,
                flag: false
            },
            light: {
                value: 0,
                flag: false
            },
            smoke: {
                value: 0,
                flag: false
            },
        }
        obj.room = ave.room;

        var sql = 'select * from dataSendServer where room = ? order by time desc limit 1'
        dataBase.selectEach(sql, ave.room, function (err, result) {
            if(err){
                callback(err);
            }
            else if(result==''){
                callback(null);
            
            }else{
                if (Math.abs(ave.temp - result[0].temp) > 0.5) {
                    obj.temp.flag = true;
                    // obj.temp.value= ave.temp - result[0].temp;
                }  
                if (Math.abs(ave.humi - result[0].humi) > 2) {
                    obj.humi.flag = true;
                    // obj.temp.value = ave.temp - result[0].temp
                }  
                if (Math.abs(ave.light - result[0].light) > 20) {
                    obj.light.flag = true;
                    // obj.light.value = ave.light - result[0].light
                }  
                if (ave.smoke - result[0].smoke > 0) {
                    obj.smoke.flag = true;
                    // obj.smoke.value = ave.smoke - result[0].smoke
                }
                obj.temp.value = ave.temp - result[0].temp
                obj.temp.value = parseFloat(obj.temp.value.toFixed(2))
                obj.humi.value = ave.humi - result[0].humi
                obj.humi.value = parseFloat(obj.humi.value.toFixed(2))
                obj.light.value = ave.light - result[0].light
                obj.light.value = parseFloat(obj.light.value.toFixed(2))
                obj.smoke.value = ave.smoke - result[0].smoke
                obj.smoke.value = parseFloat(obj.smoke.value.toFixed(2))
                
                callback(obj);
            }          
            
        });

    },

}

