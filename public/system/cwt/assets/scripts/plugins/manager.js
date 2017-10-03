/* ========================================================================
 * App.plugins.manager v1.0
 * 管理中心-公共组件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  app.plugins.manager = {};
})(App);
/* ========================================================================
 * App.plugins.manager.carmanager v1.0
 * 管理中心-车辆管理组件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  "use strict";
  var parentView;
  // 编辑页面:保存按钮点击事件处理
  var _onsave = function () {
    App.alert("正在建设中....");
  }
  // 列表页面:重置按钮点击事件处理
  var _onreset = function () {

  }
  // 编辑页面:返回按钮点击事件处理
  var _onback = function () {
    App.plugins.manager.carmanager();
  }
  // 网格列表:编辑按钮点击事件处理
  var _onedit = function () {
    var data = App.table.getdata($(this).data("args"));
    var ondone = function (settings) {
      App.form.init(parentView);

      App.form.initDict("YCFW", $("#usecarrange", parentView));
      App.form.initDict("CLLX", $("#cartype", parentView));
      App.form.initDict("color", $("#color", parentView));

      if (data) {
        $("#vname", parentView).val(App.base64.decode(data.vName));
        $("#sim", parentView).val(data.sim);
        $("#ctype", parentView).val(App.base64.decode(data.type));
        $("#color", parentView).val(data.color);
        $("#vCharacter", parentView).val(App.base64.decode(data.vCharacter));
        $("#oilConsume", parentView).val(data.oilConsume);
        $("#frameCode", parentView).val(data.frameCode);
        $("#qryNum", parentView).val(data.qryNum);
        $("#drivingLicence", parentView).val(data.drivingLicence);
        $("#buyDate", parentView).val(data.buyDate);
        $("#registerDate", parentView).val(data.registerDate);
        $("#runDate", parentView).val(data.runDate);
        $("#drivingLicenseDate", parentView).val(data.drivingLicenseDate);
        $("#saleMerchant", parentView).val(App.base64.decode(data.saleMerchant));
      } else {
        $("#buyDate", parentView).val(App.util.monthFirst());
        $("#registerDate", parentView).val(App.util.monthFirst());
        $("#runDate", parentView).val(App.util.monthFirst());
        $("#drivingLicenseDate", parentView).val(App.util.monthFirst());
      }

      // 新增窗口保存按钮
      $("#btn_save", parentView).on("click", _onsave);
      // 新增窗口返回按钮
      $("#btn_back", parentView).on("click", _onback);
    };
    parentView.load(bus_cfgs.carmanager.editpage, ondone);
  }

  var _onsearch = function () {
    var options = {};
    options.gName = App.base64.encode($("#gname", parentView).val());
    options.vName = App.base64.encode($("#vname", parentView).val());
    options.driver = App.base64.encode($("#dname", parentView).val());
    options.sim = $("#sim", parentView).val();
    App.table.load({
      "api": bus_cfgs.carmanager.datas
      , "args": options
      , "parsefn": function (tr, index, totalindex, item) {
        App.row.addText(tr, totalindex);// 序号
        App.row.addBase64Text(tr, item.gName);// 分组名称
        App.row.addBase64Text(tr, item.vName);// 车辆名称
        App.row.addText(tr, item.sim);// SIM卡号
        App.row.addBase64Text(tr, item.type);// 车辆类型
        App.row.addDictText(tr, "color", item.color);// 车辆颜色
        App.row.addBase64Text(tr, item.driver);// 驾驶员名称
        var td = App.row.createCell(tr);/* 操作 */
        App.cell.addAction(td, "btn_edit", index, _onedit);
      }
      , "target": $("#table")
    });
  }
  // 初始化列表页面内容 
  var _initialize_list = function (settings) {
    if (settings && settings.parent) {
      parentView = $("#" + settings.parent);
    } else {
      App.form.init(parentView);
    }
    var columns = ["序号", "分组名称", "车辆名称", "SIM卡号", "车辆类型", "车辆颜色", "驾驶员名称", "操作"];
    App.table.render($("#table"), columns);
    // 重置按钮
    $("#doReset").on("click", function () {
      _onreset();
    });
    // 导出按钮
    $("#doExport").on("click", function () {
      App.table.exportCSV($("#table"));
    });
    // 查询按钮
    $("#doSearch").on("click", function () {
      _onsearch();
    });
    $("#doReset").click();
    $("#doSearch").click();
  }

  app.plugins.manager.carmanager = function () {
    if (App.dialog.isload()) {
      parentView.load(bus_cfgs.carmanager.listpage, _initialize_list);
    } else {
      App.dialog.load({ "url": bus_cfgs.carmanager.listpage, "done": _initialize_list });
    }
  }
})(App);
/* ========================================================================
 * App.plugins.manager.rolemanager v1.0
 * 管理中心-角色管理组件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  "use strict";
  var parentView;
  // 编辑页面:保存按钮点击事件处理
  var _onsave = function () {
    App.alert("正在建设中....");
  };
  // 列表页面:重置按钮点击事件处理
  var _onreset = function () {

  };
  // 编辑页面:返回按钮点击事件处理
  var _onback = function () {
    App.plugins.manager.rolemanager();
  };
  // 网格列表:编辑按钮点击事件处理
  var _onedit = function () {
    var data = App.table.getdata($(this).data("args"));
    var ondone = function (settings) {
      App.form.init(parentView);
      if (data) {
        $("#rolename", parentView).val(App.base64.decode(data.name));
        $("#rolemark", parentView).val(App.base64.decode(data.remark));
      } else {

      }

      // 新增窗口保存按钮
      $("#btn_save", parentView).on("click", _onsave);
      // 新增窗口返回按钮
      $("#btn_back", parentView).on("click", _onback);
    };
    parentView.load(bus_cfgs.rolemanager.editpage, ondone);
  };

  var _onsearch = function () {
    var options = {};
    options.name = App.base64.encode($("#rolename", parentView).val());
    options.remark = App.base64.encode($("#rolemark", parentView).val());
    App.table.load({
      "api": bus_cfgs.rolemanager.datas
      , "args": options
      , "parsefn": function (tr, index, totalindex, item) {
        App.row.addText(tr, totalindex);// 序号
        App.row.addBase64Text(tr, item.name);// 分组名称
        App.row.addBase64Text(tr, item.remark);// 车辆名称
        var td = App.row.createCell(tr);/* 操作 */
        App.cell.addAction(td, "btn_edit", index, _onedit);
      }
      , "target": $("#table")
    });
  };

  // 初始化列表页面内容 
  var _initialize_list = function (settings) {
    if (settings && settings.parent) {
      parentView = $("#" + settings.parent);
    } else {
      App.form.init(parentView);
    }
    var columns = ["序号", "角色名称", "角色描述", "操作"];
    App.table.render($("#table"), columns);
    // 重置按钮
    $("#doReset").on("click", function () {
      _onreset();
    });
    // 导出按钮
    $("#doExport").on("click", function () {
      App.table.exportCSV($("#table"));
    });
    // 查询按钮
    $("#doSearch").on("click", function () {
      _onsearch();
    });
    $("#doReset").click();
    $("#doSearch").click();
  };

  app.plugins.manager.rolemanager = function () {
    if (App.dialog.isload()) {
      parentView.load(bus_cfgs.rolemanager.listpage, _initialize_list);
    } else {
      App.dialog.load({ "url": bus_cfgs.rolemanager.listpage, "done": _initialize_list });
    }
  }
})(App);
/* ========================================================================
 * App.plugins.manager.groupmanager v1.0
 * 管理中心-分组管理组件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  "use strict";
  var parentView;
  var edit_click = function () {
    App.alert("正在建设中....");
  }
  var getOptions = function () {
    var options = {};
    options.gName = App.base64.encode($("#gname", parentView).val());
    options.gRuel = $("#grule", parentView).val();
    return options;
  }
  var _search = function () {
    App.table.load({
      "api": bus_cfgs.groupmanager.datas
      , "args": getOptions()
      , "parsefn": function (tr, index, totalindex, item) {
        App.row.addText(tr, totalindex);// 序号
        App.row.addBase64Text(tr, item.name);// 分组名称
        App.row.addText(tr, item.ruleId);// 分组规则
        App.row.addBase64Text(tr, item.parentName);// 父级分组名称
        App.row.addBase64Text(tr, item.intro);// 描述
        App.row.addBase64Text(tr, item.remark);// 备注
        var td = App.row.createCell(tr);/* 操作 */
        App.cell.addAction(td, "btn_edit", index, edit_click);
      }
      , "target": $("#table")
    });
  }
  app.plugins.manager.groupmanager = function (parent) {
    parentView = $("#" + parent);
    var columns = ["序号", "分组名称", "分组规则", "父级分组名称", "描述", "备注", "操作"];
    App.table.render($("#table"), columns);
    // 重置按钮
    $("#doReset").on("click", function () {
      // reset_click();
    });
    // 导出按钮
    $("#doExport").on("click", function () {
      App.table.exportCSV($("#table"));
    });
    // 查询按钮
    $("#doSearch").on("click", function () {
      _search();
    });
    $("#doReset").click();
    $("#doSearch").click();
  }
})(App);
/* ========================================================================
 * App.plugins.manager.operatormanager v1.0
 * 管理中心-操作员管理组件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  "use strict";
 var parentView;
  // 编辑页面:保存按钮点击事件处理
  var _onsave = function () {
    App.alert("正在建设中....");
  };
  // 列表页面:重置按钮点击事件处理
  var _onreset = function () {

  };
  // 编辑页面:返回按钮点击事件处理
  var _onback = function () {
    App.plugins.manager.operatormanager();
  };
  // 网格列表:编辑按钮点击事件处理
  var _onedit = function () {
    var data = App.table.getdata($(this).data("args"));
    var ondone = function (settings) {
      App.form.init(parentView);
      if (data) {
        $("#rolename", parentView).val(App.base64.decode(data.name));
        $("#rolemark", parentView).val(App.base64.decode(data.remark));
      } else {

      }

      // 新增窗口保存按钮
      $("#btn_save", parentView).on("click", _onsave);
      // 新增窗口返回按钮
      $("#btn_back", parentView).on("click", _onback);
    };
    parentView.load(bus_cfgs.operatormanager.editpage, ondone);
  };

  var _onsearch = function () {
    var options = {};
    options.userName = App.base64.encode($("#userName", parentView).val());
    options.loginName = App.base64.encode($("#loginName", parentView).val());
    options.telphone = $("#telphone", parentView).val();
    options.state = $("#state", parentView).val();
    options.dispatch_identity = $("#dispatch_identity", parentView).val();
    App.table.load({
      "api": bus_cfgs.operatormanager.datas
      , "args": options
      , "parsefn": function (tr, index, totalindex, item) {
        App.row.addText(tr, totalindex);// 序号
        App.row.addBase64Text(tr, item.name);// 用户名称
        App.row.addBase64Text(tr, item.login_name);// 登录名称
        App.row.addText(tr, item.open_date);// 日期
        App.row.addText(tr, item.reg_date);// 注册时间
        App.row.addText(tr, item.telphone);// 电话
        App.row.addBase64Text(tr, item.ca_type);//类型
        App.row.addBase64Text(tr, item.status);// 是否可用
        App.row.addBase64Text(tr, item.active);// 是否激活
        var td = App.row.createCell(tr);/* 操作 */
        App.cell.addAction(td, "btn_edit", index, _onedit);
      }
      , "target": $("#table")
    });
  };
  // 初始化列表页面内容 
  var _initialize_list = function (settings) {
    if (settings && settings.parent) {
      parentView = $("#" + settings.parent);
    } else {
      App.form.init(parentView);
    }
    var columns = ["序号", "用户名称", "登录名称", "日期", "注册时间", "电话", "类型", "是否可用", "是否激活", "操作"];
    App.table.render($("#table"), columns);
    // 重置按钮
    $("#doReset").on("click", function () {
      _onreset();
    });
    // 导出按钮
    $("#doExport").on("click", function () {
      App.table.exportCSV($("#table"));
    });
    // 查询按钮
    $("#doSearch").on("click", function () {
      _onsearch();
    });
    $("#doReset").click();
    $("#doSearch").click();
  };

  app.plugins.manager.operatormanager = function () {
    if (App.dialog.isload()) {
      parentView.load(bus_cfgs.operatormanager.listpage, _initialize_list);
    } else {
      App.dialog.load({ "url": bus_cfgs.operatormanager.listpage, "done": _initialize_list });
    }
  }
})(App);
