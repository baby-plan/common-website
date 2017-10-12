define(["QDP"], function (QDP) {
  "use strict";

  /** 初始化合作方列表
   * @param  {} filter
   * @param  {} column
   * @param  {} value
   */
  var initPartner = function (filter, column, value) {
    $("<select/>")
      .attr("id", filter.name)
      .addClass("form-control")
      .appendTo(column);
    QDP.form.initCache({
      api: QDP.api.role.alldatasapi,
      target: $("#" + filter.name),
      valuefn: function (index, item) {
        return item.id;
      },
      textfn: function (index, item) {
        return QDP.base64.decode(item.name);
      },
      done: function () {
        $("#" + filter.name).attr("data-value", value);
      }
    });
  };

  return {
    define: {
      name: "商户上线成功率统计",
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
          { name: "begin_date", text: "订单开始时间", type: "date", filter: true, filterindex: 4, grid: false },
          { name: "end_date", text: "订单结束时间", type: "date", filter: true, filterindex:5, grid: false },
          { name: "n0", text: "通过上线审核总数" },
          { name: "n3", text: "发起上线审核总数" },
          { name: "n1", text: "商户上线通过率" },
        ]
      };
      QDP.generator.init(options);
    },
    /** 卸载模块 */
    destroy: function () {

    }
  };
});
