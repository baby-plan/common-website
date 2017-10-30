define(['jquery', 'QDP'], function ($, QDP) {
  "use strict";
  // EVENT-ON:layout.started
  QDP.on("layout.started", function () {
    console.info("注册->系统运行后自动注册 - plugins-table-color - 审核发布状态渲染插件");
    // EVENT-ON:generator.parse.row
    QDP.on('generator.parse.row', parse_row_handler);
  });

  /**
   * 
   * @param {JSON} eventArgs 
   */
  var parse_row_handler = function (eventArgs) {
    var args = eventArgs.args;

    if (args.data.audit_status == "0") {
      args.row.addClass("status-unaudit");
    }
    if (args.data.publish_status == "1") {
      args.row.addClass("status-publish");
    } else if (args.data.publish_status == "0") {
      args.row.addClass("status-audit");
    }
  }

});