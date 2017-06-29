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
}

UserSchema.statics =  {
  ifExist: function(phoneNumber, cb) {
    this.findOne({phoneNumber: phoneNumber}, function(err, user) {
      var code = 0;
      if(err) {
        console.log(err);
      }else if(!user) {
        code = 1;
      }else {
        code = 2;
      }
      cb.call(this, err, code);
    });
  },
  comparePassword: function(phoneNumber, _password, cb) {
    this.findOne({phoneNumber: phoneNumber}, function(err, user) {
      var code = 0;
      if(err) {
        console.log(err)
      }
      if(!user) {
        cb(0);
      }else {
        bcrypt.compare(_password, user.password, function(err, isMatch) {
          if (err) {
            console.log(err)
          }
          if(isMatch) {
            cb(1, user)
          }else {
            cb(2)
          }
        })
      }
      
    })
  },
  updatePassword: function(phoneNumber, password, cb) {
    that = this;
    this.find({phoneNumber: phoneNumber}, {password: password}, function(err, user) {
      if(err) {
        console.log(err)
      }
      if(!user) {
        cb(0)
      }else {
        var _password;
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
          if(err) {
            console.log(err)
          }
          bcrypt.hash(password, salt, function(err, hash) {
            if(err) {
              console.log(err)
            }
            _password = hash;
            that.update({phoneNumber: phoneNumber}, {password: _password}, function(err) {
              if(err) {
                console.log(err)
              }else {
                cb(1)
              }
            })
          })
        })
      }
    })
  }
}
module.exports = UserSchema;