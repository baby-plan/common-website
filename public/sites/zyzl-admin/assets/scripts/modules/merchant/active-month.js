define(["QDP"], function (QDP) {
  "use strict";
  return {
    "define": {
      "name": "活跃商户统计报表",
      "version": "1.0.0.0",
      "copyright": " Copyright 2017-2027 WangXin nvlbs,Inc."
    },
    /** 加载模块 */
    "init": function () {
      var options = {
        "apis": { "list": QDP.api.logs.datas },
        "plugins": ['city', { 'name': 'chart', 'chart': 'merchant-active-month' }],
        "columns": [
          { "name": "_index", text: "序号" },
          { "name": "province_code", text: "省份", dict: "province", filter: true, filterindex: 1 },
          { "name": "city_code", text: "地市", dict: "city", filter: true, filterindex: 2 },
          { "name": "county_code", text: "区县", dict: "county", filter: true, filterindex: 3 },
          { "name": "begin_date", text: "开始时间", type: "date", filter: 'date', filterindex: 4, display: false },
          { "name": "end_date", text: "结束时间", type: "date", filter: 'date', filterindex: 5, display: false },
          { "name": "publishdate", text: "验证免费券用户数" },
          { "name": "outdate", text: "验证折扣券用户数" },
        ]
      };
      QDP.generator.build(options);

    },
    /** 卸载模块 */
    "destroy": function () {
    }
  };
});
