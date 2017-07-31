/* ========================================================================
 * framework.dialog v1.0
 * 提示框组件（ALERT ： bootbox） 
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * 
 * ======================================================================== */
define(['bootbox'], function () {

  var module = {
    /** 
     * 自定义弹出对话框样式
     * @param {object} options
     * @return {void}
     */
    alert: function (options) {
      var defaults = {
        buttons: {
          ok: { label: "确定", className: "btn-success" }
        }
        , message: options.message
        , title: options.title
      }
      var options = $.extend(defaults, options);
      bootbox.alert(options);
    },

    /**
     * 带有确定|取消按钮的弹出式对话框.
     * @param {string} text 对话框提示的信息.
     * @param {Function} calback 操作完成反馈 function(bool),参数为BOOLEAN.
     * @return {void}
     */
    confirm: function (text, callback) {
      bootbox.dialog({
        "message": text,
        "title": "操作确认",
        "buttons": {
          "success": {
            "label": "确定",
            "className": "btn-success",
            "callback": function () { callback(true); }
          },
          "danger": {
            "label": "取消",
            "className": "btn-danger",
            "callback": function () { callback(false); }
          }
        }
      });
    },

    /**
     * 带有确定按钮的弹出式对话框
     * @param {string} text 对话框提示的信息.
     * @param {Function} calback 操作完成反馈 function()
     * @return {void}
     */
    alertText: function (text, callback) {
      module.alert({ "message": text, "callback": callback });
    }
  }

  return module;

});