var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Uptime = mongoose.model('Uptime'),
  Alert = mongoose.model('Alert');
var exec   = require('child_process').exec;
var command = 'uptime';
module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  const P1 = new Promise(function (resolve, reject) {
    const query = Uptime.find({created_at: {
      $gt: new Date(new Date().getTime() - 1000 * 60 * 10).toISOString()
    }}).sort({created_at:-1}).limit(60);
    query.exec(function (err, uptimes) {
      return resolve(uptimes);
    })
  });

  const P2 = new Promise(function (resolve, reject) {
    Alert.find({}, function(err, alerts) {
      return resolve(alerts);
    });
  });

  Promise.all([P1, P2]).then(function (results) {
    const uptimes = results[0];
    const alerts = results[1];
    res.render('index', {
      title: 'Generator-Express MVC',
      uptimes: JSON.stringify(uptimes),
      alerts: alerts
    });
  });

});

router.get('/uptime', function (req,res,next) {
  Uptime.findOne().sort({created_at: -1}).exec(function(err, uptime) {
    res.send(uptime);
  });
});
