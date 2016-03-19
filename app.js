'use strict';
var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
var managers = glob.sync(config.root + '/app/managers/*.js');

models.forEach(function (model) {
  require(model);
});

managers.forEach(function (manager) {
  let scope = {};
  scope[manager] = require(manager);
  new scope[manager]().init();
  // console.log(new require(manager)().init());
  // new require(manager)().init();
});


// var Alert = require(config.root + '/app/managers/alerts');
// var alert = new Alert();
// alert.init();

var app = express();

require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});






