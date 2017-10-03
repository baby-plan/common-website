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
          // 内容不存在时不需要处理
          if (!text) {
            return this.addText(tr, '');
          }

          $.each(text.split(","), function (index, item) {
            if (index > 0) {
              newtext += ",";
            }
            newtext += dict.getText(dictname, item);
          });
          return this.addText(tr, newtext);
        } else {
          let item = dict.getItem(dictname, text);
          if (item.text) {
            var td = $(cfgs.templates.cell).appendTo(tr);
            var span = $('<span/>').append(item.text);
            if (item.label) {
              span.addClass('label label-sm');
              span.addClass(item.label);
            }
            td.append(span);
            return td;
            //<span class="label label-success label-sm">Paid</span>
          } else {
            return this.addText(tr, item);
          }
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