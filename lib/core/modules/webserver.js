'use strict'; // javascript 严格说明

/**
 * 模块引用
 * @private
 */

const http = require('http');

/**
 * 模块内容定义
 * @public
 */
module.exports.define = {
  "id": "webserver",
  /** 模块名称 */
  "name": "Web服务器引擎",
  /** 模块版本 */
  "version": "1.0",
  /** 模块依赖 */
  "dependencies": [
    "app", "config"
  ]
}

/**
 * 初始化WebServer
 * @param {object} app 应用程序宿主对象实例
 * @param {object} config 应用程序配置对象实例
 */
module.exports.run = (app, config) => {
  if (!config || !app) {
    throw new Error('config 或 app 不存在');
  }
  /** 校验端口参数值
   * @param  {string} val 待校验的值
   * 
   * @return 若参数值为标准端口值则返回端口号,否则返回false
   */

  var normalizePort = (val) => {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  // var privateKey = fs.readFileSync(config.rootPath + '/docs/private.pem', 'utf8');
  // var certificate = fs.readFileSync(config.rootPath + '/docs/file.crt', 'utf8');
  // var credentials = { key: privateKey, cert: certificate };

  /** 通过全局变量获取HTTP监听端口号 */
  var port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);

  /** 创建HTTP服务 */
  var server = http.createServer(app);
  // var httpsServer = https.createServer(credentials, app);
  // var SSLPORT = 8080;

  /** 开始监听端口 */
  server.listen(port, "0.0.0.0", function () {
    console.log('HTTP Server is running on: http://localhost:%s', port);
  });
  // httpsServer.listen(SSLPORT, "0.0.0.0", function () {
  //   console.log('HTTPS Server is running on: http://localhost:%s', SSLPORT);
  // });


  // httpsServer.on('error', onError);
  // httpsServer.on('listening', onListening);

  return server;
}