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

/**
 * 模块内容定义
 * @public
 */

module.exports.define = {
  "id": "module-demo",
  /** 模块名称 */
  "name": "示例模块-DEMO",
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
  
};