/**
 * 处理http 请求[url：/mapping]
 * @author wangxin
 */
'use strict'; // javascript 严格说明

/**
 * 模块引用
 * @private
 */

let { logger } = require('../core/framework');

/**
 * 模块内容定义
 * @public
 */

module.exports.define = {
  "id": "mpping-controller",
  /** 模块名称 */
  "name": "Mapping Controller",
  /** 模块版本 */
  "version": "1.0",
  /** 模块依赖 */
  "dependencies": ["app", "controller"]
}

/**
 * 初始化 mapping-controller
 * @param {object} app 应用程序宿主对象实例
 */

module.exports.run = (app) => {
  //可查看所有接口的url：/mapping
  logger.info("监听 /mapping 请求,返回请求映射");
  app.get("/mapping", function (req, res) {
    res.end(JSON.stringify(global["route-define"]));
  });

};