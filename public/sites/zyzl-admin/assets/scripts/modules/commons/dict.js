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
        "texts": { "insert": dictname + "信息", "update": dictname + "信息编辑" },
        "actions": { "insert": true, "update": true, "preview": false },
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "itemkey", "text": dictname + "编号", "primary": true, "display": true, "edit": true, "filter": true },
          { "name": "itemvalue", "text": dictname, "edit": true, "filter": true }
        ],
        "filters": []
      };
      QDP.generator.build(options);
    },
    /**
     * 行政区划管理
     */
    'init-codearea': function () {
      var options = {
        "apis": {
          "list": QDP.api.coderange.datas,
          "insert": QDP.api.coderange.add,
          "update": QDP.api.coderange.update,
          "delete": QDP.api.coderange.remove
        },
        "texts": { "insert": "新增行政区划信息", "update": "行政区划信息编辑" },
        "actions": { "insert": true, "update": true, "preview": false },
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "id", "text": "地区编号", "primary": true, "display": true, "filter": true },
          { "name": "name", "text": "地区名称", "edit": true, "filter": true },
          { "name": "level", "text": "级别", "edit": true },
          { "name": "parent_id", "text": "上级编码", "filter": true, "edit": true },
          { "name": "status", "text": "状态", "edit": true, "filter": true },
          { "name": "lng", "text": "地理经度", "edit": true },
          { "name": "lat", "text": "地理纬度", "edit": true },
          { "name": "simplename", "text": "名称首拼", "edit": true }
        ]
      };
      QDP.generator.build(options);
    },
    /**
     * 号码段管理
     */
    'init-coderange': function () {
      var options = {
        "apis": {
          "list": QDP.api.coderange.datas,
          "insert": QDP.api.coderange.add,
          "update": QDP.api.coderange.update,
          "delete": QDP.api.coderange.remove
        },
        "texts": { "insert": "新增号段信息", "update": "号段信息编辑" },
        "actions": { "insert": true, "update": true, "preview": false },
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "id", "text": "号段", "primary": true, "display": true, "filter": true },
          { "name": "postcode", "text": "电话区号", "edit": true },
          { "name": "provinceid", "text": "省", "filter": true, "edit": true },
          { "name": "cityid", "text": "市", "filter": true, "edit": true },
          { "name": "postcode", "text": "邮编", "filter": true },
          { "name": "codename", "text": "运营商", "edit": true, "edit": true },
          { "name": "carddescripe", "text": "卡类型描述" },
          { "name": "province_code", "text": "所属省份编码" },
          { "name": "city_code", "text": "所属城市编码" },
          { "name": "state", "text": "状态", "filter": true }
        ]
      };
      QDP.generator.build(options);
    }
  }
});