define(["QDP"
], function (QDP) {
  "use strict";

  // 执行提交审核操作
  var submit_click = function () {
    var data = QDP.table.getSelect();
    if (data == null) {
      QDP.alert('请选择需要提交审核的商户（仅选择1条记录）');
      return;
    }

    QDP.confirm("确定提交审核该商户?", function (result) {
      if (!result) {
        return;
      }
      console.debug("MCH_MANAGEMENT_SUBMIT");
      // var data = QDP.table.getdata(primary);
      // // console.log(JSON.stringify(data));
      // QDP.ajax.get(QDP.api.merchant.publish, { "id": data.id }, function () {
      //   QDP.table.reload();
      // });
    });
  }

  // 执行发布操作
  var publish_click = function () {
    var data = QDP.table.getSelect();
    if (data == null) {
      QDP.alert('请选择需要发布的商户（仅选择1条记录）');
      return;
    }

    QDP.confirm("确定发布该商户?", function (result) {
      if (!result) {
        return;
      }
      console.debug("MCH_MANAGEMENT_PUBLISH");
      // var data = QDP.table.getdata(primary);
      // // console.log(JSON.stringify(data));
      // QDP.ajax.get(QDP.api.merchant.publish, { "id": data.id }, function () {
      //   QDP.table.reload();
      // });
    });
  }

  // 执行取消发布操作
  var unpublish_click = function () {
    var data = QDP.table.getSelect();
    QDP.confirm("确定取消该商户的发布状态?", function (result) {
      if (!result) {
        return;
      }
      console.debug('MCH_MANAGEMENT_UNPUBLISH' + ":" + data);
      // var data = QDP.table.getdata(primary);
      // // console.log(JSON.stringify(data));
      // QDP.ajax.get(QDP.api.merchant.publish, { "id": data.id }, function () {
      //   QDP.table.reload();
      // });
    });
  }

  // 执行审核操作
  var audit_click = function () {

    var data = QDP.table.getSelect();
    if (data == null) {
      QDP.alert('请选择需要提交审核的商户（仅选择1条记录）');
      return;
    }
    QDP.form.openWidow({
      'title': '审核商户信息',
      'width': '800px',
      'url': 'views/business/audit.html',
      'onshow': function (parent) {
        // parent
      }
    });
  }
  /** 初始化商户列表
   * @param {JSON} filter
   * @param {JSON} column
   * @param {string} value
   */
  var initMerchant = function (filter, column, value) {
    $("<select/>")
      .attr("id", filter.name)
      .addClass("form-control")
      .attr("data-mulit", true)
      .appendTo(column);
    QDP.form.initCache({
      "api": QDP.api.merchant.alldatasapi,
      "target": $("#" + filter.name),
      "valuefn": function (index, item) { return item.id; },
      "textfn": function (index, item) { return item.mch_name; },
      "done": function () { $("#" + filter.name).attr("data-value", value); }
    });
  }

  var action_status_controller = function (data) {
    return data.audit_status == 0;
  }
  var action_publish_controller = function (data) {
    return data.publish_status == 0 && data.audit_status == 1;
  }
  var action_unpublish_controller = function (data) {
    return data.publish_status == 1;
  }

  return {
    "define": {
      "name": "商户公告发布管理",
      version: "1.0.0.0",
      copyright: " Copyright 2017-2027 WangXin nvlbs,Inc."
    },

    /** 加载模块 */
    "init": function () {
      var options = {
        "apis": {
          "list": QDP.api.merchant.datas,
          "insert": QDP.api.merchant.add,
          "update": QDP.api.merchant.update,
          "delete": QDP.api.merchant.remove
        },
        "texts": { insert: "新增商户公告信息", update: "商户公告信息编辑" },
        "actions": { insert: true, update: true, delete: true },
        "powers": [
          { "name": "submit", "class": "btn-submit", "action": submit_click },
          { "name": "audit", "class": "btn-audit", "action": audit_click, "controller": action_status_controller },
          { "name": "publish", "class": "btn-publish", "action": publish_click, "controller": action_publish_controller },
          { "name": "unpublish", "class": "btn-unpublish", "action": unpublish_click, "controller": action_unpublish_controller },
        ],
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "id", "text": "公告编号", "primary": true, "display": true },
          { "name": "province_code", "text": "省份", novalid: true, "dict": "province", "multiple": true, "edit": true, "filter": true, "filterindex": 1 },
          { "name": "mch_id", "text": "商户编号", "filter": true, "filterindex": 3 },
          { "name": "poi_id", "text": "POIID", "filter": true, "filterindex": 4 },
          { "name": "mch_name", "text": "商户名称", "filter": true, "filterindex": 5 },
          { "name": "mch_id", "text": "商户", novalid: true, "custom": initMerchant, "edit": true, display: false },
          { "name": "store_name", "text": "公告标题", "edit": true, "filter": true, "filterindex": 6 },
          { "name": "user_name", "text": "公告内容", "type": "mulittext", "edit": true },

          { "name": "publish_start_time", "text": "公告开始时间", "type": "datetime", "edit": true },
          { "name": "publish_end_time", "text": "公告结束时间", "type": "datetime", "edit": true },

          { "name": "audit_status", "text": "审核状态", "dict": "audit_status", "filter": true, "filterindex": 9 },
          { "name": "publish_status", "text": "发布状态", "dict": "publish_status", "filter": true, "filterindex": 10 },
          { "name": "creator", "text": "创建人" },
          { "name": "create_time", "text": "创建时间", "type": "datetime" },
          { "name": "begin_date", "text": "开始时间", "type": "date", "filter": true, "filterindex": 12, "display": false },
          { "name": "end_date", "text": "结束时间", "type": "date", "filter": true, "filterindex": 13, "display": false },
        ]
      };
      QDP.generator.build(options);
    },

    /** 卸载模块 */
    "destroy": function () {
    }

  };

});