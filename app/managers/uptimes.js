'use strict';
var Uptime = require('../models/uptime');
var exec   = require('child_process').exec;
var command = 'uptime';

var UptimeManager = function () {};

UptimeManager.prototype.init = function () {
  setInterval(function () {
    exec(command, function (err, stdout, stderr){
      const oneMinuteUptimeValue = stdout.match(/\d+\.\d*/)[0] || 0;
      const uptime = new Uptime({value: oneMinuteUptimeValue});
      uptime.save();
    });
  }, 10000);
};

module.exports = UptimeManager;
