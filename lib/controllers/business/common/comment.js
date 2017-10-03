"use strict";

/**
 * 模块引用
 * @private
 */

let { generator, sqlmethod, logger, db, dblogger, base64 } = require('../../../core/framework');

/**
 * 常量定义
 * @private
 */

const TEXT_LOG_KEY = '用户评论';
const TEXT_COMMENT_LOST = '评论失败';
const TEXT_COMMENT_SUCCESS = '评论成功';
const TEXT_COMMENT_DELETE_LOST = '删除评论失败';
const TEXT_COMMENT_DELETE_SUCCESS = '删除评论成功';

/**
 * 模块定义
 * @public
 */

module.exports = {
  "rootpath": "/api/comment/",
  "description":"评论管理",
  "mapping": {
    "default": { "description": "获取评论列表" },
    "add": { "description": "评论" },
    "delete": { "description": "根据评论编号,删除一条评论." },
    "user":{"description":"根据用户编号获取该用户的全部评论"}
  },
  
  "default": (req, res) => {
    var targetid = req.query.id;
    if (targetid == "" || targetid == undefined) {
      res.send(generator.message("id 参数不能为空"));
      return;
    }
    var targettype = req.query.type;
    if (targettype == "" || targettype == undefined) {
      res.send(generator.message("type 参数不能为空"));
      return;
    }
    var pagenumber = req.query.pagenumber;
    if (pagenumber == undefined) {
      pagenumber = 1;
    }
    var params = [targetid, targettype];
    var sql = "SELECT"
      + " c.*,su.nickname,su.header"
      + " FROM action_comment as c"
      + " LEFT JOIN sys_users as su ON c.owner = su.account"
      + " WHERE c.target = ? AND c.targettype=?"
      + " ORDER BY c.date DESC";
    sqlmethod.executePaper(sql, params, pagenumber, function (err, json) {
      if (err) {
        res.send(err);
      } else {
        json.data.list.forEach(function (row) {
          row.text = base64.encode(row.text);
          row.owner = base64.encode(row.owner);
          row.client = base64.encode(row.client);
          row.nickname = base64.encode(row.nickname);
        });
        res.send(json);
      }
    });
  },

  "add": (req, res) => {
    let client = "pc";
    let deviceAgent = req.headers["user-agent"].toLowerCase();
    logger.debug("deviceAgent:" + deviceAgent);
    if (deviceAgent.match(/(iphone)/)) {
      client = "iPhone";
    } else if (deviceAgent.match(/(ipod)/)) {
      client = "iPod";
    } else if (deviceAgent.match(/(ipad)/)) {
      client = "iPad";
    } else if (deviceAgent.match(/(android)/)) {
      client = "Android";
    } else if (deviceAgent.match(/(mac)/)) {
      client = "Mac";
    }
    var text = req.query.text;
    if (text == "" || text == undefined) {
      res.send(generator.message("text 参数不能为空"));
      return;
    }
    text = base64.decode(text);
    var targetid = req.query.targetid;
    if (targetid == "" || targetid == undefined) {
      res.send(generator.message("targetid 参数不能为空"));
      return;
    }
    var targettype = req.query.targettype;
    if (targettype == "" || targettype == undefined) {
      res.send(generator.message("targettype 参数不能为空"));
      return;
    }
    var owner = req.session.user;

    var sql = 'INSERT INTO action_comment(`date`,`owner`,`target`,`targettype`,`text`,`client`) VALUES(?,?,?,?,?,?)';
    var params = [new Date().getTime() / 1000, owner, targetid, targettype, text, client];
    db.query(sql, params, function (err, result) {
      if (err) {
        dblogger.write(TEXT_COMMENT_LOST + err.message, req.connection.remoteAddress, req.session.user, TEXT_LOG_KEY);
        res.send(generator.message(err.message));
      } else {
        dblogger.write(TEXT_COMMENT_SUCCESS, req.connection.remoteAddress, req.session.user, TEXT_LOG_KEY);
        res.send(generator.data());
      }
    });
  },

  "delete": (req, res) => {
    var commentid = req.query.id;
    if (commentid == "" || commentid == undefined) {
      res.send(generator.message("id 参数不能为空"));
      return;
    }

    var sql = 'DELETE FROM action_comment WHERE `id`=?';
    var params = [commentid];
    db.query(sql, params, function (err, result) {
      if (err) {
        dblogger.write(TEXT_COMMENT_DELETE_LOST + err.message, req.connection.remoteAddress, req.session.user, TEXT_LOG_KEY);
        res.send(generator.message(err.message));
      } else {
        dblogger.write(TEXT_COMMENT_DELETE_SUCCESS, req.connection.remoteAddress, req.session.user, TEXT_LOG_KEY);
        res.send(generator.data());
      }
    });
  },
  
  "user": (req, res) => {
    var owner = req.session.user;

    var pagenumber = req.query.pagenumber;
    if (pagenumber == undefined) {
      pagenumber = 1;
    }
    var params = [targetid, targettype];
    var sql = "select * from `action_comment` where `owner`=? order by `date` desc";
    sqlmethod.executePaper(sql, params, pagenumber, function (err, json) {
      if (err) {
        res.send(err);
      } else {
        json.data.list.forEach(function (row) {
          row.text = base64.encode(row.text);
          row.owner = base64.encode(row.owner);
          row.client = base64.encode(row.client);
        });
        res.send(json);
      }
    });
  },

};