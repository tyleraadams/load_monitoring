'use strict';
const express = require('express');
const  router = express.Router();
const  mongoose = require('mongoose');
const Alert = mongoose.model('Alert');

router.get('/', function (req, res) {
  Alert.findOne().sort({created_at: -1}).exec(function (err, alert) {
    res.send(alert);
  });
});

module.exports = function (app) {
  app.use('/alerts', router);
};
