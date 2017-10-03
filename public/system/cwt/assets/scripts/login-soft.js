var Login = function () {
  var sessionId = "";
  var displayType = function (types) {
    $("#group_type").show();
   // $("#type").clear();
    $.each(types, function (index, item) {
      $("#type").append($("<option/>").val(item).text(bus_cfgs.dict.LOGINMODE[item]));
    });
  }
  var hideType = function () {
    $("#group_type").hide();
    $("#type").val("");
  }
  $("#username").on("change", function () {
    hideType();
  });
  var doLogin = function () {
    var username = $("#username").val();
    var password = $("#password").val();
    var captcha = $("#validateCode").val();
    if (!username || username == "") {
      App.alert("账号不能为空!");
      return;
    }
    if (!password || password == "") {
      App.alert("密码不能为空!");
      return;
    }
    if (!captcha || captcha == "") {
      App.alert("请输入验证码!");
      return;
    }
    var args = {
      "sessionId": sessionId
      , "u": App.base64.encode(username)
      , "p": App.base64.encode(password)
      , "captcha": captcha
      , "netType": $("#type").val()
    };

    //登录操作时异常码处理函数
    var login_error = function (code, message) {
      /// <summary>登录操作时异常码处理函数.</summary>
      /// <param name="code" type="string">错误代码.</param>
      /// <returns>返回校验结果boolean值,true代表验证通过,反之为false.</returns>
      if (code == "-101") {
        var msg = App.base64.decode(message);
        displayType(msg.split(","));
        return false;
      }
      return true;
    }
    var options = {
      "args": args,
      "error": login_error
    };
    var callback = function (json) {
      json.data.sessionId = sessionId;
      App.saveCookie(json);
      App.logger.info("登录成功，用户名=" + App.account.oper_name + ",集团=" + App.account.corp_name);
      App.gotoMain();
    };
    App.ajax(bus_cfgs.login.loginapi, options, callback);
  }
  
  var requestCaptcha = function () {
    var callback = function (json) {
      sessionId = json.data.sessionId;
      $("#captcha").attr("src", json.data.captch_url);
    };
    App.ajax(bus_cfgs.login.captchaapi,null, callback);
  }

  return {
    init: function () {
      hideType();
      requestCaptcha();
      $("#button-submit").on("click", function () {
        doLogin();
      });
    }
  };

}();