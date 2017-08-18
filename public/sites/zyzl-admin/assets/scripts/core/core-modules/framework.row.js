define(['jquery', 'cfgs',
  'core/core-modules/framework.util',
  'core/core-modules/framework.dict'], function ($, cfgs, util, dict) {
    return {
      'define': {
        "name": "PLUGIN-LAYOUT-ROW",
        "version": "1.0.0.0",
        'copyright': ' Copyright 2017-2027 WangXin nvlbs,Inc.',
      },
      "addText": function (tr, text) {
        return $(cfgs.templates.cell).text(text).appendTo(tr);
      },
      "addDictText": function (tr, dictname, text, mulit) {
        if (mulit) {
          let newtext = "";
          $.each(text.split(","), function (index, item) {
            if (index > 0) {
              newtext += ",";
            }
            newtext += dict.getText(dictname, item);
          });
          return this.addText(tr, newtext);
        } else {
          return this.addText(tr, dict.getText(dictname, text));
        }
      },
      "addUTCText": function (tr, text, format) {
        var newtext = "";
        if (format) {
          newtext = util.utcTostring(text, format)
        } else {
          newtext = util.utcTostring(text, cfgs.options.defaults.datetimeformat)
        }
        return $(cfgs.templates.cell).text(newtext).appendTo(tr);
      },
      "createCell": function (tr) {
        return $(cfgs.templates.cell).appendTo(tr);
      }
    };

  });