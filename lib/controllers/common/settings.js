let { sqlmethod, generator, base64, db } = require('../../core/framework');

module.exports = {
  "rootpath": "/api/settings/",
  "description":"设置管理",
  "mapping": {
    "default": { "description": "获取全部参数信息" },
    "read": { "description": "获取设置信息" },
    "save": { "description": "保存设置信息" }
  },
  "read": (req, res) => {
    var keys = req.query.keys;
    if (!keys) {
      res.send(generator.message("keys 参数不能为空"));
    } else {
      keys = base64.decode(keys);
      var inString = "";
      var params = [];
      keys.split(",").forEach(function (key) {
        if (key != "") {
          if (inString != "") {
            inString += ",";
          }
          inString += "?";
          params.push(key);
        }
      });
      var sql = 'SELECT * FROM sys_options WHERE optionkey in (' + inString + ')';
      db.query(sql, params, function (err, rows, result) {
        if (err) {
          res.send(generator.message(err.message));
        } else {
          var result = {};
          rows.forEach(function (row) {
            var value = row.optionvalue;
            if (value == undefined) {
              value = "";
            } else {
              value = base64.encode(value);
            }
            result[row.optionkey] = value;
          });
          res.send(generator.data(result));
        }
      });
    }
  },
  "save": (req, res) => {
    var inString = "";
    var sqlParamsEntity = [];
    for (var key in req.query) {
      var newValue = req.query[key];
      if (newValue != "") {
        newValue = base64.decode(newValue);
      }
      var sql = "UPDATE sys_options SET optionvalue=? WHERE optionkey ='" + key + "'";
      var param = [newValue];
      sqlParamsEntity.push(db.createSQLEntity(sql, param));
    };
    db.execTrans(sqlParamsEntity, function (err, info) {
      if (err) {
        res.send(generator.message(err.message));
      } else {
        readOptions(); // 重新读取数据库设置,用于重置参数设置.
        res.send(generator.data());
      }
    })
  },
  "default": (req, res) => {
    var sql = 'SELECT * FROM `sys_options`';
    db.query(sql, [], function (err, rows, result) {
      if (err) {
        res.send(generator.message(err.message));
      } else {
        var result = {};
        rows.forEach(function (row) {
          var value = row.optionvalue;
          if (value == undefined) {
            value = "";
          } else {
            value = base64.encode(value);
          }
          result[row.optionkey] = value;
        });
        res.send(generator.data(result));
      }
    });
  }
};