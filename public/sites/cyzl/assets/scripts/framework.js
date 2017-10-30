define(['jquery', 'cfgs', 'API'],
  function ($, cfgs, API) {

    // #region 数据类型扩展
    String.prototype.startWith = function (str) {
      var reg = new RegExp("^" + str);
      return reg.test(this);
    }

    String.prototype.endWith = function (str) {
      var reg = new RegExp(str + "$");
      return reg.test(this);
    }
    // #endregion //#region 数据类型扩展

    // #region Framework Core

    /** [static] 基于BASE64格式加密\解密处理 @author wangxin */
    class Base64 {

      static get base64EncodeChars() {
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      }

      static get base64DecodeChars() {
        return new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
          52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
          15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
          41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
      }

      static base64encode(str) {
        var out, i, len;
        var c1, c2, c3;

        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
          c1 = str.charCodeAt(i++) & 0xff;
          if (i == len) {
            out += Base64.base64EncodeChars.charAt(c1 >> 2);
            out += Base64.base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
          }
          c2 = str.charCodeAt(i++);
          if (i == len) {
            out += Base64.base64EncodeChars.charAt(c1 >> 2);
            out += Base64.base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += Base64.base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
          }
          c3 = str.charCodeAt(i++);
          out += Base64.base64EncodeChars.charAt(c1 >> 2);
          out += Base64.base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
          out += Base64.base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
          out += Base64.base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
      }

      static base64decode(str) {
        var c1, c2, c3, c4;
        var i, len, out;

        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
          /* c1 */
          do {
            c1 = Base64.base64DecodeChars[str.charCodeAt(i++) & 0xff];
          } while (i < len && c1 == -1);
          if (c1 == -1)
            break;

          /* c2 */
          do {
            c2 = this.base64DecodeChars[str.charCodeAt(i++) & 0xff];
          } while (i < len && c2 == -1);
          if (c2 == -1)
            break;

          out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

          /* c3 */
          do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
              return out;
            c3 = this.base64DecodeChars[c3];
          } while (i < len && c3 == -1);
          if (c3 == -1)
            break;

          out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

          /* c4 */
          do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
              return out;
            c4 = this.base64DecodeChars[c4];
          } while (i < len && c4 == -1);
          if (c4 == -1)
            break;
          out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
      }

      static utf16to8(str) {
        var out, c;

        out = "";
        for (let i = 0; i < str.length; i++) {
          c = str.charCodeAt(i);
          if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
          } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
          } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
          }
        }
        return out;
      }

      static utf8to16(str) {
        var out, i, len, c;
        var char2, char3;

        out = "";
        len = str.length;
        i = 0;
        while (i < len) {
          c = str.charCodeAt(i++);
          switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
              // 0xxxxxxx
              out += str.charAt(i - 1);
              break;
            case 12:
            case 13:
              // 110x xxxx   10xx xxxx
              char2 = str.charCodeAt(i++);
              out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
              break;
            case 14:
              // 1110 xxxx  10xx xxxx  10xx xxxx
              char2 = str.charCodeAt(i++);
              char3 = str.charCodeAt(i++);
              out += String.fromCharCode(((c & 0x0F) << 12) |
                ((char2 & 0x3F) << 6) |
                ((char3 & 0x3F) << 0));
              break;
          }
        }

        return out;
      }

      static CharToHex(str) {
        var out, i, len, c, h;
        out = "";
        len = str.length;
        i = 0;
        while (i < len) {
          c = str.charCodeAt(i++);
          h = c.toString(16);
          if (h.length < 2)
            h = "0" + h;

          out += "\\x" + h + " ";
          if (i > 0 && i % 8 == 0)
            out += "\r\n";
        }

        return out;
      }

      static doEncode(src) {
        return Base64.base64encode(Base64.utf16to8(src));
      }

      static doDecode(src, opt) {
        if (opt) {
          return Base64.CharToHex(Base64.base64decode(src));
        } else {
          return Base64.utf8to16(Base64.base64decode(src));
        }
      }

      /** base64编码加密
       * @param {string} str
       * @returns {string}
       */
      static encode(str) {
        if (str) {
          try {
            return Base64.doEncode(str);
          } catch (ex) {
            console.error("base64.encode:" + ex.message);
            return "";
          }
        } else {
          return "";
        }
      };

      /** base64编码解密
       * @param {string} str 
       * @returns {string}
       */
      static decode(str) {
        if (str) {
          try {
            return Base64.doDecode(str, false);
          } catch (ex) {
            console.error("base64.decode:" + ex.message);
            return "";
          }
        } else {
          return "";
        }
      };

    }

    class Util {
      constructor() {
      }
      /** 解析URL返回URL中各部件。例如：文件名、地址、域名、请求、端口、协议等
       * @param {string} url 完整的URL地址 
       * @returns {object} 自定义的对象 
       * @description
       * @example
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
      parseURL(url) {
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
      stringToUTC(text) {
        return new Date(text.replace(/-/g, '/')).getTime() / 1000;
      };

      /** 时间戳转为日期格式字符串 
       * @param {int} timestamp 时间戳字符串,例如123121234123
       * @param {string} format 日期格式字符串
       * @returns {string} 基于format的日期
       */
      utcTostring(timestamp, format) {
        if (!timestamp || timestamp == "0") {
          return "";
        }
        if (!format) {
          format = "yyyy-MM-dd";
        }
        return this.dateformat(new Date(parseInt(timestamp) * 1000), format);
      };


      utcToCN(timestamp) {
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
      dateformat(date, format) {
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
      };
    }

    class FrameworkEvent {
      constructor() {
        this.eventStore = {};
      };

      static get define() {
        return {
          "name": "事件处理插件",
          "version": "1.0.0.0",
          'copyright': ' Copyright 2017-2027 WangXin nvlbs,Inc.',
        };
      };

      /** 注册一个事件
       * @param {string} eventname 等待触发的事件名称
       * @param {function} fn eventname事件触发时处理程序
       * @return
       */
      on(eventname, fn) {
        console.debug("[EVENT-ON] " + eventname);
        if (typeof eventname === "string" && typeof fn === "function") {
          if (typeof this.eventStore[eventname] === "undefined") {
            this.eventStore[eventname] = [fn];
          } else {
            this.eventStore[eventname].push(fn);
          }
        }
      };

      /** 注销指定名称及处理程序的事件
       * @param {string} eventname 注销的事件名称
       * @param {function} fn 注销的事件处理函数
       * @return
       */
      off(eventname, fn) {
        console.debug("[EVENT-OFF] " + eventname);
        var listeners = this.eventStore[eventname];
        if (listeners instanceof Array) {
          if (typeof fn === "function") {
            for (var i = 0, length = listeners.length; i < length; i += 1) {
              if (listeners[i] === fn) {
                listeners.splice(i, 1);
                break;
              }
            }
          } else {
            delete this.eventStore[eventname];
          }
        }
      };

      /** 通过参数eventArgs触发事件eventname
       * @param {string} eventname 触发的事件名称
       * @param {object} eventArgs 触发eventname事件时附带的参数
       * @return
       */
      raise(eventname, eventArgs) {
        console.debug("[EVENT-RAISE] " + eventname);
        if (eventname && this.eventStore[eventname]) {
          var events = {
            type: eventname,
            target: this,
            args: eventArgs
          };

          for (var length = this.eventStore[eventname].length, start = 0; start < length; start += 1) {
            this.eventStore[eventname][start].call(this, events);
          }
        }
      };

    }

    /** [static] 处理操作等待遮罩 @author wangxin */
    class Block {

      static blockUI(options) {
        options = $.extend(true, { "message": "LOADING..." }, options);
        var html = "<div class='sk-spinner sk-spinner-rotating-plane'></div><span class='loading-message'>" + (options.message) + "</span>";
        $(options.target).block({
          "message": html,
          css: {
            padding: 0,
            margin: 0,
            width: '30%',
            top: '40%',
            left: '35%',
            textAlign: 'center',
            color: '#fff',
            border: 'none',
            backgroundColor: 'none',
            cursor: 'wait',
          },
        });
      };

      /** 显示遮罩.
       * @param {string} text      遮罩显示的提示信息
       * @param {object} target    遮罩所指向的目标对象
       */
      static show(text, target) {
        console.debug("BLOCK.SHOW:" + text);
        var blockTarget;
        if (target) {
          blockTarget = target;
        } else if ($("body>section").length == 1) {
          blockTarget = $("body>section");
        } else {
          blockTarget = $("body");
        }

        Block.blockUI({
          "target": blockTarget,
          "message": text
        });
      };

      /** 移除遮罩.
       * @param {object} target 遮罩所指向的目标对象
       */

      static close(target) {
        var blockTarget;
        if (target) {
          blockTarget = target;
        } else if ($("body>section").length == 1) {
          blockTarget = $("body>section");
        } else {
          blockTarget = $("body");
        }
        blockTarget.unblock({
          onUnblock: function () {
            blockTarget.css("position", "");
            blockTarget.css("zoom", "");
          }
        });
        console.debug("BLOCK.CLOSE");
      }
    }

    /** [static] 处理Cookie @author wangxin */
    class Cookie {
      /** 将登录信息JSON内容保存至COOKIE.
       * @param {JSON} json 要保存的JSON内容,目前仅保存登录信息.
       */
      static save(json) {
        if (json == "") {
          $.cookie(API.login.token_cookie, "");
          cfgs.INFO = null;
          console.debug("清除COOKIE " + API.login.token_cookie);
        } else {
          cfgs.INFO = json.data;
          cfgs.INFO.name = Base64.decode(cfgs.INFO.name);
          cfgs.INFO.rolename = Base64.decode(cfgs.INFO.rolename);
          cfgs.INFO.nickname = Base64.decode(cfgs.INFO.nickname);
          cfgs.INFO.account = Base64.decode(cfgs.INFO.account);
          cfgs.INFO.email = Base64.decode(cfgs.INFO.email);
          $.cookie(API.login.token_cookie, JSON.stringify(cfgs.INFO));
          console.debug("保存COOKIE " + API.login.token_cookie + " = " + JSON.stringify(cfgs.INFO));
        }
      };

      /** 读取COOKIE中的登录信息JSON内容. */
      static read() {
        var cookieStr = $.cookie(API.login.token_cookie);
        console.debug("读取COOKIE " + API.login.token_cookie);
        if (cookieStr == undefined || cookieStr == "") {
          console.debug("COOKIE " + API.login.token_cookie + " 不存在或没有值！");
          return undefined;
        } else {
          console.debug("COOKIE " + API.login.token_cookie + " = " + cookieStr);
          var json = $.parseJSON(cookieStr);
          cfgs.INFO = json;
          return json;
        }
      };

      static get define() {
        return {
          "name": "COOKIE操作模块",
          "version": "1.0.0.0",
          'copyright': ' Copyright 2017-2027 WangXin nvlbs,Inc.',
        }
      }
    }

    // AJAX.prototype

    class AJAX {

      get events() {
        return {
          /** ajax.login.timeout */
          'logintimeout': 'ajax.login.timeout'
        }
      }
      /**
       * 
       */
      constructor() {

        /** 处理服务端返回的业务逻辑错误
         * @param {object} json 服务端返回的结果 json={"ret":"code","msg":"code"}
         * @returns
         */
        this.onServerError = (json) => {
          if (json.ret == "1") {
            Dialog.alertText(Base64.decode(json.msg));
          } else if (json.ret == "101") {
            // EVENT-RAISE:ajax.login.timeout 登录超时
            _event.raise(this.events.logintimeout);
          } else if (json.msg) {
            Dialog.alertText("其他未知错误<BR/>错误代码:" + json.ret + "<BR/>" + Base64.decode(json.msg));
          } else {
            Dialog.alertText("其他未知错误<BR/>错误代码:" + json.ret);
          }
        };

        /** 处理HTTP请求异常.
         * @param {JSON} xhr .
         * @param {JSON} textStatus .
         * @param {JSON} errorThrown .
         * @returns
         */
        this.onRequestError = (xhr, textStatus) => {
          Block.close();
          console.debug("请求失败:" + xhr.status);
          if (xhr.status == "404") {
            Dialog.alertText("请求地址不存在!");
          } else if (xhr.status == "500") {
            Dialog.alertText("服务端异常!CODE:500");
          } else if (xhr.status == "502") {
            Dialog.alertText("服务端异常!CODE:502");
          } else if (xhr.statusText && xhr.statusText == "NetworkError") {
            Dialog.alertText("网络连接错误:<ul><li>请检查是否已经连接网络.</li><li>请检查网络地址是否存在.</li></ul>");
          } else {
            Dialog.alertText(textStatus);
          }
        };

        /* 请求成功后的回调函数。 */
        this.onSuccess = (json) => {
          if (this.ViewOptions.block) {
            Block.close();
          }
          console.info("请求完成:%o", json);
          if (typeof this.ViewOptions.error === 'function') {
            var result = this.ViewOptions.error(json.ret)
            if (!result) {
              return;
            }
          }
          if (json.ret != "0") {
            this.onServerError(json); // 处理服务端返回的业务逻辑错误
          } else {
            //操作成功
            /* 判断是否需要记录缓存 */
            if (this.ViewOptions.cache) {
              /* 清空历史缓存 */
              cfgs.pageOptions.buffer = {
                "pagecount": (json.data && json.data.pagecount) ? json.data.pagecount : 1,
                "pageindex": (json.data && json.data.pagenumber) ? json.data.pagenumber : 1,
                "pagesize": (json.data && json.data.pagesize) ? json.data.pagesize : 1,
                "recordcount": (json.data && json.data.recordcount) ? json.data.recordcount : 1,
                "data": []
              };
              if (json.data && json.data.list && json.data.list.length > 0) {
                /* 如果返回结果为列表数据则记录缓存 */
                $.each(json.data.list, function (index, item) {
                  cfgs.pageOptions.buffer.data[index] = item;
                });
              }
            }
            if (this.CallBack) {
              if (json.data && ((!json.data.list && (this.CallBack.clear || this.CallBack.noneDate)) || (json.data.list && json.data.list == 0))) {
                if (typeof this.CallBack.clear === 'function') {
                  this.CallBack.clear();
                }
                if (typeof this.CallBack.noneDate === 'function') {
                  this.CallBack.noneDate();
                }
              } else if (typeof this.CallBack.success === 'function') {
                this.CallBack.success(json);
              } else {
                this.CallBack(json);
              }
            }
          }
        };

        this.ViewOptions = {
          cache: true,
          block: true,
          error: undefined,
        };

        this.Options = {};
        this.CallBack = {};
      };

      /** 发起AJAX请求.
       * @param {string} api 请求的接口.
       * @param {JSON} options 请求附加的参数.
       * @param {Function} callback 请求回调函数.
       */
      get(api, options, callback) {
        this.CallBack = callback;
        // 处理请求参数
        if (options && options.args) {
          this.ViewOptions.cache = !options.nocache;
          this.ViewOptions.block = !options.noblock;
          this.ViewOptions.error = options.error
          this.Options = options.args;
        } else if (options != null) {
          this.Options = options;
          this.ViewOptions.cache = true;
          this.ViewOptions.block = true;
          this.ViewOptions.error = undefined;
        } else {
          this.Options = {};
          this.ViewOptions.cache = true;
          this.ViewOptions.block = true;
          this.ViewOptions.error = undefined;
        }
        // 处理遮罩
        if (this.ViewOptions.block) {
          Block.show("正在加载数据...");
        }
        /* AJAX请求选项 */
        var ajaxOptions = {
          "type": "GET",
          "dataType": "json",
          //,contentType:"application/json; charset=utf-8"
          //,cache: false
          //, crossDomain: true
          // "async": async,
          async: true,
          "success": this.onSuccess,
          "error": this.onRequestError,
          "url": api,
          "data": this.Options
        }

        /*设置请求超时*/
        if (cfgs.options.request.timeout) {
          ajaxOptions.timeout = cfgs.options.request.timeout;
        }

        if (this.CallBack && this.CallBack.busy) {
          this.CallBack.busy();
        }

        console.info("准备请求." + ajaxOptions.url + ",参数:" + JSON.stringify(ajaxOptions.data));
        /*执行操作请求*/
        $.ajax(ajaxOptions);
      };

      static get events() {
        return this.events;
      }
    }

    /** [static] 弹出式对话框操作类 @author wangxin */
    class Dialog {

      /** 自定义弹出对话框样式
       * @param {object} options
       * @return {void}
       */
      static alert(options) {
        var defaults = {
          buttons: {
            ok: { label: "确定", className: "btn-success" }
          }
          , message: options.message
          , title: options.title
        }
        var options = $.extend(defaults, options);
        bootbox.alert(options);
      };

      /** 带有确定|取消按钮的弹出式对话框.
       * @param {string} text 对话框提示的信息.
       * @param {Function} calback 操作完成反馈 function(bool),参数为BOOLEAN.
       * @return {void}
       */
      static confirm(text, callback) {
        bootbox.dialog({
          "message": text,
          "title": "操作确认",
          "buttons": {
            "success": {
              "label": "确定",
              "className": "btn-success",
              "callback": function () { callback(true); }
            },
            "danger": {
              "label": "取消",
              "className": "btn-danger",
              "callback": function () { callback(false); }
            }
          }
        });
      };

      /** 带有确定按钮的弹出式对话框
       * @param {string} text 对话框提示的信息.
       * @param {Function} calback 操作完成反馈 function()
       * @return {void}
       */
      static alertText(text, callback) {
        Dialog.alert({ "message": text, "callback": callback });
      }

    }

    class Dictionary {

      /**
       * 
       * @param {AJAX} ajax 
       */
      constructor(ajax) {
        this.AJAX = ajax;
        this.define = {
          name: "数据字典处理模块",
          version: "1.0.0.0",
          copyright: " Copyright 2017-2027 WangXin nvlbs,Inc."
        };

        // EVENT-ON:layout.logined 用户登录后自动加载数据库字典表内容
        _event.on("layout.logined", () => {
          console.debug("[AUTO]加载数据库字典表内容!");
          var url = API.datadict.dataallapi;
          this.AJAX.get(url, { noblock: true, args: {} }, (json) => {
            $.each(json.data.list, (index, item) => {
              if (cfgs.dict[item.dictkey] == undefined) {
                cfgs.dict[item.dictkey] = {};
              }
              cfgs.dict[item.dictkey][item.itemkey] = Base64.decode(item.itemvalue);
            });
          });
        });
      }

      /**
       * 
       * @param {string} dictkey 
       * @param {function} func 
       */
      get(dictkey, func) {
        if (cfgs.dict[dictkey] == undefined) {
          var url = API.datadict.datas.replace("{dictkey}", dictkey);
          this.AJAX.get(url, {}, (json) => {
            cfgs.dict[dictkey] = {};
            $.each(json.data.list, (index, item) => {
              cfgs.dict[dictkey][item.itemkey] = Base64.decode(item.itemvalue);
              func(cfgs.dict[dictkey]);
            });
          });
        } else {
          func(cfgs.dict[dictkey]);
        }
      };

      /** 根据数据字典名称获取该键对应的数据字典
       * @param {string} dictkey 数据字典名称.
       * @returns {Array} 数据项对象.
       */
      getDict(dictkey) {
        if (dictkey) {
          return cfgs.dict[dictkey];
        } else {
          return undefined;
        }
      };

      /** 根据数据字典名称及字典项的键获取该键对应的数据项
       * @param {string} dictkey 数据字典名称.
       * @param {string} itemkey 字典项的键.
       * @return {JSON} 数据项对象.
       */
      getItem(dictkey, itemkey) {
        var dictItem = this.getDict(dictkey);
        if (dictItem && itemkey && dictItem[itemkey]) {
          return dictItem[itemkey];
        } else if (dictItem) {
          for (var item in dictItem) {
            return dictItem[item];
          }
          // return dictItem[0];
          // return undefined;
        } else {
          return undefined;
        }
      };

      /** 根据数据字典名称及字典项的键获取该键对应的值
       * @param {string} dictkey 数据字典名称.
       * @param {string} itemkey 字典项的键.
       * @return {string} 数据项对应的值.
       */
      getText(dictkey, itemkey) {
        // 内容不存在时不需要处理
        if (!itemkey) {
          return '';
        }
        let newtext = "";
        $.each(itemkey.split(","), (index, key) => {
          if (index > 0) {
            newtext += ",";
          }
          var item = this.getItem(dictkey, key);
          if (item) {
            if (item.text) {
              newtext += item.text;
            } else {
              newtext += item;
            }
          } else {
            newtext += key;
          }
        });
        return newtext;
      };

    }

    class Table {
      constructor(ajax) {
        this.AJAX = ajax;
        this.define = {
          "name": "PLUGIN-LAYOUT-TABLE",
          "version": "1.0.1.0",
          'copyright': ' Copyright 2017-2027 WangXin nvlbs,Inc.',
        };

        /** 初始化表格注册按钮事件.
         * @param {object} options 请求参数选项
         *  pagecount : 页面总数.
         *  pageindex : 当前页面索引.
         * @private
         */
        this._regist_table = (options) => {
          var defaults = { "pagecount": "1", "pageindex": "1" };
          var options = $.extend(defaults, options);
          // 仅有1页时,删除分页内容
          if (options.pagecount == 1) {
            $(".pagination").parent().hide();
            return;
          } else {
            $(".pagination").parent().show();
          }
          $(".pagination").empty();
          $(".pageinfo").text("共" + cfgs.pageOptions.buffer.recordcount + "条记录,每页" + cfgs.pageOptions.buffer.pagesize + "条,共" + options.pagecount + "页");
          var paper_index = options.pageindex * 1;
          var paper_count = 5;
          var begin = paper_index - 2;
          var end = paper_index + 2;

          var li = $("<li />").appendTo($(".pagination"));
          $("<a href=\"javascript:;\"/>").text("首页").attr("data-index", 1).appendTo(li);
          if (paper_index == 1) {
            li.addClass("disabled");
          }
          li = $("<li />").appendTo($(".pagination"));
          $("<a href=\"javascript:;\"/>").text("上一页").attr("data-index", paper_index - 1).appendTo(li);
          if (paper_index == 1) {
            li.addClass("disabled");
          }
          if (begin < 1) {
            if (paper_count <= options.pagecount) {
              end = paper_count;
            } else {
              end = options.pagecount;
            }
            begin = 1;
          } else if (end >= options.pagecount) {
            end = options.pagecount;
            begin = end - paper_count + 1;
            if (begin < 1) {
              begin = 1;
            }
          }
          for (; begin <= end; begin++) {
            li = $("<li />").appendTo($(".pagination"));
            $("<a href=\"javascript:;\"/>").attr("data-index", begin).text(begin).appendTo(li);
            if (paper_index == begin) {
              li.addClass("active");
            }
          }
          li = $("<li />").appendTo($(".pagination"));
          $("<a href=\"javascript:;\"/>").text("下一页").attr("data-index", (paper_index + 1)).appendTo(li);
          if (paper_index == options.pagecount) {
            li.addClass("disabled");
          }
          li = $("<li />").appendTo($(".pagination"));
          $("<a href=\"javascript:;\"/>").text("末页").attr("data-index", options.pagecount).appendTo(li);
          if (paper_index == options.pagecount) {
            li.addClass("disabled");
          }
          // 注册内容中的点击事件
          $(".pagination>li>a").on("click", (e) => {
            //  当前选中的页或禁用的页不响应事件
            if ($(e.target).parent().hasClass("active")
              || $(e.target).parent().hasClass("disabled")) {
              return;
            }
            var index = $(e.target).attr("data-index");
            this.reload(index);
          });

        };

        /** 将缓存中的数据填充至表格 @private */
        this.displayTable = () => {
          var start_index = (cfgs.pageOptions.buffer.pageindex - 1) * cfgs.pageOptions.buffer.pagesize + 1;
          /* 生成页面数据起始索引 */
          var table = this.getTable();
          $("tbody", table).empty();
          if (cfgs.pageOptions.buffer.data.length > 0) {
            $.each(cfgs.pageOptions.buffer.data, (index, item) => {
              /* 填充数据*/
              cfgs.pageOptions.requestOptions.parsefn($("<tr />").appendTo(table), index, start_index + index, item);
            });
          }
          this._regist_table({
            "pagecount": cfgs.pageOptions.buffer.pagecount,
            "pageindex": cfgs.pageOptions.buffer.pageindex
          });
        };

        /** 获取需要处理的表格对象 @private*/
        this.getTable = () => {
          return $("#table");
        }

      };

      /**
       * 根据缓存数据索引获取数据内容
       * @param {number} index 缓存数据的索引
       * @returns {JSON}
       */
      getdata(index) {
        if (cfgs.pageOptions.buffer && cfgs.pageOptions.buffer.data.length > 0) {
          return cfgs.pageOptions.buffer.data[index];
        } else {
          return;
        }
      };

      render(target, columns) {
        target.addClass("datatable table table-striped table-bordered table-hover");
        var row = $("<div />").addClass("col-sm-12 bottom text-right").appendTo(target.parent().parent());
        $("<ul/>").addClass("pagination").appendTo(row);
        target.wrapAll("<div class=\"table-scrollable\"></div>");
        $("<span/>").addClass("pageinfo").appendTo(row);
        row.hide();
        var thead = $("<thead/>").appendTo(target);
        var tr = $("<tr/>").appendTo(thead);
        $.each(columns, (index, column) => {
          $("<th/>").html(column).addClass("center").appendTo(tr);
        });
      };

      /** 公共数据处理:回调parsefn填充数据并且生成分页按钮
       * @param {object} options 请求参数选项.
       *  api       : 请求数据的地址
       *  args      : 请求API附带的参数
       *  pageindex : 分页索引
       *  parsefn   : 填充表格的解析函数,参数为新增的列,列索引,列数据索引,数据内容对象
       *  token     : 请求的TOKEN,默认为当前用户TOKEN
       * @returns
       */
      load(options) {
        /* 缓存最后一次操作，用于删除数据后重新加载 */
        cfgs.pageOptions.requestOptions = options;
        var defaults = {
          "pagenumber": 1
        };
        var reqOptions = $.extend(defaults, options.args);
        if (options.pageindex) {
          reqOptions.pagenumber = options.pageindex;
        }
        var table = this.getTable();
        var callback = {
          "success": this.displayTable,
          "clear": () => {
            $("tbody", table).empty();
          },
          /*数据为空-追加空数据行*/
          "noneDate": () => {
            var tr = $("<tr />").appendTo(table);
            $("<td/>").text("没有数据")
              .attr("colspan", $("thead>tr>th", table).length)
              .appendTo(tr);
            this._regist_table({
              "pagecount": 1,
              "pageindex": 1
            });
          },

          "busy": () => {
            var tr = $("<tr />").appendTo(table);
            $("<td/>").text("正在检索数据,请稍候...")
              .attr("colspan", $("thead>tr>th", table).length)
              .appendTo(tr);
          }
        };
        this.AJAX.get(options.api, reqOptions, callback);
      };

      /** 使用 load 前一次参数重新加载并处理数据
       * @param {number} pageindex 请求新页面的索引
       * @returns
       */
      reload(pageindex) {
        if (cfgs.pageOptions.requestOptions) {
          if (pageindex) {
            cfgs.pageOptions.requestOptions.pageindex = pageindex;
          }
          this.load(cfgs.pageOptions.requestOptions);
        }
      };

      export() {
        console.debug('导出EXCEL');
        let uri = 'data:application/vnd.ms-excel;base64,',
          template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
          base64 = (s) => { return window.btoa(unescape(encodeURIComponent(s))) },
          format = (s, c) => {
            return s.replace(/{(\w+)}/g,
              (m, p) => { return c[p]; })
          }
        return (name) => {
          var table = document.getElementById('table');
          var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
          window.location.href = uri + base64(format(template, ctx))
        }
      };

      getSelects() {
        var datas = this.getSelectDatas();
        if (datas.length == 1) {
          return datas[0];
        } else {
          return null;
        }
      };

      getSelect() {
        var selector = $('table tr[class="selected"]');
        var datas = [];
        $.each(selector, (index, item) => {
          var id = $(item).attr('data-id');
          var data = this.getdata(id);
          datas.push(data);
        });

        return datas;
      };
    }

    class Form {
      /**
       * @param {AJAX} ajax
       * @param {Dictionary} dict 
       * @param {Util} util
       * @param {Layout} layout
       */
      constructor(ajax, dict, util, layout) {
        this.AJAX = ajax;
        this.dict = dict;
        this.util = util;
        this.layout = layout;
        this.define = {
          name: "［插件］表单处理 for MODULE-LAYOUT",
          version: "1.0.0.0",
          copyright: " Copyright 2017-2027 WangXin nvlbs,Inc."
        };

        /** siderbar.changed 事件处理函数 */
        this.EVENTHANDLER_SIDERBAR_CHANGED = () => {
          this.initAllSelect();
        }
        /** window.resize 事件处理函数 */
        this.EVENTHANDLER_WINDOW_RESIZE = () => {
          setTimeout(this.initAllSelect, 500);
        }

        /**
         * @param {string} keyword
         */
        this.readStyle = (keyword) => {
          if (cfgs.options.styles[keyword]) {
            return cfgs.options.styles[keyword];
          } else {
            return cfgs.options.styles['btn-default'];
          }
        };

        // EVENT-ON:sidebar.changed
        _event.on('sidebar.changed', this.EVENTHANDLER_SIDERBAR_CHANGED);
        $(window).on('resize', this.EVENTHANDLER_WINDOW_RESIZE);

      };

      /** 初始化下拉列表框控件
       * @param {string} dictname 绑定的数据字典项名称
       * @param {object} target 控件绑定的dom对象
       * @param {string} value 默认值
       * @param {boolean} ismulit 是否多选,默认为false
       */
      initDict(dictname, target, value, ismulit) {
        this.dict.get(dictname, (datas) => {
          $.each(datas, (index, item) => {
            target.append(
              $("<option/>")
                .val(index)
                .text(item.text ? item.text : item)
            );
          });
          target.attr("data-value", value);
          if (ismulit) {
            target.attr("data-mulit", true);
          }
        });
      };

      initAllSelect() {
        //todo:解决时间段选择控件冲突问题
        $("select:not(.monthselect,.yearselect)").each(function () {
          var selectvalue = $(this).attr("data-value");
          var ismulit = $(this).attr("data-mulit");
          $(this).select2(cfgs.options.select2);
          if (selectvalue) {
            if (ismulit) {
              $(this)
                .val(selectvalue.split(","))
                .trigger("change");
            } else {
              $(this)
                .val(selectvalue)
                .trigger("change");
            }
          } else {
            $(this)
              .val(null)
              .trigger("change");
          }
        });
      };

      /** 初始化日期时间控件 */
      initDate() {
        $(".form-date,.form-datetime").each(function () {
          var wrapper = $("<div></div>").addClass("input-group date");
          var span = $("<span></span>").addClass("input-group-addon");
          var button = $("<a></a>").addClass("date-set");
          button.append($("<i></i>").addClass("fa fa-calendar"));
          span.append(button);
          $(this).wrapAll(wrapper);
          $(this)
            .parent()
            .append(span);
          let datepicker;
          if ($(this).hasClass("form_datetime")) {
            datepicker = $(this)
              .parent()
              .datetimepicker(cfgs.options.datetimepicker);
          } else {
            datepicker = $(this)
              .parent()
              .datetimepicker(cfgs.options.datepicker);
          }

          datepicker.on("changeDate", function () {
            if ($("#role-form").data("bootstrapValidator")) {
              var id = $("[id]", $(this)).attr("id")
              $("#role-form")
                .data("bootstrapValidator")
                .updateStatus(id, "NOT_VALIDATED", null)
                .validateField(id);
            }
          });

        });
      };

      /** 支持缓存的列表请求方法.通常用于请求字典数据.
       * 
       * @param {Object} options 参数设置
       * [可选结构]
       * api       请求的服务地址.
       * args      请求时附带的参数.
       * hasall    是否附带“全部”选项.
       * cached    是否缓存数据,boolean,默认为true.
       * target    承载内容的元素selector,通常为select
       * valuefn   返回value内容的方法,function(index,item) return string
       * textfn    返回text内容的方法,function(index,item) return string
       * parsefn   请求成功后解析数据的方法 function(index,item).该属性与target\valuefn\textfn冲突仅设置一种
       * done      解析数据完成后执行的反馈 function().
       * 
       * @author wangxin
       */
      initCache(options) {
        if (!options.api) {
          console.error("未设置数据服务地址!");
          return;
        }
        if (!options.args) {
          options.args = {};
        }
        if (options.cached == undefined) {
          options.cached = true;
        }
        var parse = (index, item) => {
          if (options.parsefn) {
            options.parsefn(index, item);
          } else if (options.target && options.textfn && options.valuefn) {
            var value = options.valuefn(index, item);
            var text = options.textfn(index, item);
            var opotion = $("<option/>")
              .val(value)
              .text(text);
            options.target.append(opotion);
          }
        };
        var requestDone = (list) => {
          if (list && list.length > 0) {
            cfgs.cache[options.api] = list;
            $.each(list, (index, item) => {
              parse(index, item);
            });
          }

          if (options.done) {
            options.done();
          }
        };

        if (cfgs.cache[options.api] && options.cached) {
          console.debug("Cached:" + options.api);
          $.each(cfgs.cache[options.api], (index, item) => {
            parse(index, item);
          });
          if (options.done) {
            options.done();
          }
        } else {
          console.debug("UnCached:" + options.api);

          this.AJAX.get(
            options.api, {
              nocache: true,
              args: options.args,
              block: false
            }, {
              noneDate: () => {
                requestDone();
              },
              success: (json) => {
                requestDone(json.data.list);
              }
            }
          );
        }
      };

      initButton() {
        /** 设置页面按钮文本\图标\颜色等基本信息 */
        $.each(cfgs.options.texts, (key, value) => {
          $("." + key).each((index, element) => {
            $(element).html(value).addClass(this.readStyle(key));
          });
        });
      };

      /** 初始化页面元素 */
      init() {
        // 注册页面控件
        this.initAllSelect();
        this.initButton();
        $(":checkbox,:radio").uniform();
        setTimeout(this.initDate, 300);
      };

      /** ajax方式加载页面内容.
       * @param {JSON} options 打开页面的参数
       *   {string}   title     界面的标题
       *   {string}   url       打开界面的地址
       *   {boolean}  map       打开界面时是否添加站点地图
       *   {function} callback  打开界面后回调函数
       * @author wangxin
       */
      openview(options) {
        var loadcallback = () => {
          /** 打开界面默认参数 */
          var defaults = {
            /** 界面标题 */
            "title": "",
            /** 打开界面的地址*/
            "url": "",
            /** 打开界面时是否添加站点地图*/
            "map": true,
            /** 打开界面后回调函数 */
            "callback": () => { }
          };
          /** 打开界面的参数 */
          var _options = $.extend(defaults, options);

          if (_options.title && _options.title != "") { } else {
            _options.title = $("h4", "#ajax-content").eq(0).text();
          }

          if (_options.map) {
            $("<span />")
              .text(_options.title)
              .appendTo($("<li />").appendTo($(".content-breadcrumb")));
          }
          _options.callback();
        };

        this.layout.load(options.url, loadcallback);
      };

      /** ajax方式加载页面内容.
       * @param {JSON} options 打开页面的参数
       *   {string}   title     界面的标题
       *   {string}   url       打开界面的地址
       *   {boolean}  map       打开界面时是否添加站点地图
       *   {function} callback  打开界面后回调函数
       * 
       * @author wangxin
       */
      openWidow(options) {
        /** 打开界面默认参数 */
        var defaults = {
          /** 界面标题 */
          "title": "",
          /** 打开界面的地址*/
          "url": "",
          /** 模式对话框的宽度 */
          "width": 'full',
          /** 模式对话框的高度 */
          'height': 'full',
          /** 打开模式对话框时处理函数 */
          "onshow": () => { },
          /** 关闭模式对话框时处理函数 */
          "onhide": () => { }
        };
        /** 打开界面的参数 */
        var _options = $.extend(defaults, options);

        // 移除模式对话框容器
        if ($('.modal-container').length > 0) {
          $('.modal-container').remove();
        }
        $('body').append($("<div/>").addClass('modal-container'));

        var modalHeight, modalWidth;
        if (_options.width == 'full') {
          modalWidth = $(window).width() - 50;
        } else {
          modalWidth = _options.width;
        }

        if (_options.height == 'full') {
          modalHeight = $(window).height() - 180;
        } else {
          modalHeight = _options.height;
        }

        $('.modal-container').load(cfgs.modalpage, () => {

          if (_options.title) {
            $(".modal-container .modal .modal-title").html(_options.title);
          }

          $(".modal-container .modal .modal-dialog").width(modalWidth);
          $(".modal-container .modal .modal-body").height(modalHeight);

          var scrollOption = $.extend(cfgs.options.scroller, {
            height: modalHeight
          });
          $(".modal-container .modal .modal-body").css("height", (modalHeight) + "px");
          $(".modal-container .modal .modal-body").slimScroll(scrollOption);

          $('.modal-container .modal .modal-body').load(_options.url, () => {

            var eventArgs = {
              "sender": $('.modal-container .modal')
            };
            $(".modal-container .modal-footer").append(
              $('.modal-container tools')
            );

            $('.modal-container .modal').on('show.bs.modal', () => {
              // EVENT-RAISE:form.modal.show
              _event.raise('form.modal.show', eventArgs);
              $('tools>button').unwrap();
              _options.onshow($('.modal-container .modal'));

              module.initButton();
            });

            $('.modal-container .modal').on('hide.bs.modal', () => {
              // EVENT-RAISE:form.modal.hide
              _event.raise('form.modal.hide', eventArgs);
              _options.onhide($('.modal-container .modal'));
            });

            $('.modal-container .modal').modal({ keyboard: false });

          });

        });
        // return $('.modal-container .modal');
      };

      /** 在container中增加空单元格（td），并且返回该单元格
       * @param {Element} container 承载空单元格的容器
       * @returns {Element} 装入container的单元格
       */
      appendEmpty(container) {
        return $(cfgs.templates.cell).appendTo(container);
      };

      /** 在container中增加一个动作按钮，并且返回该按钮
       * @param {Element} container 承载动作按钮的容器
       * @param {string} textKey 动作按钮的文本键，对应cfgs.texts
       * @param {function} clickEventHandler 动作按钮点击事件的处理函数
       * @param {string} eventArgs 动作按钮附加的参数 data-args='eventArgs'
       * @returns {Element} 动作按钮
       */
      appendAction(container, textKey, clickEventHandler, eventArgs) {
        var actionButton = $("<button />").appendTo(container)
          .html(cfgs.options.texts[textKey])
          .addClass(cfgs.options.styles[textKey])
          // .addClass('btn-mini')
          .addClass(textKey)
          // .attr("href", "javascript:;")
          .on("click", clickEventHandler);
        if (eventArgs) {
          actionButton.attr('data-args', eventArgs);
        }
        return actionButton;
      };

      /** 在container中增加HTML单元格（td），并且返回该单元格
       * @param {Element} container 承载动作按钮的容器
       * @param {string} html 添加到单元格的HTML内容
       * @returns {Element} 承载HTML内容的单元格
       */
      appendHTML(container, html) {
        return this.appendEmpty(container).html(html);
      };

      /** 在container中增加文本单元格（td），并且返回该单元格
       * @param {Element} container 承载动作按钮的容器
       * @param {string} text 添加到单元格的文本内容
       * @returns {Element} 承载文本内容的单元格
       */
      appendText(container, text) {
        return this.appendEmpty(container).text(text);
      };

      /** 在container中增加字典单元格（td），并且返回该单元格
       * @param {Element} container 承载动作按钮的容器
       * @param {string} dictname 字典名称
       * @param {string} text 字典对应的值，若isMulit=true，则多个值用，分割
       * @param {boolean} isMulit 是否支持多值转换
       * @returns {Element} 承载字典内容的单元格
       */
      appendDictText(container, dictname, text, isMulit) {
        if (isMulit) {
          // 内容不存在时不需要处理
          if (!text) {
            return this.appendText(container, '');
          }
          let newtext = "";
          $.each(text.split(","), (index, item) => {
            if (index > 0) {
              newtext += ",";
            }
            newtext += this.dict.getText(dictname, item);
          });
          return this.appendText(container, newtext);
        } else {
          let item = this.dict.getItem(dictname, text);
          if (item.text) {
            var td = this.appendEmpty(container);
            var span = $('<span/>').append(item.text);
            // if (item.label) {
            //   span.addClass('label label-sm');
            //   span.addClass(item.label);
            // }
            td.append(span);
            return td;
          } else {
            return this.appendText(container, item);
          }
        }
      };

      /** 在container中增加时间单元格（td），并且返回该单元格
       * @param {Element} container 承载动作按钮的容器
       * @param {string} text 时间文本（UTC）格式
       * @param {string} format 日期转换的格式
       * @returns {Element} 承载时间内容的单元格
       */
      appendDateText(container, text, format) {
        var newtext = "";
        if (format) {
          newtext = this.util.utcTostring(text, format)
        } else {
          newtext = this.util.utcTostring(text, cfgs.options.defaults.datetimeformat)
        }
        return this.appendText(container, newtext);
      };

    }

    class Layout {

      /**
       * @param {AJAX} ajax
       * @param {Util} util 
       * @
       */
      constructor(ajax, util) {
        this.AJAX = ajax;
        this.util = util;

        this.loaded = undefined;
        this.leaveAction = undefined;
        this.leaveModule = undefined;

        /** 当前登录状态是否超时 */
        let isLoginTimeout = false;
        // EVENT-ON:layout.logined 当用户登录后触发：用于处理登录超时后弹出多个对话框
        _event.on(this.events.logined, () => {
          isLoginTimeout = false;
        });

        // EVENT-ON:ajax.login.timeout 当用户session过期时出发，进入用户登录界面
        _event.on(this.AJAX.events.logintimeout, () => {
          // 解决登录超时后弹出多个对话框
          if (isLoginTimeout) {
            return;
          }
          isLoginTimeout = true;
          Dialog.alertText("登录超时,请重新登录", () => {
            this.gotoLogin();
          });
        });

        // EVENT-ON:layout.started
        _event.on(this.events.started, () => {
          console.info("应用程序启动");

          $(window).on("resize", () => {
            setTimeout(this._refresh_scroller, 500);
            setTimeout(this.resizeContentScroll, 500);
          });

          // 注册导航栏一级菜单点击事件
          $('body').on("click", ".sidebar-menu .has-sub > a", (e) => {
            var isOpen = $(e.target).parent().hasClass("open");
            // 获取最后一个打开的一级菜单，并且清除打开状态
            var last = $(".has-sub.open", $(".sidebar-menu"));
            last.removeClass("open");
            $(".arrow", last).removeClass("open");

            if (isOpen) {
              $(".arrow", $(e.target)).removeClass("open");
              $(e.target).parent().removeClass("open");
            } else {
              $(".arrow", $(e.target)).addClass("open");
              $(e.target).parent().addClass("open");
            }
          });

          // 注册菜单点击事件
          $('body').on("click", ".sidebar-menu-container a", (e) => {
            this.on_menu_click($(e.target), e);
          });

          /* 注册按钮事件 */
          $('body').on('click', '.sys-logout', () => {
            this.AJAX.get(API.login.logoutapi, {}, () => {
              this.gotoLogin();
            });
          });

          // 触发框架初始化事件
          // EVENT-RAISE:layout.initialize 框架开始初始化时触发
          _event.raise(this.events.initialize);
        });

        // EVENT-ON:layout.initialize
        _event.on(this.events.initialize, () => {
          console.time(this.times.initialize);
          if (!(cfgs.INFO = Cookie.read())) {
            console.info("TOKEN验证失败,重新登录");
            this.gotoLogin(); /*不存在token或token失效，需重新登录*/
          } else {
            console.info("TOKEN验证成功,进入系统");
            this.gotoMain(); /*token有效，可正常使用系统*/
          }
        });

        // EVENT-ON:layout.initialized
        _event.on(this.events.initialized, () => {
          console.timeEnd(this.times.initialize);
        });

        //  重置内容区域滚动条
        this.resizeContentScroll = () => {
          $("#content").append($("#content-container"));
          $("#content>.slimScrollDiv").remove();
          $("#content-container").removeAttr("style");

          var windowHeight = $(window).outerHeight();
          var breadcrumbHeight = $(".content-header").outerHeight();
          var contentHeight = windowHeight - breadcrumbHeight;

          var options = $.extend(cfgs.options.scroller,
            {
              height: contentHeight,
              color: "#0786d6"
            });

          $("#content-container").css("height", contentHeight + "px");
          $("#content-container").slimScroll(options);
        };

        /** 重置导航区域滚动条 */
        this._refresh_scroller = () => {
          $("body>aside>header").after($(".sidebar-menu"));
          $("body>aside>.slimScrollDiv").remove();
          $(".sidebar-menu").removeAttr("style");

          var userHeight = $("body>aside>header").outerHeight();
          var footerHeight = $("body>aside>footer").outerHeight();
          var windowHeight = $(window).outerHeight();
          var sidebarHeight = windowHeight - footerHeight - userHeight;

          var options = $.extend(cfgs.options.scroller, {
            height: sidebarHeight
          });
          $(".sidebar-menu").css("height", sidebarHeight + "px");
          $(".sidebar-menu").slimScroll(options);

        };

        /** 初始化选中菜单层级 */
        this.initMenuLevel = () => {
          var res = this.util.parseURL(window.location);
          var newUrl = res.path.substring(1) + "?";

          cfgs.pageOptions.items = new Array();
          cfgs.pageOptions.menus = new Array();
          var datasid = cfgs.pageOptions.currentmenu.parent().attr("data-id");
          if (!datasid) {
            datasid = cfgs.pageOptions.currentmenu.parent().parent().attr("data-id");
          }
          var item = cfgs.modules[datasid];
          newUrl += datasid;
          cfgs.pageOptions.items.push(item);
          while (item.parent && item.parent != "000") {
            item = cfgs.modules[item.parent];
            cfgs.pageOptions.items.push(item);
          }
          history.pushState({}, 0, 'http://' + window.location.host + '/' + newUrl);
        };

        /** 处理mini-menu高亮状态 */
        this.highlightSelected = () => {
          if ($("body").hasClass("mini-menu")) {
            $(".open", $(".sidebar-menu")).each(function () {
              $(this).removeClass("open");
            });
            var text =
              cfgs.pageOptions.items[cfgs.pageOptions.items.length - 1].name;
            $("li>a>.menu-text", $(".sidebar-menu-container")).each(function () {
              if ($(this).text() == text) {
                $(this)
                  .parent()
                  .parent()
                  .addClass("open");
              }
            });
          }
        };

        /** 重置页面描述性信息:导航地图、权限按钮等等 */
        this.resetBreadcrumb = () => {
          $(".content-breadcrumb").empty();
          /* 移除breadcrumb全部节点 */
          for (
            var index = cfgs.pageOptions.items.length - 1;
            index >= 0;
            index--
          ) {
            cfgs.pageOptions.menus[index] = cfgs.pageOptions.items[index].name;
            var breadcrumb = $("<li />").appendTo($(".content-breadcrumb"));

            if (index == 0) {
              var a = $(
                '<a href="javascript:;" class="breadcrumb-item"/>'
              ).appendTo(breadcrumb);

              if (cfgs.pageOptions.items[index].icon) {
                $("<i />")
                  .addClass(cfgs.pageOptions.items[index].icon)
                  .appendTo(a);
              }

              a.append(" " + cfgs.pageOptions.items[index].name);
            } else {
              $("<span/>")
                .text(" " + cfgs.pageOptions.items[index].name)
                .appendTo(breadcrumb);
            }
          }

          $(".breadcrumb-item").on("click", () => {
            this.auto_navigation(cfgs.pageOptions.menus);
          });
        };

        this.createTag = (text) => {
          switch (text) {
            case "new":
              return $("<span />")
                .text("NEW")
                .addClass("badge btn-danger");
            case "hot":
              return $("<span />")
                .text("HOT")
                .addClass("badge btn-warning");
            case "ok":
              return $("<span />")
                .text("OK")
                .addClass("badge btn-success");
            default:
              return $("<span />")
                .text(text)
                .addClass("badge btn-info");
          }
        };

        this.createMenuItem = (functionID, module, parentModule, parentItem) => {

          var li, a, span;
          if (parentModule) {
            li = $("<li/>")
              .attr("data-id", functionID)
              .appendTo($("ul", parentItem));
          } else {
            li = $("<li/>")
              .attr("data-id", functionID)
              .appendTo(parentItem);
          }

          a = $("<a/>")
            .attr("href", module.url || "#")
            .attr("data-module", module.module)
            .attr("data-method", module.method)
            .attr("data-leave", module.leave)
            .attr("data-args", module.args)
            .appendTo(li);

          /**
           * 设置模块图标
           * 若模块图标未设置，则获取父级模块图标
           * 若模块图标设置为空，则不使用图标
           */

          if (module.icon) {
            $("<i/>")
              .addClass(module.icon)
              .appendTo(a);
          } else if (parentModule && parentModule.icon) {
            $("<i/>")
              .addClass(parentModule.icon)
              .appendTo(a);
          }

          span = $("<span/>")
            .text(module.name)
            .appendTo(a);

          if (module.tags) {
            $.each(module.tags, (tindex, titem) => {
              this.createTag(titem).appendTo(span);
            });
          }
        }

        this._initMenu = () => {
          var functions = []; // App.userinfo.list.sort();

          if (cfgs.rootable) {
            cfgs.root = [];
          }

          $.each(cfgs.powers, (index, power) => {
            if (power.id) {
              functions.push(power.id);
            }
          });

          var container = $(".sidebar-menu-container");
          container.empty();

          $.each(functions, (index, functionID) => {

            var a, span, parentA;
            var module = cfgs.modules[functionID]; // 获取系统功能模块
            // 若module不存在则忽略
            if (!module) {
              return;
            }

            if (module.parent) {
              // 处理二级菜单
              var parentModule = cfgs.modules[module.parent];
              // 判断菜单项级别
              var parentItem = $('li[data-id="' + module.parent + '"]', container);

              if (parentItem.length == 0) {
                // 处理一级目录
                parentItem = $("<li/>")
                  .attr("data-id", module.parent)
                  .appendTo(container);
                a = $("<a/>")
                  .appendTo(parentItem)
                  .attr("href", "javascript:;");
                if (parentModule.icon) {
                  var icon = $("<i/>")
                    .addClass(parentModule.icon)
                    .appendTo(a);
                  if (parentModule.iconcolor) {
                    icon.css("color", parentModule.iconcolor + " !important");
                  }
                  icon.css("fontSize", "20px");
                }

                span = $("<span/>")
                  .text(parentModule.name)
                  .addClass("menu-text")
                  .appendTo(a);

                if (parentModule.tags) {
                  $.each(parentModule.tags, (tindex, titem) => {
                    this.createTag(titem).appendTo(span);
                  });
                }

                if (parentItem.hasClass("has-sub") == false) {
                  parentItem.addClass("has-sub");
                  parentA = $('a[href="javascript:;"]', parentItem);
                  $("<span/>")
                    .addClass("arrow")
                    .appendTo(parentA);
                  $("<ul/>")
                    .addClass("sub")
                    .appendTo(parentItem);
                }

                // 如果启用初始菜单则设定
                if (cfgs.rootable && cfgs.root.length == 0) {
                  cfgs.root.push(parentModule.name);
                }
              }

              this.createMenuItem(functionID, module, parentModule, parentItem);

              // 如果启用初始菜单则设定
              // if (cfgs.rootable && cfgs.root.length == 1) {
              //   cfgs.root.push(module.name);
              // }
            } else if (module.module || module.url) {
              // 处理一级菜单
              this.createMenuItem(functionID, module, undefined, container);
              // 如果启用初始菜单则设定
              if (cfgs.rootable && cfgs.root.length == 0) {
                cfgs.root.push(module.name);
              }
            } else {


            }

          });

          console.info("菜单初始化完成");

          // 延迟初始化初始页面，避免菜单初始化过慢导致无法显示初始页面
          setTimeout(() => {
            var url = util.parseURL(window.location);
            if (url && url.query) {
              var args = url.query.substring(1);
              var ArgsObject = args.split('\\');
              var root = [];
              root.push(cfgs.modules[ArgsObject[0]].name);
              this.auto_navigation(root);
            } else {
              this.auto_navigation(cfgs.root);
            }
            // console.log(url);
          }, 100);
        };

        /** 导航至系统主界面 */
        this.gotoMain = () => {
          // EVENT-RAISE:layout.logined 用户登录后触发,{cfgs.INFO}
          _event.raise(this.events.logined, cfgs.INFO);
          $("body").removeClass("login");
          $('body>section').empty();
          $('body>section').height($(document).height());
          // 加载导航页面
          Block.show("初始化导航", $("body>aside"));
          // setTimeout(function () {
          $("body>aside").load(API.page.navigation, () => {
            Block.close($("body>aside"));
            this._initMenu();
            this._refresh_scroller();
            // EVENT-RAISE:layout.initialized 初始化完成后触发
            _event.raise(this.events.initialized);
          });
          // }, 5000);

          // 加载主页面
          Block.show("初始化页面", $("body>section"));
          // setTimeout(function () {
          $("body>section").load(API.login.mainpage, () => {
            Block.close($("body>section"));
            $(".username").text(cfgs.INFO.name);
            $(".userrole").text(cfgs.INFO.rolename);
            this.resizeContentScroll();
          });
          // }, 5000);
        };

        /** 导航至登录界面 */
        this.gotoLogin = () => {
          Cookie.save("");
          $("body").addClass("login");
          $("body>section").removeAttr("style");
          $("body>aside").removeAttr("style");
          $("body>aside").empty();
          var loginPageLoadCallback = () => {
            $(".btn-login").on("click", () => {
              var username = $("#username").val();
              var password = $("#password").val();
              if (!username || username == "") {
                Dialog.alertText("账号不能为空!");
                return;
              }
              if (!password || password == "") {
                Dialog.alertText("密码不能为空!");
                return;
              }
              var options = {
                u: Base64.encode(username),
                p: Base64.encode(password)
              };
              var callback = (json) => {
                // json.data.powers =
                Cookie.save(json);
                this.gotoMain();
              };
              this.AJAX.get(API.login.loginapi, options, callback);
            });
          };
          $("body>section").load(API.login.page, loginPageLoadCallback);
        };

        /** 按照目录层级,自动打开页面.
         * @param {string} path 导航路径.
         * @returns
         */
        this.auto_navigation = (path) => {

          var doNavigation = () => {
            var container = $(".sidebar-menu-container");
            $.each(path, (index, item) => {
              var span = container.find('span:contains("' + item + '")');
              var link = span.parent();
              var li = link.parent();

              if (li.hasClass("has-sub")) {
                li.addClass("open");
                li.find('span[class="arrow"]').addClass("open");
              } else {
                li.addClass("active");
                cfgs.pageOptions.currentmenu = li.find("a");
                li.parent().parent().addClass('open');
                // li.parent().slideDown(200, function () {
                this.on_menu_click(cfgs.pageOptions.currentmenu);
                // });
              }
            });
          };
          var openeds = $(".has-sub.open", $(".sidebar-menu-container"));
          var count = openeds.length;
          if (count == 1 && $('a>span[class="menu-text"]', openeds).text() != path[path.length - 1]) {
            openeds.removeClass("open");
            $(".arrow", openeds).removeClass("open");
            $(".sub", openeds).slideUp(200, doNavigation);
          } else {
            doNavigation();
          }
        };

        /** 处理菜单项点击.
         * @param sender 按钮对象.
         * @param eventArgs 事件参数.
         * @returns
         */
        this.on_menu_click = (sender, eventArgs) => {

          var url, dataModule, dataMethod, dataArgs, dataLeave;
          if (eventArgs) {
            url = $(eventArgs.currentTarget).attr("href");
            dataModule = $(eventArgs.currentTarget).attr("data-module");
            dataMethod = $(eventArgs.currentTarget).attr("data-method");
            dataArgs = $(eventArgs.currentTarget).attr("data-args");
            dataLeave = $(eventArgs.currentTarget).attr("data-leave");
          } else {
            url = sender.attr("href");
            dataModule = sender.attr("data-module");
            dataMethod = sender.attr("data-method");
            dataArgs = sender.attr("data-args");
            dataLeave = sender.attr("data-leave");
          }

          if (!dataMethod) {
            dataMethod = 'init';
          }
          if (!dataLeave) {
            dataLeave = 'destroy';
          }

          if (url == "javascript:;") {
            return;
          } else if (url == "#") {
            url = cfgs.listpage;
          }

          if (this.loaded) {
            if (this.leaveAction && typeof this.loaded[this.leaveAction] == "function") {
              console.debug("module[%s] %s", this.leaveModule, this.leaveAction);
              this.loaded[this.leaveAction]();
            }
          }

          this.leaveAction = dataLeave;
          this.leaveModule = dataModule;

          var callback;
          var text = sender.text(); //$(".sub-menu-text", sender).text(); // 功能名称
          console.debug(
            "menu-click,href=%s,data-module=%s,data-method=%s,data-args=%s,data-leave=%s",
            url,
            dataModule,
            dataMethod,
            dataArgs,
            dataLeave
          );

          if (dataModule && dataMethod) {
            callback = () => {
              $("body").removeClass("filter");
              $(".mini-menu").removeClass("mini-menu");
              // 加载模块脚本
              require([dataModule], (moduleObject) => {
                this.loaded = moduleObject;
                console.debug("module[%s] %s", dataModule, dataMethod);
                if (moduleObject) {
                  if (moduleObject.define) {
                    let info = moduleObject.define;
                    console.debug(
                      "[%s v%s] %s",
                      info.name,
                      info.version,
                      info.copyright
                    );
                  }
                  let initMethod = moduleObject[dataMethod];
                  if (initMethod && typeof initMethod === 'function') {
                    initMethod(text, dataArgs);
                  }
                }//if (moduleObject) {

              });
            };
          }

          if (eventArgs) {
            eventArgs.preventDefault();
          }

          // 处理菜单选中状态
          if (sender.parent().parent().hasClass('sub')) {
            if (cfgs.pageOptions.currentmenu != null) {
              cfgs.pageOptions.currentmenu.parent().removeClass("active");
            }
          } else {
            var container = $(".sidebar-menu-container");
            $(".open", container).removeClass('open');
            $(".active", container).removeClass('active');
          }

          cfgs.pageOptions.currentmenu = sender;
          sender.parent().addClass("active");

          // 生成权限组
          var powers = [];
          var moduleID = sender.parent().attr('data-id');
          var moduleDefine = cfgs.modules[moduleID];
          var modulePowers = cfgs.powers.find((p) => { return p.id == moduleID; });
          if (modulePowers && modulePowers.actions && modulePowers.actions.length > 0) {
            $.each(modulePowers.actions, (index, action) => {
              var powerdefine = moduleDefine.actions.find((p) => { return p.id == action });
              powers.push(powerdefine.action);
            })
          }
          cfgs.pageOptions.powers = powers;

          this.load(url, callback);
        };

      }
      get events() {
        return {
          logined: "layout.logined",
          started: "layout.started",
          initialize: 'latout.initialize',
          initialized: "layout.initialized"
        }
      };

      get times() {
        return {
          initialize: '平台初始化耗时',
          pageload: '页面加载耗时'
        }
      };

      /** 开始初始化UI框架 @returns */
      init() {
        // EVENT-RAISE:layout.started 框架启动时触发
        _event.raise(this.events.started);
      };

      /** ajax方式加载页面内容.
       * @param {string} url 待加载内容的URL地址.
       * @param {string} callback 内容加载完成后的回调函数.
       */
      load(url, callback) {

        /** 页面加载完成时的回调函数 */
        var loadcallback = () => {
          Block.close();
          console.info("加载完成:" + options.url);
          $(".content-toolbar").empty();
          var tools = $("tools>*");
          if (tools.length > 0) {
            // 重置页面内容区工具栏
            $(".content-toolbar").empty();
            $.each(tools, function () {
              $(this).appendTo($(".content-toolbar"));
            });
          }

          this.initMenuLevel();
          this.resetBreadcrumb();
          this.highlightSelected();

          if ($("#ajax-content").hasClass("fadeOutRight")) {
            $("#ajax-content").removeClass("fadeOutRight");
          }
          $("#ajax-content").addClass("fadeInRight");

          if (typeof callback === "function") {
            callback();
          }

          setTimeout(() => {
            $("#ajax-content").removeClass("fadeInRight");
          }, 500);
        };

        if (!url) {
          console.error(
            '请求地址不存在!<br/>地址: <a href="%s" target="_black">%s</a>',
            url,
            url
          );
          return;
        } else {
          console.info("准备加载:%s", url);
        }

        var options = {
          url: url,
          callback: loadcallback,
          block: true
        };

        Block.show("正在加载页面...");
        /* 初始化页面元素 */
        $("body>.datetimepicker").remove();
        $("#ajax-content").addClass("fadeOutRight");
        /* 加载页面内容 */
        $("#ajax-content").load(url, loadcallback);

      };

      /** 导航至前一界面 @returns */
      back() {
        this.auto_navigation(cfgs.pageOptions.menus);
      };

    }

    // #endregion // #region Framework Core

    // #region Generator Plugins

    class InputDatePlugin {
      /**
       * 
       * @param {Form} form 
       * @param {Util} util
       * @param {JSON} column
       */
      constructor(form, util, column) {
        this.Form = form;
        this.Util = util;
        this.Column = column;
      };
      /** 处理 网格显示 */
      grid(column, tr, value) {
        // 显示时间类型
        var format;
        if (column.type == 'date') {
          format = cfgs.options.defaults.dateformat2;
        } else if (column.type == 'datetime') {
          format = cfgs.options.defaults.datetimeformat;
        }

        this.Form.appendDateText(tr, value, format);
      };

      /** 处理 查询条件 */
      filter(column, labelContainer, valueContainer) {
        labelContainer.append(column.text);

        var ctrl = $('<input/>')
          .addClass('form-control form-date')
          .attr('type', 'text')
          .attr('id', column.name)
          .attr('name', column.name)
          .attr('placeholder', '请选择' + column.text + '...');
        valueContainer.append(ctrl);
      };

      /** 处理 预览 */
      preview(column, value, labelContainer, valueContainer) {
        labelContainer.append(column.text);
        let format;
        if (column.type == 'date') {
          format = cfgs.options.defaults.dateformat2;
        } else if (column.type == 'datetime') {
          format = cfgs.options.defaults.datetimeformat;
        }

        $('<input/>')
          .attr('readonly', true)
          .addClass('form-control')
          .val(this.Util.utcTostring(value, format))
          .appendTo(valueContainer);
      };

      /** 处理 获取筛选结果 */
      getFilter(column) {
        var value = $("#" + column.name).val();
        if (!value || value == "") {
          return;
        } else {
          return value;
        }
      };

      /** 处理 数据编辑 */
      editor(column, value, labelContainer, valueContainer) {
        let format;
        if (column.type == 'date') {
          format = cfgs.options.defaults.dateformat2;
        } else if (column.type == 'datetime') {
          format = cfgs.options.defaults.datetimeformat;
        }

        $("#" + column.name).val(
          this.Util.utcTostring(value, format)
        );
      };

    }

    class InputDictPlugin {
      /**
       * 
       * @param {Form} form 
       * @param {Util} util
       * @param {Dictionary} dict
       * @param {JSON} column
       */
      constructor(form, util, dict, column) {
        this.Form = form;
        this.Util = util;
        this.Column = column;
        this.Dictionary = dict;
      };
      /** 处理 网格显示 */
      grid(column, tr, value) {
        this.Form.appendDictText(tr, column.dict, value, column.multiple);
      };

      /** 处理 查询条件 */
      filter(column, labelContainer, valueContainer) {
        labelContainer.append(column.text);

        var ctrl = $('<select/>')
          .addClass('form-control')
          .attr('id', column.name)
          .attr('name', column.name);
        if (column.multiple) {
          ctrl.attr('multiple', true);
        }
        valueContainer.append(ctrl);

        this.Form.initDict(column.dict, ctrl, null);
      };

      /** 处理 预览 */
      preview(column, value, labelContainer, valueContainer) {
        labelContainer.append(column.text);

        let text;
        if (column.dict) {
          text = this.Dictionary.getText(column.dict, value);
        } else {
          text = value;
        }
        $('<input/>')
          .attr('readonly', true)
          .addClass('form-control')
          .val(text)
          .appendTo(valueContainer);
      }

      /** 处理 获取筛选结果 */
      getFilter(column) {
        var value = $("#" + column.name).val();
        if (!value || value == "") {
          return;
        }
        if (column.multiple) {
          return value.join();
        } else {
          return value;
        }
      };

      /** 处理 数据编辑 */
      editor(column, value, labelContainer, valueContainer) {
        this.Form.initDict(
          column.dict,
          $("#" + column.name),
          value,
          column.multiple
        );
      };


    }

    class InputTextPlugin {
      /**
       * 
       * @param {Form} form 
       * @param {JSON} column
       */
      constructor(form, column) {
        this.Form = form;
        this.Column = column;
      };

      /** 处理 网格显示 */
      grid(column, tr, value, totalindex, index) {
        var text;
        var sourceText;

        if (column.base64) {
          value = Base64.decode(value);
        }

        if (column.name == '_index') {
          sourceText = text = totalindex;
        } else if (column.primary) {
          if (column.display) {
            sourceText = text = value;
          }
        } else if (column.overflow != undefined &&
          column.overflow > 0 &&
          value.length > column.overflow) {
          text = value.substring(0, column.overflow) + "...";
          sourceText = value;
        } else {
          if (!value) {
            value = '';
          }
          sourceText = text = value;
        }
        if (text != undefined) {
          this.Form.appendText(tr, text).attr('title', sourceText);
          if (column.name == '_index') {
            tr.attr('data-id', index);
          }
        }
      };

      /** 处理 查询条件 */
      filter(column, labelContainer, valueContainer) {
        labelContainer.append(column.text);

        var ctrl = $('<input/>')
          .addClass('form-control')
          .attr('type', 'text')
          .attr('id', column.name)
          .attr('name', column.name)
          .attr('placeholder', '请输入' + column.text + '...');
        valueContainer.append(ctrl);
      };

      /** 处理 预览 */
      preview(column, value, labelContainer, valueContainer) {
        labelContainer.append(column.text);
        let text = value;
        if (column.base64) {
          text = Base64.decode(value);
        }

        if (column.label) {
          text += ' ' + column.label;
        }
        $('<input/>')
          .attr('readonly', true)
          .addClass('form-control')
          .val(text)
          .appendTo(valueContainer);
      }

      /** 处理 获取筛选结果 */
      getFilter(column) {
        var value = $("#" + column.name).val();

        if (value && column.base64) {
          value = Base64.encode(value);
        }
        return value;
      };

      /** 处理 数据编辑 */
      editor(column, value, labelContainer, valueContainer) {
        $("#" + column.name).val(value);
        if (column.primary && value) {
          $("#" + column.name).attr("readonly", true);
        }
      };
    }

    // #endregion // #region Generator Plugins

    // #region Plugins

    class LoggingPlugin {

      constructor() {
        this.isIE = () => {
          if (!!window.ActiveXObject || "ActiveXObject" in window)
            return true;
          else
            return false;
        };

        this.oldConsole = {
          'info': console.info,
          'debug': console.debug,
          'error': console.error,
          'warn': console.warn,
          'log': console.log,
        };

        this.textformat = "%c%s [%s] ";

        this.consoleStyles = {
          'info': 'color:#2b82cf;',//text-shadow: 1px 1px 0px #fff
          'debug': 'color:#b567df;',
          'error': 'color:red;',
          'warn': 'color:#ff8a57;',
        };

        this.logtypes = {
          'info': "INFO ",
          'debug': 'DEBUG',
          'error': 'ERROR',
          'warn': 'WARN '
        };

        console.info = (text, ...arg) => {
          var func = 'info';
          // console.trace();
          // var date = util.dateformat(new Date(), "yyyy-MM-dd HH:mm:ss");
          var date = '';
          this.oldConsole[func](this.textformat + text, this.consoleStyles[func], date, this.logtypes[func], ...arg);
        }

        console.debug = (text, ...arg) => {
          var func = 'debug';
          // var date = util.dateformat(new Date(), "yyyy-MM-dd HH:mm:ss");
          var date = '';
          this.oldConsole[func](this.textformat + text, this.consoleStyles[func], date, this.logtypes[func], ...arg);
        }
        console.error = (text, ...arg) => {
          var func = 'error';
          // var date = util.dateformat(new Date(), "yyyy-MM-dd HH:mm:ss");
          var date = '';
          this.oldConsole[func](this.textformat + text, this.consoleStyles[func], date, this.logtypes[func], ...arg);
        }
        console.warn = (text, ...arg) => {
          var func = 'warn';
          // var date = util.dateformat(new Date(), "yyyy-MM-dd HH:mm:ss");
          var date = '';
          this.oldConsole[func](this.textformat + text, this.consoleStyles[func], date, this.logtypes[func], ...arg);
        }
      };

    }

    // #endregion #region Plugins

    class Generator {
      /**
       * 
       * @param {Table} table 
       * @param {Form} form
       * @param {Layout} layout
       * @param {Util} util
       * @param {Dictionary} dict
       */
      constructor(table, form, layout, util, dict) {

        this.Table = table;
        this.Form = form;
        this.Layout = layout;
        this.Util = util;
        this.Dictionary = dict;

        this.ACTION_ATTR = "data-action";
        this.ACTION_INSERT = "INSERT";
        this.ACTION_UPDATE = "UPDATE";
        this.FORM_NAME = "role-form";
        this.FROM_KEY = "#" + this.FORM_NAME;
        this.PRIMARY_KEY_ATTR = "data-primary";

        this.primaryKey = undefined;
        this.plugin_option = {};

        this.getDefaultOption = () => {
          return {
            "apis": { "list": "", "insert": "", "update": "", "delete": "" },
            "columns": [],
            "headers": {
              "edit": { icon: "fa fa-table", text: "基本信息" },
              "filter": { icon: "fa fa-search", text: "查询条件" },
              "table": { icon: "fa fa-table", text: "查询结果" }
            },
            "helps": { "insert": [], "update": [], "list": [] },
            "actions": {
              "insert": false,
              "update": false,
              "delete": false,
              "preview": true,
              "export": true,
              "select": true,
              "refresh": true,
              "reset": true
            },
            "editor": {
              "page": cfgs.editpage,
              "callback": this.initEditView
            },
            "detailor": {
              "mode": "modal",//"mode:page|modal"
              "width": 'full',
              "height": 'full',
              "page": cfgs.detailpage,
              "callback": this.initDetailView
            },
            "autosearch": true,
            "buffdate": true
          };
        }

        /** 初始化编辑界面,若data有值则视为编辑数据,否则视为新增数据
         * @param {JSON} data 编辑时传入的数据,新增时不需要
         */
        this.initEditView = (data) => {

          let isEdit = data != null && data != undefined; // 当前打开的界面是否为编辑状态.
          if (isEdit) {
            $(this.FROM_KEY).attr(this.PRIMARY_KEY_ATTR, data[this.primaryKey]);
            $(this.FROM_KEY).attr(this.ACTION_ATTR, this.ACTION_UPDATE);
            this.initHelptipView(this.plugin_option.helps.insert);
          } else {
            $(this.FROM_KEY).attr(this.ACTION_ATTR, this.ACTION_INSERT);
            this.initHelptipView(this.plugin_option.helps.update);
          }

          this.plugin_option.columns = this.plugin_option.columns.sort(this.compare_index);
          // 调用Jquery.tmpl模板,初始化页面控件
          $("#editor-data").tmpl(this.plugin_option).appendTo("#info .form-horizontal");

          $.each(this.plugin_option.columns, (index, column) => {
            if (data == undefined) {
              data = {};
            }
            if (!column.edit) {
              return;
            }
            let value = data[column.name];
            if (column.base64) {
              value = Base64.decode(value);
            }

            if (column.custom) {
              var columndiv = $("#" + column.name).parent();
              columndiv.empty();
              column.custom(column, columndiv, value);
            } else {
              column.plugin.editor(column, value, null, null, data);
            }

          });

          this.Form.init();

          var validatorOption = this.validator();
          $(this.FROM_KEY).bootstrapValidator(validatorOption); // 注册表单验证组件
          $(".btn-save").on("click", this.EVENTHANDLER_SAVE); // 处理保存按钮事件
        };

        /** 初始化详情界面
         * @param {JSON} data 详情展示所需要的数据内容
         */
        this.initDetailView = (data, container) => {
          var rowContainer, second = false, formContainer;
          if (container) {
            formContainer = $(this.FROM_KEY, container);
          } else {
            formContainer = $(this.FROM_KEY);
          }
          $.each(this.plugin_option.columns, function (index, column) {
            if (column.type == "icon"
              || column.type == "image"
              || column.type == "map"
              || column.name == '_index'
              || column.primary
              || column.grid == false) {
              return;
            }
            if (second) {
              second = false;
            } else {
              second = true;
              rowContainer = $('<div/>').addClass('form-group').appendTo(formContainer);
            }

            var label = $('<label/>').addClass('col-sm-2 control-label').appendTo(rowContainer);
            var div = $('<div/>').addClass('col-sm-4').appendTo(rowContainer);
            var text = data[column.name];

            if (column.plugin && column.plugin.preview) {
              column.plugin.preview(column, text, label, div);
            } else {
              var ctrl = $('<input/>')
                .attr('readonly', true)
                .addClass('form-control')
                .appendTo(div);
              ctrl.val(JSON.stringify(column));
            }

          });

          if (!container) {
            this.Form.init();
          }
        }

        this.initHelptipView = (helptips) => {
          if (!helptips || helptips.length == 0) {
            return;
          }
          var btnHelp = $("<button/>").html(' <i class="fa fa-warning"></i> 注意事项 ');
          btnHelp.on("click", () => {
            if ($('.alert').length > 0) {
              $('.alert').remove();
            } else {
              this.appendTips(helptips);
            }
          });
          $('.content-toolbar').prepend(btnHelp);
        }

        this.appendTips = (helptips) => {
          var container = $('#filter-container');
          if (container.length == 0) {
            container = $('#info');
          }
          var div = $("<div/>")
            .addClass("alert alert-block alert-success")
            .appendTo(
            $('<div/>').addClass('col-sm-12').insertBefore(container)
            );
          div.append(
            $("<a/>")
              .addClass("close")
              .attr("data-dismiss", "alert")
              .attr("href", "#")
              .attr("aria-hidden", "true")
              .text("×")
          );
          div.append($("<p/>"));
          div.append(
            $("<h4/>")
              .append($("<i/>").addClass("fa fa-bullhorn"))
              .append(" 注意事项")
          );
          div.append($("<p/>"));
          var ul = $("<ul/>").appendTo(div);
          $.each(helptips, (index, text) => {
            ul.append($("<li/>").append(text));
          });

        }

        /** 打开数据编辑界面,若data有值则视为编辑数据,否则视为新增数据
         * @param {JSON} data 编辑时传入的数据,新增时不需要
         * @returns 
         */
        this._open_editview = (data) => {
          form.openview({
            "url": this.plugin_option.editor.page,
            "title": data ? this.plugin_option.texts.update : this.plugin_option.texts.insert,
            "callback": () => {
              this.plugin_option.editor.callback(data);
            }
          });
        };

        /** 打开详情界面
         * @param {JSON} data 详情展示所需要的数据内容
         * @returns 
         */
        this._open_detailview = (data) => {

          switch (this.plugin_option.detailor.mode) {
            case "modal":
              form.openWidow({
                'url': this.plugin_option.detailor.page,
                'title': '详情',
                'width': this.plugin_option.detailor.width,
                'height': this.plugin_option.detailor.height,
                'onshow': (parent) => {
                  this.plugin_option.detailor.callback(data, parent);
                }
              });
              break;
            case "page":
              form.openview({
                'url': this.plugin_option.detailor.page,
                'title': '详情',
                'callback': () => {
                  this.plugin_option.detailor.callback(data);
                }
              });
              break;
            default:
              break;
          }
        };

        /** 编辑界面:保存按钮点击事件处理函数 */
        this.EVENTHANDLER_SAVE = (e) => {
          e.preventDefault();
          var validator = $(this.FROM_KEY).data("bootstrapValidator");
          validator.validate();
          if (!validator.isValid()) {
            return;
          }
          var requesturl;
          var options = module.params();

          switch ($(this.FROM_KEY).attr(this.ACTION_ATTR)) {
            case this.ACTION_INSERT:
              requesturl = this.plugin_option.apis.insert;
              break;
            case this.ACTION_UPDATE:
              options[this.primaryKey] = $(this.FROM_KEY).attr(this.PRIMARY_KEY_ATTR);
              requesturl = this.plugin_option.apis.update;
              break;
          }

          // 调用API，并在操作成功时返回列表页面
          this.AJAX.get(requesturl, options, () => {
            this.Layout.back();
          });
        };

        /** 查看详情按钮时间处理程序 */
        this.EVENTHANDLER_LOOK = (e) => {
          if ($(e.target).attr('disabled')) {
            return;
          }
          if ($(e.target).data('custom')) {
            return;
          }
          this._open_detailview(table.getSelect());
        };

        /** 编辑按钮事件处理程序 */
        this.EVENTHANDLER_EDIT = (e) => {
          if ($(e.target).attr('disabled')) {
            return;
          }
          var mode = $(e.target).data('mode');
          if (mode == 'update') {
            var data = this.Table.getSelect();
            this._open_editview(data);
          } else {
            this._open_editview();
          }
        };

        /** 删除按钮事件处理程序 */
        this.EVENTHANDLER_REMOVE = (e) => {
          if ($(e.target).attr('disabled')) {
            return;
          }
          var primary = $(e.target).data("args");
          var confirmCallback = (result) => {
            if (!result) {
              return;
            }
            var options = {};
            options[this.primaryKey] = primary;
            this.AJAX.get(this.plugin_option.apis.delete, options, () => {
              this.Table.reload();
            });
          };
          Dialog.confirm("确定删除记录?", confirmCallback);
        };


        /** 排序函数：比较filterindex */
        this.compare_filterindex = (x, y) => {
          if (!x.filterindex) return 1;
          if (!y.filterindex) return -1;
          if (x.filterindex < y.filterindex) {
            return -1;
          } else if (x.filterindex > y.filterindex) {
            return 1;
          } else {
            return 0;
          }
        };

        /** 排序函数：比较index */
        this.compare_index = (x, y) => {
          if (x.index < y.index) {
            return -1;
          } else if (x.index > y.index) {
            return 1;
          } else {
            return 0;
          }
        };

        /** 根据页面输入条件查询也过并填充表格 */
        this._search = () => {
          var options = {};
          if (this.plugin_option.args && this.plugin_option.args.search) {
            options = this.plugin_option.args.search;
          }

          // 生成查询条件：遍历每一个column，根据类型取值
          $.each(this.plugin_option.columns, (index, column) => {
            // 没有filter选项,不需要筛选
            if (!column.filter) {
              return;
            }

            // 不存在 处理插件或插件不存在筛选条件，不需要处理筛选
            if (!column.plugin || !column.plugin.getFilter) {
              console.warn(column.name + " 不存在处理插件或插件不存在筛选条件！");
              return;
            }

            var value = column.plugin.getFilter(column);
            if (value) {
              options[column.name] = value;
            }

          });

          //  查询数据并且填充表格（TABLE）
          this.Table.load({
            "api": this.plugin_option.apis.list,
            /** 解析表格记录内容
             * @param {Element} tr
             * @param {number} index
             * @param {number} totalindex
             * @param {JSON} item
             * @returns 
             */
            "parsefn": (tr, index, totalindex, item) => {
              var columns = this.plugin_option.columns;
              columns = columns.sort(this.compare_index);
              $.each(columns, (column_index, column) => {
                // 未在表格中展示的内容，不需要处理
                if (column.grid == false) {
                  return;
                }
                column.plugin.grid(column, tr, item[column.name], totalindex, index);
              });
            },
            "args": options
          });

        };

        /** 重置页面输入项 */
        this._reset = () => {
          $.each(this.plugin_option.columns, (index, column) => {
            if (!column.filter) {
              return;
            } // 没有filter选项,不需要筛选
            if (column.dict) {
              $("#" + column.name).val(null).trigger("change");
            } else {
              $("#" + column.name).val("");
            }
          });
        };
      }

      /** 初始化表单内容
       * @param  {JSON} options 初始化选项
       */
      init(options) {
        this.plugin_option = $.extend(true, this.getDefaultOption(), options);
        var displaycolumns = [];

        var hasFilter = false;

        // 遍历数组：1、设置初始索引 index:用于排序；2、控件处理插件；3、判断是否需要筛选条件
        $.each(this.plugin_option.columns, (index, column) => {
          column.index = index;

          if (column.dict && column.dict != '') {
            column.plugin = new InputDictPlugin(this.Form, this.Util, this.Dictionary, column);
          } else if (column.type == 'date' || column.type == "datetime") {
            column.plugin = new InputDatePlugin(this.Form, this.Util, column);
          } else {
            column.plugin = new InputTextPlugin(this.Form, column);
          }
          // 查询条件处理 BEGIN
          if (!hasFilter && column.filter) {
            hasFilter = true;
          } // 检查表单是否存在filter功能.

        });

        this.plugin_option.columns = this.plugin_option.columns.sort(this.compare_index);

        // 遍历columns设置,获取table的显示字段名称
        $.each(this.plugin_option.columns, (index, column) => {
          // 处理主键字段
          if (column.primary) {
            this.primaryKey = column.name;
            if (column.display) {
              displaycolumns.push(column.text);
            }
            return;
          }
          //跳过不需要在GRID中显示的列
          if (column.grid == undefined || column.grid == true) {
            displaycolumns.push(column.text);
          }
        });

        // 渲染表格
        this.Table.render($("#table"), displaycolumns);

        // #region 判断是否有新增功能:如果有则设定按钮文字样式及事件

        // TODO: 权限校验：INSERT
        if (cfgs.pageOptions.powers.indexOf('insert') > -1 && this.plugin_option.actions.insert) {
          $(".btn-add")
            .attr("data-title", this.plugin_option.texts.insert)
            .on("click", this.EVENTHANDLER_EDIT);
        } else {
          $(".btn-add").remove();
        }

        // TODO: 权限校验：EXPORT
        if (cfgs.pageOptions.powers.indexOf('export') == -1) {
          $(".btn-export").remove();
        }

        // TODO: 权限校验：UPDATE
        if (cfgs.pageOptions.powers.indexOf('update') > -1 && this.plugin_option.actions.update) {
          $(".btn-edit")
            .attr('data-mode', 'update')
            .on("click", this.EVENTHANDLER_EDIT)
            .attr('disabled', "true");
        } else {
          $(".btn-edit").remove();
        }

        // TODO: 权限校验：DELETE
        if (cfgs.pageOptions.powers.indexOf('delete') > -1 && this.plugin_option.actions.delete) {
          $(".btn-remove")
            .on("click", this.EVENTHANDLER_REMOVE)
            .attr('disabled', "true");
        } else {
          $(".btn-remove").remove();
        }

        if (this.plugin_option.actions.preview) {
          $(".btn-preview")
            .on("click", this.EVENTHANDLER_LOOK)
            .attr('disabled', "true");
        } else {
          $(".btn-preview").remove();
        }

        if (this.plugin_option.actions.export) {
        } else {
          $('.btn-export').remove();
        }

        if (this.plugin_option.actions.select) {
        } else {
          $('.btn-selectall').remove();
          $('.btn-selectopp').remove();
        }

        if (this.plugin_option.actions.refresh) {
        } else {
          $('.btn-refresh').remove();
        }

        if (this.plugin_option.actions.reset) {
        } else {
          $('.btn-reset').remove();
        }

        // #endregion // #region 判断是否有新增功能:如果有则设定按钮文字样式及事件

        // 处理查询条件区块内容及事件
        if (hasFilter) {
          this.plugin_option.columns = this.plugin_option.columns.sort(this.compare_filterindex);

          var container = $("#filter-container>form");
          $.each(this.plugin_option.columns, (index, column) => {
            // 不作为筛选条件的字段，不需要处理
            if (!column.filter) {
              return;
            }
            // 不存在 处理插件或插件不存在筛选条件，不需要处理筛选
            if (!column.plugin || !column.plugin.filter) {
              console.warn(column.name + " 不存在处理插件或插件不存在筛选条件！");
              return;
            }

            if (column.custom) {
              var columndiv = $("#" + column.name).parent();
              columndiv.empty();
              column.custom(column, columndiv, null);
            } else {
              var columnContainer = $('<div/>').addClass('col-sm-4 col-lg-3').appendTo(container);
              var labelContainer = $('<label/>').addClass('control-label').appendTo(columnContainer);
              column.plugin.filter(column, labelContainer, columnContainer);
            }

          }); //$.each(columns, function (index, column) {

          /* 注册查询按钮点击事件 */
          $(".btn-search").on("click", this._search);
          /* 注册重置按钮点击事件 */
          $(".btn-reset").on("click", this._reset);
        } else {
          $("#filter-container").remove();
        } //if (hasFilter) {

        this.initHelptipView(this.plugin_option.helps.list);

        // EVENT-RAISE:generator.option.inited 自动创建表单完成时触发。
        _event.raise('generator.option.inited', options);

        this.Form.init();

        // EVENT-RAISE:generator.option.rendered 自动创建表单渲染完成时触发。
        _event.raise('generator.option.rendered', options);
        // 自动调用查询条件重置方法
        if (hasFilter) {
          this._reset();
        }
        // 处理是否自动调用数据查询方法
        if (this.plugin_option.autosearch) {
          this._search();
        }
      };

      /** 根据当前配置内容，创建验证规则
       * @return {JSON} 返回验证规则
       */
      validator() {
        var validatorOption = {
          message: 'This value is not valid',
          feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
          },
          fields: {}
        };

        $.each(this.plugin_option.columns, (index, column) => {
          var _validOption = {};
          if (!column.novalid) {
            _validOption = {
              message: column.text + '验证失败',
              validators: {
                notEmpty: {
                  message: column.text + '不能为空'
                }
              }
            };

            if (column.validtype) {
              if (column.validtype == 'phone') {
                _validOption.validators['regexp'] = {
                  regexp: /^1[3|5|8]{1}[0-9]{9}$/,
                  message: '请输入正确的手机号码'
                };

              } else {
                _validOption.validators[column.validtype] = {
                  message: column.message
                };
              }
            }

            if (column.regex) {
              _validOption.validators['regexp'] = {
                regexp: column.regex,
                message: column.message
              };
            }

            if (column.type == "date") {
              _validOption.validators['date'] = {
                format: "YYYY-MM-DD",
                message: '日期格式不正确'
              };
            }

            if (column.type == "datetime") {
              _validOption.validators['date'] = {
                format: "YYYY-MM-DD h:m:s",
                message: '日期格式不正确'
              };
            }
          }
          validatorOption.fields[column.name] = _validOption;
        });

        return validatorOption;
      };

      /**
       * 
       */
      params() {
        var options = {};
        $.each(this.plugin_option.columns, function (index, column) {
          if (!column.edit) {
            return;
          }
          // generator-plugin 的赋值函数
          if (column.plugin && column.plugin.get && typeof column.plugin.get === 'function') {
            column.plugin.get(options);
            return;
          } else {
            let value = $("#" + column.name).val();
            if (column.type == "date" || column.type == "datetime") {
              options[column.name] = Util.stringToUTC(value);
            } else if (column.multiple) {
              options[column.name] = value.join();
            } else {
              if (column.base64) {
                options[column.name] = Base64.encode(value);
              } else {
                options[column.name] = value;
              }
            }
          }
        });

        return options;
      }

      /** 执行保存操作，自动判断新增或更新状态，没有设置options则自动获取
       * @param {JSON} options 执行保存操作的数据
       * @return 
       */
      save(options) {
        var _options;
        var _url;
        if (!options) {
          var validator = $(this.FROM_KEY).data("bootstrapValidator");
          validator.validate();
          if (!validator.isValid()) {
            return;
          }
          _options = module.params();
        } else {
          _options = options;
        }

        switch ($(this.FROM_KEY).attr(this.ACTION_ATTR)) {
          case this.ACTION_INSERT:
            _url = this.plugin_option.apis.insert;
            break;
          case this.ACTION_UPDATE:
            _options[this.primaryKey] = $(this.FROM_KEY).attr(this.PRIMARY_KEY_ATTR);
            _url = this.plugin_option.apis.update;
            break;
        }

        // 调用API，并在操作成功时返回列表页面
        this.AJAX.get(_url, _options, function () {
          this.layout.back();
        });
      }

    }

    new LoggingPlugin();


    let _event = new FrameworkEvent();
    let _ajax = new AJAX();
    let _util = new Util();
    let _table = new Table(_ajax);
    let _Dictionary = new Dictionary(_ajax);
    let _form = new Form(_ajax, _Dictionary, _util);
    let _layout = new Layout(_ajax, _util);


    var exportModule = {
      event: _event,
      ajax: _ajax,
      generator: new Generator(_table, _form, _layout),
      layout: _layout,
      util: _util,
      config: cfgs,
      api: API,
      form: _form,
      table: _table,
      dict: _Dictionary,

      alertText: Dialog.alertText,
      confirm: Dialog.confirm,
      block: {
        show: Block.show,
        close: Block.close
      },
      base64: {
        encode: Base64.encode,
        decode: Base64.decode
      },
      Start: () => {
        _layout.init();
      }
    };

    return exportModule
  });