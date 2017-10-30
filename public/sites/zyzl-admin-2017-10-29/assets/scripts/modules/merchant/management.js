define(["QDP",
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

  // 执行通过审核操作
  var approval_click = function () {
    var data = QDP.table.getSelect();
    if (data == null) {
      QDP.alert('请选择需要通过审核的商户（仅选择1条记录）');
      return;
    }
    QDP.confirm("确定通过该商户的审批?", function (result) {
      if (!result) {
        return;
      }
      console.debug("MCH_MANAGEMENT_APPROVAL" + ":" + data);
      // var data = QDP.table.getdata(primary);
      // // console.log(JSON.stringify(data));
      // QDP.ajax.get(QDP.api.merchant.publish, { "id": data.id }, function () {
      //   QDP.table.reload();
      // });
    });
  }

  // 执行驳回审核操作
  var reject_click = function () {
    var data = QDP.table.getSelect();
    if (data == null) {
      QDP.alert('请选择需要驳回审核的商户（仅选择1条记录）');
      return;
    }

    QDP.confirm("确定取消该商户的发布状态?", function (result) {
      if (!result) {
        return;
      }
      console.debug("MCH_MANAGEMENT_UNPUBLISH");
      // var data = QDP.table.getdata(primary);
      // // console.log(JSON.stringify(data));
      // QDP.ajax.get(QDP.api.merchant.publish, { "id": data.id }, function () {
      //   QDP.table.reload();
      // });
    });
  }

  // 执行重置密码操作
  var resetpassword_click = function () {
    QDP.form.openWidow({
      'title': '修改商户密码',
      'width': '380px',
      'height': '150px',
      'url': 'views/merchant/reset-password.html',
      'onshow': function (parent) {
        // parent
      }
    });
  }

  var refreshScroll = function () {
    try {
      $(".tab-item-body").slimScroll('destroy');
    } catch (e) {
    }
    var windowHeight = $(window).outerHeight();
    var breadcrumbHeight = $(".content-header").outerHeight();
    var tabheaderHeight = $(".nav-tabs").height();
    var contentHeight = windowHeight - breadcrumbHeight - tabheaderHeight - 30;

    var options = $.extend(QDP.config.options.scroller,
      {
        height: contentHeight,
        // color: "#0786d6"
      });

    $(".tab-item-body").css("height", contentHeight + "px");
    $(".tab-item-body").slimScroll(options);
  }

  /** 初始化编辑界面,若data有值则视为编辑数据,否则视为新增数据
   * @param {object} data 编辑时传入的数据,新增时不需要
   */
  var initEditor = function (data) {
    QDP.generator.setValue(data);
    // refreshScroll();

    // 获取模块配置验证项
    var validatorOption = QDP.generator.validator();

    validatorOption.fields["lnglat"] = {
      validators: {
        notEmpty: {
          message: '经纬度不能为空'
        }
      }
    };

    $(".core-form").bootstrapValidator(validatorOption); // 注册表单验证组件

    $('.btn-save').on('click', function () {
      var validator = $('.core-form').data("bootstrapValidator");
      validator.validate();
      if (!validator.isValid()) {
        return;
      }
      var options = QDP.generator.params();
      QDP.generator.save(options);
    });

    // #region 处理图片上传
    $('#input-photo_url').on('change', function () {
      if ($(this).val() != "") {
        //exec_upload();
        var imgurl;
        if (navigator.userAgent.indexOf("MSIE") >= 1) { // IE 
          imgurl = $(this).value;
        } else if (navigator.userAgent.indexOf("Firefox") > 0) { // Firefox 
          imgurl = window.URL.createObjectURL($(this)[0].files.item(0));
        } else if (navigator.userAgent.indexOf("Chrome") > 0) { // Chrome 
          imgurl = window.URL.createObjectURL($(this)[0].files.item(0));
        }

        $('#photo_url_img').attr('src', imgurl);
        $('#photo_url').val(imgurl);

        if ($(".core-form").data("bootstrapValidator")) {
          $(".core-form")
            .data("bootstrapValidator")
            .updateStatus('photo_url', "NOT_VALIDATED", null)
            .validateField('photo_url');
        }
      }
    });

    $('#photo_url_img')
      .on('click', function () { $("#input-photo_url").click(); });
    $('#photo_url')
      .parent()
      .on('click', function () { $("#input-photo_url").click(); });

    // #endregion// #region 处理图片上传

    // #region 处理地图选点
    require(['module-plugins/map-gaode'], function (plugin) {

      QDP.on("map.submit", function (eventArgs) {
        var lnglat = eventArgs.args;
        if (lnglat && lnglat.lng && lnglat.lat) {
          $("#lnglat").val(lnglat.lng + "," + lnglat.lat);
          var validator = $(".core-form").data("bootstrapValidator");
          if (validator) {
            validator.updateStatus("lnglat", "NOT_VALIDATED", null).validateField("lnglat");
          }
        }
      });
      QDP.on("map.initialized", function () {
        var text = $("#store_addr").val();
        plugin.search(text);
      });

      plugin.init();
      $('#lnglat').parent().on('click', function () {
        plugin.show();
      });

    });
    // #endregion// #region 处理地图选点

    QDP.form.init();

    /* 请求角色详情 */
    if (data) {
      $('#mch_addr').val(QDP.base64.decode(data.mch_addr));
      $('#mch_name').val(QDP.base64.decode(data.mch_name));
      $('#store_name').val(QDP.base64.decode(data.store_name));

      $('#province_code').val(QDP.dict.getText('province', data.province_code));
      $('#city_code').val(QDP.dict.getText('city', data.city_code));
      $('#county_code').val(QDP.dict.getText('county', data.county_code));

      var url = QDP.base64.decode(data.photo_url);
      $('#mch_photourl_img').attr('src', url);
      $('#mch_photourl').val(url);

    }

  }

  var initDetailView = function (data, parent) {
    // refreshScroll();
    $('#province_code', parent).val(QDP.dict.getText('province', data.province_code));
    $('#city_code', parent).val(QDP.dict.getText('city', data.city_code));
    $('#county_code', parent).val(QDP.dict.getText('county', data.county_code));

    $('#mch_name', parent).val(QDP.base64.decode(data.mch_name));
    $('#mch_phone', parent).val(QDP.base64.decode(data.mch_phone));
    $('#store_name', parent).val(QDP.base64.decode(data.store_name));
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
      "name": "商户基本信息管理",
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
        "views": {
          "edit": {
            "page": QDP.api.merchant.editpage,
            "callback": initEditor
          },
          "preview": {
            "mode": "modal",
            "page": QDP.api.merchant.detailPage,
            "callback": initDetailView
          }
        },
        /**
         * 设置权限
         * 
         * JSON结构定义
         * name {string} 功能权限名称
         * class {string} 功能按钮样式名称，对应cfgs的texts
         * action {function} 功能按钮点击事件处理函数
         * controller {function} 判断功能权限是否可用 function(data){return boolean;} 返回结果为true时按钮可用，否则为禁用状态
         */
        "powers": [
          { "name": "submit", "class": "btn-submit", "action": submit_click },
          { "name": "approval", "class": "btn-approval", "action": approval_click, "controller": action_status_controller },
          { "name": "reject", "class": "btn-reject", "action": reject_click, "controller": action_status_controller },
          { "name": "chgpwd", "class": "btn-chgpwd", "action": resetpassword_click },
          { "name": "publish", "class": "btn-publish", "action": publish_click, "controller": action_publish_controller },
          { "name": "unpublish", "class": "btn-unpublish", "action": unpublish_click, "controller": action_unpublish_controller },
        ],
        "texts": { "insert": "新增商户信息", "update": "商户信息编辑" },
        "headers": { "edit": { "text": "商户信息" }, "table": { "text": "商户列表" } },
        "actions": { "insert": true, "update": true, "delete": true },
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "province_code", "text": "省份", "dict": "province", "edit": true, "filter": true, "filterindex": 1 },
          { "name": "city_code", "text": "地市", "dict": "city", "edit": true, "filter": true, "filterindex": 2 },
          { "name": "county_code", "text": "区县", "dict": "county", "edit": true, "filter": true, "filterindex": 2.1 },
          { "name": "id", "text": "商户编号", "filter": true, "filterindex": 3, "primary": true, "display": true },
          { "name": "poi_id", "text": "POIID", "filter": true, "filterindex": 4 },
          { "name": "mch_name", "text": "商户名称", "edit": true, "filter": true, "filterindex": 5 },
          { "name": "store_name", "text": "店铺名称", "edit": true, "filter": true, "filterindex": 6 },
          { "name": "user_name", "text": "用户名", "edit": true },
          { "name": "password", "text": "密码", "edit": true, "display": false },
          { "name": "link_man", "text": "联系人", "edit": true },
          { "name": "store_phone", "text": "联系电话", "edit": true },

          { "name": "legal_person", "text": "法人代表", "edit": true, "display": false },
          { "name": "lane_number", "text": "车道数", "novalid": true, "edit": true, "display": false },
          { "name": "mch_scale", "text": "商家规模", "label": "人", "novalid": true, "edit": true, "display": false },
          { "name": "mch_is_chain", "text": "是否连锁", "dict": "ischain", "novalid": true, "edit": true, "display": false },
          { "name": "mch_chain_count", "text": "连锁店数量", "novalid": true, "edit": true, "display": false },
          { "name": "open_time", "text": "开业时间", "novalid": true, "type": "date", "edit": true, "display": false },
          { "name": "business_time", "text": "营业时间", "dict": "businesstime", "edit": true, "display": false },
          { "name": "master_business", "text": "主营业务", "novalid": true, "edit": true, "display": false },
          { "name": "recommend_business", "text": "推荐业务", "novalid": true, "edit": true, "display": false },
          { "name": "slave_business", "text": "兼营业务", "novalid": true, "edit": true, "display": false },
          { "name": "business_area", "text": "营业面积", "label": "平方米", "novalid": true, "edit": true, "display": false },

          { "name": "business_volumn", "text": "日均营业额", "novalid": true, "edit": true, "display": false },
          { "name": "per_person_amount", "text": "人均消费额", "novalid": true, "edit": true, "display": false },
          { "name": "signatory_no", "text": "签约人编号", "novalid": true, "edit": true, "display": false },
          { "name": "signatory", "text": "签约人", "edit": true, "filter": true, "filterindex": 7 },
          { "name": "signatory_phone", "text": "签约人电话", "novalid": true, "edit": true, "display": false },
          { "name": "contract_time", "text": "合同签约时间", "edit": true, "display": false },
          { "name": "contract_no", "text": "合同编号", "novalid": true, "type": "date", "edit": true, "display": false },

          { "name": "start_time", "text": "合同开始时间", "novalid": true, "type": "date", "edit": true, "display": false },
          { "name": "end_time", "text": "合同到期时间", "type": "date", "edit": true, "display": false },

          { "name": "contract_time", "text": "合同签约时间", "edit": true, "display": false },

          { "name": "store_addr", "text": "详细地址", "edit": true, "overflow": 15 },
          { "name": "location_lon", "text": "经度", "edit": true, "display": false },
          { "name": "location_lat", "text": "纬度", "edit": true, "display": false },

          { "name": "mch_level", "text": "商家级别", "novalid": true, "edit": true },

          { "name": "audit_status", "text": "商户审核状态", "dict": "audit_status", "filter": true, "filterindex": 9 },
          { "name": "publish_status", "text": "商户发布状态", "dict": "publish_status", "filter": true, "filterindex": 10 },
          { "name": "online_status", "text": "商户上线状态", "dict": "online_status", "filter": true, "filterindex": 11 },
          { "name": "description", "text": "商户描述", "novalid": true, "type": "mulittext", "edit": true, "display": false },
          { "name": "photo_url", "text": "商户照片", "type": "image", "edit": true, "display": false },
          { "name": "creator", "text": "创建人" },
          { "name": "create_time", "text": "创建时间", "type": "datetime" },
          { "name": "begin_date", "text": "开始时间", "type": "date", "filter": true, "filterindex": 12, "display": false },
          { "name": "end_date", "text": "结束时间", "type": "date", "filter": true, "filterindex": 13, "display": false },
        ]
      };

      QDP.generator.init(options);
    },

    /** 卸载模块 */
    "destroy": function () {
    }

  };

});