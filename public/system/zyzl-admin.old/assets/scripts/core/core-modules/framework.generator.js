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
    "core/core-modules/framework.row",
    "core/core-modules/framework.cell",


    'generator-plugins/input-text/index',
    'generator-plugins/input-dict/index',
    'generator-plugins/input-date/index',
    'generator-plugins/select-icon/index',
    'generator-plugins/select-image/index',

    "moment",
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
    row,
    cell,
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

    var listbuffer = [],
      plugin_option = {},
      plugin_action = {},
      primaryKey;

    /** 初始化表单内容
     * @param  {json} options 初始化选项
     */
    var init = function (options) {
      const option_default = {
        apis: { list: "", insert: "", update: "", delete: "" },
        columns: [],
        headers: {
          edit: { icon: "fa fa-table", text: "基本信息" },
          filter: { icon: "fa fa-search", text: "查询条件" },
          table: { icon: "fa fa-table", text: "查询结果" }
        },
        helps: { insert: [], update: [], list: [] },
        actions: { insert: false, update: false, delete: false },
        editor: {
          page: cfgs.editpage,
          callback: undefined
        },
        autosearch: true,
        buffdate: true
      };

      plugin_option = $.extend(true, option_default, options);
      plugin_action = plugin_option.actions;

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

      // 判断是否有新增功能:如果有则设定按钮文字样式及事件

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

      if (hasFilter) {
        // 处理查询条件区块内容及事件
        plugin_option.columns = plugin_option.columns.sort(compare_filterindex);

        var container = $("#filter-container>form");
        $.each(plugin_option.columns, function (index, column) {
          if (column.custom) {
            var columndiv = $("#" + column.name).parent();
            columndiv.empty();
            column.custom(column, columndiv, null);
          } else if (column.filter && column.plugin && column.plugin.filter) {
            var labelContainer = $('<label/>')
              .addClass('col-xs-4 control-label')
              .appendTo(container);
            var valueContainer = $('<div/>')
              .addClass('col-xs-8')
              .appendTo(container);
            column.plugin.filter(column, labelContainer, valueContainer);
          }

        }); //$.each(columns, function (index, column) {

        /* 注册查询按钮点击事件 */
        $(".btn_search").on("click", _search);
        /* 注册重置按钮点击事件 */
        $(".btn_reset").on("click", _reset);
      } else {
        $("#filter-container").remove();
        $(".btn_filter").remove();
      } //if (hasFilter) {

      let helptips = [];
      $.each(plugin_option.helps.list, function (index, text) {
        helptips.push(text);
      });

      if (helptips.length > 0) {
        var div = $("<div/>")
          .addClass("alert alert-block alert-success")
          .insertBefore($("#filter-container"));
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

      form.init();
      // 自动调用查询条件重置方法
      if (hasFilter) {
        _reset();
      }
      // 处理是否自动调用数据查询方法
      if (plugin_option.autosearch) {
        _search();
      }
    };

    /** 初始化编辑界面,若data有值则视为编辑数据,否则视为新增数据
     * @param {object} data 编辑时传入的数据,新增时不需要
     */
    var initEditor = function (data) {
      /** 编辑界面:保存按钮点击事件处理函数 */
      var save_click = function (e) {
        e.preventDefault();
        var validator = $(FROM_KEY).data("bootstrapValidator");
        validator.validate();
        if (!validator.isValid()) {
          return;
        }
        var requesturl;
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

      let isEdit = data != null && data != undefined; // 当前打开的界面是否为编辑状态.
      let helptips = [];
      if (isEdit) {
        $(FROM_KEY).attr(PRIMARY_KEY_ATTR, data[primaryKey]);
        $(FROM_KEY).attr(ACTION_ATTR, ACTION_UPDATE);
        $.each(plugin_option.helps.insert, function (index, text) {
          helptips.push(text);
        });
      } else {
        $(FROM_KEY).attr(ACTION_ATTR, ACTION_INSERT);
        $.each(plugin_option.helps.update, function (index, text) {
          helptips.push(text);
        });
      }

      if (helptips.length > 0) {
        var div = $("<div/>")
          .addClass("alert alert-block alert-info")
          .insertBefore($("#info"));
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
      $("#editor-data")
        .tmpl(plugin_option)
        .appendTo(".panel-body>.form-horizontal");

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
        if (data == undefined) {
          data = {};
        }
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
              // _validOption.validators['stringLength'] = {
              //   min: 11,
              //   max: 11,
              //   message: '请输入11位手机号码'
              // };
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

        validatorOption.fields[column.name] = _validOption;
      });

      form.init();

      $("#role-form").bootstrapValidator(validatorOption); // 注册表单验证组件
      $(".btn_save").on("click", save_click); // 处理保存按钮事件
    };

    var requirePlugins = function (plugin_name, column, data, events) {
      require(['generator-plugins/' + plugin_name + '/index'], function (plugin) {
        plugin.init(column, data, events);
      });
    }

    /** 打开数据编辑界面,若data有值则视为编辑数据,否则视为新增数据
     * @param {object} data 编辑时传入的数据,新增时不需要
     */
    var _open_editview = function (data) {
      form.openview({
        url: plugin_option.editor.page,
        title: data ? plugin_option.texts.update : plugin_option.texts.insert,
        callback: function () {
          if (plugin_option.editor.callback) {
            plugin_option.editor.callback(data);
          } else {
            initEditor(data);
          }
        }
      });
    };

    /** 编辑按钮事件处理程序 */
    var edit_click = function () {
      var args = $(this).data("args");
      if (listbuffer && listbuffer.length > 0) {
        _open_editview(listbuffer[args]);
      } else {
        _open_editview();
      }
    };

    /** 删除按钮事件处理程序 */
    var reomve_click = function () {
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
        if (plugin_option.buffdate) {
          if (index == 0) {
            listbuffer = [];
          }
          listbuffer.push(item);
        }
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
          if (column.name == "_action") {
            // 按钮类型
            var td = row.createCell(tr);
            // TODO: 权限校验：UPDATE
            if (cfgs.pageOptions.powers.indexOf('update') > -1 && plugin_action.update) {
              cell.addAction(td, "btn_edit", index, edit_click);
            }
            // TODO: 权限校验：DELETE
            if (cfgs.pageOptions.powers.indexOf('delete') > -1 && plugin_action.delete) {
              cell.addAction(td, "btn_remove", item[primaryKey], reomve_click);
            }
            if (
              column.customAction &&
              typeof column.customAction == "function"
            ) {
              column.customAction(td, item, index, cfgs.pageOptions.powers);
            }

            if (column.command) {
              column.command(td, item, index);
            }
          } else {
            column.plugin.grid(column, tr, value, totalindex);
          }
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
        if (column.filter == "daterange") {
          // 处理时间段类型筛选
          $("#" + column.name + "_1").val(
            moment()
              .subtract(29, "days")
              .format(cfgs.options.defaults.dateformat)
          );
          $("#" + column.name + "_2").val(
            moment().format(cfgs.options.defaults.dateformat)
          );
        } else if (column.dict) {
          $("#" + column.name).val(null).trigger("change");
        } else {
          $("#" + column.name).val("");
        }
      });
    };

    return {
      init: init,
      getdata: function (index) {
        return listbuffer[index];
      }
    };
  }
);
