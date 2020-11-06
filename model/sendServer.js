var sqlite3 = require('sqlite3').verbose()
const fetch = require('node-fetch');
module.exports = {
    sSensor() {
        let todo = [
            {
                userId: 1,
                title: "Ok thông đường",
                completed: false
            },
            {
                userId: 2,
                title: "Ok thông đường",
                completed: false
            }
        ]
        

        fetch("http://localhost:3000/sensor", {
            method: "post",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                todo
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    console.log("error!!!@")
                }
                else {
                    console.log("OK!!!")
                }
            }).catch(err => (
                console.log(err)
            ))
    },

    sDevice() {
        let todo = {
            userId: 123,
            title: "Ok thông đường",
            completed: false
        }

        fetch("http://localhost:3000/device", {
            method: "post",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                todo
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    console.log("error!!!@")
                }
                else {
                    console.log("OK!!!")
                }
            }).catch(err => (
                console.log(err)
            ))
    },

    async standard(q) {
        
        return q;
    },

}

