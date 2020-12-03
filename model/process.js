let sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./dataBase/test');
let check = require('./checking');


module.exports = {
  myProcess() {
    check.checkData('01', 6);  
    check.checkData('02', 6);
    check.checkData('03', 6);
    // this.a('01', 5)
  },

  oneMin(){
    check.checkDataOneMin('01', 20);
    check.checkDataOneMin('02', 20);
    check.checkDataOneMin('03', 20);
  },

  resend(data, callback){
    var sql = 'select * from dataSendServer where time >= ? '
    db.all(sql, data, function (err, result) {
        if(err){
            callback(err);
        }
        else if(result==''){
            callback(null);        
        }
        else{
            callback(result)
        }                    
    });
  },

}

