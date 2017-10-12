define(["QDP"], function (QDP) {
  "use strict";

  var edit_click = function () {
    // dialog.alertText("1");
  };

  // 执行发布商户信息操作
  var onPublish = function () {
    var primary = $(this).data("args");
    QDP.confirm("确定发布该商户?", function (result) {
      if (!result) {
        return;
      }
      console.debug("MCH_MANAGEMENT_PUBLISH");
      var data = QDP.generator.getdata(primary);
      // console.log(JSON.stringify(data));
      QDP.ajax.get(QDP.api.merchant.publish, { "id": data.id }, function () {
        QDP.table.reload();
      });
    });
  }

  //  执行查看商户信息操作
  var onLook = function () {

    if ($(this).attr('disabled')) {
      return;
    }
    var selector = $('table tr[class="selected"]');
    if (selector.length == 1) {
      var index = selector.data('id');
      var data = QDP.table.getdata(index);
      // 打开窗口后回调函数:用于初始化页面内容
      var openviewCallback = function () {
        var area = QDP.dict.getText('province', data.province);
        area = area + ' - ' + QDP.dict.getText('city', data.city);
        area = area + ' - ' + QDP.dict.getText('county', data.county);
        $('#province_code').text(area);

        $('#mch_name').text(QDP.base64.decode(data.mch_name));
        $('#store_name').text(QDP.base64.decode(data.store_name));
      };

      QDP.form.openview({
        map: true,
        title: QDP.base64.decode(data.mch_name),
        url: QDP.api.merchant.editpage,
        callback: openviewCallback
      });
    }

  }

  /** 处理商户管理相关功能可用性及可见度ƒ */
  var table_select_handler = () => {
    var selector = $('.table>tbody>tr[class="selected"]');
    if (selector.length == 1) {
      var index = selector.data('id');
      var data = QDP.table.getdata(index);
      if (data) {
        if (data.audit_status == 0) {
          $(".btn_check").removeAttr('disabled');
        }
        if (data.publish_status == 0) {
          $(".btn_publish").removeAttr('disabled');
        }
        if (data.publish_status == 1) {
          $(".btn_unpublish").removeAttr('disabled');
        }
      }
      $(".btn_chgpwd").removeAttr('disabled');

    } else if (selector.length == 0) {
      $(".btn_check").attr('disabled', "true");
      $(".btn_chgpwd").attr('disabled', "true");
      $(".btn_publish").attr('disabled', "true");
      $(".btn_unpublish").attr('disabled', "true");
    } else {
      $(".btn_check").attr('disabled', "true");
      $(".btn_chgpwd").attr('disabled', "true");
      $(".btn_publish").removeAttr('disabled');
      $(".btn_unpublish").removeAttr('disabled');
    }
  }

  let locationEvents = {
    "init": function () {
      return $("#mch_addr").val();
    },
    "get": function (data, eventArgs) {
      data.location_lon = eventArgs.lng * 1000000;
      data.location_lat = eventArgs.lat * 1000000;
    },
    "set": function (data) {
      if (data.location_lon == 0 || data.location_lat == 0) {
        return undefined;
      }
      return {
        lng: data.location_lon / 1000000,
        lat: data.location_lat / 1000000
      }
    }
  };

  var imageEvents = {
    "get": function (data, eventArgs) {
      data.photo_url = QDP.base64.encode(eventArgs.url);
    },
    "set": function () {

    }
  }

  var initAction = () => {
    var powers = QDP.config.pageOptions.powers;
    var actionContainer = $('.view-action');
    // TODO: 权限校验-MCH_MANAGEMENT_CHECH
    if (powers.indexOf('check') > -1) {
      QDP.form.appendAction(actionContainer, "btn_check", edit_click);
    }
    // TODO: 权限校验-MCH_MANAGEMENT_PUBLISH
    if (powers.indexOf('publish') > -1) {
      QDP.form.appendAction(actionContainer, "btn_publish", onPublish);
    }
    // TODO: 权限校验-MCH_MANAGEMENT_UNPUBLISH
    if (powers.indexOf('unpublish') > -1) {
      QDP.form.appendAction(actionContainer, "btn_unpublish", edit_click);
    }
    // TODO: 权限校验-MCH_MANAGEMENT_RESETPASSWORD
    if (powers.indexOf('resetpassword') > -1) {
      QDP.form.appendAction(actionContainer, "btn_chgpwd", edit_click);
    }

    $('.btn_look').on('click', onLook);
    table_select_handler();
  }

  /** 初始化编辑界面,若data有值则视为编辑数据,否则视为新增数据
   * @param {object} data 编辑时传入的数据,新增时不需要
   */
  var initEditor = function (data) {

    QDP.form.init();
    /* 请求角色详情 */
    if (data) {
    }

  }

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
          list: QDP.api.merchant.datas,
          insert: QDP.api.merchant.add,
          update: QDP.api.merchant.update,
          delete: QDP.api.merchant.remove
        },
        "editor": {
          "page": QDP.api.merchant.editpage,
          "callback": initEditor
        },
        texts: { insert: "新增商户信息", update: "商户信息编辑" },
        headers: { edit: { text: "商户信息" }, table: { text: "商户列表" } },
        actions: { insert: true, update: true, delete: true },
        columns: [
          { name: "_index", text: "序号" },
          { name: "province_code", text: "省份", dict: "province", edit: true, filter: true, filterindex: 1 },
          { name: "city_code", text: "城市", change: "province_code", dict: "city", edit: true, filter: true, filterindex: 2 },
          { name: "county_code", text: "区县", dict: "county", edit: true, filter: true, filterindex: 2.1 },
          { name: "id", text: "商户编号", filter: true, filterindex: 3, primary: true, display: true },
          { name: "poi_id", text: "POIID", base64: true, filter: true, filterindex: 4 },
          { name: "mch_name", text: "商户名称", base64: true, edit: true, filter: true, filterindex: 5 },
          { name: "store_name", text: "店铺名称", base64: true, edit: true, filter: true, filterindex: 6 },
          { name: "mch_addr", text: "商户地址", novalid: true, base64: true, edit: true },
          { name: "location", text: "地图位置", events: locationEvents, type: "map", edit: true, grid: false },
          {
            name: "mch_phone", text: "商户登录名", validtype: 'phone', message: '商户登录名必须为手机号码',
            base64: true, edit: true, filter: true, filterindex: 8
          },
          { name: "signatory", text: "签约人", novalid: true, base64: true, edit: true, filter: true, filterindex: 7 },
          { name: "audit_status", text: "商户审核状态", dict: "audit_status", filter: true, filterindex: 9 },
          { name: "publish_status", text: "商户发布状态", dict: "publish_status", filter: true, filterindex: 10 },
          { name: "online_status", text: "商户上线状态", dict: "online_status", filter: true, filterindex: 11 },
          { name: "description", text: "商户描述", novalid: true, type: "mulittext", base64: true, edit: true },
          { name: "photo_url", text: "封面", events: imageEvents, type: "image", edit: true, base64: true },
          { name: "creator", text: "创建人", base64: true },
          { name: "create_time", text: "创建时间", type: "datetime" },
          { name: "begin_date", text: "开始时间", type: "date", filter: true, filterindex: 12, grid: false },
          { name: "end_date", text: "结束时间", type: "date", filter: true, filterindex: 13, grid: false }
        ]
      };
      QDP.generator.init(options);
      initAction();
      // EVENT-ON:table.selected
      QDP.event.on('table.selected', table_select_handler);

    },

    /** 卸载模块 */
    destroy: function () {
      // EVENT-OFF:table.selected
      QDP.event.off('table.selected', table_select_handler);
    }

  };
});