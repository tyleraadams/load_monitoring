var poll = require('./utils').poll;
var $ = require('jquery');

module.exports = function () {
    var alertsContainer = document.getElementById('alerts-container');
    var previousAlert;
    var recoveredAlert;
    var isInAlertState = false;
    function init() {
        poll(function () {
            fetchAlert();
        }, function(){}, function(){}, null, 10000);
    }

    function fetchAlert () {
        $.get('/alerts', function (latestAlert,err) {
            // if the response is empty do nothing
            if (!latestAlert) {
                return;
            }
            // if there hasn't already been alert cached, then cache it and attach new message from alert
            if (!isInAlertState && !previousAlert) {
                previousAlert = latestAlert;
                isInAlertState = true;
                addToDOM(constructAlertDOM(latestAlert));
                return isInAlertState ;
            }
            // if the previousAlert._id and latestAlert._id match, the only reason you would display something is if there is recovered_at and that recoverd_at hasn't been displayed
            if (isInAlertState && latestAlert.recovered_at) {

                if (recoveredAlert && recoveredAlert._id === latestAlert._id) {
                    return;
                }
                previousAlert = latestAlert;
                recoveredAlert = latestAlert;
                addToDOM(constructAlertDOM(latestAlert));
                isInAlertState = false;
                return isInAlertState;
            }

            // if the previous._id and the latest._id dont' match then you should crate a new alert
            if (!isInAlertState && previousAlert._id !== latestAlert._id) {
                previousAlert = latestAlert;
                addToDOM(constructAlertDOM(latestAlert));
                isInAlertState = true;
                return isInAlertState;
            }
        });
    }
    function constructAlertDOM (alertObj) {
        var alert = document.createElement('h3');
        var icon = document.createElement('i');
        var span = document.createElement('span');
        var message = 'High load generated an alert - load = ' + alertObj.load+ ', triggered at ' + alertObj.created_at;
        alert.classList.add('headline', 'alert');
        icon.classList.add('icon-attention');
        if (alertObj.recovered_at) {
        alert.classList.add('recovery');
        message = 'Alert recovered at ' +  new Date(alertObj.recovered_at);
        icon.classList.add('icon-ok-circled');
        }

        span.textContent = message;
        alert.appendChild(icon);
        alert.appendChild(span);
        return alert;
    }
    function addToDOM(el) {
        alertsContainer.insertBefore(el, alertsContainer.firstChild);
    }
    return {
        init:init
    };
};
