define(
  [
    "jquery",
    "cfgs",
    "API",
    "core/core-modules/framework.block",
    "core/core-modules/framework.ajax",
    "core/core-modules/framework.util",
    "core/core-modules/framework.dialog",
    "core/core-modules/framework.event",
    "jquery.slimscroll",
    'bootstrap-datetimepicker-CN',
    "jquery.uniform",
    'select2-CN',
    "bootstrap",
    "css!/assets/plugins/bootstrap/css/bootstrap.min.css",
    "css!/assets/css/animate.css",
    "css!/assets/fonts/font.css",
    "css!../../../css/color.css",
    "css!../../../css/main.css"
  ],
  function (
    $,
    cfgs,
    api,
    block,
    ajax,
    util,
    dialog,
    event
  ) {
    let loaded = undefined, leaveAction = undefined, leaveModule = undefined;

    var _initMenu = function () {

      var createTag = function (text) {
        switch (text) {
          case "new":
            return $("<span />")
              .text("NEW")
              .addClass("badge btn-danger");
          case "hot":
            return $("<span />")
              .text("HOT")
              .addClass("badge btn-warning");
          case "ok":
            return $("<span />")
              .text("OK")
              .addClass("badge btn-success");
          default:
            return $("<span />")
              .text(text)
              .addClass("badge btn-info");
        }
      };

      var createMenuItem = function (functionID, module, parentModule, parentItem) {

        var li, a, span;
        if (parentModule) {
          li = $("<li/>")
            .attr("data-id", functionID)
            .appendTo($("ul", parentItem));
        } else {
          li = $("<li/>")
            .attr("data-id", functionID)
            .appendTo(parentItem);
        }

        a = $("<a/>")
          .attr("href", module.url || "#")
          .attr("data-module", module.module)
          .attr("data-method", module.method)
          .attr("data-leave", module.leave)
          .attr("data-args", module.args)
          .appendTo(li);

        /**
         * 设置模块图标
         * 若模块图标未设置，则获取父级模块图标
         * 若模块图标设置为空，则不使用图标
         */

        if (module.icon) {
          $("<i/>")
            .addClass(module.icon)
            .appendTo(a);
        } else if (parentModule && parentModule.icon) {
          $("<i/>")
            .addClass(parentModule.icon)
            .appendTo(a);
        }

        span = $("<span/>")
          .text(module.name)
          .appendTo(a);

        if (module.tags) {
          $.each(module.tags, function (tindex, titem) {
            createTag(titem).appendTo(span);
          });
        }
      }

      var functions = []; // App.userinfo.list.sort();

      if (cfgs.rootable) {
        cfgs.root = [];
      }

      $.each(cfgs.powers, function (index, power) {
        if (power.id) {
          functions.push(power.id);
        }
      });

      var container = $(".sidebar-menu-container");
      container.empty();

      $.each(functions, function (index, functionID) {

        var a, span, parentA;
        var module = cfgs.modules[functionID]; // 获取系统功能模块
        // 若module不存在则忽略
        if (!module) {
          return;
        }

        if (module.parent) {
          // 处理二级菜单
          var parentModule = cfgs.modules[module.parent];
          // 判断菜单项级别
          var parentItem = $('li[data-id="' + module.parent + '"]', container);

          if (parentItem.length == 0) {
            // 处理一级目录
            parentItem = $("<li/>")
              .attr("data-id", module.parent)
              .appendTo(container);
            a = $("<a/>")
              .appendTo(parentItem)
              .attr("href", "javascript:;");
            if (parentModule.icon) {
              var icon = $("<i/>")
                .addClass(parentModule.icon)
                .appendTo(a);
              if (parentModule.iconcolor) {
                icon.css("color", parentModule.iconcolor + " !important");
              }
              icon.css("fontSize", "20px");
            }

            span = $("<span/>")
              .text(parentModule.name)
              .addClass("menu-text")
              .appendTo(a);

            if (parentModule.tags) {
              $.each(parentModule.tags, function (tindex, titem) {
                createTag(titem).appendTo(span);
              });
            }

            if (parentItem.hasClass("has-sub") == false) {
              parentItem.addClass("has-sub");
              parentA = $('a[href="javascript:;"]', parentItem);
              $("<span/>")
                .addClass("arrow")
                .appendTo(parentA);
              $("<ul/>")
                .addClass("sub")
                .appendTo(parentItem);
            }

            // 如果启用初始菜单则设定
            if (cfgs.rootable && cfgs.root.length == 0) {
              cfgs.root.push(parentModule.name);
            }
          }

          createMenuItem(functionID, module, parentModule, parentItem);

          // 如果启用初始菜单则设定
          // if (cfgs.rootable && cfgs.root.length == 1) {
          //   cfgs.root.push(module.name);
          // }
        } else if (module.module || module.url) {
          // 处理一级菜单
          createMenuItem(functionID, module, undefined, container);
          // 如果启用初始菜单则设定
          if (cfgs.rootable && cfgs.root.length == 0) {
            cfgs.root.push(module.name);
          }
        } else {


        }

      });

      console.info("菜单初始化完成");

      // 延迟初始化初始页面，避免菜单初始化过慢导致无法显示初始页面
      setTimeout(function () {
        var url = util.parseURL(window.location);
        if (url && url.query) {
          var args = url.query.substring(1);
          var ArgsObject = args.split('\\');
          var root = [];
          root.push(cfgs.modules[ArgsObject[0]].name);
          auto_navigation(root);
        } else {
          auto_navigation(cfgs.root);
        }
        // console.log(url);
      }, 100);
    };

    //  重置内容区域滚动条
    var resizeContentScroll = function () {
      $("#content").append($("#content-container"));
      $("#content>.slimScrollDiv").remove();
      $("#content-container").removeAttr("style");

      var windowHeight = $(window).outerHeight();
      var breadcrumbHeight = $(".content-header").outerHeight();
      var contentHeight = windowHeight - breadcrumbHeight;

      var options = $.extend(cfgs.options.scroller,
        {
          height: contentHeight,
          // color: "#0786d6"
        });

      $("#content-container").css("height", contentHeight + "px");
      $("#content-container").slimScroll(options);
    }

    /** 重置导航区域滚动条 */
    var _refresh_scroller = function () {
      $("body>aside>header").after($(".sidebar-menu"));
      $("body>aside>.slimScrollDiv").remove();
      $(".sidebar-menu").removeAttr("style");

      var userHeight = $("body>aside>header").outerHeight();
      var footerHeight = $("body>aside>footer").outerHeight();
      var windowHeight = $(window).outerHeight();
      var sidebarHeight = windowHeight - footerHeight - userHeight;

      var options = $.extend(cfgs.options.scroller, {
        height: sidebarHeight
      });
      $(".sidebar-menu").css("height", sidebarHeight + "px");
      $(".sidebar-menu").slimScroll(options);

    };

    //#region 处理 采用AJAX方式加载内容

    /** 初始化选中菜单层级 */
    var initMenuLevel = function () {
      var res = util.parseURL(window.location);
      var newUrl = res.path.substring(1) + "?";

      cfgs.pageOptions.items = new Array();
      cfgs.pageOptions.menus = new Array();
      var datasid = cfgs.pageOptions.currentmenu.parent().attr("data-id");
      var item = cfgs.modules[datasid];
      newUrl += datasid;
      cfgs.pageOptions.items.push(item);
      while (item.parent && item.parent != "000") {
        item = cfgs.modules[item.parent];
        cfgs.pageOptions.items.push(item);
      }
      history.pushState({}, 0, 'http://' + window.location.host + '/' + newUrl);
    };

    /** 处理mini-menu高亮状态 */
    var highlightSelected = function () {
      if ($("body").hasClass("mini-menu")) {
        $(".open", $(".sidebar-menu")).each(function () {
          $(this).removeClass("open");
        });
        var text =
          cfgs.pageOptions.items[cfgs.pageOptions.items.length - 1].name;
        $("li>a>.menu-text", $(".sidebar-menu-container")).each(function () {
          if ($(this).text() == text) {
            $(this)
              .parent()
              .parent()
              .addClass("open");
          }
        });
      }
    };

    /** 重置页面描述性信息:导航地图、权限按钮等等 */
    var resetBreadcrumb = function () {
      $(".content-breadcrumb").empty();
      /* 移除breadcrumb全部节点 */
      for (
        var index = cfgs.pageOptions.items.length - 1;
        index >= 0;
        index--
      ) {
        cfgs.pageOptions.menus[index] = cfgs.pageOptions.items[index].name;
        var breadcrumb = $("<li />").appendTo($(".content-breadcrumb"));

        if (index == 0) {
          var a = $(
            '<a href="javascript:;" class="breadcrumb-item"/>'
          ).appendTo(breadcrumb);

          if (cfgs.pageOptions.items[index].icon) {
            $("<i />")
              .addClass(cfgs.pageOptions.items[index].icon)
              .appendTo(a);
          }

          a.append(" " + cfgs.pageOptions.items[index].name);
        } else {
          $("<span/>")
            .text(" " + cfgs.pageOptions.items[index].name)
            .appendTo(breadcrumb);
        }
      }

      $(".breadcrumb-item").on("click", function () {
        auto_navigation(cfgs.pageOptions.menus);
      });
    };

    //#endregion //#region 处理 采用AJAX方式加载内容

    /** ajax方式加载页面内容.
     * @param {string} url 待加载内容的URL地址.
     * @param {string} callback 内容加载完成后的回调函数.
     */
    var _ajax_load_content = function (url, callback) {

      /** 页面加载完成时的回调函数 */
      var loadcallback = function () {
        block.close();
        console.info("加载完成:" + options.url);
        $(".content-toolbar").empty();
        var tools = $("tools>*");
        if (tools.length > 0) {
          // 重置页面内容区工具栏
          $(".content-toolbar").empty();
          $.each(tools, function () {
            $(this).appendTo($(".content-toolbar"));
          });
        }

        initMenuLevel();
        resetBreadcrumb();
        highlightSelected();

        if ($(".ajax-content").hasClass("fadeOutRight")) {
          $(".ajax-content").removeClass("fadeOutRight");
        }
        $(".ajax-content").addClass("fadeInRight");

        if (typeof callback === "function") {
          callback();
        }

        setTimeout(function () {
          $(".ajax-content").removeClass("fadeInRight");
        }, 500);
      };

      if (!url) {
        console.error(
          '请求地址不存在!<br/>地址: <a href="%s" target="_black">%s</a>',
          url,
          url
        );
        return;
      } else {
        console.info("准备加载:%s", url);
      }

      var options = {
        url: url,
        callback: loadcallback,
        block: true
      };

      block.show("正在加载页面...");
      /* 初始化页面元素 */
      $("body>.datetimepicker").remove();
      $(".ajax-content").addClass("fadeOutRight");
      /* 加载页面内容 */
      $(".ajax-content").load(url, loadcallback);

    };

    /** 处理菜单项点击.
     * @param sender 按钮对象.
     * @param eventArgs 事件参数.
     */
    var on_menu_click = function (sender, eventArgs) {
      var url = sender.attr("href");
      var dataModule = sender.attr("data-module");
      var dataMethod = sender.attr("data-method");
      var dataArgs = sender.attr("data-args");
      var dataLeave = sender.attr("data-leave");

      if (!dataMethod) {
        dataMethod = 'init';
      }
      if (!dataLeave) {
        dataLeave = 'destroy';
      }

      if (url == "javascript:;") {
        return;
      } else if (url == "#") {
        url = cfgs.listpage;
      }

      if (loaded) {
        if (leaveAction && typeof loaded[leaveAction] == "function") {
          console.debug("module[%s] %s", leaveModule, leaveAction);
          loaded[leaveAction]();
        }
      }

      leaveAction = dataLeave;
      leaveModule = dataModule;

      var callback;
      var text = sender.text(); //$(".sub-menu-text", sender).text(); // 功能名称
      console.debug(
        "menu-click,href=%s,data-module=%s,data-method=%s,data-args=%s,data-leave=%s",
        url,
        dataModule,
        dataMethod,
        dataArgs,
        dataLeave
      );

      if (dataModule && dataMethod) {
        callback = function () {
          $("body").removeClass("filter");
          $(".mini-menu").removeClass("mini-menu");
          // 加载模块脚本
          require([dataModule], function (moduleObject) {
            loaded = moduleObject;
            console.debug("module[%s] %s", dataModule, dataMethod);
            if (moduleObject) {
              if (moduleObject.define) {
                let info = moduleObject.define;
                console.debug(
                  "[%s v%s] %s",
                  info.name,
                  info.version,
                  info.copyright
                );
              }
              let initMethod = moduleObject[dataMethod];
              if (initMethod && typeof initMethod === 'function') {
                initMethod(text, dataArgs);
              }
            }//if (moduleObject) {

          });
        };
      }

      if (eventArgs) {
        eventArgs.preventDefault();
      }

      // 处理菜单选中状态
      if (sender.parent().parent().hasClass('sub')) {
        if (cfgs.pageOptions.currentmenu != null) {
          cfgs.pageOptions.currentmenu.parent().removeClass("active");
        }
      } else {
        var container = $(".sidebar-menu-container");
        $(".open", container).removeClass('open');
        $(".active", container).removeClass('active');
      }

      cfgs.pageOptions.currentmenu = sender;
      sender.parent().addClass("active");

      // 生成权限组
      var powers = [];
      var moduleID = sender.parent().attr('data-id');
      var moduleDefine = cfgs.modules[moduleID];
      var modulePowers = cfgs.powers.find(function (p) { return p.id == moduleID; });
      if (modulePowers && modulePowers.actions && modulePowers.actions.length > 0) {
        $.each(modulePowers.actions, function (index, action) {
          var powerdefine = moduleDefine.actions.find(function (p) { return p.id == action });
          powers.push(powerdefine.action);
        })
      }
      cfgs.pageOptions.powers = powers;

      _ajax_load_content(url, callback);
    };

    /** 按照目录层级,自动打开页面.
     * @param path 导航路径.
     */
    var auto_navigation = function (path) {

      var doNavigation = function () {
        var container = $(".sidebar-menu-container");
        $.each(path, function (index, item) {
          var span = container.find('span:contains("' + item + '")');
          var link = span.parent();
          var li = link.parent();

          if (li.hasClass("has-sub")) {
            li.addClass("open");
            li.find('span[class="arrow"]').addClass("open");
          } else {
            li.addClass("active");
            cfgs.pageOptions.currentmenu = li.find("a");
            li.parent().parent().addClass('open');
            // li.parent().slideDown(200, function () {
            on_menu_click(cfgs.pageOptions.currentmenu);
            // });
          }
        });
      };
      var openeds = $(".has-sub.open", $(".sidebar-menu-container"));
      var count = openeds.length;
      if (count == 1 && $('a>span[class="menu-text"]', openeds).text() != path[path.length - 1]) {
        openeds.removeClass("open");
        $(".arrow", openeds).removeClass("open");
        $(".sub", openeds).slideUp(200, doNavigation);
      } else {
        doNavigation();
      }
    };

    // EVENT-ON:layout.started
    event.on("layout.started", function () {
      $(window).on("resize", function () {
        setTimeout(_refresh_scroller, 500);
        setTimeout(resizeContentScroll, 500);
      });

      // 注册导航栏一级菜单点击事件
      $('body').on("click", ".sidebar-menu .has-sub > a", function () {
        var isOpen = $(this).parent().hasClass("open");
        // 获取最后一个打开的一级菜单，并且清除打开状态
        var last = $(".has-sub.open", $(".sidebar-menu"));
        last.removeClass("open");
        $(".arrow", last).removeClass("open");

        if (isOpen) {
          $(".arrow", $(this)).removeClass("open");
          $(this).parent().removeClass("open");
        } else {
          $(".arrow", $(this)).addClass("open");
          $(this).parent().addClass("open");
        }
      });

      // 注册菜单点击事件
      $('body').on("click", ".sidebar-menu-container a", function (e) {
        on_menu_click($(this), e);
      });

      // 触发框架初始化事件
      // EVENT-RAISE:layout.initialize 框架开始初始化时触发
      event.raise("layout.initialize");
    });

    let module = {
      /** 开始初始化UI框架 @returns */
      "init": function () {
        // EVENT-RAISE:layout.started 框架启动时触发
        event.raise("layout.started");
      },
      "initMenu": _initMenu,
      "resizeScroller": _refresh_scroller,
      "resizeContentScroller": resizeContentScroll,
      "load": _ajax_load_content,
      /** 导航至前一界面 @returns */
      "back": function () {
        auto_navigation(cfgs.pageOptions.menus);
      },
    };

    return module;
  }
);
