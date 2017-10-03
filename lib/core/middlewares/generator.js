let base64 = require('./base64');
let logger = require('./loggerAdapter');

/** 封装API返回字符串
 * @param {number} code    API返回的代码
 * @param {string} message API返回的消息
 * @param {object} data    API返回的数据
 * @return {object}
 */
var packageContent = function (code, message, data) {
  var result = {};
  if (code || code == 0) {
    result.c = code;
  }
  if (message) {
    result.m = base64.encode(message);
    result.zh_cn = message;
  }
  if (data) {
    result.data = data;
  }
  logger.info("<- " + JSON.stringify(result).input);
  return result;
}

/** 封装API返回字符串
 * @param {string} code    API返回的代码
 * @param {string} message API返回的消息
 * @return {object}
 */
exports.error = function (code, message) {
  return packageContent(code, message, null);
}
/** 封装API返回字符串,code=1
 * @param {string} message API返回的消息
 * @return {object}
 */
exports.message = function (message) {
  return packageContent(1, message, null);
}
/** 封装API返回字符串,code=0
 * @param {object} data    API返回的数据
 * @return {object}
 */
exports.data = function (data) {
  return packageContent(0, null, data);
}