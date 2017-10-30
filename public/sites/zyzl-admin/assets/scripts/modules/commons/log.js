define(["QDP"], function (QDP) {
  "use strict";

  /** 初始化日志类型列表
   * @param {JSON} filter
   * @param {JSON} column
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
    define: {
      name: "日志查询模块",
      version: "1.0.0.0",
      copyright: " Copyright 2017-2027 WangXin nvlbs,Inc."
    },
    /** 加载模块 */
    init: function () {
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
          { "name": "begin_date", "text": "订单开始时间", "type": "date", "filter": true, "filterindex": 8, "display": false },
          { "name": "end_date", "text": "订单结束时间", "type": "date", "filter": true, "filterindex": 9, "display": false },
        ]
      };
      QDP.generator.build(options);
    },
    /** 卸载模块 */
    destroy: function () {

    }
  };
});
