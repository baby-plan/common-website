define(['jquery', 'echarts'], ($) => {
  let module = {};
  let chart;
  module.init = (el) => {
    var chart = echarts.init(document.getElementById(el));
    var options = {
      tooltip: {
        formatter: "{a} <br/>{c} {b}"
      },
      toolbox: {
        show: false,
        feature: {
          mark: {
            show: true
          },
          restore: {
            show: true
          },
          saveAsImage: {
            show: true
          }
        }
      },
      series: [{
          name: '使用率',
          type: 'gauge',
          min: 0,
          max: 100,
          splitNumber: 10,
          axisLine: { // 坐标轴线
            lineStyle: { // 属性lineStyle控制线条样式
              width: 10
            }
          },
          axisTick: { // 坐标轴小标记
            length: 15, // 属性length控制线长
            lineStyle: { // 属性lineStyle控制线条样式
              color: 'auto'
            }
          },
          splitLine: { // 分隔线
            length: 20, // 属性length控制线长
            lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
              color: 'auto'
            }
          },
          title: {
            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              fontSize: 20,
              fontStyle: 'italic'
            }
          },
          detail: {
            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder'
            }
          },
          data: [{
            value: Math.round(Math.random() * 100),
            name: '百分比'
          }]
        }
      ]
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