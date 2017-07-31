'use strict'; // javascript 严格说明

/**
 * 模块引用
 * @private
 */

let express = require('express'),
  // fs = require("fs"),                             //文件系统
  path = require('path'),
  // favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  ejs = require('ejs'),
  session = require('express-session');

/**
 * 模块内容定义
 * @public
 */

module.exports.define = {
  "id": "app",
  /** 模块名称 */
  "name": "应用程序主进程",
  /** 模块版本 */
  "version": "1.0",
  /** 模块依赖 */
  "dependencies": [
    "config"
  ]
}

// 定义默认参数
var viewsPath = "views";
var viewEngine = ".html";

var sessionOption = {
  secret: '12345',
  //name: 'MYAPPNAME',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
  cookie: {
    maxAge: 30 * 1000 * 60
  }, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
  resave: false,
  saveUninitialized: true
}

/**
 * 初始化应用程序宿主（Application）
 * @param {object} config 应用程序配置对象实例
 */

module.exports.run = (config) => {
  if (!config) {
    throw new Error('config 不存在');
  }
  // 解析 config.js 文件配置
  if (config && config.module && config.module.app) {
    var option = config.module.app;

    if (option.view) {
      viewsPath = option.view;
    }
    if (option.engine) {
      viewEngine = option.engine;
    }
    if (option.session) {
      sessionOption = option.session;
    }
  }

  // 初始化目录
  viewsPath = path.join(config.rootPath, viewsPath);

  // 定义 Express 对象
  var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(cookieParser());
  app.use(express.static('public/resource'));
  app.use(express.static('public/sites'));
  app.use(express.static('public/system'));
  app.use(logger('dev'));

  app.set('views', viewsPath);
  app.engine('.' + viewEngine, ejs.__express);
  app.set('view engine', viewEngine);

  app.use(session(sessionOption));
  // app.set('view engine', 'ejs');
  // app.use(express.favicon());

  // app.locals.title = 'My App';
  // // app.locals.strftime = require('strftime');
  // app.locals.email = 'me@myapp.com';
  // app.on('mount', function (parent) {
  //   console.log('Admin Mounted');
  //   console.log(parent); // refers to the parent app
  // });

  /*-----------------------------------------------------------------------------------*/
  /* 刷新session过期时间
  /*-----------------------------------------------------------------------------------*/
  app.use(function (req, res, next) {
    req.session._garbage = Date();
    req.session.touch();
    next();
  });

  return app;
}