define(['jquery', 'QDP'], function ($, QDP) {
  "use strict";

  /**
   * 处理服务端返回的业务逻辑错误
   * @param {object} json 服务端返回的结果 json={"ret":"code","msg":"codemsg"}
   * @returns
   */
  var onServerError = function (json) {
    if (json.ret == "1") {
      QDP.alert(json.msg);
    } else if (json.ret == "101") {
      // EVENT-RAISE:login.timeout 登录超时
      QDP.raise("login.timeout");
    } else if (json.msg) {
      QDP.alert("其他未知错误<BR/>错误代码:" + json.ret + "<BR/>" + json.msg);
    } else {
      QDP.alert("其他未知错误<BR/>错误代码:" + json.ret);
    }
  }

  /** 处理HTTP请求异常.
   * @param {JSON} xhr .
   * @param {JSON} textStatus .
   * @param {JSON} errorThrown .
   * @returns
   */
  var onRequestError = function (xhr, textStatus) {
    QDP.unblock();
    console.debug("请求失败:" + xhr.status);
    if (xhr.status == "404") {
      QDP.alert("请求地址不存在!");
    } else if (xhr.status == "500") {
      QDP.alert("服务端异常!CODE:500");
    } else if (xhr.status == "502") {
      QDP.alert("服务端异常!CODE:502");
    } else if (xhr.statusText && xhr.statusText == "NetworkError") {
      QDP.alert("网络连接错误:<ul><li>请检查是否已经连接网络.</li><li>请检查网络地址是否存在.</li></ul>");
    } else {
      QDP.alert(textStatus);
    }
  }

  /* 请求成功后的回调函数。 */
  var onSuccess = function (eventArgs) {
    // "data": requestData,
    // "option": requestOption,
    // "url": api,
    // "result": json
    var args = eventArgs.args;
    var json = args.result;
    var option = args.option;
    var callback = args.callback;

    if (option && option.errorParse && typeof option.errorParse === 'function') {
      var result = option.errorParse(json.ret)
      if (!result) {
        return;
      }
    }

    if (json.ret != "0") {
      onServerError(json);
    } else {
      //操作成功
      /* 判断是否需要记录缓存 */
      if (option.cache) {
        /* 清空历史缓存 */
        QDP.config.pageOptions.buffer = {
          "pagecount": (json.data && json.data.pagecount) ? json.data.pagecount : 1,
          "pageindex": (json.data && json.data.pagenumber) ? json.data.pagenumber : 1,
          "pagesize": (json.data && json.data.pagesize) ? json.data.pagesize : 1,
          "recordcount": (json.data && json.data.recordcount) ? json.data.recordcount : 1,
          "data": []
        };
        if (json.data && json.data.list && json.data.list.length > 0) {
          /* 如果返回结果为列表数据则记录缓存 */
          $.each(json.data.list, function (index, item) {
            QDP.config.pageOptions.buffer.data[index] = item;
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
  };

  QDP.on("ajax.request.error", onRequestError);
  QDP.on("ajax.request.success", onSuccess);

});