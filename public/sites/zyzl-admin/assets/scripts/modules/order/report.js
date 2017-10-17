define(["QDP"], function (QDP) {
  "use strict";
  return {
    define: {
      name: "订单处理模块",
      version: "1.0.0.0",
      copyright: ' Copyright 2017-2027 WangXin nvlbs,Inc.',
    },
    /** 加载模块 */
    init: function () {
      var options = {
        "apis": { "list": QDP.api.logs.datas },
        "plugins": ['city'],
        "columns": [
          { name: "_index", text: "序号" },
          { name: "province_code", text: "省份", dict: "province", filter: true, filterindex: 1 },
          { name: "city_code", text: "地市", dict: "city", filter: true, filterindex: 2 },
          { name: "county_code", text: "区县", dict: "county", filter: true, filterindex: 3 },
          { name: "storeCode", text: "商户编号", base64: true, filter: true },
          { name: "poi", text: "POIID", base64: true, display: false, filter: true },
          { name: "storeName", text: "商户名称", base64: true, filter: true },
          { name: "ccs", text: "结算月份", type: 'month', display: false, filter: 'date' },
          { name: "addr", text: "商户地址", base64: true },
          { name: "point", text: "店铺联系人", base64: true },
          { name: "c1", text: "店铺联系电话", base64: true },
          { name: "c2", text: "签约日期", base64: true, type: 'date' },
          { name: "c3", text: "签约到期日期", base64: true, type: 'date' },
          { name: "c4", text: "合同签约日期", base64: true, type: 'date' },
          { name: "c5", text: "签约人电话", base64: true, type: 'date' },
          { name: "c6", text: "订单总数", base64: true },
          { name: "c7", text: "免费券订单数", base64: true },
          { name: "c8", text: "免费券有效订单数", base64: true },
          { name: "c9", text: "免费券无效订单数", base64: true },
          { name: "c10", text: "免费券结算金额", base64: true },
          { name: "c11", text: "免费券有效结算金额", base64: true },
          { name: "c12", text: "免费券无效结算金额", base64: true },

          { name: "c13", text: "折扣券订单数", base64: true },
          { name: "c14", text: "折扣券有效订单数", base64: true },
          { name: "c15", text: "折扣券无效订单数", base64: true },
          { name: "c16", text: "折扣券结算金额", base64: true },
          { name: "c17", text: "折扣券有效结算金额", base64: true },
          { name: "c18", text: "折扣券无效结算金额", base64: true },

          { name: "c19", text: "结算开始时间", base64: true, type: 'date' },
          { name: "c20", text: "结算结束时间", base64: true, type: 'date' },
          { name: "c21", text: "账单年月", base64: true, type: 'date' },
          { name: "c22", text: "生成时间", base64: true, type: 'date' },
        ]
      };
      QDP.generator.init(options);
    },
    /** 卸载模块 */
    destroy: function () {

    }
  };
});
