define(["QDP"], function(QDP) {
  "use strict";

  var edit_click = function() {
    // dialog.alertText("1");
  };

  var info_customAction = function(td, data, index) {
    QDP.cell.addAction(td, "btn_check", index, edit_click);
    QDP.cell.addAction(td, "btn_publish", index, edit_click);
    QDP.cell.addAction(td, "btn_unpublish", index, edit_click);
    QDP.cell.addAction(td, "btn_look", index, edit_click);
    QDP.cell.addAction(td, "btn_chgpwd", index, edit_click);
  };

  var project_customAction = function(td, data, index) {
    QDP.cell.addAction(td, "btn_check", index, edit_click);
  };

  /** 初始化合作方列表
   * @param  {} filter
   * @param  {} column
   * @param  {} value
   */
  var initPartner = function(filter, column, value) {
    $("<select/>")
      .attr("id", filter.name)
      .addClass("form-control")
      .appendTo(column);
    QDP.form.initCache({
      api: QDP.api.role.alldatasapi,
      target: $("#" + filter.name),
      valuefn: function(index, item) {
        return item.id;
      },
      textfn: function(index, item) {
        return QDP.base64.decode(item.name);
      },
      done: function() {
        $("#" + filter.name).attr("data-value", value);
      }
    });
  };

  return {
    define: {
      name: "商户管理模块",
      version: "1.0.0.0",
      copyright: " Copyright 2017-2027 WangXin nvlbs,Inc."
    },
    /** 商户基本信息管理 */
    initInfo: function() {
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
          {
            name: "priv",
            text: "省份",
            dict: "schooltype",
            edit: true,
            filter: true,
            filterindex: 1
          },
          {
            name: "city",
            text: "城市",
            dict: "schooltype",
            edit: true,
            filter: true,
            filterindex: 2
          },
          {
            name: "tenantCode",
            text: "商户编号",
            base64: true,
            edit: true,
            filter: true,
            filterindex: 4
          },
          {
            name: "tenantName",
            text: "商户名称",
            base64: true,
            edit: true,
            filter: true,
            filterindex: 5
          },
          {
            name: "storeName",
            text: "店铺名称",
            base64: true,
            edit: true,
            filter: true,
            filterindex: 7
          },
          {
            name: "checkName",
            text: "签约人",
            notempty: true,
            base64: true,
            edit: true,
            filter: true,
            filterindex: 3
          },
          {
            name: "loginName",
            text: "登录名",
            base64: true,
            edit: true,
            filter: true,
            filterindex: 6
          },
          {
            name: "checkState",
            text: "审核状态",
            dict: "checkstate",
            filter: true,
            filterindex: 8
          },
          {
            name: "publishState",
            text: "发布状态",
            dict: "publishstate",
            filter: true,
            filterindex: 9
          },
          {
            name: "date",
            text: "创建时间",
            type: "datetime",
            filter: "daterange",
            filterindex: 999
          },
          { name: "_action", text: "操作", customAction: info_customAction }
        ]
      };
      QDP.generator.init(options);
    },
    /** 商户服务项目管理 */
    initProject: function() {
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
          {
            name: "tenantCode",
            text: "商户编号",
            base64: true,
            edit: true,
            filter: true,
            filterindex: 2
          },
          {
            name: "tenantName",
            text: "商户名称",
            base64: true,
            edit: true,
            filter: true,
            filterindex: 3
          },
          {
            name: "serviceName",
            text: "服务名称",
            dict: "servicename",
            edit: true,
            filter: true,
            filterindex: 4
          },
          {
            name: "serviceState",
            text: "服务状态",
            dict: "servicestate",
            edit: true,
            filter: true,
            filterindex: 5
          },
          {
            name: "serviceType",
            text: "服务类别",
            dict: "servicetype",
            edit: true,
            filter: true,
            filterindex: 6
          },
          {
            name: "storeName",
            text: "服务车型",
            base64: true,
            edit: true,
            filter: true,
            filterindex: 7
          },
          {
            name: "date",
            text: "创建时间",
            type: "datetime",
            filter: "daterange",
            filterindex: 999
          },
          { name: "vipamount", text: "折扣券会员价", base64: true },
          { name: "aboutamount", text: "折扣券签约价", base64: true },
          { name: "amount", text: "店铺门市价", base64: true },
          { name: "freeamount", text: "免费券结算价", base64: true },
          { name: "realamount", text: "应结算金额", base64: true },
          {
            name: "checkState",
            text: "审核状态",
            edit: true,
            dict: "checkstate",
            filter: true,
            filterindex: 8
          },
          { name: "_action", text: "操作", customAction: project_customAction }
        ]
      };
      QDP.generator.init(options);
    },
    /** 商户全历史查询 */
    initHistorySearch: function() {
      var options = {
        apis: { list: QDP.api.logs.datas },
        columns: [
          { name: "_index", text: "序号" },
          { name: "id", primary: true },
          { name: "priv", text: "省份", dict: "schooltype" },
          { name: "city", text: "城市", dict: "schooltype" },
          { name: "storeCode", text: "商户编号", base64: true, filter: true },
          { name: "storeName", text: "商户名称", base64: true, filter: true },
          { name: "addr", text: "商户地址", base64: true },
          { name: "point", text: "商户评分", base64: true },
          { name: "telphone", text: "用户手机号" },
          { name: "code", text: "洗车券码", base64: true },
          { name: "codestate", text: "洗车券状态", dict: "codestate" },
          { name: "codetype", text: "券码类型", dict: "codetype" },
          { name: "codetype2", text: "券码类别", dict: "codetype2" },
          { name: "channeltype", text: "渠道号", dict: "channeltype" },
          { name: "publishdate", text: "发券时间", type: "date" },
          { name: "outdate", text: "过期时间", type: "date" },
          { name: "usedate", text: "使用时间", type: "date" },
          { name: "carbrand", text: "车辆品牌" },
          { name: "cartype", text: "车辆类型", dict: "cartype" },
          { name: "carplate", text: "车牌号码" },
          { name: "ordercode", text: "订单编号" },
          { name: "orderdate", text: "订单时间", type: "date" },
          { name: "orderamount", text: "订单金额" },
          { name: "payamount", text: "实付金额" },
          { name: "vipamount", text: "折扣券会员价", base64: true },
          { name: "aboutamount", text: "折扣券签约价", base64: true },
          { name: "amount", text: "店铺门市价", base64: true },
          { name: "freeamount", text: "免费券结算价", base64: true },
          { name: "realamount", text: "应结算金额", base64: true }
        ]
      };
      QDP.generator.init(options);
    },
    /** 领券情况查询 */
    initlqqk: function() {
      var options = {
        apis: { list: QDP.api.logs.datas },
        columns: [
          { name: "_index", text: "序号" },
          { name: "id", primary: true },
          { name: "priv", text: "省份", dict: "schooltype", filter: true },
          { name: "city", text: "城市", dict: "schooltype", filter: true },
          { name: "channeltype", text: "渠道号", dict: "channeltype" },
          { name: "publishdate", text: "已发免费券总量" },
          { name: "outdate", text: "已发折扣券总量" },
          { name: "usedate", text: "未使用免费券总量" },
          { name: "carbrand", text: "未使用折扣券总量" },
          { name: "cartype", text: "已使用免费券总量" },
          { name: "carplate", text: "已使用免费券总量" },
          { name: "ordercode", text: "已使用折扣券总量" },
          { name: "orderdate", text: "已过期总量" },
          { name: "orderamount", text: "免费券验证率" },
          { name: "payamount", text: "折扣券验证率" },
          { name: "vipamount", text: "验证率（免费券+折扣券）" },
          { name: "vipamount", text: "验证率（免费券+折扣券）" },
          {
            name: "publishdate",
            text: "时间段",
            type: "datetime",
            grid: false,
            filter: "daterange"
          }
        ]
      };
      QDP.generator.init(options);
    },
    /** 活跃用户统计月表 */
    initActiveUserMonth: function() {
      // 根据合作方、省份、城市、月份实现综合筛选查询活跃用户数统计，
      // 查询结果包括省份、城市、获取权益免费券用户数、验证权益免费券用户数、
      // 获取权益折扣券用户数、验证权益折扣券用户数、获取活动免费券用户数、验证活动免费券用户数
      // 、获取活动折扣券用户数、验证活动折扣券用户数。
      // 系统需记录手机号码明细，具备自动剔重功能，可excel表格导出。该功能有以上各个细分功能构成，需以每个细分功能为粒度设置权限。
      var options = {
        apis: { list: QDP.api.logs.datas },
        columns: [
          { name: "_index", text: "序号" },
          { name: "id", primary: true },
          { name: "partner", text: "合作方", custom: initPartner, filter: true },
          { name: "priv", text: "省份", dict: "schooltype", filter: true },
          { name: "city", text: "城市", dict: "schooltype", filter: true },
          { name: "month", text: "月份", type: "date", filter: true },
          { name: "publishdate", text: "获取权益免费券用户数" },
          { name: "outdate", text: "验证权益免费券用户数" },
          { name: "usedate", text: "获取权益折扣券用户数" },
          { name: "carbrand", text: "验证权益折扣券用户数" },
          { name: "cartype", text: "获取活动免费券用户数" },
          { name: "carplate", text: "验证活动免费券用户数" },
          { name: "ordercode", text: "获取活动折扣券用户数" },
          { name: "orderdate", text: "验证活动折扣券用户数" }
        ]
      };
      QDP.generator.init(options);
    },
    /** 活跃商户统计月表 */
    initActiveTenantMonth: function() {
      // 根据合作方、省份、城市、月份实现综合筛选查询活跃商户统计
      // ，查询结果包括省份、城市、验证免费券用户数、验证折扣券用户数。
      // 具备excel表格导出功能。该功能有以上各个细分功能构成，需以每个细分功能为粒度设置权限。
      var options = {
        apis: { list: QDP.api.logs.datas },
        columns: [
          { name: "_index", text: "序号" },
          { name: "id", primary: true },
          {
            name: "partner",
            text: "合作方",
            custom: initPartner,
            filter: true,
            grid: false
          },
          { name: "priv", text: "省份", dict: "schooltype", filter: true },
          { name: "city", text: "城市", dict: "schooltype", filter: true },
          { name: "month", text: "月份", type: "date", filter: true },
          { name: "publishdate", text: "验证免费券用户数" },
          { name: "outdate", text: "验证折扣券用户数" }
        ]
      };
      QDP.generator.init(options);
    },
    /** 商户上线成功率统计 */
    initTenantSuccessRate: function() {
      // 根据合作方、省份、城市、区县、月份统计周期内商户上线通过率（通过上线审核总数/发起上线审核总数）。
      // 具备excel表格导出功能。该功能有以上各个细分功能构成，需以每个细分功能为粒度设置权限。
      var options = {
        apis: { list: QDP.api.logs.datas },
        columns: [
          { name: "_index", text: "序号" },
          { name: "id", primary: true },
          {
            name: "partner",
            text: "合作方",
            custom: initPartner,
            filter: true,
            grid: false
          },
          { name: "priv", text: "省份", dict: "schooltype", filter: true },
          { name: "city", text: "城市", dict: "schooltype", filter: true },
          { name: "area", text: "区县", dict: "schooltype", filter: true },
          { name: "month", text: "月份", type: "date", filter: true },
          { name: "n1", text: "周期内商户上线通过率" },
          { name: "n2", text: "通过上线审核总数" },
          { name: "n3", text: "发起上线审核总数" }
        ]
      };
      QDP.generator.init(options);
    },
    /** 商户签约明细 */
    initTenantSignDetail: function() {
      // 根据合作方、省份、城市、区县实时查询商户签约情况。
      var options = {
        apis: { list: QDP.api.logs.datas },
        columns: [
          { name: "_index", text: "序号" },
          { name: "id", primary: true },
          {
            name: "partner",
            text: "合作方",
            custom: initPartner,
            filter: true,
            grid: false
          },
          { name: "priv", text: "省份", dict: "schooltype", filter: true },
          { name: "city", text: "城市", dict: "schooltype", filter: true },
          { name: "area", text: "区县", dict: "schooltype", filter: true },
          { name: "n1", text: "商户名称" },
          { name: "n2", text: "签约时间", type: "date" }
        ]
      };
      QDP.generator.init(options);
    },
    /** 商户签约数量统计 */
    initTenantSign: function() {
      // 根据合作方、省份、城市、区县、月份实现综合筛选查询商户签约上线数量，
      // 查询结果包括合作方、省份、城市、区县、承诺的商户数、审核通过已发布的商户数、审核通过未发布的商户数、取消发布的商户数等。
      // 具备excel表格导出功能。该功能有以上各个细分功能构成，需以每个细分功能为粒度设置权限。
      var options = {
        apis: { list: QDP.api.logs.datas },
        columns: [
          { name: "_index", text: "序号" },
          { name: "id", primary: true },
          {
            name: "partner",
            text: "合作方",
            custom: initPartner,
            filter: true,
            grid: false
          },
          { name: "priv", text: "省份", dict: "schooltype", filter: true },
          { name: "city", text: "城市", dict: "schooltype", filter: true },
          { name: "area", text: "区县", dict: "schooltype", filter: true },
          { name: "month", text: "月份", type: "date", filter: true },
          { name: "n1", text: "承诺的商户数" },
          { name: "n2", text: "审核通过已发布的商户数" },
          { name: "n3", text: "审核通过未发布的商户数" },
          { name: "n4", text: "取消发布的商户数" }
        ]
      };
      QDP.generator.init(options);
    }
  };
});
