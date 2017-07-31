/* ========================================================================
 * App.util v1.0
 * 公共数据类型转换插件
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * 
 * ======================================================================== */

define(function () {
  /** 解析URL返回URL中各部件。例如：文件名、地址、域名、请求、端口、协议等
   * @param {string} url 完整的URL地址 
   * @returns {object} 自定义的对象 
   * @description
   *  var myURL = parseURL('http://abc.com:8080/dir/index.html?id=255&m=hello#top'); 
   *  myURL.file='index.html' 
   *  myURL.hash= 'top' 
   *  myURL.host= 'abc.com' 
   *  myURL.query= '?id=255&m=hello' 
   *  myURL.params= Object = { id: 255, m: hello } 
   *  myURL.path= '/dir/index.html' 
   *  myURL.segments= Array = ['dir', 'index.html'] 
   *  myURL.port= '8080' 
   *  myURL.protocol= 'http' 
   *  myURL.source= 'http://abc.com:8080/dir/index.html?id=255&m=hello#top' 
   */
  var _parseURL = function (url) {
    var a = document.createElement('a');
    a.href = url;
    return {
      source: url,
      protocol: a.protocol.replace(':', ''),
      host: a.hostname,
      port: a.port,
      query: a.search,
      params: (function () {
        var ret = {},
          seg = a.search.replace(/^\?/, '').split('&'),
          len = seg.length,
          i = 0,
          s;
        for (; i < len; i++) {
          if (!seg[i]) {
            continue;
          }
          s = seg[i].split('=');
          ret[s[0]] = s[1];
        }
        return ret;
      })(),
      file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
      hash: a.hash.replace('#', ''),
      path: a.pathname.replace(/^([^\/])/, '/$1'),
      relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
      segments: a.pathname.replace(/^\//, '').split('/')
    };
  };
  /** 日期格式字符串转为时间戳
   * @param {string} text 日期格式字符串,例如2015年10月29日,2015-10-29 14:00:36
   * @returns {int} 
   */
  var stringToUTC = function (text) {
    return new Date(text.replace(/-/g, '/')).getTime() / 1000;
  };
  /** 时间戳转为日期格式字符串 
   * @param {int} timestamp 时间戳字符串,例如123121234123
   * @param {string} format 日期格式字符串
   * @returns {string} 基于format的日期
   */
  var utcTostring = function (timestamp, format) {
    if (!timestamp || timestamp == "0") {
      return "";
    }
    if (!format) {
      format = "yyyy-MM-dd";
    }
    return datetimeToString(new Date(parseInt(timestamp) * 1000), format);
  };
  /** 对Date的扩展，将 Date 转化为指定格式的String
   * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
   * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
   * eg:
   * (new Date()).formate("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
   * (new Date()).formate("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
   * (new Date()).formate("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
   * (new Date()).formate("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
   * (new Date()).formate("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
   */
  var datetimeToString = function (date, format) {
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
      "H+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    var week = {
      "0": "\u65e5",
      "1": "\u4e00",
      "2": "\u4e8c",
      "3": "\u4e09",
      "4": "\u56db",
      "5": "\u4e94",
      "6": "\u516d"
    };
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(format)) {
      format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[date.getDay() + ""]);
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return format;
  }
  var utcToCN = (timestamp) => {
    var result = undefined;
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    // var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - timestamp * 1000;
    if (diffValue < 0) {
      return;
    }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (monthC >= 1) {
      result = "" + parseInt(monthC) + "月前";
    } else if (weekC >= 1) {
      result = "" + parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
      result = "" + parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
      result = "" + parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
      result = "" + parseInt(minC) + "分钟前";
    } else {
      result = "刚刚";
    }
    return result;
  }

  return {
    "parseURL": _parseURL,
    "stringToUTC": stringToUTC,
    "dateformat": datetimeToString,
    "utcTostring": utcTostring,
    "utcToCN": utcToCN,
    "jsonToString": JSON.stringify
  };

});