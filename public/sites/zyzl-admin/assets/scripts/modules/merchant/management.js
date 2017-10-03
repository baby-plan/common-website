define(["QDP"], function (QDP) {
  "use strict";

  var edit_click = function () {
    // dialog.alertText("1");
  };

  var info_customAction = function (td, data, index,powers) {
    // TODO: 权限校验-MCH_MANAGEMENT_CHECH
    if (powers.indexOf('check') > -1) {
      QDP.cell.addAction(td, "btn_check", index, edit_click);
    }
    // TODO: 权限校验-MCH_MANAGEMENT_PUBLISH
    if (powers.indexOf('publish') > -1) {
      QDP.cell.addAction(td, "btn_publish", index, edit_click);
    }
    // TODO: 权限校验-MCH_MANAGEMENT_UNPUBLISH
    if (powers.indexOf('unpublish') > -1) {
      QDP.cell.addAction(td, "btn_unpublish", index, edit_click);
    }

    QDP.cell.addAction(td, "btn_look", index, edit_click);

    // TODO: 权限校验-MCH_MANAGEMENT_RESETPASSWORD
    if (powers.indexOf('resetpassword') > -1) {
      QDP.cell.addAction(td, "btn_chgpwd", index, edit_click);
    }
  };
  return {
    define: {
      name: "商户基本信息管理",
      version: "1.0.0.0",
      copyright: " Copyright 2017-2027 WangXin nvlbs,Inc."
    },

    /** 加载模块 */
    init: function () {
      var options = {
        apis: {
          list: QDP.api.admin.datas,
          insert: QDP.api.admin.add,
          update: QDP.api.admin.update,
          delete: QDP.api.admin.remove
        },
        texts: { insert: "新增商户信息", update: "商户信息编辑" },
        headers: { edit: { text: "商户信息" }, table: { text: "商户列表" } },
        actions: { insert: true, update: true, delete: true },
        columns: [
          { name: "_index", text: "序号" },
          { name: "id", primary: true },
          { name: "province_code", text: "省份", dict: "province", edit: true, filter: true, filterindex: 1 },
          { name: "city_code", text: "城市", change: "province_code", dict: "city", edit: true, filter: true, filterindex: 2 },
          { name: "county_code", text: "区县", dict: "county", edit: true, filter: true, filterindex: 2.1 },
          { name: "mch_id", text: "商户编号", base64: true, filter: true, filterindex: 3 },
          { name: "poi_id", text: "POIID", base64: true, filter: true, filterindex: 4 },
          { name: "mch_name", text: "商户名称", base64: true, edit: true, filter: true, filterindex: 5 },
          { name: "store_name", text: "店铺名称", base64: true, edit: true, filter: true, filterindex: 6 },
          { name: "mch_address", text: "商户地址", novalid: true, base64: true, edit: true },
          { name: "lnglat", text: "地图位置", type: "map", edit: true, grid: false },
          { name: "loginName", text: "商户登录名", validtype: 'phone', message: '商户登录名必须为手机号码',
           base64: true, edit: true, filter: true, filterindex: 8 },
          { name: "signatory", text: "签约人", novalid: true, base64: true, edit: true, filter: true, filterindex: 7 },
          { name: "audit_status", text: "商户审核状态", dict: "audit_status", filter: true, filterindex: 9 },
          { name: "publish_status", text: "商户发布状态", dict: "publish_status", filter: true, filterindex: 10 },
          { name: "online_status", text: "商户上线状态", dict: "online_status", filter: true, filterindex: 11 },
          { name: "description", text: "商户描述", novalid: true, type: "mulittext", base64: true, edit: true },
          { name: "photo_url", text: "封面", type: "image", edit: true },
          { name: "creator", text: "创建人", base64: true },
          { name: "create_time", text: "创建时间", type: "datetime" },
          { name: "begin_date", text: "开始时间", type: "date", filter: true, filterindex: 12, grid: false },
          { name: "end_date", text: "结束时间", type: "date", filter: true, filterindex: 13, grid: false },
          { name: "_action", text: "操作", customAction: info_customAction }
        ]
      };
      QDP.generator.init(options);

    },
    /** 卸载模块 */
    destroy: function () {
      // $(document).off("change");
    }
  };
});