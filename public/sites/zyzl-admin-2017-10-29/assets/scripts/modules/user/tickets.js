
define(["QDP"], function (QDP) {
  "use strict";

  return {
    define: {
      name: "领券情况查询",
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
          { name: "channeltype", text: "领券渠道", dict: "channeltype", filter: true, filterindex: 4 },
          { name: "itemtype", text: "套餐类型", dict: "itemtype", filter: true, filterindex: 5 },
          { name: "itemcode", text: "套餐编号", filter: true, filterindex: 6 },
          { name: "begin_date", text: "开始时间", type: "date", filter: true, filterindex: 7, display: false },
          { name: "end_date", text: "结束时间", type: "date", filter: true, filterindex: 8, display: false },

          { name: "publishdate", text: "已发免费券总量" },
          { name: "outdate", text: "已发折扣券总量" },
          { name: "usedate", text: "未使用免费券总量" },
          { name: "carbrand", text: "未使用折扣券总量" },
          { name: "cartype", text: "已使用免费券总量" },
          { name: "ordercode", text: "已使用折扣券总量" },
          { name: "orderdate", text: "已过期总量" },
          { name: "orderamount", text: "免费券验证率" },
          { name: "payamount", text: "折扣券验证率" },
          { name: "vipamount", text: "验证率（免费券+折扣券）" }
        ]
      };
      QDP.generator.init(options);

    },
    /** 卸载模块 */
    destroy: function () {

    }
  };
});

