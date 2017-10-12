let logger = require('./loggerAdapter');
let db = require('./databaseAdapter');
let generator = require('./generator');
let dblogger = require('./logger_db');
let parameterParse = require('./parameterParse');
let base64 = require('./base64');
let uid = require( 'uid-safe');
/**
 * 
 * @param {object} entity 
 * @param {object[]} params 
 * @param {object} req 
 * @param {object} res 
 */

var parseColumnValue = function (entity, params, method, req, res) {
  entity.columns.forEach(function (column) {
    if (params[column.name] == undefined || params[column.name] == "") {
      if (typeof column.default === 'function') {
        params[column.name] = column.default(req, res);
      } else if (method == 'insert' && typeof column.insertdefault === 'function') {
        params[column.name] = column.insertdefault(req, res);
      } else if (method == 'update' && typeof column.updatedefault === 'function') {
        params[column.name] = column.updatedefault(req, res);
      }
    } else {
      if (column.base64) {
        params[column.name] = base64.decode(params[column.name]).trim();
      }
    }

    if (params[column.name] && column.md5base64) {
      params[column.name] = base64.md5(params[column.name]);
    }
  });
  return params;
}

/**
 * 根据数据表名称, 参数,生成INSERT语句
 * @param {object} entity 数据表结构 {"columns":{Object},"table":{string}}
 * @param {object[]} params 参数结构 {"column1":"value1","column2":"value2"}
 * 
 * @return {object} {"sql":"sql语句","params":['arg1','arg2']}
 */

var insertCreator = function (entity, params) {
  var columnsStr = "", // INSERT 语句需要插入的字段
    paramsStr = "",
    sqlParams = [];
  logger.warn(JSON.stringify(params));
  entity.columns.forEach(function (column) {
    var value = params[column.name];
    if (column.uuid) {
      if (columnsStr != "") {
        columnsStr += ",";
        paramsStr += ",";
      }
      columnsStr += "`" + column.name + "`";
      paramsStr += "?";
      sqlParams.push(uid.sync(18));
      return;
    }
    if (value != undefined && value != "") {
      if (columnsStr != "") {
        columnsStr += ",";
        paramsStr += ",";
      }
      columnsStr += "`" + column.name + "`";
      paramsStr += "?";
      sqlParams.push(value);
    }
  });

  return {
    "sql": "INSERT INTO " + entity.table + "(" + columnsStr + ") VALUES(" + paramsStr + ")",
    "params": sqlParams
  };
}

/**
 * 根据数据表结构, 参数,生成UPDATE语句
 * @param {object} entity 数据表结构
 * @param {object[]} params 参数结构 {"column1":"value1","column2":"value2"}
 * @return {object} {"sql":"sql语句","params":['arg1','arg2']}
 */

var updateCreator = function (entity, params) {
  var columnsStr = "", // UPDATE 语句需要插入的字段
    sqlParams = [],
    primaryValue = undefined,
    primary = undefined;

  entity.columns.forEach(function (column) {
    if (column.primary) {
      primary = column.name;
      primaryValue = params[primary];
    } else if (params[column.name] == undefined || params[column.name] == "") {
    } else {
      if (columnsStr != "") {
        columnsStr += ",";
      }
      columnsStr += "`" + column.name + "`=?";
      sqlParams.push(params[column.name]);
    }
  });

  sqlParams.push(primaryValue);

  return {
    "sql": "UPDATE " + entity.table + " SET " + columnsStr + " WHERE `" + primary + "`=?",
    "params": sqlParams
  };
}

/**
 * 根据数据表结构, 参数,生成DELETE语句
 * @param {object} entity 数据表结构
 * @param {object[]} params 参数结构 {"column1":"value1","column2":"value2"}
 * @return {object} {"sql":"sql语句","params":['arg1','arg2']}
 */
var deleteCreator = function (entity, params) {
  var sqlParams = [],
    primaryValue = undefined,
    primary = undefined;

  entity.columns.forEach(function (column) {
    if (column.primary) {
      primary = column.name;
      primaryValue = params[primary];
    }
  });

  sqlParams.push(primaryValue);

  return {
    "sql": "DELETE FROM " + entity.table + " WHERE `" + primary + "`=?",
    "params": sqlParams
  };
}

/**
 * 用于执行分页操作
 * @param {string} sql 需要执行的SQL语句
 * @param {object[]} params
 * @param {number} pageIndex
 * @param {Function} callback
 */

var _execute_paper = (sql, params, pageIndex, callback) => {
  var index = 0;
  if (pageIndex != undefined) {
    index = pageIndex - 1;
  }
  var size = options.pagesize;
  var start = 0;
  if (index > 0) {
    start = index * size;
  }
  var recordcount = 1, pagecount = 1;
  var countSQL = "SELECT COUNT(*) AS pagecount FROM (" + sql + ") AS t";
  var paperSQL = "SELECT * FROM (" + sql + ") AS t LIMIT ?,?";
  db.query(countSQL, params, function (err, rows, fields) {
    if (err) {
      callback(generator.message(err.message), null);
    } else {
      recordcount = pagecount = rows[0].pagecount;
      if (pagecount == 0) {

      } else {
        pagecount = pagecount / size;
        if (pagecount - parseInt(pagecount) > 0) {
          pagecount += 1;
        }
        pagecount = parseInt(pagecount);
      }
      if (pagecount == 1 && index == 1) {
        start = 0;
        index = 0;
      }
      params.push(start);
      params.push(size);
      db.query(paperSQL, params, function (err, rows, fields) {
        if (err) {
          callback(generator.message(err.message), null);
        } else {
          callback(null, generator.data({ "pagesize": size, "pagecount": pagecount, "recordcount": recordcount, "pagenumber": index + 1, "list": rows }));
        }
      });
    }
  });
}

/**
 * 执行添加操作
 * @param {object} entity t
 * @param {object} req
 * @param {object} res
 */

var _execute_insert = (entity, req, res) => {
  var _params = parameterParse.parseUpdateParams(req, entity);
  if (_params.s == false) {
    res.send(generator.message(_params.m));
    return;
  }
  _params = parseColumnValue(entity, _params, 'insert', req, res);

  let uniques = "";
  let params = [];
  entity.columns.forEach(function (column) {
    if (column.unique) {
      if (uniques == "") {
        uniques = "SELECT COUNT(*) as c FROM `" + entity.table + "` WHERE "
      } else {
        uniques += " AND ";
      }
      uniques += "`" + column.name + "`=?";
      params.push(_params[column.name]);
    }
  });

  var execute = function () {
    var command = insertCreator(entity, _params);
    //连接数据库
    db.query(command.sql, command.params, function (err, result) {
      if (err) {
        dblogger.write("新增失败" + err.message, req.connection.remoteAddress, req.session.user, entity.table.toUpperCase());
        res.send(generator.message(err.message));
      } else {
        dblogger.write("新增成功", req.connection.remoteAddress, req.session.user, entity.table.toUpperCase());
        res.send(generator.data());
      }
    });
  }
  // 判断是否有唯一验证
  if (uniques != "") {
    db.query(uniques, params, function (err, rows, result) {
      if (err) {
        dblogger.write("新增失败" + err.message,
          req.connection.remoteAddress,
          req.session.user,
          entity.table);
        res.send(generator.message(err.message));
      } else {
        if (rows[0].c == 0) {
          execute();
        } else {
          var errorMessage = "新增失败," + JSON.stringify(params) + "已经存在";
          dblogger.write(errorMessage,
            req.connection.remoteAddress,
            req.session.user,
            entity.table.toUpperCase());
          res.send(generator.error("301", errorMessage));
        }
      }
    });
  } else {
    execute();
  }
}

/**
 * 执行更新操作
 * @param {object} entity
 * @param {object} req
 * @param {object} res
 */
var _execute_update = (entity, req, res) => {
  var _params = parameterParse.parseUpdateParams(req, entity);
  if (_params.s == false) {
    res.send(generator.message(_params.m));
    return;
  }
  _params = parseColumnValue(entity, _params, 'update', req, res);

  var command = updateCreator(entity, _params);
  //连接数据库
  db.query(command.sql, command.params, function (err, result) {
    if (err) {
      dblogger.write("修改失败" + err.message,
        req.connection.remoteAddress,
        req.session.user,
        entity.table.toUpperCase());
      res.send(generator.message(err.message));
    } else {
      dblogger.write("修改成功",
        req.connection.remoteAddress,
        req.session.user,
        entity.table.toUpperCase());
      res.send(generator.data());
    }
  });
}

/**
 * 执行删除操作
 * @param {object} entity
 * @param {object} req
 * @param {object} res
 */
var _execute_delete = (entity, req, res) => {
  var _params = parameterParse.parseDeleteParams(req, entity);
  if (_params.s == false) {
    res.send(generator.message(_params.m));
    return;
  }
  _params = parseColumnValue(entity, _params, 'delete', req, res);

  var command = deleteCreator(entity, _params);
  db.query(command.sql, command.params, function (err, result) {
    if (err) {
      dblogger.write("删除失败" + err.message,
        req.connection.remoteAddress,
        req.session.user,
        entity.table.toUpperCase());
      res.send(generator.message(err.message));
    } else {
      dblogger.write("删除成功",
        req.connection.remoteAddress,
        req.session.user,
        entity.table.toUpperCase());
      res.send(generator.data());
    }
  });
}

/**
 * 合成筛选条件
 * @param {object} entity
 * @param {object[]} _params
 */

var _build_filter = (entity, _params) => {
  var params = [];
  var whereString = "";
  var orderString = "";
  entity.columns.forEach(function (column) {
    // 处理字段名称
    var columnName = (column.rename ? column.rename : column.name);

    if (column.order) {

      if (orderString == "") {
        orderString = " ORDER BY "
      } else {
        orderString = orderString + ","
      }

      orderString = orderString + "`" + columnName + "`"

      if (column.order.toUpperCase() == "DESC") {
        orderString = orderString + " DESC"
      } else {
        orderString = orderString + " ASC"
      }
    }

    if (!column.filter) { return; }
    if (column.filter == "daterange" && _params[column.name + "_1"] && _params[column.name + "_2"]) {
      if (whereString == "") {
        whereString = " WHERE ";
      } else {
        whereString += " AND ";
      }
      whereString += "`" + columnName + "` >=? AND `" + columnName + "` <= ?";
      params.push(_params[column.name + "_1"]);
      params.push(_params[column.name + "_2"]);
    } else if (_params[column.name]) {
      if (whereString == "") {
        whereString = " WHERE ";
      } else {
        whereString += " AND ";
      }
      var value = _params[column.name];
      if (column.base64) {
        value = base64.decode(value);
      }
      if (column.filter == "like") {
        whereString += "`" + columnName + "` like ?";
        params.push("%" + value + "%");
      } else if (column.filter == "multiple") { // 多选查询
        let inString = "";
        value.split(",").forEach(v => {
          if (inString != "") {
            inString += " OR ";
          }
          inString += "`" + columnName + "` REGEXP ?";
          params.push(v);
        });
        whereString += " (" + inString + ") ";
      } else {
        whereString += "`" + columnName + "`=?";
        params.push(value);
      }
    }
  });
  return {
    "where": whereString + orderString,
    "params": params
  }
}

/**
 * 执行简单查询操作
 * @param {object} entity
 * @param {object} req
 * @param {object} res
 */

var _execute_simple_select = (entity, req, res) => {
  var _params = parameterParse.parseFilterParams(req, entity);
  if (_params.s == false) {
    res.send(generator.message(_params.m));
    return;
  }
  var filter = _build_filter(entity, _params);
  var sql = "SELECT * FROM " + entity.table + filter.where;
  _execute_paper(sql, filter.params, _params.pagenumber, function (err, json) {
    if (err) {
      res.send(err);
    } else {

      dblogger.write(sql + "," + JSON.stringify(filter.params),
        req.connection.remoteAddress,
        req.session.user,
        entity.table.toUpperCase());

      json.data.list.forEach(function (row) {
        entity.columns.forEach(function (column) {
          if (column.base64) {
            row[column.name] = base64.encode(row[column.name]);
          }
        });
      });
      res.send(json);
    }
  });

}

module.exports.buildFilter = _build_filter;
module.exports.executePaper = _execute_paper;

module.exports.parse = (action, entity) => {
  var fn = undefined;
  switch (action) {
    case "default":
      fn = (req, res) => _execute_simple_select(entity, req, res);
      break;
    case "insert":
      fn = (req, res) => _execute_insert(entity, req, res);
      break;
    case "update":
      fn = (req, res) => _execute_update(entity, req, res);
      break;
    case "delete":
      fn = (req, res) => _execute_delete(entity, req, res);
      break;
    default:
      fn = () => { };
      return;
  }
  return fn;
}