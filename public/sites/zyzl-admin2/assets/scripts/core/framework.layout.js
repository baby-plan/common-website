
define(['jquery', 'cfgs', 'API', 'block', 'plugin-dict', 'base64', 'ajax', 'util',
  'plugins/plugins.layout.cell',
  'plugins/plugins.layout.row',
  'plugins/plugins.layout.table',
  'plugins/plugins.layout.form'],
  function ($, cfgs, api, block, dict, base64, ajax, util, layoutCell, layoutRow, layoutTable, layoutForm) {
    let selected = undefined;
    let isFullScreen = false;
    let source_loaded = undefined;
    let loaded = undefined;
    let leaveAction = undefined;
    let lastLeaveAction = undefined;

    var _getViewPort = function () {
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

    /**
     * ajax方式加载页面内容.
     * @param {string} url 待加载内容的URL地址.
     * @param {string} callback 内容加载完成后的回调函数.
     */
    var _ajax_load_content = function (url, callback) {
      /** 初始化选中菜单层级 */
      var initMenuLevel = function () {
        cfgs.pageOptions.items = new Array();
        cfgs.pageOptions.menus = new Array();
        var datasid = cfgs.pageOptions.currentmenu.parent().attr("data-id");
        var item = cfgs.modules[datasid];
        cfgs.pageOptions.items.push(item);
        while (item.parent != "000") {
          item = cfgs.modules[item.parent];
          cfgs.pageOptions.items.push(item);
        }
      }
      /** 加载模块所依赖的脚本文件 */
      var loadModuleScripts = function () {
        if (cfgs.pageOptions.items[0] && cfgs.pageOptions.items[0].scripts) {
          $.each(cfgs.pageOptions.items[0].scripts, function (index, item) {
            $.getScript(item);
          });
        }
      };
      /** 处理mini-menu高亮状态 */
      var highlightSelected = function () {
        if ($("body").hasClass("mini-menu")) {
          $(".open", $(".sidebar-menu")).each(function () {
            $(this).removeClass("open");
          });
          var text = cfgs.pageOptions.items[cfgs.pageOptions.items.length - 1].name;
          $("li>a>.menu-text", $(".sidebar-menu-container")).each(function () {
            if ($(this).text() == text) {
              $(this).parent().parent().addClass("open");
            }
          });
        }
      }

      /** 重置页面描述性信息:导航地图、权限按钮等等 */
      var resetBreadcrumb = function () {
        $(".content-breadcrumb").empty();
        /* 移除breadcrumb全部节点 */
        for (var index = cfgs.pageOptions.items.length - 1; index >= 0; index--) {
          cfgs.pageOptions.menus[index] = cfgs.pageOptions.items[index].name;
          var breadcrumb = $("<li />").appendTo($(".content-breadcrumb"));

          if (index == 0) {

            var a = $("<a href=\"javascript:;\" class=\"breadcrumb-item\"/>").appendTo(breadcrumb);

            if (cfgs.pageOptions.items[index].icon) {
              $("<i />").addClass(cfgs.pageOptions.items[index].icon).appendTo(a);
            }

            a.append(" " + cfgs.pageOptions.items[index].name);

          } else {
            $("<span/>").text(" " + cfgs.pageOptions.items[index].name).appendTo(breadcrumb);
          }

        }

        $(".breadcrumb-item").on("click", function () {
          auto_navigation(cfgs.pageOptions.menus);
        });
      };

      /** 页面加载完成时的回调函数 */
      var loadcallback = function () {

        block.close();
        console.info("加载完成:" + options.url);

        // 重置页面内容区工具栏
        $(".content-toolbar").empty();

        var tools = $("tools");
        if (tools.length > 0) {
          tools.appendTo($(".content-toolbar"));
        }

        $(".content-header").show();

        if (typeof callback === 'function') {
          callback();
        }

        initMenuLevel();
        resetBreadcrumb();
        loadModuleScripts();
        highlightSelected();

        if ($("#ajax-content").hasClass("fadeOutRight")) {
          $("#ajax-content").removeClass("fadeOutRight");
        }
        $("#ajax-content").addClass("fadeInRight");

        setTimeout(function () {
          $("#ajax-content").removeClass("fadeInRight");
          _refresh_scroller();
        }, 500);
      }

      if (!url) {
        console.error('请求地址不存在!<br/>地址: <a href="%s" target="_black">%s</a>', url, url);
        return;
      } else {
        console.info('准备加载:%s', url);
      }

      block.show("正在加载页面...");

      var options = {
        "url": url,
        "callback": loadcallback,
        "block": true
      };

      /* 初始化页面元素 */
      $("body>#fbmodal_overlay,body>.datetimepicker,body>.daterangepicker").remove();
      $("body>.fbmodal>*").remove();
      $("#ajax-content").addClass("fadeOutRight");
      /* 加载页面内容 */
      $("#ajax-content").load(url, loadcallback);
    }

    /** 处理菜单项点击.
     * @param sender 按钮对象.
     * @param eventArgs 事件参数.
     */
    var on_menu_click = function (sender, eventArgs) {
      var url = sender.attr("href");
      var dataModule = sender.attr("data-module");
      var dataMethod = sender.attr("data-method");
      var dataLeave = sender.attr("data-leave");
      if (url == "javascript:;") {
        return;
      }
      if (url == "#") {
        url = cfgs.listpage;
      }
      var callback;
      var text = sender.text(); //$(".sub-menu-text", sender).text(); // 功能名称
      if (dataModule) {
        if (dataMethod) {
          callback = function () {
            require([dataModule], function (moduleObject) {
              if (loaded) {
                source_loaded = loaded;
              }
              loaded = moduleObject;
              console.debug("module[%s] %s", dataModule, dataMethod);
              if (moduleObject && moduleObject.define) {
                let info = moduleObject.define;
                console.debug("[%s v%s] %s", info.name, info.version, info.copyright);
              }
              moduleObject[dataMethod]()
            });
          }

        }
        // if (leave) {
        //   if (leave.indexOf("$P") >= 0) {
        //     leaveAction = leave.replace("$P", "App.plugins") + ".init()";
        //   } else if (leave.indexOf("$D") >= 0) {
        //     var args = leave.split("/");
        //     leaveAction = "App.plugins.dict.Package('" + args[1] + "','" + text + "')";
        //   } else if (leave.indexOf("$M") >= 0) {
        //     leaveAction = leave.replace("$M", "App.modules") + "()";
        //   } else {
        //     leaveAction = leave + "()";
        //   }
        // }
      }

      console.debug('菜单,href=%s,data-module=%s,data-method=%s,data-leave=%s', url, dataModule, dataMethod, dataLeave);

      if (eventArgs) {
        eventArgs.preventDefault();
      }
      if (cfgs.pageOptions.currentmenu != null) {
        cfgs.pageOptions.currentmenu.parent().removeClass("active");
      }

      cfgs.pageOptions.currentmenu = sender;
      cfgs.pageOptions.currentmenu.parent().addClass("active");
      if (url) {
        if (lastLeaveAction) {
          lastLeaveAction();
          lastLeaveAction = undefined;
        }
        lastLeaveAction = leaveAction;
        _ajax_load_content(url, callback);
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

    var _initMenu = function () {

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

      var functions = [];// App.userinfo.list.sort();

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

      var container = $(".sidebar-menu-container");
      container.empty();

      $.each(functions, function (index, item) {
        var li, a, span, parentItem, parentA;
        var functionID = item;
        var module = cfgs.modules[functionID]; // 获取系统功能模块
        var parentModule = undefined;

        if (!module) { return; }

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

        if (module.module) {
          a.attr("data-module", module.module);
        }

        if (module.method) {
          a.attr("data-method", module.method);
        }

        // if (module.callback) {
        //   a.attr("data-callback", module.callback);
        // }

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

      auto_navigation(cfgs.root);

      console.info("菜单初始化完成");
    };

    let module = {
      'load': _ajax_load_content,
      /** 导航至前一界面 */
      'back': function () {
        auto_navigation(cfgs.pageOptions.menus);
      },
      /** 导航至系统主界面 */
      'gotoMain': function () {
        $("header").show();
        $("body").removeClass("login");
        $("section").attr("id", "page");
        var username = '王鑫';//App.userinfo.name;
        var rolename = '系统管理员';//App.userinfo.rolename;
        $(".username").text(username + "【" + rolename + "】");
        $("#page").load(api.login.mainpage, function () {
          _initMenu();
        });
      },
      cell: layoutCell,
      row: layoutRow,
      table: layoutTable,
      form: layoutForm
    };

    layoutForm.source = module;

    /* 处理【取消/返回】按钮事件 */
    $(document).on('click', '.btn_back', function (e) {
      e.preventDefault();
      if ($(this).hasClass("custom") == false) {
        module.back();
      }
    });

    /** 刷新功能 */
    $(document).on('click', '.btn_refresh', function (e) {
      module.form.reload();
    });

    $(window).on('resize', function () {
      setTimeout(_refresh_scroller, 500);
    });

    // 注册导航栏一级菜单点击事件
    $(document).on('click', '.sidebar-menu .has-sub > a', function (e) {
      var isOpen = $(this).parent().hasClass("open");
      var last = $(".has-sub.open", $(".sidebar-menu"));
      last.removeClass("open");
      $(".arrow", last).removeClass("open");

      var sub = $(this).next();
      if (isOpen) {
        $(".arrow", $(this)).removeClass("open");
        $(this).parent().removeClass("open");
      } else {
        $(".arrow", $(this)).addClass("open");
        $(this).parent().addClass("open");
      }
      _refresh_scroller();
    });

    // 注册导航栏收起/展开开关点击事件
    $(document).on('click', '.sidebar-collapse', function (e) {
      if ($("body").hasClass("mini-menu")) {
        $("body").removeClass("mini-menu");
      } else {
        $("body").addClass("mini-menu");
      }
    });

    // 注册菜单点击事件
    $(document).on('click', '.sidebar-menu-container a', function (e) {
      on_menu_click($(this), e);
    });

    return module;
  });
