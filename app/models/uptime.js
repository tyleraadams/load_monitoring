// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UptimeSchema = new Schema({
  value: String,
  created_at: { type: Date, default: Date.now }
});


mongoose.model('Uptime', UptimeSchema);
