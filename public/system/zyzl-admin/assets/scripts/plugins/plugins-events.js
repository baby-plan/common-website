define(['jquery', 'QDP'], function ($, QDP) {
  "use strict";
  let isFullScreen = false;
  /** 当前登录状态是否超时 */
  let isLoginTimeout = false;

  var fullScreen = () => {
    var docElm = document.documentElement;
    //W3C  
    if (docElm.requestFullscreen) {
      isFullScreen = true;
      docElm.requestFullscreen();
    }
    //FireFox  
    else if (docElm.mozRequestFullScreen) {
      isFullScreen = true;
      docElm.mozRequestFullScreen();
    }
    //Chrome等  
    else if (docElm.webkitRequestFullScreen) {
      isFullScreen = true;
      docElm.webkitRequestFullScreen();
    }
    //IE11
    else if (docElm.msRequestFullscreen) {
      isFullScreen = true;
      docElm.msRequestFullscreen();
    }
  }

  var exitFullScreen = () => {
    if (document.exitFullscreen) {
      isFullScreen = false;
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      isFullScreen = false;
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      isFullScreen = false;
      document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
      isFullScreen = false;
      document.msExitFullscreen();
    }
  }

  /** 导航至系统主界面 */
  var gotoMain = function () {

    // EVENT-RAISE:layout.logined 用户登录后触发,{cfgs.INFO}
    QDP.raise("layout.logined", QDP.config.INFO);

    $("body").removeClass("login");
    $('body>section').empty();
    $('body>section').height($(document).height());

    // 加载导航页面
    QDP.block("初始化导航", $("body>aside"));
    $("body>aside").load(QDP.config.navpage, function () {
      QDP.unblock($("body>aside"));
      QDP.layout.initMenu();
      QDP.layout.resizeScroller();
    });

    // 加载主页面
    QDP.block("初始化页面", $("body>section"));
    $("body>section").load(QDP.config.mainpage, function () {
      QDP.unblock($("body>section"));
      $(".username").text(QDP.config.INFO.name);
      $(".userrole").text(QDP.config.INFO.rolename);
      QDP.layout.resizeContentScroller();
    });
  };

  /** 导航至登录界面 */
  var gotoLogin = function () {

    QDP.cookie.save("");
    $("body").addClass("login");
    $("body>section").removeAttr("style");
    $("body>aside").removeAttr("style");
    $("body>aside").empty();

    var loginPageLoadCallback = function () {
      $(".btn-login").on("click", function () {

        var username = $("#username").val();
        var password = $("#password").val();
        if (!username || username == "") {
          QDP.alert("账号不能为空!");
          return;
        }
        if (!password || password == "") {
          QDP.alert("密码不能为空!");
          return;
        }
        var options = {
          u: username,
          p: password
        };

        QDP.post(QDP.api.login.loginapi, options, function (json) {
          QDP.cookie.save(json);
          gotoMain();
        });
      });
    };

    $("body>section").load(QDP.config.loginpage, loginPageLoadCallback);
  };

  // EVENT-ON:layout.initialize
  QDP.on("layout.initialize", function () {
    // console.time(times.initialize);
    if (!(QDP.config.INFO = QDP.cookie.read())) {
      console.info("TOKEN验证失败,重新登录");
      gotoLogin(); /*不存在token或token失效，需重新登录*/
    } else {
      console.info("TOKEN验证成功,进入系统");
      gotoMain(); /*token有效，可正常使用系统*/
    }
  });

  // EVENT-ON:layout.started
  QDP.on("layout.started", function () {

    console.info("注册->系统运行后自动注册 - plugins-events");

    // 注册导航栏收起/展开开关点击事件
    $('body').on("click", ".sidebar-collapse", function () {
      if ($("body").hasClass("mini-menu")) {
        $("body").removeClass("mini-menu");
        // EVENT-ON:siderbar.collapse 导航栏折叠后触发
        QDP.raise('sidebar.collapse');
      } else {
        $("body").addClass("mini-menu");
        // EVENT-ON:siderbar.expand 导航栏展开后触发
        QDP.raise('sidebar.expand');
      }
      // 延迟触发
      // EVENT-ON:siderbar.changed 导航栏折叠\展开状态切换后触发
      setTimeout(function () {
        QDP.raise('sidebar.changed');
      }, 300);
    });

    // 处理全屏展示功能
    $('body').on('click', '.sys-fullscreen', function () {
      isFullScreen = !isFullScreen;
      if (isFullScreen) {
        fullScreen();
      } else {
        exitFullScreen();
      }
    });

    // 修改密码功能
    $('body').on("click", '.sys-chgpwd', function () {
      QDP.form.openWidow({
        'title': "修改密码",
        'width': '400px',
        'height': '360px',
        'url': "views/business/change-password.html",
        'onshow': function (parent) {

          $('form', parent).bootstrapValidator({
            feedbackIcons: {/*输入框不同状态，显示图片的样式*/
              valid: 'glyphicon glyphicon-ok',
              invalid: 'glyphicon glyphicon-remove',
              validating: 'glyphicon glyphicon-refresh'
            },
            fields: {/*验证*/
              oldpwd: {
                validators: {
                  notEmpty: {
                    message: '原始密码不能为空'
                  }
                }
              },
              newpwd: {
                validators: {
                  notEmpty: {
                    message: '新密码不能为空'
                  },
                  stringLength: {
                    min: 6,
                    max: 30,
                    message: '密码长度必须在6到30之间'
                  },
                  // identical: {//相同
                  //   field: 'newpwd2', //需要进行比较的input name值
                  //   message: '两次密码不一致'
                  // },
                  // different: {//不能和用户名相同
                  //   field: 'username',//需要进行比较的input name值
                  //   message: '不能和用户名相同'
                  // },
                  regexp: {
                    regexp: /^[a-zA-Z0-9_\.]+$/,
                    message: '密码需由字母、数字、下划线组成'
                  }
                }
              },
              newpwd2: {
                validators: {
                  notEmpty: {
                    message: '确认密码不能为空'
                  },
                  identical: {//相同
                    field: 'newpwd',
                    message: '两次密码不一致'
                  },
                  // different: {//不能和用户名相同
                  //   field: 'username',
                  //   message: '不能和用户名相同'
                  // },
                  regexp: {
                    regexp: /^[a-zA-Z0-9_\.]+$/,
                    message: '密码需由字母、数字、下划线组成'
                  }
                }
              }
            }
          });
          
          // 处理确定按钮事件
          $(".btn-save").on("click", function (e) {
            e.preventDefault();
            var validator = $('form', parent).data("bootstrapValidator");
            validator.validate();
            if (validator.isValid()) {
              var options = {
                "oldpwd": $("#oldpwd", parent).val(),
                "newpwd": $("#newpwd", parent).val(),
                "newpwd2": $("#newpwd2", parent).val()
              };
              QDP.post(QDP.api.login.changepwdapi, options, function () {
                parent.modal('hide');
              });
            }
          });
        }
      });
    });

    // 修改个人信息
    $('body').on("click", 'aside>header,.sys-changeinfo', function () {
      QDP.form.openWidow({
        'title': "修改个人信息",
        'width': '400px',
        'height': '260px',
        'url': "views/business/change-userinfo.html",
        'onshow': function (parent) {

          $('form', parent).bootstrapValidator({
            feedbackIcons: {/*输入框不同状态，显示图片的样式*/
              valid: 'glyphicon glyphicon-ok',
              invalid: 'glyphicon glyphicon-remove',
              validating: 'glyphicon glyphicon-refresh'
            },
            fields: {/*验证*/
              nickname: {
                validators: {
                  notEmpty: {
                    message: '昵称不能为空'
                  },
                  // stringLength: {
                  //   min: 6,
                  //   max: 30,
                  //   message: '昵称长度必须在6到30之间'
                  // }
                }
              },
              phone: {
                validators: {
                  notEmpty: {
                    message: '手机号码不能为空'
                  },
                  stringLength: {
                    min: 11,
                    max: 11,
                    message: '请输入11位手机号码'
                  },
                  regexp: {
                    regexp: /^1[3|5|8]{1}[0-9]{9}$/,
                    message: '请输入正确的手机号码'
                  }
                }
              },
              email: {
                validators: {
                  notEmpty: {
                    message: '邮箱不能为空'
                  },
                  emailAddress: {
                    message: '请输入正确的邮箱地址'
                  }
                }
              }
            }
          });

          var INFO = QDP.config.INFO;
          $('#nickname', parent).val(INFO.nickname);
          $('#phone', parent).val(INFO.phone);
          $('#email', parent).val(INFO.email);

          // 处理确定按钮事件
          $(".btn-save").on("click", function (e) {
            e.preventDefault();
            var validator = $('form', parent).data("bootstrapValidator");
            validator.validate();
            if (validator.isValid()) {
              var options = {
                "nickname": $("#nickname", parent).val(),
                "phone": $("#phone", parent).val(),
                "email": $("#email", parent).val()
              };
              QDP.post(QDP.api.login.changepwdapi, options, function () {
                parent.modal('hide');
              });
            }
          });

        }
      });

    });

    /** 刷新功能 */
    $('body').on('click', '.btn-refresh', function () {
      QDP.table.reload();
    });

    /** 导出功能 */
    $('body').on('click', '.btn-export', function () {
      QDP.table.export();
    });

    /* 处理【取消/返回】按钮事件 */
    $('body').on('click', '.btn-back', function (e) {
      e.preventDefault();
      if ($(this).hasClass("custom") == false) {
        QDP.layout.back();
      }
    });

    // 全选按钮点击事件处理函数
    $('body').on('click', '.btn-selectall', function () {
      var trs = $('.qdp-table>tbody>tr[data-id]');
      trs.each(function (index) {
        if (!$(this).hasClass('selected')) {
          $(this).addClass('selected');
        }
        if (trs.length - 1 == index) {
          refreshButtonStatus();
        }
      });
    });

    // 反选按钮点击事件处理函数
    $('body').on('click', '.btn-selectopp', function () {
      var trs = $('.qdp-table>tbody>tr[data-id]');
      trs.each(function (index) {
        if ($(this).hasClass('selected')) {
          $(this).removeClass('selected');
        } else {
          $(this).addClass('selected');
        }
        if (trs.length - 1 == index) {
          refreshButtonStatus();
        }
      });
    });

    $('body').on('click', ".qdp-table", function (e) {
      try {
        var tr;

        if (e.target.localName == 'td') {
          tr = $(e.target).parent();
        } else if ($(e.target).parent()[0].localName == 'td') {
          tr = $(e.target).parent().parent();
        }

        if (tr.data('id') == undefined) {
          return;
        }
        if (tr.hasClass('selected')) {
          tr.removeClass('selected');
        } else {

          if (!$(this).attr('qdp-mulit')) {
            $(".qdp-table tr.selected").removeClass('selected');
          }

          tr.addClass('selected');
        }

        refreshButtonStatus();
      } catch (e) {

      }
      // console.log(e);
    });

    /* 安全退出按钮点击事件处理函数 */
    $('body').on('click', '.sys-logout', function () {
      QDP.post(QDP.api.login.logoutapi, {}, function () {
        gotoLogin();
      });
    });

    $('body').on('keyup', '.password', function () {
      var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
      var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
      var enoughRegex = new RegExp("(?=.{6,}).*", "g");

      if (false == enoughRegex.test($(this).val())) {
        $('.pw-strength').removeClass('pw-weak');
        $('.pw-strength').removeClass('pw-medium');
        $('.pw-strength').removeClass('pw-strong');
        $('.pw-strength').addClass('pw-defule');
        //密码小于六位的时候，密码强度图片都为灰色 
      }
      else if (strongRegex.test($(this).val())) {
        $('.pw-strength').removeClass('pw-weak');
        $('.pw-strength').removeClass('pw-medium');
        $('.pw-strength').removeClass('pw-strong');
        $('.pw-strength').addClass('pw-strong');
        //密码为八位及以上并且字母数字特殊字符三项都包括,强度最强 
      }
      else if (mediumRegex.test($(this).val())) {
        $('.pw-strength').removeClass('pw-weak');
        $('.pw-strength').removeClass('pw-medium');
        $('.pw-strength').removeClass('pw-strong');
        $('.pw-strength').addClass('pw-medium');
        //密码为七位及以上并且字母、数字、特殊字符三项中有两项，强度是中等 
      }
      else {
        $('.pw-strength').removeClass('pw-weak');
        $('.pw-strength').removeClass('pw-medium');
        $('.pw-strength').removeClass('pw-strong');
        $('.pw-strength').addClass('pw-weak');
        //如果密码为6为及以下，就算字母、数字、特殊字符三项都包括，强度也是弱的 
      }
      return true;
    });


    var refreshButtonStatus = function () {
      var selector = $('table>tbody>tr[class*="selected"]');
      if (selector.length == 1) {
        $(".btn-edit").removeAttr('disabled');
        $(".btn-preview").removeAttr('disabled');
        $(".btn-remove").removeAttr('disabled');
      } else if (selector.length == 0) {
        $(".btn-edit").attr('disabled', "true");
        $(".btn-preview").attr('disabled', "true");
        $(".btn-remove").attr('disabled', "true");
      } else {
        $(".btn-remove").removeAttr('disabled');
        $(".btn-preview").attr('disabled', "true");
        $(".btn-edit").attr('disabled', "true");
      }
      // EVENT-RAISE:table.selected table选中行后触发 {selector,length}
      QDP.raise('table.selected', {
        "selector": selector,
        "length": selector.length
      });
    }

  });

  // EVENT-ON:layout.logined 当用户登录后触发：用于处理登录超时后弹出多个对话框
  QDP.on("layout.logined", function () {
    isLoginTimeout = false;
  });

  // EVENT-ON:login.timeout 当用户session过期时出发，进入用户登录界面
  QDP.on("login.timeout", function () {
    // 解决登录超时后弹出多个对话框
    if (isLoginTimeout) {
      return;
    }
    isLoginTimeout = true;

    QDP.alert("登录超时,请重新登录", function () {
      gotoLogin();
    });
  });

});