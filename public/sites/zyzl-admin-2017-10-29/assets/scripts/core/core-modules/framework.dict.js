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
      ajax.get(url, { block: false, args: {} }, function (json) {
        $.each(json.data.list, function (index, item) {
          if (cfgs.dict[item.dictkey] == undefined) {
            cfgs.dict[item.dictkey] = {};
          }
          cfgs.dict[item.dictkey][item.itemkey] = base64.decode(item.itemvalue);
        });
      });
    });

    var get = function (dictkey, func) {
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
    };

    /** 根据数据字典名称获取该键对应的数据字典
     * @params {string} dictkey 数据字典名称.
     * 
     * @return {Array} 数据项对象.
     */
    var getDict = function (dictkey) {
      if (dictkey) {
        return cfgs.dict[dictkey];
      } else {
        return undefined;
      }
    };

    /** 根据数据字典名称及字典项的键获取该键对应的数据项
     * @param {string} dictkey 数据字典名称.
     * @param {string} itemkey 字典项的键.
     * @return {JSON} 数据项对象.
     */
    var getItem = function (dictkey, itemkey) {
      var dictItem = getDict(dictkey);
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
    };

    /** 根据数据字典名称及字典项的键获取该键对应的值
     * @param {string} dictkey 数据字典名称.
     * @param {string} itemkey 字典项的键.
     * @return {string} 数据项对应的值.
     */
    var getText = function (dictkey, itemkey) {
      // 内容不存在时不需要处理
      if (!itemkey) {
        return '';
      }
      let itemkeylist;
      if (typeof itemkey === 'number') {
        itemkeylist = [itemkey];
      } else if (typeof itemkey === 'string') {
        itemkeylist = itemkey.split(',');
      } else {
        itemkeylist = [];
      }

      let newtext = "";
      $.each(itemkeylist, function (index, key) {
        if (index > 0) {
          newtext += ",";
        }
        var item = getItem(dictkey, key);
        if (item) {
          if (item.text) {
            newtext += item.text;
          } else {
            newtext += item;
          }
        } else {
          newtext += key;
        }
      });
      return newtext;
    }

    return {
      define: {
        name: "数据字典处理模块",
        version: "1.0.0.0",
        copyright: " Copyright 2017-2027 WangXin nvlbs,Inc."
      },
      "get": get,
      "getDict": getDict,
      "getItem": getItem,
      "getText": getText
    };
  }
);
