"use strict";

/**
 * 模块引用
 * @private
 */

var colors = require("colors"),
  process = require("process");

colors.setTheme({
  silly: "rainbow",
  input: "grey",
  verbose: "cyan",
  prompt: "red",
  info: "green",
  data: "blue",
  help: "blue",
  warn: "yellow",
  debug: "magenta",
  error: "red"
});

var formatDateTime = function(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  var d = date.getDate();
  d = d < 10 ? "0" + d : d;
  var h = date.getHours();
  var minute = date.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;

  var second = date.getSeconds();
  second = second < 10 ? "0" + second : second;
  return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
};

/**
 * 控制台输出日志信息
 * @param {string} level 日志级别[INFO,ERROR,WARN,DEBUG,SQL,other...]
 * @param {string} text 日志的内容
 * @param {object} error 异常对象[如果存在]
 */
var output = (level, text, error, ...arg) => {
  var date = formatDateTime(new Date());
  var pid = process.pid;
  var format = "%s [%s][%s] " + text;
  if (level == "INFO") {
    format = format.info;
  } else if (level == "WARN") {
    format = format.warn;
  } else if (level == "DEBUG") {
    format = format.debug;
    level = "DBUG";
  } else if (level == "SQL") {
    format = format.help;
    level = " " + level;
  }
  console.log(format, date, pid, level, ...arg);
  if (error && error.stack) {
    console.log(error.stack);
  }
};

/**
 * 模块定义
 * @public
 */

module.exports = {};
module.exports.output = output;
