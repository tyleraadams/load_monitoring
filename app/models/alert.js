// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AlertSchema = new Schema({
  load: String,
  time: Date,
  uptime: String,
  recovered_at: String,
  created_at: { type: Date, default: Date.now }
});

AlertSchema.methods.findLastTen = function (cb) {
  var q = this.model('Uptime').find({}).sort({'date': -1}).limit(10);
  q.exec(function(err, uptimes) {
     // `posts` will be of length 20
     return uptimes;
  });
  // return this.model('Uptime').find({ }, cb);
}
module.exports = mongoose.model('Alert', AlertSchema);


