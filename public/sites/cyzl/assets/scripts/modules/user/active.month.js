define(["QDP"], function (QDP) {
  "use strict";
  return {
    define: {
      name: "活跃用户统计报表",
      version: "1.0.0.0",
      copyright: " Copyright 2017-2027 WangXin nvlbs,Inc."
    },
    /** 加载模块 */
    init: function () {
      var options = {
        apis: { list: QDP.api.logs.datas },
        plugins: ['city', { 'name': 'chart', 'chart': 'user-active-month' }],
        columns: [
          { name: "_index", text: "序号" },
          { name: "province_code", text: "省份", dict: "province", filter: true, filterindex: 1 },
          { name: "city_code", text: "地市", dict: "city", filter: true, filterindex: 2 },
          { name: "county_code", text: "区县", dict: "county", filter: true, filterindex: 3 },
          { name: "begin_date", text: "开始时间", type: "date", filter: true, filterindex: 4, grid: false },
          { name: "end_date", text: "结束时间", type: "date", filter: true, filterindex: 5, grid: false },
          { name: "publishdate", text: "获取权益免费券用户数" },
          { name: "outdate", text: "验证权益免费券用户数" },
          { name: "usedate", text: "获取权益折扣券用户数" },
          { name: "carbrand", text: "验证权益折扣券用户数" },
          { name: "cartype", text: "获取活动免费券用户数" },
          { name: "carplate", text: "验证活动免费券用户数" },
          { name: "ordercode", text: "获取活动折扣券用户数" },
          { name: "orderdate", text: "验证活动折扣券用户数" }
        ]
      };

      QDP.generator.init(options);
    },
    /** 卸载模块 */
    destroy: function () {
    }
  };
});