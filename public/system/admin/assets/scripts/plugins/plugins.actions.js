/* ========================================================================
 * App.plugins.actions v1.0
 * 行为动作处理
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  "use strict";
  let actions_add = {};
  let actions_get = {};
  // 系统运行后自动注册评论\点赞\收藏\关注 等点击事件
  App.logger.info("注册->系统运行后自动注册评论\点赞\收藏\关注 等点击事件");
  
  $("body").on("click", "a[data-action^='do-']", function (e) {
    let action = $(this).attr("data-action");
    let type = $(this).attr("data-type");
    let target = $(this).attr("data-target");
    if (type == undefined) {
      type = $(this).parent().attr("data-type");
    }
    if (target == undefined) {
      target = $(this).parent().attr("data-target");
    }
    if (typeof actions_add[action] === 'function') {
      actions_add[action](target, type);
    } else {
      App.logger.debug(action + " 尚未注册监听");
    }
  });
  $("body").on("ready", "[data-container]", function (e) {
    App.logger.debug("resize:");
  });

  app.plugins.actions = {
    "add": (action, fn) => {
      actions_add[action] = fn;
    },
    "get": (action, fn) => {
      actions_get[action] = fn;
    },
    "refreshData": () => {
      $("a[data-action^='do-']").each(function (index, item) {
        if ($(this).hasClass("date-geted")) {
          // 该行为已经加载数据,不需要再次加载
          return;
        }
        let action = $(this).attr("data-action");
        let type = $(this).attr("data-type");
        let target = $(this).attr("data-target");
        if (type == undefined) {
          type = $(this).parent().attr("data-type");
        }
        if (target == undefined) {
          target = $(this).parent().attr("data-target");
        }
        if (typeof actions_add[action] === 'function') {
          $(this).addClass("date-geted");
          actions_get[action](target, type, $(this));
        } else {}

        // App.logger.debug("刷新数据:" + $(this).text() + ",action=" + action + ",type=" + type + ",target=" + target);
      });
    }
  }
})(App);