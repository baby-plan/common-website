define(['jquery', 'QDP'], function ($, QDP) {
  "use strict";

  let charts = [];

  var _internal_init_chart = (targetid, chartid, args) => {
    let chart_parent = $('#' + targetid).parent();
    QDP.block.show('初始化图表...', chart_parent);
    require(['modules/charts/' + chartid], chart => {
      chart.init(targetid, args);
      charts.push(chart);
      setTimeout(() => {
        QDP.block.close(chart_parent);
      }, 100);
    });
  };

  return {
    /** 加载模块 */
    init: function (targetid, chartid, args) {
      setTimeout(function () {
        _internal_init_chart(targetid, chartid, args);
      }, 300);
    },
    /** 卸载模块 */
    destroy: function () {
      charts.forEach((chart) => {
        chart.destroy();
      });
      charts = [];
    }
  }

});