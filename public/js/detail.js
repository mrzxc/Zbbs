$(function() {
  /**
   * 载入回复
   */
  function loadReply() {
    var conEle = $('#question-body')
    conEle.empty();
    $.get('/reply_get', {id: $('#question-header-title').attr('data-id')}, function(data) {
      data = JSON.parse(data);
      data = data.data;
      var str = '';
      data.forEach(function(val) {
        str += `<div class="reply-content"><div class="reply-header row"><div class="reply-header-left col-md-1"><a class="reply-img"><img src="${val.img}"/></a></div><div class="reply-header-right col-md-11"><h5 class="gray">${val.username}</h5></div></div><div class="reply-body row"><h5 class="col-md-11 col-md-offset-1">${val.content}</h5></div></div><hr>`;
      }, this);
      conEle.hide();
      conEle.append(str);
      conEle.slideDown();
    }) 
  }
  loadReply();
  /**
   * 回复按钮
   */
  $('#reply-submit').on('click', function(e) {
    e.preventDefault();
    var content = $('#reply-content').val();
    if(content === '') {
      console.log('夭寿了，有人回复空字符串了！！！');
      return;
    }
    $.post('/reply_add', {
      'id': $('#question-header-title').attr('data-id'),
      content: content
    }, function(data) {
      data = JSON.parse(data);
      if(data.code == 1) {
        loadReply();
        $('#reply-modal').modal('toggle');
        $('#reply-content').val('');

      }
    })
  })

  /**
   *  修改按钮
   */
  $(".edit-button").on('click', function(e) {
    e.preventDefault();
    $("#update-model").modal("toggle");    
    $("#update-title").val($("#question-header-title>span").text());
    $("#update-content").val($("#question-header-detail").text());
    $("#update-submit").on('click', function(e) {
      e.preventDefault();
      var title = $("#question-title").val();
      var content = $("#question-content").val();
      var id = $('#question-header-title').attr('data-id');
      if(title === "") {
        $("#modal-error").text("标题不能为空");
        setTimeout(function() {
          $("#modal-error").hide();
        }, 2000)
        return;
      }
      $.post('/question_update', {
        title: title,
        content: content,
        id: id
      }, function(data) {
        data = JSON.parse(data);
        if(data.code == 1) {
          $("#question-modal").modal("toggle");
          $("#question-title").val("");
          $("#question-content").val("");
          location.reload(true);
        }
      })
    })
  })
  /**
   * 删除按钮
   */
  $(".delete-button").on('click', function(e) {
    $('#confirm-delete').modal('toggle');
    var btnEle = $('#delete-confirm');
    btnEle.on('click', function(e) {
      e.preventDefault();
      var id = $('#question-header-title').attr('data-id');
      $.post('/question_delete',{id: id}, function(data) {
        data = JSON.parse(data);
        if(data.code == 1) {
          location.href = '/';
        }
      })
    })
  })
  
})