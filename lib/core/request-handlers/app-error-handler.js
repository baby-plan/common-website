'use strict'; // javascript 严格说明

module.exports = {
  /**
   * 模块内容定义
   * @public
   */
  "define": {
    "id": "app-error-request-handler",
    /** 模块名称 */
    "name": "应用程序异常处理",
    /** 模块版本 */
    "version": "1.0"
  },
  /**
   * 处理应用程序进程异常
   * @param  {object} app 应用程序实例
   * @return {void}     
   */
  "run": (app) => {
    //error hanlder
    app.use(function (err, req, res, next) {
      console.log("error:" + err.stack || err.message);
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      res.status(err.status || 500);
      res.render('error');
    });
  }
}