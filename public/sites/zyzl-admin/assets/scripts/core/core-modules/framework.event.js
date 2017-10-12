define([], function () {
  var eventstore = {};

  return {

    'define': {
      "name": "事件处理插件",
      "version": "1.0.0.0",
      'copyright': ' Copyright 2017-2027 WangXin nvlbs,Inc.',
    },

    /** 注册一个事件
     * @param {string} eventname 等待触发的事件名称
     * @param {function} fn eventname事件触发时处理程序
     * @returns
     */
    "on": function (eventname, fn) {
      console.debug("[EVENT-ON] " + eventname);
      if (typeof eventname === "string" && typeof fn === "function") {
        if (typeof eventstore[eventname] === "undefined") {
          eventstore[eventname] = [fn];
        } else {
          eventstore[eventname].push(fn);
        }
      }
    },

    /** 注销指定名称及处理程序的事件
     * @param {string} eventname 注销的事件名称
     * @param {function} fn 注销的事件处理函数
     * @returns
     */
    "off": function (eventname, fn) {
      console.debug("[EVENT-OFF] " + eventname);
      var listeners = eventstore[eventname];
      if (listeners instanceof Array) {
        if (typeof fn === "function") {
          for (var i = 0, length = listeners.length; i < length; i += 1) {
            if (listeners[i] === fn) {
              listeners.splice(i, 1);
              break;
            }
          }
        } else {
          delete eventstore[eventname];
        }
      }
    },

    /** 通过参数eventArgs触发事件eventname
     * @param {string} eventname 触发的事件名称
     * @param {object} eventArgs 触发eventname事件时附带的参数
     * @returns
     */
    "raise": function (eventname, eventArgs) {
      console.debug("[EVENT-RAISE] " + eventname);
      if (eventname && eventstore[eventname]) {
        var events = {
          type: eventname,
          target: this,
          args: eventArgs
        };

        for (var length = eventstore[eventname].length, start = 0; start < length; start += 1) {
          eventstore[eventname][start].call(this, events);
        }
      }
    }
  };

});
