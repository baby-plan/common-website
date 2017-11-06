define(['jquery', 'echarts'], ($, echarts) => {

  let module = {};
  let chart;
  module.init = (el) => {
    var chart = echarts.init(document.getElementById(el));
    var chartOptions = {
      title: {
        text: '活跃用户统计月表'
      },

      tooltip: {
        trigger: 'axis'
      },

      legend: {
        orient: 'vertical',
        x: 'right',
        y: 'top',
        data: ['领券用户数', '验券用户数']
      },

      toolbox: {
        show: true,
        orient: 'vertical',
        x: 'right',
        y: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },

      polar: [
        {
          indicator: [
            { text: '权益免费券', max: 6000 },
            { text: '权益折扣券', max: 16000 },
            { text: '活动免费券', max: 30000 },
            { text: '活动折扣券', max: 38000 },
          ]
        }
      ],

      calculable: true,

      series: [
        {
          name: '活跃用户统计月表',
          type: 'radar',
          data: [
            {
              value: [4300, 10000, 28000, 35000],
              name: '领券用户数'
            },
            {
              value: [5000, 14000, 28000, 31000],
              name: '验券用户数'
            }
          ]
        }
      ]

    };
    chart.setOption(chartOptions);
    $(window).on('resize', chart.resize);
  };

  module.destroy = () => {
    if (chart) {
      $(window).off('resize', chart.resize);
    }
  };
  return module;
});