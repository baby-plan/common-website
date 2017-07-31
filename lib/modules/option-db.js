/**
 * 参数加载模块
 * @desc 用于载入数据库扩展参数
 * @author wangxin
 */
'use strict'; // javascript 严格说明

/**
 * 模块引用
 * @private
 */

let { logger, db } = require('../core/framework');

/**
 * 模块内容定义
 * @public
 */

module.exports.define = {
  "id": "option-db",
  /** 模块名称 */
  "name": "Option-Database",
  /** 模块版本 */
  "version": "1.0",
  /** 模块依赖 */
  "dependencies": ["config"]
}

/**
 * 初始化 HttpHandler
 * @param {object} config 应用程序配置对象实例
 */

module.exports.run = (config) => {
  var sql = "SELECT * FROM sys_options";
  var params = [];
  logger.info("加载 系统默认参数设置...");

  db.query(sql, params, (err, rows, fields) => {
    if (err) {
      logger.info("数据库读取失败,无法读取参数.");
    } else {
      logger.info("数据库读取成功,采用数据库参数.");
      rows.forEach((row) => {
        logger.info((row.optionkey + "=" + row.optionvalue).input);
        if (row.optionvalue == "" && global.defaults[row.optionkey] != "") {
          global.options[row.optionkey] = global.defaults[row.optionkey];
        } else {
          global.options[row.optionkey] = row.optionvalue;
        }
      });
      global.options.pagesize = parseInt(options.pagesize);
    }
  });
};