/*车辆信息设置插件*/
(function(app) {

	var TABLE_COLUMNS = [ "分组", "车辆名称", "SIM卡号", "车辆类型", "车辆颜色", "驾驶员" ];
	var initTableRow = function(tr, index, totalindex, item) {
		//分组名称
		$(bus_cfgs.templates.cell).text(App.base64.decode(item.gName))
				.appendTo(tr);
		// 车辆名称
		$(bus_cfgs.templates.cell).text(App.base64.decode(item.vName))
				.appendTo(tr);
		// SIM卡号
		$(bus_cfgs.templates.cell).text(item.sim).appendTo(tr);
		// 车辆类型
		$(bus_cfgs.templates.cell).text(App.base64.decode(item.type)).appendTo(
				tr);
		// 车辆颜色
		$(bus_cfgs.templates.cell).text(item.color).appendTo(tr);
		// 驾驶员
		$(bus_cfgs.templates.cell).text(App.base64.decode(item.driver))
				.appendTo(tr);
	}

	var getOptions = function(parentView) {
		var options = {};
		// 分组名称
		var gName = $("#gName", parentView).val();
		if (gName != "") {
			options.gName = App.base64.encode(gName);
		}
		// 驾驶员
		var driver = $("#driver", parentView).val();
		if (driver != "") {
			options.driver = App.base64.encode(driver);
		}
		// 车辆名称
		var vName = $("#vName", parentView).val();
		if (vName != "") {
			options.vName = App.base64.encode(vName);
		}
		// sim卡号
		var sim = $("#sim", parentView).val();
		if (sim != "") {
			options.endTime = sim;
		}
		$("#doUpdate", parentView).on("click", function() {
			// 加载二级窗口 url：页面路径，done：加载完成后回调函数
			App.dialog.load({
				"url" : "views/newsletter/setup_vehicleinfo_update.html",
				"done" : function(options) {

					var parentView = $("#" + options.parent);
					$("#doUpdate", parentView).on("click", function() {
						// App.alert("查询");
						App.services.car.fill($("#treeview", parentView));
					});

				}
			});

		});
		$("#doEwm", parentView).on("click", function() {
			// 加载二级窗口 url：页面路径，done：加载完成后回调函数
			App.dialog.load({
				"url" : "views/newsletter/setup_vehicleinfo_info_info.html",
				"done" : function(options) {

					var parentView = $("#" + options.parent);
					$("#doEwm", parentView).on("click", function() {
						// App.alert("查询");
						App.services.car.fill($("#treeview", parentView));
					});

				}
			});

		});
		$("#doInfo", parentView).on("click", function() {
			// 加载二级窗口 url：页面路径，done：加载完成后回调函数
			App.dialog.load({
				"url" : "views/newsletter/setup_vehicleinfo_info.html",
				"done" : function(options) {

					var parentView = $("#" + options.parent);
					$("#doInfo", parentView).on("click", function() {
						// App.alert("查询");
						App.services.car.fill($("#treeview", parentView));
					});

				}
			});

		});

		return options;
	};

	app.plugins.setup.setvehicleinfo = {
		init : function(parent) {
			var parentView = $("#" + parent);
			var treeView = $("#treeview", parentView);
			App.services.car.fill(treeView);
			app.table.render($("#table", parentView), TABLE_COLUMNS);
			// 导出按钮
			$("#doExport", parentView).on("click", function() {
				App.table.exportCSV($("#table", parentView));
				// App.alert("尚未实现该功能");
			});
			// 重置按钮
			$("#doReset", parentView).on("click", function() {
				$("#usecarstarttime", parentView).val(App.util.monthFirst());
				$("#usecarendtime", parentView).val(App.util.monthLast());
			});
			// 查询按钮
			$("#doSearch", parentView).on("click", function() {
				var url = bus_cfgs.setting.vehicleListapi;
				var options = getOptions(parentView);
				var parsefn = initTableRow;
				var target = $("#table", parentView);
				app.table.load({
					"api" : url,
					"args" : options,
					"parsefn" : parsefn,
					"target" : target
				});
			});// $("#doSearch", parentView).on("click", function () {

			$("#doReset", parentView).click();
		}
	};
})(App);
