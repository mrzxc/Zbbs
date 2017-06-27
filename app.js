var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var mongoStore = require('connect-mongo')(session);

var app = express();
mongoose.Promise = global.Promise;
var dbUrl =  "mongodb://localhost/zhihu";
mongoose.connect(dbUrl);

app.set('port', process.env.PORT || 3000);

app.set('view engine', 'jade');

app.set('views', './app/views/pages')

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

if('development' == app.get('env')) {
  app.set('showStackError', true);
  app.use(logger(':method :url :status'));
  app.locals.pretty = true;;
  mongoose.set('debug', true);
}

// 引入路由
require('./config/routes')(app);
app.listen(app.get('port'), function() {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminaate');
})