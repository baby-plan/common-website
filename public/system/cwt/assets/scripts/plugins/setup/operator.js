//操作员信息设置插件
 (function (app) {

  var TABLE_COLUMNS = ["操作员用户名","操作员姓名","操作员手机号","Emile","备注","激活状态","操作员类型","操作员状态"];
  //
  var initTableRow = function (tr, index, totalindex, item) {
	  $(bus_cfgs.templates.cell).text(App.base64.decode(item.loginName)).appendTo(tr);// 操作员用户名
    $(bus_cfgs.templates.cell).text(App.base64.decode(item.userName)).appendTo(tr);// 操作员姓名
    $(bus_cfgs.templates.cell).text(App.base64.decode(item.telphone)).appendTo(tr);// 操作员手机号
    $(bus_cfgs.templates.cell).text(item.Emile).appendTo(tr);// Emile
    $(bus_cfgs.templates.cell).text(item.remark).appendTo(tr);// 备注
    $(bus_cfgs.templates.cell).text(item.active).appendTo(tr);// 激活状态
    $(bus_cfgs.templates.cell).text(item.type).appendTo(tr);//操作员类型
    $(bus_cfgs.templates.cell).text(item.state).appendTo(tr);//操作员状态
  }

  var getOptions = function (parentView) {
    var options = {};
    var userName = $("#userName", parentView).val();
    if (userName != "") {
		options.userName = App.base64.encode(userName);
	}
    var options = {};
    var loginName = $("#loginName", parentView).val();
    if (loginName != "") {
		options.loginName = App.base64.encode(loginName);
	}
    var options = {};
    var telphone = $("#telphone", parentView).val();
    if (telphone != "") {
		options.telphone = App.base64.encode(telphone);
	}
    var options = {};
    var state = $("#state", parentView).val();
    if (state != "") {
		options.endTime = state;
	}
   
    $("#doUpdate", parentView).on("click", function () {
	    // 加载二级窗口 url：页面路径，done：加载完成后回调函数
	    App.dialog.load({
	      "url": "views/newsletter/setup_operator_update.html"
	      , "done": function (options) {

	        var parentView = $("#" + options.parent);
	        $("#doDelete", parentView).on("click", function () {
	          //App.alert("查询");
	          App.services.car.fill($("#treeview", parentView));
	        });

	      }
	    });

	  });
  $("#doInfo", parentView).on("click", function () {
	    // 加载二级窗口 url：页面路径，done：加载完成后回调函数
	    App.dialog.load({
	      "url": "views/newsletter/setup_operator_info.html"
	      , "done": function (options) {

	        var parentView = $("#" + options.parent);
	        $("#doInfo", parentView).on("click", function () {
	          //App.alert("查询");
	          App.services.car.fill($("#treeview", parentView));
	        });

	      }
	    });

	  });
  $("#doInfoone", parentView).on("click", function () {
	    // 加载二级窗口 url：页面路径，done：加载完成后回调函数
	    App.dialog.load({
	      "url": "views/newsletter/setup_operator_info_infoone.html"
	      , "done": function (options) {

	        var parentView = $("#" + options.parent);
	        $("#doInfo", parentView).on("click", function () {
	          //App.alert("查询");
	          App.services.car.fill($("#treeview", parentView));
	        });

	      }
	    });

	  });
  $("#doInfotwo", parentView).on("click", function () {
	    // 加载二级窗口 url：页面路径，done：加载完成后回调函数
	    App.dialog.load({
	      "url": "views/newsletter/setup_operator_info_infotwo.html"
	      , "done": function (options) {

	        var parentView = $("#" + options.parent);
	        $("#doInfo", parentView).on("click", function () {
	          //App.alert("查询");
	          App.services.car.fill($("#treeview", parentView));
	        });

	      }
	    });

	  });
  };

  app.plugins.setup.operator = {
    init: function (parent) {
     var parentView = $("#" + parent);
      var treeView = $("#treeview", parentView);
      App.services.car.fill(treeView);
      app.table.render($("#table", parentView), TABLE_COLUMNS);
      //导出按钮
      $("#doExport", parentView).on("click", function () {
        App.table.exportCSV($("#table", parentView));
        //App.alert("尚未实现该功能");
      });
      //重置按钮
      $("#doReset", parentView).on("click", function () {
        $("#usecarstarttime", parentView).val(App.util.monthFirst());
        $("#usecarendtime", parentView).val(App.util.monthLast());
      });
      //查询按钮
      $("#doSearch", parentView).on("click", function () {
        var url = bus_cfgs.setting.operatorListapi;
        var options = getOptions(parentView);
        var parsefn = initTableRow;
        var target = $("#table", parentView);
        app.table.load({ "api": url, "args": options, "parsefn": parsefn, "target": target });
      });//$("#doSearch", parentView).on("click", function () {

      $("#doReset", parentView).click();
    }
  };
})(App);
