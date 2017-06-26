var express = require('express');

var app = express();
var mongoose = require("mongoose");
app.set('port', process.env.PORT || 3000);

app.set('view engine', 'jade');

app.set('views', './views/pages')

app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('index', {
    title: '主页',
    user: {
      img: "./img/user.jpg",
      name: "鸟羽"
    },
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

app.get('/login', function(req, res) {
  res.render('login', {
    title: 'login',
  })
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