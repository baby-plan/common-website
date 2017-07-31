let { generator, sqlmethod, db, dblogger, base64, parameterParse } = require('../../core/framework');

var entity = {
  "table": "sys_users",
  "columns": [
    { "name": "id", "primary": true },
    { "name": "name", "base64": true, "requid": true, "filter": "like", "rename": "u.name" },
    { "name": "nickname", "base64": true, "requid": true, "filter": "like" },
    { "name": "roleid", "requid": true, "filter": true },
    { "name": "account", "base64": true, "requid": true, "filter": "like" },
    { "name": "email", "base64": true, "filter": "like" },
    { "name": "password", "md5base64": true, "default": (req, res) => { return options.password; } }
  ]
}
module.exports = {
  "rootpath": "/api/users/",
  "description": "用户管理",
  "mapping": {
    "default": { "description": "获取用户列表" },
    "insert": { "description": "新增用户" },
    "update": { "description": "修改用户" },
    "delete": { "description": "删除用户" },
    "info": { "description": "查看用户详细信息" }
  },
  "entity": entity,
  "default": (req, res) => {
    var _params = parameterParse.parseFilterParams(req, entity);
    if (_params.s == false) {
      res.send(generator.message(_params.m));
      return;
    }
    var filter = sqlmethod.buildFilter(entity, _params);
    var sql = "SELECT"
      + " u.id,u.account,u.name,u.email,u.roleid,u.nickname,r.name AS rolename,r.funcids"
      + " FROM SYS_USERS u"
      + " LEFT JOIN sys_roles r ON r.id = u.roleid" + filter.where;

    sqlmethod.executePaper(sql, filter.params, _params.pagenumber, function (err, json) {
      if (err) {
        res.send(err);
      } else {
        json.data.list.forEach(function (row) {
          row.name = base64.encode(row.name);
          row.nickname = base64.encode(row.nickname);
          row.rolename = base64.encode(row.rolename);
          row.account = base64.encode(row.account);
          row.email = base64.encode(row.email);
          row.password = undefined;
          var ids = [];
          if (row.funcids && row.funcids != "") {
            row.funcids.split(",").forEach(function (funcid) {
              ids.push(funcid);
            });
            row.funcids = ids;
          }
        });
        res.send(json);
      }
    });
  },
  /** 根据用户账号,获取用户详细信息 */
  "info": (req, res) => {
    var userid = base64.decode(req.query.userid);
    if (userid == "") {
      res.send(generator.message("userid参数不能为空"));
    }
    var sql = "SELECT" +
      " `account`,`name`,`email`,`nickname`,`describe`,`addr`,`header`,c.count about,d.count beabout" +
      " FROM SYS_USERS u" +
      " left join (select count(*) as count from interest_user where `owner`=?) as c on true" +
      " left join (select count(*) as count from interest_user where `target`=?) as d on true" +
      " WHERE u.account=?"
    var params = [userid, userid, userid];
    db.query(sql, params, function (err, rows, result) {
      if (err) {
        dblogger.write("用户信息读取失败," + err.message, req.connection.remoteAddress, userid, "INFO");
        res.send(generator.message(err.message));
      } else {
        var data = rows[0];
        res.send(generator.data({
          "account": base64.encode(data.account),
          "name": base64.encode(data.name),
          "nickname": base64.encode(data.nickname),
          "email": base64.encode(data.email),
          "describe": base64.encode(data.describe),
          "addr": base64.encode(data.addr),
          "header": data.header,
          "about": data.about,
          "beabout": data.beabout
        }));
      }
    });
  }
};