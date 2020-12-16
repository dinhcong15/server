var sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./dataBase/test');
var calculate = require('./calculate')
var mqttRouter = require('./mqtt');
var compare = require('./compare');
var send = require('./sending')
var Data = require('./object')

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
        let increase = await calculate.increase(resultRaw);
        let reduction = await calculate.reduction(resultRaw)

        compare.compareDataSendServer(average, min, max, increase, reduction,  function (result) {
          let message = "";
          let data = new Data.DataSendAsync()
          // console.log(result)
          data.room = result.room;
          //value
          data.temp.temp = { ave: average.temp, min: min.temp, max: max.temp }
          data.humi.humi = { ave: average.humi, min: min.humi, max: max.humi }
          data.light.light = { ave: average.light, light: min.light, max: max.light }
          data.smoke.smoke = average.smoke

          if (result == null) {
            console.log('data empty!')
          } else {
            //deviation
            data.temp.deviation = result.temp.deviation
            data.humi.deviation = result.humi.deviation
            data.light.deviation = result.light.deviation
            data.smoke.deviation = result.humi.deviation.ave
            //flag
            data.temp.warning = result.temp.flag
            data.humi.warning = result.humi.flag
            data.light.warning = result.light.flag
            data.smoke.warning = result.smoke.flag
          }
          
          //////////////////////////////////----------------------//////////////////////////////
          compare.compareDataStandard(average, min, max,async function (resultStandard) {
            if (resultStandard == null) {
              console.log('data empty!')
            }
            else {
              //deviation
              data.temp.deviationStandard = resultStandard.temp.deviation
              data.humi.deviationStandard = resultStandard.humi.deviation
              data.light.deviationStandard = resultStandard.light.deviation
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
              countRoom1 = 0;
              if (data.temp.deviation.ave > 0) {
                message = message + 'room:' + result.room + '|Id:led01|status:ON|999'
                mqttRouter.sendEsp(message)
              } else {
                message = message + 'room:' + result.room + '|Id:led01|status:OFF|999'
                mqttRouter.sendEsp(message)
              }
              message = "";
            }
            if (data.light.warning === true || data.light.warningStandard === true) {
              flagSend = true;
              if (data.light.deviation.ave > 0) {
                message = message + 'room:' + result.room + '|Id:led02|status:ON|999'
                mqttRouter.sendEsp(message)
              } else {
                message = message + 'room:' + result.room + '|Id:led02|status:OFF|999'
                mqttRouter.sendEsp(message)
              }
              message = "";
            }
            if (data.smoke.warning === true || data.smoke.warningStandard === true) {
              flagSend = true;
              if(data.smoke.warningStandard === true){
                message = message + 'room:' + result.room + '|Id:led03|status:ON|999'
                mqttRouter.sendEsp(message)
              }
              message = "";
            }
            if(flagSend ===true ){
              // console.log('1515151515151515')
              send.sendSenSor(data)
              flagSend = false;
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

        compare.compareDataSendServer(average, min, max, function (result) {
          let message = "";
          let data = new Data.DataSendAsync()
          data.room = result.room;
          //value
          data.temp.temp = { ave: average.temp, min: min.temp, max: max.temp }
          data.humi.humi = { ave: average.humi, min: min.humi, max: max.humi }
          data.light.light = { ave: average.light, light: min.light, max: max.light }
          data.smoke.smoke = average.smoke

          if (result == null) {
            console.log('data empty!')
          } else {
            //deviation
            data.temp.deviation = result.temp.deviation
            data.humi.deviation = result.humi.deviation
            data.light.deviation = result.light.deviation
            data.smoke.deviation = result.humi.deviation.ave
            //flag
            data.temp.warning = result.temp.flag
            data.humi.warning = result.humi.flag
            data.light.warning = result.light.flag
            data.smoke.warning = result.smoke.flag
          }
          
          //////////////////////////////////----------------------//////////////////////////////
          compare.compareDataStandard(average, min, max,async function (resultStandard) {
            if (resultStandard == null) {
              console.log('data empty!')
            }
            else {
              //deviation
              data.temp.deviationStandard = resultStandard.temp.deviation
              data.humi.deviationStandard = resultStandard.humi.deviation
              data.light.deviationStandard = resultStandard.light.deviation
              //flag
              data.temp.warningStandard = resultStandard.temp.flag
              data.humi.warningStandard = resultStandard.humi.flag
              data.light.warningStandard = resultStandard.light.flag             
            }
            // console.log(data)
            //////////////////////////////////----------------------//////////////////////////////
            if (data.temp.warning === true || data.temp.warningStandard === true) {
              if (data.temp.deviation.ave > 0) {
                message = message + 'room:' + result.room + '|Id:led01|status:ON|999'
                mqttRouter.sendEsp(message)
              } else {
                message = message + 'room:' + result.room + '|Id:led01|status:OFF|999'
                mqttRouter.sendEsp(message)
              }
              message = "";
            }
            if (data.light.warning === true || data.light.warningStandard === true) {
              if (data.light.deviation.ave > 0) {
                message = message + 'room:' + result.room + '|Id:led02|status:ON|999'
                mqttRouter.sendEsp(message)
              } else {
                message = message + 'room:' + result.room + '|Id:led02|status:OFF|999'
                mqttRouter.sendEsp(message)
              }
              message = "";
            }
            if (data.smoke.warning === true || data.smoke.warningStandard === true) {
              if (data.smoke.deviation.ave > 0) {
                message = message + 'room:' + result.room + '|Id:led03|status:ON|999'
                mqttRouter.sendEsp(message)
              } else {
                message = message + 'room:' + result.room + '|Id:led03|status:OFF|999'
                mqttRouter.sendEsp(message)
              }
              message = "";
            }
            send.sendSenSorOneMin(data);
            console.log('1min--------------------------')
            
          })     
        });///
        }
      });
  },


}

