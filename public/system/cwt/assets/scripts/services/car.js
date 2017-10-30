//车辆列表组件
(function (app) {
  var const_group_id = "chat_group_"
  var talkoptions = [
    { "text": "行驶在线", "id": "running" }
    , { "text": "停车在线", "id": "stoped" }
    , { "text": "离线", "id": "offline" }
  ];
  var defaults = {
    "plugins": ["wholerow", "checkbox", "types"],
    "core": {
      "themes": {
        "responsive": false
      },
      "data": []
    },
    "types": {
      "default": {
        "icon": "fa fa-folder icon-state-warning icon-lg"
      },
      "file": {
        "icon": "fa fa-file icon-state-warning icon-lg"
      }
    }
  };
  var allcar_options = {
    "core": {
      "data": [{ "text": "行驶在线", "children": [] }
        , { "text": "停车在线", "state": { "selected": true } }
        , { "text": "离线", "state": { "selected": true } }
      ]
    }
  };
  var car_sids = [];
  var car_array = {};
  var group_option = { "core": { "data": [] } };
  // Handles quick sidebar chats
  var handleQuickSidebarChat = function () {
    // quick sidebar toggler
    $('.top-menu .dropdown-quick-sidebar-toggler a, .page-quick-sidebar-toggler').click(function (e) {
      $('body').toggleClass('page-quick-sidebar-open');
    });
    var wrapper = $('.page-quick-sidebar-wrapper');
    var wrapperChat = wrapper.find('.page-quick-sidebar-chat');

    var initChatSlimScroll = function () {
      var chatUsers = wrapper.find('.page-quick-sidebar-chat-users');
      var chatUsersHeight;

      chatUsersHeight = wrapper.height() - wrapper.find('.nav-justified > .nav-tabs').outerHeight();

      // chat user list 
      app.destroySlimScroll(chatUsers);
      chatUsers.attr("data-height", chatUsersHeight);
      app.initSlimScroll(chatUsers);

      var chatMessages = wrapperChat.find('.page-quick-sidebar-chat-user-messages');
      var chatMessagesHeight = chatUsersHeight - wrapperChat.find('.page-quick-sidebar-chat-user-form').outerHeight() - wrapperChat.find('.page-quick-sidebar-nav').outerHeight();

      // user chat messages 
      app.destroySlimScroll(chatMessages);
      chatMessages.attr("data-height", chatMessagesHeight);
      app.initSlimScroll(chatMessages);
    };

    initChatSlimScroll();
    app.addResizeHandler(initChatSlimScroll); // reinitialize on window resize

    // 返回按钮
    wrapper.find('.page-quick-sidebar-chat-user .page-quick-sidebar-back-to-list').click(function () {
      wrapperChat.removeClass("page-quick-sidebar-content-item-shown");
    });

    var handleChatMessagePost = function (e) {
      e.preventDefault();

      var chatContainer = wrapperChat.find(".page-quick-sidebar-chat-user-messages");
      var input = wrapperChat.find('.page-quick-sidebar-chat-user-form .form-control');

      var text = input.val();
      if (text.length === 0) {
        return;
      }

      var preparePost = function (dir, time, name, avatar, message) {
        var tpl = '';
        tpl += '<div class="post ' + dir + '">';
        tpl += '<img class="avatar" alt="" src="' + App.LayoutImgPath + avatar + '.jpg"/>';
        tpl += '<div class="message">';
        tpl += '<span class="arrow"></span>';
        tpl += '<a href="#" class="name">Bob Nilson</a>&nbsp;';
        tpl += '<span class="datetime">' + time + '</span>';
        tpl += '<span class="body">';
        tpl += message;
        tpl += '</span>';
        tpl += '</div>';
        tpl += '</div>';

        return tpl;
      };

      // handle post
      var time = new Date();
      var message = preparePost('out', (time.getHours() + ':' + time.getMinutes()), "Bob Nilson", 'avatar3', text);
      message = $(message);
      chatContainer.append(message);

      var getLastPostPos = function () {
        var height = 0;
        chatContainer.find(".post").each(function () {
          height = height + $(this).outerHeight();
        });

        return height;
      };

      chatContainer.slimScroll({
        scrollTo: getLastPostPos()
      });

      input.val("");

      // simulate reply
      setTimeout(function () {
        var time = new Date();
        var message = preparePost('in', (time.getHours() + ':' + time.getMinutes()), "Ella Wong", 'avatar2', 'Lorem ipsum doloriam nibh...');
        message = $(message);
        chatContainer.append(message);

        chatContainer.slimScroll({
          scrollTo: getLastPostPos()
        });
      }, 3000);
    };

    wrapperChat.find('.page-quick-sidebar-chat-user-form .btn').click(handleChatMessagePost);
    wrapperChat.find('.page-quick-sidebar-chat-user-form .form-control').keypress(function (e) {
      if (e.which == 13) {
        handleChatMessagePost(e);
        return false;
      }
    });
  };

  var refreshTreeview = function () {
    var height = App.ViewPort.height;
    var footer_height = $(".page-footer").height();
    var header_height = $(".page-header").height();
    var title_height = 50;
    var treeview_height = height - footer_height - header_height - 18 - title_height;
    $("#treeview_group").attr("data-height", treeview_height + "px");

    App.initSlimScroll("#treeview_group");
    $("#treeview_group").jstree($.extend(defaults, group_option));
  }
  // 初始化车辆列表目录结构
  var init_car_list = function () {
    var container = $(".page-quick-sidebar-chat-users");
    $.each(talkoptions, function (index, item) {
      container.append($("<h3/>").addClass("list-heading").text(item.text));
      container.append($("<ul/>").addClass("media-list list-items").attr("id", const_group_id + item.id));
    });
  };

  var geoEncoding = function (lon, lat, callback) {
    // 创建地理编码实例      
    var myGeo = new BMap.Geocoder();
    // 根据坐标得到地址描述    
    myGeo.getLocation(new BMap.Point(lon, lat), function (result) {
      if (callback) {
        callback(result);
      }
    });
  }
  var doLocation = function () {
    var body = $(this).parent();
    var lon = body.attr("data-lon");
    var lat = body.attr("data-lat");
    App.map.centerAndZoom(lon, lat, 14);
  }
  var doTalk = function () {
    var wrapper = $('.page-quick-sidebar-wrapper');
    var wrapperChat = wrapper.find('.page-quick-sidebar-chat');
    wrapperChat.addClass("page-quick-sidebar-content-item-shown");
  }

  var add_car = function (group, options) {
    $("#" + options.id).remove();
    var container = $(".page-quick-sidebar-chat-users");
    var groupid = const_group_id + group;
    var groupcontainer = $("#" + groupid);
    var item = $("<li/>").addClass("media");
    item.attr("id", options.id);
    if (options.notify && options.notify.type) {
      var itemstatus = $("<div/>").addClass("media-status");

      var status = $("<span/>").html(options.notify.value);
      if (options.notify.type == "label") {
        status.addClass("label label-sm label-" + options.notify.state);
      } else if (options.notify.type == "badge") {
        status.addClass("badge badge-" + options.notify.state);
      }

      itemstatus.append(status);
      item.append(itemstatus);
    }

    if (options.icon) {
      var iconimg = $("<img/>")
        .addClass("media-object")
        .attr("src", options.icon)
        .attr("alt", "...");
      item.append(iconimg);
    }

    var itembody = $("<div/>").addClass("media-body");
    itembody.attr("data-lon", options.tag.lon);
    itembody.attr("data-lat", options.tag.lat);
    if (options.tag.alarmStatus != "无") {
      itembody.append($("<h4/>").addClass("media-heading").html(options.caption + " " + options.tag.alarmStatus));
    } else {
      itembody.append($("<h4/>").addClass("media-heading").html(options.caption));
    }

    var itemheadingsub = $("<div/>").addClass("media-heading-sub");
    itembody.append(itemheadingsub);

    item.append(itembody);
    groupcontainer.append(item);

    itemheadingsub.html("正在请求位置描述...");
    $("#div_addr_" + options.id).html("正在请求位置描述...");
    geoEncoding(options.tag.lon, options.tag.lat, function (result) {
      if (result) {
        itemheadingsub.html(result.address);
        $("#div_addr_" + options.id).html(result.address);
      } else {
        itemheadingsub.html("请求失败,正在重试...");
        $("#div_addr_" + options.id).html("请求失败,正在重试...");
      }
    });

    if (options.actions == undefined) {
      return;
    }

    $.each(options.actions, function (index, item) {
      var button = $("<a/>").addClass("btn btn-icon-only btn-circle");
      if (item == "info") {
        button.addClass("blue");
        button.append($("<i/>").addClass("icon-info"));
      } else if (item == "talk") {
        button.addClass("red");
        button.append($("<i/>").addClass("icon-bubbles"));
        button.on("click", doTalk);
      } else if (item == "route") {
        button.addClass("green");
        button.on("click", function () {
          App.plugins.monitors.routereplay.show(options.tag);
        });
        button.append($("<i/>").addClass("icon-share"));
      }
      else if (item == "location") {
        button.addClass("yellow");
        button.on("click", doLocation);
        button.append($("<i/>").addClass("icon-pointer"));
      }
      itembody.append(button);
    });
  }

  var refreshList = function (points) {
    $.each(points, function (index, point) {
      // 处理报警信息
      if (point.alarmStatus != "无") {
        App.notify.add(point.text + " " + point.alarmStatus, "刚刚", "label-warning", "icon-bell");
      }
      // 添加车辆
      var options = {
        "caption": point.text
        , "id": point.sim
        , "icon": point.iconpath + "360.png"
        , "actions": ["talk", "info", "route", "location"]
        //, "notify": {
        //  "type": "badge"
        //  , "state": "success"
        //  , "value": "8"
        //}
        , "tag": point
      };
      add_car(point.state, options);
    });
  }
  // 装饰兴趣点：设置属性等
  var decoratePoint = function (point) {
    var _object = car_array[point.sim];
    if (point.cLon && point.cLat) {
      _object.lon = point.cLon;
      _object.lat = point.cLat;
    } else if (point.clon && point.clat) {
      _object.lon = point.clon;
      _object.lat = point.clat;
    }

    var bdpoint = App.util.gcj02tobd(_object.lon, _object.lat);

    if (bdpoint.Lon && bdpoint.Lat) {
      _object.lon = bdpoint.Lon;
      _object.lat = bdpoint.Lat;
    } else {
      _object.lon = 0;
      _object.lat = 0;
    }

    _object.time = App.util.utcTostring(point.builtTime, "yyyy年MM月dd日 HH时mm分ss秒");
    _object.speed = point.speed; // 速度
    _object.mileage = point.mileage; // 里程
    _object.dir = point.dir;  // 车头方向
    // 位置信息
    // 业务逻辑： 如果最后更新时间超过300秒视为离线
    if (new Date().getTime() / 1000 - point.builtTime > 300) {
      _object.iconpath = "assets/img/car_offline/";
      _object.carStatus = "离线";
      _object.state = "offline";
      _object.color = "#818181";
    } else if (point.speed > 0) {
      _object.iconpath = "assets/img/car_normal/";
      _object.carStatus = "行驶在线";
      _object.state = "running";
      _object.color = "#128945";
    } else {
      _object.iconpath = "assets/img/car_stop/";
      _object.carStatus = "行驶停止";
      _object.state = "stoped";
      _object.color = "#10a3e7";
    }

    // 消息信息
    if (point.type == "R") {
      //告警信息
      _object.iconpath = "assets/img/car_alarm/";
      _object.carStatus += "、告警";
      _object.color = "#f40129";
      switch (point.rName) {
        case "SPEED":
          _object.alarmStatus = "速度异常告警";
          break;
        case "REGION":
          _object.alarmStatus = "区域告警";
          break;
        case "DOOR_OPEN":
          _object.alarmStatus = "非法开门告警";
          break;
        case "EMERGENCY":
          _object.alarmStatus = "紧急告警";
          break;
        case "OIL_BOX_OPEN":
          _object.alarmStatus = "油箱开盖告警";
          break;
        case "MAIN_POWER_FAILURE":
          _object.alarmStatus = "主电源断电告警";
          break;
        default:
          _object.alarmStatus = point.rName;
          break;
      }
    } else {
      _object.alarmStatus = "无";
    }
    car_array[point.sim] = _object;
    return _object;
  }
  // 请求车辆列表:初始化缓存列表car_sids、car_array
  var getCarList = function (docallback) {
    car_sids = [];
    car_array = {};
    var enumchild = function (parent, item) {
      parent.children = [];
      if (item.groupS && item.groupS.length > 0) {
        $.each(item.groupS, function (index, object) {
          var childgroup = {
            "text": App.base64.decode(object.groupName)
            , "state": { "opened": true }
            , "children": []
            , "id": object.groupId
          };
          parent.children.push(childgroup);
          enumchild(childgroup, object);
        });
      }
      if (item.targetIdS && item.targetIdS.length > 0) {
        $.each(item.targetIdS, function (index, object) {
          car_sids.push(object.sid);
          car_array[object.sim] = {
            "text": App.base64.decode(object.tName)
            , "sim": object.sim
            , "t_type": object.t_type
            , "tId": object.tId
            , "tmnId": object.tmnId
            , "sid": object.sid
            , "icon": "fa fa-check icon-state-success"
          }
          parent.children.push(car_array[object.sim]);
        });
      }
    }
    var callback = function (json) {
      var groups = [];
      $.each(json.data, function (index, item) {
        var group = {
          "text": App.base64.decode(item.groupName)
          , "state": { "opened": true }
          , "children": []
          , "id": item.groupId
        };
        enumchild(group, item);
        groups.push(group);
      });

      group_option.core.data = groups;

      if (docallback) {
        docallback();
      }
    };
    App.ajax(bus_cfgs.carservice.targetlistapi, { "operId": App.account.oper_id }, callback);
  }
  // 请求车辆最后轨迹
  var getLastTrack = function () {
    var options = {
      "args": {
        "sids": car_sids.join(",")
      }
      , "block": false
    };
    var callback = function (json) {
      var carlist = [];
      $.each(json.data.plist, function (index, item) {
        carlist.push(decoratePoint(item));
      });
      refreshList(carlist);
      App.map.addPoints(carlist);
      refreshRealData();
    };
    App.ajax(bus_cfgs.carservice.lasttrackapi, options, callback);
  }
  // 请求订阅服务
  var requestSubscribe = function () {
    var strList = [];
    var size = 30;
    var strTemp = "";
    var index = 0;
    $.each(car_array, function (sim, object) {
      if (index < size * (strList.length + 1)) {
        if (strTemp != "") {
          strTemp += ",";
        }
        strTemp += object.tId;
      } else {
        strList.push(strTemp);
        strTemp = "";
      }

      index++;
    });

    if (strTemp != "") {
      strList.push(strTemp);
    }
    // 请求订阅服务回调函数
    var callback = function (json) {

    }
    // 批量请求订阅服务
    $.each(strList, function (index, item) {
      App.ajax(bus_cfgs.carservice.Subscribeapi, { "tid": item }, callback);
    });
  }

  var realdata_callback = function (json) {
    if (json.data.plist && json.data.plist.length > 0) {
      var carlist = [];
      $.each(json.data.plist, function (index, item) {
        carlist.push(decoratePoint(item));
      });
      refreshList(carlist);
      App.map.refreshPoints(carlist);
    }
    setTimeout(refreshRealData, bus_cfgs.options.request.monitor);
  };
  
  // 刷新实时数据
  var refreshRealData = function () {
    App.ajax(bus_cfgs.carservice.realtrackapi, { "block": false, "args": {} }, realdata_callback);
  }

  app.services.car = {
    "init": function () {
      getCarList(function () {
        handleQuickSidebarChat();
        requestSubscribe();
        refreshTreeview();
        init_car_list();
        getLastTrack();
      });
    }
    /* 关闭车辆列表 */
    , "close": function () {
      $("body").removeClass("page-quick-sidebar-open");
    }
    , "AddCar": function (group, options) {
      add_car(group, options);
    }
    , "fill": function (target) {
      target.jstree($.extend(defaults, group_option));
    }
  };
})(App);
