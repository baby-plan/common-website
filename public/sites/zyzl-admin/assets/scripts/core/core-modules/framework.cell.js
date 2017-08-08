define(['jquery', 'cfgs'], function ($, cfgs) {
  return {
    'define': {
      "name": "PLUGIN-LAYOUT-CELL",
      "version": "1.0.0.0",
      'copyright': ' Copyright 2017-2027 WangXin nvlbs,Inc.',
    },
    "addAction": function (td, textKey, index, onClick) {
      var action = $("<a />").appendTo(td);
      action.html(cfgs.options.texts[textKey]);
      action.addClass(cfgs.options.styles[textKey]);
      action.addClass('btn-mini');
      action.on("click", onClick);
      action.attr("data-args", index);
      action.attr("href", "javascript:;");
      return action;
    }
  };

});