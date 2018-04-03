// get mongoose.Schema
var mongoose = require('mongoose')
var Schema = mongoose.Schema

// make user model and export
module.exports = mongoose.model('Group', new Schema({
  name: String,
  user_id: String,
  desc: String,
  annivs: [
    {
      name: String,
      anniv_at: Date,
      desc: String
    }
  ]
}))
