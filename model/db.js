var sqlite3 = require('sqlite3').verbose()


module.exports={
  mySqlite(){
    let db = new sqlite3.Database('./dataBase/test', (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the test database.');
    });

    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Close the database connection.');
    });

  }
}

    