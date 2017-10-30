define(["QDP"], function (QDP) {
  "use strict";

  return {
    define: {
      name: "商户签约明细",
      version: "1.0.0.0",
      copyright: " Copyright 2017-2027 WangXin nvlbs,Inc."
    },
    /** 加载模块 */
    init: function () {
      var options = {
        apis: { list: QDP.api.logs.datas },
        "plugins": ['city'],
        columns: [
          { name: "_index", text: "序号" },
          { name: "province_code", text: "省份", dict: "province", filter: true, filterindex: 1 },
          { name: "city_code", text: "地市", dict: "city", filter: true, filterindex: 2 },
          { name: "county_code", text: "区县", dict: "county", filter: true, filterindex: 3 },
          { name: "begin_date", text: "开始时间", type: "date", filter: true, filterindex: 4, grid: false },
          { name: "end_date", text: "结束时间", type: "date", filter: true, filterindex: 5, grid: false },
          { name: "n1", text: "商户名称" },
          { name: "n2", text: "商户地址" },
          { name: "n3", text: "商户电话" },
          { name: "n4", text: "签约时间", type: "date" }
        ]
      };
      QDP.generator.init(options);
    },
    /** 卸载模块 */
    destroy: function () {
    }
  };
});
