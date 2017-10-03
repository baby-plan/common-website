/* ========================================================================
 * App.plugins.role v1.0
 * 101.角色管理插件
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  "use strict";
  var api = API.role;
  /** 初始化编辑界面,若data有值则视为编辑数据,否则视为新增数据
   * @param {object} data 编辑时传入的数据,新增时不需要
   */
  var initEditor = function (data) {
    //  var callback = function () {
    /* 初始化编辑界面 */
    var container = $("#role-container");
    // var regValidator = false;
    /* 递归模块列表 */
    $.each(cfgs.modules, function (index, item) {
      if (item.parent == "000") {
        var groupContainer = $("<div/>").addClass("col-sm-12").appendTo(container);
        var div = $("<div />").addClass("col-sm-2 heckall").appendTo(groupContainer);
        $("<div/>").addClass("col-sm-10").attr("data-id", index).appendTo(groupContainer);
        $("<input/>").attr("type", "checkbox").attr("id", index).attr("name", "power").appendTo(div);
        $("<label/>").attr("for", index).text(" " + item.name).appendTo(div);
        // if (!regValidator) {
        //     regValidator = true;
        //     $("#" + index).attr("data-bv-message", "请为该角色设置权限!")
        //         .attr("data-bv-notempty", "true");
        // }
      } else {
        var childContainer = $("div[data-id='" + item.parent + "']");
        var div = $("<div />").addClass("col-sm-2 ").appendTo(childContainer);
        $("<input/>").attr("type", "checkbox").attr("id", index).attr("name", "power").appendTo(div);
        $("<label/>").attr("for", index).text(" " + item.name).appendTo(div);
      }
    });
    /* 父级模块选中状态切换事件处理 */
    $(".checkall").on("click", function () {
      var checked = $("div>span", $(this)).hasClass("checked");
      var parentID = $(":checkbox", $(this)).attr("id");
      $(":checkbox", $("div[data-id='" + parentID + "']")).each(function () {
        if (checked) {
          if (!$(this).parent().hasClass("checked")) {
            $(this).parent().addClass("checked");
          }
        } else {
          $(this).parent().removeClass("checked");
        }
      });
    });
    /* 请求角色详情 */
    if (data) {
      $("input").parent().removeClass("checked");
      $("#rolename").val(App.base64.decode(data.name));
      $.each(data.funcids.split(","), function (index, item) {
        $.uniform.update($("#" + item).attr("checked", true));
      });
      $(".checkall").each(function () {
        var parentID = $(":checkbox", $(this)).attr("id");
        var container = $("div[data-id='" + parentID + "']");
        var uncheckeds = $(":checkbox[checked!='checked']", container);
        if (uncheckeds.length == 0) {
          $.uniform.update($(":checkbox", $(this)).attr("checked", true));
        }
      });
    }
    $(":checkbox").uniform();
    /* 处理保存按钮事件 */
    $(".btn_save").on("click", function (e) {
      e.preventDefault();
      var requestURL;
      var args = {
        "name": $("#rolename").val(),
        funcids: ""
      };
      if (args.rolename == "") {
        App.alertText("角色名称不能为空!");
        return;
      }
      args.name = App.base64.encode(args.name);
      $("span[class='checked']>input", $("div[data-id]")).each(function () {
        args.funcids += $(this).attr("id") + ",";
      });
      if (args.funcids.length > 0) {
        args.funcids = args.funcids.substr(0, args.funcids.length - 1);
      } else {
        App.alertText("请为该角色设置权限!");
        return;
      }
      if (data) {
        args.id = data.id;
        requestURL = api.update;
      } else {
        requestURL = api.add;
      }
      App.ajax(requestURL, args);
    });
    // $('#attributeForm').bootstrapValidator();
    // $('#role-form').bootstrapValidator();
  }

  app.plugins.role = {
    "init": function () {
      var options = {
        "apis": {
          "list": api.datas,
          "insert": api.add,
          "update": api.update,
          "delete": api.remove
        },
        "texts": { "insert": "新增角色信息", "update": "角色信息编辑" },
        "headers": { "edit": { "text": "角色信息" }, "table": { "text": "角色信息列表" } },
        "actions": { "insert": true, "update": true, "delete": true },
        "editor": { "page": api.editpage, "callback": initEditor },
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "id", "primary": true },
          { "name": "name", "text": "角色名称", "base64": true, "filter": true },
          { "name": "_action", "text": "操作" }
        ]
      };
      App.plugins.common.init(options);
    }
  };
})(App);