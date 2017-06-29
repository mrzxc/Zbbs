var Reply = require("../models/reply");
var User = require("../models/user");
var mongoose = require("mongoose");
var ReplySchema = new mongoose.Schema({
  questionId: String,
  userPhoneNumber: String,
  like: Number,
  content: String,
  date: {
    type: Date,
    default: Date.now()
  }
})
ReplySchema.pre("save", function(next) {
  if(this.isNew) {
    this.date = Date.now()
  }
  next();
});
ReplySchema.statics = {
  getList: function(id, cb) {
    var that = this;
    this.find({questionId: id}, function(err, replys) {
      if(err) {
        console.log(err)
      }
      list = replys.sort(function($a, $b) {
        return Date.parse($b.date) - Date.parse($a.date);
      })
      var data = {
        id: id,
        data: []
      }
      var promises = list.map(function(val, index, array) {
        return new Promise((resolve, reject) => {
          User.findOne({phoneNumber: val.userPhoneNumber}, function(err, user) {
            if(err) {
              console.log(err);
              reject();
            }
            data.data[index] = {
              id: val.id,
              username: user.name,
              img: user.img,
              phoneNumber: val.userPhoneNumber,
              content: val.content,
              date: Date.parse(val.date)
            }
            resolve();
          })
        })
      })
      Promise.all(promises).then(function() {
        cb(data);
      })
    })
  }
}
module.exports = ReplySchema;