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
  'core/core-plugins/plugins-logging'],
  function ($, cfgs, api, event, ajax, base64, block, dialog, generator, layout, util, form, table, dict) {

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
      generator: generator,
      layout: layout,
      util: util,
      config: cfgs,
      api: api,
      form: form,
      table: table,
      dict: dict,

      alertText: dialog.alertText,
      confirm: dialog.confirm,
      Start: function () {
        layout.init();
      }
    };

    return exportModule
  });