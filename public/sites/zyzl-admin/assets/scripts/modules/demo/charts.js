define(["QDP", 'echarts'], function (QDP) {
  "use strict";
  let module = {};
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

  var initcharts = () => {
    _internal_init_chart('echarts-line-chart', 'lineChart');
    _internal_init_chart('echarts-bar-chart', 'barChart');
    _internal_init_chart('echarts-chord-chart', 'chordChart');
    _internal_init_chart('echarts-force-chart', 'forceChart');
    _internal_init_chart('echarts-funnel-chart', 'funnelChart');
    _internal_init_chart('echarts-gauge-chart', 'gaugeChart');
    _internal_init_chart('echarts-k-chart', 'kChart');
    _internal_init_chart('echarts-map-chart', 'mapChart');
    _internal_init_chart('echarts-pie-chart', 'pieChart');
    _internal_init_chart('echarts-radar-chart', 'radarChart');
    _internal_init_chart('echarts-scatter-chart', 'scatterChart');
    _internal_init_chart('echarts-map-chart2', 'map2Chart');
    
  }

  return {
    define: {
      name: "DEMO - 图表 - ECharts",
      version: "1.0.0.0",
      copyright: " Copyright 2017-2027 WangXin nvlbs,Inc."
    },
    /** 加载模块 */
    init: function () {
      setTimeout(initcharts, 300);
    },
    /** 卸载模块 */
    destroy: function () {
      charts.forEach((chart) => {
        chart.destroy();
      });
      charts = [];
    }
  };
});
