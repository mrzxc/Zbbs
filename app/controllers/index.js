/**
 * 主页
 */
exports.index = function(req, res) {
  res.locals.scripts = ['/js/index.js'];
  res.locals.csss = ['/css/index.css'];
  res.render('index', {
    title : "Zbbs"
  })
}