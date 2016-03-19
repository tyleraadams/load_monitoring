var Alert = require('../models/alert.js');
var Uptime = require('../models/uptime.js');
const calculateAverage = require('../helpers/calculateAverage');

const AlertManager = function () {
  this.isInAlertState = false;
};

AlertManager.prototype.init = function () {
  'use strict';
  const self = this;
  setInterval(function() {
    const promise = new Promise(function(resolve, reject) {
      Uptime.findLastTwoMinutes(function (err, uptimes){
        return resolve(uptimes);
      });
    });

    promise.then(function(results) {
      let avg = calculateAverage(results.map(function (item) { return  parseFloat(item.value); }));
      console.log(avg);
      self.determineAlertState(avg);
    }).catch(
      function(reason) {
          console.error('Handle rejected promise ('+reason+') here.');
      });
  }, 10000);
};

AlertManager.prototype.createAlert =  function (dataPoint, isRecovery) {
  'use strict';
  let alert = new Alert({
    load:dataPoint,
    isRecovery: isRecovery
  });
  alert.save();

};

AlertManager.prototype.determineAlertState =  function  (avg) {
  'use strict';
  if (avg > 1) {
    this.createAlert(avg, false);
     this.isInAlertState = true;
  } else if (avg < 1 && this.isInAlertState) {
    this.createAlert(avg, true);
    this.isInAlertState = false;
  }
};

module.exports = AlertManager;
