/* ========================================================================
 * App.plugins.statistics v1.0
 * 统计中心-公共组件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  // 生成公共查询条件参数
  app.plugins.statistics.getOptions = function () {
    var options = {};
    var startTime = $("#startTime").val();
    if (startTime != "") { options.startTime = startTime; }
    var endTime = $("#endTime").val();
    if (endTime != "") { options.endTime = endTime; }
    var ids = App.services.menu.getsids($("#treeview"));
    if (ids == "") {
      App.alert("请选择要统计的车辆");
      return;
    }
    options.sIds = ids;
    return options;
  };
  // 注册导出按钮事件
  app.plugins.statistics.registExport = function () {
    $("#doExport").on("click", function () {
      App.table.exportCSV($("#table"));
    });//$("#doExport").on("click", function () {
  }
  // 注册重置按钮事件
  app.plugins.statistics.registReset = function () {
    $("#doReset").on("click", function () {
      $("#startTime").val(App.util.monthFirst());
      $("#endTime").val(App.util.monthLast());
    });//$("#doReset").on("click", function () {
  }
})(App);
/* ========================================================================
 * App.plugins.statistics.location v1.0
 * 统计中心-定位统计插件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  app.plugins.statistics.location = function (parent) {
    var TABLE_COLUMNS = ["序号", "目标ID", "目标名称", "SIM卡号", "定位次数"];
    $(".modal-title").html("定位统计");
    App.services.car.fill($("#treeview"));
    app.table.render($("#table"), TABLE_COLUMNS);
    //导出按钮
    App.plugins.statistics.registExport();
    //重置按钮
    App.plugins.statistics.registReset();
    //查询按钮
    $("#doSearch").on("click", function () {
      var options = App.plugins.statistics.getOptions();
      if (options) {
        app.table.load({
          "api": bus_cfgs.reportStatistics.locationapi
          , "args": options
          , "target": $("#table")
          , "parsefn": function (tr, index, totalindex, item) {
            App.row.addText(tr, totalindex);// 序号
            App.row.addText(tr, item.targetId);// 目标ID
            App.row.addBase64Text(tr, item.targetName);// 目标名称
            App.row.addText(tr, item.sim);// SIM卡号
            App.row.addText(tr, item.posNum);// 定位次数
          }
        });
      }
    });//$("#doSearch").on("click", function () {
    $("#doReset").click();
  };
})(App);
/* ========================================================================
 * App.plugins.statistics.mileage v1.0
 * 统计中心-里程统计插件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  app.plugins.statistics.mileage = function (parent) {
    var TABLE_COLUMNS = ["序号", "分组名称", "车辆名称", "SIM卡号", "总里程数"];
    $(".modal-title").html("里程统计");
    App.services.car.fill($("#treeview"));
    app.table.render($("#table"), TABLE_COLUMNS);
    //导出按钮
    App.plugins.statistics.registExport();
    //重置按钮
    App.plugins.statistics.registReset();
    //查询按钮
    $("#doSearch").on("click", function () {
      var options = App.plugins.statistics.getOptions();
      if (options) {
        app.table.load({
          "api": bus_cfgs.reportStatistics.mileageStatapi
          , "args": options
          , "target": $("#table")
          , "parsefn": function (tr, index, totalindex, item) {
            App.row.addText(tr, totalindex);// 序号
            App.row.addBase64Text(tr, item.group_name);// 分组名称
            App.row.addBase64Text(tr, item.target_name);// 车辆名称
            App.row.addText(tr, item.sim);// SIM卡号
            App.row.addText(tr, item.total_mile);// 总里程数
          }
        });
      }
    });//$("#doSearch").on("click", function () {
    $("#doReset").click();
  };
})(App);
/* ========================================================================
 * App.plugins.statistics.fuelquery v1.0
 * 统计中心-油耗统计插件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  app.plugins.statistics.fuelquery = function (parent) {
    var TABLE_COLUMNS = ["分组名称", "目标名称", "SIM卡号", "理想油耗（升）", "实际油耗（升）"];
    $(".modal-title").html("油耗统计");
    App.services.car.fill($("#treeview"));
    app.table.render($("#table"), TABLE_COLUMNS);
    //导出按钮
    App.plugins.statistics.registExport();
    //重置按钮
    App.plugins.statistics.registReset();
    //查询按钮
    $("#doSearch").on("click", function () {
      var options = App.plugins.statistics.getOptions();
      if (options) {
        app.table.load({
          "api": bus_cfgs.reportStatistics.oilCostStatapi
          , "args": options
          , "target": $("#table")
          , "parsefn": function (tr, index, totalindex, item) {
            App.row.addBase64Text(tr, item.groupName);//分组名称
            App.row.addBase64Text(tr, item.targetName);// 目标名称
            App.row.addText(tr, item.sim);//SIM卡号
            App.row.addText(tr, item.oilMass);//理想油耗（升）
            App.row.addText(tr, item.oilCost);//实际油耗（升）
          }
        });
      }
    });//$("#doSearch").on("click", function () {

    $("#doReset").click();
  };
})(App);
/* ========================================================================
 * App.plugins.statistics.trajectoryquery v1.0
 * 统计中心-轨迹查询插件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  var TABLE_COLUMNS = ["流水号", "终端名称", "手机号码", "车机时间", "速度", "方向", "海拔", "里程", "位置描述", "消息类型", "车机状态"];
  app.plugins.statistics.trajectoryquery = function (parent) {
    $(".modal-title").html("轨迹查询");
    App.services.car.fill($("#treeview"));
    app.table.render($("#table"), TABLE_COLUMNS);
    //导出按钮
    App.plugins.statistics.registExport();
    //重置按钮
    App.plugins.statistics.registReset();
    //查询按钮
    $("#doSearch").on("click", function () {
      var options = App.plugins.statistics.getOptions();
      if (!options) {
        return;
      }
      app.table.load({
        "api": bus_cfgs.reportStatistics.trackStatapi
        , "args": options
        , "target": $("#table")
        , "parsefn": function (tr, index, totalindex, item) {
          App.row.addText(tr, totalindex);// 序号
          App.row.addBase64Text(tr, item.tName);// 终端名称
          App.row.addText(tr, item.sim);// 手机号码
          App.row.addText(tr, item.bTime);// 车机时间
          App.row.addText(tr, item.speed);// 速度
          App.row.addText(tr, item.dir);// 方向
          App.row.addText(tr, item.alt);// 海拔
          App.row.addText(tr, item.mileage);// 里程
          App.row.addText(tr, "");// 位置描述
          App.row.addBase64Text(tr, item.rState);// 消息类型
          App.row.addBase64Text(tr, item.state);// 车机状态
        }
      });
    });//$("#doSearch").on("click", function () {
    $("#doReset").click();
  };
})(App);
/* ========================================================================
 * App.plugins.statistics.park v1.0
 * 统计中心-停车统计插件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  var TABLE_COLUMNS = ["序号", "车辆名称", "SIM卡号", "开始停留时间", "结束停留时间", "停留", "位置描述", "经度", "纬度"];
  //条件查询根据ID找到对应的数据
  app.plugins.statistics.park = function (parent) {
    $(".modal-title").html("停车统计");
    App.services.car.fill($("#treeview"));
    app.table.render($("#table"), TABLE_COLUMNS);
    //导出按钮
    App.plugins.statistics.registExport();
    //重置按钮
    App.plugins.statistics.registReset();
    //查询按钮
    $("#doSearch").on("click", function () {
      var options = App.plugins.statistics.getOptions();
      if (!options) {
        return;
      } else {
        options.times = 1800;
      }
      app.table.load({
        "api": bus_cfgs.reportStatistics.parkStatapi
        , "args": options
        , "target": $("#table")
        , "parsefn": function (tr, index, totalindex, item) {
          App.row.addText(tr, totalindex)// 序号
          App.row.addBase64Text(tr, item.targetName);// 车辆名称
          App.row.addText(tr, item.sim)// SIM卡号
          App.row.addText(tr, item.startTime)// 开始停留时间

          if (item.endTime) {
            App.row.addText(tr, item.endTime);// 结束停留时间
          } else {
            App.row.addText(tr, item.endtime);// 结束停留时间
          }
          App.row.addText(tr, item.parkTime);// 停留
          App.row.addText(tr, "");// 位置描述
          App.row.addText(tr, item.lon);// 经度
          App.row.addText(tr, item.lat);// 纬度
        }
      });
    });//$("#doSearch").on("click", function () {
    $("#doReset").click();
  };
})(App);
/* ========================================================================
 * App.plugins.statistics.terminalquery v1.0
 * 统计中心-终端查询插件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  var TABLE_COLUMNS = ["序号", "分组名称", "目标名称", "SIM卡号", "是否可用", "是否绑定", "计划名称"];
  //条件查询根据ID找到对应的数据
  var getOptions = function () {
    var options = {};
    // var gname = $("#gname").val();
    // if (gname != "") {
    //   options.groupId = gname;
    // }else{
    //   options.groupId = "all";
    // }
    options.groupId = "all"
    var isbind = $("#isbind").val();
    if (isbind != "") {
      options.isPlan = isbind;
    } else {
      options.isPlan = "all";
    }
    options.planName = $("#taskname").val();
    options.sim = $("#sim").val();
    options.targetName = $("#tname").val();
    var ids = App.services.menu.getsids($("#treeview"));
    if (ids == "") {
      App.alert("请选择要查询的车辆");
      return;
    }
    options.sIds = ids;
    return options;
  };
  App.plugins.statistics.terminalquery = function (parent) {
    App.services.car.fill($("#treeview"));
    $.each(bus_cfgs.dict.SF, function (index, item) {
      $("#isbind").append($("<option/>").val(index).text((item.text) ? item.text : item));
    });
    app.table.render($("#table"), TABLE_COLUMNS);
    //导出按钮
    App.plugins.statistics.registExport();
    //重置按钮
    $("#doReset").on("click", function () {
      $("#isbind").val("");
      $("#gname").val("");
      $("#tname").val("");
      $("#sim").val("");
      $("#taskname").val("");
    });//$("#doReset").on("click", function () {
    //查询按钮
    $("#doSearch").on("click", function () {
      var options = getOptions();
      if (!options) {
        return;
      }
      app.table.load({
        "api": bus_cfgs.reportStatistics.terminalStatapi
        , "args": options
        , "target": $("#table")
        , "parsefn": function (tr, index, totalindex, item) {
          App.row.addText(tr, totalindex);// 序号
          App.row.addBase64Text(tr, item.groupName);// 分组名称
          App.row.addBase64Text(tr, item.targetName);// 目标名称
          App.row.addText(tr, item.sim);// SIM卡号
          App.row.addDictText(tr, "SF", item.useable);// 是否可用
          App.row.addBase64Text(tr, item.isPlan);// 是否绑定
          App.row.addBase64Text(tr, item.planName);// 计划名称
        }
      });
    });//$("#doSearch").on("click", function () {
  };
})(App);
/* ========================================================================
 * App.plugins.statistics.logquery v1.0
 * 统计中心-日志查询插件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  var getOptions = function () {
    var options = {};
    var content = $("#content").val();
    if (content == "") {
      options.content = "";
    } else {
      options.content = App.base64.encode(content);
    }
    var startTime = $("#startTime").val();
    if (startTime != "") {
      options.startTime = startTime;
    }
    var endTime = $("#endTime").val();
    if (endTime != "") {
      options.endTime = endTime;
    }
    return options;
  };
  app.plugins.statistics.logquery = function (parent) {
    var TABLE_COLUMNS = ["序号", "操作员名称", "操作时间", "操作类型", "操作内容", "操作结果", "登录IP"];
    App.services.car.fill($("#treeview"));
    app.table.render($("#table"), TABLE_COLUMNS);
    //导出按钮
    App.plugins.statistics.registExport();
    //重置按钮
    $("#doReset").on("click", function () {
      $("#startTime").val(App.util.monthFirst());
      $("#endTime").val(App.util.monthLast());
      $("#content").val("");
    });
    //查询按钮
    $("#doSearch").on("click", function () {
      var options = getOptions();
      if (!options) {
        return;
      }
      app.table.load({
        "api": bus_cfgs.reportStatistics.logStatapi
        , "args": options
        , "target": $("#table")
        , "parsefn": function (tr, index, totalindex, item) {
          App.row.addText(tr, totalindex);// 序号
          App.row.addBase64Text(tr, item.name);// 操作员名称
          App.row.addText(tr, item.date);//  操作时间
          App.row.addBase64Text(tr, item.op_type);// 操作类型
          App.row.addBase64Text(tr, item.content);// 操作内容
          App.row.addBase64Text(tr, item.result);// 操作结果
          App.row.addText(tr, item.loginIp);//  登录ip
        }
      });
    });//$("#doSearch").on("click", function () {
    $("#doReset").click();
  };
})(App);
/* ========================================================================
 * App.plugins.statistics.alarm v1.0
 * 统计中心-告警统计插件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  //条件查询根据ID找到对应的数据
  var getOptions = function () {
    var options = {};

    var registstate = $("#registstate").val();
    if (registstate != "") {
      options.rType = registstate;
    } else {
      options.rType = "all";
    }
    var startTime = $("#startTime").val();
    if (startTime != "") {
      options.startTime = startTime;
    }
    var endTime = $("#endTime").val();
    if (endTime != "") {
      options.endTime = endTime;
    }
    // options.times = "5";
    var ids = App.services.menu.getsids($("#treeview"));
    if (ids == "") {
      App.alert("请选择要统计的车辆");
      return;
    }
    options.sIds = ids;
    return options;
  };
  app.plugins.statistics.alarm = function (parent) {
    var TABLE_COLUMNS = ["分组名称", "目标名称", "SIM卡号", "告警次数"];
    App.services.car.fill($("#treeview"));
    App.table.render($("#table"), TABLE_COLUMNS);
    $.each(bus_cfgs.dict.GJLX, function (index, item) {
      $("#registstate").append($("<option/>").val(index).text((item.text) ? item.text : item));
    });
    //导出按钮
    App.plugins.statistics.registExport();
    //重置按钮
    $("#doReset").on("click", function () {
      $("#startTime").val(App.util.monthFirst());
      $("#endTime").val(App.util.monthLast());
      $("#registstate").val("");
    });
    //查询按钮
    $("#doSearch").on("click", function () {
      var options = getOptions();
      if (!options) {
        return;
      }
      app.table.load({
        "api": bus_cfgs.reportStatistics.requestlistapi
        , "args": options
        , "target": $("#table")
        , "parsefn": function (tr, index, totalindex, item) {
          $(bus_cfgs.templates.cell).text(App.base64.decode(item.gName)).appendTo(tr);//分组名称
          $(bus_cfgs.templates.cell).text(App.base64.decode(item.tName)).appendTo(tr);// 目标名称
          $(bus_cfgs.templates.cell).text(item.sim).appendTo(tr);//SIM卡号
          $(bus_cfgs.templates.cell).text(item.count).appendTo(tr);//告警次数
        }
      });
    });//$("#doSearch").on("click", function () {
    $("#doReset").click();
  };
})(App);