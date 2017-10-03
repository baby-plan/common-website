/* ========================================================================
 * App.modules.school v1.0
 * 学校相关内容:学校明细
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {

  app.modules.school = {
    "init": () => {
      var options = {
        "apis": {
          "list": API.school.datas,
          "insert": API.school.add,
          "update": API.school.update,
          "delete": API.school.remove
        },
        "texts": { "insert": "新增学校信息", "update": "学校信息编辑" },
        "headers": { "edit": { "text": "学校信息" }, "table": { "text": "学校信息列表" } },
        "actions": { "insert": true, "update": true, "delete": true },
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "id", "primary": true },
          { "name": "name", "text": "学校名称", "base64": true, "edit": true, "filter": true },
          { "name": "type", "text": "学校类型", "multiple": true, "dict": "schooltype", "edit": true, "filter": true },
          { "name": "addr", "text": "学校地址", "base64": true, "edit": true },
          { "name": "telphone", "text": "联系电话", "edit": true, "filter": true },
          { "name": "jointime", "text": "加入时间", "type": "date", "edit": true },
          { "name": "describe", "text": "学校简介", "base64": true, "edit": true, "overflow": 20 },
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