/* ========================================================================
 * App.plugins.syslog v1.0
 * 103.操作日志查询插件
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  "use strict";
  /**初始化角色列表方法
   * @param  {} filter
   * @param  {} column
   */
  var initType = function (filter, column) {
    var select = $("<select/>")
      .attr("id", filter.name)
      .addClass("form-control")
      .appendTo(column);
    App.form.initCache({
      "api": API.logs.typesapi,
      "hasall": true,
      "target": $("#" + filter.name),
      "valuefn": function (index, item) { return item.type; },
      "textfn": function (index, item) { return item.type; }
    });
  }
  app.plugins.syslog = {
    "init": function () {
      var options = {
        "apis": { "list": API.logs.datas },
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "id", "primary": true },
          { "name": "owner", "text": "所属账号", "base64": true, "filter": true, "filterindex": 2 },
          { "name": "type", "text": "日志类型", "custom": initType, "filter": true, "filterindex": 1 },
          { "name": "msg", "text": "详情", "base64": true, "filter": true, "filterindex": 3 },
          { "name": "date", "text": "操作时间", "type": "date", "filter": "daterange", "filterindex": 5 },
          { "name": "ip", "text": "登录IP", "base64": true, "filter": true, "filterindex": 4 }
        ]
      };
      App.plugins.common.init(options);
    }
  }
})(App);