define('app', ['jquery', 'cfgs', 'define', 'view', 'API'], function ($, cfgs, App, view, API) {
  // 系统运行后自动运行的方法集合
  var loginedExecuteFuncs = [];

  /** 初始化站点设置. */
  var _initSite = function () {
    document.title = cfgs.app_name;
    $.support.cors = true;
  };

  /** 初始化菜单. */
  var _initMenu = function () {
    var container = $(".sidebar-menu-container");
    container.empty();

    var createTag = function (text) {
      switch (text) {
        case "new":
          return $("<span />").text("NEW").addClass("badge btn-danger");
        case "hot":
          return $("<span />").text("HOT").addClass("badge btn-warning");
        case "ok":
          return $("<span />").text("OK").addClass("badge btn-success");
        default:
          return $("<span />").text(text).addClass("badge btn-info");
      }
    }

    var functions = App.userinfo.list.sort();
    if (cfgs.rootable) {
      cfgs.root = [];
    }

    $.each(functions, function (index, item) {
      var li, a, span, parentItem, parentA;
      var functionID = item;
      var module = cfgs.modules[functionID]; // 获取系统功能模块
      var parentModule = undefined;

      if (!module) {
        return;
      }

      if (module.parent == '000') {
        parentModule = {};
      } else {
        parentModule = cfgs.modules[module.parent];
      }

      // 判断菜单项级别
      parentItem = $("li[data-id=\"" + module.parent + "\"]", container);

      if (parentItem.length == 0) {
        var parentModule = cfgs.modules[module.parent];
        li = $("<li/>").attr("data-id", module.parent).appendTo(container);
        a = $("<a/>").appendTo(li);
        a.attr("href", "javascript:;");
        if (parentModule.icon) {
          var icon = $("<i/>").addClass(parentModule.icon).appendTo(a);
          if (parentModule.iconcolor) {
            icon.css("color", parentModule.iconcolor + " !important");
          }
          icon.css("fontSize", "20px");
        }
        span = $("<span/>").text(parentModule.name).addClass("menu-text").appendTo(a);

        if (parentModule.tags) {
          $.each(parentModule.tags, function (tindex, titem) {
            createTag(titem).appendTo(span);
          });
        }

        // 如果启用初始菜单则设定
        if (cfgs.rootable && cfgs.root.length == 0) {
          cfgs.root.push(parentModule.name);
        }
      }

      parentItem = $("li[data-id=\"" + module.parent + "\"]", container);
      if (parentItem.hasClass("has-sub") == false) {
        parentItem.addClass("has-sub");
        parentA = $("a[href=\"javascript:;\"]", parentItem);
        $("<span/>").addClass("arrow").appendTo(parentA);
        $("<ul/>").addClass("sub").appendTo(parentItem);
      }
      li = $("<li/>").attr("data-id", functionID).appendTo($("ul", parentItem));

      /**
       * 设置模块指向的地址获则脚本
       */

      if (module.url) {
        a = $("<a/>").attr("href", module.url).appendTo(li);
      } else {
        a = $("<a/>").attr("href", "#").appendTo(li);
      }

      /**
       * 为菜单处理加载回调事件
       */

      if (module.callback) {
        a.attr("data-callback", module.callback);
      }

      if (module.leave) {
        a.attr("data-leave", module.leave);
      }

      /**
       * 设置模块图标
       * 若模块图标未设置，则获取父级模块图标
       * 若模块图标设置为空，则不使用图标
       */

      if (module.icon) {
        if (module.icon != null) {
          $("<i/>").addClass(module.icon).appendTo(a);
        }
      } else if (parentModule.icon) {
        $("<i/>").addClass(parentModule.icon).appendTo(a);
      }

      span = $("<span/>").text(module.name).appendTo(a);

      if (module.tags) {
        $.each(module.tags, function (tindex, titem) {
          createTag(titem).appendTo(span);
        });
      }

      // 如果启用初始菜单则设定
      if (cfgs.rootable && cfgs.root.length == 1) {
        cfgs.root.push(module.name);
      }
    });

    // 注册导航栏一级菜单点击事件
    $(".sidebar-menu .has-sub > a").click(function () {
      var isOpen = $(this).parent().hasClass("open");
      var last = $(".has-sub.open", $(".sidebar-menu"));
      last.removeClass("open");
      $(".arrow", last).removeClass("open");
      // var thisElement = $(this);
      //菜单收起展开动画完成后执行
      var slidComplated = function () {
        view.contentChanged();
      }

      if (isOpen) {
        $(".arrow", $(this)).removeClass("open");
        $(this).parent().removeClass("open");
        slidComplated();
      } else {
        $(".arrow", $(this)).addClass("open");
        $(this).parent().addClass("open");
        slidComplated();
      }
    });

    // 注册导航栏收起/展开开关点击事件
    $(".sidebar-collapse").click(function () {
      if ($("body").hasClass("mini-menu")) {
        $("body").removeClass("mini-menu");
      } else {
        $("body").addClass("mini-menu");
      }
    });

    // 注册菜单点击事件
    $(".sidebar-menu-container").on("click", "a", function (e) {
      view.menuClick($(this), e);
    });

    // 自动导航至初始界面
    var urlArgs = App.util.parseURL(window.location.href);
    if (urlArgs.params.route) {
      var route = App.base64.decode(urlArgs.params.route).split(",");
      view.navigation(route);
    } else if (cfgs.root) {
      view.navigation(cfgs.root);
    }
  }

  /** 应用入口. */
  App.onReady = () => {
    App.logger.info("应用程序启动");
    /* 注册按钮事件 */
    $(".sys-logout").on("click", function () {
      App.ajax(API.login.logoutapi, {}, function () {
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
      view.toggleFullScreen();
    });
    if (!App.readCookie()) {
      App.logger.info("TOKEN验证失败,重新登录");
      App.route.gotoLogin(); /*不存在token或token失效，需重新登录*/
    } else {
      App.logger.info("TOKEN验证成功,进入系统");
      App.route.gotoMain(); /*token有效，可正常使用系统*/
    }
  }

  /** 初始化应用框架. */
  App.init = () => {
    var execComplated = function () {
      _initSite();
      _initMenu();
      view.contentChanged();
      $(window).resize(function () {
        setTimeout(view.contentChanged, 50);
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
  }

  /** 添加一个登录后执行的方法 func=function(next),next为必须参数*/
  App.addLoadedExecuteFunc = (func) => {
    loginedExecuteFuncs.push(func);
  }

  return App;
});