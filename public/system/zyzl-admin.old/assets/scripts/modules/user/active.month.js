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
      name: "活跃用户统计报表",
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
          // { name: "month", text: "月份", type: "date", filter: true, display: false },
          { name: "begin_date", text: "开始时间", type: "date", filter: true, filterindex: 4, grid: false },
          { name: "end_date", text: "结束时间", type: "date", filter: true, filterindex: 5, grid: false },
          { name: "publishdate", text: "获取权益免费券用户数" },
          { name: "outdate", text: "验证权益免费券用户数" },
          { name: "usedate", text: "获取权益折扣券用户数" },
          { name: "carbrand", text: "验证权益折扣券用户数" },
          { name: "cartype", text: "获取活动免费券用户数" },
          { name: "carplate", text: "验证活动免费券用户数" },
          { name: "ordercode", text: "获取活动折扣券用户数" },
          { name: "orderdate", text: "验证活动折扣券用户数" }
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
              plugin.init('echarts-chart', 'user-active-month');
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