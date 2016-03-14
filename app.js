

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
  require(model);
});
var app = express();

require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});
var Uptime = require(config.root + '/app/models/uptime.js');
var Alert = require(config.root + '/app/models/alert.js');
// var os = require('os');
var exec   = require('child_process').exec;
var command = 'uptime';
setInterval(function() {
  exec(command, function (err, stdout, stderr){
    var oneMinuteUptimeValue = stdout.match(/\d+\.\d*/)[0];
    var uptime = new Uptime({value: oneMinuteUptimeValue});
    uptime.save();

    if (oneMinuteUptimeValue > 1) {
      var alert = new Alert({load:oneMinuteUptimeValue, time: uptime.created_at, uptime: uptime.id});
      alert.save();
    }
    // console.log(JSON.stringify(uptime));
  });
}, 10000);

