'use strict'; // javascript 严格说明

module.exports = {
  /**
   * 模块内容定义
   * @public
   */
  "define": {
    "id": "error-server-handler",
    /** 模块名称 */
    "name": "WebServer 异常处理",
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
      /** HTTP error 事件处理函数 */
      webserver.on('error', (error) => {
        if (error.syscall !== 'listen') {
          throw error;
        }

        var bind = typeof port === 'string'
          ? 'Pipe ' + port
          : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
          case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
          case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
          default:
            throw error;
        }
        
      });
    }
  }
}