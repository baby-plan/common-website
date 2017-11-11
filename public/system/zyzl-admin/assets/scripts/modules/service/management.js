define(["QDP"], function (QDP) {
  "use strict";

  // 执行提交审核操作
  var submit_click = function () {
    var data = QDP.table.getSelect();
    if (data == null) {
      QDP.alert('请选择需要提交审核的商户服务项目（仅选择1条记录）');
      return;
    }

    QDP.confirm("确定提交审核商户服务项目?", function (result) {
      if (!result) {
        return;
      }
      console.debug("MCH_MANAGEMENT_SERVICE_SUBMIT");
    });
  }
  // 执行审核操作
  var audit_click = function () {

    var data = QDP.table.getSelect();
    if (data == null) {
      QDP.alert('请选择需要提交审核的商户服务项目（仅选择1条记录）');
      return;
    }
    QDP.form.openWidow({
      'title': '审核商户服务项目信息',
      'width': '800px',
      'height': '500px',
      'url': 'views/business/service-audit.html',
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
      "name": "商户服务项目管理",
      "version": "1.0.1.0",
      "copyright": " Copyright 2017-2027 WangXin nvlbs,Inc."
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
        "texts": { "insert": "新增商户服务项目", "update": "编辑商户服务项目" },
        "actions": { "insert": true, "update": true },
        "views": {
          "preview": {
            "title": "查看商户服务项目详情",
            "height": "450px"
          }
        },
        "powers": [
          { "name": "submit", "class": "btn-submit", "action": submit_click },
          { "name": "audit", "class": "btn-audit", "action": audit_click, "controller": action_status_controller },
        ],
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "id", "primary": true },
          { "name": "mch", "text": "商户", "type": 'select-merchant', 'display': false, "edit": true },
          { "name": "mch_id", "text": "商户编号", "filter": true, "filterindex": 1 },
          { "name": "poi_id", "text": "POIID", "filter": true, "filterindex": 2 },
          { "name": "mch_name", "text": "商户名称", "filter": true, "filterindex": 3 },
          {
            "name": "service_type", "text": "服务类别", "dict": 'servicetype', "edit": true,
            "filter": true, "filterindex": 6
          },
          {
            "name": "car_type", "text": "服务车型", "dict": 'cartype', "edit": true,
            "filter": true, "filterindex": 7
          },
          {
            "name": "contract_discount", "text": "折扣券签约价",
            "edit": true, "label": '元',
            "regex": /^((?:[0-9]\d*))(?:\.\d{1,2})?$/,
            "message": '不是有效的价格类型，请输入正数，最多保留两位小数',
          },
          {
            "name": "price", "text": "店铺门市价",
            "edit": true, "label": '元',
            "regex": /^((?:[0-9]\d*))(?:\.\d{1,2})?$/,
            "message": '不是有效的价格类型，请输入正数，最多保留两位小数',
          },
          {
            "name": "free_discount", "text": "免费券结算价",
            "edit": true, "label": '元',
            "regex": /^((?:[0-9]\d*))(?:\.\d{1,2})?$/,
            "message": '不是有效的价格类型，请输入正数，最多保留两位小数',
          },
          {
            "name": "status", "text": "服务状态", "dict": 'servicestate',
            "filter": true, "filterindex": 5
          },
          { "name": "publish_status", "text": "审核状态", "dict": "audit_status" },
          { "name": "creator", "text": "创建人" },
          { "name": "create_time", "text": "创建时间", "type": "datetime" },
          {
            "name": "begin_date", "text": "开始时间", "type": "date",
            "filter": true, "filterindex": 8, "display": false
          },
          {
            "name": "end_date", "text": "结束时间", "type": "date",
            "filter": true, "filterindex": 9, "display": false
          }
        ]
      };
      QDP.generator.build(options);
    },
    /** 卸载模块 */
    "destroy": function () {

    }
  };
});
