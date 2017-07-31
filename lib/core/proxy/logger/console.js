"use strict";

/**
 * 模块引用
 * @private
 */

var colors = require('colors');

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'red',
  info: 'green',
  data: 'blue',
  help: 'blue',
  warn: 'yellow',
  debug: 'magenta',
  error: 'red'
});

var formatDateTime = function (date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  var minute = date.getMinutes();
  minute = minute < 10 ? ('0' + minute) : minute;

  var second = date.getSeconds();
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};

/**
 * 控制台输出日志信息
 * @param {string} level 日志级别[INFO,ERROR,WARN,DEBUG,SQL,other...]
 * @param {string} text 日志的内容
 * @param {object} error 异常对象[如果存在]
 */
var output = (level, text, error) => {
  var date = formatDateTime(new Date());
  if (level == "INFO") {
    console.log((date + " [" + level + " ] " + text).info);
  } else if (level == "ERROR") {
    console.log((date + " [" + level + "] " + text).error);
    if (error && error.stack) {
      console.log(error.stack);
    }
  } else if (level == "WARN") {
    console.log((date + " [" + level + " ] " + text).warn);
  } else if (level == "DEBUG") {
    console.log((date + " [" + level + "] " + text).debug);
  } else if (level == "SQL") {
    console.log((date + " [ " + level + " ] " + text).help);
  } else {
    console.log(date + " [" + level + "] " + text);
  }
}

/**
 * 模块定义
 * @public
 */

module.exports = {};
module.exports.output = output;
