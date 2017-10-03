/**
 * 模块引用
 * @private
 */

let { generator, base64, db } = require('../../core/framework');

/**
 * 内部变量定义
 * @private
 */

let entity = {
  "table": "common_dicts",
  "columns": [
    { "name": "dictkey", "primary": true, "filter": true, "unique": true },
    { "name": "itemkey", "primary": true, "filter": true, "unique": true },
    { "name": "itemvalue", "filter": true, "requid": true, "base64": true }
  ]
}

/**
 * 模块定义
 * @public
 */

module.exports = {
  "rootpath": "/api/dict/",
  "description":"数据字典管理",
  "mapping": {
    "default": { "description": "获取字典数据列表" },
    "all": { "description": "获取全部字典数据列表" },
    "insert": { "description": "新增字典数据" },
    "update": { "description": "修改字典数据" },
    "delete": { "description": "删除字典数据" }
  },
  "entity": entity,
  "all": (req, res) => {
    var params = [];
    
    var sql = 'SELECT * from ' + entity.table;
    db.query(sql, params, function (err, rows, fields) {
      if (err) {
        res.send(generator.message(err.message));
      } else {
        rows.forEach(function (row) {
          row.itemvalue = base64.encode(row.itemvalue);
        });
        res.send(generator.data({ "list": rows }));
      }
    });
  }
};