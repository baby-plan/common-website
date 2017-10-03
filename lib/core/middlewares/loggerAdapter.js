"use strict";

/**
 * 模块引用
 * @private
 */
var { config } = require("../../../config"),
  logger = require("../proxy/logger/console");

/** 输出内容
 * @param {string} level 日志级别：INFO,ERROR,WARN,DEBUG
 * @param {string} text  日志内容
 * @param {object} error 异常信息对象[如果存在]
 * @private
 */
var output = function(level, text, error, ...arg) {
  logger.output(level, text, error, ...arg);
};

/**
 * 模块定义
 * @public
 */

module.exports = {
  /** 以DEBUG级别输出内容
   * @param {string} text  日志内容
   * @param {string []} arg 
   */
  debug: function(text, ...arg) {
    if (config.middleware.logger.debug) {
      output("DEBUG", text, undefined, ...arg);
    }
  },
  /** 以WARN级别输出内容
   * @param {string} text  日志内容
   * @param {string []} arg 
   */
  warn: function(text, ...arg) {
    if (config.middleware.logger.warn) {
      output("WARN", text, undefined, ...arg);
    }
  },
  /** 以INFO级别输出内容
   * @param {string} text  日志内容
   */
  info: function(text, ...arg) {
    if (config.middleware.logger.info) {
      output("INFO", text, undefined, ...arg);
    }
  },
  /** 以ERROR级别输出内容
   * @param {string} text  日志内容
   * @param {object} error 异常信息对象
   */
  error: function(text, error, ...arg) {
    if (config.middleware.logger.error) {
      output("ERROR", text, error, ...arg);
    }
  },
  /** 以SQL级别输出内容
   * @param {string} text  日志内容
   */
  sql: function(text, ...arg) {
    if (config.middleware.logger.sql) {
      output("SQL", text, undefined, ...arg);
    }
  }
};
