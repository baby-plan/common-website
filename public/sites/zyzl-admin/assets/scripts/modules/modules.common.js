/* ========================================================================
 * App.plugins.admin v1.0
 * 102.用户管理插件
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * ======================================================================== */
define(['jquery', 'QDP'],
  function ($, QDP) {
    "use strict";

    // 用户登录后自动加载数据库字典表内容
    QDP.event.on("layout.logined", function () {
      console.debug("[AUTO]加载服务器设置内容!");
      var url = QDP.api.options.getapi;
      QDP.ajax.get(url, {}, function (json) {
        $.each(json.data, function (index, item) {
          if (QDP.cfgs.settings[item[0]] == undefined) {
            QDP.cfgs.settings[item[0]] = {};
          }
          QDP.cfgs.settings[item[0]] = QDP.base64.decode([item[1]]);
        });
        next();
      });
    });

    /**初始化角色列表方法
     * @param  {} filter
     * @param  {} column
     * @param  {} value
     */
    var initRole = function (filter, column, value) {
      var select = $("<select/>")
        .attr("id", filter.name)
        .addClass("form-control")
        .appendTo(column);
      QDP.form.initCache({
        "api": QDP.api.role.alldatasapi,
        "target": $("#" + filter.name),
        "valuefn": function (index, item) { return item.id; },
        "textfn": function (index, item) { return QDP.base64.decode(item.name); },
        "done": function () { $("#" + filter.name).attr("data-value", value); }
      });
    }

    /** 初始化角色列表方法
     * @param  {} filter
     * @param  {} column
     */
    var initType = function (filter, column) {
      $("<select/>")
        .attr("id", filter.name)
        .addClass("form-control")
        .appendTo(column);
      QDP.form.initCache({
        "api": QDP.api.logs.typesapi,
        "target": $("#" + filter.name),
        "valuefn": function (index, item) {
          return item.type;
        },
        "textfn": function (index, item) {
          return item.type;
        }
      });
    }

    /** 初始化编辑界面,若data有值则视为编辑数据,否则视为新增数据
     * @param {object} data 编辑时传入的数据,新增时不需要
     */
    var initEditor = function (data) {
      //  var callback = function () {
      /* 初始化编辑界面 */
      var container = $("#role-container");
      // var regValidator = false;
      /* 递归模块列表 */
      $.each(QDP.config.modules, function (index, item) {
        if (item.parent == "000") {
          var groupContainer = $("<div/>").addClass("col-sm-12").appendTo(container);
          var div = $("<div />").addClass("col-sm-2 checkall").appendTo(groupContainer);
          $("<div/>").addClass("col-sm-10").attr("data-id", index).appendTo(groupContainer);
          $("<input/>").attr("type", "checkbox").attr("id", index).attr("name", "power").appendTo(div);
          $("<label/>").attr("for", index).text(" " + item.name).appendTo(div);
        } else {
          var childContainer = $("div[data-id='" + item.parent + "']");
          var div = $("<div />").addClass("col-sm-4").appendTo(childContainer);
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
          QDP.alertText("角色名称不能为空!");
          return;
        }
        args.name = QDP.base64.encode(args.name);
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

    var loadArticle = function (userid, pageindex) {
      var callback = function (json) {
        $("#btn_load").attr("data-index", parseInt(pageindex) + 1);
        if (json.data.pagecount == json.data.pagenumber) {
          $("#btn_load").hide();
        }
        $.each(json.data.list, function (index, item) {
          item.text = App.base64.decode(item.text);
          item.client = App.base64.decode(item.client);
          item.nickname = App.base64.decode(item.nickname);
          item.IS_SELF = (App.userinfo.nickname == item.nickname);
          if (item.imgs != undefined) {
            item.HAS_IMAGE = true;
            var imgs = item.imgs.split(",");
            item.imgs = [];
            $.each(imgs, function (ci, ct) {
              item.imgs.push(ct);
            });
          }
        });
        $("#article-data").tmpl(json.data.list, {
          "api": function () { return API.files.getapi; }
        }).appendTo('.feed-activity-list');
        setTimeout(function () {
          App.contentChanged();
          App.plugins.actions.refreshData();
        }, 500);
      };
      var params = { "userid": App.base64.encode(userid) };
      if (pageindex > 1) {
        params.pagenumber = pageindex;
      }
      App.ajax(API.profile.listapi, params, callback);
    }

    var loadProfile = function (userid) {
      var callback = function (json) {
        json.data.name = QDP.base64.decode(json.data.name);
        json.data.describe = QDP.base64.decode(json.data.describe);
        json.data.addr = QDP.base64.decode(json.data.addr);
        json.data.url = QDP.api.files.getapi + json.data.header;
        $("#info-data").tmpl(json.data).appendTo('#info-panel');
        $('.feed-activity-list').empty();
        $("#btn_load").on("click", function (e) {
          loadArticle(userid, $("#btn_load").attr("data-index"));
        });
        loadArticle(userid, 1);
      }
      var params = { "userid": QDP.base64.encode(userid) };
      QDP.ajax.get(QDP.api.profile.info, params, callback);
    }

    var initModuleParents = function (filter, column, value) {
      var select = $("<select/>")
        .attr("id", filter.name)
        .addClass("form-control")
        .appendTo(column);
      QDP.form.initCache({
        "api": QDP.api.module.parents,
        "target": $("#" + filter.name),
        "valuefn": function (index, item) { return item.ModuleID; },
        "textfn": function (index, item) { return QDP.base64.decode(item.ModuleName); },
        "done": function () {
          $("#" + filter.name).append($("<option/>").val("000").text("根目录"));
          $("#" + filter.name).attr("data-value", value);
        }
      });
    }

    return {
      'define': {
        "name": "公共功能模块",
        "version": "1.0.0.0",
        'copyright': ' Copyright 2017-2027 WangXin nvlbs,Inc.',
      },

      "init-profile": function (userid) {
        if (userid == undefined) {
          userid = QDP.userinfo.account;
        }
        loadProfile(userid);
      },

      /** 加载账号管理界面 */
      "init-admin": function () {
        var options = {
          "apis": {
            "list": QDP.api.admin.datas,
            "insert": QDP.api.admin.add,
            "update": QDP.api.admin.update,
            "delete": QDP.api.admin.remove
          },
          "texts": { "insert": "新增用户", "update": "用户编辑" },
          "headers": { "edit": { "text": "用户信息" }, "table": { "text": "用户列表" } },
          "actions": { "insert": true, "update": true, "delete": true },
          "columns": [
            { "name": "_index", "text": "序号" },
            { "name": "id", "primary": true },
            { "name": "account", "text": "登录名", "base64": true, "edit": true, "filter": true },
            { "name": "name", "text": "姓名", "base64": true, "edit": true, "filter": true },
            { "name": "nickname", "text": "昵称", "base64": true, "edit": true, "filter": true },
            { "name": "email", "text": "EMail", "base64": true, "edit": true, "valid": "email", "filter": true },
            { "name": "roleid", "text": "角色", "edit": true, "custom": initRole, "grid": false, "filter": true },
            { "name": "rolename", "text": "角色名称", "base64": true },
            { "name": "_action", "text": "操作" }
          ]
        };
        QDP.generator.init(options);
      },

      /** 卸载账号管理界面 */
      'uninit-admin': function () {
        // console.log('uninit-admin');
      },

      /** 加载日志查询管理 */
      "init-log-search": function () {
        var options = {
          "apis": {
            "list": QDP.api.logs.datas
          },
          "columns": [
            { "name": "_index", "text": "序号" },
            { "name": "id", "primary": true },
            { "name": "owner", "text": "所属账号", "base64": true, "filter": true, "filterindex": 2 },
            { "name": "type", "text": "日志类型", "custom": initType, "filter": true, "filterindex": 1 },
            { "name": "msg", "text": "详情", "base64": true, "filter": true, "filterindex": 3 },
            { "name": "date", "text": "操作时间", "type": "datetime", "filter": "daterange", "filterindex": 5 },
            { "name": "ip", "text": "登录IP", "base64": true, "filter": true, "filterindex": 4 }
          ]
        };
        QDP.generator.init(options);
      },

      /** 加载角色管理界面 */
      "init-role": function () {
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

      /** 加载参数设置界面 */
      'init-options': function () {
        QDP.form.init();
        var api = QDP.api.options.getoptionapi;
        var keys = "password,pagesize";
        keys = QDP.base64.encode(keys);
        QDP.ajax.get(api, { "keys": keys }, function (json) {
          $("#password").val(QDP.base64.decode(json.data.password));
          $("#pagesize").val(QDP.base64.decode(json.data.pagesize));
        });
        // 处理保存按钮事件
        $(".btn_save").on("click", function (e) {
          e.preventDefault();
          var options = {
            "password": QDP.base64.encode($("#password").val()),
            "pagesize": QDP.base64.encode($("#pagesize").val())
          };

          // 执行操作并且重新加载页面,用于刷新数据
          QDP.ajax(QDP.api.options.setoptionapi, options, function (json) { QDP.alertText("保存设置成功!"); });
        });
      },

      /** 加载模块菜单管理界面 */
      "init-module": function () {
        var options = {
          "apis": {
            "list": QDP.api.module.datas,
            "insert": QDP.api.module.add,
            "update": QDP.api.module.update,
            "delete": QDP.api.module.remove
          },
          "texts": { "insert": "新增功能模块", "update": "功能模块编辑" },
          "headers": { "edit": { "text": "功能模块信息" }, "table": { "text": "功能模块列表" } },
          "actions": { "insert": true, "update": true, "delete": true },
          "columns": [
            { "name": "_index", "text": "序号" },
            { "name": "ModuleID", "text": "菜单编号", "primary": true, "edit": true, "display": true },
            { "name": "ModuleName", "text": "菜单名称", "base64": true, "edit": true, "filter": true },
            { "name": "ModuleParent", "text": "所属父级", "custom": initModuleParents, "edit": true, "filter": true },
            { "name": "ModulePage", "text": "页面地址", "notempty": true, "base64": true, "edit": true },
            { "name": "ModulePackage", "text": "页面组件包", "notempty": true, "base64": true, "edit": true },
            { "name": "ModuleInitMethod", "text": "页面初始化方法", "notempty": true, "base64": true, "edit": true },
            { "name": "ModuleMethods", "text": "页面功能清单", "notempty": true, "base64": true, "edit": true },
            { "name": "ModuleDestory", "text": "页面销毁函数", "notempty": true, "base64": true, "edit": true },
            { "name": "ModuleIcon", "text": "页面图标", "notempty": true, "base64": true, "edit": true },
            { "name": "ModuleDesc", "text": "页面描述", "notempty": true, "base64": true, "edit": true },
            { "name": "CreateUser", "text": "创建者", "base64": true },
            { "name": "CreateTime", "text": "创建时间", "type": "datetime" },
            { "name": "LastModifyUser", "text": "最后修改者", "base64": true },
            { "name": "LastModiftTime", "text": "最后修改时间", "type": "datetime" },
            { "name": "state", "text": "状态" },
            { "name": "_action", "text": "操作" }
          ]
        };
        QDP.generator.init(options);
      },
      /** 加载模块方法管理界面 */
      "init-method": function () {
        var options = {
          "apis": {
            "list": QDP.api.method.datas,
            "insert": QDP.api.method.add,
            "update": QDP.api.method.update,
            "delete": QDP.api.method.remove
          },
          "texts": { "insert": "新增模块功能", "update": "模块功能编辑" },
          "headers": { "edit": { "text": "模块功能信息" }, "table": { "text": "模块功能列表" } },
          "actions": { "insert": true, "update": true, "delete": true },
          "columns": [
            { "name": "_index", "text": "序号" },
            { "name": "methodid", "text": "功能代码", "display": true, "edit": true, "primary": true, "filter": true },
            { "name": "methodname", "text": "功能名称", "base64": true, "edit": true, "filter": true },
            { "name": "remark", "text": "功能描述", "base64": true, "edit": true },
            { "name": "_action", "text": "操作" }
          ]
        };
        QDP.generator.init(options);
      }
    }
  });