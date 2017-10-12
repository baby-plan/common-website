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
  'core/core-modules/framework.dict',
  'core/core-plugins/plugins-logging'],

  function ($, cfgs, api, event, ajax, base64, block, dialog, generator, layout, util, form, table, row, cell, dict) {

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
      dict: dict,
      alertText: dialog.alertText,
      Start: function () {
        layout.init();
      }
    };

    return exportModule
  });