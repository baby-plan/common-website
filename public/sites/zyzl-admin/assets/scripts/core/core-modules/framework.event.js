define(['jquery', 'cfgs'], function ($, cfgs) {
  var eventstore = {};
  /** 注册事件 */
  var registEvent = function (eventname, fn) {
    if (typeof eventname === "string" && typeof fn === "function") {
      if (typeof eventstore[eventname] === "undefined") {
        eventstore[eventname] = [fn];
      } else {
        eventstore[eventname].push(fn);
      }
    }
  };

  var raiseEvent = function (eventname, eventArgs) {
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
  };

  var unregistEvent = function (eventname, fn) {
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
  }

  return {
    'define': {
      "name": "PLUGIN-LAYOUT-CELL",
      "version": "1.0.0.0",
      'copyright': ' Copyright 2017-2027 WangXin nvlbs,Inc.',
    },
    "on": registEvent,
    "off": unregistEvent,
    "raise": raiseEvent
  };

});
