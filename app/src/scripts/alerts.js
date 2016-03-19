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
    alert.classList.add('headline', 'alert');
    alert.textContent = 'High load generated an alert - load = ' + alertObj.load+ ', triggered at ' +alertObj.created_at;
    return alert;
  }
  function addToDOM(el) {
    alertsContainer.insertBefore(el, alertsContainer.firstChild);
  }
  return {
    init:init
  };
};
