var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var mongoStore = require('connect-mongo')(session);
var app = express();
var User = require("./models/user");
var Question = require("./models/question");
var Utils = require("./utils");
mongoose.Promise = global.Promise;
var dbUrl =  "mongodb://localhost/zhihu";
mongoose.connect(dbUrl);

app.set('port', process.env.PORT || 3000);

app.set('view engine', 'jade');

app.set('views', './views/pages')

app.use(require('body-parser').urlencoded({extended: true}))
app.use(cookieParser());
app.use(session({
  secret: 'zhihu',
  store: new mongoStore({
    url: dbUrl,
    collection: 'session'
  }),
  resave: true,
  saveUninitialized: true
}))
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  var user = null;
  if(req.session.user) {
    user = {
      phoneNumber: req.session.user.phoneNumber,
      img: req.session.user.img,
      username: req.session.user.username
    }
  }
  res.render('index', {
    title: '主页',
    user: user,
    items: [{
      id: 1,
      user: {
        img: "/img/user.jpg",
        name: "鸟语",
      },
      title:"我要找实习",
      content: "我非常非常想要实习offer",
      replys: [{
        id: 1,
        like: "1000",
        name: "大佬",
        content: "可以给你"
      }]
    }
    ]
  })
})

/**
 * 获取验证码
 */
app.get("/getVerify", function(req, res) {
  if(1) {
    res.send("1");
  }
})
/**
 * 验证用户是否存在
 */
app.get('/user_exit', function(req, res) {
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
})

/**
 * 注册登录页面
 */
app.get('/login', function(req, res) {
  res.render('login', {
    title: 'login',
  })
})

/**
 * 注册
 */
app.post('/signup', function(req, res) {
  var username = req.body.username;
  console.log(username)
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
        console.log(user)
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
})

/**
 * 登录
 */
app.post('/signin', function(req, res) {
  var phoneNumber = req.body.phoneNumber;
  var password = req.body.password;
  User.findOne({phoneNumber : phoneNumber}, function(err, user) {
    if(err) {
      console.log(err);
    }
    if(!user) {
      return res.send(JSON.parse({code: 0, error: "用户不存在"}));
    }
      user.comparePassword(password, function(err, isMatch) {
        if(err) {
          console.log(err);
        }
        if(isMatch) {
          console.log(user)          
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
})
/**
 * 登出
 */
app.get('/signout', function(req, res) {
  
}) 
app.use(function(req, res, next) {
  res.status(404);
  res.render('404');
})

app.use(function(req, res, next) {
  console.error(err.stack)
  res.status(500);
  res.render('500');
})

app.listen(app.get('port'), function() {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminaate');
})