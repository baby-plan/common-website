/* ========================================================================
 * modules.server v1.0
 * 0101.服务器状态监控
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * ======================================================================== */
define(['QDP', 'jquery.tmpl', 'jquery.tmplPlus', 'echarts'], function (QDP) {
  "use strict";

  let charts = [];

  var _internal_init_chart = (id, url) => {
    let chart_parent = $('#' + id).parent();
    QDP.block.show('初始化图表...', chart_parent);
    require(['modules/charts/' + url], chart => {
      chart.init(id);
      charts.push(chart);
      setTimeout(() => {
        QDP.block.close(chart_parent);
      }, 100);
    });
  };

  var resizeContainer = function () {
    var windowHeight = $(window).outerHeight();
    var breadcrumbHeight = $(".content-header").outerHeight();
    // 20为#ajax-content的上填充合，padding-top:20px
    $('#echarts-chart').height(windowHeight - breadcrumbHeight - 20);
  }

  $(window).on('resize', resizeContainer);

  return {
    'define': {
      "name": "服务器监控模块",
      "version": "1.0.0.0",
      'copyright': ' Copyright 2017-2027 WangXin nvlbs,Inc.',
    },
    "status": function () {
      resizeContainer();

      setTimeout(function () {
        _internal_init_chart('echarts-chart', 'map2Chart');
      }, 300);
    },
    init: function () {

      setTimeout(function () {
        _internal_init_chart('echarts-cpu', 'serverChart');
        _internal_init_chart('echarts-mem', 'serverChart');
        _internal_init_chart('echarts-hd', 'serverChart');
        _internal_init_chart('echarts-ser', 'serverChart');
      }, 300);

    },
    /** 卸载模块 */
    destroy: function () {
      $(window).off('resize', resizeContainer);
      charts.forEach((chart) => {
        chart.destroy();
      });
      charts = [];
    }
  }

});
