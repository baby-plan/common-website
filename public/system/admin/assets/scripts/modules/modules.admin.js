/* ========================================================================
 * App.plugins.admin v1.0
 * 102.用户管理插件
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  "use strict";
  /**初始化角色列表方法
   * @param  {} filter
   * @param  {} column
   * @param  {} value
   */
  var initRole = function (filter, column, value) {
    var select = $("<select/>")
      .attr("id", filter.name)
      .addClass("form-control")
      .appendTo(column);
    App.form.initCache({
      "api": API.role.alldatasapi,
      "hasall": true,
      "target": $("#" + filter.name),
      "valuefn": function (index, item) { return item.id; },
      "textfn": function (index, item) { return App.base64.decode(item.name); },
      "done": function () { $("#" + filter.name).attr("data-value", value); }
    });
  }
  app.plugins.admin = {
    "init": function () {
      var options = {
        "apis": {
          "list": API.admin.datas,
          "insert": API.admin.add,
          "update": API.admin.update,
          "delete": API.admin.remove
        },
        "texts": { "insert": "新增用户", "update": "用户编辑" },
        "headers": { "edit": { "text": "用户信息" }, "table": { "text": "用户列表" } },
        "actions": { "insert": true, "update": true, "delete": true },
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "id", "primary": true },
          { "name": "account", "text": "登录名", "base64": true, "edit": true, "filter": true },
          { "name": "name", "text": "姓名", "base64": true, "edit": true, "filter": true },
          { "name": "nickname", "text": "昵称", "base64": true, "edit": true, "filter": true },
          { "name": "email", "text": "EMail", "base64": true, "edit": true, "valid": "email", "filter": true },
          { "name": "roleid", "text": "角色", "edit": true, "custom": initRole, "grid": false, "filter": true },
          { "name": "rolename", "text": "角色名称", "base64": true },
          { "name": "_action", "text": "操作" }
        ]
      };
      App.plugins.common.init(options);
    }
  }
})(App);