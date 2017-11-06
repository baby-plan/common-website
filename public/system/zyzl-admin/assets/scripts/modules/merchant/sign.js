define(["QDP"], function (QDP) {
  "use strict";
  return {
    define: {
      name: "商户签约数量统计",
      version: "1.0.0.0",
      copyright: " Copyright 2017-2027 WangXin nvlbs,Inc."
    },
    /** 加载模块 */
    init: function () {
      var options = {
        "apis": { "list": QDP.api.logs.datas },
        "plugins": ['city', { 'name': 'chart', 'chart': 'map-new' }],
        "columns": [
          { name: "_index", text: "序号" },
          { name: "province_code", text: "省份", dict: "province", filter: true, filterindex: 1 },
          { name: "city_code", text: "地市", dict: "city", filter: true, filterindex: 2 },
          { name: "county_code", text: "区县", dict: "county", filter: true, filterindex: 3 },
          { name: "begin_date", text: "开始时间", type: "date", filter: true, filterindex: 4, display: false },
          { name: "end_date", text: "结束时间", type: "date", filter: true, filterindex: 5, display: false },
          // { name: "n1", text: "承诺的商户数" },
          { name: "n2", text: "审核通过已发布的商户数" },
          // { name: "n3", text: "审核通过未发布的商户数" },
          // { name: "n4", text: "取消发布的商户数" }
        ]
      };
      QDP.generator.build(options);
    },
    /** 卸载模块 */
    destroy: function () {
    }
  };
});
