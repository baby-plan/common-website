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
  'core/core-modules/framework.dict',

  "core/core-modules/framework.cookie",
  'core/core-plugins/plugins-logging'],
  function ($, cfgs, api, event, ajax, base64, block, dialog, generator, layout, util, form, table, dict, cookie) {

    String.prototype.startWith = function (str) {
      var reg = new RegExp("^" + str);
      return reg.test(this);
    }

    String.prototype.endWith = function (str) {
      var reg = new RegExp(str + "$");
      return reg.test(this);
    }

    var exportModule = {
      config: cfgs,
      api: api,
      base64: base64,
      generator: generator,
      layout: layout,
      util: util,
      form: form,
      table: table,
      dict: dict,
      cookie: cookie,
      // 遮罩处理
      block: block.show,
      unblock: block.close,
      // 对话框处理
      alert: dialog.alertText,
      confirm: dialog.confirm,
      // ajax处理
      get: ajax.get,
      post: ajax.post,
      // 事件处理
      on: event.on,
      off: event.off,
      raise: event.raise,

      Start: function Start(dependencies) {
        console.info("应用程序启动 " + cfgs.site.title);
        document.title = cfgs.site.title;
        window.document.keywords
        dict.init();
        form.init(layout);
        generator.init();
        require(dependencies, function () {
          layout.init();
        })();
      }
    };

    return exportModule
  });