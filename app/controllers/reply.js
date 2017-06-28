var Reply = require("../models/reply");
var User = require("../models/user");
/**
 * 获取回复列表
 */
exports.get = function(req, res) {
  var id = req.query.id;
  var data = {
    id: id,
    data: []
  }
  Reply.find({questionId: id}, function(err, replys) {
    if(err) {
      console.log(err)
    }
    list = replys.sort(function($a, $b) {
      return Date.parse($b.date) - Date.parse($a.date);
    })
    var promises = list.map(function(val, index, array) {
      return new Promise((resolve, reject) => {
        User.findOne({phoneNumber: Number(val.userPhoneNumber)}, function(err, user) {
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
      res.send(JSON.stringify(data));
    })
  })
}
/**
 * 增加回复
 */
exports.add = function(req, res) {
  var id = req.body.id;
  var content = req.body.content;
  if(!req.session.user) {
    return res.send(JSON.stringify({code:0, error: '用户未登录'}))
  }
  var rp = new Reply({
    userPhoneNumber: req.session.user.phoneNumber,
    questionId: id,
    content: content
  })
  rp.save(function(err, _rp) {
    if(err) {
      console.log(err);
      return res.send(JSON.stringify({code: 2, error: '数据库错误'}))
    }
    res.send(JSON.stringify({
      code: 1
    }))
  })
}