//公务车管理插件-用车申请模块：
//app.plugins.dispatch.request
//scripts/plugins/dispatch/request.js
(function (app) {
  // 初始化时间选择控件
  var initDatetimeControl = function (parentView) {
    $(".form_datetime", parentView).datetimepicker({
      isRTL: App.isRTL,
      format: "yyyy-mm-dd hh:ii",
      autoclose: true,
      todayBtn: true,
      language: "zh-CN",
      startDate: "2013-02-14 10:00",
      pickerPosition: (App.isRTL ? "bottom-right" : "bottom-left"),
      minuteStep: 10
    });
  }
  // 初始化下拉列表控件
  var initCombobox = function (parentView) {

    $.each(bus_cfgs.dict.KEFU, function (index, item) {
      $("#registstate", parentView).append($("<option/>").val(index).text((item.text) ? item.text : item));
    });
    $("#registstate", parentView).val("");
    
    $.each(bus_cfgs.dict.DDZT, function (index, item) {
      $("#dispatchstate", parentView).append($("<option/>").val(index).text((item.text) ? item.text : item));
    });
    $("#dispatchstate", parentView).val("");

    $.each(bus_cfgs.dict.YCFW, function (index, item) {
      $("#usecarrange", parentView).append($("<option/>").val(index).text((item.text) ? item.text : item));
    });
    $("#usecarrange", parentView).val("");
  }
  var TABLE_COLUMNS = ["标题","创建时间","反馈类型","回复时间","回复内容"];
  //
  var initTableRow = function (tr, index, totalindex, item) {
    $(bus_cfgs.templates.cell).text(totalindex).appendTo(tr);// 序号
    $(bus_cfgs.templates.cell).text(item.flowNumber).appendTo(tr);// 流程编号
    $(bus_cfgs.templates.cell).text(App.base64.decode(item.useCarName)).appendTo(tr);// 用车人名称
    $(bus_cfgs.templates.cell).text(App.base64.decode(item.useCarDepa)).appendTo(tr);// 用车人部门 

    $(bus_cfgs.templates.cell).text(item.useCarStartTime).appendTo(tr);// 计划用车开始时间
    $(bus_cfgs.templates.cell).text(item.useCarEndTime).appendTo(tr);// 计划用车结束时间
    $(bus_cfgs.templates.cell).text(App.base64.decode(item.dest)).appendTo(tr);// 目的地 
    $(bus_cfgs.templates.cell).text(App.util.getDictText("YCFW", item.useCarRange)).appendTo(tr);// 计划用车结束时间

    $(bus_cfgs.templates.cell).text(App.base64.decode(item.applyName)).appendTo(tr);// 申请人名称
    $(bus_cfgs.templates.cell).text(App.base64.decode(item.applyUnit)).appendTo(tr);// 申请人单位
    $(bus_cfgs.templates.cell).text(item.applyTime).appendTo(tr);// 申请时间
    $(bus_cfgs.templates.cell).text(App.util.getDictText("SQZT", item.applyState)).appendTo(tr);// 申请状态
    $(bus_cfgs.templates.cell).text(App.util.getDictText("DDZT", item.State)).appendTo(tr);// 申请状态
    //$(bus_cfgs.templates.cell).text(getDictText("rolestate", item.state)).appendTo(tr); // 角色状态
    var td = $(bus_cfgs.templates.cell).appendTo(tr);/* 操作 */
    var action;
    action = $("<a />").appendTo(td);
    action.html(bus_cfgs.options.texts["edit"]);
    action.addClass(bus_cfgs.options.styles["edit"]);
    action.attr("data-args",index);
    action.on("click", edit_click);
  }

  var edit_click = function () {

    var index = $(this).attr("data-args");
    var data;
    if (index) {
      data = App.table.getdata(index);
    }

    var ondone = function (options) {
      var childParentView = $("#" + options.parent);

      initCombobox(childParentView);
      initDatetimeControl(childParentView);

      $("#username", childParentView).val(App.base64.decode(data.useCarName));
      $("#userdept", childParentView).val(App.base64.decode(data.useCarDepa));
      $("#registstate", childParentView).val(data.applyState);
      $("#dispatchstate", childParentView).val(data.dispatchState);
      $("#usecarrange", childParentView).val(data.useCarRange);
      $("#usecarstarttime", childParentView).val(data.useCarStartTime);
      $("#usecarendtime", childParentView).val(data.useCarEndTime);
    };
    // 加载二级窗口 url：页面路径，done：加载完成后回调函数
    App.dialog.load({ "args": { "width": "800px" }, "url": bus_cfgs.dispatch.requesteditpage, "done": ondone });
  };

  var getOptions = function (parentView) {
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
      options.useCarStartTime = usecarstarttime;
    }
    var usecarendtime = $("#usecarendtime", parentView).val();
    if (usecarendtime != "") {
      options.useCarEndTime = usecarendtime;
    }
    return options;
  };

  App.plugins.servicecenter.service = {
    init: function (parent) {
      var parentView = $("#" + parent);

      initCombobox(parentView);
      initDatetimeControl(parentView);
      App.table.render($("#table", parentView), TABLE_COLUMNS);

      $("#doAdd", parentView).on("click", function () {
        var ondone = function (options) {
          var childParentView = $("#" + options.parent);

          initCombobox(childParentView);
          initDatetimeControl(childParentView);
        };
        // 加载二级窗口 url：页面路径，done：加载完成后回调函数
        App.dialog.load({ "args": { "width": "800px" }, "url": bus_cfgs.dispatch.requesteditpage, "done": ondone });
      });//$("#doAdd", parentView).on("click", function () {

      $("#doExport", parentView).on("click", function () {
        App.alert("尚未实现该功能");
      });//$("#doExport", parentView).on("click", function () {

      $("#doSearch", parentView).on("click", function () {
        var url = bus_cfgs.dispatch.requestlistapi;
        var options = getOptions(parentView);
        var parsefn = initTableRow;
        var target = $("#table", parentView);
        app.table.load({ "api": url, "args": options, "parsefn": parsefn, "target": target });
      });//$("#doSearch", parentView).on("click", function () {
    }
  };
})(App);
