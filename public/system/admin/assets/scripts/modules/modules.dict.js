/* ========================================================================
 * App.plugins.dict v1.0
 * 103.操作日志查询插件
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  // 系统运行后自动加载数据库字典表内容
  App.addLoadedExecuteFunc(function (next) {
    App.logger.debug("[AUTO]加载数据库字典表内容!");
    var url = API.datadict.dataallapi;
    App.ajax(url, {}, function (json) {
      $.each(json.data.list, function (index, item) {
        if (cfgs.dict[item.dictkey] == undefined) {
          cfgs.dict[item.dictkey] = {};
        }
        cfgs.dict[item.dictkey][item.itemkey] = App.base64.decode(item.itemvalue);
      });
      next();
    });
  });

  app.plugins.dict = {
    "get": function (dictkey, func) {
      if (cfgs.dict[dictkey] == undefined) {
        var url = API.datadict.datas.replace("{dictkey}", dictkey);
        App.ajax(url, {}, function (json) {
          $.each(json.data.list, function (index, item) {
            cfgs.dict[dictkey][item.itemkey] = App.base64.decode(item.itemvalue);
            func(cfgs.dict[dictkey]);
          });
        });
      } else {
        func(cfgs.dict[dictkey]);
      }
    },
    /** 根据数据字典名称获取该键对应的数据字典
     * @params {string} dictkey 数据字典名称.
     * 
     * @return {Array} 数据项对象.
     */

    getDict: function (dictkey, func) {
      if (dictkey) {
        return cfgs.dict[dictkey];
      } else {
        return undefined;
      }
    },
    /** 根据数据字典名称及字典项的键获取该键对应的值
     * @params {string} dictkey 数据字典名称.
     * @params {string} itemkey 字典项的键.
     * 
     * @return {string} 数据项对应的值.
     */

    getText: function (dictkey, itemkey) {
      var dictItem = this.getDict(dictkey);
      if (dictItem) {
        var item = dictItem[itemkey];
        if (!item) {
          return "未定义:" + itemkey;
        } else {
          if (item.text) {
            return item.text;
          } else {
            return item;
          }
        }
      } else {
        return "数据字典不存在";
      }
    },
    /** 根据数据字典名称及字典项的键获取该键对应的数据项
     * @params {string} dictkey 数据字典名称.
     * @params {string} itemkey 字典项的键.
     * 
     * @return {JSONObject} 数据项对象.
     */

    getItem: function (dictkey, itemkey) {
      var dictItem = this.getDict(dictkey);
      if (dictItem) {
        return dictItem[itemkey];
      } else {
        return undefined;
      }
    }
  }
  /**根据字典名称及字典代码生成数据字典管理功能模块
   * 
   * @param {string} dictkey  字典代码
   * @param {string} dictname 字典名称
   */
  app.plugins.dict.Package = function (dictkey, dictname) {
    var options = {
      "apis": {
        "list": API.datadict.datas.replace("{dictkey}", dictkey),
        "insert": API.datadict.add.replace("{dictkey}", dictkey),
        "update": API.datadict.update.replace("{dictkey}", dictkey),
        "delete": API.datadict.remove.replace("{dictkey}", dictkey)
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
        { "name": "itemvalue", "text": dictname, "base64": true, "edit": true, "filter": true },
        { "name": "_action", "text": "操作" }
      ],
      "filters": []
    };
    App.plugins.common.init(options);
  };
})(App);