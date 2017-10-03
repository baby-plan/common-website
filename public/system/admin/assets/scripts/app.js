var App = function () {
  // 系统运行后自动运行的方法集合
  var loginedExecuteFuncs = [];
  var isFullScreen = false;
  /** 重新设置滚动条 */
  var _refresh_scroller = function () {
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
    /** 应用入口. */
    "onReady": function () {
      // console.groupCollapsed();
      App.logger.info("应用程序启动");
      /* 注册按钮事件 */
      $(".sys-logout").on("click", function () {
        App.ajax(API.login.logoutapi, {}, function (json) {
          $.cookie(API.login.token_cookie, "")
          App.route.gotoLogin();
        });
      });
      $(".sys-chgpwd").on("click", function () {
        App.route.changepwd();
      });
      $(".sys-changeinfo").on("click", function () {
        App.route.changeinfo();
      });
      $('#tools-screen').on('click', function () {
        if (isFullScreen) {
          exitFullScreen();
        } else {
          fullScreen();
        }
      });
      if (!App.readCookie()) {
        App.logger.info("TOKEN验证失败,重新登录");
        App.route.gotoLogin(); /*不存在token或token失效，需重新登录*/
      } else {
        App.logger.info("TOKEN验证成功,进入系统");
        App.route.gotoMain(); /*token有效，可正常使用系统*/
      }
    },
    /** 初始化应用框架. */
    "init": function () {
      var execComplated = function () {
        _initSite();
        _initMenu();
        _refresh_scroller();
        $(window).resize(function () {
          setTimeout(function () {
            _refresh_scroller();
          }, 50);
        });
      }
      var index = 0;
      var execNext = function () {
        if (index == loginedExecuteFuncs.length) {
          execComplated();
        } else {
          index++;
          loginedExecuteFuncs[index - 1](execNext);
        }
      }
      execNext();
    },
    /** */
    "getViewPort": function () {
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
    },
    /** 刷新内容区域的滚动条. */
    "contentChanged": function () {
      _refresh_scroller();
    },
    /** 将登录信息JSON内容保存至COOKIE.
     * @param {object} json 要保存的JSON内容,目前仅保存登录信息.
     */
    "saveCookie": function (json) {
      if (json == "") {
        $.cookie(API.login.token_cookie, "");
        this.userinfo = null;
        App.logger.debug("清除COOKIE " + API.login.token_cookie);
      } else {
        this.userinfo = json.data;
        this.userinfo.name = App.base64.decode(this.userinfo.name);
        this.userinfo.rolename = App.base64.decode(this.userinfo.rolename);
        this.userinfo.nickname = App.base64.decode(this.userinfo.nickname);
        this.userinfo.account = App.base64.decode(this.userinfo.account);
        this.userinfo.email = App.base64.decode(this.userinfo.email);
        $.cookie(API.login.token_cookie, App.util.jsonToString(this.userinfo));
        App.logger.debug("保存COOKIE " + API.login.token_cookie + " = " + App.util.jsonToString(this.userinfo));
      }
    },
    /** 读取COOKIE中的登录信息JSON内容. */
    "readCookie": function () {
      var cookieStr = $.cookie(API.login.token_cookie);
      App.logger.debug("读取COOKIE " + API.login.token_cookie);
      if (cookieStr == undefined || cookieStr == "") {
        App.logger.debug("COOKIE " + API.login.token_cookie + " 不存在或没有值！");
        return undefined;
      } else {
        App.logger.debug("COOKIE " + API.login.token_cookie + " = " + cookieStr);
        var json = $.parseJSON(cookieStr);
        this.userinfo = json;
        return json;
      }
    },
    /** 将页面内容滚动到指定位置. */
    "scrollTo": function (el, offeset) {
      pos = (el && el.size() > 0) ? el.offset().top : 0;
      $("html,body").animate({
        scrollTop: pos + (offeset ? offeset : 0)
      }, "slow");
    },
    /** 当前登录用户的信息 */
    "userinfo": {},
    /** 当前登录用户的信息 */
    "plugins": {},
    /** 当前登录用户的信息 */
    "modules": {
      "actions": {}
    },
    /** 添加一个登录后执行的方法 func=function(next),next为必须参数*/
    "addLoadedExecuteFunc": function (func) {
      loginedExecuteFuncs.push(func);
    }
  };

}();