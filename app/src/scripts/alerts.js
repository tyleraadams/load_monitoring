var poll = require('./utils').poll;
var $ = require('jquery');

module.exports = function () {
  var alertsContainer = document.getElementById('alerts-container');
  function init() {
    poll(function () {
      fetchAlert();
    }, function(){}, function(){}, null, 10000);
  }
  function fetchAlert () {
    $.get('/alerts', function (newAlert,err) {
      addToDOM(constructAlertDOM(newAlert));
    });
  }
  function constructAlertDOM (alertObj) {
    console.log(alertObj);
    var alert = document.createElement('h2');
    var message = 'High load generated an alert - load = ' + alertObj.load+ ', triggered at ' + alertObj.created_at;
    alert.classList.add('headline', 'alert');

    if (alertObj.isRecovery) {
      message = 'Alert recovered at ' +  alertObj.created_at;
    }

    alert.textContent = message
    return alert;
  }
  function addToDOM(el) {
    alertsContainer.insertBefore(el, alertsContainer.firstChild);
  }
  return {
    init:init
  };
};
