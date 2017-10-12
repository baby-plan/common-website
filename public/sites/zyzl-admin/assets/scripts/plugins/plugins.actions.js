define(['jquery', 'QDP'], function ($, QDP) {
  "use strict";
  // 用户登录后自动加载数据库字典表内容
  // EVENT-ON:layout.started
  QDP.event.on("layout.started", function () {
    console.info("注册->系统运行后自动注册 - plugins-actions");
  });

});