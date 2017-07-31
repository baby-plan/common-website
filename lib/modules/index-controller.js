/**
 * 处理默认页面
 * @author wangxin
 */
'use strict'; // javascript 严格说明

module.exports = {
  /**
   * 模块内容定义
   * @public
   */
  "define": {
    "id": "index-controller",
    /** 模块名称 */
    "name": "默认页面请求处理",
    /** 模块版本 */
    "version": "1.0",
    /** 模块依赖 */
    "dependencies": ["app", "controller"]
  },
  /**
   * 初始化 index-controller ，解决默认页面显示
   * @param {object} app 应用程序宿主对象实例
   */
  "run": (app) => {
    app.get("/", function (req, res) {
      res.render('index', {
        title: '<h1>Express</h1>',
        users: [{ username: 'wangxin' }]
      });
    });
  }
}
