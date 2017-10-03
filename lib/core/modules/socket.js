// 消息推送
var sio = require("socket.io");
var eventBuffer = [];
var socketBuffer = {};

/**
 * 模块内容定义
 * @public
 */
module.exports.define = {
  id: "socket",
  /** 模块名称 */
  name: "Socket 通讯组件",
  /** 模块版本 */
  version: "1.0",
  /** 模块依赖 */
  dependencies: ["config", "webserver"]
};

/**
 * 初始化socket服务端对象。
 * @param {object} config 应用程序配置对象实例
 * @param {Object} webserver 服务对象
 */
exports.run = function(config, webserver) {
  if (!config || !webserver) {
    throw new Error("config 或 webserver 不存在");
  }
  var numUsers = 0;
  var io = sio(webserver);
  io.on("connection", function(socket) {
    var addedUser = false;
    // when the client emits 'new message', this listens and executes
    socket.on("new message", function(data) {
      // we tell the client to execute 'new message'
      socket.broadcast.emit("new message", {
        username: socket.username,
        message: data
      });

      console.log("SOCKET.IO NEW MESSAGE：" + data);
    });

    // when the client emits 'add user', this listens and executes
    socket.on("add user", function(username) {
      if (addedUser) return;
      // we store the username in the socket session for this client
      socket.username = username;
      ++numUsers;
      addedUser = true;
      socket.emit("login", {
        numUsers: numUsers
      });
      // echo globally (all clients) that a person has connected
      socket.broadcast.emit("user joined", {
        username: socket.username,
        numUsers: numUsers
      });
      console.log("SOCKET.IO NEW USER：" + username);
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on("typing", function() {
      socket.broadcast.emit("typing", {
        username: socket.username
      });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on("stop typing", function() {
      socket.broadcast.emit("stop typing", {
        username: socket.username
      });
    });

    // when the user disconnects.. perform this
    socket.on("disconnect", function() {
      if (addedUser) {
        --numUsers;
        // echo globally that this client has left
        socket.broadcast.emit("user left", {
          username: socket.username,
          numUsers: numUsers
        });
        console.log(
          "SOCKET.IO USER LEFT：%s Count:%s",
          socket.username,
          numUsers
        );
      }
    });
  });
};

/** 连接SOCKET
 * @param  {string} user 连接SOCKET的人员编号
 */
exports.connect = user => {
  io.on("connection", socket => {
    if (socketBuffer[user]) {
    }
    socketBuffer[user] = socket;
  });
};

/** 添加事件监听
 * @param  {string} event 监听的事件名称
 * @param  {function} func 监听执行时的回调函数
 */
exports.on = (event, func) => {
  eventBuffer.push({ event: event, func: func });
};

/** 给指定客户端发送消息
 * @param  {string} user 消息接收人员编号
 * @param  {string} data 消息内容
 */
exports.send = (sender, message) => {
  socketBuffer[sender].send(message);
};

/** 加入聊天室
 * @param  {string} user 加入聊天室的人员编号
 */
exports.join = user => {
  if (socketBuffer[user]) {
    return { success: false, message: "该用户已经加入聊天室!" };
  } else {
  }
};

exports.getlist = () => {};
