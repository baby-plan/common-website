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
    _internal_init_chart('chart-cpu', 'cpu-chart');
    _internal_init_chart('chart-mem', 'pieChart');
    _internal_init_chart('chart-serv', 'pieChart');
    _internal_init_chart('chart-netowrk', 'pieChart');

    _internal_init_chart('chart-graph', 'server-graph');
  }

  module.init = () => {
    layout.load("views/monitor.html", () => {
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