var setvehicleinfo= function (parent) {
  var parentView = $("#" + parent);
  var treeView = $("#treeview", parentView);
  App.services.car.fill(treeView);

  $("#doUpdate", parentView).on("click", function () {
    // 加载二级窗口 url：页面路径，done：加载完成后回调函数
    App.dialog.load({
      "url": "views/newsletter/setup_vehicleinfo_update.html"
      , "done": function (options) {

        var parentView = $("#" + options.parent);
        $("#doUpdate", parentView).on("click", function () {
          //App.alert("查询");
          App.services.car.fill($("#treeview", parentView));
        });

      }
    });

  });
  $("#doEwm", parentView).on("click", function () {
	    // 加载二级窗口 url：页面路径，done：加载完成后回调函数
	    App.dialog.load({
	      "url": "views/newsletter/setup_vehicleinfo_info_info.html"
	      , "done": function (options) {

	        var parentView = $("#" + options.parent);
	        $("#doEwm", parentView).on("click", function () {
	          //App.alert("查询");
	          App.services.car.fill($("#treeview", parentView));
	        });

	      }
	    });

	  });
  $("#doInfo", parentView).on("click", function () {
	    // 加载二级窗口 url：页面路径，done：加载完成后回调函数
	    App.dialog.load({
	      "url": "views/newsletter/setup_vehicleinfo_info.html"
	      , "done": function (options) {

	        var parentView = $("#" + options.parent);
	        $("#doInfo", parentView).on("click", function () {
	          //App.alert("查询");
	          App.services.car.fill($("#treeview", parentView));
	        });

	      }
	    });

	  });
}