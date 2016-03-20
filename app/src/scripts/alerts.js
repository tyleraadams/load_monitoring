var poll = require('./utils').poll;
var $ = require('jquery');

module.exports = function () {
  var alertsContainer = document.getElementById('alerts-container');
  var currentAlert;
  function init() {
    poll(function () {
      fetchAlert();
    }, function(){}, function(){}, null, 10000);
  }
  function fetchAlert () {
    $.get('/alerts', function (latestAlert,err) {
      if (!currentAlert && latestAlert) {
        currentAlert = latestAlert;
      }
      if (latestAlert && currentAlert._id !== latestAlert._id) {
        currentAlert = latestAlert;
        addToDOM(constructAlertDOM(latestAlert));
      }
    });
  }
  function constructAlertDOM (alertObj) {
    var alert = document.createElement('h2');
    var message = 'High load generated an alert - load = ' + alertObj.load+ ', triggered at ' + alertObj.created_at;
    alert.classList.add('headline', 'alert');

    if (alertObj.recovered_at) {
      message = 'Alert recovered at ' +  alertObj.recoverd_at;
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
