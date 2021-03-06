define(['jquery', 'cfgs',
  'core/core-modules/framework.base64',
  'core/core-modules/framework.block',
  'core/core-modules/framework.dialog',
  'core/core-modules/framework.util',
  'core/core-modules/framework.event'
], function ($, cfgs, base64, block, dialog, util, event) {

  const events = {
    'logintimeout': 'ajax.login.timeout'
  };

  /**
   * 处理服务端返回的业务逻辑错误
   * @param {object} json 服务端返回的结果 json={"c":"code","m":"base64code"}
   * @returns
   */
  var onServerError = function (json) {
    if (json.ret == "1") {
      dialog.alertText(base64.decode(json.msg));
    } else if (json.ret == "101") {
      // EVENT-RAISE:ajax.login.timeout 登录超时
      event.raise(events.logintimeout);
    } else if (json.msg) {
      dialog.alertText("其他未知错误<BR/>错误代码:" + json.ret + "<BR/>" + base64.decode(json.msg));
    } else {
      dialog.alertText("其他未知错误<BR/>错误代码:" + json.ret);
    }
  }

  /** 处理HTTP请求异常.
   * @param {JSON} xhr .
   * @param {JSON} textStatus .
   * @param {JSON} errorThrown .
   * @returns
   */
  var onRequestError = function (xhr, textStatus) {
    block.close();
    console.debug("请求失败:" + xhr.status);
    if (xhr.status == "404") {
      dialog.alertText("请求地址不存在!");
    } else if (xhr.status == "500") {
      dialog.alertText("服务端异常!CODE:500");
    } else if (xhr.status == "502") {
      dialog.alertText("服务端异常!CODE:502");
    } else if (xhr.statusText && xhr.statusText == "NetworkError") {
      dialog.alertText("网络连接错误:<ul><li>请检查是否已经连接网络.</li><li>请检查网络地址是否存在.</li></ul>");
    } else {
      dialog.alertText(textStatus);
    }
  }

  let module = {
    "events": events
  };

  /** 发起AJAX请求.
   * @param {string} api 请求的接口.
   * @param {JSON} options 请求附加的参数.
   * @param {Function} callback 请求回调函数.
   */
  module.get = function (api, options, callback) {
    var cache = true,
      defaults = {},
      blockUI = true,
      errorParse;
    /*处理请求参数*/
    if (options && options.args) {
      /*处理附加参数*/
      if (options.nocache) {
        cache = false;
      }
      if (options.noblock) {
        blockUI = false;
      }
      defaults = options.args;
      if (options.error) {
        errorParse = options.error;
      }
    } else if (options != null) {
      defaults = options;
    }
    /*处理遮罩*/
    if (blockUI) {
      block.show("正在加载数据...");
    }
    var options = $.extend(defaults, options);
    /* 请求成功后的回调函数。 */
    var onSuccess = function (json) {
      if (blockUI) {
        block.close();
      }
      console.info("请求完成:%o", json);
      if (typeof errorParse === 'function') {
        var result = errorParse(json.ret)
        if (!result) {
          return;
        }
      }
      if (json.ret != "0") {
        onServerError(json); // 处理服务端返回的业务逻辑错误
      } else {
        //操作成功
        /* 判断是否需要记录缓存 */
        if (cache) {
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
        if (callback) {
          if (json.data && ((!json.data.list && (callback.clear || callback.noneDate)) || (json.data.list && json.data.list == 0))) {
            if (typeof callback.clear === 'function') {
              callback.clear();
            }
            if (typeof callback.noneDate === 'function') {
              callback.noneDate();
            }
          } else if (typeof callback.success === 'function') {
            callback.success(json);
          } else {
            callback(json);
          }
        } else {
          // App.route.back();
        }
      }
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
      "success": onSuccess,
      "error": onRequestError,
      "url": api,
      "data": options
    }
    /*设置请求超时*/
    if (cfgs.options.request.timeout) {
      ajaxOptions.timeout = cfgs.options.request.timeout;
    }

    if (callback) {
      /*显示正在查询数据*/
      if (callback.busy) {
        callback.busy();
      }
    }

    console.info("准备请求." + ajaxOptions.url + ",参数:" + util.jsonToString(ajaxOptions.data));
    /*执行操作请求*/
    $.ajax(ajaxOptions);
  };

  return module;

});