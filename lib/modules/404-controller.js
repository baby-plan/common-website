/**
 * 处理http 请求 :404
 * @author wangxin
 */
'use strict'; // javascript 严格说明

/**
 * 模块引用
 * @private
 */

let { logger } = require('../core/framework');
let array = [];

/**
 * 模块内容定义
 * @public
 */

module.exports.define = {
  "id": "404-controller",
  /** 模块名称 */
  "name": "File Not Found Controller",
  /** 模块版本 */
  "version": "1.0",
  /** 模块依赖 */
  "dependencies": ["app"],
  "dependenciesreg": ["controller"]
}

/**
 * 初始化 404-controller
 * @param {object} app 应用程序宿主对象实例
 */

module.exports.run = (app) => {

  //处理文件未找到[404]页面
  logger.info("监听全部请求,处理文件未找到[404]");
  app.get('*', function (req, res) {

    let msg = req.url + "<br/>" + '请求的地址不存在!';
    logger.info(msg);
    res.render('404', {
      title: '<h1>Express</h1>',
      users: [{ username: 'wangxin' }]
    });

    // res.send(msg);
  });

};