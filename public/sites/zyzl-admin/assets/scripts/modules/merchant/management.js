define(["QDP"
], function (QDP) {

  "use strict";
  var edit_click = function () {
    // dialog.alertText("1");
    if ($(this).attr('disabled')) {
      return;
    }
    var data = QDP.table.getSelect();
    if (data == null) {
      QDP.alertText('请选择需要查看的记录（仅选择1条记录）');
      return;
    }

    // 打开窗口后回调函数:用于初始化页面内容
    var openviewCallback = function (parent) {
      $('#province_code', parent).val(QDP.dict.getText('province', data.province));
      $('#city_code', parent).val(QDP.dict.getText('city', data.city));
      $('#county_code', parent).val(QDP.dict.getText('county', data.county));

      $('#mch_name', parent).val(QDP.base64.decode(data.mch_name));
      $('#mch_phone', parent).val(QDP.base64.decode(data.mch_phone));
      $('#store_name', parent).val(QDP.base64.decode(data.store_name));
    };

    QDP.form.openWidow({
      'title': QDP.base64.decode(data.mch_name),
      'url': QDP.api.merchant.detailPage,
      'onshow': openviewCallback
    });
  };

  // 执行发布商户信息操作
  var onPublish = function () {
    if ($(this).attr('disabled')) {
      return;
    }
    var data = QDP.table.getSelect();
    if (data == null) {
      QDP.alertText('请选择需要发布的商户（仅选择1条记录）');
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

  // var onCheck = function () {

  // }

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
      $(".btn_publish").attr('disabled', "true");
      $(".btn_unpublish").attr('disabled', "true");
    }
  }

  var initAction = () => {
    var powers = QDP.config.pageOptions.powers;
    var actionContainer = $('.view-action');
    // TODO: 权限校验-MCH_MANAGEMENT_APPROVAL
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

    table_select_handler();
  }

  /** 初始化编辑界面,若data有值则视为编辑数据,否则视为新增数据
   * @param {object} data 编辑时传入的数据,新增时不需要
   */
  var initEditor = function (data) {
    QDP.form.init();

    // 获取模块配置验证项
    var validatorOption = QDP.generator.validator();

    $("#role-form").bootstrapValidator(validatorOption); // 注册表单验证组件

    $('.btn_save').on('click', function () {
      var validator = $('#role-form').data("bootstrapValidator");
      validator.validate();
      if (!validator.isValid()) {
        return;
      }
      var options = QDP.generator.params();
      QDP.generator.save(options);
    });

    // #region 处理图片上传
    $('#input-mch_photourl').on('change', function () {
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

        $('#mch_photourl_img').attr('src', imgurl);
        $('#mch_photourl').val(imgurl);

        if ($("#role-form").data("bootstrapValidator")) {
          $("#role-form")
            .data("bootstrapValidator")
            .updateStatus('mch_photourl', "NOT_VALIDATED", null)
            .validateField('mch_photourl');
        }
      }
    });

    $('#mch_photourl_img')
      // .css('minHeight', '200px')
      .on('click', function () { $("#input-mch_photourl").click(); });
    $('#mch_photourl')
      .parent()
      .on('click', function () { $("#input-mch_photourl").click(); });

    // #endregion// #region 处理图片上传

    // #region 处理地图选点

    require([
      'http://webapi.amap.com/maps?v=1.3&key=f0948ced2976d1bcc654eff99d796a32&plugin=AMap.Autocomplete',
      'http://cache.amap.com/lbs/static/addToolbar.js'
    ], () => {

      var placeSearch, eventArgs;
      var showMapContainer = function () {
        var marker, map = new AMap.Map('map-main', {
          resizeEnable: true,
        });

        if (eventArgs) {
          if (eventArgs && eventArgs.lng && eventArgs.lat) {
            marker = new AMap.Marker({
              icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
              position: [eventArgs.lng, eventArgs.lat]
            });
            marker.setMap(map);
            map.setZoomAndCenter(15, [eventArgs.lng, eventArgs.lat]);
            $('#btn-ok').attr('class', 'btn btn-success').attr('disabled', false);
          } else {
            $('#btn-ok').attr('class', 'btn btn-default').attr('disabled', true);
          }
        }

        //为地图注册click事件获取鼠标点击出的经纬度坐标
        map.on('click', function (e) {
          if (marker) {
            marker.setMap(null);
            marker = null;
          }

          if (placeSearch) {
            placeSearch.clear();
          }

          marker = new AMap.Marker({
            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
            position: [e.lnglat.getLng(), e.lnglat.getLat()]
          });
          marker.setMap(map);

          eventArgs = {
            lng: e.lnglat.getLng(),
            lat: e.lnglat.getLat()
          };
          $('#btn-ok').attr('class', 'btn btn-success').attr('disabled', false);
        });

        $(".map-search").on("click", function () {
          var text = $('#map-input').val();
          //关键字查询
          if (placeSearch) {
            placeSearch.search(text);
          }
        });

        //注册监听，当选中某条记录时会触发
        AMap.event.addListener(new AMap.Autocomplete({ input: "map-input" }), "select", function (e) {
          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name);  //关键字查询查询
        });

        AMap.service(["AMap.PlaceSearch"], function () {
          placeSearch = new AMap.PlaceSearch({ //构造地点查询类
            pageSize: 5,
            pageIndex: 1,
            map: map,
            panel: 'map-input-panel'
          });

          var searchClick = function (e) {
            if (marker) {
              marker.setMap(null);
              marker = null;
            }
            if (e.data && e.data.location) {
              map.setZoom(15);
              map.setCenter(e.data.location);
              eventArgs = {
                lng: e.data.location.lng,
                lat: e.data.location.lat
              };
              $('#btn-ok').attr('class', 'btn btn-success').attr('disabled', false);
            }
          }

          AMap.event.addListener(placeSearch, "markerClick", searchClick);
          AMap.event.addListener(placeSearch, "listElementClick", searchClick);

          var mch_addr = $("#mch_addr").val();
          if (mch_addr) {
            $('#map-input').val(mch_addr);
            if (placeSearch) {
              placeSearch.search(mch_addr);
            }
          }
        });

      }
      $("#map-container .modal-dialog").width($(window).width() - 50);
      $("#map-container .modal-body").height($(window).height() - 220);
      // 地图容器中的确定按钮点击事件处理函数
      $("#map #btn-ok").on('click', function () {
        $("#lnglat").val(eventArgs.lng + "," + eventArgs.lat);
        var validator = $("#role-form").data("bootstrapValidator");
        if (validator) {
          validator.updateStatus("lnglat", "NOT_VALIDATED", null).validateField("lnglat");
        }
        $('#map').modal('hide');
      });

      $('#lnglat').parent()
        .on('click', function () {
          $('.amap-sug-result').remove();
          $('#map').modal({ keyboard: false });
          //添加延时加载。解决问题
          setTimeout(showMapContainer, 300);
        });

    });
    // #endregion// #region 处理地图选点

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
    $('#province_code', parent).val(QDP.dict.getText('province', data.province_code));
    $('#city_code', parent).val(QDP.dict.getText('city', data.city_code));
    $('#county_code', parent).val(QDP.dict.getText('county', data.county_code));

    $('#mch_name', parent).val(QDP.base64.decode(data.mch_name));
    $('#mch_phone', parent).val(QDP.base64.decode(data.mch_phone));
    $('#store_name', parent).val(QDP.base64.decode(data.store_name));
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
        "detailor": {
          "mode": "modal",
          "page": QDP.api.merchant.detailPage,
          "callback": initDetailView
        },
        texts: { insert: "新增商户信息", update: "商户信息编辑" },
        headers: { edit: { text: "商户信息" }, table: { text: "商户列表" } },
        actions: { insert: true, update: true, delete: true },
        columns: [
          { name: "_index", text: "序号" },
          { name: "province_code", text: "省份", dict: "province", edit: true, filter: true, filterindex: 1 },
          { name: "city_code", text: "地市", change: "province_code", dict: "city", edit: true, filter: true, filterindex: 2 },
          { name: "county_code", text: "区县", dict: "county", edit: true, filter: true, filterindex: 2.1 },
          { name: "id", text: "商户编号", filter: true, filterindex: 3, primary: true, display: true },
          { name: "poi_id", text: "POIID", base64: true, filter: true, filterindex: 4 },
          { name: "mch_name", text: "商户名称", base64: true, edit: true, filter: true, filterindex: 5 },
          { name: "store_name", text: "店铺名称", base64: true, edit: true, filter: true, filterindex: 6 },
          { name: "mch_addr", text: "商户地址", base64: true, edit: true, overflow: 5 },
          {
            name: "mch_phone", text: "商户登录名", validtype: 'phone', message: '商户登录名必须为手机号码',
            base64: true, edit: true, filter: true, filterindex: 8
          },
          { name: "signatory", text: "签约人", base64: true, edit: true, filter: true, filterindex: 7 },
          { name: "audit_status", text: "商户审核状态", dict: "audit_status", filter: true, filterindex: 9 },
          { name: "publish_status", text: "商户发布状态", dict: "publish_status", filter: true, filterindex: 10 },
          { name: "online_status", text: "商户上线状态", dict: "online_status", filter: true, filterindex: 11 },
          { name: "description", text: "商户描述", novalid: true, type: "mulittext", base64: true, edit: true, grid: false },
          { name: "photo_url", text: "封面", type: "image", edit: true, base64: true, grid: false },
          { name: "creator", text: "创建人", base64: true },
          { name: "create_time", text: "创建时间", type: "datetime" },
          { name: "begin_date", text: "开始时间", type: "date", filter: true, filterindex: 12, grid: false },
          { name: "end_date", text: "结束时间", type: "date", filter: true, filterindex: 13, grid: false },
          { name: 'password', text: '密码', grid: false, edit: true },
          { name: 'people', text: '联系人', grid: false, edit: true },
          { name: 'people_phone', text: '联系电话', validtype: 'phone', grid: false, edit: true }
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