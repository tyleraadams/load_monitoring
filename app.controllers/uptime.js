var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Uptime = mongoose.model('Uptime');

router.get('/', function (req,res,next) {
  Uptime.findOne().sort({created_at: -1}).exec(function(err, uptime) {
    res.send(uptime);
  });
});

module.exports = function (app) {
  app.use('/uptime', router);
};
