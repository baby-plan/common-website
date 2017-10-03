/* ========================================================================
 * App.modules.organization v1.0
 * 机构相关内容:机构明细\机构列表
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {

  app.modules.organization = {
    "init": () => {
      var options = {
        "apis": {
          "list": API.organization.datas,
          "insert": API.organization.add,
          "update": API.organization.update,
          "delete": API.organization.remove
        },
        "texts": { "insert": "新增机构信息", "update": "机构信息编辑" },
        "headers": { "edit": { "text": "机构信息" }, "table": { "text": "机构信息列表" } },
        "actions": { "insert": true, "update": true, "delete": true },
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "id", "primary": true },
          { "name": "name", "text": "机构名称", "base64": true, "edit": true, "filter": true },
          { "name": "type", "text": "机构类型", "multiple": true, "dict": "orgatype", "edit": true, "filter": true },
          { "name": "addr", "text": "机构地址", "base64": true, "edit": true },
          { "name": "telphone", "text": "联系电话", "edit": true, "filter": true },
          { "name": "jointime", "text": "加入时间", "type": "date", "edit": true },
          { "name": "describe", "text": "机构简介", "base64": true, "edit": true, "overflow": 20 },
          // { "name": "imgs", "text": "图片", "type": "mulitfile", "edit": true },
          { "name": "_action", "text": "操作" }
        ]
      };
      App.plugins.common.init(options);
    },
    "list": () => {
      App.ajax(API.organization.datas, {}, (json) => {
        $("#orga_data").tmpl(json.data.list, {
          "api": () => { return API.files.getapi; }
        }).appendTo('#networks');
      });
    }
  }
})(App);