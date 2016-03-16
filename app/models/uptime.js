// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UptimeSchema = new Schema({
  value: String,
  created_at: { type: Date, default: Date.now }
});

UptimeSchema.statics.findLastTwoMinutes = function (cb) {
  var q = this.model('Uptime').find({created_at: {
        $gt: new Date(new Date().getTime() - 1000 * 60 * 2).toISOString()
      }}).sort({'crated_at': -1});
  q.exec(cb);
}

UptimeSchema.statics.create = function (cb) {

}

module.exports = mongoose.model('Uptime', UptimeSchema);


