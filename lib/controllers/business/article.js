let { sqlmethod, generator, base64 } = require('../../core/framework');
module.exports = {
  "rootpath": "/api/article/",
  "description": "动态管理",
  "mapping": {
    "default": { "description": "获取动态列表" }
  },
  "default": (req, res) => {
    var userid = base64.decode(req.query.userid);
    if (userid == "") {
      res.send(generator.message("userid参数不能为空"));
    }
    var pagenumber = req.query.pagenumber;
    if (pagenumber == undefined) {
      pagenumber = 1;
    }
    var params = [userid, userid];
    var sql = "SELECT"
      + " a.*,su.header,su.nickname"
      + " FROM action_article a"
      + " LEFT JOIN interest_user iu on iu.target = a.owner"
      + " LEFT JOIN sys_users su on a.owner = su.account"
      + " WHERE iu.owner = ? or a.owner = ?"
      + " ORDER BY `date` DESC";

    sqlmethod.executePaper(sql, params, pagenumber, function (err, json) {
      if (err) {
        res.send(err);
      } else {
        json.data.list.forEach(function (row) {
          row.text = base64.encode(row.text);
          row.owner = base64.encode(row.owner);
          row.client = base64.encode(row.client);
          row.nickname = base64.encode(row.nickname);
          if (row.imgs == "") {
            row.imgs = undefined;
          }
        });
        res.send(json);
      }
    });
  }
};