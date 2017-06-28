var crypto = require('crypto');
function verify(phone, _req) {
  var http = require('http');
  var codeLen = 4;
  var config = {
    
  }
  var querystring = require('querystring');
  //json转换为字符串
  var data = querystring.stringify({
      mobile: String(phone),
      codeLen: codeLen
  });
  var appKey = '';
  var nonce = Math.floor(Math.random() * 255 * 255 * 255);
  var curTime = +Date.now();
  var app_secret = '416fe07deb6b';
  var checkSum = crypto.createHmac('sha1', app_secret).update(appKey + nonce + curTime).digest('hex');
  console.log(checkSum)
  var options = {
      host: 'https://api.netease.im/sms/sendcode.action',
      path:'/callme/index.cfm/userService/command/getAuthenticode/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=uft-8',
        'AppKey': appKey,
        'Nonce': nonce,
        'CurTime': curTime,
        'CheckSum': checkSum
      }
  };
  var req = http.request(options, function(res) {
    if (res.statusCode == 200) {  
      res.setEncoding('utf8');
      var json = '';
      res.on('data', function (data) {
          json += data;
          console.log(json)
      });
      res.on('end',function(chunk){
          _req.session.verify = JSON.parse(json).obj;
          console.log(_req.session.verify);
      })
    }
  });
  req.write(data);
  req.end();
}
module.exports = verify;