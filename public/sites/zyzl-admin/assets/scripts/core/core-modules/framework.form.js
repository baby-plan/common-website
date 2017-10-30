define(
  [
    "jquery",
    "cfgs",
    "core/core-modules/framework.event",
    "core/core-modules/framework.dict",
    "core/core-modules/framework.ajax",
    'core/core-modules/framework.util'
  ],
  function ($, cfgs, event, dict, ajax, util) {

    var readStyle = function (keyword) {
      if (cfgs.options.styles[keyword]) {
        return cfgs.options.styles[keyword];
      } else {
        return cfgs.options.styles['btn-default'];
      }
    };

    var module = {
      "define": {
        name: "［插件］表单处理 for MODULE-LAYOUT",
        version: "1.0.0.0",
        copyright: " Copyright 2017-2027 WangXin nvlbs,Inc."
      },
      "init": function (layout) {
        this.source = layout;

        // EVENT-ON:sidebar.changed
        event.on('sidebar.changed', function () {
          module.renderAllSelect();
        });

        $(window).on('resize', function () {
          setTimeout(function () {
            module.renderAllSelect();
          }, 500);
        });

      },
      "source": {},
      /** 初始化下拉列表框控件
       * @param {string} dictname 绑定的数据字典项名称
       * @param {object} target 控件绑定的dom对象
       * @param {string} value 默认值
       * @param {boolean} ismulit 是否多选,默认为false
       */
      "initDict": function (dictname, target, value, ismulit) {
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

      /** 渲染下拉列表控件 */
      "renderAllSelect": function () {
        // 解决时间段选择控件冲突问题
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
      },

      /** 渲染日期时间控件 */
      "renderDate": function () {
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
            // $(this).removeClass('.form-datetime');
            datepicker = $(this)
              .parent()
              .datetimepicker(cfgs.options.datetimepicker);
          } else {
            // $(this).removeClass('.form-date');
            datepicker = $(this)
              .parent()
              .datetimepicker(cfgs.options.datepicker);
          }

          datepicker.on("changeDate", function () {
            if ($(".core-form").data("bootstrapValidator")) {
              var id = $("[id]", $(this)).attr("id")
              $(".core-form")
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
      "initCache": function (options) {
        if (!options.api) {
          console.error("未设置数据服务地址!");
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
            options.api, {
              cache: false,
              args: options.args,
              block: false
            }, {
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

      "renderButton": function () {
        /** 设置页面按钮文本\图标\颜色等基本信息 */
        $.each(cfgs.options.texts, function (key, value) {
          $("." + key).each(function () {
            $(this).html(value).addClass(readStyle(key));
          });
        });
      },

      /** 渲染页面元素 */
      "render": function () {
        // 注册页面控件
        this.renderAllSelect();
        this.renderButton();
        this.renderDate();
        $(":checkbox,:radio").uniform();
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
            "callback": function () { }
          };
          /** 打开界面的参数 */
          var _options = $.extend(defaults, options);

          if (_options.title && _options.title != "") { } else {
            _options.title = $("h4", ".ajax-content").eq(0).text();
          }

          if (_options.map) {
            $("<span />")
              .text(_options.title)
              .appendTo($("<li />").appendTo($(".content-breadcrumb")));
          }
          _options.callback();
        };

        if (module.source && module.source.load && typeof module.source.load === "function")
          module.source.load(options.url, loadcallback);
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
      "openWidow": function (options) {
        /** 打开界面默认参数 */
        var defaults = {
          /** 界面标题 */
          "title": "",
          /** 打开界面的地址*/
          "url": "",
          /** 模式对话框的宽度 */
          "width": 'full',
          /** 模式对话框的高度 */
          'height': 'full',
          /** 打开模式对话框时处理函数 */
          "onshow": function () { },
          /** 关闭模式对话框时处理函数 */
          "onhide": function () { }
        };
        /** 打开界面的参数 */
        var _options = $.extend(defaults, options);

        // 移除模式对话框容器
        if ($('.modal-container').length > 0) {
          $('.modal-container').remove();
        }
        $('body').append($("<div/>").addClass('modal-container'));

        var modalHeight, modalWidth;
        if (_options.width == 'full') {
          modalWidth = $(window).width() - 50;
        } else {
          modalWidth = _options.width;
        }

        if (_options.height == 'full') {
          modalHeight = $(window).height() - 180;
        } else {
          modalHeight = _options.height;
        }

        $('.modal-container').load(cfgs.modalpage, function () {

          if (_options.title) {
            $(".modal-container .modal .modal-title").html(_options.title);
          }

          $(".modal-container .modal .modal-dialog").width(modalWidth);
          $(".modal-container .modal .modal-body").height(modalHeight);

          var scrollOption = $.extend(cfgs.options.scroller, {
            height: modalHeight
          });
          $(".modal-container .modal .modal-body").css("height", (modalHeight) + "px");
          $(".modal-container .modal .modal-body").slimScroll(scrollOption);

          $('.modal-container .modal .modal-body').load(_options.url, function () {

            var eventArgs = {
              "sender": $('.modal-container .modal')
            };
            $(".modal-container .modal-footer").append(
              $('.modal-container tools')
            );

            $('.modal-container .modal').on('show.bs.modal', function () {
              // EVENT-RAISE:form.modal.show
              event.raise('form.modal.show', eventArgs);
              $('tools>button').unwrap();
              _options.onshow($('.modal-container .modal'));

              module.renderButton();
            });

            $('.modal-container .modal').on('hide.bs.modal', function () {
              // EVENT-RAISE:form.modal.hide
              event.raise('form.modal.hide', eventArgs);
              _options.onhide($('.modal-container .modal'));
            });

            $('.modal-container .modal').modal({ keyboard: false });

          });

        });
        // return $('.modal-container .modal');
      },

      /** 在container中增加空单元格（td），并且返回该单元格
       * @param {Element} container 承载空单元格的容器
       * @returns {Element} 装入container的单元格
       */
      "appendEmpty": function (container) {
        return $(cfgs.templates.cell).appendTo(container);
      },

      /** 在container中增加一个动作按钮，并且返回该按钮
       * @param {Element} container 承载动作按钮的容器
       * @param {string} textKey 动作按钮的文本键，对应cfgs.texts
       * @param {function} clickEventHandler 动作按钮点击事件的处理函数
       * @param {string} eventArgs 动作按钮附加的参数 data-args='eventArgs'
       * @returns {Element} 动作按钮
       */
      "appendAction": function (container, textKey, clickEventHandler, eventArgs) {
        var actionButton = $("<button />").appendTo(container)
          .html(cfgs.options.texts[textKey])
          .addClass(cfgs.options.styles[textKey])
          // .addClass('btn-mini')
          .addClass(textKey)
          // .attr("href", "javascript:;")
          .on("click", clickEventHandler);
        if (eventArgs) {
          actionButton.attr('data-args', eventArgs);
        }
        return actionButton;
      },

      /** 在container中增加HTML单元格（td），并且返回该单元格
       * @param {Element} container 承载动作按钮的容器
       * @param {string} html 添加到单元格的HTML内容
       * @returns {Element} 承载HTML内容的单元格
       */
      "appendHTML": function (container, html) {
        return this.appendEmpty(container).html(html);
      },

      /** 在container中增加文本单元格（td），并且返回该单元格
       * @param {Element} container 承载动作按钮的容器
       * @param {string} text 添加到单元格的文本内容
       * @returns {Element} 承载文本内容的单元格
       */
      "appendText": function (container, text) {
        return this.appendEmpty(container).text(text);
      },

      /** 在container中增加字典单元格（td），并且返回该单元格
       * @param {Element} container 承载动作按钮的容器
       * @param {string} dictname 字典名称
       * @param {string} text 字典对应的值，若isMulit=true，则多个值用，分割
       * @param {boolean} isMulit 是否支持多值转换
       * @returns {Element} 承载字典内容的单元格
       */
      "appendDictText": function (container, dictname, text, isMulit) {
        if (isMulit) {
          // 内容不存在时不需要处理
          if (!text) {
            return this.appendText(container, '');
          }
          let newtext = "";
          $.each(text.split(","), function (index, item) {
            if (index > 0) {
              newtext += ",";
            }
            newtext += dict.getText(dictname, item);
          });
          return this.appendText(container, newtext);
        } else {
          let item = dict.getItem(dictname, text);
          if (item.text) {
            var td = this.appendEmpty(container);
            var span = $('<span/>').append(item.text);
            // if (item.label) {
            //   span.addClass('label label-sm');
            //   span.addClass(item.label);
            // }
            td.append(span);
            return td;
          } else {
            return this.appendText(container, item);
          }
        }
      },

      /** 在container中增加时间单元格（td），并且返回该单元格
       * @param {Element} container 承载动作按钮的容器
       * @param {string} text 时间文本（UTC）格式
       * @param {string} format 日期转换的格式
       * @returns {Element} 承载时间内容的单元格
       */
      "appendDateText": function (container, text, format) {
        var newtext = "";
        if (format) {
          newtext = util.utcTostring(text, format)
        } else {
          newtext = util.utcTostring(text, cfgs.options.defaults.datetimeformat)
        }
        return this.appendText(container, newtext);
      },
    }
    return module;
  }
);