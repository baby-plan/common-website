define(["QDP"], function (QDP) {
  "use strict";
  var edit_click = function () {
    // dialog.alertText("1");
  };

  var info_customAction = function (td, data, index, powers) {
    // TODO: 权限校验-PARTNER_MANAGEMENT_RESETPASSWORD
    if (powers.indexOf('resetpassword') > -1) {
      QDP.form.appendAction(td, "btn_chgpwd", edit_click, index);
    }
  };
  return {
    define: {
      name: "合作方基本信息管理",
      version: "1.0.0.0",
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
        texts: { insert: "新增合作方信息", update: "合作方信息编辑" },
        headers: { edit: { text: "合作方信息" }, table: { text: "合作方列表" } },
        actions: { insert: true, update: true, delete: true },
        columns: [
          { name: "_index", text: "序号" },
          { name: "id", primary: true },
          { name: "name", text: "合作方名称", base64: true, edit: true, filter: true, filterindex: 1 },
          { name: "partner_addr", text: "合作方地址", base64: true, edit: true },
          { name: "province", text: "负责的省份", multiple: true, dict: "province", edit: true, filter: true, filterindex: 1 },
          { name: "signatory", text: "负责人", novalid: true, base64: true, edit: true, filter: true, filterindex: 2 },
          { name: "partner_phone", text: "联系电话", base64: true, edit: true, filter: true, filterindex: 3 },
          { name: "start_time", text: "生效时间", type: 'date', edit: true },
          { name: "end_time", text: "有效时间", type: 'date', edit: true },
          { name: "publish_status", text: "发布状态", dict: "publishstate", filter: true, filterindex: 4 },
          { name: "audit_status", text: "审核状态", dict: "checkstate", filter: true, filterindex: 5 },
          { name: "date", text: "创建时间", type: "datetime" },
          { name: "begin_date", text: "创建开始时间", type: "date", filter: true, filterindex: 6, grid: false },
          { name: "end_date", text: "创建结束时间", type: "date", filter: true, filterindex: 7, grid: false },
          { name: "description", text: "描述", novalid: true, type: "mulittext", base64: true, edit: true },
          { name: "_action", text: "操作", customAction: info_customAction }
        ]
      };
      QDP.generator.init(options);
    },
    /** 卸载模块 */
    destroy: function () {

    }
  };
});
