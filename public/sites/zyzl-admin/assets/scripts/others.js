/** 初始化站点设置. */
var _initSite = function () {
  document.title = cfgs.app_name;
  jQuery.support.cors = true;
};
var leaveAction = undefined;
var lastLeaveAction = undefined;
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
  if (cfgs.debug) {
    functions = [];
    $.each(cfgs.modules, function (index, item) {
      if (item.parent != '000') {
        functions.push(index);
      }
    });
    functions = functions.sort();
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
      App.contentChanged();
    }
    var sub = $(this).next();
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
    on_menu_click($(this), e);
  });

  // 自动导航至初始界面
  var urlArgs = App.util.parseURL(window.location.href);
  if (urlArgs.params.route) {
    var route = App.base64.decode(urlArgs.params.route).split(",");
    auto_navigation(route);
  } else if (cfgs.root) {
    auto_navigation(cfgs.root);
  }
}

/** Sidebar事件注册 */
var handleSidebar = function () {

}

/** 处理菜单项点击.
 * @param sender 按钮对象.
 * @param eventArgs 事件参数.
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
  var text = sender.text(); //$(".sub-menu-text", sender).text(); // 功能名称
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
  if (pageOptions.currentmenu != null) {
    pageOptions.currentmenu.parent().removeClass("active");
  }
  if (!$("body").hasClass("mini-menu") && App.getViewPort().width < 768) {
    $("body").addClass("mini-menu")
  }
  pageOptions.currentmenu = sender;
  pageOptions.currentmenu.parent().addClass("active");
  if (url) {
    if (lastLeaveAction) {
      eval(lastLeaveAction);
      lastLeaveAction = undefined;
    }
    lastLeaveAction = leaveAction;
    App.form.load(url, callback);
  }
};

/** 按照目录层级,自动打开页面.
 * @param path 导航路径.
 */
var auto_navigation = function (path) {
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
        pageOptions.currentmenu = li.find("a");
        li.parent().slideDown(200, function () {
          on_menu_click(pageOptions.currentmenu);
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