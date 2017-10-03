'use strict'; // javascript 严格说明

module.exports = {
  /**
   * 模块内容定义
   * @public
   */
  "define": {
    "id": "process-error-request-handler",
    /** 模块名称 */
    "name": "进程异常处理",
    /** 模块版本 */
    "version": "1.0"
  },
  /**
   * 处理应用程序进程异常
   * @param  {object} app 应用程序实例
   * @return {void}     
   */
  "run": (app) => {
    process.on("uncaughtException", function (err) {
      //打印出错误
      console.log(err);
      //打印出错误的调用栈方便调试
      console.log(err.stack);
    });
  }
}