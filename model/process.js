var sqlite3 = require('sqlite3').verbose()

module.exports={
  myProcess(){
    let db = new sqlite3.Database('./dataBase/test', (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the test database.');
    });

    db.serialize(() => {
      var sql ='select * from data order by nhietdo desc limit ?'
      var params =10
      db.all(sql, params, function (err, result) {
          if (err){
              console.error(err)
              return;
          }
          else{
              // console.log(result);
              var x = parseFloat("0.0");
              result.forEach(function(row){
                var y = parseFloat(row.NhietDo);
                x=x+y;
                
              })
              x=x/10;
              console.log(x)
              
          }
      });
    });

    function process(mess){

    }

    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Close the database connection.');
    });

  }
}

    