var express = require('express');
var router = express.Router();
// const http = require('http');
var sendServer = require('./sendServer')
/* GET home page. */
router.get('/standard', function(req, res, next) {
    let data = await sendServer.standard(req.body.question);
    // res.json(data);
});

module.exports = router;
