define(['jquery', 'cfgs', 'API',
  'core/core-modules/framework.event',
  'core/core-modules/framework.ajax',
  'core/core-modules/framework.base64',
  'core/core-modules/framework.dialog',
  'core/core-modules/framework.generator',
  'core/core-modules/framework.layout',
  'core/core-modules/framework.util',
  'core/core-modules/framework.form',
  'core/core-modules/framework.table',
  'core/core-modules/framework.row',
  'core/core-modules/framework.cell',
  'core/core-modules/framework.logger'],

  function ($, cfgs, api, event, ajax, base64, dialog, generator, layout, util, form, table, row, cell) {

    let isScreen = false;

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

      $(document).on('click', '.sys-chgpwd', function (e) {
        layout.changepwd();
      });

      $(document).on('click', '.sys-changeinfo', function (e) {
        layout.changeinfo();
      });

      $(document).on('click', '#tools-screen', function (e) {
        isScreen = !isScreen;
        if (isScreen) {
          layout.fullScreen();
        } else {
          layout.exitFullScreen();
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
    })();

    form.source = layout;

    var exportModule = {
      event: event,
      ajax: ajax,
      base64: base64,
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