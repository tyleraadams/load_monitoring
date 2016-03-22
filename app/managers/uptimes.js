'use strict';
const Uptime = require('../models/uptime');
const exec   = require('child_process').exec;
const command = 'uptime';

const UptimeManager = function () {};

/*
  UptimeManager init every ten seconds, it executes the uptime shell command and creates a new Uptime model with the value set to the result of the one minute average of the shell command output and saves it to db
*/
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
