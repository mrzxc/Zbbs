var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({
  name: String,
  img: String,
  phoneNumber: Number,
  password: String
})

module.exports = userSchema;