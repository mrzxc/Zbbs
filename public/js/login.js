
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
 * 忘记密码
 */
$("#forget").on('click', function(e){
  e.preventDefault();
  $('#forget-form').modal('toggle')
})

/**
 * 注册按钮
 */
$("#signup-button").on('click', function(e) {
  e.preventDefault();
  var phone = $("#signup-phone").val();
  var username = $("#signup-name").val();
  var password = $("#signup-password").val();
  if(!Utils.phoneCheck(phone)) {
    $("#error span").text("请输入正确手机号");
    $("#error").show();
    window.setTimeout(function() {
      $("#error").fadeOut();
    }, 2000)
  }else if(!Utils.usernameCheck(username)){
    $("#error span").text("用户名非法");
    $("#error").show();
    window.setTimeout(function() {
      $("#error").fadeOut();
    }, 2000)
  }else if(!Utils.passwordCheck(password)) {
    $("#error span").text("密码不能为空");
    $("#error").show();
    window.setTimeout(function() {
      $("#error").fadeOut();
    }, 2000)
  }else {
    $.get("/user_exit", {
      phone: phone,
      username: username
    }, function(data){
      if(data == 1) {
        $("#verify-button").attr({
          "data-phone": phone,
          "data-name": username,
          "data-password": password
        })        
        $("#verify-modal").modal("toggle");
      }else if(data == 2) {
        $("#error span").text("手机号已注册");
        $("#error").show();
        window.setTimeout(function() {
          $("#error").fadeOut();
        }, 2000)
      }
    });
  }
})
/**
 * 获取验证码验证按钮(注册)
 */
$("#get-verify-button").on('click', function(e) {
  var btnEle = $("#get-verify-button");
  var phoneNumber = $("#verify-button").attr('data-phone');
  e.preventDefault();
  btnEle.addClass("btn-default")
  btnEle.removeClass("btn-primary");
  $.get("/getVerify", {
    phoneNumber: phoneNumber
  }, function(data) {
    if(data != 1) {
      $("#verify-alert").text('获取失败')
    }else {
      var time = 10;
      var timerId = window.setInterval(function() {
        if(time > 0) {
          time--;
          btnEle.text(time+"s");
        }else {
          btnEle.text("重新发送");
          btnEle.removeClass("btn-default");
          btnEle.addClass("btn-primary")
          window.clearInterval(timerId);
        }
      }, 1000)
    }
  })
})
/**
 * 获取验证码验证按钮(密码找回)
 */
$("#get-verify").on('click', function(e) {
  e.preventDefault();
  var btnEle = $("#get-verify");
  var phoneNumber = $("#forget-phone").val()
  if(!Utils.phoneCheck(phoneNumber)) {
    $("#forget-alert").text("请输入正确手机号");
    $("#forget-alert").show();
    window.setTimeout(function() {
      $("#forget-alert").fadeOut();
    }, 2000)
    return;
  }
  btnEle.addClass("btn-default")
  btnEle.removeClass("btn-primary");
  $.get("/getVerify", {
    phoneNumber: phoneNumber
  }, function(data) {
    if(data != 1) {
      $("#forget-alert").text('获取失败')
      $("#forget-alert").show();
      window.setTimeout(function() {
        $("#forget-alert").fadeOut();
      }, 2000)
    }else {
      var time = 10;
      var timerId = window.setInterval(function() {
        if(time > 0) {
          time--;
          btnEle.text(time+"s");
        }else {
          btnEle.text("重新发送");
          btnEle.addClass("btn-primary")
          btnEle.removeClass("btn-default");
          window.clearInterval(timerId);
        }
      }, 1000)
    }
  })
})
/**
 * 验证码验证
 */
$("#verify-button").on("click", function(e) {
  e.preventDefault();
  var btnEle = $("#verify-button");
  $.post("/signup", {
    username: btnEle.attr('data-name'),
    phoneNumber: btnEle.attr('data-phone'),
    password: btnEle.attr('data-password'),
    verify: $("#signup-verify").val()
  }, function(data) {
    if(data == 0) {
      $("#verify-alert").text('验证失败');
    }else if(data == 1) {
      window.location.href = "/";
    }
  })
})
/**
 * 登录验证
 */
$("#signin-button").on('click', function(e) {
  e.preventDefault();
  var btnEle = $("#signin-button");
  var phone = $("#signin-phone").val();
  var password = $("#signin-password").val();
  if(!Utils.phoneCheck(phone)) {
    $("#error span").text("请输入正确手机号");
    $("#error").show();
    window.setTimeout(function() {
      $("#error").fadeOut();
    }, 2000)
  }else {
    $.post("/signin", {
      phoneNumber: phone,
      password: password
    }, function(data) {
      data = JSON.parse(data)
      if(data.code == 1) {
        console.log(111)
        window.location.href = "/";
      }else if(data.code == 0) {
        $("#error span").text("该手机号未注册");
        $("#error").show();
        window.setTimeout(function() {
          $("#error").fadeOut();
        }, 2000)
      }else if(data.code == 2) {
        $("#error span").text("密码错误");
        $("#error").show();
        window.setTimeout(function() {
          $("#error").fadeOut();
        }, 2000)
      }
    })
  }
})
/**
 * 修改密码按钮
 */
$("#pass-update").on('click', function(e) {
  e.preventDefault()
  var phoneNumber = $("#forget-phone").val();
  var password = $('#new-password').val();
  var verify = $("#forget-verify").val();
  $.post('/pass_update', {
    phoneNumber: phoneNumber,
    password: password,
    verify: verify
  }, function(data) {
    data = JSON.parse(data);
    if(data.code == 1) {
      $('#forget-form').modal('toggle');
      setTimeout(function() {
        $("#forget-phone").val('');
        $('#new-password').val('');
        $("#forget-verify").val('')
      }, 1000)
    }else if(data.code == 2){
      $("#forget-alert").text('验证码错误')
      $("#forget-verify").val('')
      $("#forget-alert").show();
      window.setTimeout(function() {
        $("#forget-alert").fadeOut();
      }, 2000)
    }
  })
})