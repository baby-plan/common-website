//告警查询插件
(function (app) {
  var get_alarm_options = function () {
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
  app.plugins.searchs.alarm = function () {
    var TABLE_COLUMNS = ["序号", "分组名称", "目标名称", "SIM卡号", "告警时间", "速度", "告警类型", "经度", "纬度", "附加信息"];
    $(".modal-title").html("告警查询");
    App.services.car.fill($("#treeview"));
    app.table.render($("#table"), TABLE_COLUMNS);
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
    // rType
    $("#doSearch").on("click", function () {
      var options = get_alarm_options();
      if (options) {
        app.table.load({
          "api": bus_cfgs.reportStatistics.reportStatapi
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

  var get_command_options = function () {
    var options = {};
    var operName = $("#operName").val();
    if (operName != "") {
      options.operName = operName;
    }
    var cmdName = $("#cmdName").val();
    if (cmdName != "") {
      options.cmdName = cmdName;
    } else {
      options.cmdName = "all";
    }
    var startTime = $("#startTime").val();
    if (startTime != "") {
      options.startTime = startTime;
    }
    var endTime = $("#endTime").val();
    if (endTime != "") {
      options.endTime = endTime;
    }
    var ids = App.services.menu.getsids($("#treeview"));
    if (ids == "") {
      App.alert("请选择要查询的车辆");
      return;
    }
    options.sIds = ids;
    return options;
  }

  app.plugins.searchs.command = function () {
    var TABLE_COLUMNS = ["序号", "操作员名称", "目标名称", "SIM卡号", "指令类型", "下发时间", "是否成功", "描述"];
    $(".modal-title").html("指令查询");
    App.services.car.fill($("#treeview"));
    app.table.render($("#table"), TABLE_COLUMNS);
    $.each(bus_cfgs.dict.ZLLX, function (index, item) {
      $("#cmdName").append($("<option/>").val(index).text((item.text) ? item.text : item));
    });
    //导出按钮
    App.plugins.statistics.registExport();
    //重置按钮
    $("#doReset").on("click", function () {
      $("#startTime").val(App.util.monthFirst());
      $("#endTime").val(App.util.monthLast());
      $("#operName").val("");
      $("#cmdName").val("");
    });
    //查询按钮
    $("#doSearch").on("click", function () {
      var options = get_command_options();
      if (options) {
        app.table.load({
          "api": bus_cfgs.reportStatistics.commandStatapi
          , "args": options
          , "target": $("#table")
          , "parsefn": function (tr, index, totalindex, item) {
            App.row.addText(tr, totalindex);// 序号
            App.row.addBase64Text(tr, item.operName);// 操作员名称
            App.row.addBase64Text(tr, item.targetName);// 目标名称
            App.row.addText(tr, item.sim);// SIM卡号
            App.row.addDictText(tr, "ZLLX", item.operatorID);// 指令类型
            App.row.addText(tr, item.time);// 下发时间
            App.row.addBase64Text(tr, item.issuccess);// 是否成功
            App.row.addBase64Text(tr, item.returnm);// 描述
          }
        });
      }
    });//$("#doSearch").on("click", function () {
    $("#doReset").click();
  }

})(App);
