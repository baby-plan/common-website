define(["QDP"], function (QDP) {
  "use strict";

  /**初始化角色列表方法
   * @param  {} filter
   * @param  {} column
   * @param  {} value
   */
  var initRole = function (filter, column, value) {
    $("<select/>")
      .attr("id", filter.name)
      .addClass("form-control")
      .appendTo(column);
    QDP.form.initCache({
      "api": QDP.api.role.alldatasapi,
      "target": $("#" + filter.name),
      "valuefn": function (index, item) { return item.id; },
      "textfn": function (index, item) { return item.name; },
      "done": function () { $("#" + filter.name).attr("data-value", value); }
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
          "list": QDP.api.admin.datas,
          "insert": QDP.api.admin.add,
          "update": QDP.api.admin.update,
          "delete": QDP.api.admin.remove
        },
        "detailor": {
          "viewmode": 'modal',
          "width": '400px',
          "height": '200px'
        },
        "texts": { "insert": "新增用户", "update": "用户编辑" },
        "actions": { "insert": true, "update": true, "delete": true, "preview": false },
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "id", "primary": true },
          {
            "name": "account", "text": "登录名",
            "validtype": 'phone', "message": '商户登录名必须为手机号码',
            "edit": true, "filter": true
          },
          { "name": "name", "text": "姓名", "edit": true, "filter": true },
          { "name": "roleid", "text": "角色", "edit": true, "custom": initRole, "display": false, "filter": true },
          { "name": "rolename", "text": "角色名称" },
          { "name": "password", "text": "密码", "display": false, "edit": true },
        ]
      };
      QDP.generator.build(options);
    },
    /** 卸载模块 */
    destroy: function () {

    }
  };
});
