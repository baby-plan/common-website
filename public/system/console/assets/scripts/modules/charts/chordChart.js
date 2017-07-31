define(['jquery', 'echarts'], ($) => {
  let module = {};
  let chart;
  module.init = (el) => {
    var chart = echarts.init(document.getElementById(el));
    var options = {
      title: {
        text: '测试数据',
        subtext: 'From d3.js',
        x: 'right',
        y: 'bottom'
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          if (params.indicator2) { // is edge
            return params.value.weight;
          } else { // is node
            return params.name
          }
        }
      },
      toolbox: {
        show: true,
        feature: {
          restore: {
            show: true
          },
          magicType: {
            show: true,
            type: ['force', 'chord']
          },
          saveAsImage: {
            show: true
          }
        }
      },
      legend: {
        x: 'left',
        data: ['group1', 'group2', 'group3', 'group4']
      },
      series: [{
        type: 'chord',
        sort: 'ascending',
        sortSub: 'descending',
        showScale: true,
        showScaleText: true,
        data: [{
            name: 'group1'
          },
          {
            name: 'group2'
          },
          {
            name: 'group3'
          },
          {
            name: 'group4'
          }
        ],
        itemStyle: {
          normal: {
            label: {
              show: false
            }
          }
        },
        matrix: [
          [11975, 5871, 8916, 2868],
          [1951, 10048, 2060, 6171],
          [8010, 16145, 8090, 8045],
          [1013, 990, 940, 6907]
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