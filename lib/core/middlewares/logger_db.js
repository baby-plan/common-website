let db = require('./databaseAdapter');

module.exports = {
  /** 将日志内容存入数据库
   * @param {string} msg   日志内容
   * @param {string} ip    客户端IP地址
   * @param {string} owner 操作者
   * @param {string} type  日志类型
   */
  "write": function (msg, ip, owner, type) {
    if (!type) {
      type = "NORMAL"
    } else {
      type = type.toUpperCase();
    }
    if (!owner) {
      owner = "SYS"
    }

    var sql = 'INSERT INTO sys_logs(`date`,`owner`,`ip`,`type`,`msg`) VALUES(?,?,?,?,?)';
    var params = [new Date().getTime() / 1000, owner, ip, type, msg];
    db.query(sql, params, function (err, result) {
      if (err) {
        console.log(err.message.error);
      }
    }, true);
  }
};