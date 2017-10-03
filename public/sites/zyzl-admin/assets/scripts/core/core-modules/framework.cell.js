define(['jquery', 'cfgs'], function ($, cfgs) {
  return {
    'define': {
      "name": "PLUGIN-LAYOUT-CELL",
      "version": "1.0.0.0",
      'copyright': ' Copyright 2017-2027 WangXin nvlbs,Inc.',
    },
    addAction: function (td, textKey, index, onClick) {
      return $("<a />").appendTo(td)
        .html(cfgs.options.texts[textKey])
        .addClass(cfgs.options.styles[textKey])
        .addClass('btn-mini')
        .attr("data-args", index)
        .attr("href", "javascript:;")
        .on("click", onClick);
    }
  };

});