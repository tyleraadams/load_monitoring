var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Uptime = mongoose.model('Uptime');
var exec   = require('child_process').exec;
var command = 'uptime';
module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  Uptime.find(function (err, uptimes) {
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
    console.log(uptimes);
    res.render('index', {
      title: 'Generator-Express MVC',
      uptimes: uptimes
    });
  });
});
