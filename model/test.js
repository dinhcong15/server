var sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./dataBase/test');
var Data = require('./object');
let  count = 0;
function testFunction (callback)  {
    count = 2;
    callback(count)
} 
function compareDataStandard  (ave, min, max)  {

    var sql = "select * from standard ";
    // db.get(sql, function(err, rs) {
    //     console.log(rs, 'rs');

    // }) ;
    try {
         db.all(sql, function(err, rs) {
            testFunction(function (re) {
                console.log(re)
            });
            
        });
    } catch (e) {
        console.error(e)
        // callback(err);
    }

}

module.exports.compareDataStandard = compareDataStandard;

