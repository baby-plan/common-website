define(['jquery', 'layout', 'block', 'echarts'], ($, layout, block) => {
  let module = {};
  let charts = [];

  var _internal_init_chart = (id, url) => {
    let chart_parent = $('#' + id).parent();
    block.show('初始化图表...', chart_parent);
    require(['assets/scripts/modules/charts/' + url], chart => {
      chart.init(id);
      charts.push(chart);
      setTimeout(() => {
        block.close(chart_parent);
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
  }

  module.init = () => {
    layout.load("views/view.3.html", () => {
      setTimeout(initcharts, 300);
    });
  };

  module.destroy = () => {
    charts.forEach((chart) => {
      chart.destroy();
    });
    charts = [];
    console.info("center.setting destroy");
  };

  return module;
});