
const SQL_TABLES = "show tables";
const SQL_COLUMNS = "show columns from ";
var createEntity = (tablename) => {
  db.query(SQL_COLUMNS + tablename, [], function (err, rows, fields) {
    if (err) {
      logger.error(err.message.error);
    } else {
      var result = { "table": tablename, "columns": [] };

      rows.forEach(function (row) {
        var column = {
          "name": row.Field
        };
        if (row.Key == "PRI") {
          column.primary = true;
        } else {
          if (row.Null == "NO") {
            column.requid = true;
          }
          // 日期类型
          if (row.Type == "int(11)") {
            column.filter = "daterange";
          } else if(row.Type.startsWith("float") || row.Type.startsWith("int") ){
            column.filter = true;
          } else {
            console.log( JSON.stringify(row));
            column.filter = "like";
            column.base64 = true;
          }
        }

        result.columns.push(column);
      });
      logger.debug("entity:" + JSON.stringify(result));
    }
  });
};

exports.maker = function () {
  db.query(SQL_TABLES, [], function (err, rows, fields) {
    if (err) {
      logger.error(err.message.error);
    } else {
      rows.forEach(function (row) {
        let tablename = row[fields[0].name];
        logger.debug("Table:" + tablename);
        createEntity(tablename);
      });
    }
  }, true);
}