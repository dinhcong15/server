var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

global.flagS = false 

var indexRouter = require('./routes/index');
var mqttRouter = require('./model/mqtt');
var send = require('./model/aSend')
// var NodeData = require('./model/nodeData')
var myProcess = require('./model/process')
var format = require('./model/dataFormat')
var checkSer = require('./model/checkServer')
// var nodeData = new NodeData();
var calculate = require('./model/calculate')
var app = express();
// var cors = require('cors');

mqttRouter.connect()

// setInterval(function(){
//   myProcess.myProcess();
// }, 6000)

// setInterval(function(){
//   myProcess.oneMin();
// }, 3000)

setInterval(function(){
  checkSer.checkServer();
  // checkSer.reSend()
}, 6000)

// let a = true; let b = false
// myProcess.a()
// console.log(global.flagS)
// if(global.flagS===true){
  
//   checkSer.reSend()
// }
// send.reSendData('s');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// mqttRouter.connect

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
