var alerts = require('./alerts')(),
  uptimes = require('./uptimes')();

window.onload = function () {
    uptimes.init();
    alerts.init();
};

