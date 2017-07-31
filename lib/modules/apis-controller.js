/**
 * 处理http 请求[url：/apis]
 * @author wangxin
 */
'use strict'; // javascript 严格说明

/**
 * 模块引用
 * @private
 */

let { logger } = require('../core/framework');
let array = [], group = [];

/**
 * 模块内容定义
 * @public
 */

module.exports.define = {
  "id": "apis-controller",
  /** 模块名称 */
  "name": "Apis Controller",
  /** 模块版本 */
  "version": "1.0",
  /** 模块依赖 */
  "dependencies": ["app", "controller"]
}

/**
 * 初始化 apis-controller
 * @param {object} app 应用程序宿主对象实例
 */

module.exports.run = (app) => {
  for (var url in global["route-define"]) {
    var item = global["route-define"][url];
    item.url = url;
    array.push(item);

    if (group.indexOf(item.group) == -1) {
      group.push(item.group);
    }
  }
  //可查看所有接口的url：/apis
  logger.info("监听 /apis 请求,返回API清单");
  app.get("/apis", function (req, res) {
    res.render('apis', {
      "apis": array,
      "groups": group,
      "title": "Web Framework v1 API 开发手册"
    });
  });
};