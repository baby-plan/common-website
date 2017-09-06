"use strict"; // javascript 严格说明

/**
 * 模块引用
 * @private
 */

let express = require("express"),
  // fs = require("fs"),                             //文件系统
  path = require("path"),
  child_process = require("child_process");

/**
 * 模块内容定义
 * @public
 */

module.exports.define = {
  id: "client",
  /** 模块名称 */
  name: "应用程序客户端进程",
  /** 模块版本 */
  version: "1.0",
  /** 模块依赖 */
  dependencies: []
};

/**
 * 初始化应用程序宿主（Application）
 */

module.exports.run = () => {
  console.log(__dirname);
  var worker = child_process.spawn("node",['../../clients/client.js']);
  
  // var worker = child_process.exec("cmd",'dir /w', (error, stdout, strerr) => {
  //   if (error) {
  //     console.log(error.stack);
  //     console.log("error code:" + error.code);
  //   }
  // });
  worker.on("exit", code => {
    console.log("子进程已经退出，退出码" + code);
  });
  worker.stdout.on("data", data => {
    console.log("stdout-data:" + data);
  });
  worker.stderr.on("data", data => {
    console.log("strerr-data:" + data);
  });
};
