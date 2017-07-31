define(['jquery', 'define', 'API'], function ($, App, API) {

  var readCookie = () => {
    var cookieStr = $.cookie(API.login.token_cookie);
    App.logger.debug("读取COOKIE " + API.login.token_cookie);
    if (cookieStr == undefined || cookieStr == "") {
      App.logger.debug("COOKIE " + API.login.token_cookie + " 不存在或没有值！");
      return undefined;
    } else {
      App.logger.debug("COOKIE " + API.login.token_cookie + " = " + cookieStr);
      App.userinfo = $.parseJSON(cookieStr);
      return App.userinfo;
    }
  }

  var saveCookie = (json) => {
    if (json == "") {
      $.cookie(API.login.token_cookie, "");
      App.userinfo = null;
      App.logger.debug("清除COOKIE " + API.login.token_cookie);
    } else {
      App.userinfo = json.data;
      App.userinfo.name = App.base64.decode(App.userinfo.name);
      App.userinfo.rolename = App.base64.decode(App.userinfo.rolename);
      App.userinfo.nickname = App.base64.decode(App.userinfo.nickname);
      App.userinfo.account = App.base64.decode(App.userinfo.account);
      App.userinfo.email = App.base64.decode(App.userinfo.email);
      $.cookie(API.login.token_cookie, App.util.jsonToString(App.userinfo));
      App.logger.debug("保存COOKIE " +
        API.login.token_cookie +
        " = " + App.util.jsonToString(App.userinfo));
    }
  }

  /** 
   * 将登录信息JSON内容保存至COOKIE.
   * @param {object} json 要保存的JSON内容,目前仅保存登录信息.
   */
  App.saveCookie = saveCookie;

  /** 读取COOKIE中的登录信息JSON内容. */
  App.readCookie = readCookie;

});