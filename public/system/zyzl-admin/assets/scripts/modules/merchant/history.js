define(["QDP"], function (QDP) {
  "use strict";

  return {
    define: {
      name: "商户全历史查询",
      version: "1.0.0.0",
      copyright: " Copyright 2017-2027 WangXin nvlbs,Inc."
    },
    /** 加载模块 */
    init: function () {
      var options = {
        apis: { list: QDP.api.logs.datas },
        // "plugins": ['city'],
        "helps": {
          "list": QDP.config.tooltip.compute
        },
        "views": {
          "preview": {
            "title": "查看商户全历史详情",
            "height": "600px",
            "column": 3,
          }
        },
        columns: [
          { name: "_index", text: "序号" },
          { name: "province_code", text: "省份", dict: "province", filter: true, filterindex: 1 },
          { name: "city_code", text: "地市", dict: "city", filter: true, filterindex: 2 },
          { name: "county_code", text: "区县", dict: "county", filter: true, filterindex: 3 },
          { name: "storeCode", text: "商户编号", filter: true, filterindex: 7 },
          { name: "poi", text: "POIID", filter: true, filterindex: 6 },
          { name: "storeName", text: "商户名称", filter: true, filterindex: 8 },
          { name: "addr", text: "商户地址", },
          { name: "point", text: "商户评分", },
          { name: "telphone", text: "用户手机号" },
          { name: "code", text: "洗车券码", },
          { name: "codestate", text: "洗车券状态", dict: "codestate" },
          { name: "codetype", text: "券码类型", dict: "codetype", filter: true },
          { name: "codetype2", text: "券码类别", dict: "codetype2", filter: true },
          { name: "channeltype", text: "领券渠道", dict: "channeltype", filter: true },
          { name: "publishdate", text: "领券时间", type: "date" },
          { name: "outdate", text: "过期时间", type: "date" },
          { name: "usedate", text: "验证时间", type: "date" },
          { name: "carbrand", text: "车辆品牌" },
          { name: "cartype", text: "车辆类型", dict: "cartype" },
          { name: "carplate", text: "车牌号码" },
          { name: "ordercode", text: "订单编号" },
          { name: "orderdate", text: "订单时间", type: "date" },
          { name: "begin_date", text: "订单开始时间", type: "date", filter: 'date', filterindex: 4, display: false },
          { name: "end_date", text: "订单结束时间", type: "date", filter: 'date', filterindex: 5, display: false },
          { name: "orderauditstate", text: "订单审核状态" },
          { name: "orderamount", text: "订单金额" },
          { name: "payamount", text: "实付金额" },
          { name: "vipamount", text: "折扣券会员价", },
          { name: "aboutamount", text: "折扣券签约价", },
          { name: "amount", text: "店铺门市价", },
          { name: "freeamount", text: "免费券结算价", },
          { name: "realamount", text: "应结算金额", }
        ]
      };
      QDP.generator.build(options);
    },
    /** 卸载模块 */
    destroy: function () {

    }
  };
});
