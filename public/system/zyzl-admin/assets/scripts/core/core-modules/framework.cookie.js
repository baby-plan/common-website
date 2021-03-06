define(['jquery', 'cfgs', 'API', 'jquery.cookie'],
  function ($, cfgs, API) {

    class Cookie {
      /** 将登录信息JSON内容保存至COOKIE.
       * @param {JSON} json 要保存的JSON内容,目前仅保存登录信息.
       */
      static save(json) {
        if (json == "") {
          $.cookie(API.login.token_cookie, "");
          cfgs.INFO = null;
          console.debug("清除COOKIE " + API.login.token_cookie);
        } else {
          cfgs.INFO = json.data;
          $.cookie(API.login.token_cookie, JSON.stringify(cfgs.INFO));
          console.debug("保存COOKIE " + API.login.token_cookie + " = " + JSON.stringify(cfgs.INFO));
        }
      };

      /** 读取COOKIE中的登录信息JSON内容. */
      static read() {
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
      };

      static get define() {
        return {
          "name": "COOKIE操作模块",
          "version": "1.0.0.0",
          'copyright': ' Copyright 2017-2027 WangXin nvlbs,Inc.',
        }
      }
    }

    return Cookie;
  });