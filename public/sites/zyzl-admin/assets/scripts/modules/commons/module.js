define(["QDP"], function (QDP) {
  "use strict";

  var initModuleParents = function (filter, column, value) {
    var select = $("<select/>")
      .attr("id", filter.name)
      .addClass("form-control")
      .appendTo(column);
    QDP.form.initCache({
      "api": QDP.api.module.parents,
      "target": $("#" + filter.name),
      "valuefn": function (index, item) { return item.ModuleID; },
      "textfn": function (index, item) { return item.ModuleID + ' - ' + QDP.base64.decode(item.ModuleName); },
      "done": function () {
        $("#" + filter.name).append($("<option/>").val("000").text("000 - 根目录"));
        $("#" + filter.name).attr("data-value", value);
      }
    });
  }

  return {
    define: {
      name: "系统模块管理",
      version: "1.0.0.0",
      copyright: " Copyright 2017-2027 WangXin nvlbs,Inc."
    },
    /** 加载模块 */
    init: function () {
      var options = {
        "apis": {
          "list": QDP.api.module.datas,
          "insert": QDP.api.module.add,
          "update": QDP.api.module.update,
          "delete": QDP.api.module.remove
        },
        "texts": { "insert": "新增功能模块", "update": "功能模块编辑" },
        "headers": { "edit": { "text": "功能模块信息" }, "table": { "text": "功能模块列表" } },
        "actions": { "insert": true, "update": true, "delete": true },
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "ModuleID", "text": "菜单编号", "primary": true, "edit": true, "display": true },
          { "name": "ModuleParent", "text": "所属父级", "custom": initModuleParents, "edit": true, "filter": true },
          { "name": "ModuleName", "text": "菜单名称", "base64": true, "edit": true, "filter": true },
          { "name": "ModuleIcon", "text": "图标", "type": "icon", "novalid": true, "base64": true, "edit": true },
          { "name": "ModulePage", "text": "地址", "novalid": true, "base64": true, "edit": true },
          { "name": "ModulePackage", "text": "组件包", "novalid": true, "base64": true, "edit": true },
          { "name": "ModuleInitMethod", "text": "初始化方法", "novalid": true, "base64": true, "edit": true },
          { "name": "ModuleMethods", "text": "功能清单", "novalid": true, "base64": true, "edit": true },
          { "name": "ModuleDestory", "text": "销毁函数", "novalid": true, "base64": true, "edit": true },
          { "name": "ModuleDesc", "text": "页面描述", "novalid": true, "base64": true, "edit": true },
          { "name": "CreateUser", "text": "创建者", "base64": true },
          { "name": "CreateTime", "text": "创建时间", "type": "datetime" },
          { "name": "LastModifyUser", "text": "最后修改者", "base64": true },
          { "name": "LastModiftTime", "text": "最后修改时间", "type": "datetime" },
          { "name": "state", "text": "状态", "dict": "state" }
        ]
      };
      QDP.generator.init(options);
    },
    /** 卸载模块 */
    destroy: function () {

    }
  };
});
