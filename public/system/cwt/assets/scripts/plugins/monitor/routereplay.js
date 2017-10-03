//轨迹回放插件
(function (app) {
  var currentCar; // 当前车辆
  var map, lushu, lushuline, lushuicon, lushudatas;
  var parentView; // 当前模式窗口
  var tracktime_buffer, lushu_points;
  //根据经纬极值计算绽放级别。  
  var getZoom = function (maxLng, minLng, maxLat, minLat) {
    var zoom = ["50", "100", "200", "500", "1000", "2000", "5000", "10000", "20000", "25000", "50000", "100000", "200000", "500000", "1000000", "2000000"]//级别18到3。  
    var pointA = new BMap.Point(maxLng, maxLat);  // 创建点坐标A  
    var pointB = new BMap.Point(minLng, minLat);  // 创建点坐标B  
    var distance = map.getDistance(pointA, pointB).toFixed(1);  //获取两点距离,保留小数点后两位  
    for (var i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
      if (zoom[i] - distance > 0) {
        return 18 - i + 5;//之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。  
      }
    };
  }
  //根据原始数据计算中心坐标和缩放级别，并为地图设置中心坐标和缩放级别。  
  var setZoom = function (points) {
    if (points.length > 0) {
      var maxLng = points[0].lng;
      var minLng = points[0].lng;
      var maxLat = points[0].lat;
      var minLat = points[0].lat;
      var res;
      for (var i = points.length - 1; i >= 0; i--) {
        res = points[i];
        if (!res.lng || !res.lat) { continue; }
        if (res.lng > maxLng) maxLng = res.lng;
        if (res.lng < minLng) minLng = res.lng;
        if (res.lat > maxLat) maxLat = res.lat;
        if (res.lat < minLat) minLat = res.lat;
      };
      var cenLng = (parseFloat(maxLng) + parseFloat(minLng)) / 2;
      var cenLat = (parseFloat(maxLat) + parseFloat(minLat)) / 2;
      var zoom = getZoom(maxLng, minLng, maxLat, minLat);
      map.centerAndZoom(new BMap.Point(cenLng, cenLat), zoom);
    } else {
      //没有坐标，显示全中国  
      map.centerAndZoom(new BMap.Point(103.388611, 35.563611), 5);
    }
  }
  var draw = function (points) {
    clearLushu();
    setZoom(points);
    lushuline = new BMap.Polyline(points);//创建折线
    map.addOverlay(lushuline);
    lushuicon = new BMap.Icon("assets/img/car_normal/90.png", new BMap.Size(58, 61));
    lushu = new BMapLib.LuShu(map, points, {
      defaultContent: "",
      autoView: true,
      icon: lushuicon,
      speed: 5000,
      enableRotation: true, //是否设置marker随着道路的走向进行旋转
      landmarkPois: []
    });

    startLushu();
  }
  var startLushu = function () {
    if (lushu) {
      lushu.start();
    }
  }
  var stopLushu = function () {
    if (lushu) {
      lushu.stop();
    }
  }
  var pauseLushu = function () {
    if (lushu) {
      lushu.pause();
    }
  }
  var clearLushu = function () {
    if (lushuline) {
      map.removeOverlay(lushuline);
    }
    if (lushuicon) {
      map.removeOverlay(lushuicon);
    }
    if (lushu) {
      lushu.stop();
    }
    lushu = null;
    lushuline = null;
    lushuicon = null;
    lushudatas = null;
  }
  var reset_click = function () {
    var date = moment().subtract("days", 1).format("YYYY-MM-DD HH:mm");
    $("#starttime", parentView).val(App.util.monthFirst());
    $("#stoptime", parentView).val(App.util.monthLast());
  };
  var trackplay_callback = function (json) {
    if (json.data && json.data.pList && json.data.pList.length > 0) {
      $.each(json.data.pList, function (index, item) {
        var bdpoint = App.util.gcj02tobd(item.lon, item.lat);
        lushu_points.push(new BMap.Point(parseFloat(bdpoint.Lon), parseFloat(bdpoint.Lat)));

        // var html = "里程：" + item.mileage + "<br />"
        //   + "时间：" + item.gTime + "<br />"
        //   + "速度：" + item.speed;
        // if (item.rType == "p") {
        //   html += "停车时长：" + App.base64.decode(item.parkingTime) + "<br />";
        // }
        lushucontent = App.base64.decode(item.tName);
        // lushudatas.push({
        //   "lng": parseFloat(bdpoint.Lon)
        //   , "lat": parseFloat(bdpoint.Lat)
        //   , "html": html
        //   , "pauseTime": 2
        // });
      });
    }
    doTrackPlay();
  }
  var doTrackPlay = function () {
    if (tracktime_buffer.length == 0) {
      if (lushu_points.length > 1) {
        draw(lushu_points);
      } else {

      }
      return;
    }
    var item = tracktime_buffer.shift();
    var options = {
      "startUtc": item.start_time,
      "endUtc": item.end_time,
      "sid": currentCar.sid,
      "timeInterval": 30
    }
    App.ajax(bus_cfgs.monitor.tarckPlayapi, options, trackplay_callback);
  }
  var tracktime_callback = function (json) {
    tracktime_buffer = new Array();
    if (json.data && json.data.pList && json.data.pList.length > 0) {
      lushu_points = new Array();
      $.each(json.data.pList, function (index, item) {
        tracktime_buffer.push(item);
      });
      doTrackPlay();
    }
  }
  var search_click = function () {
    //App.logger.debug( App.util.jsonToString( currentCar ) );
    var options = {};
    lushudatas = [];
    options.startTime = $("#starttime", parentView).val();
    options.endTime = $("#stoptime", parentView).val();
    // options.timeInterval = 30;
    options.sim = currentCar.sim;

    App.ajax(bus_cfgs.monitor.getTrackTimeapi, options, tracktime_callback);
  };
  var _initialize = function (parent) {
    parentView = $("#" + parent);

    setTimeout(function () {//添加延时加载。解决问题
      // 百度地图API功能
      map = new BMap.Map("allmap");    // 创建Map实例
      map.centerAndZoom(new BMap.Point(118.796458, 32.0649), 11);  // 初始化地图,设置中心点坐标和地图级别
      map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
     // map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
      map.enableScrollWheelZoom(false);     //开启鼠标滚轮缩放
    }, 300);

    $(".modal-title", parentView).append(" - " + currentCar.text);
    var contentHeight = $(".modal-body", parentView).height();
    var mapHeight = contentHeight - $(".modal-body .row", parentView).eq(0).height();
    $("#allmap").height(mapHeight);
    // 重置按钮
    $("#btn_reset", parentView).on("click", function () {
      reset_click();
    });
    // 查询按钮
    $("#btn_search", parentView).on("click", function () {
      search_click();
    });
    $("#btn_start", parentView).on("click", function () {
      startLushu();
    });
    $("#btn_pause", parentView).on("click", function () {
      pauseLushu();
    });
    $("#btn_stop", parentView).on("click", function () {
      stopLushu();
    });
    reset_click();
  }
  app.plugins.monitors.routereplay = {
    // 初始化轨迹回放功能
    "init": function (parent) { _initialize(parent); }
    // 打开轨迹回放界面
    , "show": function (carobject) {
      currentCar = carobject;
      App.dialog.load({ "url": "views/monitor/routereplay.html", "callback": _initialize });
    }
  };
})(App);
