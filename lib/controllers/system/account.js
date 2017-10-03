let { generator, sqlmethod, db, dblogger, base64 } = require('../../core/framework');
module.exports = {
  "rootpath": "/api/account/",
  "description": "用户鉴权",
  "mapping": {
    "login": {
      "description": "用户登录", "auth": false,
      "rule": [
        'u|string|登录账号|必填|base64加密',
        'p|string|登录密码|必填|md5base64加密'
      ]
    },
    "logout": { "description": "用户注销登录", "auth": false },
    "changepwd": {
      "description": "用户修改密码", "auth": false,
      "rule": [
        'u|string|登录账号|必填|base64加密',
        'p|string|登录原始密码|必填|md5base64加密',
        'n|string|登录新密码|必填|md5base64加密'
      ]
    },
    "changeinfo": {
      "description": "用户修改基本信息", "auth": false,
      "rule": [
        
        'user|string|登录账号|必填|base64加密',
        'username|string|用户名称|必填|base64加密',
        'nickname|string|用户昵称|必填|base64加密',
        'email|string|Email|必填|'
      ]
    },
    "regist": { "description": "新用户注册", "auth": false },
    "forgot": { "description": "用户找回密码请求", "auth": false },
    "reset": { "description": "用户重置密码", "auth": false }
  },
  /** 用户登录
   * @param {object} req
   * @param {object} res
   */
  "login": (req, res) => {
    // if (req.session.user) {
    //     res.send(generator.message("用户已经登录"));
    //     return;
    // }
    var uid = req.query.u;
    var pwd = req.query.p;
    if (!uid) {
      res.send(generator.message("u 参数不能为空"));
    } else if (!pwd) {
      res.send(generator.message("p 参数不能为空"));
    } else {
      uid = base64.decode(uid);
      pwd = base64.decode(pwd);
      // console.log("账号=" + uid + "密码=" + pwd);
      pwd = base64.md5(pwd);
      // console.log("加密后密码=" + pwd + ",长度=" + pwd.length);
      var sql = "SELECT" +
        " u.account,u.name,u.email,u.nickname,r.name AS rolename,r.funcids" +
        " FROM SYS_USERS u" +
        " LEFT JOIN sys_roles r ON r.id = u.roleid" +
        " WHERE u.account=? AND u.password=?"
      var params = [uid, pwd];
      //连接数据库
      db.query(sql, params, function (err, rows, result) {
        if (err) {
          dblogger.write("登录失败," + err.message, req.connection.remoteAddress, uid, "LOGIN");
          res.send(generator.message(err.message));
        } else {
          if (rows.length == 1) {
            req.session.user = uid;
            var data = rows[0];

            // 生成权限列表
            var ids = [];
            if (data.funcids && data.funcids != "") {
              data.funcids.split(",").forEach(function (funcid) {
                ids.push(funcid);
              });
            }
            // 返回登录结果:用户基本信息
            dblogger.write("登录成功", req.connection.remoteAddress, uid, "LOGIN");
            res.send(generator.data({
              "account": base64.encode(data.account),
              "name": base64.encode(data.name),
              "nickname": base64.encode(data.nickname),
              "email": base64.encode(data.email),
              "rolename": base64.encode(data.rolename),
              "list": ids
            }));
          } else if (rows.length == 0) {
            dblogger.write("登录失败,密码不正确", req.connection.remoteAddress, uid, "LOGIN");
            res.send(generator.message("用户名或密码不正确"));
          }
        }
      });
    }
  },
  /** 用户注销登录
   * @param {object} req
   * @param {object} res
   */
  "logout": (req, res) => {
    if (!req.session.user) {
      res.send(generator.message("用户尚未登录"));
    } else {
      dblogger.write("注销成功", req.connection.remoteAddress, req.session.user, "LOGOUT");
      req.session.user = null;
      res.send(generator.data());
    }
  },
  /** 用户修改密码
   * @param {object} req
   * @param {object} res
   */
  "changepwd": (req, res) => {
    var uid = req.session.user;
    var pwd = req.query.p;
    var newpwd = req.query.n;
    if (!pwd) {
      res.send(generator.message("p 参数不能为空"));
    } else if (!newpwd) {
      res.send(generator.message("n 参数不能为空"));
    } else {
      pwd = base64.decode(pwd);
      newpwd = base64.decode(newpwd);
      pwd = base64.md5(pwd);
      newpwd = base64.md5(newpwd);
      var sql = "UPDATE `SYS_USERS` SET `password`=? WHERE `account`=? AND `password`=?"
      var params = [newpwd, uid, pwd];
      //连接数据库
      db.query(sql, params, function (err, result) {
        if (err) {
          dblogger.write("密码修改失败," + err.message, req.connection.remoteAddress, uid, "CHANGEPWD");
          res.send(generator.message(err.message));
        } else {
          if (result.affectedRows == 1) {
            dblogger.write("密码修改成功", req.connection.remoteAddress, uid, "CHANGEPWD");
            res.send(generator.data());
          } else {
            dblogger.write("密码修改失败,密码不正确", req.connection.remoteAddress, uid, "CHANGEPWD");
            res.send(generator.message("密码修改失败,密码不正确"));
          }
        }
      });
    }
  },
  /** 用户修改基本信息
   * @param {object} req
   * @param {object} res
   */
  "changeinfo": (req, res) => {
    var uid = req.session.user;
    var username = req.query.username;
    var nickname = req.query.nickname;
    var email = req.query.email;
    if (!username) {
      res.send(generator.message("username 参数不能为空"));
    } else if (!nickname) {
      res.send(generator.message("nickname 参数不能为空"));
    } else if (!email) {
      res.send(generator.message("email 参数不能为空"));
    } else {
      email = base64.decode(email);
      nickname = base64.decode(nickname);
      username = base64.decode(username);
      var sql = "UPDATE `SYS_USERS` SET `email`=? `nickname`=? `name`=? WHERE `account`=?"
      var params = [email, nickname, username, uid];
      //连接数据库
      db.query(sql, params, function (err, result) {
        if (err) {
          dblogger.write("信息修改失败," + err.message, req.connection.remoteAddress, uid, "CHANGEPWD");
          res.send(generator.message(err.message));
        } else {
          if (result.affectedRows == 1) {
            dblogger.write("信息修改成功", req.connection.remoteAddress, uid, "CHANGEPWD");
            res.send(generator.data());
          } else {
            dblogger.write("信息修改失败,登录名不存在", req.connection.remoteAddress, uid, "CHANGEPWD");
            res.send(generator.message("信息修改失败,登录名不存在"));
          }
        }
      });
    }
  },

  "regist": (req, res) => {
    var name = req.query.name;
    var email = req.query.email;
    var account = req.query.account;
    var password = req.query.password;
    if (!name) {
      res.send(generator.message("name 参数不能为空"));
    } else if (!email) {
      res.send(generator.message("email 参数不能为空"));
    } else if (!account) {
      res.send(generator.message("account 参数不能为空"));
    } else if (!password) {
      res.send(generator.message("password 参数不能为空"));
    } else {
      email = base64.decode(email);
      var sql = "SELECT * FROM `sys_users` WHERE `account`=? OR `email`=?";
      var params = [account, email];
      db.query(sql, params, function (err, rows, result) {
        if (err) {
          res.send(generator.message(err.message));
        } else if (rows.length > 0) {
          res.send(generator.error(201, "账号或EMail已经注册过,请更换过再试"));
        } else {
          password = base64.decode(password);
          password = base64.md5(password);
          name = base64.decode(name);
          sql = "INSERT INTO `sys_users`(`name`,`nickname`,`email`,`account`,`password`) VALUES(?,?,?,?,?,?)";
          params = [name, name, email, account, password];
          //连接数据库
          db.query(sql, params, function (err, result) {
            if (err) {
              res.send(generator.message(err.message));
            } else {
              res.send(generator.data());
            }
          });
        }
      });
    }
  },

  "forgot": (req, res) => {
    res.send(generator.message("改功能尚未实现"));
  },

  "reset": (req, res) => {
    res.send(generator.message("改功能尚未实现"));
  }
};