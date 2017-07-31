define(['jquery', 'cfgs'], function ($, cfgs) {
  return {
    'name': 'plugins.layout.cell',
    'version': '0.0.0.1',
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