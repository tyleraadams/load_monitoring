

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
var Uptime;
models.forEach(function (model) {

  Uptime = require(model);
});
var app = express();

require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

// var os = require('os');
// setInterval(function() {
//   console.log(Uptime)
//   var uptime = new Uptime({value: os.uptime()});
//   uptime.save();
//   console.log(uptime);
// }, 10000);

