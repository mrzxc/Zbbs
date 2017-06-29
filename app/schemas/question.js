var mongoose = require("mongoose");
var User = require("../models/user");
var QuestionSchema = new mongoose.Schema({
  userPhoneNumber: String,
  title: String,
  content: String,
  date: {
    type: Date,
    default: Date.now()
  }
})
QuestionSchema.pre("save", function(next) {
  if(this.isNew) {
    this.date = Date.now()
  }
  next();
});

QuestionSchema.statics = {
  fetch: function() {
    cb()
    return this.find({}).sort('date');
  },
  getList: function(page, num, cb) {
    var that = this;
    this.find({}, function(err, _list) {
      if(err) {
        console.log(err)
      }
      list = _list.sort(function($a, $b) {
        return Date.parse($b.date) - Date.parse($a.date);
      })
      var count = list.length;
      var data = {
        count: count,
        page: page,
        data: []
      }
      list = list.slice((page - 1) * num, page * num);
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
              title: val.title,
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
  },
  updateItem: function(id, title, content, phoneNumber, cb) {
    var that = this;
    this.findById(id, function(err, qs) {
      if(err) {
        console.log(err);
      }
      console.log(qs.userPhoneNumber)
      console.log(phoneNumber)
      if(qs.userPhoneNumber == phoneNumber) {
        that.update({_id: id}, {title: title, content: content}, function(err) {
          if(err) {
            console.log(err)
          }else {
            cb(1)
          }
        })
      }else {
        cb(2)
      }
    })
  },
  delete: function(id, phoneNumber, cb) {
    var that = this;
    this.findById(id, function(err, qs) {
      if(err) {
        console.log(err);
      }
      if(qs.userPhoneNumber == phoneNumber) {
        that.remove({_id: id}, function(err) {
          if(err) {
            console.log(err)
          }else {
            cb(1)
          }
        })
      }else {
        cb(2)
      }
    })
  }
}
module.exports = QuestionSchema;