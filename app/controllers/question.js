var Question = require("../models/question");
var User = require("../models/user");
exports.add = function(req, res) {
  if(!req.session.user) {
    return res.send(JSON.stringify({
      code: 0,
      error: "用户未登录"
    }))
  }
  var title = req.body.title;
  var content = req.body.content;
  if(!title) {
    return rres.send(JSON.stringify({
      code: 2,
      error: "标题不能为空"
    }));
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
    res.send(JSON.stringify({
      code: 1
    }))
  })
}
exports.list = function(req, res) {
  var page = req.query.page;
  var num = 8;
  Question.find({}, function(err, _list) {
    if(err) {
      console.log(err)
    }
    list = _list.sort(function($a, $b) {
      return Date.parse($b.date) - Date.parse($a.date);
    })
    var count = list.length;
    list = list.slice((page - 1) * num, page * num);
    var data = {};
    data = {
      count: count,
      page: page,
      data: []
    }
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
            title: val.title,
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
      res.state('404');
      res.render('404')
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
exports.update = function(req, res) {
  var title = req.body.title;
  var content = req.body.content;
  var id = req.body.id;
  if(!req.session.user) {
    return res.send(JSON.stringify({code:0, error: '用户未登录'}))
  }
  Question.findById(id, function(err, qs) {
    if(err) {
      console.log(err);
    }
    if(qs.userPhoneNumber == req.session.user.phoneNumber) {
      Question.update({_id: id}, {title: title, content: content}, function(err) {
        if(err) {
          console.log(err)
        }else {
          res.send(JSON.stringify({code: 1}))
        }
      })
    }else {
      res.send(JSON.stringify({code: 2, error: '非本人操作'}));
    }
  })
}
exports.delete = function(req, res) {
  var id = req.body.id;
  if(!req.session.user) {
    return res.send(JSON.stringify({code:0, error: '用户未登录'}))
  }
  Question.findById(id, function(err, qs) {
    if(err) {
      console.log(err);
    }
    console.log(qs);
    console.log(req.session.user)
    if(qs.userPhoneNumber == req.session.user.phoneNumber) {
      Question.remove({_id: id}, function(err) {
        if(err) {
          console.log(err)
        }else {
          res.send(JSON.stringify({code: 1}))
        }
      })
    }else {
      res.send(JSON.stringify({code: 2, error: '非本人操作'}));
    }
  })
}