define(['jquery', 'layout',
  "/assets/plugins/codemirror/codemirror.js",
  'css!/assets/plugins/codemirror/codemirror.css',
  "/assets/plugins/codemirror/mode/javascript/javascript.js"], ($, layout, CodeMirror) => {
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