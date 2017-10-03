/* ========================================================================
 * App.plugins.dispatch v1.0
 * 公务车管理插件-用车申请模块：
 * scripts/plugins/dispatch/request.js
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  var parentView;
  
  // 填充表格数据
  var initTableRow = function (tr, index, totalindex, item) {
    App.row.addText(tr, totalindex);// 序号
    App.row.addText(tr, item.flowNumber);// 流程编号
    App.row.addBase64Text(tr, item.useCarName);// 用车人名称
    App.row.addBase64Text(tr, item.useCarDepa);// 用车人部门
    App.row.addText(tr, item.useCarStartTime);// 计划用车开始时间
    App.row.addText(tr, item.useCarEndTime);// 计划用车结束时间
    App.row.addBase64Text(tr, item.dest);// 目的地
    App.row.addDictText(tr, "YCFW", item.useCarRange);// 用车范围
    App.row.addBase64Text(tr, item.applyName);// 申请人名称
    App.row.addBase64Text(tr, item.applyUnit);// 申请人单位
    App.row.addText(tr, item.applyTime);// 申请时间
    App.row.addDictText(tr, "SQZT", item.applyState);// 申请状态
    App.row.addDictText(tr, "DDZT", item.dispatchState);// 申请状态

    var td = App.row.createCell(tr);/* 操作 */
    // 详情按钮
    App.cell.addAction(td, "btn_detail", item.ID + "," + item.flowNumber, detail_click);
    // 提交按钮:只有未提交或者被驳回的用车申请可以被提交
    if (item.applyState == "1" || item.applyState == "4" || item.dispatchState == "4") {
      App.cell.addAction(td, "btn_submit", item.ID, submit_click);
    }
    // 删除按钮:只有未提交或者被驳回的申请才可以被删除
    if (item.applyState == "1" || item.applyState == "4" || item.dispatchState == "4") {
      App.cell.addAction(td, "btn_delete", item.ID, remove_click);
    }
  }

  var search_click = function () {
    var url = bus_cfgs.dispatch.requestlistapi;
    var options = {};

    var username = $("#username", parentView).val();
    if (username != "") {
      options.useCarName = App.base64.encode(username);
    }
    var userdept = $("#userdept", parentView).val();
    if (userdept != "") {
      options.useCarDepa = App.base64.encode(userdept);
    }
    var registstate = $("#registstate", parentView).val();
    if (registstate != "") {
      options.applyState = registstate;
    }
    var dispatchstate = $("#dispatchstate", parentView).val();
    if (dispatchstate != "") {
      options.dispatchState = dispatchstate;
    }
    var usecarrange = $("#usecarrange", parentView).val();
    if (usecarrange != "") {
      options.useCarRange = usecarrange;
    }
    var usecarstarttime = $("#usecarstarttime", parentView).val();
    if (usecarstarttime != "") {
      options.useCarStartTime = App.util.urlencode(usecarstarttime);
    }
    var usecarendtime = $("#usecarendtime", parentView).val();
    if (usecarendtime != "") {
      options.useCarEndTime = App.util.urlencode(usecarendtime);
    }
    var parsefn = initTableRow;
    var target = $("#table", parentView);
    app.table.load({ "api": url, "args": options, "parsefn": parsefn, "target": target });
  }

  var remove_click = function () {
    var id = $(this).data("args");
    App.confirm("该操作不可逆", "确定要删除选中的用车申请？", "", function (isOK) {
      if (isOK) {
        var options = { "id": id };
        var callback = function (json) {
          search_click();
        };
        App.ajax(bus_cfgs.dispatch.requestdeleteapi, options, callback);
      }
    });
  };

  var reset_click = function () {
    $("#usecarstarttime", parentView).val(App.util.monthFirst());
    $("#usecarendtime", parentView).val(App.util.monthLast());
    $("#username", parentView).val("");
    $("#userdept", parentView).val("");
    $("#registstate", parentView).select2("val", "");
    $("#dispatchstate", parentView).select2("val", "");
    $("#usecarrange", parentView).select2("val", "");
  }

  var detail_click = function () {
    var args = $(this).data("args");
    var datas = args.split(",");
    App.plugins.dispatch.requestDetail(datas[0], datas[1]);
  };

  var submit_click = function () {
    var args = $(this).data("args");
    App.plugins.dispatch.toapproval(args, "Apply");
  };

  app.plugins.dispatch.request = {
    "init": function (parent) {
      parentView = $("#" + parent);

      App.form.initDict("SQZT", $("#registstate", parentView), true);
      App.form.initDict("DDZT", $("#dispatchstate", parentView), true);
      App.form.initDict("YCFW", $("#usecarrange", parentView), true);
      var TABLE_COLUMNS = ["序号", "流程编号", "用车人", "用车部门", "计划用车时间", "计划返回时间", "目的地", "用车范围", "申请人", "申请单位", "申请时间", "申请状态", "调度状态", "操作"];
      app.table.render($("#table", parentView), TABLE_COLUMNS);
      // 新增按钮
      $("#btn_add", parentView).on("click", function () {
        App.plugins.dispatch.createRequest();
      });
      // 重置按钮
      $("#btn_reset", parentView).on("click", function () {
        reset_click();
      });
      // 导出按钮
      $("#btn_export", parentView).on("click", function () {
        App.table.exportCSV($("#table", parentView));
      });
      // 查询按钮
      $("#btn_search", parentView).on("click", function () {
        search_click();
      });

      reset_click();
    }
  };
  // 新增用车申请
  app.plugins.dispatch.createRequest = function () {
    var ondone = function (settings) {
      var parentView = $("#" + settings.parent);

      App.form.initDict("YCFW", $("#usecarrange", parentView));
      App.form.initDict("CLLX", $("#cartype", parentView));
      $("#starttime", parentView).val(App.util.monthFirst());
      $("#stoptime", parentView).val(App.util.monthLast());

      var _save = function () {
        var options = {};
        var useCarName = $("#username", parentView).val();
        if (useCarName != "") {
          options.useCarName = App.base64.encode(useCarName);
        } else {
          App.alert("请输入用车人!");
          return;
        }
        var useCarDepa = $("#userdept", parentView).val();
        if (useCarDepa != "") {
          options.useCarDepa = App.base64.encode(useCarDepa);
        } else {
          App.alert("请输入用车部门!");
          return;
        }
        var useCarSim = $("#usertelphone", parentView).val();
        if (useCarSim != "") {
          options.useCarSim = useCarSim;
        } else {
          App.alert("请输入用车电话!");
          return;
        }
        var useCarPeopleCount = $("#usercount", parentView).val();
        if (useCarPeopleCount != "") {
          options.useCarPeopleCount = useCarPeopleCount;
        } else {
          App.alert("请输入用车人数!");
          return;
        }
        var useCarRange = $("#usecarrange", parentView).val();
        if (useCarRange != "") {
          options.useCarRange = useCarRange;
        } else {
          App.alert("请输入用车范围!");
          return;
        }
        var carType = $("#cartype", parentView).val();
        if (cartype != "") {
          options.cartype = carType;
        } else {
          App.alert("请输入车辆类型!");
          return;
        }
        var aboardAddr = $("#startaddr", parentView).val();
        if (aboardAddr != "") {
          options.aboardAddr = App.base64.encode(aboardAddr);
        } else {
          App.alert("请输入起始地点!");
          return;
        }
        var dest = $("#stopaddr", parentView).val();
        if (dest != "") {
          options.dest = App.base64.encode(dest);
        } else {
          App.alert("请输入目的地!");
          return;
        }
        var useCarStartTime = $("#starttime", parentView).val();
        if (useCarStartTime != "") {
          options.useCarStartTime = App.util.urlencode(useCarStartTime);
        } else {
          App.alert("请输入开始时间!");
          return;
        }
        var useCarEndTime = $("#stoptime", parentView).val();
        if (useCarEndTime != "") {
          options.useCarEndTime = App.util.urlencode(useCarEndTime);
        } else {
          App.alert("请输入结束时间!");
          return;
        }

        var usecarreason = $("#usecarreason", parentView).val();
        if (usecarreason != "") {
          options.useCarReason = App.base64.encode(usecarreason);
        } else {
          App.alert("请输入用车事由!");
          return;
        }
        var applyName = $("#register", parentView).val();
        if (applyName != "") {
          options.applyName = App.base64.encode(applyName);
        } else {
          App.alert("请输入申请人!");
          return;
        }
        var applyUnit = $("#registerdept", parentView).val();
        if (applyUnit != "") {
          options.applyUnit = App.base64.encode(applyUnit);
        } else {
          App.alert("请输入申请单位!");
          return;
        }
        var applyUserSim = $("#registertelphone", parentView).val();
        if (applyUserSim != "") {
          options.applyUserSim = applyUserSim;
        } else {
          App.alert("请输入申请电话!");
          return;
        }
        var remark = $("#mark", parentView).val();
        if (remark != "") {
          options.remark = App.base64.encode(remark);
        } else {
          options.remark = "";
        }
        var callback = function (json) {
          settings.hideModel();
          search_click();
        };
        App.ajax(bus_cfgs.dispatch.applyAddapi, options, callback);
      }
      // 新增窗口保存按钮
      $("#btn_save", parentView).on("click", _save);
    };
    App.dialog.load({ "url": bus_cfgs.dispatch.requesteditpage, "done": ondone });
  }
  // 打开详情页面
  // @param id            申请单编号
  // @param flownumber    流程编号
  app.plugins.dispatch.requestDetail = function (id, flownumber) {
    var ondone = function (settings) {
      var parentView = $("#" + settings.parent);
      var COLUMNS_APPROVAL = ["审批人", "审批人手机号码", "审批状态", "审批时间", "备注"];
      var COLUMNS_ORDER = ["车牌号", "司机姓名", "司机手机号码", "用车开始时间", "用车结束时间"];
      app.table.render($("#table_approval", parentView), COLUMNS_APPROVAL);
      app.table.render($("#table_order", parentView), COLUMNS_ORDER);

      var options = { "id": id, "flowNumber": flownumber };
      var callback = function (json) {
        var data = json.data;
        $("#username", parentView).val(App.base64.decode(data.useCarName));
        $("#userdept", parentView).val(App.base64.decode(data.useCarDepa));
        $("#usertelphone", parentView).val(data.useCarSim);
        $("#usercount", parentView).val(data.useCarPeopleCount);
        $("#mark", parentView).val(App.base64.decode(data.remark));
        $("#usecarrange", parentView).val(App.util.getDictText("YCFW", data.useCarRange));
        $("#cartype", parentView).val(App.util.getDictText("CLLX", data.carType));

        $("#startaddr", parentView).val(App.base64.decode(data.aboardAddr));
        $("#stopaddr", parentView).val(App.base64.decode(data.dest));
        $("#starttime", parentView).val(data.useCarStartTime);
        $("#stoptime", parentView).val(data.useCarEndTime);
        $("#dispatchstate", parentView).val(App.util.getDictText("DDZT", data.dispatchState));
        $("#registstate", parentView).val(App.util.getDictText("SQZT", data.applyState));
        $("#usecarreason", parentView).val(App.base64.decode(data.useCarReson));
        $("#register", parentView).val(App.base64.decode(data.applyName));
        $("#registerdept", parentView).val(App.base64.decode(data.applyUnit));
        $("#registertelphone", parentView).val(data.applySim);

        var target = $("#table_approval", parentView);
        $("tbody", target).empty();
        $.each(data.approveList, function (index, item) {
          var tr = $("<tr />").appendTo(target);
          App.row.addBase64Text(tr, item.oper_name);
          App.row.addText(tr, item.oper_sim);
          App.row.addBase64Text(tr, item.approveState);
          App.row.addText(tr, item.approveTime);
          App.row.addBase64Text(tr, item.remark);
        });

        target = $("#table_order", parentView);
        $("tbody", target).empty();
        $.each(data.pcdList, function (index, item) {
          var tr = $("<tr />").appendTo(target);
          App.row.addBase64Text(tr, item.platenum);
          App.row.addBase64Text(tr, item.driver_name);
          App.row.addText(tr, item.driver_sim);
          App.row.addText(tr, item.useCarStartTime);
          App.row.addText(tr, item.useCarEndTime);
        });
      };
      App.ajax(bus_cfgs.dispatch.detailsapi, options, callback);
    };
    App.dialog.load({ "url": bus_cfgs.dispatch.detailspage, "done": ondone });
  }
  // 打开调度详情页面
  // @param data          调度详情数据对象
  app.plugins.dispatch.dispatchDetails = function (data) {
    if (!data) { App.alert("获取调度详情失败，请刷新浏览器后重试！"); return;}
    var flownumber = data.flowNumber;
    var default_list_count = "99";
    var pcdList = [];// 派车单缓存列表
    var ondone = function (settings) {
      var parentView = $("#" + settings.parent);

      var COLUMNS_ORDER = ["序号", "车牌号", "司机姓名", "司机手机号码", "用车开始时间", "用车结束时间", "操作"];
      app.table.render($("#table_order", parentView), COLUMNS_ORDER);

      // 注册生成派车单按钮点击事件
      $("#btn_createPCD", parentView).on("click", function () {
        var selected_car = $("#carlist", parentView).val();
        var selected_driver = $("#driverlist", parentView).val();
        var carargs = selected_car.split(",");
        var driverargs = selected_driver.split(",");

        if (carargs == "") {
          App.alert("请选择车辆！");
          return;
        }
        if (driverargs == "") {
          App.alert("请选择司机！");
          return;
        }

        var canpush = 0;
        $.each(pcdList, function (index, item) {
          if (canpush == 0) {
            if (item.car_id == carargs[0]) {
              canpush = 1;
            } else if (item.driver_id == driverargs[0]) {
              canpush = 2;
            }
          }
        });
        if (canpush == 0) {
          pcdList.push({
              "driver_id": driverargs[0]
            , "driver_name": driverargs[1]
            , "driver_sim": driverargs[2]
            , "car_id": carargs[0]
            , "platenum": carargs[1]
            , "useCarStartTime": $("#starttime", parentView).val()
            , "useCarEndTime": $("#stoptime", parentView).val()
            });
          refresh_pcd_list();
        } else if (canpush == 1) {
          App.alert("该车辆已存在派车单，请更换其他车辆！");
        } else {
          App.alert("该司机已存在派车单，请更换其他司机！");
        }

      });
      // 注册保存按钮点击事件
      $("#btn_save", parentView).on("click", function () {
        var data = { "list": pcdList };
        var options = {
          "flowNumber": flownumber
          , "data": App.util.jsonToString(data)
        };
        var callback = function (json) {
          settings.hideModel();
          App.plugins.dispatch.dispatch.search();
        };
        App.ajax(bus_cfgs.dispatch.dispatchapi, options, callback);
      });
      // 查询车辆列表
      var search_car_list = function () {
        var options = { "limit": default_list_count, "start": "1" };
        var callback = function (json) {
          $("#carlist", parentView).append($("<option></option>").val("").text("选择车辆..."));
          $.each(json.data.pList, function (index, item) {
            var args = item.targetId + "," + item.vName;
            var option = $("<option></option>");
            option.val(args);
            var text = App.base64.decode(item.gName)
              + "," + App.base64.decode(item.vName)
              + "," + item.sim
              + "," + App.base64.decode(item.type)
              + "," + App.base64.decode(item.color);
            option.text(text);
            $("#carlist", parentView).append(option);

            $("#carlist", parentView).select2("val", "");
          });
        };
        App.ajax(bus_cfgs.dispatch.carlistapi, options, callback);
      }
      // 查询驾驶员列表
      var search_driver_list = function () {
        var options = { "limit": default_list_count, "start": "1", "vType": "0" };
        var callback = function (json) {
          $("#driverlist", parentView).append($("<option></option>").val("").text("选择司机..."));
          $.each(json.data.pList, function (index, item) {
            var args = item.id + "," + item.vName + "," + App.base64.decode(item.phone);
            var option = $("<option></option>");
            option.val(args);
            var text = App.base64.decode(item.vName)
              + "," + App.base64.decode(item.phone)
              + "," + App.util.getDictText("JSTZT", item.type);
            option.text(text);
            $("#driverlist", parentView).append(option);
          });
          $("#driverlist", parentView).select2("val", "");
        };
        App.ajax(bus_cfgs.dispatch.driverlistapi, options, callback);
      }

      var refresh_pcd_list = function () {
        var target = $("#table_order", parentView);
        $("tbody", target).empty();
        $.each(pcdList, function (index, item) {
          var tr = $("<tr />").appendTo(target);
          App.row.addText(tr, index + 1);
          App.row.addBase64Text(tr, item.platenum);
          App.row.addBase64Text(tr, item.driver_name);
          App.row.addText(tr, item.driver_sim);
          App.row.addText(tr, item.useCarStartTime);
          App.row.addText(tr, item.useCarEndTime);
          var td = App.row.createCell(tr);/* 操作 */
          App.cell.addAction(td, "btn_delete", index, delete_click);
        });
      };

      var delete_click = function () {
        pcdList.removeAt($(this).data("args"));
        refresh_pcd_list();
      }

      $("#username", parentView).val(App.base64.decode(data.useCarName));
      $("#userdept", parentView).val(App.base64.decode(data.useCarDepa));
      $("#usertelphone", parentView).val(data.useCarSim);
      $("#usercount", parentView).val(data.useCarPeopleCount);
      $("#mark", parentView).val(App.base64.decode(data.remark));
      $("#usecarrange", parentView).val(App.util.getDictText("YCFW", data.useCarRange));
      $("#cartype", parentView).val(App.util.getDictText("CLLX", data.carType));

      $("#startaddr", parentView).val(App.base64.decode(data.aboardAddr));
      $("#stopaddr", parentView).val(App.base64.decode(data.dest));
      $("#starttime", parentView).val(data.useCarStartTime);
      $("#stoptime", parentView).val(data.useCarEndTime);
      $("#dispatchstate", parentView).val(App.util.getDictText("DDZT", data.dispatchState));
      $("#registstate", parentView).val(App.util.getDictText("SQZT", data.applyState));
      $("#usecarreason", parentView).val(App.base64.decode(data.useCarReson));
      $("#register", parentView).val(App.base64.decode(data.applyName));
      $("#registerdept", parentView).val(App.base64.decode(data.applyUnit));
      $("#registertelphone", parentView).val(data.applySim);

      search_car_list();
      search_driver_list();

      $.each(data.pcdList, function (index, item) {
        pcdList.push(item);
      });

      refresh_pcd_list();
    };
    App.dialog.load({ "url": bus_cfgs.dispatch.dispatchpage, "done": ondone });
  };
  // 调度完结操作
  app.plugins.dispatch.dispatchOver = function (flowNumber) {
    App.confirm("该操作不可逆", "确定要完成调度？", "", function (isOK) {
      if (isOK) {
        var url = bus_cfgs.dispatch.dispatchOverapi;
        var options = { "flowNumber": flowNumber };
        var callback = function (json) {
          App.plugins.dispatch.dispatch.search();
        };
        App.ajax(url, options, callback);
      }
    });
  };
  // 作废派车单操作
  app.plugins.dispatch.orderCancel = function (id, flowNumber) {
    App.confirm("该操作不可逆", "确定要作废派车单？", "", function (isOK) {
      if (isOK) {
        var url = bus_cfgs.dispatch.orderCancelapi;
        var options = { "id": id, "flow_number": flowNumber };
        var callback = function (json) {
          App.plugins.dispatch.order.search();
        };
        App.ajax(url, options, callback);
      }
    });
  };
  // 派车单归队操作
  app.plugins.dispatch.orderRejoin = function (id, flowNumber, item) {
    var ondone = function (settings) {
      var parentView = $("#" + settings.parent);

      if (item) {
        $("#realChuCarTime", parentView).val(item.realChuCarTime);
        $("#realReturnTime", parentView).val(item.realReturnTime);
        $("#oilCost", parentView).val(item.oilCost);
        $("#roalCost", parentView).val(item.roalCost);
        $("#repairCarCost", parentView).val(item.repairCarCost);
        $("#washCarCost", parentView).val(item.washCarCost);
        $("#accInsuCost", parentView).val(item.accInsuCost);
        $("#otherCost", parentView).val(item.otherCost);
        $("#usedMile", parentView).val(item.usedMile);
        $("#remark", parentView).val(App.base64.decode(item.remark));
        id = item.ID;
        flowNumber = item.flowNumber;
      } else {
        $("#realChuCarTime", parentView).val(App.util.monthFirst());
        $("#realReturnTime", parentView).val(App.util.monthLast());
      }

      var _rejoin = function () {
        var options = { "flowNumber": flowNumber, "id": id };
        // 出车时间
        var realChuCarTime = $("#realChuCarTime", parentView).val();
        if (realChuCarTime) {
          options.realChuCarTime = realChuCarTime;
        }else{
          App.alert("请选择出车时间!");
          return;
        }
        // 归队时间
        var realReturnTime = $("#realReturnTime", parentView).val();
        if (realReturnTime) {
          options.realReturnTime = realReturnTime;
        } else {
          App.alert("请选择归队时间!");
          return;
        }
        // 油耗费用
        var oilCost = $("#oilCost", parentView).val();
        if (oilCost) {
          options.oilCost = oilCost;
        } else {
          App.alert("请输入油耗费用!");
          return;
        }
        // 过路过桥费用
        var roalCost = $("#roalCost", parentView).val();
        if (roalCost) {
          options.roalCost = roalCost;
        }
        // 维修费用
        var repairCarCost = $("#repairCarCost", parentView).val();
        if (repairCarCost) {
          options.repairCarCost = repairCarCost;
        } else {
          App.alert("请输入维修费用!");
          return;
        }
        // 洗车费用
        var washCarCost = $("#washCarCost", parentView).val();
        if (washCarCost) {
          options.washCarCost = washCarCost;
        } else {
          App.alert("请输入洗车费用!");
          return;
        }
        // 事故保险费用
        var accInsuCost = $("#accInsuCost", parentView).val();
        if (accInsuCost) {
          options.accInsuCost = accInsuCost;
        } else {
          App.alert("请输入事故保险费用!");
          return;
        }
        // 其他费用
        var otherCost = $("#otherCost", parentView).val();
        if (otherCost) {
          options.otherCost = otherCost;
        } else {
          App.alert("请输入其他费用!");
          return;
        }
        // 使用里程
        var usedMile = $("#usedMile", parentView).val();
        if (usedMile) {
          options.usedMile = usedMile;
        } else {
          App.alert("请输入使用里程!");
          return;
        }
        var remark = $("#remark", parentView).val();
        if (remark && remark != "") {
          options.remark = App.base64.encode(remark);
        }
        var callback = function (json) {
          settings.hideModel();
          App.plugins.dispatch.rejoin.search();
        };
        App.ajax(bus_cfgs.dispatch.orderRejoinapi, options, callback);
      }
      // 注册归队按钮点击事件
      $("#btn_rejoin", parentView).on("click", function () {
        _rejoin();
      });
    }
    // 加载二级窗口 url：页面路径，done：加载完成后回调函数
    var args = { "width": "700px","height":"570px" };
    var url = bus_cfgs.dispatch.rejoinpage;
    if (App.isTouchDevice) { args = {}; }
    App.dialog.load({ "args": args, "url": url, "done": ondone });
  };
  // 执行审批操作
  app.plugins.dispatch.toapproval = function (flowNumber, type) {
    var ondone = function (settings) {
      var parentView = $("#" + settings.parent);
      var COLUMNS = ["审批人用户名", "审批人姓名", "审批人手机号码", "Email", "备注", "操作"];
      app.table.render($("#table", parentView), COLUMNS);

      App.form.initDict("DDSF", $("#dispatchtype", parentView),true);
      var _initTableRow = function (tr, index, totalindex, item) {
        App.row.addBase64Text(tr, item.login_name);// 审批人用户名
        App.row.addBase64Text(tr, item.name);// 审批人姓名
        App.row.addText(tr, item.telphone);// 审批人手机号码
        App.row.addBase64Text(tr, item.email);// Email
        App.row.addBase64Text(tr, item.intro);// 备注

        var td = App.row.createCell(tr);/* 操作 */
        var args = item.name + "," + item.id + "," + item.telphone
        App.cell.addAction(td, "btn_select", args, _select);
      }
      // 根据条件查询审批人
      var _search = function () {
        var _url = bus_cfgs.setting.operatorlistapi;
        var _options = { "state": "" };
        var username = $("#username", parentView).val();
        if (username != "") {
          _options.userName = App.base64.encode(username);
        }
        var loginname = $("#loginname", parentView).val();
        if (loginname != "") {
          _options.loginName = App.base64.encode(loginname);
        }
        var telphone = $("#telphone", parentView).val();
        if (telphone != "") {
          _options.telphone = telphone;
        }
        var dispatchtype = $("#dispatchtype", parentView).val();
        if (dispatchtype != "") {
          _options.dispatch_identity = dispatchtype;
        }
        var _parsefn = _initTableRow;
        var _target = $("#table", parentView);
        app.table.load({ "api": _url, "args": _options, "parsefn": _parsefn, "target": _target });
      };
      // 选择审批人员
      var _select = function () {
        var args = $(this).attr("data-args").split(",");
        App.confirm("该操作不可逆", "确定要递交给选中的人员审批？", "", function (isOK) {
          if (isOK) {
            var callback = function (json) {
              settings.hideModel();
              _search();
            };
            var options = {};
            var url = "";
            if (type == "Apply") {
              options = {
                "id": flowNumber
                , "approveUserName": args[0]
                , "approveUserID": args[1]
                , "approveUserSim": args[2]
              };
              url = bus_cfgs.dispatch.applySumbitapi;
            } else if (type == "AgreeNext") {
              options = {
                "flowNumber": flowNumber
                , "approveUserName": args[0]
                , "approveUserID": args[1]
                , "approveUserSim": args[2]
              };
              url = bus_cfgs.dispatch.applySumbitapi;
            } else if (type == "AgreeOver") {
              options = {
                "flowNumber": flowNumber
                , "approveResult": "1"
                , "notice_oper_name": args[0]
                , "notice_oper_id": args[1]
                , "notice_oper_sim": args[2]
                , "remark": ""
              };
              url = bus_cfgs.dispatch.applyApproveapi;
            }
            App.ajax(url, options, callback);
          }
        });
      };
      // 重置查询条件
      var _reset = function () {
        $("#username", parentView).val("");
        $("#loginname", parentView).val("");
        $("#telphone", parentView).val("");
        $("#dispatchtype", parentView).select2("val", "");
      };
      // 注册查询按钮点击事件
      $("#btn_search", parentView).on("click", function () {
        _search();
      });
      // 注册重置按钮点击事件
      $("#btn_reset", parentView).on("click", function () {
        _reset();
      });
    };
    // 加载二级窗口 url：页面路径，done：加载完成后回调函数
    var args = { "width": "1200px" };
    var url = bus_cfgs.dispatch.approvalpage;
    if (App.isTouchDevice) { args = {}; }
    App.dialog.load({ "args": args, "url": url, "done": ondone });
  }
  // 执行驳回操作
  app.plugins.dispatch.reject = function (flowNumber, type) {
    var ondone = function (settings) {
      var parentView = $("#" + settings.parent);

      var _reject = function () {
        var options = {
          "flowNumber": flowNumber
        };
        var text = $("#text", parentView).val();
        if (text && text != "") {
          options.remark = App.base64.decode(text);
        }
        var callback = function (json) {
          settings.hideModel();
          search_click();
        };
        App.ajax(bus_cfgs.dispatch.applyAddapi, options, callback);
      }
      var _dispatch_reject = function () {
        var options = {
          "flowNumber": flowNumber
        };
        var text = $("#text", parentView).val();
        if (text && text != "") {
          options.remark = App.base64.decode(text);
        }
        var callback = function (json) {
          settings.hideModel();
          App.plugins.dispatch.dispatch.search();
        };
        App.ajax(bus_cfgs.dispatch.dispatchRejectapi, options, callback);
      }
      // 注册驳回按钮点击事件
      $("#btn_reject", parentView).on("click", function () {
        if (type == "dispatch") {
          _dispatch_reject();
        } else {
          _reject();
        }
      });
    }
    // 加载二级窗口 url：页面路径，done：加载完成后回调函数
    var args = { "width": "500px","height":"600px" };
    var url = bus_cfgs.dispatch.rejectpage;
    if (App.isTouchDevice) { args = {}; }
    App.dialog.load({ "args": args, "url": url, "done": ondone });
  };
})(App);
//公务车管理插件-用车审批模块：
//app.plugins.dispatch.approval
(function (app) {
  var parentView;
  var initTableRow = function (tr, index, totalindex, item) {
    App.row.addText(tr, totalindex);// 序号
    App.row.addText(tr, item.flowNumber);// 流程编号
    App.row.addBase64Text(tr, item.useCarName);// 用车人名称
    App.row.addBase64Text(tr, item.useCarDepa);// 用车人部门
    App.row.addBase64Text(tr, item.applyName);// 申请人名称
    App.row.addBase64Text(tr, item.applyUnit);// 申请人单位
    App.row.addText(tr, item.applyTime);// 申请时间
    App.row.addDictText(tr, "CLZT", item.handleState);// 处理状态

    var td = App.row.createCell(tr);/* 操作 */
    App.cell.addAction(td, "btn_detail", item.flowNumber, detail_click);
    if (item.handleState == "1") { // 不能处理已办的记录
      App.cell.addAction(td, "btn_tonext", item.flowNumber, tonext_click);
      App.cell.addAction(td, "btn_todispatch", item.flowNumber, todispatch_click);
      App.cell.addAction(td, "btn_reject", item.flowNumber, feedback_click);
    }
  }

  var tonext_click = function () {
    App.plugins.dispatch.toapproval($(this).data("args"), "AgreeNext");
  };

  var todispatch_click = function () {
    App.plugins.dispatch.toapproval($(this).data("args"), "AgreeOver");
  };

  var detail_click = function () {
    App.plugins.dispatch.requestDetail("", $(this).data("args"));
  };

  var feedback_click = function () {
    App.plugins.dispatch.reject($(this).data("args"),"approval");
  };

  var reset_click = function () {
    $("#registbegin", parentView).val(App.util.monthFirst());
    $("#registend", parentView).val(App.util.monthLast());
    $("#flownumber", parentView).val("");
    $("#handlestate", parentView).select2("val", "");
  }

  var search_click = function () {
    var url = bus_cfgs.dispatch.approvalQueryapi;
    var options = {};

    var flownumber = $("#flownumber", parentView).val();
    if (flownumber != "") {
      options.flowNumber = flownumber;
    }

    var registbegin = $("#registbegin", parentView).val();
    if (registbegin != "") {
      options.startTime = App.util.urlencode(registbegin);
    }
    var registend = $("#registend", parentView).val();
    if (registend != "") {
      options.endTime = App.util.urlencode(registend);
    }
    var handlestate = $("#handlestate", parentView).val();
    if (handlestate != "") {
      options.handleState = handlestate;
    }

    var parsefn = initTableRow;
    var target = $("#table", parentView);
    app.table.load({ "api": url, "args": options, "parsefn": parsefn, "target": target });
  };

  app.plugins.dispatch.approval = {
    init: function (parent) {
      parentView = $("#" + parent);
      App.form.initDict("CLZT", $("#handlestate", parentView), true);
      var TABLE_COLUMNS = ["序号", "流程编号", "用车人", "用车部门", "申请人人", "申请人单位", "申请时间", "处理状态", "操作"];
      app.table.render($("#table", parentView), TABLE_COLUMNS);
      // 导出按钮
      $("#btn_export", parentView).on("click", function () {
        App.table.exportCSV($("#table", parentView));
      });
      // 重置按钮
      $("#btn_reset", parentView).on("click", function () {
        reset_click();
      });
      // 查询按钮
      $("#btn_search", parentView).on("click", function () {
        search_click();
      });

      reset_click();
    }
  };
})(App);
//公务车管理插件-车辆调度模块：
//app.plugins.dispatch.dispatch
(function (app) {
  var parentView,listbuffer = [];
  var initTableRow = function (tr, index, totalindex, item) {
    if (index == 0) {
      listbuffer = [];
    }
    listbuffer.push(item);
    App.row.addText(tr, totalindex);// 序号
    App.row.addText(tr, item.flowNumber);// 流程编号
    App.row.addBase64Text(tr, item.useCarName);// 用车人名称
    App.row.addBase64Text(tr, item.useCarDepa);// 用车人部门
    App.row.addText(tr, item.useCarStartTime);// 计划用车开始时间
    App.row.addText(tr, item.useCarEndTime);// 计划用车结束时间
    App.row.addBase64Text(tr, item.dest);// 目的地
    App.row.addDictText(tr, "YCFW", item.useCarRange);// 用车范围
    App.row.addBase64Text(tr, item.applyName);// 申请人名称
    App.row.addBase64Text(tr, item.applyUnit);// 申请人单位
    App.row.addDictText(tr, "SQZT", item.applyState);// 申请状态
    App.row.addDictText(tr, "DDZT", item.dispatchState);// 调度状态

    var td = App.row.createCell(tr);/* 操作 */
    if (item.dispatchState == "1" || item.dispatchState == "2") {
      App.cell.addAction(td, "btn_dispatch", index, dispatch_click);
      App.cell.addAction(td, "btn_reject", item.flowNumber, _reject);
    }
    if (item.dispatchState == "1") { // 不能处理已办的记录
      App.cell.addAction(td, "btn_nodispatch", item.flowNumber, _nodispatch);
    }
    if (item.dispatchState == "2") { // 只有“调度中”的情况下才可做“调度完结”操作.
      App.cell.addAction(td, "btn_dispatchfinish", item.flowNumber, _dispatchfinish);
    }
  }
  // 调度按钮
  var dispatch_click = function () {
    var index = $(this).data("args");
    App.plugins.dispatch.dispatchDetails(listbuffer[index]);
  };
  // 无单调度按钮
  var _nodispatch = function () {
    
  };
  // 调度完结按钮
  var _dispatchfinish = function () {
    App.plugins.dispatch.dispatchOver($(this).data("args"));
  };
  // 驳回按钮
  var _reject = function () {
    App.plugins.dispatch.reject($(this).data("args"), "dispatch");
  };

  var reset_click = function () {
    $("#usecarstarttime", parentView).val(App.util.monthFirst());
    $("#usecarendtime", parentView).val(App.util.monthLast());
    $("#username", parentView).val("");
    $("#userdept", parentView).val("");
    $("#registname", parentView).val("");
    $("#registdept", parentView).val("");
    $("#dispatchstate", parentView).select2("val", "");
  }
  // 查询车辆调度信息列表
  var search_click = function () {
    var url = bus_cfgs.dispatch.dispatchlistapi;
    var options = {};

    var username = $("#username", parentView).val();
    if (username != "") {
      options.useCarName = App.base64.encode(username);
    }
    var userdept = $("#userdept", parentView).val();
    if (userdept != "") {
      options.useCarDepa = App.base64.encode(userdept);
    }
    var registname = $("#registname", parentView).val();
    if (registname != "") {
      options.applyName = App.base64.encode(registname);
    }
    var registdept = $("#registdept", parentView).val();
    if (registdept != "") {
      options.applyUnit = App.base64.encode(registdept);
    }
    var dispatchState = $("#dispatchstate", parentView).val();
    if (dispatchState != "") {
      options.dispatchState = dispatchState;
    }
    var usecarstarttime = $("#usecarstarttime", parentView).val();
    if (usecarstarttime != "") {
      options.useCarStartTime = App.util.urlencode(usecarstarttime);
    }
    var usecarendtime = $("#usecarendtime", parentView).val();
    if (usecarendtime != "") {
      options.useCarEndTime = App.util.urlencode(usecarendtime);
    }
    var parsefn = initTableRow;
    var target = $("#table", parentView);
    app.table.load({ "api": url, "args": options, "parsefn": parsefn, "target": target });
  };

  app.plugins.dispatch.dispatch = {
    "init": function (parent) {
      parentView = $("#" + parent);

      App.form.initDict("DDZT", $("#dispatchstate", parentView), true);
      var TABLE_COLUMNS = ["序号", "流程编号", "用车人", "用车部门", "计划用车时间", "计划返回时间", "目的地", "用车范围", "申请人", "申请单位", "申请状态", "调度状态", "操作"];
      app.table.render($("#table", parentView), TABLE_COLUMNS);
      // 导出按钮
      $("#btn_export", parentView).on("click", function () {
        App.table.exportCSV($("#table", parentView));
      });
      // 重置按钮
      $("#btn_reset", parentView).on("click", function () {
        reset_click();
      });
      // 查询按钮
      $("#btn_search", parentView).on("click", function () {
        search_click();
      });
      reset_click();
    }
    , "search": function () {
      search_click();
    }
  };
})(App);
//公务车管理插件-派车单管理模块：
//app.plugins.dispatch.order
(function (app) {
  var parentView;
  // 删除
  var remove_click = function () {
    var args = $(this).data("args").split(",");
    App.plugins.dispatch.orderCancel(args[0], args[1]);
  };
  var reset_click = function(){
    $("#flownumber",parentView).val("");
    $("#registname",parentView).val("");
    $("#dispatchstate",parentView).select2("val","");
    $("#starttime", parentView).val(App.util.monthFirst());
    $("#endtime", parentView).val(App.util.monthLast());
  };
  var search_click = function () {
    var url = bus_cfgs.dispatch.orderlistapi;
    var options = {};

    var flowNumber = $("#flowNumber", parentView).val();
    if (flowNumber != "") {
      options.flowNumber = flowNumber;
    }
    var registname = $("#registname", parentView).val();
    if (registname != "") {
      options.applyName = App.base64.encode(registname);
    }
    var dispatchstate = $("#dispatchstate", parentView).val();
    if (dispatchstate != "") {
      options.dispatchState = dispatchstate;
    }
    var usecarstarttime = $("#starttime", parentView).val();
    if (usecarstarttime != "") {
      options.useCarStartTime = App.util.urlencode(usecarstarttime);
    }
    var usecarendtime = $("#endtime", parentView).val();
    if (usecarendtime != "") {
      options.useCarEndTime = App.util.urlencode(usecarendtime);
    }
    var parsefn = function (tr, index, totalindex, item) {
      App.row.addText(tr, totalindex);// 序号
      App.row.addText(tr, item.flowNumber);// 流程编号
      App.row.addBase64Text(tr, item.platenum);// 车牌号
      App.row.addBase64Text(tr, item.driver_name);// 司机姓名
      App.row.addBase64Text(tr, item.useCarName);// 用车人名称
      App.row.addBase64Text(tr, item.useCarDepa);// 用车人部门
      App.row.addBase64Text(tr, item.applyName);// 申请人名称
      App.row.addBase64Text(tr, item.applyUnit);// 申请人单位
      App.row.addText(tr, item.useCarStartTime);// 计划用车开始时间
      App.row.addText(tr, item.useCarEndTime);// 计划用车结束时间
      App.row.addDictText(tr, "DDZT", item.dispatchState);// 调度状态

      var td = App.row.createCell(tr);/* 操作 */
      if (item.dispatchState == "2") {
        App.cell.addAction(td, "btn_delete", item.ID + "," + item.flowNumber, remove_click);
      }
    };
    var target = $("#table", parentView);
    app.table.load({ "api": url, "args": options, "parsefn": parsefn, "target": target });
  }

  app.plugins.dispatch.order = {
    "init": function (parent) {
      parentView = $("#" + parent);

      App.form.initDict("DDZT", $("#dispatchstate", parentView), true);
      var TABLE_COLUMNS = ["序号", "流程编号", "车牌", "司机", "用车人", "用车单位", "申请人", "申请单位", "预计用车时间", "预计返回时间", "调度状态", "操作"];
      app.table.render($("#table", parentView), TABLE_COLUMNS);
      // 导出按钮
      $("#btn_export", parentView).on("click", function () {
        App.table.exportCSV($("#table", parentView));
      });
      // 重置按钮
      $("#btn_reset", parentView).on("click", function () {
        reset_click();
      });
      $("#btn_search", parentView).on("click", function () {
        search_click();
      });
      reset_click();
    }
    , "search": function () {
      search_click();
    }
  };
})(App);
//公务车管理插件-车辆归队模块：
//app.plugins.dispatch.rejoin
(function (app) {
  var parentView,listbuffer = [];

  var edit_click = function () {
    var index = $(this).data("args");
    App.plugins.dispatch.orderRejoin("", "", listbuffer[index]);
  };

  var carback_click = function () {
    var args = $(this).data("args").split(",");
    App.plugins.dispatch.orderRejoin(args[0], args[1]);
  };

  var reset_click = function () {
    $("#flownumber", parentView).val("");
    $("#userdept", parentView).val("");
    $("#carnumber", parentView).val("");
    $("#drivername", parentView).val("");
    $("#frombegin", parentView).val(App.util.monthFirst());
    $("#fromend", parentView).val(App.util.monthLast());
    $("#tobegin", parentView).val(App.util.monthFirst());
    $("#toend", parentView).val(App.util.monthLast());
    $("#fromstate", parentView).select2("val", "");
  };
  
  var search_click = function () {
    var url = bus_cfgs.dispatch.rejoinlistapi;
    var options = {};

    var flownumber = $("#flownumber", parentView).val();
    if (flownumber != "") {
      options.flow_number = flownumber;
    }
    var userdept = $("#userdept", parentView).val();
    if (userdept != "") {
      options.useCarDepa = App.base64.encode(userdept);
    }
    var carnumber = $("#carnumber", parentView).val();
    if (carnumber != "") {
      options.platenum = App.base64.encode(carnumber);
    }
    var drivername = $("#drivername", parentView).val();
    if (drivername != "") {
      options.driver_id = App.base64.encode(drivername);
    }
    var frombegin = $("#frombegin", parentView).val();
    if (frombegin != "") {
      options.chucarStime = frombegin;
    }
    var fromend = $("#fromend", parentView).val();
    if (fromend != "") {
      options.chucarEtime = fromend;
    }
    var tobegin = $("#tobegin", parentView).val();
    if (tobegin != "") {
      options.returnEtime = tobegin;
    }
    var toend = $("#toend", parentView).val();
    if (toend != "") {
      options.returnEtime = toend;
    }
    var fromstate = $("#fromstate", parentView).val();
    if (fromstate != "") {
      options.chucarState = fromstate;
    }
    var parsefn = function (tr, index, totalindex, item) {
      if (index == 0) {
        listbuffer = [];
      }
      listbuffer.push(item);
      App.row.addText(tr, totalindex);// 序号
      App.row.addBase64Text(tr, item.platenum);// 车牌号
      App.row.addBase64Text(tr, item.driver_name);// 司机姓名
      App.row.addBase64Text(tr, item.useCarDepa);// 用车人部门
      App.row.addDictText(tr, "CCZT", item.chucarState);// 出车状态
      App.row.addText(tr, item.useCarStartTime);// 计划出车时间
      App.row.addText(tr, item.realChuCarTime);// 实际出车时间
      App.row.addText(tr, item.useCarEndTime);// 计划归队时间
      App.row.addText(tr, item.realReturnTime);// 实际归队时间
      App.row.addBase64Text(tr, item.remark);// 备注 
      var td = App.row.createCell(tr);/* 操作 */

      if (item.chucarState == "1") {
        App.cell.addAction(td, "btn_carback", item.ID + "," + item.flowNumber, carback_click);
      }
      if (item.chucarState == "2") {
        App.cell.addAction(td, "btn_edit", index, edit_click);
      }
    }
    var target = $("#table", parentView);
    app.table.load({ "api": url, "args": options, "parsefn": parsefn, "target": target });
  };

  app.plugins.dispatch.rejoin = {
    "init": function (parent) {
      var parentView = $("#" + parent);
      App.form.initDict("CCZT", $("#fromstate", parentView), true);
      var TABLE_COLUMNS = ["序号", "车牌", "司机", "用车单位", "出车状态", "预计出车时间", "实际出车时间", "预计归队时间", "实际归队时间", "备注", "操作"];
      app.table.render($("#table", parentView), TABLE_COLUMNS);
      // 导出按钮
      $("#btn_export", parentView).on("click", function () {
        App.table.exportCSV($("#table", parentView));
      });
      // 重置按钮
      $("#btn_reset", parentView).on("click", function () {
        reset_click();
      });
      // 查询按钮
      $("#btn_search", parentView).on("click", function () {
        search_click();
      });
      reset_click();
    }
    , "search": function () {
      search_click();
    }
  };
})(App);
