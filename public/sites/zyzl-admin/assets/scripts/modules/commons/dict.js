/* ========================================================================
 * App.plugins.dict v1.0
 * 103.操作日志查询插件
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * ======================================================================== */
define(['QDP'], function (QDP) {
  /**根据字典名称及字典代码生成数据字典管理功能模块
   * 
   * @param {string} dictname 字典名称
   * @param {string} dictkey  字典代码
   */
  return {
    init: function (dictname, dictkey) {
      var options = {
        "apis": {
          "list": QDP.api.datadict.datas.replace("{dictkey}", dictkey),
          "insert": QDP.api.datadict.add.replace("{dictkey}", dictkey),
          "update": QDP.api.datadict.update.replace("{dictkey}", dictkey),
          "delete": QDP.api.datadict.remove.replace("{dictkey}", dictkey)
        },
        "helps": {
          "insert": ["字典项编号不要相同,会影响使用,暂时未加入判断,需操作人员自行判断.", "字典项编号保存后不允许修改."],
          "update": ["字典项编号保存后不允许修改."]
        },
        "headers": { "edit": { "text": dictname + "信息" }, "table": { "text": dictname + "列表" } },
        "texts": { "insert": dictname + "信息", "update": dictname + "信息编辑" },
        "actions": { "insert": true, "update": true, "delete": true },
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "itemkey", "text": dictname + "编号", "primary": true, "display": true, "edit": true, "filter": true },
          { "name": "itemvalue", "text": dictname, "base64": true, "edit": true, "filter": true }
        ],
        "filters": []
      };
      QDP.generator.init(options);
    },
    'init-coderange': function () {
      var options = {
        "apis": {
          "list": QDP.api.coderange.datas,
          "insert": QDP.api.coderange.add,
          "update": QDP.api.coderange.update,
          "delete": QDP.api.coderange.remove
        },
        "helps": {
          "insert": ["字典项编号不要相同,会影响使用,暂时未加入判断,需操作人员自行判断.", "字典项编号保存后不允许修改."],
          "update": ["字典项编号保存后不允许修改."]
        },
        "headers": { "edit": { "text": "号段信息" }, "table": { "text": "号段信息列表" } },
        "texts": { "insert": "新增号段信息", "update": "号段信息编辑" },
        "actions": { "insert": true, "update": true, "delete": true },
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "codeid", "text": "号段编号", "primary": true, "display": true, "filter": true },
          { "name": "codename", "text": "号段名称", "base64": true, "edit": true, "filter": true },
          { "name": "provinceid", "text": "所属省代码", "filter": true, "edit": true },
          { "name": "cityid", "text": "所属市代码", "filter": true, "edit": true },
          { "name": "state", "text": "状态", "filter": true }
        ]
      };
      QDP.generator.init(options);
    }
  }
});