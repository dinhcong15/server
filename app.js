var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// global.DB =  new sqlite3.Database('./dataBase/test')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mqttRouter = require('./model/mqtt');
var mySqlite = require('./model/db')
var NodeData = require('./model/nodeData')
var myProcess = require('./model/process')
var format = require('./model/dataFormat')
var check = require('./model/checking')
var nodeData = new NodeData();
var calculate = require('./model/calculate')
var app = express();


mqttRouter.connect()

setInterval(function(){
  myProcess.myProcess();
}, 12000)

setInterval(function(){
  myProcess.oneMin();
}, 60000)


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
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
