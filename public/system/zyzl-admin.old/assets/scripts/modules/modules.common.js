/* ========================================================================
 * App.plugins.admin v1.0
 * 102.用户管理插件
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * ======================================================================== */
define(['jquery', 'QDP'], function ($, QDP) {
  "use strict";

  /** 初始化日志类型列表
   * @param  {} filter
   * @param  {} column
   */
  var initType = function (filter, column) {
    $("<select/>")
      .attr("id", filter.name)
      .addClass("form-control")
      .appendTo(column);
    QDP.form.initCache({
      "api": QDP.api.logs.typesapi,
      "target": $("#" + filter.name),
      "valuefn": function (index, item) {
        return item.type;
      },
      "textfn": function (index, item) {
        return item.type;
      }
    });
  }

  return {
    'define': {
      "name": "公共功能模块",
      "version": "1.0.0.0",
      'copyright': ' Copyright 2017-2027 WangXin nvlbs,Inc.',
    },

    /** 加载日志查询管理 */
    "init-log-search": function () {
      var options = {
        "apis": {
          "list": QDP.api.logs.datas
        },
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "id", "primary": true },
          { "name": "owner", "text": "操作员账号", "base64": true, "filter": true, "filterindex": 2 },
          { "name": "type", "text": "日志类型", "custom": initType, "filter": true, "filterindex": 1 },
          { "name": "msg", "text": "详情", "base64": true, "filter": true, "filterindex": 3 },
          { "name": "date", "text": "操作时间", "type": "datetime" },
          { "name": "ip", "text": "登录IP", "base64": true, "filter": true, "filterindex": 4 },
          { "name": "begin_date", "text": "订单开始时间", "type": "date", "filter": true, "filterindex": 8, "grid": false },
          { "name": "end_date", "text": "订单结束时间", "type": "date", "filter": true, "filterindex": 9, "grid": false },
        ]
      };
      QDP.generator.init(options);
    },

    /** 加载参数设置界面 */
    'init-options': function () {
      QDP.form.init();
      var api = QDP.api.options.getoptionapi;
      var keys = "password,pagesize";
      keys = QDP.base64.encode(keys);
      QDP.ajax.get(api, { "keys": keys }, function (json) {
        $("#password").val(QDP.base64.decode(json.data.password));
        $("#pagesize").val(QDP.base64.decode(json.data.pagesize));
      });
      // 处理保存按钮事件
      $(".btn_save").on("click", function (e) {
        e.preventDefault();
        var options = {
          "password": QDP.base64.encode($("#password").val()),
          "pagesize": QDP.base64.encode($("#pagesize").val())
        };

        // 执行操作并且重新加载页面,用于刷新数据
        QDP.ajax(QDP.api.options.setoptionapi, options, function () { QDP.alertText("保存设置成功!"); });
      });
    },

  }
});