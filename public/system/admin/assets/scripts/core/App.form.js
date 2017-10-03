/* ========================================================================
 * App.form v1.0
 * 表单处理插件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.d
 * 
 * ======================================================================== */
(function (app) {
  var readStyle = function (keyword) {
    if (cfgs.options.styles[keyword]) {
      return cfgs.options.styles[keyword];
    } else {
      return cfgs.options.styles.btn_default;
    }
  }
  /**重置页面描述性信息:导航地图、权限按钮等等 */
  var resetBreadcrumb = function () {
    $(".content-breadcrumb").empty();
    /* 移除breadcrumb全部节点 */
    for (var index = pageOptions.items.length - 1; index >= 0; index--) {
      pageOptions.menus[index] = pageOptions.items[index].name;
      var breadcrumb = $("<li />").appendTo($(".content-breadcrumb"));

      if (index == 0) {

        var a = $("<a href=\"javascript:;\" class=\"breadcrumb-item\"/>").appendTo(breadcrumb);

        if (pageOptions.items[index].icon) {
          $("<i />").addClass(pageOptions.items[index].icon).appendTo(a);
        }

        a.append(" " + pageOptions.items[index].name);

      } else {
        $("<span/>").text(" " + pageOptions.items[index].name).appendTo(breadcrumb);
      }

    }
    $(".breadcrumb-item").on("click", function () {
      auto_navigation(pageOptions.menus);
    });
  };

  /** ajax方式加载页面内容.
   * 
   * @param {string} url 待加载内容的URL地址.
   * @param {string} callback 内容加载完成后的回调函数.
   */
  var _ajax_load_content = function (url, callback) {
    /** 初始化选中菜单层级 */
    var initMenuLevel = function () {
      pageOptions.items = new Array();
      pageOptions.menus = new Array();
      var text = pageOptions.currentmenu.find("span").text().trim();
      var datasid = pageOptions.currentmenu.parent().attr("data-id");
      var item = cfgs.modules[datasid];
      pageOptions.items.push(item);
      while (item.parent != "000") {
        item = cfgs.modules[item.parent];
        pageOptions.items.push(item);
      }
    }
    /** 加载模块所依赖的脚本文件 */
    var loadModuleScripts = function () {
      if (pageOptions.items[0] && pageOptions.items[0].scripts) {
        $.each(pageOptions.items[0].scripts, function (index, item) {
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
        var text = pageOptions.items[pageOptions.items.length - 1].name;
        $("li>a>.menu-text", $(".sidebar-menu-container")).each(function () {
          if ($(this).text() == text) {
            $(this).parent().parent().addClass("open");
          }
        });
      }
    }
    /** 页面加载完成时的回调函数 */
    var loadcallback = function () {
      $(".content-header").show();
      if (callback) {
        eval(callback);
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
      }, 500);
    }

    var options = {
      "url": url,
      "callback": loadcallback,
      "block": true
    };
    /* 初始化页面元素 */
    $("body>#fbmodal_overlay,body>.datetimepicker,body>.daterangepicker").remove();
    $("body>.fbmodal>*").remove();
    $("#ajax-content").addClass("fadeOutRight");
    load_content(options);

  }

  //加载页面内容.
  //@params options JSONObject 数据在列表中的索引.
  //  [可选结构]</para>
  //  url:string,加载内容的地址.</para>
  //  block:boolean,是否启用遮罩效果,默认为false.</para>
  //  callback:function,加载页面内容成功后的回调函数.</para>
  //=======================================================================
  var load_content = function (options) {
    if (!options) {
      App.logger.error("调用load_content时,参数options不能为空!");
      App.alertText("请求页面参数错误!");
      return;
    } else {
      App.logger.debug("load_content:" + App.util.jsonToString(options));
    }
    if (!options.url) {
      App.alertText("请求地址不存在!<br/>地址:<a href=\"" + options.url + "\" target=\"_black\">" + options.url + "</a>");
      return;
    }
    console.group("Load:" + options.url);

    App.logger.info("准备加载:" + options.url);
    if (options.block) {
      App.block.show("正在加载页面...");
    }

    var loadCallback = function () {
      if (options.block) {
        App.block.close();
      }
      App.logger.info("加载完成:" + options.url);
      console.groupEnd();
      if (options.callback) {
        options.callback();
      }
      // 重置页面内容区工具栏
      $(".content-toolbar").empty();
      var tools = $("tools");
      if (tools.length > 0) {
        tools.appendTo($(".content-toolbar"));
      }

      App.contentChanged();
    }
    /* 加载页面内容 */
    $("#ajax-content").load(options.url, loadCallback);

  }

  app.form = {
    /**初始化下拉列表框控件
     * @param {string} dict 绑定的数据字典项名称
     * @param {DOMobject} target 控件绑定的dom对象
     * @param {string} value 默认值
     * @param {boolean} ismulit 是否多选,默认为false
     */
    "initDict": function (dict, target, value, ismulit) {
        App.plugins.dict.get(dict, function (datas) {
          $.each(datas, function (index, item) {
            target.append($("<option/>").val(index).text((item.text) ? item.text : item));
          });
          target.attr("data-value", value);
          if (ismulit) {
            target.attr("data-mulit", true);
          }
        });
      }
      /** 初始化时间段选择控件.
       * @param {string} start  起始时间控件名称（默认为starttime）.
       * @param {string} end    结束时间控件名称（默认为endtime）.
       * @param {string} btn    时间选择按钮控件名称（默认为reportrange）.
       */
      ,
    "initDateRange": function (start, end, btn) {
        if (!start) {
          start = "starttime"
        }
        if (!end) {
          end = "endtime"
        }
        if (!btn) {
          btn = "reportrange"
        }
        /* 注册时间段选择控件 */
        var datarangepicker_callback = function (startdate, enddate) {
          $("#" + start).val(startdate.format(cfgs.options.defaults.dateformat));
          $("#" + end).val(enddate.format(cfgs.options.defaults.dateformat));
        };

        $("#" + btn).daterangepicker(cfgs.options.daterange, datarangepicker_callback);
      }
      /**初始化日期时间控件 */
      ,
    "initDate": function () {
        $(".form_date,.form_datetime", parent).each(function (index, item) {
          var wrapper = $("<div></div>").addClass("input-group date");
          var span = $("<span></span>").addClass("input-group-addon");
          var button = $("<a></a>").addClass("btn btn-default date-set");
          button.append($("<i></i>").addClass("fa fa-calendar"));
          span.append(button);
          $(this).wrapAll(wrapper);
          $(this).parent().append(span);
          if ($(this).hasClass("form_datetime")) {
            $(this).parent().datetimepicker(cfgs.options.datetimepicker);
          } else {
            $(this).parent().datetimepicker(cfgs.options.datepicker);
          }
        });
      }
      /** 支持缓存的列表请求方法.通常用于请求字典数据.
       * 
       * @param {Object} options 参数设置
       * [可选结构]
       * api       请求的服务地址.
       * args      请求时附带的参数.
       * hasall    是否附带“全部”选项.
       * cached    是否缓存数据,boolean,默认为true.
       * target    承载内容的元素selector,通常为select
       * valuefn   返回value内容的方法,function(index,item) return string
       * textfn    返回text内容的方法,function(index,item) return string
       * parsefn   请求成功后解析数据的方法 function(index,item).该属性与target\valuefn\textfn冲突仅设置一种
       * done      解析数据完成后执行的反馈 function().
       * 
       * @author wangxin
       */
      ,
    "initCache": function (options) {
        if (!options.api) {
          App.alertText("未设置数据服务地址!");
          return;
        }
        if (!options.args) {
          options.args = {};
        }
        if (options.cached == undefined) {
          options.cached = true;
        }
        var parse = function (index, item) {
          if (options.parsefn) {
            options.parsefn(index, item);
          } else if (options.target && options.textfn && options.valuefn) {
            var value = options.valuefn(index, item);
            var text = options.textfn(index, item);
            var opotion = $("<option/>").val(value).text(text);
            options.target.append(opotion);
          }
        }

        if (cfgs.cache[options.api] && options.cached) {
          App.logger.debug("Cached:" + options.api);
          $.each(cfgs.cache[options.api], function (index, item) {
            parse(index, item);
          });
          if (options.done) {
            options.done();
          }
        } else {
          App.logger.debug("UnCached:" + options.api);
          App.ajax(options.api, {
            "nocache": true,
            "args": options.args,
            "block": false
          }, function (json) {
            cfgs.cache[options.api] = json.data.list;
            $.each(json.data.list, function (index, item) {
              parse(index, item);
            });
            if (options.done) {
              options.done();
            }
          });
        }
      }
      /**初始化页面元素 */
      ,
    "init": function () {
        // 注册页面控件
        //todo:解决时间段选择控件冲突问题
        // $("select:not(.monthselect,.yearselect)").select2(cfgs.options.select2);
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
        // target.attr("data-value",selectValue);
        // target.val(selectValue).trigger("change");
        $(":checkbox,:radio").uniform();
        /** 设置页面按钮文本\图标\颜色等基本信息 */
        $.each(cfgs.options.texts, function (key, value) {
          $("." + key).each(function () {
            if ($(this).parent().hasClass("panel-tools")) {
              $(this).attr("href", "javascript:;").html(value);
            } else {
              $(this).attr("href", "javascript:;").html(value).addClass(readStyle(key));
            }
          });
        });

        /* 处理【取消/返回】按钮事件 */
        $(".btn_back").on("click", function (e) {
          e.preventDefault();
          if ($(this).hasClass("custom") == false) {
            App.route.back();
          }
        });

        // 刷新功能
        $(".btn_refresh").on("click", function () {
          App.table.reload();
        });

        // 收起/展开功能
        $(".panel-tools .collapse, .panel-tools .expand").click(function () {
          var el = $(this).parents(".panel").children(".panel-body");
          var bt = $(this).parents(".panel").children(".panel-heading");
          if ($(this).hasClass("collapse")) {
            $(this).removeClass("collapse").addClass("expand");
            var i = $(this).children(".fa-chevron-up");
            i.removeClass("fa-chevron-up").addClass("fa-chevron-down");
            el.slideUp(200, function () {
              bt.css("border-bottom-width", "0");
            });
          } else {
            $(this).removeClass("expand").addClass("collapse");
            var i = $(this).children(".fa-chevron-down");
            i.removeClass("fa-chevron-down").addClass("fa-chevron-up");
            bt.css("border-bottom-width", "1px");
            el.slideDown(200);
          }
        });
      }
      /** ajax方式加载页面内容.
       * @param {JSON} options 打开页面的参数
       *   {string}   title     界面的标题
       *   {string}   url       打开界面的地址
       *   {boolean}  map       打开界面时是否添加站点地图
       *   {function} callback  打开界面后回调函数
       * 
       * @author wangxin
       */
      ,
    "openview": function (options) {
        var loadcallback = function () {
          /** 打开界面默认参数 */
          var defaults = {
            /** 界面标题 */
            "title": "",
            /** 打开界面的地址*/
            "url": "",
            /** 打开界面时是否添加站点地图*/
            "map": true,
            /** 打开界面后回调函数 */
            "callback": function () {}
          };
          /** 打开界面的参数 */
          var _options = $.extend(defaults, options);
          if (_options.title && _options.title != "") {
            //$("h4", "#ajax-content").eq(0).text(_options.title);
          } else {
            _options.title = $("h4", "#ajax-content").eq(0).text();
          }
          if (_options.map) {
            $("<span />").text(_options.title).appendTo($("<li />").appendTo($(".content-breadcrumb")));
          }
          App.form.init();

          if ($("#ajax-content").hasClass("fadeOutRight")) {
            $("#ajax-content").removeClass("fadeOutRight");
          }
          $("#ajax-content").addClass("fadeInRight");

          setTimeout(function () {
            $("#ajax-content").removeClass("fadeInRight");
          }, 500);

          _options.callback();
        }
        $("#ajax-content").addClass("fadeOutRight");
        load_content({
          "url": options.url,
          "callback": loadcallback,
          "block": true
        });
      }
      /** ajax方式加载页面内容并且处理菜单
       * @param {string} url  待加载内容的URL地址.
       * @param {function} callback 内容加载完成后的回调函数.
       * 
       * @author wangxin
       */
      ,
    "load": function (url, callback) {
      _ajax_load_content(url, callback);
    }

  };
})(App);