// 发送验证码 使用的是网易云通信与视频短信接口 http://netease.im/
var crypto = require('crypto');
var credentials = require('../credentials.js');
function verify(phone, callback) {
  var https = require('https');
  var codeLen = 4;
  var querystring = require('querystring');
  var data = querystring.stringify({
      mobile: String(phone)
  });
  var appKey = credentials.verify_app_key;
  var nonce = Math.floor(Math.random() * 255 * 255 * 255);
  var curTime = +Date.now();
  var app_secret = credentials.verify_app_secret;
  var content = app_secret + nonce + curTime;
  var shasum = crypto.createHash('sha1');
  shasum.update(content);
  var checkSum = shasum.digest('hex');
  var options = {
    host: 'api.netease.im',
    port: '443',
    path:'/sms/sendcode.action',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=uft-8',
      'AppKey': appKey,
      'Nonce': nonce,
      'CurTime': curTime,
      'CheckSum': checkSum
    }
  };
  var req = https.request(options, function(res) {
    if (res.statusCode == 200) {  
      res.setEncoding('utf8');
      var json = '';
      res.on('data', function (data) {
        json += data;
        console.log(JSON.parse(json).obj)
        callback(JSON.parse(json).obj)
      });
    }
  });
  req.on('error', (e) => {
    console.error(e);
  });
  req.write(data);
  req.end();
}
module.exports = verify;