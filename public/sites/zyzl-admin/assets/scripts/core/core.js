define(['jquery', 'cfgs', 'API',
  'core/core-modules/framework.event',
  'core/core-modules/framework.ajax',
  'core/core-modules/framework.base64',
  'core/core-modules/framework.block',
  'core/core-modules/framework.dialog',
  'core/core-modules/framework.generator',
  'core/core-modules/framework.layout',
  'core/core-modules/framework.util',
  'core/core-modules/framework.form',
  'core/core-modules/framework.table',
  'core/core-modules/framework.row',
  'core/core-modules/framework.cell',
  'core/core-modules/framework.logger'],

  function ($, cfgs, api, event, ajax, base64, block, dialog, generator, layout, util, form, table, row, cell) {

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

    (function () {
      /* 处理【取消/返回】按钮事件 */
      $(document).on('click', '.btn_back', function (e) {
        e.preventDefault();
        if ($(this).hasClass("custom") == false) {
          layout.back();
        }
      });

      /* 注册按钮事件 */
      $(document).on('click', '.sys-logout', function (e) {
        ajax.get(api.login.logoutapi, {}, function (json) {
          layout.gotoLogin();
        });
      });

      // 注册导航栏收起/展开开关点击事件
      $(document).on("click", ".sidebar-collapse", function () {
        if ($("body").hasClass("mini-menu")) {
          $("body").removeClass("mini-menu");
        } else {
          $("body").addClass("mini-menu");
        }
      });

      // 注册修改密码点击事件
      $(document).on('click', '.sys-chgpwd', function (e) {
        // layout.changepwd();
      });

      // 注册修改信息点击事件
      $(document).on('click', '.sys-changeinfo', function (e) {
        // layout.changeinfo();
      });

      // 处理全屏展示功能
      $(document).on('click', '.sys-fullscreen', function (e) {
        isFullScreen = !isFullScreen;
        if (isFullScreen) {
          fullScreen();
        } else {
          exitFullScreen();
        }
      });

      /** 刷新功能 */
      $(document).on('click', '.btn_refresh', function (e) {
        table.reload();
      });

      /** 导出功能 */
      $(document).on('click', '.btn_export', function (e) {
        table.export();
      });

      /** 筛选功能 */
      $(document).on('click', '.btn_filter', function (e) {
        if ($('body').hasClass('filter')) {
          $('body').removeClass('filter');
        } else {
          $('body').addClass('filter');
        }
      });

    })();

    String.prototype.startWith = function (str) {
      var reg = new RegExp("^" + str);
      return reg.test(this);
    }

    String.prototype.endWith = function (str) {
      var reg = new RegExp(str + "$");
      return reg.test(this);
    }

    form.source = layout;

    var exportModule = {
      event: event,
      ajax: ajax,
      base64: base64,
      block: block,
      dialog: dialog,
      generator: generator,
      layout: layout,
      util: util,
      config: cfgs,
      api: api,
      form: form,
      table: table,
      row: row,
      cell: cell,
      alertText: dialog.alertText,
      Start: function () {
        console.info("应用程序启动");
        layout.init();
      }
    };

    return exportModule
  });