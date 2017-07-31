define(['jquery', 'layout'], ($, layout) => {
  let module = {};
  module.init = () => {
    layout.load("views/view.2.html");
  };

  return module;
});