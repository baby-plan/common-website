define([], function () {
  "use strict";

  return {
    define: {
      name: "首页",
      version: "1.0.0.0",
      copyright: " Copyright 2017-2027 WangXin nvlbs,Inc."
    },
    /** 加载模块 */
    init: function () {
      require(['plugins/plugins-chart'], plugin => {
        plugin.init('echarts-chart', 'home-maptotal');
        $('.btn_back').remove();
      });
    },
    /** 卸载模块 */
    destroy: function () {

    }
  };
});
