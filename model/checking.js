var sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./dataBase/test');
var calculate = require('./calculate')
var mqttRouter = require('./mqtt');
var compare = require('./compare');
var sending = require('./aSend')
var Data = require('./object')
// let fetch = require('node-fetch');
module.exports = {
  async checkData(room, number) {
    var sql = 'select * from rawData where room = ? order by time desc limit ?'
    var params = [room, number]
    
    db.all(sql, params, async function (err, resultRaw) {
      if(err){
        console.log(err);
      }
      else if(resultRaw==''){
          console.log(null);        
      }
      else {
        let average = await calculate.average(resultRaw);
        let max = await calculate.max(resultRaw);
        let min = await calculate.min(resultRaw);
        // let increase = await calculate.increase(resultRaw);
        // let reduction = await calculate.reduction(resultRaw)

        compare.compareDataSendServer(average, min, max, function (result) {
          let message = "";
          let data = new Data.DataSendAsync()
          // console.log(result)
          data.room = result.room;
          //value
          data.temp.temp = average.temp;
          data.humi.humi = average.humi;
          data.light.light = average.light;
          data.smoke.smoke = average.smoke;
          // data.time = new Date();
          // console.log(result)
          // data.temp.temp = { ave: average.temp, min: min.temp, max: max.temp }
          // data.humi.humi = { ave: average.humi, min: min.humi, max: max.humi }
          // data.light.light = { ave: average.light, light: min.light, max: max.light }
          
          if (result == null) {
            console.log('data empty!')
          } else {
            //deviation
            // data.temp.deviation = result.temp.deviation
            // data.humi.deviation = result.humi.deviation
            // data.light.deviation = result.light.deviation
            // data.smoke.deviation = result.humi.deviation.ave
            //flag
            data.temp.warning = result.temp.flag
            data.humi.warning = result.humi.flag
            data.light.warning = result.light.flag
            data.smoke.warning = result.smoke.flag
          }
          
          //////////////////////////////////----------------------//////////////////////////////
          compare.compareDataStandard(average, min, max, async function (resultStandard) {
            if (resultStandard == null) {
              console.log('data empty!')
            }
            else {
              //deviation
              // data.temp.deviationStandard = resultStandard.temp.deviation
              // data.humi.deviationStandard = resultStandard.humi.deviation
              // data.light.deviationStandard = resultStandard.light.deviation
              // data.smoke.deviationStandard = resultStandard.humi.deviation.ave
              //flag
              data.temp.warningStandard = resultStandard.temp.flag
              data.humi.warningStandard = resultStandard.humi.flag
              data.light.warningStandard = resultStandard.light.flag
              data.smoke.warningStandard = resultStandard.smoke.flag
            }

            //////////////////////////////////----------------------//////////////////////////////
            // console.log(data);
            let flagSend = false;
            if (data.temp.warning === true || data.temp.warningStandard === true) {
              flagSend = true;
              // countRoom1 = 0;
              if(data.temp.warning === true){
                if (result.temp.deviation.ave > 0 ) {
                  message = message + 'room:' + result.room + '|Id:led01|status:OFF'
                  mqttRouter.sendEsp(message)
                } else {
                  message = message + 'room:' + result.room + '|Id:led01|status:ON'
                  mqttRouter.sendEsp(message)
                }
                message = "";
              }
              
              if(data.temp.warningStandard === true){
                if (resultStandard.temp.deviation.ave > 0 ) {
                  message = message + 'room:' + result.room + '|Id:led01|status:OFF'
                  mqttRouter.sendEsp(message)
                } else {
                  message = message + 'room:' + result.room + '|Id:led01|status:ON|ss'
                  mqttRouter.sendEsp(message)
                }
                message = "";
              }
            }
            if (data.light.warning === true || data.light.warningStandard === true) {
              flagSend = true;
              if(data.light.warning === true){
                console.log(result.light.deviation.ave)
                if (result.light.deviation.ave > 0) {
                  message = message + 'room:' + result.room + '|Id:led02|status:OFF'
                  mqttRouter.sendEsp(message)
                } else {
                  message = message + 'room:' + result.room + '|Id:led02|status:ON'
                  mqttRouter.sendEsp(message)
                }
                message = "";
              }
              
              if(data.light.warningStandard === true){
                if (resultStandard.light.deviation.ave > 0 ) {
                  message = message + 'room:' + result.room + '|Id:led02|status:OFF'
                  mqttRouter.sendEsp(message)
                } else {
                  message = message + 'room:' + result.room + '|Id:led02|status:ON|ss'
                  mqttRouter.sendEsp(message)
                }
                message = "";
              }
              
            }
            if (data.smoke.warning === true || data.smoke.warningStandard === true) {
              flagSend = true;
              if(data.smoke.warningStandard === true){
                message = 'warning from pi' + '|room:' + result.room 
                mqttRouter.sendEsp(message)
              }
              message = "";
            }
            if(flagSend ===true ){
              // console.log(data)
              sending.sendSenSor(data);
              let sql1 ='INSERT INTO dataSendServer (room, temp, humi, light, smoke, time) VALUES (?,?,?,?,?,?)';
              let params1 = [  
                data.room,
                data.temp.temp,
                data.humi.humi,
                data.light.light,
                data.smoke.smoke,
                new Date()
              ]
              //sqlite3 khong ho tro async nen chi dung callback
              db.run(sql1, params1, function(err1){
                  if(err1)
                      console.log(err1);
              });
            }
          })
        });///
        }
      });
  },

  

  async checkDataOneMin(room, number) {
    var sql = 'select * from rawData where room = ? order by time desc limit ?'
    var params = [room, number]
    db.all(sql, params, async function (err, resultRaw) {
      if (err) {
        console.error(err)
        return;
      }
      else {
        let average = await calculate.average(resultRaw);
        let max = await calculate.max(resultRaw);
        let min = await calculate.min(resultRaw);
        // let increase = await calculate.increase(resultRaw);
        // let reduction = await calculate.reduction(resultRaw)

        compare.compareDataSendServer(average, min, max, function (result) {
          let message = "";
          let data = new Data.DataSendAsync()
          data.room = result.room;
          //value
          data.temp.temp = average.temp
          data.humi.humi = average.humi
          data.light.light = average.light
          data.smoke.smoke = average.smoke

          if (result == null) {
            console.log('data empty!')
          } else {
            //deviation
            // data.temp.deviation = result.temp.deviation
            // data.humi.deviation = result.humi.deviation
            // data.light.deviation = result.light.deviation
            // data.smoke.deviation = result.humi.deviation.ave
            //flag
            data.temp.warning = result.temp.flag
            data.humi.warning = result.humi.flag
            data.light.warning = result.light.flag
            data.smoke.warning = result.smoke.flag
          }
          
          //////////////////////////////////----------------------//////////////////////////////
          compare.compareDataStandard(average, min, max, async function (resultStandard) {
            // console.log(resultStandard)
            if (resultStandard == null) {
              console.log('data empty!')
            }
            else {
              //deviation
              // data.temp.deviationStandard = resultStandard.temp.deviation
              // data.humi.deviationStandard = resultStandard.humi.deviation
              // data.light.deviationStandard = resultStandard.light.deviation
              //flag
              data.temp.warningStandard = resultStandard.temp.flag
              data.humi.warningStandard = resultStandard.humi.flag
              data.light.warningStandard = resultStandard.light.flag 
              data.smoke.warningStandard = resultStandard.smoke.flag            
            }
            // console.log(data)
            //////////////////////////////////----------------------//////////////////////////////
            if (data.temp.warning === true || data.temp.warningStandard === true) {
              if(data.temp.warning === true){
                if (result.temp.deviation.ave > 0) {
                  message = message + 'room:' + result.room + '|Id:led01|status:OFF'
                  mqttRouter.sendEsp(message)
                } else {
                  message = message + 'room:' + result.room + '|Id:led01|status:ON'
                  mqttRouter.sendEsp(message)
                }
                message = "";
              }
              
              if(data.temp.warningStandard === true){
                if (resultStandard.temp.deviation.ave > 0) {
                  message = message + 'room:' + result.room + '|Id:led01|status:OFF'
                  mqttRouter.sendEsp(message)
                } else {
                  message = message + 'room:' + result.room + '|Id:led01|status:ON'
                  mqttRouter.sendEsp(message)
                }
                message = "";
              } 
            }

            if (data.light.warning === true || data.light.warningStandard === true) {
              if(data.light.warning === true){
                if (result.light.deviation.ave > 0) {
                  message = message + 'room:' + result.room + '|Id:led02|status:OFF'
                  mqttRouter.sendEsp(message)
                } else {
                  message = message + 'room:' + result.room + '|Id:led02|status:ON'
                  mqttRouter.sendEsp(message)
                }
                message = "";
              }  

              if(data.light.warningStandard === true){
                if (resultStandard.light.deviation.ave > 0) {
                  message = message + 'room:' + result.room + '|Id:led02|status:OFF'
                  mqttRouter.sendEsp(message)
                } else {
                  message = message + 'room:' + result.room + '|Id:led02|status:ON'
                  mqttRouter.sendEsp(message)
                }
                message = "";
              }  
            }
            if (data.smoke.warning === true || data.smoke.warningStandard === true) {
              if (data.smoke.warningStandard === true) {
                message = 'warning from pi' +'|room:'+ resultStandard.room 
                mqttRouter.sendEsp(message)
              } 
              message = "";
            }
            let date = new Date();
            data.time = date
            // console.log(data)
            calculate.min(resultRaw);
            
            sending.sendSenSorOneMin(data); 
            

              let sql1 ='INSERT INTO dataSendServer (room, temp, humi, light, smoke, time) VALUES (?,?,?,?,?,?)';
              let params1 = [  
                data.room,
                data.temp.temp,
                data.humi.humi,
                data.light.light,
                data.smoke.smoke,
                new Date()
              ]
              //sqlite3 khong ho tro async nen chi dung callback
              db.run(sql1, params1, function(err1){
                  if(err1)
                      console.log(err1);
              });

              
            
          })   
           
        });///
        }
      });
  },


}

