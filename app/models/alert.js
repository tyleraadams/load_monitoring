// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AlertSchema = new Schema({
  load: String,
  recovered_at: Date,
  created_at: { type: Date, default: Date.now }
});

AlertSchema.methods.findLastTen = function (cb) {
  var q = this.model('Uptime').find({}).sort({'date': -1}).limit(10);
  q.exec(function(err, uptimes) {
    return uptimes;
  });
}
module.exports = mongoose.model('Alert', AlertSchema);


