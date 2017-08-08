define(['QDP'], function (QDP) {
  "use strict";

  return {
    'define': {
      "name": "订单处理模块",
      "version": "1.0.0.0",
      'copyright': ' Copyright 2017-2027 WangXin nvlbs,Inc.',
    },

    "init": function () {
      var options = {
        "apis": { "list": QDP.api.logs.datas },
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "id", "primary": true },
          { "name": "priv", "text": "省份", "dict": "schooltype", "base64": true, "filter": true, "filterindex": 1 },
          { "name": "city", "text": "城市", "dict": "schooltype", "base64": true, "filter": true, "filterindex": 2 },
          { "name": "ordercode", "text": "订单编号", "base64": true, "filter": true, "filterindex": 3 },
          { "name": "telphone", "text": "手机号码", "display": false, "base64": true, "filter": true, "filterindex": 4 },
          { "name": "name", "text": "商家名称", "base64": true, "filter": true, "filterindex": 5 },
          { "name": "checkstate", "text": "审核状态", "dict": "checkstate", "filter": true, "filterindex": 6 },
          { "name": "orderdate", "text": "下单时间", "type": "date", "filter": "daterange", "filterindex": 7 },
          { "name": "addr", "text": "商户地址", "base64": true },
          { "name": "point", "text": "商户评分", "base64": true },
          { "name": "code", "text": "洗车券码", "base64": true },
          { "name": "codetype", "text": "券码类型", "dict": "codetype" },
          { "name": "orderamount", "text": "订单金额", "base64": true },
          { "name": "payamount", "text": "实付金额", "base64": true },
          { "name": "vipamount", "text": "折扣券会员价", "base64": true },
          { "name": "aboutamount", "text": "折扣券签约价", "base64": true },
          { "name": "amount", "text": "店铺门市价", "base64": true },
          { "name": "freeamount", "text": "免费券结算价", "base64": true },
          { "name": "realamount", "text": "应结算金额", "base64": true }
        ]
      };
      QDP.generator.init(options);
    },

    "initUserSearch": function () {
      var options = {
        "apis": { "list": QDP.api.logs.datas },
        //用户信息(手机号、车型)，调用订单信息查询。
        // 输入用户手机号（单个/批量），
        // 省份、城市、用户手机号、洗车券码、洗车券状态（已使用、待使用、已过期）
        // 券码类型（免费券、折扣券）、券码类别（基本套餐券、活动套餐券、一次性券）
        // 渠道号（和地图、H5）、发券时间、过期时间、使用时间、车辆品牌、车辆类型（小轿车、SUV/商务车）
        // 车牌号码、商户名称、商户地址、商户评分、订单编号、订单时间、订单金额、实付金额、折扣券会员价
        // 折扣券签约价、店铺门市价、免费券结算价、应结算金额等。
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "id", "primary": true },
          { "name": "priv", "text": "省份", "dict": "schooltype" },
          { "name": "city", "text": "城市", "dict": "schooltype" },
          { "name": "telphone", "text": "手机号码", "filter": true },
          { "name": "code", "text": "洗车券码", "base64": true },
          { "name": "codestate", "text": "洗车券状态", "dict": "codestate" },
          { "name": "codetype", "text": "券码类型", "dict": "codetype" },
          { "name": "codetype2", "text": "券码类别", "dict": "codetype2" },
          { "name": "channeltype", "text": "渠道号", "dict": "channeltype" },
          { "name": "publishdate", "text": "发券时间", "type": "date" },
          { "name": "outdate", "text": "过期时间", "type": "date" },
          { "name": "usedate", "text": "使用时间", "type": "date" },
          { "name": "carbrand", "text": "车辆品牌" },
          { "name": "cartype", "text": "车辆类型", 'dict': 'cartype', "filter": true },
          { "name": "carplate", "text": "车牌号码", "filter": true },
          { "name": "name", "text": "商家名称", "base64": true },
          { "name": "addr", "text": "商户地址", "base64": true },
          { "name": "point", "text": "商户评分", "base64": true },

          { "name": "ordercode", "text": "订单编号" },
          { "name": "orderdate", "text": "订单时间", "type": "date" },
          { "name": "orderamount", "text": "订单金额" },
          { "name": "payamount", "text": "实付金额" },
          { "name": "vipamount", "text": "折扣券会员价", "base64": true },
          { "name": "aboutamount", "text": "折扣券签约价", "base64": true },
          { "name": "amount", "text": "店铺门市价", "base64": true },
          { "name": "freeamount", "text": "免费券结算价", "base64": true },
          { "name": "realamount", "text": "应结算金额", "base64": true }
        ]
      };
      QDP.generator.init(options);
    },

    "initSettlementSearch": function () {
      var options = {
        "apis": { "list": QDP.api.logs.datas },
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "id", "primary": true },
          { "name": "priv", "text": "省份", "dict": "schooltype" },
          { "name": "city", "text": "城市", "dict": "schooltype" },
          { "name": "telphone", "text": "手机号码", "filter": true },
          { "name": "code", "text": "洗车券码", "base64": true },
          { "name": "codestate", "text": "洗车券状态", "dict": "codestate" },
          { "name": "codetype", "text": "券码类型", "dict": "codetype" },
          { "name": "codetype2", "text": "券码类别", "dict": "codetype2" },
          { "name": "channeltype", "text": "渠道号", "dict": "channeltype" },
          { "name": "publishdate", "text": "发券时间", "type": "date" },
          { "name": "outdate", "text": "过期时间", "type": "date" },
          { "name": "usedate", "text": "使用时间", "type": "date" },
          { "name": "carbrand", "text": "车辆品牌" },
          { "name": "cartype", "text": "车辆类型", 'dict': 'cartype', "filter": true },
          { "name": "carplate", "text": "车牌号码", "filter": true },
          { "name": "name", "text": "商家名称", "base64": true },
          { "name": "addr", "text": "商户地址", "base64": true },
          { "name": "point", "text": "商户评分", "base64": true },

          { "name": "ordercode", "text": "订单编号" },
          { "name": "orderdate", "text": "订单时间", "type": "date" },
          { "name": "orderamount", "text": "订单金额" },
          { "name": "payamount", "text": "实付金额" },
          { "name": "vipamount", "text": "折扣券会员价", "base64": true },
          { "name": "aboutamount", "text": "折扣券签约价", "base64": true },
          { "name": "amount", "text": "店铺门市价", "base64": true },
          { "name": "freeamount", "text": "免费券结算价", "base64": true },
          { "name": "realamount", "text": "应结算金额", "base64": true }
        ]
      };
      QDP.generator.init(options);
    }

  }
});