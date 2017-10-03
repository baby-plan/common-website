/* ========================================================================
 * App.modules.profile v1.0
 * 0101.个人资料信息
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  "use strict";
  var loadArticle = (userid, pageindex) => {
    var callback = function (json) {
      $("#btn_load").attr("data-index", parseInt(pageindex) + 1);
      if (json.data.pagecount == json.data.pagenumber) {
        $("#btn_load").hide();
      }
      $.each(json.data.list, (index, item) => {
        item.text = App.base64.decode(item.text);
        item.client = App.base64.decode(item.client);
        item.nickname = App.base64.decode(item.nickname);
        item.IS_SELF = (App.userinfo.nickname == item.nickname);
        if (item.imgs != undefined) {
          item.HAS_IMAGE = true;
          var imgs = item.imgs.split(",");
          item.imgs = [];
          $.each(imgs, (ci, ct) => {
            item.imgs.push(ct);
          });
        }
      });
      $("#article-data").tmpl(json.data.list, {
        "api": () => { return API.files.getapi; }
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
  var loadProfile = (userid) => {
    var callback = (json) => {
      json.data.name = App.base64.decode(json.data.name);
      json.data.describe = App.base64.decode(json.data.describe);
      json.data.addr = App.base64.decode(json.data.addr);
      json.data.url = API.files.getapi + json.data.header;
      $("#info-data").tmpl(json.data).appendTo('#info-panel');
      $('.feed-activity-list').empty();
      $("#btn_load").on("click", (e) => {
        loadArticle(userid, $("#btn_load").attr("data-index"));
      });
      loadArticle(userid, 1);
    }
    var params = { "userid": App.base64.encode(userid) };
    App.ajax(API.profile.info, params, callback);
  }
  app.modules.profile = (userid) => {
    if (userid == undefined) {
      userid = App.userinfo.account;
    }
    loadProfile(userid);
  }
})(App);