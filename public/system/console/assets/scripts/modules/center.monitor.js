define(['jquery', 'layout', 'ajax', 'jquery.tmpl'], ($, layout, ajax) => {
  let module = {};
  module.init = () => {
    layout.load("views/view.1.html", () => {

      var callback = function (json) {
        var max = (json.data.totalmem / 1024 / 1024 / 1024).toFixed(1);
        var free = (json.data.freemem / 1024 / 1024 / 1024).toFixed(1);
        var cur = (max - free).toFixed(1);
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
        $.each(json.data.networkInterfaces, (key, value) => {
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

      var url = "http://" + window.location.host + "/api/environment/"
      ajax.get(url, {}, callback);

    });
  };

  return module;
});