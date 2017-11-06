define(['core/core-modules/framework.util'], function (util) {

  function isIE() { //ie?
    if (!!window.ActiveXObject || "ActiveXObject" in window)
      return true;
    else
      return false;
  }

  const oldConsole = {
    'info': console.info,
    'debug': console.debug,
    'error': console.error,
    'warn': console.warn,
    // 'log': console.log,
  };

  const textformat = "%c%s [%s] ";

  const consoleStyles = {
    'info': 'color:#2b82cf;',//text-shadow: 1px 1px 0px #fff
    'debug': 'color:#b567df;',
    'error': 'color:red;',
    'warn': 'color:#ff8a57;',
  }
  const logtypes = {
    'info': "INFO ",
    'debug': 'DEBUG',
    'error': 'ERROR',
    'warn': 'WARN '
  };

  function trace() {
    try {
      let route = '';
      let length = 0;
      var caller = arguments.callee.caller;
      while (caller && length < 9) {
        route += ">" + caller.name;
        caller = caller.caller;
        length++;
      }
      console.log(route);
    } catch (e) { }
  }

  console.info = function (text, ...arg) {
    var func = 'info';
    // console.trace();
    // var date = util.dateformat(new Date(), "yyyy-MM-dd HH:mm:ss");
    var date = '';
    oldConsole[func](textformat + text, consoleStyles[func], date, logtypes[func], ...arg);
  }
  console.debug = function (text, ...arg) {
    // var c = console.trace();
    // trace();
    // console.trace();
    var func = 'debug';
    // var date = util.dateformat(new Date(), "yyyy-MM-dd HH:mm:ss");
    var date = '';
    oldConsole[func](textformat + text, consoleStyles[func], date, logtypes[func], ...arg);
  }
  console.error = function (text, ...arg) {
    var func = 'error';
    // var date = util.dateformat(new Date(), "yyyy-MM-dd HH:mm:ss");
    var date = '';
    oldConsole[func](textformat + text, consoleStyles[func], date, logtypes[func], ...arg);
  }
  console.warn = function (text, ...arg) {
    var func = 'warn';
    // var date = util.dateformat(new Date(), "yyyy-MM-dd HH:mm:ss");
    var date = '';
    oldConsole[func](textformat + text, consoleStyles[func], date, logtypes[func], ...arg);
  }

});