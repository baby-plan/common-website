/* ========================================================================
 * App.block v1.0
 * 遮罩组件（BLOCKUI） 
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * 
 * ======================================================================== */
define(['jquery'], function ($) {

  var blockUI = function (options) {
    options = $.extend(true, {
      "message": "LOADING..."
    }, options);
    var html = "<div class='sk-spinner sk-spinner-rotating-plane'></div><span class='loading-message'>" + (options.message) + "</span>";
    var el = $(options.target);
    el.block({
      "message": html,
      css: {
        padding: 0,
        margin: 0,
        width: '30%',
        top: '40%',
        left: '35%',
        textAlign: 'center',
        color: '#fff',
        border: 'none',
        backgroundColor: 'none',
        cursor: 'wait'
      },
    });
  }

  /** 遮罩组件. */
  var module = {
    /**
     * 显示遮罩.
     * @param {string} text      遮罩显示的提示信息
     * @param {object} target    遮罩所指向的目标对象
     */

    "show": function (text, target) {
      // console.debug("BLOCK.SHOW:" + text);
      var blockTarget;
      if (target) {
        blockTarget = target;
      } else if ($(".nui-content").length == 1) {
        blockTarget = $(".nui-content");
      } else {
        blockTarget = $("body");
      }
      if (!blockTarget) {
        console.error("BLOCK.ERROR:未找到BLOCK Target");
      }
      blockUI({
        "target": blockTarget,
        "message": text
      });
    },

    /**
     * 移除遮罩.
     * @param {object} target    遮罩所指向的目标对象
     */

    "close": function (target) {
      var blockTarget;
      if (target) {
        blockTarget = target;
      } else if ($(".nui-content").length == 1) {
        blockTarget = $(".nui-content");
      } else {
        blockTarget = $("body");
      }
      blockTarget.unblock({
        onUnblock: function () {
          blockTarget.css("position", "");
          blockTarget.css("zoom", "");
        }
      });
      // console.debug("BLOCK.CLOSE");
    }
  }

  return module;

});