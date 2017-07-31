
/* ========================================================================
 * App.plugins.options v1.0
 * 201.系统参数设置插件
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  "use strict";
  // 系统运行后自动加载数据库字典表内容
  App.addLoadedExecuteFunc(function (next) {
    App.logger.info("[AUTO]加载服务器设置内容!");
    var url = API.options.getapi;
    App.ajax(url, {}, function (json) {
      $.each(json.data, function (index, item) {
        if (cfgs.settings[item[0]] == undefined) {
          cfgs.settings[item[0]] = {};
        }
        cfgs.settings[item[0]] = App.base64.decode([item[1]]);
      });
      next();
    });
  });
  app.plugins.options = {
    "system": {
      "init": function () {
        App.form.init();
        var api = API.options.getoptionapi;
        var keys = "password,pagesize";
        keys = App.base64.encode(keys);
        App.ajax(api, { "keys": keys }, function (json) {
          $("#password").val(App.base64.decode(json.data.password));
          $("#pagesize").val(App.base64.decode(json.data.pagesize));
        });
        // 处理保存按钮事件
        $(".btn_save").on("click", function (e) {
          e.preventDefault();
          var options = {
            "password": App.base64.encode($("#password").val()),
            "pagesize": App.base64.encode($("#pagesize").val())
          };

          // 执行操作并且重新加载页面,用于刷新数据
          App.ajax(API.options.setoptionapi, options, function (json) { App.alertText("保存设置成功!"); });
        });
      }
    }
  };
})(App);