var User = require("../app/controllers/user");
var Index = require("../app/controllers/index");
var Utils = require("../utils");

module.exports = function(app) {
  /**
   * 登录状态会话验证
   */
  app.use(function(req, res, next) {
    var _user = req.session.user;
    if(_user) {
      app.locals.user = {
        phoneNumber: _user.phoneNumber,
        img: _user.img,
        username: _user.username
      };
    }else {
      delete app.locals.user;
    }
    
    next();
  })
  // Index
  app.get('/', Index.index)

  //Index
  app.get("/getVerify", User.getVerify);
  app.get('/user_exit', User.Exit)
  app.get('/login', User.login)
  app.post('/signup', User.signup)
  app.post('/signin', User.signin)
  app.get('/signout', User.signout)
  app.use(function(req, res, next) {
    res.status(404);
    res.render('404');
  })

  app.use(function(req, res, next) {
    console.error(err.stack)
    res.status(500);
    res.render('500');
  })

}
