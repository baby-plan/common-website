define(["QDP"], function (QDP) {
  "use strict";
  return {
    "define": {
      "name": "订单处理模块",
      "version": "1.0.0.0",
      "copyright": ' Copyright 2017-2027 WangXin nvlbs,Inc.',
    },
    /** 加载模块 */
    "init": function () {
      var options = {
        "apis": { "list": QDP.api.logs.datas },
        "plugins": ['city'],
        "columns": [
          { name: "_index", text: "序号" },
          { name: "province_code", text: "省份", dict: "province", filter: true, filterindex: 1 },
          { name: "city_code", text: "地市", dict: "city", filter: true, filterindex: 2 },
          { name: "county_code", text: "区县", dict: "county", filter: true, filterindex: 3 },
          { name: "storeCode", text: "商户编号", filter: true },
          { name: "poi", text: "POIID", display: false, filter: true },
          { name: "storeName", text: "商户名称", filter: true },
          { name: "ccs", text: "结算月份", type: 'month', display: false, filter: 'date' },
          { name: "addr", text: "商户地址", },
          { name: "point", text: "店铺联系人", },
          { name: "c1", text: "店铺联系电话", },
          { name: "c2", text: "签约日期", type: 'date' },
          { name: "c3", text: "签约到期日期", type: 'date' },
          { name: "c4", text: "合同签约日期", type: 'date' },
          { name: "c5", text: "签约人电话", type: 'date' },
          { name: "c6", text: "订单总数", },
          { name: "c7", text: "免费券订单数", },
          { name: "c8", text: "免费券有效订单数", },
          { name: "c9", text: "免费券无效订单数", },
          { name: "c10", text: "免费券结算金额", },
          { name: "c11", text: "免费券有效结算金额", },
          { name: "c12", text: "免费券无效结算金额", },

          { name: "c13", text: "折扣券订单数", },
          { name: "c14", text: "折扣券有效订单数", },
          { name: "c15", text: "折扣券无效订单数", },
          { name: "c16", text: "折扣券结算金额", },
          { name: "c17", text: "折扣券有效结算金额", },
          { name: "c18", text: "折扣券无效结算金额", },

          { name: "c19", text: "结算开始时间", type: 'date' },
          { name: "c20", text: "结算结束时间", type: 'date' },
          { name: "c21", text: "账单年月", type: 'date' },
          { name: "c22", text: "生成时间", type: 'date' },
        ]
      };
      QDP.generator.build(options);
    },
    /** 卸载模块 */
    "destroy": function () {

    }
  };
});
