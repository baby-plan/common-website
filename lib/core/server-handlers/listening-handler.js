'use strict'; // javascript 严格说明

module.exports = {
  /**
   * 模块内容定义
   * @public
   */
  "define": {
    "id": "listening-server-handler",
    /** 模块名称 */
    "name": "WebServer 监听处理",
    /** 模块版本 */
    "version": "1.0"
  },
  /**
   * 处理应用程序进程异常
   * @param {object} webserver WebServer宿主对象实例
   * @return {void}     
   */
  "run": (webserver) => {
    if (webserver) {
      /** HTTP listening 事件处理函数 */
      webserver.on('listening', () => {
        var addr = webserver.address();
        var bind = typeof addr === 'string'
          ? 'pipe ' + addr
          : 'port ' + addr.port;
        // logger.debug('Listening on ' + bind);
      });
    }
  }
}