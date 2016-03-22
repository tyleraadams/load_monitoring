'use strict';

const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const AlertSchema = new Schema({
  load: String,
  recovered_at: Date,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', AlertSchema);


