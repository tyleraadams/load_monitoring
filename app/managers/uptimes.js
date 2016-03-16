var Uptime = require('../models/uptime');
var exec   = require('child_process').exec;
var command = 'uptime';

var UptimeManager = function () {
  function init () {
    setInterval(function() {
      exec(command, function (err, stdout, stderr){
        var oneMinuteUptimeValue = stdout.match(/\d+\.\d*/)[0] || 0;
        var uptime = new Uptime({value: oneMinuteUptimeValue});
        uptime.save();

      });
    }, 10000);
  }
  return {init:init};
}


module.exports = UptimeManager;
