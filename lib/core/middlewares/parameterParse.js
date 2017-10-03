var validator = require("validator");
var base64 = require('./base64');

/**
 * 参数有效性校验
 * @param {object[]} errors 错误清单
 * @param {string} value 参数值
 * @param {object} column 参数规则字段
 * @param {bool} canNaN 是否可以为空
 */

var check = function (errors, value, column, canNaN) {
  if ((value == undefined || value == "")) {
    if (!canNaN && column.requid) {
      errors.push(column.name + " 参数不能为空");
    }
  } else {
    if (column.base64) {
      if (validator.isBase64(value)) {
        value = base64.decode(value);
      } else {
        errors.push(column.name + " 没有采用base64加密");
      }
      if (column.type == "isIP" && !validator.isIp(value) && column.filter != "like") {
        errors.push(column.name + " 不是有效的IP地址");
      }
    }
  }
}

var rule = (column, canNaN) => {
  // var ruleString = column.name;
  // ruleString = ruleString + " {string} ";
  var isRequid = false;
  // if (column.caption) {
  //   ruleString = ruleString + " " + column.caption + " ";
  // }
  if (!canNaN && column.primary) {
    isRequid = true;
    // ruleString = "[必填] " + ruleString;
  } else {
    if (!canNaN && column.requid) {
      isRequid = true;
      // ruleString = "[必填] " + ruleString;
    } else {
      isRequid = false;
      // ruleString = "[可选] " + ruleString;
    }
  }

  // if (column.base64) {
  //   ruleString = ruleString + " base64 加密 ";
  // }
  var name = column.name;
  if (!name) {
    name = "";
  }
  var caption = column.caption;
  if (!caption) {
    caption = "";
  }
  return name + "|" + "string" + "|" + caption + "|" + (isRequid ? "必填" : "可选") + "|" + (column.base64 ? "base64 加密" : "");
}

var getEntityRules = (entity, mode) => {
  var rules = [
  ];
  entity.columns.forEach(function (column) {
    if (mode == "select") {
      rules.push(rule(column, true));
    } else if (mode == "delete") {
      if (column.primary) {
        rules.push(rule(column, false));
      }
    } else if (mode == "edit") {
      rules.push(rule(column, false));
    }
  });
  return rules;
}

/**
 * @param {object} req
 * @param {object} entity
 * @param {string} mode ["select","delete","update"]
 * @return {object}
 */
var getRequestQueryParams = function (req, entity, mode) {
  var params = {}, errors = [];
  for (var property in req.query) {
    params[property] = req.query[property].trim();
  }
  entity.columns.forEach(function (column) {
    var value = params[column.name];
    // 增\删\改时参数验证
    if (mode == "select") { // 查询时不需要非空验证
      check(errors, value, column, true);
    } else if (mode == "delete") {
      if (column.primary) {
        check(errors, value, column, false);
      }
    } else {
      check(errors, value, column, false);
    }
  });
  if (errors.length > 0) {
    return { "s": false, "m": errors[0], "ms": errors };
  } else {
    return params;
  }
}

/**
 * 解析查询类参数
 * @param {object} req
 * @param {object} entity
 * @return {object}
 */

exports.parseFilterParams = function (req, entity) {
  return getRequestQueryParams(req, entity, "select");
}

/**
 * 解析删除类参数
 * @param {object} req
 * @param {object} entity
 * @return {object}
 */

exports.parseDeleteParams = function (req, entity) {
  return getRequestQueryParams(req, entity, "delete");
}

/**
 * 解析编辑类参数
 * @param {object} req
 * @param {object} entity
 * @return {object}
 */
exports.parseUpdateParams = function (req, entity) {
  return getRequestQueryParams(req, entity, "update");
}

/**
 * 解析查询操作参数规则
 * @param {object} req
 * @param {object} entity
 * @return {object[]}
 */
exports.parseFilterRule = (entity) => {
  return getEntityRules(entity, "select");
}

/**
 * 解析删除操作参数规则
 * @param {object} req
 * @param {object} entity
 * @return {object[]}
 */
exports.parseDeleteRule = (entity) => {
  return getEntityRules(entity, "delete");
}

/**
 * 解析新增或修改操作参数规则
 * @param {object} req
 * @param {object} entity
 * @return {object[]}
 */
exports.parseEditRule = (entity) => {
  return getEntityRules(entity, "edit");
}
