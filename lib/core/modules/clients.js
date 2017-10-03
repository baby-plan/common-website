"use strict"; // javascript 严格说明

/**
 * 模块引用
 * @private
 */

let child_process = require("child_process"),
  { logger, fsh } = require("../framework"),
  sysRoot = undefined;
/**
 * 模块内容定义
 * @public
 */

module.exports.define = {
  id: "clients",
  /** 模块名称 */
  name: "应用程序客户端进程",
  /** 模块版本 */
  version: "1.0",
  /** 模块依赖 */
  dependencies: ["config"]
};

const DIR_CLIENTS = "../../clients";

var parseClient = (config, file) => {
  var code = file.replace(sysRoot, "");
  logger.info("client ." + code);
  var name = file.replace(".js", "");

  try {
    var worker = child_process.spawn("node", [name]);
    worker.on("exit", code => {
      console.info("子进程已经退出，退出码" + code);
      if (code == 1) {
        console.error("准备重新启动子进程");
        parseClient(config, file);
      }
    });
    worker.stdout.on("data", data => {
      console.info("stdout-data:" + data);
    });
    worker.stderr.on("data", data => {
      console.error("strerr-data:" + data);
      console.error("准备重新启动子进程");
      parseClient(config, file);
    });
  } catch (err) {
    logger.error("client ." + code + " 载入失败.", err);
    return;
  }
};

module.exports.run = config => {
  sysRoot = config.rootPath;
  var paths = fsh.scan(fsh.join(__dirname, DIR_CLIENTS));
  if (config && config.catalog && config.catalog.client) {
    var rootPath = fsh.join(config.rootPath, config.catalog.client);
    paths = paths.concat(fsh.scan(rootPath));
  }

  paths.forEach(_path => {
    try {
      parseClient(config, _path);
    } catch (err) {
      logger.error("controller:" + err.message);
    }
  });
  // startClient(config);
};
