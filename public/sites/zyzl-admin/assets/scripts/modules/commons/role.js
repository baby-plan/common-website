define(["QDP"], function (QDP) {
  "use strict";

  /** 初始化编辑界面,若data有值则视为编辑数据,否则视为新增数据
   * @param {object} data 编辑时传入的数据,新增时不需要
   */
  var initEditor = function (data) {
    /* 初始化编辑界面 */
    var container = $("#role-container");
    /* 递归模块列表 */
    $.each(QDP.config.modules, function (index, item) {

      var groupContainer = $("<div/>").addClass("col-sm-12").appendTo(container);
      var div = $("<div />").addClass("col-sm-4 checkall").appendTo(groupContainer);
      $("<div/>").addClass("col-sm-8").attr("data-id", index).appendTo(groupContainer);
      $("<input/>").attr("type", "checkbox").attr("id", index).attr("name", "power").appendTo(div);
      $("<label/>").attr("for", index).text(" " + item.name).appendTo(div);

      // 加载模块子功能
      if (item.actions) {
        var childContainer = $("div[data-id='" + index + "']");
        $.each(item.actions, function (action_index, action) {
          var div = $("<div />").addClass("col-sm-3").appendTo(childContainer);
          $("<input/>").attr("type", "checkbox").attr("id", action.id).attr("name", "power").appendTo(div);
          $("<label/>").attr("for", action.id).text(" " + action.name).appendTo(div);
        });
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
      $("#rolename").val(QDP.base64.decode(data.name));
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

    setTimeout(function () {
      $(":checkbox").uniform();
    }, 500);

    /* 处理保存按钮事件 */
    $(".btn_save").on("click", function (e) {
      e.preventDefault();
      var requestURL;
      var args = {
        "name": $("#rolename").val(),
        funcids: ""
      };
      if (args.rolename == "") {
        QDP.alertText("角色名称不能为空!");
        return;
      }
      args.name = QDP.base64.encode(args.name);
      var powers = [];
      $("#role-container .checkall span[class='checked']>input").each(function () {
        var module = $(this);
        let power = {
          id: module.attr("id"),
          actions: []
        };

        $("span[class='checked']>input", $("[data-id='" + power.id + "']")).each(function () {
          power.actions.push($(this).attr("id"));
        });

        powers.push(power);
      });
      args.powers = powers;

      $("span[class='checked']>input", $("div[data-id]")).each(function () {
        args.funcids += $(this).attr("id") + ",";
      });
      if (args.funcids.length > 0) {
        args.funcids = args.funcids.substr(0, args.funcids.length - 1);
      } else {
        QDP.alertText("请为该角色设置权限!");
        return;
      }
      if (data) {
        args.id = data.id;
        requestURL = QDP.api.role.update;
      } else {
        requestURL = QDP.api.role.add;
      }
      QDP.ajax.get(requestURL, args);
    });

  }

  return {
    define: {
      name: "角色管理",
      version: "1.0.0.0",
      copyright: " Copyright 2017-2027 WangXin nvlbs,Inc."
    },
    /** 加载模块 */
    init: function () {
      var options = {
        "apis": {
          "list": QDP.api.role.datas,
          "insert": QDP.api.role.add,
          "update": QDP.api.role.update,
          "delete": QDP.api.role.remove
        },
        "texts": {
          "insert": "新增角色信息",
          "update": "角色信息编辑"
        },
        "headers": {
          "edit": {
            "text": "角色信息"
          },
          "table": {
            "text": "角色信息列表"
          }
        },
        "actions": {
          "insert": true,
          "update": true,
          "delete": true
        },
        "editor": {
          "page": QDP.api.role.editpage,
          "callback": initEditor
        },
        "columns": [{
          "name": "_index",
          "text": "序号"
        },
        {
          "name": "id",
          "primary": true
        },
        {
          "name": "name",
          "text": "角色名称",
          "base64": true,
          "filter": true
        },
        {
          "name": "_action",
          "text": "操作"
        }
        ]
      };
      QDP.generator.init(options);
    },
    /** 卸载模块 */
    destroy: function () {

    }
  };
});
