/**
 * 主页
 */
exports.index = function(req, res) {
  var user = null;
  res.render('index', {
    title: '主页',
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
}