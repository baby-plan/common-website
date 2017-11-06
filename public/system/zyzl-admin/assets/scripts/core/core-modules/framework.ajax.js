define(['jquery', 'cfgs',
  'core/core-modules/framework.block',
  'core/core-modules/framework.event'
], function ($, cfgs, block, event) {

  const events = {
    "REQUEST_SUCCESS": 'ajax.request.success',
    "REQUEST_ERROR": "ajax.request.error"
  };

  let module = {
    "events": events
  };

  var doRequest = function (api, options, callback) {
    var requestData = {},
      requestOption = {
        "method": "GET",
        "block": true,
        "cache": true
      };
    /*处理请求参数*/
    if (options && options.args) {
      /*处理附加参数*/
      if (options.cache != undefined) {
        requestOption.cache = options.cache;
      }
      if (options.block != undefined) {
        requestOption.block = options.block;
      }
      if (options.method) {
        requestOption.method = options.method;
      }
      if (options.error) {
        requestOption.errorParse = options.error;
      }
      requestData = options.args;
    } else if (options != null) {
      requestData = options;
    }
    /*处理遮罩*/
    if (requestOption.block) {
      block.show("正在加载数据...");
    }

    /* AJAX请求选项 */
    var ajaxOptions = {
      "type": requestOption.method,
      "dataType": "json",
      //,contentType:"application/json; charset=utf-8"
      //,cache: false
      //, crossDomain: true
      // "async": async,
      "async": true,
      "success": function (json) {
        if (requestOption.block) {
          block.close();
        }
        //EVENT-RAISE:ajax.request.success
        event.raise(events.REQUEST_SUCCESS, {
          "data": requestData,
          "option": requestOption,
          "url": api,
          "result": json,
          "callback": callback
        });
      },
      "error": function (xhr, textStatus) {
        if (requestOption.block) {
          block.close();
        }
        //EVENT-RAISE:ajax.request.error
        event.raise(events.REQUEST_ERROR, {
          "data": requestData,
          "option": requestOption,
          "url": api,
          "xhr": xhr,
          "status": textStatus,
          "callback": callback
        });
      },
      "url": api,
      "data": requestData
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

    console.info("准备请求." + ajaxOptions.url + ",参数:" + JSON.stringify(ajaxOptions.data));
    /*执行操作请求*/
    $.ajax(ajaxOptions);
  };

  /** 以GET方式发起AJAX请求.
   * @param {string} api 请求的接口.
   * @param {JSON} options 请求附加的参数.
   * @param {Function} callback 请求回调函数.
   */
  module.get = function (api, options, callback) {
    if (options.args) {
      options.method = "GET";
    } else {
      options = {
        method: "GET",
        args: options
      }
    }
    doRequest(api, options, callback);
  };

  /** 以POST方式发起AJAX请求.
   * @param {string} api 请求的接口.
   * @param {JSON} options 请求附加的参数.
   * @param {Function} callback 请求回调函数.
   */
  module.post = function (api, options, callback) {
    if (options.args) {
      options.method = "POST";
    } else {
      options = {
        method: "POST",
        args: options
      }
    }
    doRequest(api, options, callback);
  };

  return module;

});