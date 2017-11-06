/* ========================================================================
 * 通用UI生成组件 Version 1.0
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * ======================================================================== */
define(
  [
    "jquery",
    "cfgs",
    "API",
    "core/core-modules/framework.ajax",
    "core/core-modules/framework.dialog",
    "core/core-modules/framework.layout",
    "core/core-modules/framework.util",
    "core/core-modules/framework.form",
    "core/core-modules/framework.table",
    "core/core-modules/framework.event",
    "core/core-modules/framework.dict",

    'generator-plugins/input-text/index',
    'generator-plugins/input-dict/index',
    'generator-plugins/input-date/index',
    'generator-plugins/select-merchant/index',

    "bootstrapValidator",
    "jquery.tmpl",
    "jquery.tmplPlus"
  ],
  function (
    $,
    cfgs,
    api,
    ajax,
    dialog,
    layout,
    util,
    form,
    table,
    event,
    dict,
    plugin_inputtext,
    plugin_inputdict,
    plugin_inputdate,
    plugin_select_merchant
  ) {
    "use strict";
    const ACTION_ATTR = "data-action";
    const ACTION_INSERT = "INSERT";
    const ACTION_UPDATE = "UPDATE";
    const FROM_KEY = ".core-form";
    const PRIMARY_KEY_ATTR = "data-primary";
    var plugin_option = {},
      /** 编辑视图参数设置 */
      view_edit_optoin = {},
      /** 预览视图参数设置 */
      view_preview_option = {}, primaryKey;

    var module = {
      "init": function () {
        // EVENT-ON:table.selected
        event.on('table.selected', function (eventArgs) {
          var args = eventArgs.args;
          if (args.length == 1) {
            var index = args.selector.data('id');
            var data = table.getdata(index);
            if (data) {
              $('.qdp-mulit,.qdp-single').each(function () {
                var match = $(this).attr("class").match("btn-(.+?) ");
                if (match) {
                  let key = match[1];
                  let power = plugin_option.powers.find(function (p) { return p.name == key })
                  if (!power || !power.controller || power.controller(data)) {
                    $(this).removeAttr('disabled');
                  }
                }
              });
            }
          } else if (args.length == 0) {
            $('.qdp-mulit,.qdp-single').attr('disabled', "true");
          } else {
            $('.qdp-mulit').removeAttr('disabled');
            $('.qdp-single').attr('disabled', "true");
          }
        });
      },
      /** 构建表单内容
       * @param  {JSON} options 初始化选项
       */
      "build": function (options) {
        const option_default = {
          "apis": { "list": "", "insert": "", "update": "", "delete": "" },
          "columns": [],
          "headers": {
            "edit": { icon: "fa fa-table", text: "基本信息" },
            "filter": { icon: "fa fa-search", text: "查询条件" },
            "table": { icon: "fa fa-table", text: "查询结果" }
          },
          "helps": { "insert": [], "update": [], "list": [] },
          "actions": {
            "insert": false,
            "update": false,
            "delete": false,
            "preview": true,
            "export": true,
            "select": false,
            "refresh": true,
            "reset": true
          },
          // "actiondefines": {
          //   "insert": {
          //     "page": cfgs.editpage,
          //     "callback": initEditView
          //   },
          //   "select": true,
          //   "update": {
          //     "page": cfgs.editpage,
          //     "callback": initEditView
          //   },
          //   "delete": false,
          //   "preview": {
          //     "mode": "modal",//"mode:page|modal"
          //     "width": '800px',//'full',
          //     "height": 'full',
          //     "page": cfgs.detailpage,
          //     "callback": initDetailView
          //   },
          //   "export": true,
          //   "refresh": true,
          //   "reset": true
          // },
          "views": {
            "edit": {
              "page": cfgs.editpage,
              "callback": initEditView
            },
            "preview": {
              "viewmode": "modal",//"mode:page|modal"
              "mode": "normal",
              "width": '800px',//'full',
              "height": 'full',
              "column": 2,
              'title': '详情',
              "page": cfgs.detailpage,
              "callback": initDetailView
            }
          },
          "autosearch": true,
          "buffdate": true
        };

        plugin_option = $.extend(true, option_default, options);
        view_edit_optoin = plugin_option.views.edit;
        view_preview_option = plugin_option.views.preview;

        var displaycolumns = [];

        var hasFilter = false;

        // 遍历数组：1、设置初始索引 index:用于排序；2、控件处理插件；3、判断是否需要筛选条件
        $.each(plugin_option.columns, function (index, column) {
          column.index = index;

          if (column.dict && column.dict != '') {
            column.plugin = plugin_inputdict;
          } else if (column.type == 'date' || column.type == "datetime") {
            column.plugin = plugin_inputdate;
          } else if (column.type == 'select-merchant') {
            plugin_select_merchant.init(module);
            column.plugin = plugin_select_merchant;
          } else {
            column.plugin = plugin_inputtext;
          }
          // 查询条件处理 BEGIN
          if (!hasFilter && column.filter) {
            hasFilter = true;
          } // 检查表单是否存在filter功能.

        });

        plugin_option.columns = plugin_option.columns.sort(compare_index);

        // 遍历columns设置,获取table的显示字段名称
        $.each(plugin_option.columns, function (index, column) {
          // 处理主键字段
          if (column.primary) {
            primaryKey = column.name;
            if (column.display) {
              displaycolumns.push(column.text);
            }
            return;
          }
          //跳过不需要在GRID中显示的列
          if (column.display == undefined || column.display == true) {
            displaycolumns.push(column.text);
          }
        });

        // 渲染表格
        table.render($(".qdp-table"), displaycolumns);

        // #region 判断是否有新增功能:如果有则设定按钮文字样式及事件

        // TODO: 权限校验：INSERT
        if (cfgs.pageOptions.powers.indexOf('insert') > -1 && plugin_option.actions.insert) {
          $(".btn-add")
            .attr("data-title", plugin_option.texts.insert)
            .on("click", edit_click);
        } else {
          $(".btn-add").remove();
        }

        // TODO: 权限校验：EXPORT
        if (cfgs.pageOptions.powers.indexOf('export') == -1) {
          $(".btn-export").remove();
        }

        // TODO: 权限校验：UPDATE
        if (cfgs.pageOptions.powers.indexOf('update') > -1 && plugin_option.actions.update) {
          $(".btn-edit")
            .attr('data-mode', 'update')
            .on("click", edit_click)
            .attr('disabled', "true");
        } else {
          $(".btn-edit").remove();
        }

        // TODO: 权限校验：DELETE
        if (cfgs.pageOptions.powers.indexOf('delete') > -1 && plugin_option.actions.delete) {
          $(".btn-remove")
            .on("click", reomve_click)
            .attr('disabled', "true");
        } else {
          $(".btn-remove").remove();
        }

        if (plugin_option.actions.preview) {
          $(".btn-preview")
            .on("click", look_click)
            .attr('disabled', "true");
        } else {
          $(".btn-preview").remove();
        }

        if (plugin_option.actions.export) {
        } else {
          $('.btn-export').remove();
        }

        if (plugin_option.actions.select) {
        } else {
          $('.btn-selectall').remove();
          $('.btn-selectopp').remove();
        }

        if (plugin_option.actions.refresh) {
        } else {
          $('.btn-refresh').remove();
        }

        if (plugin_option.actions.reset) {
        } else {
          $('.btn-reset').remove();
        }


        // $.each(plugin_option.actiondefines, function (action, actionOption) {
        //   // 忽略不需要的动作
        //   if (!plugin_option.actions[action]) {
        //     return;
        //   }
        //   try {
        //     require(['generator-actions/action-' + action + '/index'], action_plugin => {
        //       action_plugin.init(action, actionContainer, actionOption);
        //     });
        //   } finally {

        //   }
        // });

        // TODO：处理功能权限
        if (plugin_option.powers) {
          let actionContainer = $('.view-action');
          let powers = cfgs.pageOptions.powers;
          $.each(plugin_option.powers, function (index, power) {
            if (powers.indexOf(power.name) > -1) {
              let button = form.appendAction(actionContainer, power.class, power.action);
              if (power.mulit) {
                button.addClass("qdp-mulit");
              } else {
                button.addClass("qdp-single");
              }
            }
          });
        }

        // #endregion // #region 判断是否有新增功能:如果有则设定按钮文字样式及事件

        // 处理查询条件区块内容及事件
        if (hasFilter) {
          plugin_option.columns = plugin_option.columns.sort(compare_filterindex);

          var container = $(".filter-container>form");
          $.each(plugin_option.columns, function (index, column) {
            // 不作为筛选条件的字段，不需要处理
            if (!column.filter) {
              return;
            }
            // 不存在 处理插件或插件不存在筛选条件，不需要处理筛选
            if (!column.plugin || !column.plugin.filter) {
              console.warn(column.name + " 不存在处理插件或插件不存在筛选条件！");
              return;
            }

            if (column.custom) {
              var columndiv = $("#" + column.name).parent();
              columndiv.empty();
              column.custom(column, columndiv, null);
            } else {
              var columnContainer = $('<div/>').addClass('col-sm-4 col-lg-3').appendTo(container);
              var labelContainer = $('<label/>').addClass('control-label').appendTo(columnContainer);
              column.plugin.filter(column, labelContainer, columnContainer);
            }

          }); //$.each(columns, function (index, column) {

          /* 注册查询按钮点击事件 */
          $(".btn-search").on("click", _search);
          /* 注册重置按钮点击事件 */
          $(".btn-reset").on("click", _reset);
        } else {
          $(".filter-container").remove();
        } //if (hasFilter) {

        initHelptipView(plugin_option.helps.list);

        // EVENT-RAISE:generator.option.inited 自动创建表单完成时触发。
        event.raise('generator.option.inited', options);

        form.render();

        // EVENT-RAISE:generator.option.rendered 自动创建表单渲染完成时触发。
        event.raise('generator.option.rendered', options);
        // 自动调用查询条件重置方法
        if (hasFilter) {
          _reset();
        }
        // 处理是否自动调用数据查询方法
        if (plugin_option.autosearch) {
          _search();
        }
      },

      "buildDetailView": function (data, container) {
        initDetailView(data, container);
      },

      /** 根据当前配置内容，创建验证规则
       * @return {JSON} 返回验证规则
       */
      "validator": function () {
        var validatorOption = {
          message: '数据无效',
          feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
          },
          fields: {}
        };

        $.each(plugin_option.columns, function (index, column) {
          if (column.novalid) {
            return;
          }

          var _validOption = {
            message: column.text + '无效',
            validators: {
              notEmpty: {
                message: column.text + '不能为空'
              }
            }
          };

          if (column.validtype) {
            if (column.validtype == 'phone') {
              _validOption.validators['regexp'] = {
                regexp: /^1[3|5|8]{1}[0-9]{9}$/,
                message: '请输入正确的手机号码'
              };

            } else {
              _validOption.validators[column.validtype] = {
                message: column.message
              };
            }
          }

          if (column.regex) {
            _validOption.validators['regexp'] = {
              regexp: column.regex,
              message: column.message
            };
          }

          if (column.type == "date") {
            _validOption.validators['date'] = {
              format: "YYYY-MM-DD",
              message: '日期格式不正确'
            };
          }

          if (column.type == "datetime") {
            _validOption.validators['date'] = {
              format: "YYYY-MM-DD h:m:s",
              message: '日期格式不正确'
            };
          }
          validatorOption.fields[column.name] = _validOption;

        });

        return validatorOption;
      },
      /**
       * 
       */
      "params": function () {
        var options = {};
        $.each(plugin_option.columns, function (index, column) {
          if (!column.edit) {
            return;
          }
          // generator-plugin 的赋值函数
          if (column.plugin && column.plugin.get && typeof column.plugin.get === 'function') {
            column.plugin.get(options);
            return;
          } else {
            let value = $("#" + column.name).val();
            if (column.type == "date" || column.type == "datetime") {
              options[column.name] = util.stringToUTC(value);
            } else if (column.multiple) {
              options[column.name] = value.join();
            } else {
              options[column.name] = value;
            }
          }
        });

        return options;
      },

      "setValue": function (data, parent) {
        if (!parent) {
          parent = $('body');
        }
        $.each(plugin_option.columns, function (index, column) {

          if (data == undefined) {
            data = {};
          }
          if (!column.edit) {
            return;
          }
          let value = data[column.name];
          if (column.custom) {
            var columndiv = $("#" + column.name, parent).parent();
            columndiv.empty();
            column.custom(column, columndiv, value);
          } else {
            column.plugin.setValue(column, value, data, parent);
          }

        });
      },

      /** 执行保存操作，自动判断新增或更新状态，没有设置options则自动获取
       * @param {JSON} options 执行保存操作的数据
       * @return 
       */
      "save": function (options) {
        var _options;
        var _url;
        if (!options) {
          var validator = $(FROM_KEY).data("bootstrapValidator");
          validator.validate();
          if (!validator.isValid()) {
            return;
          }
          _options = module.params();
        } else {
          _options = options;
        }

        switch ($(FROM_KEY).attr(ACTION_ATTR)) {
          case ACTION_INSERT:
            _url = plugin_option.apis.insert;
            break;
          case ACTION_UPDATE:
            _options[primaryKey] = $(FROM_KEY).attr(PRIMARY_KEY_ATTR);
            _url = plugin_option.apis.update;
            break;
        }

        // 调用API，并在操作成功时返回列表页面
        ajax.post(_url, _options, function () {
          layout.back();
        });
      }

    };

    /** 初始化编辑界面,若data有值则视为编辑数据,否则视为新增数据
     * @param {JSON} data 编辑时传入的数据,新增时不需要
     */
    var initEditView = function (data) {

      let isEdit = data != null && data != undefined; // 当前打开的界面是否为编辑状态.
      if (isEdit) {
        $(FROM_KEY).attr(PRIMARY_KEY_ATTR, data[primaryKey]);
        $(FROM_KEY).attr(ACTION_ATTR, ACTION_UPDATE);
        initHelptipView(plugin_option.helps.insert);
      } else {
        $(FROM_KEY).attr(ACTION_ATTR, ACTION_INSERT);
        initHelptipView(plugin_option.helps.update);
      }

      plugin_option.columns = plugin_option.columns.sort(compare_index);
      // 调用Jquery.tmpl模板,初始化页面控件
      // $("#editor-data").tmpl(plugin_option).appendTo("#info .form-horizontal");

      var container = $("#info .form-horizontal");
      $.each(plugin_option.columns, function (index, column) {
        // 不作为编辑内容的字段，不需要处理
        if (!column.edit) {
          return;
        }
        // 不存在 处理插件或插件不存在筛选条件，不需要处理筛选
        if (!column.plugin || !column.plugin.editor) {
          console.warn(column.name + " 不存在处理插件或插件不存在编辑内容！");
          return;
        }
        var columnContainer = $('<div/>').addClass('col-sm-5');
        var labelContainer = $('<label/>').addClass('col-sm-3 control-label');

        if (column.novalid) {
          labelContainer.html(column.text);
        } else {
          labelContainer.html('<span style="color:red">*</span>' + column.text);
        }

        $('<div/>')
          .addClass('form-group')
          .append(labelContainer)
          .append(columnContainer)
          .appendTo(container);

        column.plugin.editor(column, labelContainer, columnContainer);

      }); //$.each(columns, function (index, column) {

      if (isEdit) {
        module.setValue(data);
      }
      form.render();

      var validatorOption = module.validator();
      $(FROM_KEY).bootstrapValidator(validatorOption); // 注册表单验证组件
      $(".btn-save").on("click", save_click); // 处理保存按钮事件
    };

    /** 初始化详情界面
     * @param {JSON} data 详情展示所需要的数据内容
     * @param {Element} container 承载详情字段内容的容器
     * @returns
     */
    var initDetailView = function (data, container) {
      var formContainer;
      if (container) {
        formContainer = $(FROM_KEY, container);
      } else {
        formContainer = $(FROM_KEY);
      }
      var className = "col-sm-6";
      if (view_preview_option.column && typeof view_preview_option.column === 'number') {
        className = "col-sm-" + (12 / view_preview_option.column);
      }
      $.each(plugin_option.columns, function (index, column) {
        if (column.name == '_index' || column.primary || column.display == false) {
          return;
        }

        var div = $('<div/>').addClass(className).appendTo(formContainer);
        var label = $('<label/>').addClass('control-label').appendTo(div);
        var text = data[column.name];

        if (column.plugin && column.plugin.preview) {
          column.plugin.preview(column, text, label, div);
        } else {
          var ctrl = $('<input/>')
            .attr('readonly', true)
            .addClass('form-control')
            .appendTo(div);
          ctrl.val(JSON.stringify(column));
        }

      });

      if (!container) {
        form.render();
      }
    }

    var initHelptipView = function (helptips) {
      if (!helptips || helptips.length == 0) {
        return;
      }
      var btnHelp = $("<button/>").html(' <i class="fa fa-warning"></i> 注意事项 ');
      btnHelp.on("click", function () {
        if ($('.alert').length > 0) {
          $('.alert').remove();
        } else {
          appendTips(helptips);
        }
      });
      $('.content-toolbar').prepend(btnHelp);
    }

    var appendTips = function (helptips) {
      var container = $('.filter-container');
      if (container.length == 0) {
        container = $('#info');
      }
      var div = $("<div/>")
        .addClass("alert alert-block alert-success")
        .appendTo(
        $('<div/>').addClass('col-sm-12').insertBefore(container)
        );
      div.append(
        $("<a/>")
          .addClass("close")
          .attr("data-dismiss", "alert")
          .attr("href", "#")
          .attr("aria-hidden", "true")
          .text("×")
      );
      div.append($("<p/>"));
      div.append(
        $("<h4/>")
          .append($("<i/>").addClass("fa fa-bullhorn"))
          .append(" 注意事项")
      );
      div.append($("<p/>"));
      var ul = $("<ul/>").appendTo(div);
      $.each(helptips, function (index, text) {
        ul.append($("<li/>").append(text));
      });

    }

    /** 打开数据编辑界面,若data有值则视为编辑数据,否则视为新增数据
     * @param {JSON} data 编辑时传入的数据,新增时不需要
     * @returns 
     */
    var _open_editview = function (data) {
      form.openview({
        url: view_edit_optoin.page,
        title: data ? plugin_option.texts.update : plugin_option.texts.insert,
        callback: function () {
          view_edit_optoin.callback(data);
        }
      });
    };

    /** 打开详情界面
     * @param {JSON} data 详情展示所需要的数据内容
     * @returns 
     */
    var _open_detailview = function (data) {
      switch (view_preview_option.viewmode) {
        case "modal":
          form.openWidow({
            'url': view_preview_option.page,
            'mode': view_preview_option.mode,
            'title': view_preview_option.title,
            'width': view_preview_option.width,
            'height': view_preview_option.height,
            'onshow': function (parent) {
              view_preview_option.callback(data, parent);
            }
          });
          break;
        case "page":
          form.openview({
            'url': view_preview_option.page,
            'title': view_preview_option.title,
            'callback': function () {
              view_preview_option.callback(data);
            }
          });
          break;
        default:
          break;
      }
    }

    /** 编辑界面:保存按钮点击事件处理函数 */
    var save_click = function (e) {
      e.preventDefault();
      var validator = $(FROM_KEY).data("bootstrapValidator");
      validator.validate();
      if (!validator.isValid()) {
        return;
      }
      var requesturl;
      var options = module.params();

      switch ($(FROM_KEY).attr(ACTION_ATTR)) {
        case ACTION_INSERT:
          requesturl = plugin_option.apis.insert;
          break;
        case ACTION_UPDATE:
          options[primaryKey] = $(FROM_KEY).attr(PRIMARY_KEY_ATTR);
          requesturl = plugin_option.apis.update;
          break;
      }

      // 调用API，并在操作成功时返回列表页面
      ajax.post(requesturl, options, function () {
        layout.back();
      });
    };

    /** 查看详情按钮时间处理程序 */
    var look_click = function () {
      if ($(this).attr('disabled')) {
        return;
      }
      if ($(this).data('custom')) {
        return;
      }
      _open_detailview(table.getSelect());
    }

    /** 编辑按钮事件处理程序 */
    var edit_click = function () {
      if ($(this).attr('disabled')) {
        return;
      }
      var mode = $(this).data('mode');
      if (mode == 'update') {
        var data = table.getSelect();
        _open_editview(data);
      } else {
        _open_editview();
      }
    };

    /** 删除按钮事件处理程序 */
    var reomve_click = function () {
      if ($(this).attr('disabled')) {
        return;
      }
      var primary = $(this).data("args");
      var confirmCallback = function (result) {
        if (!result) {
          return;
        }
        var options = {};
        options[primaryKey] = primary;
        ajax.post(plugin_option.apis.delete, options, function () {
          table.reload();
        });
      };
      dialog.confirm("确定删除记录?", confirmCallback);
    };

    /** 排序函数：比较filterindex */
    var compare_filterindex = function (x, y) {
      if (!x.filterindex) return 1;
      if (!y.filterindex) return -1;
      if (x.filterindex < y.filterindex) {
        return -1;
      } else if (x.filterindex > y.filterindex) {
        return 1;
      } else {
        return 0;
      }
    };

    /** 排序函数：比较index */
    var compare_index = function (x, y) {
      if (x.index < y.index) {
        return -1;
      } else if (x.index > y.index) {
        return 1;
      } else {
        return 0;
      }
    };

    /** 根据页面输入条件查询也过并填充表格 */
    var _search = function () {
      var options = {};
      if (plugin_option.args && plugin_option.args.search) {
        options = plugin_option.args.search;
      }

      // 生成查询条件：遍历每一个column，根据类型取值
      $.each(plugin_option.columns, function (index, column) {
        // 没有filter选项,不需要筛选
        if (!column.filter) {
          return;
        }

        // 不存在 处理插件或插件不存在筛选条件，不需要处理筛选
        if (!column.plugin || !column.plugin.getFilter) {
          console.warn(column.name + " 不存在处理插件或插件不存在筛选条件！");
          return;
        }

        var value = column.plugin.getFilter(column);
        if (value) {
          options[column.name] = value;
        }

      });

      //  查询数据并且填充表格（TABLE）
      table.load({
        "api": plugin_option.apis.list,
        /** 解析表格记录内容
         * @param {Element} tr
         * @param {number} index
         * @param {number} totalindex
         * @param {JSON} item
         * @returns 
         */
        "parsefn": function (tr, index, totalindex, item) {
          var columns = plugin_option.columns;
          columns = columns.sort(compare_index);
          //EVENT-RAISE:generator.parse.row
          event.raise("generator.parse.row", { "data": item, "row": tr });
          $.each(columns, function (column_index, column) {
            // 未在表格中展示的内容，不需要处理
            if (column.display == false) {
              return;
            }
            column.plugin.grid(column, tr, item[column.name], totalindex, index);
          });
        },
        "args": options
      });

    };

    /** 重置页面输入项 */
    var _reset = function () {
      $.each(plugin_option.columns, function (index, column) {
        if (!column.filter) {
          return;
        } // 没有filter选项,不需要筛选
        if (column.dict) {
          $("#" + column.name).val(null).trigger("change");
        } else {
          $("#" + column.name).val("");
        }
      });
    };

    return module;
  }
);
