/* ========================================================================
 * App.modules.actions.comment v1.0
 * 评论处理
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  "use strict";
  const ID_COMMENT_TEXT = "comment-text-template";
  const ID_COMMENT_CONTAINER = "comment-container-template";

  /** 新增一条评论
   * @param {string} text 评论的内容
   * @param {string} targetid 待评论的目标编号
   * @param {string} targettype 待评论的目标类型
   */
  var AddComment = (text, targetid, targettype, fn) => {
    var options = {
      "text": text,
      "targetid": targetid,
      "targettype": targettype
    };
    App.ajax(API.comment.add, options, function (json) {
      if (typeof fn === 'function') {
        fn();
      }
    });
  };

  /**删除一条评论
   * @param {string} commentid 评论的编号
   */
  var RemoveComment = (commentid, fn) => {
    var options = { "id": commentid };
    App.ajax(API.comment.remove, options, function (json) {
      if (typeof fn === 'function') {
        fn();
      }
    });
  }

  /**获取目标评论列表
   * @param {string} targetid 评论的目标编号
   * @param {string} targettype 评论的目标类型
   * @param {DOMobject} targetctrl 评论控件
   */
  var GetComment = (targetid, targettype, targetctrl) => {
    let $containerId = "_comment_" + targettype + "_" + targetid + "_";
    $("#" + ID_COMMENT_CONTAINER).tmpl({ "id": $containerId }).appendTo(targetctrl.parent().parent());

    if (!targetctrl.hasClass("btn btn-xs")) {
      targetctrl.addClass("btn btn-xs");
    }

    let params = { "id": targetid, "type": targettype };
    let callback_args = {
      // 数据返回时触发
      "success": (json) => {
        targetctrl.empty();
        var icon = $("<i/>").addClass("fa fa-commenting-o");
        targetctrl.append(icon);
        if (json.data.recordcount > 0) {
          targetctrl.append(" " + json.data.recordcount + " 条");
        }
        targetctrl.append(" 评论");
        if (json.data.recordcount > 0) {
          $("#" + ID_COMMENT_TEXT).tmpl(json.data.list).appendTo("#" + $containerId);
        }
      },
      // 没有数据返回时触发
      "noneDate": () => {
        targetctrl.empty();
        targetctrl.append($("<i/>").addClass("fa fa-commenting-o"));
        targetctrl.append(" 评论");
      }
    };
    App.ajax(API.comment.datas, params, callback_args);

  };

  /** 打开评论界面
   * @param {string} targetid 待评论的目标编号
   * @param {string} targettype 待评论的目标类型
   */
  var OpenCommentView = (targetid, targettype) => {
    let $containerId = "_comment_" + targettype + "_" + targetid + "_";
    let $container = $("#" + $containerId);
    if ($container.hasClass("collapse")) {
      $container.removeClass("collapse")
    } else {
      $container.addClass("collapse")
    }
  }

  // 系统运行后自动注册评论事件

  // 注册评论初始事件处理函数:页面加载完成时请求评论列表.
  App.plugins.actions.get("do-comment", GetComment);
  // 注册评论点击事件处理函数:点击切换评论列表的隐藏\显示状态.
  App.plugins.actions.add("do-comment", OpenCommentView);
  // 载入评论内容显示模板 for Jquery.tmpl
  let script_text = $("<script/>").attr("type", "text/x-jquery-tmpl");
  script_text.attr("id", ID_COMMENT_TEXT);
  $("body").append(script_text);
  script_text.load("views/templates/comment.display.html");
  // 载入评论区域模板 for Jquery.tmpl
  let script_container = $("<script/>").attr("type", "text/x-jquery-tmpl");
  script_container.attr("id", ID_COMMENT_CONTAINER);
  $("body").append(script_container);
  script_container.load("views/templates/comment.container.html");

  // 注册发送评论按钮事件
  $("body").on("click", ".feed-activity-list .comment-send", function () {

    let $input = $(this).parent().parent().find("input");
    let text = $input.val();
    if (text == undefined || text == "") {
      return;
    }
    text = App.base64.encode(text);

    var temp = $(this).parent().parent().parent().parent().find("div.actions");
    let type = temp.attr("data-type");
    let target = temp.attr("data-target");

    AddComment(text, target, type, () => {
      $input.val("");
      let targetctrl = temp.find("[data-action='do-comment']");
      $(".well", temp.parent()).remove();
      GetComment(target, type, targetctrl);
    });
  });
  // 注册评论删除按钮点击事件
  $("body").on("click", ".feed-activity-list .comment-delete", function () {
    let id = $(this).attr("data-id");
    RemoveComment(id, () => {
      var temp = $(this).parent().parent().parent().parent().find("div.actions");
      $(".well", temp.parent()).remove();
      let type = temp.attr("data-type");
      let target = temp.attr("data-target");
      let targetctrl = temp.find("[data-action='do-comment']");
      GetComment(target, type, targetctrl);
    });
  });

})(App);