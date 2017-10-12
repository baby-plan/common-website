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

  QDP.event.on("layout.started", function () {
    console.info("注册->系统运行后自动注册 - plugins-events");

    // 注册导航栏收起/展开开关点击事件
    $(document).on("click", ".sidebar-collapse", function () {
      if ($("body").hasClass("mini-menu")) {
        $("body").removeClass("mini-menu");
      } else {
        $("body").addClass("mini-menu");
      }
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

    /** 筛选功能 */
    $(document).on("click", "#record-container", function () {
      $('body').removeClass('filter');
    });
    $(document).on('click', '.btn_filter', function () {
      if ($('body').hasClass('filter')) {
        $('body').removeClass('filter');
      } else {
        $('body').addClass('filter');
      }
    });

  });

});