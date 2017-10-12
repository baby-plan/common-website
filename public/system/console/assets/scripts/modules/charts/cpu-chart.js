define(['jquery', 'echarts'], ($,echarts) => {
  let module = {};
  let chart;
  module.init = (el) => {
    var chart = echarts.init(document.getElementById(el));
    var options = {
      title: {
        text: 'CPU使用率',
        subtext: '192.168.1.1',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: ['闲置', '用户', '系统']
      },
      calculable: true,
      series: [{
        name: '使用占比',
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', '60%'],
        data: [{
          value: 335,
          name: '闲置'
        },
        {
          value: 310,
          name: '用户'
        },
        {
          value: 234,
          name: '系统'
        }
        ]
      }]
    };
    chart.setOption(options);
    $(window).on('resize', chart.resize);
  };

  module.destroy = () => {
    if (chart) {
      $(window).off('resize', chart.resize);
    }
  };
  return module;
});