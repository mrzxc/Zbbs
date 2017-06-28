$(function() {
  /**
   * 载入回复
   */
  function laodReply() {
    var conEle = $('#question-body')
    conEle.empty();
    $.get('/reply_get', {id: $('#question-header-title').attr('data-id')}, function(data) {
      data = JSON.parse(data);
      data = data.data;
      data.forEach(function(val) {
        
      }, this);
    }) 
    
  }
  /**
   *  修改按钮
   */
  $(".edit-button").on('click', function(e) {
    e.preventDefault();
    $("#question-modal").modal("toggle");    
    if($("#user-control [data-phone]").length == 0) {
      $("#modal-error").text("您未登录,请先登录");
      setTimeout(function() {
        $("#question-modal").modal("toggle");
        $("#modal-error").text(""); 
      }, 1500)
      return;
    }
    $(".modal-header > h2").text("修改问题");
    $("#question-title").val($("#question-header-title").text());
    $("#question-content").val($("#question-header-detail").text());
    $("#question-submit").hide();
    $("#question-submit").after('<button class="btn btn-primary" id="edit-submit">修改</button>');
    $("#edit-submit").on('click', function(e) {
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