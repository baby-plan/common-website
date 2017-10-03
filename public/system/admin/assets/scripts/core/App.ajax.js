/* ========================================================================
 * App.ajax v1.0
 * APP组件
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * 
 * ======================================================================== */
(function (app) {

  /** 处理登录超时 */
  var doLoginTimeout = function () {
    App.alertText("登录超时,请重新登录", function () {
      App.saveCookie("");
      App.route.gotoLogin();
    });
  }

  /**处理服务端返回的业务逻辑错误
   * @param {json} json 服务端返回的结果 json={"c":"code","m":"base64code"}
   */

  var onServerError = function (json) {
    if (json.c == "1") {
      App.alertText(App.base64.decode(json.m));
    } else if (json.c == "101") { // 登录超时
      doLoginTimeout();
    } else if (json.m) {
      App.alertText("其他未知错误<BR/>错误代码:" + json.c + "<BR/>" + App.base64.decode(json.m));
    } else {
      App.alertText("其他未知错误<BR/>错误代码:" + json.c);
    }
  }

  /** 处理HTTP请求异常.
   * @param xhr .
   * @param textStatus .
   * @param errorThrown .
   */

  var onRequestError = function (xhr, textStatus, errorThrown) {
    /// <summary>处理HTTP请求异常.<para>请求失败时调用此函数.</para></summary>
    App.logger.debug("请求失败:" + xhr.status);
    if (xhr.status == "404") {
      App.alertText("请求地址不存在!");
    } else if (xhr.status == "500") {
      App.alertText("服务端异常!CODE:500");
    } else if (xhr.status == "502") {
      App.alertText("服务端异常!CODE:502");
    } else if (xhr.statusText) {
      if (xhr.statusText == "NetworkError") {
        App.alertText("网络连接错误:<ul><li>请检查是否已经连接网络.</li><li>请检查网络地址是否存在.</li></ul>");
      }
    } else {
      App.alertText(textStatus);
    }
  }

  /** 发起AJAX请求.
   * @param api 请求的接口.
   * @param options 请求附加的参数.
   * @param callback 请求回调函数.
   */

  var _ajax_request = function (api, options, callback) {
    console.group("AJAX:" + api);
    /// <summary>发起AJAX请求.</summary>
    /// <param name="api">请求的接口.</param>
    /// <param name="options">请求附加的参数.
    /// <para>[可选结构] 1</para>
    /// <para>直接传入请求API时附带的参数.</para>
    /// <para>[可选结构] 2</para>
    /// <para>block       : 请求API时是否叠加遮罩.</para>
    /// <para>async        : 请求API是否为异步请求.</para>
    /// <para>args        : 请求API时附带的参数.</para>
    /// <para>nocache  : 请求API成功回调时,是否将结果缓存,默认为false,即缓存结果.</para>
    /// <para>error       : 请求返回时的异常处理函数 function(errorcode).</para>
    /// </param>
    /// <param name="callback">请求回调函数.
    /// <para>[可选结构] 1</para>
    /// <para>直接传入请求API成功时的回调函数.</para>
    /// <para>[可选结构] 2</para>
    /// <para>clear         : 清空表格数据(如果有表格) function().</para>
    /// <para>noneDate  : 表格中添加没有数据提示(如果有表格) function().</para>
    /// <para>success    : 请求API成功时的回调函数 function(json).</para>
    /// <para>[可选结构] 3</para>
    /// <para>不传入参数则视为调用默认参数 App.route.back().</para>
    /// </param>
    var block = true,
      async = false,
      cache = true,
      defaults = {},
      cooike,
      errorParse;
    /*处理请求参数*/
    if (options && options.args) {
      /*处理附加参数*/
      if (options.block) {
        block = options.block;
      }
      if (options.async) {
        async = true;
      }
      if (options.nocache) {
        cache = false;
      }
      defaults = options.args;
      if (options.error) {
        errorParse = options.error;
      }
    } else if (options != null) {
      defaults = options;
    }
    // /* 读取本地登录用户信息,校验是否已经登录用户*/
    // if (App.userinfo) {
    //   defaults.token = App.userinfo.token;
    //   /*已登录,则发送请求时需要传入TOKEN*/
    // }
    /*处理遮罩*/
    if (block) {
      App.block.show("正在加载数据...");
    }
    var options = $.extend(defaults, options);
    /* 请求成功后的回调函数。 */
    var onSuccess = function (json, textStatus, jqXHR) {
      if (block) {
        App.block.close();
      }
      App.logger.info("请求完成");
      if (json && json.data && json.data.list) {
        console.table(json.data.list);
      } else {
        console.log(json);
      }
      // App.logger.info("请求完成:" + App.util.jsonToString(json));
      console.groupEnd();
      if (typeof errorParse === 'function') {
        var result = errorParse(json.c)
        if (!result) {
          return;
        }
      }
      if (json.c != "0") {
        onServerError(json); // 处理服务端返回的业务逻辑错误
      } else {
        //操作成功
        /* 判断是否需要记录缓存 */
        if (cache) {
          /* 清空历史缓存 */
          pageOptions.buffer = {
            "pagecount": (json.data && json.data.pagecount) ? json.data.pagecount : 1,
            "pageindex": (json.data && json.data.pagenumber) ? json.data.pagenumber : 1,
            "pagesize": (json.data && json.data.pagesize) ? json.data.pagesize : 1,
            "recordcount": (json.data && json.data.recordcount) ? json.data.recordcount : 1,
            "data": []
          };
          if (json.data && json.data.list && json.data.list.length > 0) {
            /* 如果返回结果为列表数据则记录缓存 */
            $.each(json.data.list, function (index, item) {
              pageOptions.buffer.data[index] = item;
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
          App.route.back();
        }
      }
    }
    var onError = function (xhr, textStatus, errorThrown) {
      if (block) {
        App.block.close();
      }
      onRequestError(xhr, textStatus, errorThrown);
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
    App.logger.info("请求API：" + ajaxOptions.url + ",参数:" + App.util.jsonToString(ajaxOptions.data));
    /*执行操作请求*/
    $.ajax(ajaxOptions);
  };

  /** 发起AJAX请求.
   * @param {string} api 请求的接口.
   * @param {object} options 请求附加的参数.
   * @param {Function} callback 请求回调函数.
   */
  app.ajax = function (api, options, callback) {
    _ajax_request(api, options, callback);
  };

})(App);