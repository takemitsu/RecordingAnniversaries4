// get mongoose.Schema
var mongoose = require('mongoose')
var Schema = mongoose.Schema

// make user model and export
module.exports = mongoose.model('User', new Schema({
  name: String,
  password: String,
  admin: Boolean
}))
