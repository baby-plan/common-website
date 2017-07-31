#!/usr/bin/env node

/*
 *          #*#****=         #*****+-
 *       #########***++   #######**+++=
 *    ##########********######******++==-
 *   ############******######*****++++==-:
 *   ###########*********#********+++===-:
 *   #######******************+++++++==--:
 *   **#**#*****************+*+++++===--::
 *   **********************++++++=====--:.
 *   +********************++++++====---::.
 *    ++***********++*++++++++=====---::.
 *     +++**+**+***+++++++++=====---:::.
 *      ++++++++++++++++++=====----::..
 *       =++++++++++++++=====----:::..
 *        ==+++++++++++====----:::..
 *          ======+++====----:::..
 *            -========---::...
 *               -====--::..
 *                  ---:.
 *                    .
 */
'use strict'; // javascript 严格说明

/**
 * 模块引用
 * @private
 */

// let fs = require("fs"), //文件系统
//   path = require('path'),
//   events = require("events"), //引入事件模块
//   emitter = new events.EventEmitter() //创建事件监听的一个对象
//   ;

/** 中间件目录 默认为/middlewares/ */
const CATALOG_MIDDLEWARE = "modules";

// process.env.PORT = 8080; // 设置服务端监听的端口号
const { config } = require('../../config'); // 读取框架配置文件

/** 系统当前参数设置 */
global.defaults = {};

/** 系统默认参数设置 */
global.options = {};

/** common 映射 */
var modulesMap = {};

global.getMiddlewares = () => { return modulesMap; }

// /** 日志记录器对象 @public */
// var logger = require("./middlewares/loggerAdapter");

/** 定义系统模块清单 */
var modules = {

  /**
   * 读取config.js文件中 catalog设置，若目录不存在则创建
   * @param {string} key 目录关键字
   */

  "catalog": function (key) {
    let path = config.catalog[key];
    let fs = require('fs');
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    return path;
  },

  /** 返回值生成器对象 @public */

  generator: require("./middlewares/generator"),

  /** BASE64编解码模块 @public */

  base64: require("./middlewares/base64"),

  /** 文件系统辅助功能 @public */

  fsh: require("./middlewares/fshelper"),
  /**
   * 生成UUID @public
   * 
   * @return {string} uuid 唯一标示
   */

  uuid: function () { return require('node-uuid').v1(); },

  /** 参数解析模块 @public */

  parameterParse: require("./middlewares/parameterParse"),

  /** SQL相关方法 @public*/

  sqlmethod: require('./middlewares/sqlmethod'),

  /** 数据库操作对象 @public */

  db: require('./middlewares/databaseAdapter'),

  /** 日志记录器对象 @public */

  logger: require("./middlewares/loggerAdapter"),

  /** 将日志存入数据库 @public */

  dblogger: require("./middlewares/logger_db"),

  /** 平台参数定义 @public */

  config: config
};

/**
 * 启动模块（module）
 * @param {object} m 需要启动的模块（module）定义对象实例
 * @return {void}
 */

var runModule = (m) => {
  var define = m.define;
  // module.run 运行所需要的参数清单
  var args = [];
  // 是否可以执行 middleware.run
  var runResult = false;

  // 判断是否有依赖：判断依据为正则表达式
  if (define.dependenciesreg &&
    define.dependenciesreg instanceof Array &&
    define.dependenciesreg.length > 0) {

    define.dependenciesreg.forEach((name) => {
      Object.keys(modulesMap).map((key) => {
        if (key.indexOf(name) > -1 && key != define.id) {
          define.dependencies.push(key);
        }
      });
    });

  }

  // 判断是否有依赖
  if (!define.dependencies || define.dependencies.length == 0) {
    runResult = true;
  } else {
    define.dependencies.forEach((name) => {
      var dependence = undefined;

      if ('config' == name) {
        dependence = config;
      } else if (modulesMap[name].instand) {
        dependence = modulesMap[name].instand;
      }

      if (dependence) {
        args.push(dependence);
        runResult = true;
      } else {
        runResult = false;
      }
    });

  }

  if (runResult) {
    modules.logger.info("module " + m.define.name + " v" + m.define.version + " 导入成功");
    try {
      var execResult = m.run.apply(this, args);
    } catch (err) {
      modules.logger.error("module " + m.define.name + " v" + m.define.version + " 启动失败", err);
    }

    if (execResult == null || execResult == undefined) {
      return true;
    } else {
      return execResult;
    }
  } else {
    return undefined;
  }
}

/**
 * 启动全部模块，按照模块依赖进行排序，调用runModule方法。
 * @return {void}
 * @private
 */

var runModules = () => {
  var isContinue = true;
  while (isContinue) {
    isContinue = false;
    Object.keys(modulesMap).map((key) => {
      var value = modulesMap[key];
      if (!value.instand) {
        // console.log("---> " + key);
        var runResult = runModule(value);
        if (runResult) {
          modulesMap[key].instand = runResult;
        } else {
          isContinue = true;
        } // if (runResult) { } else {
      } // if (!value.define.instand) {
    }); // Object.keys(modulesMap).map((key) => {
  } // while (isContinue) {
}

/**
 * 导入模块
 * @param {string} catalog 模块文件存放的目录
 * @return {void}
 */

var importModules = (catalog) => {

  // 扫描 CATALOG_COMMON 目录
  var paths = modules.fsh.scan(catalog);

  // 遍历 CATALOG_COMMON 目录内容
  paths.forEach((_path) => {
    var name = _path.replace('.js', '');
    var _module = require(name);
    var define = _module.define;
    if (define && typeof _module.run === 'function') {
      modulesMap[define.id] = _module;
    } else {
      modules.logger.info("模块 " + _path + " 无效：未定义 define结构 或 run方法.");
    }
  });

}

var printLogo = () => {
  console.log("       #*#****=         #*****+-");
  console.log("    #########***++   #######**+++=");
  console.log(" ##########********######******++==-");
  console.log("############******######*****++++==-:");
  console.log("###########*********#********+++===-:");
  console.log("#######******************+++++++==--:");
  console.log("**#**#*****************+*+++++===--::");
  console.log("**********************++++++=====--:.");
  console.log("+********************++++++====---::.");
  console.log(" ++***********++*++++++++=====---::.");
  console.log("  +++**+**+***+++++++++=====---:::.");
  console.log("   ++++++++++++++++++=====----::..");
  console.log("    =++++++++++++++=====----:::..");
  console.log("     ==+++++++++++====----:::..");
  console.log("       ======+++====----:::..");
  console.log("         -========---::...");
  console.log("            -====--::..");
  console.log("               ---:.");
  console.log("                 .");
}

/**
 * 启动框架
 * @return {void}
 * @public 
 */

var frameworkStart = () => {
  if (global.isRunning) {
    modules.logger.error("框架已经启动");
    return;
  } else {
    global.isRunning = true;
  }
  // printLogo();
  let begin = new Date().getTime();
  modules.logger.info(config.name + " v" + config.version + " 启动");
  modules.logger.info("根目录：" + config.rootPath);

  modules.logger.info("初始化 模块 {modules}");

  // 导入内置模块
  let catalog = modules.fsh.join(__dirname, CATALOG_MIDDLEWARE);
  importModules(catalog);

  if (config && config.catalog && config.catalog.module) {
    let rootPath = modules.fsh.join(config.rootPath, config.catalog.module);
    // 导入自定义模块
    importModules(rootPath);
  }

  runModules();

  modules.logger.info("系统启动完成，耗时：" + (new Date().getTime() - begin) + " ms");
}

/**
 * 模块定义
 * @public
 */

module.exports = modules;
module.exports.start = frameworkStart;