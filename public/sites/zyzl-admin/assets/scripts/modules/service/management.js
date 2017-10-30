define(["QDP"], function (QDP) {
  "use strict";

  /** 初始化商户列表
   * @param {JSON} filter
   * @param {JSON} column
   * @param {string} value
   */
  var initMerchant = function (filter, column, value) {
    $("<select/>")
      .attr("id", filter.name)
      .addClass("form-control")
      .appendTo(column);
    QDP.form.initCache({
      "api": QDP.api.merchant.alldatasapi,
      "target": $("#" + filter.name),
      "valuefn": function (index, item) { return item.id; },
      "textfn": function (index, item) { return QDP.base64.decode(item.mch_name); },
      "done": function () { $("#" + filter.name).attr("data-value", value); }
    });
  }
  return {
    define: {
      name: "商户服务项目管理",
      version: "1.0.0.0",
      copyright: " Copyright 2017-2027 WangXin nvlbs,Inc."
    },
    /** 加载模块 */
    "init": function () {
      var options = {
        "apis": {
          "list": QDP.api.service.datas,
          "insert": QDP.api.service.add,
          "update": QDP.api.service.update,
          "delete": QDP.api.service.remove
        },
        "helps": {
          "list": QDP.config.tooltip.compute,
          "insert": QDP.config.tooltip.compute,
          "update": QDP.config.tooltip.compute
        },
        "texts": { insert: "新增商户服务项目", update: "编辑商户服务项目" },
        "headers": { edit: { text: "商户服务项目" }, table: { text: "商户服务项目列表" } },
        "actions": { insert: true, update: true, delete: true },
        "columns": [
          { "name": "_index", text: "序号" },
          { "name": "id", primary: true },
          { "name": "mch", text: "商户", "type": 'select-merchant', 'display': false, edit: true },
          { "name": "mch_id", text: "商户编号", "custom": initMerchant, filter: true, filterindex: 1 },
          { "name": "poi_id", text: "POIID", filter: true, filterindex: 2 },
          { "name": "mch_name", text: "商户名称", filter: true, filterindex: 3 },
          // { name: "name", text: "服务名称", dict: 'servicename', filter: true, filterindex: 4 },
          { "name": "service_type", text: "服务类别", dict: 'servicetype', edit: true, filter: true, filterindex: 6 },
          { "name": "car_type", text: "服务车型", dict: 'cartype', edit: true, filter: true, filterindex: 7 },
          {
            "name": "contract_discount", text: "折扣券签约价",
            regex: /^((?:[0-9]\d*))(?:\.\d{1,2})?$/, message: '不是有效的价格类型，请输入正数，最多保留两位小数',
            edit: true, label: '元'
          },
          {
            "name": "price", text: "店铺门市价",
            regex: /^((?:[0-9]\d*))(?:\.\d{1,2})?$/, message: '不是有效的价格类型，请输入正数，最多保留两位小数',
            edit: true, label: '元'
          },
          {
            name: "free_discount", text: "免费券结算价",
            regex: /^((?:[0-9]\d*))(?:\.\d{1,2})?$/, message: '不是有效的价格类型，请输入正数，最多保留两位小数',
            edit: true, label: '元'
          },
          { name: "status", text: "服务状态", dict: 'servicestate', filter: true, filterindex: 5 },
          { name: "publish_status", text: "发布状态", dict: "publish_status" },
          // { name: "online_status", text: "上线状态", dict: "online_status" },
          // { name: "creator", text: "创建人"},
          { name: "create_time", text: "创建时间", type: "datetime" },
          { name: "begin_date", text: "开始时间", type: "date", filter: true, filterindex: 8, display: false },
          { name: "end_date", text: "结束时间", type: "date", filter: true, filterindex: 9, display: false }
        ]
      };
      QDP.generator.build(options);
    },
    /** 卸载模块 */
    "destroy": function () {

    }
  };
});
