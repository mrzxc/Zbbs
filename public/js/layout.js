$(function(window) {
  var Utils = {
  }
  /**
   *  发帖按钮
   */
  $("#question-button").on('click', function(e) {
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
  })
  /**
   * 提交按钮
   */
  $("#question-submit").on('click', function(e) {
    e.preventDefault();
    var title = $("#question-title").val();
    var content = $("#question-content").val();
    if(title === "") {
      $("#modal-error").text("标题不能为空");
      setTimeout(function() {
        $("#modal-error").hide();
      }, 2000)
      return;
    }
    $.post('/question_add', {
      title: title,
      content: content
    }, function(data) {
      if(data.code == 1) {
        $("#question-modal").modal("toggle");
        $("#question-title").val("");
        $("#question-content").val("");
        if(window.refreshList) {
          refreshList()
        }
      }
    })
  })
})
