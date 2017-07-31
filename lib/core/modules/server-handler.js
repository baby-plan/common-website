'use strict'; // javascript 严格说明

/**
 * 模块引用
 * @private
 */

let { logger, fsh } = require('../framework');
const DIR_SERVER_HANDLER = "../server-handlers";
let sysRoot = undefined;


/**
 * 处理器（web-handler）导入。
 * @param {string} catalog 处理器文件（.js）所在的目录
 * @param {object} webserver WebServer宿主对象实例
 */

var importHandler = (catalog, webserver) => {
  // 扫描目录，获取文件清单，包含子目录
  var paths = fsh.scan(catalog);

  paths.forEach((_path) => {
    var name = _path.replace('.js', '');
    _path = _path.replace(sysRoot, '');
    try {
      var handler = require(name);
      var define = handler.define;
      if (define && typeof handler.run === 'function') {
        handler.run(webserver);
        logger.info("server-handler " + define.name + " v" + define.version + " 导入成功.");
      } else {
        logger.warn("server-handler " + _path + " 无效：未定义 define结构 或 run方法.");
      }
    } catch (err) {
      logger.error("server-handler " + _path + " 导入失败.", err);
    }
  });
}

module.exports = {

  /**
   * 模块内容定义
   * @public
   */

  "define": {
    "id": "server-handler",
    /** 模块名称 */
    "name": "WebServer处理引擎",
    "": "",
    /** 模块版本 */
    "version": "1.1",
    /** 模块依赖 */
    "dependencies": [
      "config", "webserver"
    ]
  },

  /**
   * 初始化 server-handler
   * @param {object} config 应用程序配置对象实例
   * @param {object} webserver WebServer宿主对象实例
   */

  "run": (config, webserver) => {
    if (!config || !webserver ) {
      throw new Error('config 或 webserver 不存在');
    }
    sysRoot = config.rootPath;
    // 导入系统目录的server-handler
    importHandler(fsh.join(__dirname, DIR_SERVER_HANDLER), webserver);
    // 导入自定义目录的server-handler
    if (config && config.catalog && config.catalog["server-handler"]) {
      var rootPath = fsh.join(config.rootPath, config.catalog["server-handler"]);
      importHandler(rootPath, webserver);
    }

  }
}
