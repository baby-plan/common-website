"use strict";

/**
 * 模块引用
 * @private
 */

var { config } = require('../../../config'),
  logger = require('./loggerAdapter'),
  database = require('../proxy/database/mysql')(config.database.mysql);
  
// //引入事件模块
// var events = require("events");

// //创建事件监听的一个对象
// var  emitter = new events.EventEmitter();

/**
 * 模块定义
 * @public
 */

module.exports = {

  /** 
   * 执行标准查询语句
   * @param {String} sql 需要执行的sql语句
   * @param {Array} params 执行sql需要的参数清单
   * @param {Function} callback 执行sql后的回调函数
   * @param {boolean} islog 是否将本次操作记录日志，输出控制台
   * 
   * @author wangxin
   */

  "query": (sql, params, callback, islog) => {
    if (!sql) {
      callback({message: 'SQL 不能为空！'});
      return;
    }
    var _callback = undefined;
    var _params = undefined;
    if (typeof params === 'function') {
      _callback = params;
      _params = [];
    } else {
      _params = params;
      _callback = callback;
    }

    if (!islog) { // 如果是记录日志的数据库操作,则不记录本次操作日志
      logger.sql(sql + "," + JSON.stringify(params));
    }

    /** SQL查询执行后回调函数
     * @param {Object} err 异常信息
     * @param {Array} rows 查询结果清单
     * @param {Array} fields 查询的字段清单
     * 
     * @author wangxin
     */

    var queryCallback = (err, rows, fields) => {
      if (err) {
        logger.error("Error:" + err.message);
        _callback(err, null);
      } else {
        if (rows.length != undefined) {
          if (!islog) { // 如果是记录日志的数据库操作,则不记录本次操作日志
            logger.sql("Count:" + rows.length);
          }
        } else {
          if (!islog) { // 如果是记录日志的数据库操作,则不记录本次操作日志
            logger.sql(JSON.stringify(rows));
          }
        }
        _callback(null, rows, fields);
      }
    }

    database.query(sql, _params, queryCallback);
  },

  /** 
   * 执行事物
   * @param {Array} sqlparamsEntities
   * @param {Function} callback 事务执行回调函数
   * 
   * @author wangxin
   */

  "execTrans": (sqlparamsEntities, callback) => {
    database.execTrans(sqlparamsEntities, callback);
  },

  /** 
   * 根据SQL及params创建SQLEntity对象
   * @param {String} sql 需要执行的sql语句
   * @param {Array} params 执行sql需要的参数清单
   * @param {Function} callback 执行sql后的回调函数
   * 
   * @return {object} {'sql':‘string sql语句’,'params':'object[] 参数数组'}
   * @author wangxin
   */

  "createSQLEntity": (sql, params, callback) => {
    if (callback) {
      return callback(null, {
        'sql': sql,
        'params': params
      });
    }
    return {
      'sql': sql,
      'params': params
    };
  }
};