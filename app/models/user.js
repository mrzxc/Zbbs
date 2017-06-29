var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var UserSchema = require("../schemas/user");
var User = mongoose.model('User', UserSchema);

module.exports = User;