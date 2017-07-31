// 设置应用程序根目录
const rootPath = __dirname;
/** 框架参数设置 */
exports.config = {
    "name": "nvlbs framework",
    "version": "0.0.1",
    /** 是否自动加载数据库配置 */
    "autoloadoption": true,
    /** 框架根目录 */
    "rootPath": rootPath,
    /** 目录结构定义 */
    "catalog": {
        "upload": "public/resource/avatar/", // 上传文件存放目录
        "request-handler": "lib/request-handlers", // request-handler 存放目录
        "server-handler": "lib/server-handlers", // server-handler 存放目录
        "controller": "lib/controllers", // controller 存放目录
        "typeextend": "lib/extends", // typeextends 存放目录
        "module": "lib/modules", // modules 存放目录
    },
    /** 中间件参数设置 */
    "middleware": {
        /** 文件操作中间件参数设置 */
        "fsh": {
            /** 扫描忽略的目录名称 */
            "ignore": [
                ".git", ".svn", ".DS_Store"
            ]
        },
        /** 日志记录器中间件参数设置 */
        "logger": {
            "debug": true,
            "info": true,
            "warn": true,
            "error": true,
            "sql": true
        }
    },
    /** 模块参数设置  */
    "module": {
        "app": {
            "public": "public", // 公共目录，默认为public
            "view": "views", // 视图目录，默认为views
            "engine": "html", // 页面试图引擎，默认为html
            /** Session 相关设置 */
            "session": {
                "secret": '12345',
                //name: 'MYAPPNAME',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
                "cookie": { maxAge: 30 * 1000 * 60 }, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
                "resave": false,
                "saveUninitialized": true
            }
        }
    },
    /** 数据库参数设置 */
    "database": {
        "mysql": {
            "connectionLimit": 30,
            "host": "localhost",
            "password": "123456",
            "user": "root",
            "database": "nodejs",
            "waitForConnections": false,
            "charset": "UTF8_GENERAL_CI"
        }
    },
}