define(["QDP"], function (QDP) {
  "use strict";

  var plugin;

  return {
    define: {
      name: "商户签约数量统计",
      version: "1.0.0.0",
      copyright: " Copyright 2017-2027 WangXin nvlbs,Inc."
    },
    /** 加载模块 */
    init: function () {
      var options = {
        apis: { list: QDP.api.logs.datas },
        columns: [
          { name: "_index", text: "序号" },
          { name: "province_code", text: "省份", dict: "province", filter: true, filterindex: 1 },
          { name: "city_code", text: "城市", dict: "city", filter: true, filterindex: 2 },
          { name: "county_code", text: "区县", dict: "county", filter: true, filterindex: 3 },
          { name: "begin_date", text: "开始时间", type: "date", filter: true, filterindex: 4, grid: false },
          { name: "end_date", text: "结束时间", type: "date", filter: true, filterindex: 5, grid: false },
          // { name: "n1", text: "承诺的商户数" },
          { name: "n2", text: "审核通过已发布的商户数" },
          // { name: "n3", text: "审核通过未发布的商户数" },
          // { name: "n4", text: "取消发布的商户数" }
        ]
      };
      QDP.generator.init(options);

      var btn_chart = $("<a/>").addClass("btn_chart btn-mini");
      btn_chart.attr("href", "javascript:;");
      btn_chart.html(' <i class="fa fa-line-chart"></i> 图表 ');
      btn_chart.on("click", function () {
        QDP.form.openview({
          map: true,
          title: '图表',
          url: QDP.config.chartpage,
          callback: function () {
            require(['plugins/plugins-chart'], plugin => {
              plugin.init('echarts-chart', 'map-new');
            });
          }
        });
      });

      $('.view-action').prepend(btn_chart);
    },
    /** 卸载模块 */
    destroy: function () {
      if (plugin && typeof plugin.destroy === 'function') {
        plugin.destroy();
      }
    }
  };
});
