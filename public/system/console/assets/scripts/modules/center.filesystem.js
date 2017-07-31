define(['jquery', 'layout', 'codemirror'], ($, layout, CodeMirror) => {
  let module = {};
  module.init = () => {
    layout.load("views/filesystem.html", () => {
      CodeMirror.fromTextArea(document.getElementById("code1"), {
        lineNumbers: true,
        matchBrackets: true,
        styleActiveLine: true
      });
    });
  };

  return module;
});