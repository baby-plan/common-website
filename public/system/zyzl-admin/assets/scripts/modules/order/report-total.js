define(["QDP"], function (QDP) {
  "use strict";
  return {
    "define": {
      "name": "订单结算报表统计模块",
      "version": "1.0.0.0",
      "copyright": ' Copyright 2017-2027 WangXin nvlbs,Inc.',
    },
    /** 加载模块 */
    "init": function () {
      var options = {
        "apis": { "list": QDP.api.logs.datas },
        "columns": [
          { name: "_index", text: "序号" },
          { name: "province_code", text: "省份", dict: "province", filter: true, filterindex: 1 },
          { name: "storeCode", text: "数量"},
          { name: "ccs", text: "结算月份", type: 'month', display: false, filter: 'date' },
          { name: "c19", text: "统计开始时间", type: 'date' },
          { name: "c20", text: "统计结束时间", type: 'date' },
          { name: "c21", text: "账单年月", type: 'date' },
          { name: "c22", text: "生成时间", type: 'date' },
        ]
      };
      QDP.generator.build(options);
    },
    /** 卸载模块 */
    "destroy": function () {

    }
  };
});
