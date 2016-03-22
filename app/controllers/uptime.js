'use strict';
const express = require('express');
const  router = express.Router();
const  mongoose = require('mongoose');
const  Uptime = mongoose.model('Uptime');

router.get('/', function (req, res) {
  Uptime.findOne().sort({ created_at: -1 }).exec(function (err, uptime) {
    if (err) {
      return err;
    }
    res.send(uptime);
  });
});

module.exports = function (app) {
  app.use('/uptime', router);
};
