// var config = require('../config/config');
var Alert = require('../models/alert.js');
var Uptime = require('../models/uptime.js');

var AlertManager = function (latestDataPoints) {
  var isInAlertState = false;
  // var latestDataPoints = [];
  function init () {
    setInterval(function() {

    Uptime.findLastTwoMinutes(function (err, uptimes){
      if (!latestDataPoints) {
        latestDataPoints = uptimes;
      }
      var avg = calculateAvg(latestDataPoints.map(function (item) {return  parseFloat(item.value)}));
      if (avg > 1 ) {
        createAlert(avg);
      } else if (avg < 1 && isInAlertState) {
        createAlert(avg);
        isInAlertState = false;
      }
      console.log(isInAlertState)

    });
    }, 10000);

    return isInAlertState;
  }
  function createAlert (dataPoint) {
    var alert = new Alert({
      load:dataPoint
      // time: uptime.created_at,
      // uptime: uptime.id
    });
    alert.save();
    isInAlertState = true;
  }
  function calculateAvg (arr) {
    if (arr.length) {
      return arr.reduce(function (prevItem, currItem) {
        return prevItem + currItem;
      }) / arr.length;
    }
  }

  return {
    init: init
  };
};
module.exports = AlertManager;
