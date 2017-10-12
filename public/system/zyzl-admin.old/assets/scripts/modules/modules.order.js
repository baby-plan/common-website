define(['QDP'], function (QDP) {
  "use strict";

  return {
    define: {
      name: "订单处理模块",
      version: "1.0.0.0",
      copyright: ' Copyright 2017-2027 WangXin nvlbs,Inc.',
    },

    "init": function () {
      var options = {
        apis: { list: QDP.api.logs.datas },
        columns: [
          { name: "_index", text: "序号" },
          { name: "province_code", text: "省份", dict: "province", filter: true, filterindex: 1 },
          { name: "city_code", text: "城市", dict: "city", filter: true, filterindex: 2 },
          { name: "ordercode", text: "订单编号", base64: true, filter: true, filterindex: 5 },
          { name: "orderdate", text: "订单时间", type: "date"},
          { name: "begin_date", text: "订单开始时间", type: "date", filter: true, filterindex: 8, grid: false },
          { name: "end_date", text: "订单结束时间", type: "date", filter: true, filterindex:9, grid: false },
          { name: "checkstate", text: "订单审核状态", dict: "checkstate", filter: true, filterindex: 7 },
          { name: "orderamount", text: "订单金额", base64: true },
          { name: "payamount", text: "实付金额", base64: true },
          { name: "vipamount", text: "折扣券会员价", base64: true },
          { name: "aboutamount", text: "折扣券签约价", base64: true },
          { name: "amount", text: "店铺门市价", base64: true },
          { name: "freeamount", text: "免费券结算价", base64: true },
          { name: "realamount", text: "应结算金额", base64: true },
          { name: "storeCode", text: "商户编号", base64: true },
          { name: "poi", text: "POIID", base64: true },
          { name: "storeName", text: "商户名称", base64: true, filter: true, filterindex: 4 },
          { name: "addr", text: "商户地址", base64: true },
          { name: "point", text: "商户评分", base64: true },
          { name: "telphone", text: "手机号码", base64: true, filter: true, filterindex: 3 },
          { name: "code", text: "洗车券码", base64: true },
          { "name": "codestate", "text": "券码状态", "dict": "codestate" },
          { "name": "codetype", "text": "券码类型", "dict": "codetype" },
          { "name": "codetype2", "text": "券码类别", "dict": "codetype2" },
          { "name": "channeltype", "text": "领券渠道", "dict": "channeltype", filter: true,filterindex:6 },
          { "name": "publishdate", "text": "领券时间", "type": "date" },
          { "name": "outdate", "text": "过期时间", "type": "date" },
          { "name": "usedate", "text": "验证时间", "type": "date" },
          { "name": "carbrand", "text": "车辆品牌" },
          { "name": "cartype", "text": "车辆类型", 'dict': 'cartype' },
          { "name": "carplate", "text": "车牌号码" },
        ]
      };
      QDP.generator.init(options);
    },

    "initSettlementSearch": function () {
      var options = {
        apis: { list: QDP.api.logs.datas },
        columns: [
          { name: "_index", text: "序号" },
          { name: "province_code", text: "省份", dict: "province", filter: true, filterindex: 1 },
          { name: "city_code", text: "城市", dict: "city", filter: true, filterindex: 2 },
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
    }

  }
});