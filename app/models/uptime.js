'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UptimeSchema = new Schema({
  value: String,
  created_at: { type: Date, default: Date.now }
});

UptimeSchema.statics.findLastTwoMinutes = function (cb) {
  let q = this.model('Uptime').find({created_at: {
    $gt: new Date(new Date().getTime() - 1000 * 60 * 2).toISOString()
  }}).sort({'created_at': -1});
  q.exec(cb);
};

module.exports = mongoose.model('Uptime', UptimeSchema);


