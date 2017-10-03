"use strict"; // javascript 严格说明

let express = require("express"),
  logger = require("morgan"),
  cookieParser = require("cookie-parser"),
  bodyParser = require("body-parser"),
  ejs = require("ejs"),
  session = require("express-session");

var sessionOption = {
  secret: "12345",
  //name: 'MYAPPNAME',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
  cookie: {
    maxAge: 30 * 1000 * 60
  }, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
  resave: false,
  saveUninitialized: true
};

// 定义 Express 对象
var app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
// app.use(express.static("../../public/resource"));
// app.use(express.static("../../public/sites"));
// app.use(express.static("../../public/system"));
app.use(logger("dev"));

app.set("views", "views");
app.engine(".html", ejs.__express);
app.set("view engine", "html");

app.use(session(sessionOption));

//引入http模块
var http = require("http");
//设置主机名
var hostName = "127.0.0.1";
//设置端口
var port = 3001;
//创建服务
var server = http.createServer(app);

// var server = http.createServer(function(req, res) {
//   res.setHeader("Content-Type", "text/plain");
//   //   res.end(req);
//   res.end("index");
// });

// http.get("home", res => {
//   res.end("home");
// });

server.listen(port, hostName, function() {
  console.log(`服务器运行在 http://${hostName}:${port}`);
});

app.use(function(err, req, res) {
  console.log("error:" + err.stack || err.message);
  // res.locals.message = err.message;
  // res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

process.on("uncaughtException", function(err) {
  //打印出错误
  console.log(err);
  //打印出错误的调用栈方便调试
  console.log(err.stack);
});
app.get("/", function(req, res) {
  res.end("index");
});
app.get("*", function(req, res) {
  res.render("404", {
    title: "请求地址不存在",
    users: [{ username: "wangxin" }]
  });
});
