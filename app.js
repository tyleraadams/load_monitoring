

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
  alertManager.init();
});
var Uptime = require(config.root + '/app/models/uptime.js');
var Alert = require(config.root + '/app/models/alert.js');
// var os = require('os');
var exec   = require('child_process').exec;
var command = 'uptime';

var AlertManager = function () {
  var isInAlertState = false;
  var latestDataPoints = [];
  function init () {
    setInterval(function() {

    Uptime.findLastTwoMinutes(function (err, uptimes){
      console.log(uptimes.map(function (item) {return parseFloat(item.value)}));
      if (calculateAvg(uptimes.map(function (item) {return  parseFloat(item.value)})) > 1.0 ) {
        createAlert(calculateAvg(uptimes.map(function (item) {return  parseFloat(item.value)})));
      }
    });
    }, 10000);
  }
  // function acceptDataPoint (dataPoint) {
  //   latestDataPoints.push(dataPoint);
  //   console.log('!!! ', latestDataPoints);
  //   if (latestDataPoints.length === 12) {
  //     latestDataPoints.shift();
  //     if (calculateAvg(latestDataPoints) > 1.0 ) {
  //       createAlert(calculateAvg(latestDataPoints));
  //     }
  //   }
  // }
  function createAlert (dataPoint) {
    var alert = new Alert({
      load:dataPoint
      // time: uptime.created_at,
      // uptime: uptime.id
    });
    alert.save();
  }
  function calculateAvg (arr) {
    console.log(
      arr.reduce(function (prevItem, currItem) {
        return prevItem + currItem;
      }) / arr.length
    );
    return arr.reduce(function (prevItem, currItem) {
      return prevItem + currItem;
    }) / arr.length;
  }

  return {
    init: init
    // acceptDataPoint: acceptDataPoint
  };
};

var alertManager = AlertManager();
setInterval(function() {
  exec(command, function (err, stdout, stderr){
    var oneMinuteUptimeValue = stdout.match(/\d+\.\d*/)[0] || 0;
    var uptime = new Uptime({value: oneMinuteUptimeValue});
    uptime.save();

    // alertManager.acceptDataPoint(parseFloat(oneMinuteUptimeValue));
    // console.log(JSON.stringify(uptime));
  });
}, 10000);

