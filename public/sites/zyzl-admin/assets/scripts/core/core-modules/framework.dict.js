/* ========================================================================
 * plugins.dict v1.0
 * 数据字典管理插件
 * ========================================================================
 * Copyright 2017-2027 WangXin nvlbs,Inc.
 * ======================================================================== */
define(
  [
    "jquery",
    "cfgs",
    "API",
    "core/core-modules/framework.ajax",
    "core/core-modules/framework.event",
    "core/core-modules/framework.base64"
  ],
  function ($, cfgs, API, ajax, event, base64) {
    // EVENT-ON:layout.logined 用户登录后自动加载数据库字典表内容
    event.on("layout.logined", function () {
      console.debug("[AUTO]加载数据库字典表内容!");
      var url = API.datadict.dataallapi;
      ajax.get(url, { noblock: true, args: {} }, function (json) {
        $.each(json.data.list, function (index, item) {
          if (cfgs.dict[item.dictkey] == undefined) {
            cfgs.dict[item.dictkey] = {};
          }
          cfgs.dict[item.dictkey][item.itemkey] = base64.decode(item.itemvalue);
        });
      });
    });

    return {
      define: {
        name: "数据字典处理模块",
        version: "1.0.0.0",
        copyright: " Copyright 2017-2027 WangXin nvlbs,Inc."
      },
      get: function (dictkey, func) {
        if (cfgs.dict[dictkey] == undefined) {
          var url = API.datadict.datas.replace("{dictkey}", dictkey);
          ajax.get(url, {}, function (json) {
            cfgs.dict[dictkey] = {};
            $.each(json.data.list, function (index, item) {
              cfgs.dict[dictkey][item.itemkey] = base64.decode(item.itemvalue);
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
      getDict: function (dictkey) {
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
        var dictItem = this.getItem(dictkey, itemkey);
        if (dictItem) {
          if (dictItem.text) {
            return dictItem.text;
          } else {
            return "未定义:" + itemkey;
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
        if (dictItem && itemkey && dictItem[itemkey]) {
          return dictItem[itemkey];
        } else if (dictItem) {
          for (var item in dictItem) {
            return dictItem[item];
          }
          // return dictItem[0];
          // return undefined;
        } else {
          return undefined;
        }
      }
    };
  }
);
