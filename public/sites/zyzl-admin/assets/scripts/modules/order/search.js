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
        apis: { list: QDP.api.logs.datas },
        columns: [
          { name: "_index", text: "序号" },
          { name: "province_code", text: "省份", dict: "province", filter: true, filterindex: 1 },
          { name: "city_code", text: "城市", dict: "city", filter: true, filterindex: 2 },
          { name: "ordercode", text: "订单编号", base64: true, filter: true, filterindex: 5 },
          { name: "orderdate", text: "订单时间", type: "date" },
          { name: "begin_date", text: "订单开始时间", type: "date", filter: true, filterindex: 8, grid: false },
          { name: "end_date", text: "订单结束时间", type: "date", filter: true, filterindex: 9, grid: false },
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
          { "name": "channeltype", "text": "领券渠道", "dict": "channeltype", filter: true, filterindex: 6 },
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
    /** 卸载模块 */
    destroy: function () {

    }
  };
});
