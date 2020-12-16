var sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./dataBase/test');
var Data = require('./object')

module.exports = {
    compareDataStandard(ave, min, max,  callback) {
        let obj = new Data.DataCheck()
        obj.room = ave.room;
        obj.temp.value =  {ave: ave.temp, min :min.temp, max: max.temp}
        obj.humi.value = {ave: ave.humi, min :min.humi, max: max.humi}
        obj.light.value = {ave: ave.light, min :min.light, max: max.light}
        obj.smoke.value = ave.smoke

        var sql = 'select * from standard where room = ? order by time desc limit 1'
        db.get(sql, ave.room, function (err, result) {
            // console.log(result)
            if(err){
                callback(err);
            }
            else if(result==''){
                callback(null);        
            }
            else{
                if (Math.abs(ave.temp - result.temp) > 0.5) {
                    obj.temp.flag = true;
                }  
                if (Math.abs(ave.humi - result.humi) > 2) {
                    obj.humi.flag = true;
                }  
                if (Math.abs(ave.light - result.light) > 20) {
                    obj.light.flag = true;
                }  
                if (ave.smoke - result.smoke > 0) {
                    obj.smoke.flag = true;
                }
                obj.temp.deviation = {
                    ave: parseFloat((ave.temp - result.temp).toFixed(2)), 
                    max: parseFloat((max.temp - result.temp).toFixed(2)),
                    min: parseFloat((min.temp - result.temp).toFixed(2))              
                }
                obj.humi.deviation= {
                    ave: parseFloat((ave.humi - result.humi).toFixed(2)),
                    max: parseFloat((max.humi - result.humi).toFixed(2)), 
                    min: parseFloat((min.humi - result.humi).toFixed(2))      
                }
                obj.light.deviation = {
                    ave: parseFloat((ave.light - result.light).toFixed(2)), 
                    min: parseFloat((min.light - result.light).toFixed(2)), 
                    max: parseFloat((max.light - result.light).toFixed(2))
                }
                obj.smoke.deviation = parseFloat((ave.smoke - result.smoke).toFixed(2))        
                callback(obj);
            }                    
        });
    },

    async compareDataSendServer(ave, min, max, increase, reduction, callback) {
        let obj = new Data.DataCheck()
        obj.room = ave.room;
        obj.temp.value =  {ave: ave.temp, min :min.temp, max: max.temp}
        obj.humi.value = {ave: ave.humi, min :min.humi, max: max.humi}
        obj.light.value = {ave: ave.light, min :min.light, max: max.light}
        obj.smoke.value = ave.smoke
        
        var sql = 'select * from dataSendServer where room = ? order by time desc limit 1'
        await db.get(sql, ave.room, function (err, result) {
            // console.log(result+"ss")
            if(err){
                callback(err);
            }
            else if(result==''){
                callback(null);
            
            }else{
                if (Math.abs(ave.temp - result.temp) > 0.5) {
                    //day tang hoac giam
                    if(increase.temp ===true||reduction.temp===true){
                        obj.temp.flag = true;
                    }                   
                }  
                if (Math.abs(ave.humi - result.humi) > 2) {
                    obj.humi.flag = true;
                }  
                if (Math.abs(ave.light - result.light) > 20) {
                    obj.light.flag = true;
                }  
                if (ave.smoke - result.smoke > 10) {
                    obj.smoke.flag = true;
                }
                obj.temp.deviation = {
                    ave: parseFloat((ave.temp - result.temp).toFixed(2)), 
                    max: parseFloat((max.temp - result.temp).toFixed(2)),
                    min: parseFloat((min.temp - result.temp).toFixed(2))              
                }
                obj.humi.deviation= {
                    ave: parseFloat((ave.humi - result.humi).toFixed(2)),
                    max: parseFloat((max.humi - result.humi).toFixed(2)), 
                    min: parseFloat((min.humi - result.humi).toFixed(2))    
                }
                obj.light.deviation = {
                    ave: parseFloat((ave.light - result.light).toFixed(2)), 
                    min: parseFloat((min.light - result.light).toFixed(2)), 
                    max: parseFloat((max.light - result.light).toFixed(2))
                }
                obj.smoke.deviation = parseFloat((ave.smoke - result.smoke).toFixed(2))
                
                callback(obj);
            }          
            
        });

    },

}

