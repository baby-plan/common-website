define(['jquery', 'cfgs', 'API',
  'core/core-modules/framework.base64',
  'core/core-modules/framework.util', 'jquery.cookie'], function ($, cfgs, API, base64, util) {


    /** 将登录信息JSON内容保存至COOKIE.
     * @param {object} json 要保存的JSON内容,目前仅保存登录信息.
     */
    var saveCookie = function (json) {
      if (json == "") {
        $.cookie(API.login.token_cookie, "");
        cfgs.INFO = null;
        console.debug("清除COOKIE " + API.login.token_cookie);
      } else {
        cfgs.INFO = json.data;
        cfgs.INFO.name = base64.decode(cfgs.INFO.name);
        cfgs.INFO.rolename = base64.decode(cfgs.INFO.rolename);
        cfgs.INFO.nickname = base64.decode(cfgs.INFO.nickname);
        cfgs.INFO.account = base64.decode(cfgs.INFO.account);
        cfgs.INFO.email = base64.decode(cfgs.INFO.email);
        $.cookie(API.login.token_cookie, util.jsonToString(cfgs.INFO));
        console.debug("保存COOKIE " + API.login.token_cookie + " = " + util.jsonToString(cfgs.INFO));
      }
    }

    /** 读取COOKIE中的登录信息JSON内容. */
    var readCookie = function () {
      var cookieStr = $.cookie(API.login.token_cookie);
      console.debug("读取COOKIE " + API.login.token_cookie);
      if (cookieStr == undefined || cookieStr == "") {
        console.debug("COOKIE " + API.login.token_cookie + " 不存在或没有值！");
        return undefined;
      } else {
        console.debug("COOKIE " + API.login.token_cookie + " = " + cookieStr);
        var json = $.parseJSON(cookieStr);
        cfgs.INFO = json;
        return json;
      }
    }

    return {
      'define': {
        "name": "COOKIE操作模块",
        "version": "1.0.0.0",
        'copyright': ' Copyright 2017-2027 WangXin nvlbs,Inc.',
      },
      save: saveCookie,
      read: readCookie
    }
  });