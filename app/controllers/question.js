var Question = require("../models/question");
var User = require("../models/user");
/**
 * 增加
 */
exports.add = function(req, res) {
  if(!req.session.user) {
    return res.json({
      code: 0,
      error: "用户未登录"
    })
  }
  var title = req.body.title;
  var content = req.body.content;
  if(!title) {
    return res.json({
      code: 2,
      error: "标题不能为空"
    })
  }
  var qs = new Question({
    userPhoneNumber: req.session.user.phoneNumber,
    title: title,
    content: content
  })
  qs.save(function(err, _qs) {
    if(err) {
      console.log(err);
    }
    res.json({
      code: 1
    })
  })
}
/**
 * 显示列表
 */
exports.list = function(req, res) {
  var page = req.query.page;
  var num = 8;
  Question.getList(page, num, function(data) {
    res.json(data);
  })
}
/**
 * 详情页
 */
exports.detail = function(req, res) {
  var questionId = req.params.id;
  res.locals.scripts = ['/js/detail.js'];
  res.locals.csss = ['/css/detail.css'];
  var question;
  Question.findById(questionId, function(err, qs) {
    if(err) {
      console.log(err);
    }
    if(!qs) {
      res.status('404');
      res.render('404');
      return;
    }
    question = {
      id: questionId,
      title: qs.title,
      content: qs.content,
      ifEdit: false
    }
    console.log(question);
    if(qs.userPhoneNumber == req.session.user.phoneNumber) {
      question.ifEdit = true;
    }
    res.render('detail', {
      title: 'detail',
      question: question,
    });
  })
}
/**
 * 改
 */
exports.update = function(req, res) {
  var title = req.body.title;
  var content = req.body.content;
  var id = req.body.id;
  if(!req.session.user) {
    return res.json({
      code:0,
      error: '用户未登录'
    })
  }
  Question.updateItem(id, title, content, req.session.user.phoneNumber, function(code) {
    var error = '';
    if(code == 2) {
      error = '非本人操作';
    }
    res.json({
      code: code,
      error: '非本人操作'
    })
  })
}
/**
 * 删
 */
exports.delete = function(req, res) {
  var id = req.body.id;
  if(!req.session.user) {
    return res.json({code:0, error: '用户未登录'})
  }
  Question.delete(id, req.session.user.phoneNumber, function(code) {
    var error = '';
    if(code == 2) {
      error = '非本人操作'
    }
    res.json({code: code, error: '非本人操作'})
  })
}