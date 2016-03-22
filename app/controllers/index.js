'use strict';
const express = require('express');
const  router = express.Router();
const  mongoose = require('mongoose');
const  Uptime = mongoose.model('Uptime');
const  Alert = mongoose.model('Alert');

router.get('/', function (req, res) {
  const P1 = new Promise(function (resolve) {
    const query = Uptime.find({ created_at: {
      $gt: new Date(new Date().getTime() - 1000 * 60 * 10).toISOString()
    }}).sort({ created_at: -1 }).limit(60);
    query.exec(function (err, uptimes) {
      return resolve(uptimes);
    });
  });

  const P2 = new Promise(function (resolve) {
    Alert.find({}, function (err, alerts) {
      return resolve(alerts);
    });
  });

  Promise.all([P1, P2]).then(function (results) {
    const uptimes = results[0];
    const alerts = results[1];
    res.render('index', {
      title: 'Load Monitoring',
      uptimes: JSON.stringify(uptimes),
      alerts: alerts
    });
  });

});

module.exports = function (app) {
  app.use('/', router);
};
