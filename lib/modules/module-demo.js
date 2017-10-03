/**
 * 参数加载模块
 * @desc 用于载入数据库扩展参数
 * @author wangxin
 */
'use strict'; // javascript 严格说明

/**
 * 模块引用
 * @private
 */

let { logger, db } = require('../core/framework'),
  fs = require("fs"),
  path = require('path');

/**
 * 模块内容定义
 * @public
 */

module.exports.define = {
  "id": "module-demo",
  /** 模块名称 */
  "name": "示例模块-DEMO",
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
  // fs.watch('E:\\', function (event, filename) {
  //   console.log('event is: ' + event); if (filename) {
  //     console.log('filename provided: ' + filename);
  //   } else {
  //     console.log('filename not provided');
  //   }
  // });

  // var chokidar = require('chokidar');
  // var watcher = chokidar.watch('E:\\', {
  //   ignored: /[\/\\]\./, persistent: true
  // });
  // var log = console.log.bind(console);

  // watcher
  //   .on('add', function (path) { log('File', path, 'has been added'); })
  //   .on('addDir', function (path) { log('Directory', path, 'has been added'); })
  //   .on('change', function (path) { log('File', path, 'has been changed'); })
  //   .on('unlink', function (path) { log('File', path, 'has been removed'); })
  //   .on('unlinkDir', function (path) { log('Directory', path, 'has been removed'); })
  //   .on('error', function (error) { log('Error happened', error); })
  //   .on('ready', function () { log('Initial scan complete. Ready for changes.'); })
  //   .on('raw', function (event, path, details) { log('Raw event info:', event, path, details); })

};