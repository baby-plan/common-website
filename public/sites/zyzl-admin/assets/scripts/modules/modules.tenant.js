define(['QDP'], function (QDP) {
  "use strict";

  var edit_click = function () {
    // dialog.alertText("1");
  }

  var info_customAction = function (td, data, index) {
    QDP.cell.addAction(td, "btn_check", index, edit_click);
    QDP.cell.addAction(td, "btn_publish", index, edit_click);
    QDP.cell.addAction(td, "btn_unpublish", index, edit_click);
    QDP.cell.addAction(td, "btn_look", index, edit_click);
    QDP.cell.addAction(td, "btn_chgpwd", index, edit_click);
  }

  var project_customAction = function (td, data, index) {
    QDP.cell.addAction(td, "btn_check", index, edit_click);
  }

  return {
    'define': {
      "name": "商户管理模块",
      "version": "1.0.0.0",
      'copyright': ' Copyright 2017-2027 WangXin nvlbs,Inc.',
    },

    "initInfo": function () {
      var options = {
        "apis": {
          "list": QDP.api.admin.datas,
          "insert": QDP.api.admin.add,
          "update": QDP.api.admin.update,
          "delete": QDP.api.admin.remove
        },
        "texts": { "insert": "新增商户信息", "update": "商户信息编辑" },
        "headers": { "edit": { "text": "商户信息" }, "table": { "text": "商户列表" } },
        "actions": { "insert": true, "update": true, "delete": true },
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "id", "primary": true },
          { "name": "priv", "text": "省份", "dict": "schooltype", "edit": true, "filter": true, 'filterindex': 1 },
          { "name": "city", "text": "城市", "dict": "schooltype", "edit": true, "filter": true, 'filterindex': 2 },
          { "name": "tenantCode", "text": "商户编号", "base64": true, "edit": true, "filter": true, 'filterindex': 4 },
          { "name": "tenantName", "text": "商户名称", "base64": true, "edit": true, "filter": true, 'filterindex': 5 },
          { "name": "storeName", "text": "店铺名称", "base64": true, "edit": true, "filter": true, 'filterindex': 7 },
          { "name": "checkName", "text": "签约人", "base64": true, "edit": true, "filter": true, 'filterindex': 3 },
          { "name": "loginName", "text": "商户登录名", "base64": true, "edit": true, "filter": true, 'filterindex': 6 },
          { "name": "checkState", "text": "审核状态", "edit": true, "dict": "checkstate", "filter": true, 'filterindex': 8 },
          { "name": "publishState", "text": "发布状态", "edit": true, "dict": "publishstate", "filter": true, 'filterindex': 9 },
          { "name": "date", "text": "创建时间", "type": "datetime", "filter": "daterange", 'filterindex': 999 },
          { "name": "_action", "text": "操作", 'customAction': info_customAction }
        ]
      };
      QDP.generator.init(options);
    },

    "initProject": function () {
      var options = {
        "apis": {
          "list": QDP.api.admin.datas,
          "insert": QDP.api.admin.add,
          "update": QDP.api.admin.update,
          "delete": QDP.api.admin.remove
        },
        "texts": { "insert": "新增商户信息", "update": "商户信息编辑" },
        "headers": { "edit": { "text": "商户信息" }, "table": { "text": "商户列表" } },
        "actions": { "insert": true, "update": true, "delete": true },
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "id", "primary": true },
          { "name": "tenantCode", "text": "商户编号", "base64": true, "edit": true, "filter": true, 'filterindex': 2 },
          { "name": "tenantName", "text": "商户名称", "base64": true, "edit": true, "filter": true, 'filterindex': 3 },
          { "name": "serviceName", "text": "服务名称", "dict": 'servicename', "edit": true, "filter": true, 'filterindex': 4 },
          { "name": "serviceState", "text": "服务状态", "dict": 'servicestate', "edit": true, "filter": true, 'filterindex': 5 },
          { "name": "serviceType", "text": "服务类别", "dict": 'servicetype', "edit": true, "filter": true, 'filterindex': 6 },
          { "name": "storeName", "text": "服务车型", "base64": true, "edit": true, "filter": true, 'filterindex': 7 },
          { "name": "date", "text": "创建时间", "type": "datetime", "filter": "daterange", 'filterindex': 999 },
          { "name": "vipamount", "text": "折扣券会员价", "base64": true },
          { "name": "aboutamount", "text": "折扣券签约价", "base64": true },
          { "name": "amount", "text": "店铺门市价", "base64": true },
          { "name": "freeamount", "text": "免费券结算价", "base64": true },
          { "name": "realamount", "text": "应结算金额", "base64": true },
          { "name": "checkState", "text": "审核状态", "edit": true, "dict": "checkstate", "filter": true, 'filterindex': 8 },
          { "name": "_action", "text": "操作", 'customAction': project_customAction }
        ]
      };
      QDP.generator.init(options);
    },

    "initHistorySearch": function () {
      var options = {
        "apis": { "list": QDP.api.logs.datas },
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "id", "primary": true },
          { "name": "priv", "text": "省份", "dict": "schooltype" },
          { "name": "city", "text": "城市", "dict": "schooltype" },
          { "name": "storeCode", "text": "商户编号", "base64": true, "filter": true },
          { "name": "storeName", "text": "商户名称", "base64": true, "filter": true },
          { "name": "addr", "text": "商户地址", "base64": true },
          { "name": "point", "text": "商户评分", "base64": true },
          { "name": "telphone", "text": "用户手机号" },
          { "name": "code", "text": "洗车券码", "base64": true },
          { "name": "codestate", "text": "洗车券状态", "dict": "codestate" },
          { "name": "codetype", "text": "券码类型", "dict": "codetype" },
          { "name": "codetype2", "text": "券码类别", "dict": "codetype2" },
          { "name": "channeltype", "text": "渠道号", "dict": "channeltype" },
          { "name": "publishdate", "text": "发券时间", "type": "date" },
          { "name": "outdate", "text": "过期时间", "type": "date" },
          { "name": "usedate", "text": "使用时间", "type": "date" },
          { "name": "carbrand", "text": "车辆品牌" },
          { "name": "cartype", "text": "车辆类型", 'dict': 'cartype' },
          { "name": "carplate", "text": "车牌号码" },
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

  }
});