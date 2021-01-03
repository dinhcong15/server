let fetch = require('node-fetch');
var sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./dataBase/test');
let send = require('./aSend')

module.exports = {
    checkServer() {    
        async function checkStatus(res) {
            if (res.ok) { // res.status >= 200 && res.status < 300
                // this.connected();
                return res;
            } else {
                // this.disconnected();
                throw res.statusText;
            }
        }
        fetch('http://localhost:8400/data/check',)
        .then(checkStatus)
        .then(res => {
            // console.log('will not get here...')
            this.connected();
        })
        .catch(err=>{
            this.disconnected();
            console.log(err)
        })
    },

    disconnected(){
        let boo = false
        let time = new Date()
        let sql = "SELECT * FROM checkServer ORDER BY id DESC LIMIT ?"
        let params = 1;
        db.get(sql, params,async function(err, result){
            // console.log(result)
            if(err)
                console.log(err);
            else if(result==undefined){
              console.log("null");        
            }
            else if(result.status === 1){
                sql ="insert into checkServer (time, status, count) values (?,?, ?)"
                params = [time, boo, 1]
                db.run(sql, params, function(errr){
                    if(err)
                        console.log(errr);
                })
            }else if(result.status === 0){
                sql ="update checkServer set count = ? where id = ?"
                params = [result.count + 1, result.ID]
                db.run(sql, params, function(errr){
                    if(errr)
                        console.log(err);
                });
            }
        });
      },
    
      connected(){
        let boo = true
        let time = new Date()
        let sql = "SELECT * FROM checkServer ORDER BY id DESC LIMIT ?"
        let params = 1;
        db.get(sql,params,async  function(err, result){
            console.log(result)
            if(err)
                console.log(err);
            else if(result.status === 0){               
                sql ="insert into checkServer (time, status, count) values (?,?,?)"
                params = [time, boo, 0]
                db.run(sql, params, function(errr){
                    if(errr)
                        console.log(errr);
                })
                ///////
                sql = "SELECT * FROM checkServer where status = 0  ORDER BY id DESC LIMIT ?";
                params = 1;
                db.get(sql, params, function(err3, result3){
                if(err3){
                    console.log(err3);
                }else if(result3==undefined){
                    console.log("null");        
                }
                else {
                    console.log(result3);
                    sql = 'select * from dataSendServer where time >= ? limit ?'
                    params = [result3.time, result3.count]
                    db.all(sql, params, async function (err31, resultSend) {
                    if (err31) {
                        console.error(err31)
                        return;
                    }else{
                        console.log(resultSend);
                        send.reSendData(resultSend)
                    }
                    });
                }
                });  
            }
            
        });    
      },
 
}