$(function() {
  /**
   * 重载question列表
   */
  var listContentEle = $("#list-content");
  function refreshList(page) {
    var maxPage = 8; // 页码最多可显示数目
    if(!page) {
      page = 1;
    }
    $.get('/list', {page: page}, function(data) {
      data = JSON.parse(data);
      var count = data.count;
      data = data.data;
      listContentEle.empty();
      data.forEach(function(val, index) {
        listContentEle.append(`<hr><div class="container"><div class="item-header row"><div class="item-img col-md-1"><img src="${val.img}"/></div><div class="col-md-11"><span class="gray">发帖来自 <a href="/person/${val.phoneNumber}"><small>${val.username}</small></a></span><h5><a href="/detail/${val.id}">${val.title}</a></h5></div></div></div>`)
      }, this);
      var max = Math.ceil(count / 8);
      if(max == 1) return;
      var str = `<hr><div id="page-control" data-count="${count}" data-page="${page}"  aria-label="aria-label" class="col-md-offset-4"><ul class="pagination"><li `;
      if(page == 1) {
        str += `class="disabled"`
      }
      str += `><a href="pre" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>`;
      if(page > maxPage) {
        str += `<li><a href="before">...</a></li>`
      }
      var start, end;
      var hasAfter = true;
      if(page > Math.floor(max / maxPage) * maxPage) {
        hasAfter = false;
        start = Math.floor(max / maxPage) * maxPage + 1;
        end = max;
      }else {
        start = Math.ceil(page / maxPage);
        end =  Math.ceil(page / maxPage) * maxPage;
      }
      for(var i = start; i <= end; i++) {
        str += '<li ';
        if(i == page) {
          str += `class="active"`
        }
        str += `><a href="${i}">${i}</a></li>`;
      }
      if(hasAfter) {
        str+=`<li><a href="after">...</a></li>`
      }
      str += '<li ';
      if(max == page) {
        str += `class="disabled"`
      }
      str += `><a href="next" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li></ul></div>`;
      listContentEle.append(str);
      $('#page-control').on('click', function(e) {
        e.preventDefault();
        var ele = null;
        var count = $('#page-control').attr('data-count');
        var page = $('#page-control').attr('data-page');
        if(e.target.tagName == "SPAN") {
          ele  = e.target.parentNode;
        }else if(e.target.tagName == "A") {
          ele = e.target;
        }
        if(ele) {
          var mark = $(ele).attr('href');
          if(mark == 'pre' && page > 1) {
            refreshList(page - 1);
          }else if(mark == 'next' && page < max){
            refreshList(Number(page) + 1)
          }else if(mark == 'before') {
            refreshList(Math.floor(page / maxPage) * maxPage);
          }else if(mark == 'after') {
            refreshList(Math.ceil(page / maxPage) * maxPage + 1);
          }else {
            var n = Number(mark)
            if(!isNaN(n)) {
              refreshList(n);
            }
          }
        }
      })
    }) 
  }
  refreshList()
  window.refreshList = refreshList;
  
})