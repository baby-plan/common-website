define(
  [
    "jquery",
    "cfgs",
    "API",
    "core/core-modules/framework.block",
    "core/core-modules/framework.dict",
    "core/core-modules/framework.base64",
    "core/core-modules/framework.ajax",
    "core/core-modules/framework.util",
    "core/core-modules/framework.dialog",
    "core/core-modules/framework.cookie",
    "core/core-modules/framework.event",
    "jquery.slimscroll",
    "bootstrap-daterangepicker",
    'bootstrap-datetimepicker-CN',
    "jquery.uniform",
    'select2-CN',
    "jquery.fbmodel",
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
    dict,
    base64,
    ajax,
    util,
    dialog,
    cookie,
    event
  ) {
    let loaded = undefined, leaveAction = undefined, leaveModule = undefined;
    let events = {
      logined: "layout.logined",
      initialied: "layout.initialied"
    };

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

      if (cfgs.debug) {
        functions = [];
        $.each(cfgs.modules, function (index, item) {
          if (!item.parent) {
            item.parent = '000'
          }
          if (item.parent != "000" || item.module || item.url) {
            functions.push(index);
          }
        });
        // functions = functions.sort();
      }

      var container = $(".sidebar-menu-container");
      container.empty();

      $.each(functions, function (index, functionID) {
        var a, span, parentItem, parentA;
        var module = cfgs.modules[functionID]; // 获取系统功能模块
        if (!module) {
          return;
        }

        var parentModule = undefined;
        parentModule = module.parent == "000" ? {} : cfgs.modules[module.parent];

        // 判断菜单项级别
        parentItem = $('li[data-id="' + module.parent + '"]', container);

        if (module.parent == "000" && (module.module || module.url)) {
          createMenuItem(functionID, module, undefined, container);
        }
        // 处理一级菜单
        else if (parentItem.length == 0) {
          var parentModule = cfgs.modules[module.parent];
          parentItem = $("<li/>")
            .attr("data-id", module.parent)
            .appendTo(container);
          a = $("<a/>").appendTo(parentItem);
          a.attr("href", "javascript:;");
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

          // 如果启用初始菜单则设定
          if (cfgs.rootable && cfgs.root.length == 0) {
            cfgs.root.push(parentModule.name);
          }
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

        createMenuItem(functionID, module, parentModule, parentItem);

        // 如果启用初始菜单则设定
        if (cfgs.rootable && cfgs.root.length == 1) {
          cfgs.root.push(module.name);
        }
      });

      console.info("菜单初始化完成");

      // 延迟初始化初始页面，避免菜单初始化过慢导致无法显示初始页面
      setTimeout(function () {
        auto_navigation(cfgs.root);
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
          color: "#0786d6"
        });

      $("#content-container").css("height", contentHeight + "px");
      $("#content-container").slimScroll(options);

      // 判断是否有筛选窗口，若有则增加滚动条
      // var filterContainer = $('#filter-container');
      // var filterContainerForm = $('#role-form');
      // if (filterContainer.length == 1) {
      //   filterContainer.append(filterContainerForm);
      //   $("#ajax-content>.slimScrollDiv").remove();
      //   filterContainerForm.removeAttr("style");

      //   filterContainerForm.css("height", contentHeight + "px");
      //   filterContainerForm.slimScroll(options);
      // }

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

      $("select:not(.monthselect,.yearselect)").each(function () {
        var selectvalue = $(this).attr("data-value");
        var ismulit = $(this).attr("data-mulit");
        $(this).select2(cfgs.options.select2);
        if (selectvalue) {
          if (ismulit) {
            $(this)
              .val(selectvalue.split(","))
              .trigger("change");
          } else {
            $(this)
              .val(selectvalue)
              .trigger("change");
          }
        } else {
          $(this)
            .val(null)
            .trigger("change");
        }
      });
    };

    /** ajax方式加载页面内容.
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

        // $(".content-header").show();

        initMenuLevel();
        resetBreadcrumb();
        highlightSelected();

        if ($("#ajax-content").hasClass("fadeOutRight")) {
          $("#ajax-content").removeClass("fadeOutRight");
        }
        $("#ajax-content").addClass("fadeInRight");

        if (typeof callback === "function") {
          callback();
        }

        setTimeout(function () {
          $("#ajax-content").removeClass("fadeInRight");
          // resizeContentScroll();
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

      block.show("正在加载页面...");

      var options = {
        url: url,
        callback: loadcallback,
        block: true
      };

      /* 初始化页面元素 */
      $("body>.datetimepicker,body>.daterangepicker").remove();
      $("#ajax-content").addClass("fadeOutRight");
      /* 加载页面内容 */
      $("#ajax-content").load(url, loadcallback);

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
      $.each(modulePowers.actions, function (index, action) {
        var powerdefine = moduleDefine.actions.find(function (p) { return p.id == action });
        powers.push(powerdefine.action);
      })
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
            li.parent().slideDown(200, function () {
              on_menu_click(cfgs.pageOptions.currentmenu);
            });
          }
        });
      };
      var openeds = $(".has-sub.open", $(".sidebar-menu-container"));
      var count = openeds.length;
      if (
        count == 1 &&
        $('a>span[class="menu-text"]', openeds).text() != path[path.length - 1]
      ) {
        openeds.removeClass("open");
        $(".arrow", openeds).removeClass("open");
        $(".sub", openeds).slideUp(200, doNavigation);
      } else {
        doNavigation();
      }
    };

    /** 导航至系统主界面 */
    var gotoMain = function () {
      $("body").removeClass("login");
      $('body>section').empty();
      $('body>section').height($(document).height());
      // 加载导航页面
      block.show("初始化导航", $("body>aside"));
      // setTimeout(function () {
      $("body>aside").load(api.page.navigation, function () {
        block.close($("body>aside"));
        // ajax.get(api.module.all, {}, function(json) {
        //   cfgs.modules = {};
        //   $.each(json.data.list, function(index, item) {
        //     item.name = base64.decode(item.name);
        //     item.module = base64.decode(item.module);
        //     item.method = base64.decode(item.method);
        //     item.url = base64.decode(item.url);
        //     item.args = base64.decode(item.args);
        //     item.leave = base64.decode(item.leave);
        //     cfgs.modules[item.id] = item;
        //   });
        _initMenu();
        _refresh_scroller();
        event.raise(events.initialied);
        // });
      });
      // }, 5000);

      // 加载主页面
      block.show("初始化页面", $("body>section"));
      // setTimeout(function () {
      $("body>section").load(api.login.mainpage, function () {
        block.close($("body>section"));
        $(".username").text(cfgs.INFO.name);
        $(".userrole").text(cfgs.INFO.rolename);
        resizeContentScroll();
      });
      // }, 5000);
    };

    /** 导航至登录界面 */
    var gotoLogin = function () {
      cookie.save("");
      $("body").addClass("login");
      $("body>section").removeAttr("style");
      $("body>aside").removeAttr("style");
      $("body>aside").empty();
      var loginPageLoadCallback = function () {
        $(".btn-login").on("click", function () {
          var username = $("#inputusername").val();
          var password = $("#inputpassword").val();
          if (!username || username == "") {
            dialog.alertText("账号不能为空!");
            return;
          }
          if (!password || password == "") {
            dialog.alertText("密码不能为空!");
            return;
          }
          var options = {
            u: base64.encode(username),
            p: base64.encode(password)
          };
          var callback = function (json) {
            json.data.powers =
              cookie.save(json);
            event.raise(events.logined);
            gotoMain();
          };
          ajax.get(api.login.loginapi, options, callback);
        });
      };
      $("body>section").load(api.login.page, loginPageLoadCallback);
    };

    var initialize = function () {
      $(window).on("resize", function () {
        setTimeout(_refresh_scroller, 500);
        setTimeout(resizeContentScroll, 500);
      });

      $(document).on("change", "select", function (e) {

        if (e.target.name == 'province_code' && $('#city_code').length == 1) {
          var value = e.target.value;
          if ($('#city_code').hasClass('select2-hidden-accessible')) {
            $('#city_code').select2('destroy');
            $('#city_code').empty();
          }

          $.each(cfgs.dict.city, function (index, item) {
            if (item.parent == value) {
              $('#city_code').append(
                $("<option/>")
                  .val(index)
                  .text(item.text ? item.text : item)
              );
            }
          });
          $('#city_code').select2(cfgs.options.select2);
          $('#city_code').val(null).trigger("change");
        }

        else if (e.target.name == 'city_code' && $('#county_code').length == 1) {
          var value = e.target.value;
          if ($('#county_code').hasClass('select2-hidden-accessible')) {
            $('#county_code').select2('destroy');
            $('#county_code').empty();
          }

          $.each(cfgs.dict.county, function (index, item) {
            if (item.parent == value) {
              $('#county_code').append(
                $("<option/>")
                  .val(index)
                  .text(item.text ? item.text : item)
              );
            }
          });
          $('#county_code').select2(cfgs.options.select2);
          $('#county_code').val(null).trigger("change");
        }

      });

      // 注册导航栏一级菜单点击事件
      $(document).on("click", ".sidebar-menu .has-sub > a", function () {
        var isOpen = $(this)
          .parent()
          .hasClass("open");
        var last = $(".has-sub.open", $(".sidebar-menu"));
        last.removeClass("open");
        $(".arrow", last).removeClass("open");

        if (isOpen) {
          $(".arrow", $(this)).removeClass("open");
          $(this)
            .parent()
            .removeClass("open");
        } else {
          $(".arrow", $(this)).addClass("open");
          $(this)
            .parent()
            .addClass("open");
        }
        // _refresh_scroller();
      });

      // 注册菜单点击事件
      $(document).on("click", ".sidebar-menu-container a", function (e) {
        on_menu_click($(this), e);
      });

      if (!(cfgs.INFO = cookie.read())) {
        console.info("TOKEN验证失败,重新登录");
        gotoLogin(); /*不存在token或token失效，需重新登录*/
      } else {
        console.info("TOKEN验证成功,进入系统");
        gotoMain(); /*token有效，可正常使用系统*/
      }
    };

    event.on(ajax.events.logintimeout, function () {
      dialog.alertText("登录超时,请重新登录", function () {
        gotoLogin();
      });
    });

    let module = {
      events: events,
      load: _ajax_load_content,
      /** 导航至前一界面 */
      back: function () {
        auto_navigation(cfgs.pageOptions.menus);
      },
      init: initialize,
      gotoLogin: gotoLogin
    };

    return module;
  }
);
