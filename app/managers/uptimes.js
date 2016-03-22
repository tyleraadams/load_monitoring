'use strict';
const Uptime = require('../models/uptime');
const exec   = require('child_process').exec;
const command = 'uptime';

const UptimeManager = function () {};

UptimeManager.prototype.init = function () {
  setInterval(function () {
    exec(command, function (err, stdout) {
      const oneMinuteUptimeValue = stdout.match(/\d+\.\d*/)[0] || 0;
      const uptime = new Uptime({ value: oneMinuteUptimeValue });
      uptime.save();
    });
  }, 10000);
};

module.exports = UptimeManager;
