var User = require("../models/user");
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
  if(1) {
    res.send("1");
  }
}
/**
 * 验证用户是否存在
 */
exports.Exit = function(req, res) {
  var phoneNumber = req.query.phone;
  var username = req.query.username;
  if(Utils.phoneCheck(phoneNumber) && Utils.usernameCheck(username)) {
    User.findOne({phoneNumber: phoneNumber}, function(err, user) {
      if(err) {
        console.log(err);
        res.status(200).send("0");
      }
      if(!user) {
        res.status(200).send("1");;
      }else {
        res.status(200).send("2");;
      }
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
  if(verify == "123456") {
    var user = new User({
      name: username,
      phoneNumber: phoneNumber,
      password: password
    })
    user.save(function(err, _user) {
      if(err) {
        console.log(err);
      }
      User.findOne({phoneNumber: phoneNumber}, function(err, user) {
        if(err) {
          console.log(err);
        }
        req.session.user = {
          img: user.img,
          username: user.name,
          phoneNumber: user.phoneNumber
        };
        res.status(200).send("1");
      })
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
  User.findOne({phoneNumber : phoneNumber}, function(err, user) {
    if(err) {
      console.log(err);
    }
    if(!user) {
      return res.send(JSON.stringify({code: 0, error: "用户不存在"}));
    }
      user.comparePassword(password, function(err, isMatch) {
        if(err) {
          console.log(err);
        }
        if(isMatch) {
          req.session.user = {
          img: user.img,
          username: user.name,
          phoneNumber: user.phoneNumber
        };
          return res.send(JSON.stringify({code: 1, error: null}));
        }else {
          res.send(JSON.stringify({code: 2, error: "密码错误"}));
        }
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