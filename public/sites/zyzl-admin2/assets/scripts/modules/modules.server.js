/* ========================================================================
 * modules.server v1.0
 * 0101.服务器状态监控
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * ======================================================================== */
define(['jquery', 'cfgs', 'API', 'ajax', 'jquery.tmpl', 'jquery.tmplPlus'], function ($, cfgs, API, ajax) {
  "use strict";

  return {
    'define': {
      "name": "服务器监控模块",
      "version": "1.0.0.0",
      'copyright': ' Copyright 2017-2027 WangXin nvlbs,Inc.',
    },
    "status": function () {
      var callback = function (json) {
        var max = (json.data.totalmem / 1024 / 1024 / 1024).toFixed(1);
        var free = (json.data.freemem / 1024 / 1024 / 1024).toFixed(1);
        // var cur = (max - free).toFixed(1);
        $("#totalmem").text(max + " G");
        $("#freemem").text(free + " G");

        var value = json.data.uptime;
        var text = parseInt(value / 60 / 60 / 24) + "天";
        text += parseInt(value / 60 / 60 % 24) + "小时";
        text += parseInt(value / 60 % 60) + "分";
        text += parseInt(value % 60) + "秒";
        $("#uptime").text(text);

        $("#cpu_data").tmpl(json.data.cpus).appendTo('#cpus');
        var networks = [];
        $.each(json.data.networkInterfaces, function (key, value) {
          value.name = key;
          networks.push(value);
        });
        $("#network_data").tmpl(networks).appendTo('#networks');

        $.each(json.data, function (field, value) {
          if (typeof value === 'string') {
            $("#" + field).text(value);
          } else if (typeof value === 'number') { } else { }
        });
      };
      ajax.get(API.moritor.serverstatusapi, {}, callback);
    }
  }

});
