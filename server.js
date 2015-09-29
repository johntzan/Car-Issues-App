var express = require('express');
require('newrelic');
var path = require('path');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var car_routes = require('./routes/car.routes');

var Car = require('./models/car.model');

var app = express();


// view engine setup |||||||||||||||||||| Using regular html to view pages.
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hjs');

// Database 
//mongoose.connect('mongodb://carissuesapp@gmail.com:builtwithnode0213@ds051863.mongolab.com:51863/heroku_2w2xr5ds');
//mongodb://localhost:27017/carsTest

var options = { server: { socketOptions: { connectTimeoutMS: 30000 }}};

mongoose.connect(process.env.MONGOLAB_URI, options, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'client'))); //makes every file in /client folder accessible to server
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/client/views/index.html');
});

// The above app.use(express.static(path.join(__dirname, 'client'))); makes below unnecessary
// app.use('/js', express.static(__dirname + '/client/js'));
// app.use('/styles', express.static(__dirname + '/client/styles'));
// app.use('/imgs', express.static(__dirname + '/client/imgs'));
// app.use('/fonts', express.static(__dirname + '/client/fonts'));

car_routes(app); //must be declared after bodyParser() or else problems occur with JSON

//app.use('/cars', car_routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;