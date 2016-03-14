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
  var query = Uptime.find({}).sort({created_at:-1}).limit(60);
  query.exec( function (err, uptimes) {
    // if (err) return next(err);
    // console.log(path.join(__dirname, '../..', 'run.sh'));
    // var command = spawn(path.join(__dirname, '../..', 'run.sh'));
    // exec(command, function (err, stdout, stderr){

    //   console.log(stdout)
    // });

    // var output  = [];

    // command.stdout.on('data', function(chunk) {
    //   output.push(chunk);
    // });

    // command.on('close', function(code) {
    //   if (code === 0){
    //     console.log(Buffer.concat(output));
    //     // res.send(Buffer.concat(output));

    //   } else {

    //     // res.send(500); // when the script fails, generate a Server Error HTTP response
    //   }
    // });
    // console.log(uptimes);
    var query = Uptime.find({
      created_at: {
        $gt: new Date(new Date().getTime() - 1000 * 60 * 10).toISOString()
      }
    }).sort({created_at:-1});
    query.exec(function (err, uptimes) {
      Alert.find({}, function(err, alerts) {
        res.render('index', {
          title: 'Generator-Express MVC',
          uptimes: JSON.stringify(uptimes),
          alerts: alerts
        });
      });
      // console.error(err);
      // console.log(uptimes.length);

    });

  });
});


router.get('/uptime', function (req,res, next) {
  // var query = Uptime.findOne({

  // }).sort({created_at:-1});
  // query.exec(function (err, uptimes) {
  //   // console.error(err);
  //   console.log(uptimes.length);
  //   res.send(uptimes);
  // });

  Uptime.findOne().sort({created_at: -1}).exec(function(err, uptime) { console.log(JSON.stringify(uptime)); res.send(uptime); });
});
