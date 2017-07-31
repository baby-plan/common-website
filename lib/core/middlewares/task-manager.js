'use strict'; // javascript 严格说明

/**
 * 模块引用
 * @private
 */

module.exports = {
  /**
   * 模块内容定义
   * @public
   */
  'define': {
    "id": "task-manager",
    /** 模块名称 */
    "name": "任务管理器",
    /** 模块版本 */
    "version": "1.0",
    /** 模块依赖 */
    "dependencies": [
      "app", "config"
    ]
  },
  /**
   * 启动任务管理器
   * @param {object} app 应用程序宿主对象实例
   * @param {object} config 应用程序配置对象实例
   */
  'run': (app, config) => {
    if (!config || !app) {
      throw new Error('config 或 app 不存在');
    }
  }
}
