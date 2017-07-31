/**
 * 类型扩展支持
 * @desc 用于导入数据类型扩展
 * @author wangxin
 */
'use strict'; // javascript 严格说明

/**
 * 模块引用
 * @private
 */

let { logger, fsh } = require('../framework');
const DIR_TYPE_EXTEND = "../extends";
let sysRoot = undefined;

/**
 * 执行数据类型扩展导入。
 * @param {string} catalog 扩展文件（.js）所在的目录
 */

var extendImpoter = (catalog) => {
  var paths = fsh.scan(catalog);
  paths.forEach((_path) => {
    var name = _path.replace('.js', '');
    _path = _path.replace(sysRoot, '');
    try {
      require(name);
      logger.info("type-extend " + _path + " 导入成功.");
    } catch (err) {
      logger.error("type-extend ." + _path + " 导入失败.", err);
    }
  });
}

/**
 * 模块内容定义
 * @public
 */

module.exports.define = {
  "id": "type-extend-import",
  /** 模块名称 */
  "name": "类型扩展引擎",
  /** 模块版本 */
  "version": "1.0",
  /** 模块依赖 */
  "dependencies": ["config"]
}

/**
 * 初始化 HttpHandler
 * @param {object} config 应用程序配置对象实例
 */

module.exports.run = (config) => {
  if (!config) {
    throw new Error('config 不存在');
  }
  sysRoot = config.rootPath;
  // 导入自定义目录的类型扩展
  extendImpoter(fsh.join(__dirname, DIR_TYPE_EXTEND));

  if (config && config.catalog && config.catalog.typeextend) {
    let rootPath = fsh.join(config.rootPath, config.catalog.typeextend);
    // 导入自定义目录的类型扩展
    extendImpoter(rootPath);
  }

};