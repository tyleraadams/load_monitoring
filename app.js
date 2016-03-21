'use strict';
const express = require('express');
const config = require('./config/config');
const glob = require('glob');
const mongoose = require('mongoose');
mongoose.connect(config.db);
const db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

const models = glob.sync(config.root + '/app/models/*.js');
const managers = glob.sync(config.root + '/app/managers/*.js');

models.forEach(function (model) {
  require(model);
});

managers.forEach(function (manager) {
  let scope = {};
  scope[manager] = require(manager);
  new scope[manager]().init();
});

const app = express();

require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});






