/* ========================================================================
 * modules.server v1.0
 * 0101.服务器状态监控
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * ======================================================================== */
define([], function () {
  "use strict";
  var plugin;

  return {
    'define': {
      "name": "服务器监控模块",
      "version": "1.0.0.0",
      'copyright': ' Copyright 2017-2027 WangXin nvlbs,Inc.',
    },

    "status": function () {
      require(['plugins/plugins-chart'], plugin => {
        plugin.init('echarts-chart', 'home-maptotal');
      });
    },

    init: function () {

      setTimeout(function () {
        require(['plugins/plugins-chart'], plugin => {
          plugin.init('echarts-ser', 'system-monitor-service');

          var chartID = 'echarts-cpu', value = Math.round(Math.random() * 100);
          if (value < 70) {
            $("#" + chartID).parent().parent().addClass("panel-success");
          } else if (value < 90) {
            $("#" + chartID).parent().parent().addClass("panel-warning");
          } else {
            $("#" + chartID).parent().parent().addClass("panel-danger");
          }
          plugin.init(chartID, 'system-monitor', { value: value });

          chartID = 'echarts-mem', value = Math.round(Math.random() * 100);
          if (value < 70) {
            $("#" + chartID).parent().parent().addClass("panel-success");
          } else if (value < 90) {
            $("#" + chartID).parent().parent().addClass("panel-warning");
          } else {
            $("#" + chartID).parent().parent().addClass("panel-danger");
          }
          plugin.init(chartID, 'system-monitor', { value: value });

          chartID = 'echarts-hd', value = Math.round(Math.random() * 100);
          if (value < 70) {
            $("#" + chartID).parent().parent().addClass("panel-success");
          } else if (value < 90) {
            $("#" + chartID).parent().parent().addClass("panel-warning");
          } else {
            $("#" + chartID).parent().parent().addClass("panel-danger");
          }
          plugin.init(chartID, 'system-monitor', { value: value });
        });
      }, 300);

    },

    /** 卸载模块 */
    destroy: function () {
      if (plugin && typeof plugin.destroy === 'function') {
        plugin.destroy();
      }
    }
  }

});
