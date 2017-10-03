var setuplocation = function (parent) {
  var parentView = $("#" + parent);
  var treeView = $("#treeview", parentView);
  App.services.car.fill(treeView);

  $("#doAdd", parentView).on("click", function () {
    // 加载二级窗口 url：页面路径，done：加载完成后回调函数
    App.dialog.load({
      "url": "views/newsletter/setup_location_add.html"
      , "done": function (options) {

        var parentView = $("#" + options.parent);
        $("#doAdd", parentView).on("click", function () {
          //App.alert("查询");
          App.services.car.fill($("#treeview", parentView));
        });

      }
    });

  });
  $("#doDelete", parentView).on("click", function () {
	    // 加载二级窗口 url：页面路径，done：加载完成后回调函数
	    App.dialog.load({
	      "url": "views/newsletter/setup_location_delete.html"
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
	      "url": "views/newsletter/setup_location_info.html"
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