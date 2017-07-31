define(['jquery', 'cfgs', 'define'], ($, cfgs, App) => {

  var leaveAction = undefined;
  var lastLeaveAction = undefined;
  var isFullScreen = false;

  document.addEventListener("fullscreenchange", function () {
    //    (document.fullscreen) ? "" : "not ";
    _refresh_scroller();
  }, false);
  document.addEventListener("mozfullscreenchange", function () {
    // (document.mozFullScreen) ? "" : "not ";
    _refresh_scroller();
  }, false);
  document.addEventListener("webkitfullscreenchange", function () {
    // (document.webkitIsFullScreen) ? "" : "not ";
    _refresh_scroller();
  }, false);
  document.addEventListener("msfullscreenchange", function () {
    // (fullscreenState.innerHTML = ()document.msFullscreenElement) ? "" : "not ";
    _refresh_scroller();
  }, false);

  var _getViewPort = () => {
    var e = window,
      a = "inner";
    if (!("innerWidth" in window)) {
      a = "client";
      e = document.documentElement || document.body;
    }
    return {
      width: e[a + "Width"],
      height: e[a + "Height"]
    }
  };

  /**
   * 处理菜单项点击.
   * @param {object} sender 按钮对象.
   * @param {object} eventArgs 事件参数.
   */
  var on_menu_click = function (sender, eventArgs) {
    var url = sender.attr("href");
    var callback = sender.attr("data-callback");
    var leave = sender.attr("data-leave");
    if (url == "javascript:;") {
      return;
    }
    if (url == "#") {
      url = cfgs.listpage;
    }
    var text = $(".sub-menu-text", sender).text(); // 功能名称
    if (callback) {
      if (callback.indexOf("$P") >= 0) {
        callback = callback.replace("$P", "App.plugins") + ".init()";
      } else if (callback.indexOf("$D") >= 0) {
        var args = callback.split("/");
        callback = "App.plugins.dict.Package('" + args[1] + "','" + text + "')";
      } else if (callback.indexOf("$M") >= 0) {
        callback = callback.replace("$M", "App.modules") + "()";
      } else {
        callback = callback + "()";
      }
    }

    if (leave) {
      if (leave.indexOf("$P") >= 0) {
        leaveAction = leave.replace("$P", "App.plugins") + ".init()";
      } else if (leave.indexOf("$D") >= 0) {
        var args = leave.split("/");
        leaveAction = "App.plugins.dict.Package('" + args[1] + "','" + text + "')";
      } else if (leave.indexOf("$M") >= 0) {
        leaveAction = leave.replace("$M", "App.modules") + "()";
      } else {
        leaveAction = leave + "()";
      }
    }

    App.logger.debug("菜单,href=" + url + ",data-callback=" + callback + ",leave=" + leaveAction);
    if (eventArgs) {
      eventArgs.preventDefault();
    }
    if (cfgs.pageOptions.currentmenu != null) {
      cfgs.pageOptions.currentmenu.parent().removeClass("active");
    }
    if (!$("body").hasClass("mini-menu") && _getViewPort().width < 768) {
      $("body").addClass("mini-menu")
    }
    cfgs.pageOptions.currentmenu = sender;
    cfgs.pageOptions.currentmenu.parent().addClass("active");
    if (url) {
      if (lastLeaveAction) {
        eval(lastLeaveAction);
        lastLeaveAction = undefined;
      }
      lastLeaveAction = leaveAction;
      App.form.load(url, callback);
    }
  };

  /**
   *  按照目录层级,自动打开页面.
   * @param path 导航路径.
   */
  var _navigation = function (path) {
    var doNavigation = function () {
      var container = $(".sidebar-menu-container");
      $.each(path, function (index, item) {
        var span = container.find("span:contains(\"" + item + "\")");
        var link = span.parent();
        var li = link.parent();

        if (li.hasClass("has-sub")) {
          li.addClass("open");
          li.find("span[class=\"arrow\"]").addClass("open");
        } else {
          li.addClass("active");
          cfgs.pageOptions.currentmenu = li.find("a");
          li.parent().slideDown(200, function () {
            on_menu_click(cfgs.pageOptions.currentmenu);
          });
        }
      });
    }
    var openeds = $(".has-sub.open", $(".sidebar-menu-container"));
    var count = openeds.length;
    if (count == 1 && $("a>span[class=\"menu-text\"]", openeds).text() != path[path.length - 1]) {
      openeds.removeClass("open");
      $(".arrow", openeds).removeClass("open");
      $(".sub", openeds).slideUp(200, doNavigation);
    } else {
      doNavigation();
    }
  }

  /** 重新设置滚动条 */
  var _refresh_scroller = () => {
    var breadcrumbHeight = $(".content-header").outerHeight();
    var headerHeight = $("header").outerHeight();
    var windowHeight = $(window).outerHeight();
    var footerHeader = $("footer").outerHeight();
    var sidebarHeight = windowHeight - headerHeight - footerHeader;
    var contentHeight = windowHeight - headerHeight - breadcrumbHeight - footerHeader;
    var newOptions, options;

    var height = windowHeight - headerHeight - footerHeader;
    $("#content").css('height', height + 'px');
    // 处理导航栏滚动条显示状态
    if (sidebarHeight <= $(".sidebar-menu").height()) {
      newOptions = {
        height: sidebarHeight
      };
      options = $.extend(cfgs.options.scroller, newOptions);
      $(".sidebar-menu").slimScroll(options);
      $(".sidebar-menu").css("height", sidebarHeight + "px");
    } else {
      $(".sidebar").append($(".sidebar-menu"));
      $(".sidebar>.slimScrollDiv").remove();
      $(".sidebar-menu").removeAttr("style");
    }
    // 处理内容区滚动条显示状态
    $("#content-container").height(contentHeight);
    // App.logger.debug("contentHeight=" + contentHeight);
    // App.logger.debug("ajax-content=" + $("#ajax-content").parent().height());
    if (contentHeight < 800 || $("#ajax-content").parent().height() > contentHeight) {
      newOptions = {
        height: contentHeight
      };
      options = $.extend(cfgs.options.scroller, newOptions);
      $("#content-container").slimScroll(options);
      $("#content-container").css("height", contentHeight + "px");
    } else {
      $("#content").append($("#content-container"));
      $("#content>.slimScrollDiv").remove();
      $("#content-container").removeAttr("style");
      $("#content-container").height(contentHeight);
    }

    $("select:not(.monthselect,.yearselect)").each(function () {
      var selectvalue = $(this).attr("data-value");
      var ismulit = $(this).attr("data-mulit");
      $(this).select2(cfgs.options.select2)
      if (selectvalue) {
        if (ismulit) {
          $(this).val(selectvalue.split(",")).trigger("change");
        } else {
          $(this).val(selectvalue).trigger("change");
        }
      } else {
        $(this).val(null).trigger("change");
      }
    });
  }

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

  return {
    navigation: _navigation,
    /** */
    getViewPort: _getViewPort,

    /** 刷新内容区域的滚动条. */
    contentChanged: _refresh_scroller,

    menuClick: on_menu_click,

    toggleFullScreen: () => {
      if (isFullScreen) {
        exitFullScreen();
      } else {
        fullScreen();
      }
    }
  }
});