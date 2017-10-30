define(['jquery', 'QDP'], function ($, QDP) {
  "use strict";
  // EVENT-ON:layout.started
  QDP.on("layout.started", function () {
    console.info("注册->系统运行后自动注册 - plugins-actions - 功能扩展插件：city、chart");
  });
  var plugins = [];
  // EVENT-ON:generator.option.rendered
  QDP.on('generator.option.rendered', function (eventArgs) {
    // 释放之前使用过的plugin
    $.each(plugins, function (index, plugin) {
      if (plugin && typeof plugin.destory === 'function') {
        plugin.destory();
      }
    });
    plugins = [];

    var options = eventArgs.args;
    if (!options || !options.plugins) {
      return;
    }
    $.each(options.plugins, function (index, plugin) {
      let pluginName;
      if (typeof plugin === 'string') {
        pluginName = plugin;
      } else {
        pluginName = plugin.name;
      }
      switch (pluginName) {
        case 'city':
          cityPlugin(options, plugin);
          break;
        case 'chart':
          chartPlugin(options, plugin);
          break;
      }
    });

  });

  var _chartPlugin;

  var resizeContainer = function () {
    var windowHeight = $(window).outerHeight();
    var breadcrumbHeight = $(".content-header").outerHeight();
    // 20为.ajax-content的上填充合，padding-top:20px
    $('#echarts-chart').height(windowHeight - breadcrumbHeight - 20);
  }

  var chartPlugin = function (options, pluginOptions) {

    plugins.push({
      'destory': function () {
        $(window).off('resize', resizeContainer);
        if (_chartPlugin && typeof _chartPlugin.destroy === 'function') {
          _chartPlugin.destroy();
        }
      },
    });

    var btnChart = $("<button/>").addClass("btn-chart");
    btnChart.html(' <i class="fa fa-line-chart"></i> 图表 ');
    btnChart.on("click", function () {
      QDP.form.openview({
        map: true,
        title: '图表',
        url: QDP.config.chartpage,
        callback: function () {
          QDP.form.render();
          $(window).on('resize', resizeContainer);
          resizeContainer();
          require(['plugins/plugins-chart'], plugin => {
            _chartPlugin = plugin;
            plugin.init('echarts-chart', pluginOptions.chart);
          });
        }
      });
    });
    $('.view-action').prepend(btnChart);
  }

  var selectedValue = 3;
  var cityPlugin = function (options) {

    var select = $("<select/>");
    select.width(200);
    select.append($("<option/>").val(1).text('按省份查询'));
    select.append($("<option/>").val(2).text('按地市查询'));
    select.append($("<option/>").val(3).text('按区县查询'));
    $('.content-toolbar').prepend(select);
    select.select2();
    select.val(selectedValue).trigger('change');
    select.on('change', function () {
      var value = $(this).val();
      if (!value || value == selectedValue) {
        return;
      }
      selectedValue = value;
      var city_code = options.columns.find(function (p) { return p.name == 'city_code'; });
      if (!city_code) city_code = {};

      var county_code = options.columns.find(function (p) { return p.name == 'county_code'; });
      if (!county_code) county_code = {};

      switch (value) {
        case "1":
          city_code.display = false;
          city_code.filter = false;
          county_code.display = false;
          county_code.filter = false;
          break;
        case "2":
          city_code.display = true;
          city_code.filter = true;
          county_code.display = false;
          county_code.filter = false;
          break;
        case "3":
          city_code.display = true;
          city_code.filter = true;
          county_code.display = true;
          county_code.filter = true;
          break;
        default:
          return;
      }

      $('.ajax-content').load(QDP.config.listpage, function () {
        $('.datetimepicker').remove();
        $('.content-toolbar').empty();
        QDP.generator.build(options);
      });
    });

  }

});