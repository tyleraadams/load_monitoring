'use strict';
const Alert = require('../models/alert.js');
const Uptime = require('../models/uptime.js');
const calculateAverage = require('../helpers/calculateAverage');
const alertThreshold = 1.9;
const AlertManager = function () {
  this.isInAlertState = false;
  this.alert = null;
};

AlertManager.prototype.init = function () {
  const self = this;
  setInterval(function () {
    const promise = new Promise(function (resolve) {
      Uptime.findLastTwoMinutes(function (uptimes) {
        return resolve(uptimes);
      });
    });
    promise.then(function (results) {
      let avg = calculateAverage(results.map(function (item) { return  parseFloat(item.value); }));
      self.determineAlertState(avg);
    });
  }, 10000);
};

AlertManager.prototype.createAlert =  function (dataPoint) {
  let alert = new Alert({
    load: dataPoint
  });
  this.alert = alert;
  this.isInAlertState = true;
  alert.save();
};

AlertManager.prototype.recoverAlert = function () {
  const self = this;
  if (this.alert) {
    this.updateAlertWithRecovery(this.alert);
    this.alert = null;
  } else {
    new Promise(function (resolve) {
      Alert.findOne().sort({ created_at: -1 }).exec(function (err, alert) {
        return resolve(alert);
      });
    }).then(function (result) {
      self.updateAlertWithRecovery(result);
    });
  }
  this.isInAlertState = false;
};

AlertManager.prototype.updateAlertWithRecovery = function (alertObject) {
  let now = new Date();
  alertObject.recovered_at = now;
  alertObject.save();
};

AlertManager.prototype.determineAlertState =  function (avg) {
  if (avg > alertThreshold && !this.isInAlertState) {
    this.createAlert(avg);
  } else if (avg < alertThreshold && this.isInAlertState) {
    this.recoverAlert(avg);
  }
};

module.exports = AlertManager;
