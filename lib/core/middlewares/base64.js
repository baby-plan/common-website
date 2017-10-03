"use strict";

/**
 * 模块引用
 * @private
 */
const crypto = require('crypto');

/** 将字符串采用BASE64加密，若加密出错则返回空字符串。
 * @param {string} text 需要加密的内容文本
 * @return {string}
 */
var encode = (text) => {
  if (text) {
    return new Buffer(text).toString('base64');
  } else {
    return "";
  }
}

/** 将字符串采用BASE64解密，若解密出错则返回空字符串。
 * @param {string} text 需要解密的内容文本
 * @return {string}
 */
var decode = (text) => {
  if (text) {
    return new Buffer(text, 'base64').toString();
  } else {
    return "";
  }
}

/** 将字符串采用MD5+BASE64加密
 * @param  {string} text 需要加密的字符串
 * @return {string}
 */
var md5 = (text) => {
  var md5 = crypto.createHash('md5').update(text).digest('base64');
  return encode(md5);
}

/**
 * 模块定义
 * @public
 */

module.exports = {};

/**
 * 模块内容定义
 * @public
 */

module.exports.define = {
  "id": "base64",
  /** 模块名称 */
  "name": "基于base64的编解码模块",
  /** 模块版本 */
  "version": "1.0",
  /** 模块依赖 */
  "dependencies": [
  ]
}
module.exports.encode = encode;
module.exports.decode = decode;
module.exports.md5 = md5;