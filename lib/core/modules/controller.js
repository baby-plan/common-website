'use strict'; // javascript 严格说明

/**
 * 模块引用
 * @private
 */

let {
  logger,
  sqlmethod,
  parameterParse,
  fsh
} = require('../framework'),
  sysRoot = undefined;
const DIR_CONTROLLER = "../controllers";
global["route-define"] = {};

/**
 * 解析controllers目录下所有.js文件
 * @param {object} app 
 * @param {string} file 
 */

var parseController = (app, file) => {
  var code = file.replace(sysRoot, "");
  logger.info("controller ." + code);
  var name = file.replace('.js', '');
  var actions = undefined;

  try {
    actions = require(name);
  } catch (err) {
    logger.error("controller ." + code + " 载入失败.", err);
    return;
  }

  var rootpath = actions["rootpath"];
  /** 若未定义rootpath属性,则使用文件名作为rootpath */
  if (rootpath == undefined) {
    rootpath = name;
  }

  var mapping = actions["mapping"];
  /** 若未定义mapping属性,说明没有route mapping,则忽略该文件 */
  if (mapping == undefined) {
    logger.warn("忽略 ." + code + " 未定义映射关系（mapping）.");
    return;
  }

  Object.keys(mapping).map(function (action) {
    var fn = actions[action];
    let entity = undefined;
    if (typeof (fn) === "function") {

    } else {

      entity = actions["entity"];
      if (!entity) {
        logger.warn("忽略 ." + code + " 未定义entity.");
        return;
      }
      fn = sqlmethod.parse(action, entity);
    }

    let api_method = undefined;

    if (api_method = mapping[action]) {

      if (actions.description) {
        api_method.group = actions.description;
      } else {
        api_method.group = code;
      }
      // 处理api参数规则
      if (!api_method.rule) {
        if (action == "default" && entity) {
          api_method.rule = parameterParse.parseFilterRule(entity);
        } else if (action == "delete" && entity) {
          api_method.rule = parameterParse.parseDeleteRule(entity);
        } else if ((action == "insert" || action == "update") && entity) {
          api_method.rule = parameterParse.parseEditRule(entity);
        } else {
          api_method.rule = [];
        }
      }

      // 设置权限默认值:需要验证
      if (api_method.auth == undefined) {
        api_method.auth = true;
      }
      // 设置访问方式默认值:get
      if (api_method.method == undefined) {
        // if (action == "delete") {
        //     a.method = "delete";
        //     if (a.url == undefined) a.url = "";
        // } else if (action == "update") {
        //     a.method = "put";
        //     if (a.url == undefined) a.url = "";
        // } else if (action == "insert") {
        //     a.method = "post";
        //     if (a.url == undefined) a.url = "";
        // } else {
        api_method.method = "get";
        // }
      }

      if (api_method.url == undefined) {
        if (action == "default") {
          api_method.url = "";
        } else if (action == "insert") {
          api_method.url = "add";
        } else {
          api_method.url = action;
        }
      }

      api_method.url = rootpath + api_method.url;

      switch (api_method.method) {
        case "put":
          app.put(api_method.url, fn);
          break;
        case "delete":
          app.delete(api_method.url, fn);
          break;
        case "get":
          app.get(api_method.url, fn);
          break;
        case "post":
          app.post(api_method.url, fn);
          break;
      }

      let ml = api_method.method.length,
        ul = api_method.url.length;

      logger.info((api_method.method + " ".repeat(7 - ml) +
        api_method.url +
        " ".repeat(25 - ul) +
        api_method.description).input);

      global["route-define"][api_method.url] = api_method;

    } else {
      logger.warn(action + " 尚未定义映射");
    }

  });

}

module.exports = {

  /**
   * 模块内容定义
   * @public
   */

  "define": {
    "id": "controller",
    /** 模块名称 */
    "name": "Controller Scaner",
    /** 模块版本 */
    "version": "1.0",
    /** 模块依赖 */
    "dependencies": [
      "config", "app", "request-handler"
    ]
  },

  /**
   * 初始化 Controller
   * @param {object} app 应用程序宿主对象实例
   */

  "run": (config, app) => {
    if (!config || !app) {
      throw new Error('config 或 app 不存在');
    }
    let begin = new Date().getTime();
    sysRoot = config.rootPath;
    // 导入系统目录的controller
    var paths = fsh.scan(fsh.join(__dirname, DIR_CONTROLLER));
    // 导入自定义目录的导入系统目录的controller
    if (config && config.catalog && config.catalog.controller) {
      var rootPath = fsh.join(config.rootPath, config.catalog.controller);
      paths = paths.concat(fsh.scan(rootPath));
    }

    paths.forEach((_path) => {
      try {
        parseController(app, _path);
      } catch (err) {
        logger.error("controller:" + err.message);
      }
    });

    logger.info("controller 耗时：" + (new Date().getTime() - begin) + " ms");

  }
}