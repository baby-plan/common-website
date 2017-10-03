/* ========================================================================
 * App.route v1.0
 * 页面导航组件
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 *
 * ======================================================================== */
(function (app) {
  app.route = {
    /**
     * 导航至前一界面
     */
    "back": function () {
      /// <summary>返回前一页面.</summary>
      auto_navigation(pageOptions.menus);
    }
    /**
     * 导航至系统登录界面
     */
    ,
    "gotoLogin": function () {
      /// <summary>导航至登录界面.</summary>
      $("header").hide();
      $("section").attr("id", "");
      $("body").addClass("login");
      var loginPageLoadCallback = function () {
        $(".btn-login").on("click", function () {
          var username = $("#inputusername").val();
          var password = $("#inputpassword").val();
          if (!username || username == "") {
            App.alertText("账号不能为空!");
            return;
          }
          if (!password || password == "") {
            App.alertText("密码不能为空!");
            return;
          }
          var options = {
            "u": App.base64.encode(username),
            "p": App.base64.encode(password)
          };
          var callback = function (json) {
            App.saveCookie(json);
            App.route.gotoMain();
          };
          App.ajax(API.login.loginapi, options, callback);
        });
      }
      $("section").load(API.login.page, loginPageLoadCallback);
    }
    /**
     * 导航至系统主界面
     */
    ,
    "gotoMain": function () {
      /// <summary>导航至系统主界面.</summary>
      $("header").show();
      $("body").removeClass("login");
      $("section").attr("id", "page");
      var username = App.userinfo.name;
      var rolename = App.userinfo.rolename;
      $(".username").text(username + "【" + rolename + "】");
      $("#page").load(API.login.mainpage, function () {
        App.init();
      });
    }
    /**
     * 导航至修改密码界面
     */
    ,
    "changepwd": function () {
      var callback = function () {
        if (App.userinfo) {
          $("#fbmodal #username").val(App.userinfo.account);
        }
        // 处理返回按钮事件
        $(".btn_back").on("click", function (e) {
          e.preventDefault();
          App.dialog.close(); // 关闭模式窗口
        });
        // 处理确定按钮事件
        $(".btn_save").on("click", function (e) {
          e.preventDefault();
          var oldpwd = $("#fbmodal #oldpwd").val();
          var newpwd = $("#fbmodal #newpwd").val();
          var newpwd2 = $("#fbmodal #newpwd2").val();
          if (oldpwd == "") {
            App.alertText("原始密码不能为空!");
            return;
          }
          if (newpwd == "") {
            App.alertText("新密码不能为空!");
            return;
          }
          if (newpwd != newpwd2) {
            App.alertText("两次密码输入不一致,请核实后重新输入!");
            return;
          }

          var options = {
            "n": App.base64.encode(newpwd),
            "p": App.base64.encode(oldpwd)
          };
          App.ajax(API.login.changepwdapi, options, function (json) {
            App.dialog.close(); // 关闭模式窗口
            App.route.gotoLogin();
          });
        });
      };
      var options = {
        url: API.login.changepwdpage,
        title: "修改密码",
        width: "400",
        callback: callback
      }
      App.dialog.load(options);
    },
    "changeinfo": function () {
      var callback = function () {
        if (App.userinfo) {
          $("#fbmodal #account").val(App.userinfo.account);
          $("#fbmodal #username").val(App.userinfo.name);
          $("#fbmodal #nickname").val(App.userinfo.nickname);
          $("#fbmodal #email").val(App.userinfo.email);
        }
        // 处理返回按钮事件
        $(".btn_back").on("click", function (e) {
          e.preventDefault();
          App.dialog.close(); // 关闭模式窗口
        });
        // 处理确定按钮事件
        $(".btn_save").on("click", function (e) {
          e.preventDefault();
          var username = $("#fbmodal #username").val();
          var nickname = $("#fbmodal #nickname").val();
          var email = $("#fbmodal #email").val();
          if (username == "") {
            App.alertText("用户名称不能为空!");
            return;
          }
          if (nickname == "") {
            App.alertText("用户昵称不能为空!");
            return;
          }
          if (email == "") {
            App.alertText("Email不能为空!");
            return;
          }

          var options = {
            "username": App.base64.encode(newpwd),
            "email": App.base64.encode(email),
            "nickname": App.base64.encode(oldpwd)
          };
          App.ajax(API.login.changeinfoapi, options, function (json) {
            App.dialog.close(); // 关闭模式窗口
            App.route.gotoLogin();
          });
        });
      };
      var options = {
        url: API.login.changeinfopage,
        title: "个人信息",
        width: "400",
        callback: callback
      }
      App.dialog.load(options);
    }
  };
})(App);