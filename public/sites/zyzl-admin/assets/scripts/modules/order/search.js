define(["QDP"], function (QDP) {
  "use strict";
  // 执行审核操作
  var audit_click = function () {

    var data = QDP.table.getSelect();
    if (data == null) {
      QDP.alert('请选择需要审核的订单（仅选择1条记录）');
      return;
    }
    QDP.form.openWidow({
      'title': '审核订单信息',
      'width': '800px',
      'mode': 'tab',
      'url': 'views/business/order-audit.html',
      'onshow': function (parent) {
        QDP.generator.buildDetailView(data, parent);
      }
    });
  }

  var action_status_controller = function (data) {
    return data.audit_status == 0;
  }

  return {
    "define": {
      "name": "订单处理模块",
      "version": "1.0.0.0",
      "copyright": ' Copyright 2017-2027 WangXin nvlbs,Inc.',
    },
    /** 加载模块 */
    "init": function () {
      var options = {
        "apis": { list: QDP.api.merchant.datas },
        "plugins": ['city'],
        "powers": [
          { "name": "audit", "class": "btn-audit", "action": audit_click, "controller": action_status_controller },
        ],
        "views": {
          "preview": {
            "viewmode": "modal",
            "mode": "tab",
            'title': '订单详情',
            "page": 'views/business/order-detail.html',
            "callback": QDP.generator.buildDetailView
          }
        },
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "province_code", "text": "省份", dict: "province", filter: true, filterindex: 1 },
          { "name": "city_code", "text": "地市", dict: "city", filter: true, filterindex: 2 },
          { "name": "ordercode", "text": "订单编号", filter: true, filterindex: 5 },
          { "name": "orderdate", "text": "订单时间", type: "date" },
          { "name": "begin_date", "text": "订单开始时间", type: "date", filter: true, filterindex: 8, display: false },
          { "name": "end_date", "text": "订单结束时间", type: "date", filter: true, filterindex: 9, display: false },
          { "name": "audit_status", "text": "订单审核状态", dict: "audit_status", filter: true, filterindex: 7 },
          { "name": "orderamount", "text": "订单金额" },
          { "name": "payamount", "text": "实付金额" },
          { "name": "vipamount", "text": "折扣券会员价" },
          { "name": "aboutamount", "text": "折扣券签约价" },
          { "name": "amount", "text": "店铺门市价" },
          { "name": "freeamount", "text": "免费券结算价" },
          { "name": "realamount", "text": "应结算金额" },
          { "name": "storeCode", "text": "商户编号" },
          { "name": "poi", "text": "POIID" },
          { "name": "storeName", "text": "商户名称", filter: true, filterindex: 4 },
          { "name": "addr", "text": "商户地址" },
          { "name": "point", "text": "商户评分" },
          { "name": "telphone", "text": "手机号码", filter: true, filterindex: 3 },
          { "name": "code", "text": "洗车券码" },
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
      QDP.generator.build(options);
    },

    /** 卸载模块 */
    "destroy": function () {
    }
  };
});
