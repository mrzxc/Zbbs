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
  Reply.getList(id, function(data) {
    res.json(data)
  })
}
/**
 * 增加回复
 */
exports.add = function(req, res) {
  var id = req.body.id;
  var content = req.body.content;
  if(!req.session.user) {
    return res.json({code:0, error: '用户未登录'})
  }
  var rp = new Reply({
    userPhoneNumber: req.session.user.phoneNumber,
    questionId: id,
    content: content
  })
  rp.save(function(err, _rp) {
    if(err) {
      console.log(err);
      return res.json({code: 2, error: '数据库错误'})
    }
    res.json({
      code: 1
    })
  })
}