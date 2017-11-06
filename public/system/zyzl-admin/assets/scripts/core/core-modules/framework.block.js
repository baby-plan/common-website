/* ========================================================================
 * App.block v1.0
 * 遮罩组件（BLOCKUI） 
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * 
 * ======================================================================== */
define(['jquery', 'jquery.blockUI'], function ($) {

  var blockUI = function (options) {
    options = $.extend(true, { "message": "LOADING..." }, options);
    var html = "<div class='sk-spinner sk-spinner-rotating-plane'></div><span class='loading-message'>" + (options.message) + "</span>";
    $(options.target).block({
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
        cursor: 'wait',
      },
    });
  }
  var isShowed = false;
  
  /** 遮罩组件. */
  var module = {
    
    /**
     * 显示遮罩.
     * @param {string} text      遮罩显示的提示信息
     * @param {object} target    遮罩所指向的目标对象
     */

    "show": function (text, target) {
      // if (isShowed) {
      //   console.debug("BLOCK.SHOW:已经显示,%s", text);
      //   return;
      // }
      console.debug("BLOCK.SHOW:" + text);
      // isShowed = true;
      var blockTarget;
      if (target) {
        blockTarget = target;
      } else if ($("body>section").length == 1) {
        blockTarget = $("body>section");
      } else {
        blockTarget = $("body");
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
      // if (!isShowed) {
      //   return;
      // }
      // isShowed = false;
      var blockTarget;
      if (target) {
        blockTarget = target;
      } else if ($("body>section").length == 1) {
        blockTarget = $("body>section");
      } else {
        blockTarget = $("body");
      }
      blockTarget.unblock({
        onUnblock: function () {
          blockTarget.css("position", "");
          blockTarget.css("zoom", "");
        }
      });
      console.debug("BLOCK.CLOSE");
    }
  }

  return module;

});