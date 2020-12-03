var express = require('express');
var router = express.Router();
// const http = require('http');
var process = require('../model/process')

/* GET home page. */
router.post('/server/disconnect',async function(req, res) {
  process.resend(req.body.time, function(data){
    console.log(data)
    res.json(data);
  });
  
});

module.exports = router;
