define(['jquery', 'QDP'], function ($, QDP) {
  "use strict";
  let isFullScreen = false;

  var fullScreen = () => {
    var docElm = document.documentElement;
    //W3C  
    if (docElm.requestFullscreen) {
      isFullScreen = true;
      docElm.requestFullscreen();
    }
    //FireFox  
    else if (docElm.mozRequestFullScreen) {
      isFullScreen = true;
      docElm.mozRequestFullScreen();
    }
    //Chrome等  
    else if (docElm.webkitRequestFullScreen) {
      isFullScreen = true;
      docElm.webkitRequestFullScreen();
    }
    //IE11
    else if (docElm.msRequestFullscreen) {
      isFullScreen = true;
      docElm.msRequestFullscreen();
    }
  }

  var exitFullScreen = () => {
    if (document.exitFullscreen) {
      isFullScreen = false;
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      isFullScreen = false;
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      isFullScreen = false;
      document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
      isFullScreen = false;
      document.msExitFullscreen();
    }
  }
  // EVENT-ON:layout.started
  QDP.event.on("layout.started", function () {
    console.info("注册->系统运行后自动注册 - plugins-events");

    // 注册导航栏收起/展开开关点击事件
    $(document).on("click", ".sidebar-collapse", function () {
      if ($("body").hasClass("mini-menu")) {
        $("body").removeClass("mini-menu");
        // EVENT-ON:siderbar.collapse 导航栏折叠后触发
        QDP.event.raise('sidebar.collapse');
      } else {
        $("body").addClass("mini-menu");
        // EVENT-ON:siderbar.expand 导航栏展开后触发
        QDP.event.raise('sidebar.expand');
      }
      // 延迟触发
      // EVENT-ON:siderbar.changed 导航栏折叠\展开状态切换后触发
      setTimeout(function () {
        QDP.event.raise('sidebar.changed');
      }, 300);
    });

    // 处理全屏展示功能
    $(document).on('click', '.sys-fullscreen', function () {
      isFullScreen = !isFullScreen;
      if (isFullScreen) {
        fullScreen();
      } else {
        exitFullScreen();
      }
    });

    /** 刷新功能 */
    $(document).on('click', '.btn_refresh', function () {
      QDP.table.reload();
    });

    /** 导出功能 */
    $(document).on('click', '.btn_export', function () {
      QDP.table.export();
    });

    // 全选按钮点击事件处理函数
    $(document).on('click', '.btn-selectall', function () {
      var trs = $('table>tbody>tr[data-id]');
      trs.each(function (index) {
        if (!$(this).hasClass('selected')) {
          $(this).addClass('selected');
        }
        if (trs.length - 1 == index) {
          refreshButtonStatus();
        }
      });
    });

    // 反选按钮点击事件处理函数
    $(document).on('click', '.btn-selectopp', function () {
      var trs = $('table>tbody>tr[data-id]');
      trs.each(function (index) {
        if ($(this).hasClass('selected')) {
          $(this).removeClass('selected');
        } else {
          $(this).addClass('selected');
        }
        if (trs.length - 1 == index) {
          refreshButtonStatus();
        }
      });
    });

    $(document).on('click', "table", function (e) {
      try {
        if (e.target.localName == 'td') {
          var tr = $(e.target).parent();
          if (tr.data('id') == undefined) {
            return;
          }
          if (tr.hasClass('selected')) {
            tr.removeClass('selected');
          } else {
            tr.addClass('selected');
          }
        } else if ($(e.target).parent()[0].localName == 'td') {
          var tr = $(e.target).parent().parent();
          if (tr.data('id') == undefined) {
            return;
          }
          if (tr.hasClass('selected')) {
            tr.removeClass('selected');
          } else {
            tr.addClass('selected');
          }
        }
        refreshButtonStatus();
      } catch (e) {

      }
      // console.log(e);
    });

    var refreshButtonStatus = function () {
      var selector = $('table>tbody>tr[class="selected"]');
      if (selector.length == 1) {
        $(".btn_edit").removeAttr('disabled');
        $(".btn_look").removeAttr('disabled');
        $(".btn_remove").removeAttr('disabled');
      } else if (selector.length == 0) {
        $(".btn_edit").attr('disabled', "true");
        $(".btn_look").attr('disabled', "true");
        $(".btn_remove").attr('disabled', "true");
      } else {
        $(".btn_remove").removeAttr('disabled');
        $(".btn_look").attr('disabled', "true");
        $(".btn_edit").attr('disabled', "true");
      }
      // EVENT-RAISE:table.selected table选中行后出发 {selector,length}
      QDP.event.raise('table.selected', {
        "selector": selector,
        "length": selector.length
      });
    }

  });

});