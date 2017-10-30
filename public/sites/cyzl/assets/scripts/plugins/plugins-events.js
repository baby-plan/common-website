define(['jquery', 'QDP'], function ($, QDP) {
  "use strict";
  let isFullScreen = false;

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

  // EVENT-ON:layout.started
  QDP.event.on("layout.started", function () {

    console.info("注册->系统运行后自动注册 - plugins-events");

    // 注册导航栏收起/展开开关点击事件
    $('body').on("click", ".sidebar-collapse", () => {
      if ($("body").hasClass("mini-menu")) {
        $("body").removeClass("mini-menu");
        // EVENT-ON:siderbar.collapse 导航栏折叠后触发
        QDP.event.raise('sidebar.collapse');
      } else {
        $("body").addClass("mini-menu");
        // EVENT-ON:siderbar.expand 导航栏展开后触发
        QDP.event.raise('sidebar.expand');
      }
      // 延迟触发
      // EVENT-ON:siderbar.changed 导航栏折叠\展开状态切换后触发
      setTimeout(function () {
        QDP.event.raise('sidebar.changed');
      }, 300);
    });

    // 处理全屏展示功能
    $('body').on('click', '.sys-fullscreen', () => {
      isFullScreen = !isFullScreen;
      if (isFullScreen) {
        fullScreen();
      } else {
        exitFullScreen();
      }
    });

    // 修改密码功能
    $('body').on("click", '.sys-chgpwd', () => {

      QDP.form.openWidow({
        'title': "修改密码",
        'width': '400px',
        'height': '230px',
        'url': QDP.api.login.changepwdpage,
        'onshow': function (parent) {
          // if (App.userinfo) {
          //   $("#fbmodal #username").val(App.userinfo.account);
          // }

          // 处理确定按钮事件
          $(".btn-save").on("click", function (e) {
            e.preventDefault();
            var oldpwd = $("#oldpwd", parent).val();
            var newpwd = $("#newpwd", parent).val();
            var newpwd2 = $("#newpwd2", parent).val();
            if (oldpwd == "") {
              alert("原始密码不能为空!");
              return;
            }
            if (newpwd == "") {
              alert("新密码不能为空!");
              return;
            }
            if (newpwd != newpwd2) {
              alert("两次密码输入不一致,请核实后重新输入!");
              return;
            }

            // var options = {
            //   "n": App.base64.encode(newpwd),
            //   "p": App.base64.encode(oldpwd)
            // };
            // App.ajax(API.login.changepwdapi, options, function (json) {
            //   App.dialog.close(); // 关闭模式窗口
            //   App.route.gotoLogin();
            // });
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
      var trs = $('table>tbody>tr[data-id]');
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
      var trs = $('table>tbody>tr[data-id]');
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

    $('body').on('click', "table", function (e) {
      try {
        if (e.target.localName == 'td') {
          var tr = $(e.target).parent();
          if (tr.data('id') == undefined) {
            return;
          }
          if (tr.hasClass('selected')) {
            tr.removeClass('selected');
          } else {
            tr.addClass('selected');
          }
        } else if ($(e.target).parent()[0].localName == 'td') {
          var tr = $(e.target).parent().parent();
          if (tr.data('id') == undefined) {
            return;
          }
          if (tr.hasClass('selected')) {
            tr.removeClass('selected');
          } else {
            tr.addClass('selected');
          }
        }
        refreshButtonStatus();
      } catch (e) {

      }
      // console.log(e);
    });

    var refreshButtonStatus = function () {
      var selector = $('table>tbody>tr[class="selected"]');
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
      // EVENT-RAISE:table.selected table选中行后出发 {selector,length}
      QDP.event.raise('table.selected', {
        "selector": selector,
        "length": selector.length
      });
    }

  });

});