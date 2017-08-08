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
    'log': console.log,
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

  function trace(count) {
    var caller = arguments.callee.caller.caller;
    // console.log(caller.name);
  }

  console.info = function (text, ...arg) {
    trace();
    var func = 'info';
    var date = util.dateformat(new Date(), "yyyy-MM-dd HH:mm:ss");
    oldConsole[func](textformat + text, consoleStyles[func], date, logtypes[func], ...arg);
  }
  console.debug = function (text, ...arg) {
    trace();
    var func = 'debug';
    var date = util.dateformat(new Date(), "yyyy-MM-dd HH:mm:ss");
    oldConsole[func](textformat + text, consoleStyles[func], date, logtypes[func], ...arg);
  }
  console.error = function (text, ...arg) {
    trace();
    var func = 'error';
    var date = util.dateformat(new Date(), "yyyy-MM-dd HH:mm:ss");
    oldConsole[func](textformat + text, consoleStyles[func], date, logtypes[func], ...arg);
  }
  console.warn = function (text, ...arg) {
    trace();
    var func = 'warn';
    var date = util.dateformat(new Date(), "yyyy-MM-dd HH:mm:ss");
    oldConsole[func](textformat + text, consoleStyles[func], date, logtypes[func], ...arg);
  }

});