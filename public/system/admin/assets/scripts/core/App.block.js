/* ========================================================================
 * App.block v1.0
 * 遮罩组件（BLOCKUI） 
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * 
 * ======================================================================== */
(function (app) {

  var blockUI = function (options) {
    options = $.extend(true, { "message": "LOADING..." }, options);
    var html = "<div class='loading'><div class='sk-spinner sk-spinner-rotating-plane'></div><span class='loading-message'>" + (options.message) + "</span></div>";
    var el = $(options.target);
    if (el.height() <= ($(window).height())) {
      options.cenrerY = true;
    }
    el.block({
      "message": html,
      "baseZ": options.zIndex ? options.zIndex : 1000,
      "centerY": options.cenrerY !== undefined ? options.cenrerY : false,
      "css": {
        "top": "10%",
        "border": "0",
        "padding": "0",
        "backgroundColor": "none"
      },
      "overlayCSS": {
        "backgroundColor": options.overlayColor ? options.overlayColor : "#555",
        "opacity": options.boxed ? 0.05 : 0.1,
        "cursor": "wait"
      }
    });
  }

  /** 遮罩组件. */
  app.block = {
    /** 显示遮罩.
     * @param {string} text      遮罩显示的提示信息
     * @param {object} target    遮罩所指向的目标对象
     */
    "show": function (text, target) {
      App.logger.debug("BLOCK.SHOW:" + text);
      var blockTarget;
      if (target) {
        blockTarget = target;
      } else if ($("#main-content").length == 1) {
        blockTarget = $("#main-content");
      } else {
        blockTarget = $("body");
      }
      if (!blockTarget) {
        App.logger.error("BLOCK.ERROR:未找到BLOCK Target");
      }
      blockUI({ "target": blockTarget, "message": text });
    },
    /** 移除遮罩.
     * @param {object} target    遮罩所指向的目标对象
     */
    "close": function (target) {
      var blockTarget;
      if (target) {
        blockTarget = target;
      } else if ($("#main-content").length == 1) {
        blockTarget = $("#main-content");
      } else {
        blockTarget = $("body");
      }
      blockTarget.unblock({
        onUnblock: function () {
          blockTarget.css("position", "");
          blockTarget.css("zoom", "");
        }
      });
      App.logger.debug("BLOCK.CLOSE");
    }
  }
})(App);