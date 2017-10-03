/* ========================================================================
 * App.plugins.admin v1.0
 * 102.用户管理插件
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * ======================================================================== */
define(['jquery', 'QDP'], function ($, QDP) {
  "use strict";



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

  var loadArticle = function (userid, pageindex) {
    var callback = function (json) {
      $("#btn_load").attr("data-index", parseInt(pageindex) + 1);
      if (json.data.pagecount == json.data.pagenumber) {
        $("#btn_load").hide();
      }
      $.each(json.data.list, function (index, item) {
        item.text = QDP.base64.decode(item.text);
        item.client = QDP.base64.decode(item.client);
        item.nickname = QDP.base64.decode(item.nickname);
        item.utcdate = QDP.util.utcToCN(item.date);
        item.IS_SELF = (QDP.config.INFO.nickname == item.nickname);
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
        "api": function () { return QDP.api.files.getapi; }
      }).appendTo('.feed-activity-list');
    };
    var params = { "userid": QDP.base64.encode(userid) };
    if (pageindex > 1) {
      params.pagenumber = pageindex;
    }
    QDP.ajax.get(QDP.api.profile.listapi, params, callback);
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

  return {
    'define': {
      "name": "公共功能模块",
      "version": "1.0.0.0",
      'copyright': ' Copyright 2017-2027 WangXin nvlbs,Inc.',
    },

    'load-profile': function (userid) {
      if (userid == undefined) {
        userid = QDP.config.INFO.account;
      }
      loadProfile(userid);
    },

    "init-profile": function () {
      this['load-profile'](undefined);
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
          { "name": "owner", "text": "操作员账号", "base64": true, "filter": true, "filterindex": 2 },
          { "name": "type", "text": "日志类型", "custom": initType, "filter": true, "filterindex": 1 },
          { "name": "msg", "text": "详情", "base64": true, "filter": true, "filterindex": 3 },
          { "name": "date", "text": "操作时间", "type": "datetime" },
          { "name": "ip", "text": "登录IP", "base64": true, "filter": true, "filterindex": 4 },
          { "name": "date_search", "text": "开始时间", "type": "datetime", grid: false, "filter": "daterange", "filterindex": 5 },
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
    
  }
});