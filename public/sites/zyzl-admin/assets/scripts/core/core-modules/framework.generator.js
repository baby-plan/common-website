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
    "core/core-modules/framework.base64",
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
    'generator-plugins/select-icon/index',
    'generator-plugins/select-image/index',

    "bootstrapValidator",
    "jquery.tmpl",
    "jquery.tmplPlus",
    'jquery.template'
  ],
  function (
    $,
    cfgs,
    api,
    ajax,
    base64,
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
    plugin_selecticon,
    plugin_selectimage
  ) {
    "use strict";
    const ACTION_ATTR = "data-action";
    const ACTION_INSERT = "INSERT";
    const ACTION_UPDATE = "UPDATE";
    const FORM_NAME = "role-form";
    const FROM_KEY = "#" + FORM_NAME;
    const PRIMARY_KEY_ATTR = "data-primary";
    var plugin_option = {}, primaryKey;

    var module = {

      /** 初始化表单内容
       * @param  {JSON} options 初始化选项
       */
      "init": function (options) {
        const option_default = {
          "apis": { "list": "", "insert": "", "update": "", "delete": "" },
          "columns": [],
          "headers": {
            "edit": { icon: "fa fa-table", text: "基本信息" },
            "filter": { icon: "fa fa-search", text: "查询条件" },
            "table": { icon: "fa fa-table", text: "查询结果" }
          },
          "helps": { "insert": [], "update": [], "list": [] },
          "actions": { "insert": false, "update": false, "delete": false },
          "editor": {
            "page": cfgs.editpage,
            "callback": initEditView
          },
          "detailor": {
            "mode": "modal",//"mode:page|modal"
            "width": 'full',
            "height": 'full',
            "page": cfgs.detailpage,
            "callback": initDetailView
          },
          "autosearch": true,
          "buffdate": true
        };

        plugin_option = $.extend(true, option_default, options);
        var displaycolumns = [];

        var hasFilter = false;

        // 遍历数组：1、设置初始索引 index:用于排序；2、控件处理插件；3、判断是否需要筛选条件
        $.each(plugin_option.columns, function (index, column) {
          column.index = index;

          if (column.dict && column.dict != '') {
            column.plugin = plugin_inputdict;
          } else if (column.type == 'date' || column.type == "datetime") {
            column.plugin = plugin_inputdate;
          } else if (column.type == "icon") {
            column.plugin = plugin_selecticon;
          } else if (column.type == 'image') {
            column.plugin = plugin_selectimage;
            // } else if (column.type) {
            //   column.plugin = plugin_inputtext;
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
          if (column.grid == undefined || column.grid == true) {
            displaycolumns.push(column.text);
          }
        });

        // 渲染表格
        table.render($("#table"), displaycolumns);

        // #region 判断是否有新增功能:如果有则设定按钮文字样式及事件
        // TODO: 权限校验：INSERT
        if (cfgs.pageOptions.powers.indexOf('insert') > -1 && plugin_option.actions.insert) {
          $(".btn_add")
            .attr("data-title", plugin_option.texts.insert)
            .on("click", edit_click);
        } else {
          $(".btn_add").remove();
        }

        // TODO: 权限校验：EXPORT
        if (cfgs.pageOptions.powers.indexOf('export') == -1) {
          $(".btn_export").remove();
        }

        // TODO: 权限校验：UPDATE
        if (cfgs.pageOptions.powers.indexOf('update') > -1 && plugin_option.actions.update) {
          $(".btn_edit")
            .attr('data-mode', 'update')
            .on("click", edit_click)
            .attr('disabled', "true");
        } else {
          $(".btn_edit").remove();
        }

        // TODO: 权限校验：DELETE
        if (cfgs.pageOptions.powers.indexOf('delete') > -1 && plugin_option.actions.delete) {
          $(".btn_remove")
            .on("click", reomve_click)
            .attr('disabled', "true");
        } else {
          $(".btn_remove").remove();
        }

        $(".btn_look")
          .on("click", look_click)
          .attr('disabled', "true");
        // #endregion // #region 判断是否有新增功能:如果有则设定按钮文字样式及事件

        // 处理查询条件区块内容及事件
        if (hasFilter) {
          plugin_option.columns = plugin_option.columns.sort(compare_filterindex);

          var container = $("#filter-container>form");
          $.each(plugin_option.columns, function (index, column) {
            if (column.custom) {
              var columndiv = $("#" + column.name).parent();
              columndiv.empty();
              column.custom(column, columndiv, null);
            } else if (column.filter && column.plugin && column.plugin.filter) {
              var columnContainer = $('<div/>')
                .addClass('col-sm-4 col-lg-3')
                .appendTo(container);
              var labelContainer = $('<label/>')
                .addClass('control-label')
                .appendTo(columnContainer);
              // var valueContainer = $('<div/>')
              //   // .addClass('col-xs-2')
              //   .appendTo(columnContainer);
              column.plugin.filter(column, labelContainer, columnContainer);
            }

          }); //$.each(columns, function (index, column) {

          /* 注册查询按钮点击事件 */
          $(".btn_search").on("click", _search);
          /* 注册重置按钮点击事件 */
          $(".btn_reset").on("click", _reset);
        } else {
          $("#filter-container").remove();
        } //if (hasFilter) {

        initHelptipView(plugin_option.helps.list);

        // EVENT-RAISE:generator.option.inited 自动创建表单完成时触发。
        event.raise('generator.option.inited', options);

        form.init();

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
      /** 根据当前配置内容，创建验证规则
       * @return {JSON} 返回验证规则
       */
      "validator": function () {
        var validatorOption = {
          message: 'This value is not valid',
          feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
          },
          fields: {}
        };

        $.each(plugin_option.columns, function (index, column) {
          var _validOption = {};
          if (!column.novalid) {
            _validOption = {
              message: column.text + '验证失败',
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
              if (column.base64) {
                options[column.name] = base64.encode(value);
              } else {
                options[column.name] = value;
              }
            }
          }
        });

        return options;
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
        ajax.get(_url, _options, function () {
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

      if (plugin_option.headers.edit) {
        $("#info>.panel-heading>.panel-title").empty();
        $("#info>.panel-heading>.panel-title").append(
          $("<i/>").addClass(plugin_option.headers.edit.icon)
        );
        $("#info>.panel-heading>.panel-title").append(
          plugin_option.headers.edit.text
        );
      }

      plugin_option.columns = plugin_option.columns.sort(compare_index);
      // 调用Jquery.tmpl模板,初始化页面控件
      $("#editor-data").tmpl(plugin_option).appendTo(".panel-body>.form-horizontal");

      $.each(plugin_option.columns, function (index, column) {
        if (data == undefined) {
          data = {};
        }

        let value = data[column.name];
        if (column.base64) {
          value = base64.decode(value);
        }

        if (column.custom) {
          var columndiv = $("#" + column.name).parent();
          columndiv.empty();
          column.custom(column, columndiv, value);
        } else if (column.type == "date" && value) {
          $("#" + column.name).val(
            util.utcTostring(value, cfgs.options.defaults.dateformat2)
          );
        } else if (column.type == "datetime" && value) {
          $("#" + column.name).val(
            util.utcTostring(value, cfgs.options.defaults.datetimeformat)
          );
        } else if (typeof column.dict === "string") {
          // 初始化下拉列表控件,并且设置初始值
          form.initDict(
            column.dict,
            $("#" + column.name),
            value,
            column.multiple
          );

        } else if (column.name == "_index") {
          // 索引字段不需要处理
        } else if (column.type == "icon") {
          $("#" + column.name).attr("data-value", value);
        } else if (column.type == "map") {
          // 处理地图类型字段
          requirePlugins('map', column, data, column.events);
        } else if (column.type == "image") {
          // 处理图片类型字段
          requirePlugins('upload', column, data, column.events);
        } else {
          $("#" + column.name).val(value);
          if (column.primary && value) {
            $("#" + column.name).attr("readonly", true);
          }
        }
      });

      form.init();

      var validatorOption = module.validator();
      $("#role-form").bootstrapValidator(validatorOption); // 注册表单验证组件
      $(".btn_save").on("click", save_click); // 处理保存按钮事件
    };

    /** 初始化详情界面
     * @param {JSON} data 详情展示所需要的数据内容
     */
    var initDetailView = function (data, container) {
      var rowContainer, second = false, formContainer;
      if (container) {
        formContainer = $('#role-form', container);
      } else {
        formContainer = $('#role-form');
      }
      $.each(plugin_option.columns, function (index, column) {
        if (column.type == "icon" || column.type == "image" || column.type == "map" || column.name == '_index') {
          return;
        }
        if (second) {
          second = false;
        } else {
          second = true;
          rowContainer = $('<div/>').addClass('form-group').appendTo(formContainer);
        }

        var label = $('<label/>').addClass('col-sm-2 control-label');
        form.appendText(label, column.text);
        rowContainer.append(label);
        var div = $('<div/>').addClass('col-sm-4').appendTo(rowContainer);
        var ctrl = $('<input/>')
          .attr('readonly', true)
          .addClass('form-control')
          .appendTo(div);
        var text = data[column.name];
        if (column.base64) {
          text = base64.decode(text);
          ctrl.val(text);
        } else if (column.type == 'datetime') {
          ctrl.val(
            util.utcTostring(text, cfgs.options.defaults.dateformat2)
          );
        } else if (column.type == 'date') {
          ctrl.val(
            util.utcTostring(text, cfgs.options.defaults.datetimeformat)
          );
        } else if (typeof column.dict === "string") {
          ctrl.val(dict.getText(column.dict, text));
        } else {
          ctrl.val(text);
        }

      });

      if (!container) {
        form.init();
      } else {
        $('tools').remove();
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
      var container = $('#filter-container');
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

    var requirePlugins = function (plugin_name, column, data, events) {
      require(['generator-plugins/' + plugin_name + '/index'], function (plugin) {
        plugin.init(column, data, events);
      });
    }

    /** 打开数据编辑界面,若data有值则视为编辑数据,否则视为新增数据
     * @param {JSON} data 编辑时传入的数据,新增时不需要
     * @returns 
     */
    var _open_editview = function (data) {
      form.openview({
        url: plugin_option.editor.page,
        title: data ? plugin_option.texts.update : plugin_option.texts.insert,
        callback: function () {
          plugin_option.editor.callback(data);
        }
      });
    };

    /** 打开详情界面
     * @param {JSON} data 详情展示所需要的数据内容
     * @returns 
     */
    var _open_detailview = function (data) {

      switch (plugin_option.detailor.mode) {
        case "modal":
          form.openWidow({
            'url': plugin_option.detailor.page,
            'title': '详情',
            'width': plugin_option.detailor.width,
            'height': plugin_option.detailor.height,
            'onshow': function (parent) {
              plugin_option.detailor.callback(data, parent);
            }
          });
          break;
        case "page":
          form.openview({
            'url': plugin_option.detailor.page,
            'title': '详情',
            'callback': function () {
              plugin_option.detailor.callback(data);
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
      ajax.get(requesturl, options, function () {
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
        ajax.get(plugin_option.apis.delete, options, function () {
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
        var value = column.plugin.getFilter(column);

        if (value) {
          if (column.base64) {
            value = base64.encode(value);
          }
          options[column.name] = value;
        }

      });

      // 解析表格记录内容
      var parsefn = function (tr, index, totalindex, item) {
        var columns = plugin_option.columns;
        columns = columns.sort(compare_index);
        $.each(columns, function (column_index, column) {
          if (column.grid == false) {
            return;
          }
          var value = item[column.name];
          if (column.base64) {
            value = base64.decode(value);
          }
          column.plugin.grid(column, tr, value, totalindex, index);
        });
      };
      //  查询数据并且填充表格（TABLE）
      table.load({
        api: plugin_option.apis.list,
        parsefn: parsefn,
        args: options
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
