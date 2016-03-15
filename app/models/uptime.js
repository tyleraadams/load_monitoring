// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UptimeSchema = new Schema({
  value: String,
  created_at: { type: Date, default: Date.now }
});

UptimeSchema.methods.findLastTen = function (cb) {
  var q = this.model('Uptime').find({}).sort({'date': -1}).limit(10);
  q.exec(function(err, uptimes) {
     // `posts` will be of length 20
     return uptimes;
  });
  // return this.model('Uptime').find({ }, cb);
}

UptimeSchema.statics.findLastTwoMinutes = function (cb) {
  var q = this.model('Uptime').find({created_at: {
        $gt: new Date(new Date().getTime() - 1000 * 60 * 2).toISOString()
      }}).sort({'crated_at': -1});
  q.exec(cb);




  // return this.model('Uptime').find({ }, cb);
}
module.exports = mongoose.model('Uptime', UptimeSchema);


