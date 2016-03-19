var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Alert = mongoose.model('Alert');

router.get('/', function (req,res,next) {
  Alert.findOne().sort({created_at: -1}).exec(function(err, alert) {
    console.log('!! ',  alert);
    res.send(alert);
  });
});

module.exports = function (app) {
  app.use('/alerts', router);
};
