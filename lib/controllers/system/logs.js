
let { generator, db } = require('../../core/framework');

var entity = {
  "table": "sys_logs",
  "columns": [
    { "name": "id", "primary": true },
    { "name": "date", "requid": true, "filter": true, "filter": "daterange", "order": "desc" },
    { "name": "owner", "requid": true, "base64": true, "filter": "like" },
    { "name": "ip", "base64": true, "base64": true, "filter": "like", "type": "ip" },
    { "name": "type", "requid": true, "filter": true },
    { "name": "msg", "requid": true, "base64": true, "filter": "like" }
  ]
}

module.exports = {
  "rootpath": "/api/logs/",
  "description":"日志管理",
  "mapping": {
    "default": { "description": "获取日志列表" },
    "types": { "description": "获取日志类型类表" }
  },
  "entity": entity,
  "types": (req, res) => {
    var sql = 'SELECT DISTINCT `type` FROM `sys_logs`';
    var params = [];
    db.query(sql, params, function (err, rows, fields) {
      if (err) {
        res.send(generator.message(err.message));
      } else {
        res.send(generator.data({ "list": rows }));
      }
    });
  }
};
