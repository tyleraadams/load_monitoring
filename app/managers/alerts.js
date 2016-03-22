'use strict';
const Alert = require('../models/alert.js');
const Uptime = require('../models/uptime.js');
const calculateAverage = require('../helpers/calculateAverage');
const alertThreshold = 1;
const AlertManager = function () {
  this.isInAlertState = false;
  this.alert = null;
};

/*
  AlertManager init finds the last two minutes worth of uptime data from DB, calculates the average,
  and then runs its own determineAlertState fn on that avg every ten seconds
*/
AlertManager.prototype.init = function () {
  const self = this;
  setInterval(function () {
    const promise = new Promise(function (resolve) {
      Uptime.findLastTwoMinutes(function (err, uptimes) {
        return resolve(uptimes);
      });
    });
    promise.then(function (results) {
      let avg = calculateAverage(results.map(function (item) { return  parseFloat(item.value); }));
      self.determineAlertState(avg);
    });
  }, 10000);
};

/*
  AlertManager createAlert creates an instance Alert model with load average,
  saves to DB, and sets alert state to true
  @parameter {Number} dataPont the avg load
 */
AlertManager.prototype.createAlert =  function (dataPoint) {
  let alert = new Alert({
    load: dataPoint
  });
  this.alert = alert;
  this.isInAlertState = true;
  alert.save();
};

/*
  AlertManager recoverAlert finds the latest alert and calls updateAlertWithRecovery on it
  and then turns off alert state
 */
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

/*
  AlertManager updateAlertWithRecovery assigns recovered_at datetime to now and saves to DB
  @parameter {Object} alertObject an instance of Alert model that has already been instantiated
*/
AlertManager.prototype.updateAlertWithRecovery = function (alertObject) {
  let now = new Date();
  alertObject.recovered_at = now;
  alertObject.save();
};

/*
  AlertManager determineAlertState creates an alert if average is higher than alert threshold and we
  we are not in alert state, recovers an alert if we are in alert state and average has dipped below
  threshold, or does nothing
  @parameter {Number} avg  average load over the last two minutes
*/
AlertManager.prototype.determineAlertState =  function (avg) {
  if (avg > alertThreshold && !this.isInAlertState) {
    this.createAlert(avg);
  } else if (avg < alertThreshold && this.isInAlertState) {
    this.recoverAlert(avg);
  }
};

module.exports = AlertManager;
