"use strict";

/**
 * 模块引用
 * 
 * @example <caption>Example usage of method1.</caption>
 * database.query;
 * @private
 */

var mysql = require('mysql'),
    async = require("async"),
    pool_option = undefined,
    pool = undefined;

/**
 * 构造mysql数据库访问对象实例。
 * @param {object} options mysql IPool
 * 
 * @public
 */

var constructor = (options) => {
    pool_option = options;
    return {
        query: query,
        execTrans: execTrans
    };
};

/**
 * 执行标准查询语句
 * @param {string} sql 需要执行的sql语句
 * @param {object[]} params 执行sql需要的参数清单
 * @param {Function} callback 执行sql后的回调函数
 * 
 * @author wangxin
 */

var query = (sql, params, callback) => {
    if (!pool) {
        pool = mysql.createPool(pool_option);
    }
    pool.query(sql, params, callback);
}

/**
 * 执行事物
 * @param {object[]} sqlparamsEntities
 * @param {Function} callback 事务执行回调函数
 * 
 * @author wangxin
 */

var execTrans = (sqlparamsEntities, callback) => {

    if (!pool) {
        pool = mysql.createPool(pool_option);
    }

    pool.getConnection(function(err, connection) {
        if (err) {
            return callback(err, null);
        }
        connection.beginTransaction(function(err) {
            if (err) {
                return callback(err, null);
            }
            console.log("开始执行transaction，共执行" + sqlparamsEntities.length + "条数据");
            var funcAry = [];
            sqlparamsEntities.forEach(function(sql_param) {
                var temp = function(cb) {
                    var sql = sql_param.sql;
                    var param = sql_param.params;
                    connection.query(sql, param, function(tErr, rows, fields) {
                        if (tErr) {
                            connection.rollback(function() {
                                console.log("事务失败，" + sql_param + "，ERROR：" + tErr);
                                throw tErr;
                            });
                        } else {
                            return cb(null, 'ok');
                        }
                    })
                };
                funcAry.push(temp);
            });

            async.series(funcAry, function(err, result) {
                console.log("transaction error: " + err);
                if (err) {
                    connection.rollback(function(err) {
                        console.log("transaction error: " + err);
                        connection.release();
                        return callback(err, null);
                    });
                } else {
                    connection.commit(function(err, info) {
                        console.log("transaction info: " + JSON.stringify(info));
                        if (err) {
                            console.log("执行事务失败，" + err);
                            connection.rollback(function(err) {
                                console.log("transaction error: " + err);
                                connection.release();
                                return callback(err, null);
                            });
                        } else {
                            connection.release();
                            return callback(null, info);
                        }
                    })
                }
            })
        });
    });
};

/**
 * 模块定义
 * @public
 */

module.exports = constructor;