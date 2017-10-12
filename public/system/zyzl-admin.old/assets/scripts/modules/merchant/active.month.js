define(["QDP"], function (QDP) {
  "use strict";
  var resizeContainer = function () {
    var windowHeight = $(window).outerHeight();
    var breadcrumbHeight = $(".content-header").outerHeight();
    // 20为#ajax-content的上填充合，padding-top:20px
    $('#echarts-chart').height(windowHeight - breadcrumbHeight - 20);
  }

  var plugin;
  return {
    define: {
      name: "活跃商户统计报表",
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
          { name: "publishdate", text: "验证免费券用户数" },
          { name: "outdate", text: "验证折扣券用户数" },
          { name: "begin_date", text: "开始时间", type: "date", filter: 'date', filterindex: 4, grid: false },
          { name: "end_date", text: "结束时间", type: "date", filter: 'date', filterindex: 5, grid: false },
        ]
      };
      QDP.generator.init(options);

      var tools = $('.content-toolbar>tools');

      var btn_chart = $("<a/>").addClass("btn_chart btn-mini");
      btn_chart.attr("href", "javascript:;");
      btn_chart.html(' <i class="fa fa-line-chart"></i> 图表 ');
      btn_chart.on("click", function () {
        QDP.form.openview({
          map: true,
          title: '图表',
          url: QDP.config.chartpage,
          callback: function () {
            $(window).on('resize', resizeContainer);
            resizeContainer();
            require(['plugins/plugins-chart'], plugin => {
              plugin.init('echarts-chart', 'merchant-active-month');
            });
          }
        });
      });
      tools.prepend(btn_chart);

    },
    /** 卸载模块 */
    destroy: function () {
      $(window).off('resize', resizeContainer);
      if (plugin && typeof plugin.destroy === 'function') {
        plugin.destroy();
      }
    }
  };
});
