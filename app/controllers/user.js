var User = require("../models/user");
var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;
var verify = require("../../common/verify");
var _user = new User();
var Utils = {
  /**
   * 手机号正则验证
   */
  phoneCheck: function(num) {
    if(/^1[3|4|5|8][0-9]\d{4,8}$/.test(num)) {
      return true;
    }else {
      return false;
    }
  },
  /**
   * 用户名验证
   */
  usernameCheck: function(str) {
    if(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9])*$/.test(str)) {
      return true;
    }else {
      return false;
    }
  },
  /**
   * 密码验证
   */
  passwordCheck: function(str) {
    if(/^.+$/.test(str)) {
      return true;
    }else {
      return false;
    }
  }
}
/**
 * 获取验证码
 */
exports.getVerify = function(req, res) {
  var phoneNumber = req.query.phoneNumber;
  if(Utils.phoneCheck(phoneNumber)) {
    verify(phoneNumber, function(code) {
      req.session.verify = {
        phoneNumber: phoneNumber,
        code: code
      }
      res.send("1");
    });
  }
}
/**
 * 验证用户是否存在
 */
exports.Exit = function(req, res) {
  var phoneNumber = req.query.phone;
  var username = req.query.username;
  if(Utils.phoneCheck(phoneNumber) && Utils.usernameCheck(username)) {
    _user.ifExist(phoneNumber, function(err, data) {
      res.send(String(data));
    })
  }else {
    res.status(200).send("0");
  }
}

/**
 * 注册登录页面
 */
exports.login = function(req, res) {
  if(req.session.user) {
    return res.redirect("/")
  }
  res.render('login', {
    title: 'login',
  })
}

/**
 * 注册
 */
exports.signup = function(req, res) {
  var username = req.body.username;
  var phoneNumber = req.body.phoneNumber;
  var password = req.body.password;
  if(!(Utils.usernameCheck(username) && Utils.passwordCheck(password))) {
    send("0")
  }
  var verify = req.body.verify;
  var _verify = req.session.verify ? req.session.verify : null;
  if(verify == _verify.code && phoneNumber == _verify.phoneNumber) {
    var user = new User({
      name: username,
      phoneNumber: phoneNumber,
      password: password
    })
    user.save(function(err, _user) {
      if(err) {
        console.log(err);
      }
      req.session.user = {
        img: '/img/user.jpg',
        username: username,
        phoneNumber: phoneNumber
      };
      res.status(200).send("1");
    })
  }else {
    res.status(200).send("0");
  }
}

/**
 * 登录
 */
exports.signin = function(req, res) {
  var phoneNumber = req.body.phoneNumber;
  var password = req.body.password;
    _user.comparePassword(phoneNumber, password, function(code, user) {
      var error = '';
      switch(code) {
        case 0:
          error = '用户不存在';
          break;
        case 1:
          req.session.user = {
            img: user.img,
            username: user.name,
            phoneNumber: user.phoneNumber
          };
          break;
        case 2:
          error = '密码错误';
          break;
        default:
          error = '未知错误';
      }
      res.json({
        code: code,
        error: error
      })
    })
}
/**
 * 登出
 */
exports.signout = function(req, res) {
  delete req.session.user;
  res.redirect("/")
}
/**
 * 修改密码
 */
exports.update = function(req, res) {
  var phoneNumber = req.body.phoneNumber;
  var password = req.body.password;
  var verify = req.body.verify;
  if(password === '') {
    res.json({
      code: 4,
      error: '密码不能为空'
    })
  }
  var _verify = req.session.verify ? req.session.verify : null;
  if(verify == _verify.code && phoneNumber == _verify.phoneNumber) {
    _user.updatePassword(phoneNumber, password, function(code) {
      var error = '';
      if(code == 0) {
        error == '该用户未注册'
      }
      res.json({
        code: String(code),
        error: error
      })
    })
  }else {
    res.json({
      code: 2,
      error: '验证码错误'
    })
  }
}