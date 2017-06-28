var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;
var UserSchema = new mongoose.Schema({
  phoneNumber: {
    unique: true,
    type: String
  },
  name: String,
  img: String,
  password: String
})
/**
 * 加密
 */
UserSchema.pre("save", function(next) {
  if(this.isNew) {
    this.img = "/img/user.jpg";
  }
  var user = this;
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function(err, hash) {
      if(err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  })
})

UserSchema.methods = {
  comparePassword: function(_password, callback) {
    bcrypt.compare(_password, this.password, function(err, isMatch) {
      if (err) return callback(err);
      callback(null, isMatch);
    })
  }
}

UserSchema.statics =  {
  findByPhoneNumber: function(phoneNumber, callback) {
    return this.find({phoneNumber: phoneNumber});
    exec(callback);
  }
}



module.exports = UserSchema;