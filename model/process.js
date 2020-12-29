let sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./dataBase/test');
let check = require('./checking');
let send = require('./aSend')
const fetch = require('node-fetch');
module.exports = {
  myProcess() {
    check.checkData('01', 4);  
    check.checkData('02', 4);
    check.checkData('03', 4);
    // this.a('01', 5)
  },

  oneMin(){
    check.checkDataOneMin('01', 15);
    check.checkDataOneMin('02', 15);
    check.checkDataOneMin('03', 15);
  },
  
}

