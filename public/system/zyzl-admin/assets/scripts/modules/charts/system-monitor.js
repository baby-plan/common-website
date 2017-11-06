define(['jquery', 'echarts'], ($, echarts) => {
  let module = {};
  let chartBuffer = {};
  let chart, option, container;

  var resizeContainer = function () {
    container.height(240);
  }

  module.init = (el, args) => {
    container = $('#' + el);
    resizeContainer();

    var value = args.value;

    option = {
      title: {
        //show:false,
        x: "center",
        bottom: 200,
        //text:'AAA',
        subtext: '信用等级'
      },
      tooltip: {
        show: true,
        // formatter: "{a} <br/>{b} {c}",
        backgroundColor: '#F7F9FB',
        borderColor: '#92DAFF',
        borderWidth: '1px',
        textStyle: {
          color: 'black'
        },
        formatter: function (param) {
          return '<em style="color:' + param.color + ';">' + param.value + '</em> 分'
        }

      },
      series: [{
        name: '信用分',
        type: 'gauge',
        // startAngle: 180,
        // endAngle: 0,
        min: 350,
        max: 950,
        axisLine: {
          show: true,
          lineStyle: {
            width: 40,
            shadowBlur: 0,
            color: [
              [0.2, '#E43F3D'],
              [0.4, '#E98E2C'],
              [0.6, '#DDBD4D'],
              [0.8, '#7CBB55'],
              [1, '#9CD6CE']
            ]
          }
        },
        axisTick: {
          show: true,
          splitNumber: 1
        },
        splitLine: {
          show: true,
          length: 40,
          lineStyle: {
            //color:'black'
          },
        },
        axisLabel: {
          formatter: function (e) {
            switch (e + "") {
              case "410":
                return "较差";
              //return "";
              case "470":
                return "550";

              case "530":
                return "中等";
              //return "";
              case "590":
                return "600";

              case "650":
                return "良好";
              //return "";
              case "710":
                return "650";

              case "770":
                return "优秀";
              //return "";
              case "830":
                return "700";

              case "890":
                return "极好";
              //return "";
              default:
                return e;
            }
          },
          textStyle: {
            fontSize: 12,
            fontWeight: ""
          }
        },
        pointer: {
          show: true,
        },
        detail: {
          //show:false,
          formatter: function (param) {
            var level = '';
            if (param < 470) {
              level = '较差'
            } else if (param < 590) {
              level = '中等'
            } else if (param < 710) {
              level = '良好'
            } else if (param < 830) {
              level = '优秀'
            } else if (param <= 950) {
              level = '极好'
            } else {
              level = '暂无';
            }
            return level;
          },
          offsetCenter: [0, 140],
          textStyle: {
            fontSize: 40
          }
        },
        data: [{
          name: "",
          value: Math.floor(value)
        }]
      }]
    };

    if (!chartBuffer[el]) {
      chartBuffer[el] = chart = echarts.init(document.getElementById(el));
      $(window).on('resize', resizeContainer);
      $(window).on('resize', chart.resize);
    } else {
      chart = chartBuffer[el];
    }

    chart.setOption(option);

  };

  module.destroy = () => {
    $(window).off('resize', resizeContainer);
    if (chart) {
      $(window).off('resize', chart.resize);
    }
  };
  return module;
});