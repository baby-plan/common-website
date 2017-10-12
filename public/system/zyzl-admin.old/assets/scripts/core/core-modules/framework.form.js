define(
  [
    "jquery",
    "cfgs",
    "core/core-modules/framework.dict",
    "core/core-modules/framework.ajax"
  ],
  function ($, cfgs, dict, ajax) {
    var readStyle = function (keyword) {
      if (cfgs.options.styles[keyword]) {
        return cfgs.options.styles[keyword];
      } else {
        return cfgs.options.styles.btn_default;
      }
    };
    var module = {
      define: {
        name: "［插件］表单处理 for MODULE-LAYOUT",
        version: "1.0.0.0",
        copyright: " Copyright 2017-2027 WangXin nvlbs,Inc."
      },
      source: {},
      /**
       * 初始化下拉列表框控件
       * @param {string} dictname 绑定的数据字典项名称
       * @param {object} target 控件绑定的dom对象
       * @param {string} value 默认值
       * @param {boolean} ismulit 是否多选,默认为false
       */
      initDict: function (dictname, target, value, ismulit) {
        dict.get(dictname, function (datas) {
          $.each(datas, function (index, item) {
            target.append(
              $("<option/>")
                .val(index)
                .text(item.text ? item.text : item)
            );
          });
          target.attr("data-value", value);
          if (ismulit) {
            target.attr("data-mulit", true);
          }
        });
      },

      /** 初始化时间段选择控件.
       * @param {string} start  起始时间控件名称（默认为starttime）.
       * @param {string} end    结束时间控件名称（默认为endtime）.
       * @param {string} btn    时间选择按钮控件名称（默认为reportrange）.
       */
      initDateRange: function (start, end, btn) {
        if (!start) {
          start = "starttime";
        }
        if (!end) {
          end = "endtime";
        }
        if (!btn) {
          btn = "reportrange";
        }
        /* 注册时间段选择控件 */
        var datarangepicker_callback = function (startdate, enddate) {
          $("#" + start).val(
            startdate.format(cfgs.options.defaults.dateformat)
          );
          $("#" + end).val(enddate.format(cfgs.options.defaults.dateformat));
        };

        $("#" + btn).daterangepicker(
          cfgs.options.daterange,
          datarangepicker_callback
        );
      },
      /** 初始化日期时间控件 */
      initDate: function () {
        $(".form-date,.form-datetime").each(function () {
          var wrapper = $("<div></div>").addClass("input-group date");
          var span = $("<span></span>").addClass("input-group-addon");
          var button = $("<a></a>").addClass("date-set");
          button.append($("<i></i>").addClass("fa fa-calendar"));
          span.append(button);
          $(this).wrapAll(wrapper);
          $(this)
            .parent()
            .append(span);
          var datepicker;
          if ($(this).hasClass("form_datetime")) {
            datepicker = $(this)
              .parent()
              .datetimepicker(cfgs.options.datetimepicker);
          } else {
            datepicker = $(this)
              .parent()
              .datetimepicker(cfgs.options.datepicker);
          }

          datepicker.on("changeDate", function () {
            if ($("#role-form").data("bootstrapValidator")) {
              var id = $("[id]", $(this)).attr("id")
              $("#role-form")
                .data("bootstrapValidator")
                .updateStatus(id, "NOT_VALIDATED", null)
                .validateField(id);
            }
          });

        });
      },
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
      initCache: function (options) {
        if (!options.api) {
          console.error("未设置数据服务地址!");
          // App.alertText("未设置数据服务地址!");
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
            var opotion = $("<option/>")
              .val(value)
              .text(text);
            options.target.append(opotion);
          }
        };
        var requestDone = function (list) {
          if (list && list.length > 0) {
            cfgs.cache[options.api] = list;
            $.each(list, function (index, item) {
              parse(index, item);
            });
          }

          if (options.done) {
            options.done();
          }
        };

        if (cfgs.cache[options.api] && options.cached) {
          console.debug("Cached:" + options.api);
          $.each(cfgs.cache[options.api], function (index, item) {
            parse(index, item);
          });
          if (options.done) {
            options.done();
          }
        } else {
          console.debug("UnCached:" + options.api);

          ajax.get(
            options.api,
            {
              nocache: true,
              args: options.args,
              block: false
            },
            {
              noneDate: function () {
                requestDone();
              },
              success: function (json) {
                requestDone(json.data.list);
              }
            }
          );
        }
      },
      /**初始化页面元素 */
      init: function () {

        // var caller = arguments.callee.caller;
        // var i = 0;
        // console.log('控件初始化！！');
        // while (caller && i < 5) {
        //   console.log(caller.toString());
        //   caller = caller.caller;
        //   i++;
        //   console.log("***---------------------------------------- ** " + (i + 1));
        // }
        // 注册页面控件
        //todo:解决时间段选择控件冲突问题
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

        $(":checkbox,:radio").uniform();
        /** 设置页面按钮文本\图标\颜色等基本信息 */
        $.each(cfgs.options.texts, function (key, value) {
          $("." + key).each(function () {
            if (
              $(this)
                .parent()
                .hasClass("panel-tools")
            ) {
              $(this)
                .attr("href", "javascript:;")
                .html(value);
            } else {
              $(this)
                .attr("href", "javascript:;")
                .html(value)
                .addClass(readStyle(key));
            }
          });
        });

        // 收起/展开功能
        // $(".panel-tools .collapse, .panel-tools .expand").click(function () {
        //   var el = $(this)
        //     .parents(".panel")
        //     .children(".panel-body");
        //   var bt = $(this)
        //     .parents(".panel")
        //     .children(".panel-heading");
        //   if ($(this).hasClass("collapse")) {
        //     $(this)
        //       .removeClass("collapse")
        //       .addClass("expand");
        //     var i = $(this).children(".fa-chevron-up");
        //     i.removeClass("fa-chevron-up").addClass("fa-chevron-down");
        //     el.slideUp(200, function () {
        //       bt.css("border-bottom-width", "0");
        //     });
        //   } else {
        //     $(this)
        //       .removeClass("expand")
        //       .addClass("collapse");
        //     var i = $(this).children(".fa-chevron-down");
        //     i.removeClass("fa-chevron-down").addClass("fa-chevron-up");
        //     bt.css("border-bottom-width", "1px");
        //     el.slideDown(200);
        //   }
        // });

        $(".picker-icon").empty();
        $(".picker-icon").append(
          $("<option/>")
            .val("000")
            .text("000 - 根目录")
        );
        $.each(cfgs.icons, function (index, icon) {
          $(".picker-icon").append(
            $("<option/>")
              .val(icon)
              .append(icon)
          );
        });

        setTimeout(this.initDate, 300);
      },
      /** ajax方式加载页面内容.
       * @param {JSON} options 打开页面的参数
       *   {string}   title     界面的标题
       *   {string}   url       打开界面的地址
       *   {boolean}  map       打开界面时是否添加站点地图
       *   {function} callback  打开界面后回调函数
       * 
       * @author wangxin
       */
      openview: function (options) {
        var loadcallback = function () {
          /** 打开界面默认参数 */
          var defaults = {
            /** 界面标题 */
            title: "",
            /** 打开界面的地址*/
            url: "",
            /** 打开界面时是否添加站点地图*/
            map: true,
            /** 打开界面后回调函数 */
            callback: function () { }
          };
          /** 打开界面的参数 */
          var _options = $.extend(defaults, options);

          if (_options.title && _options.title != "") {
          } else {
            _options.title = $("h4", "#ajax-content")
              .eq(0)
              .text();
          }

          if (_options.map) {
            $("<span />")
              .text(_options.title)
              .appendTo($("<li />").appendTo($(".content-breadcrumb")));
          }
          // module.init();

          _options.callback();
        };

        if (
          module.source &&
          module.source.load &&
          typeof module.source.load === "function"
        )
          module.source.load(options.url, loadcallback);
      }
    };
    return module;
  }
);
