/* ========================================================================
 * App.map version 1.0
 * 百度地图操作插件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * 
 * ======================================================================== */
(function (app) {
  // 地图初始化参数
  var options = {
    "map": {
      "center": {
        "lon": 118.796458,
        "lat": 32.0649,
      }
    }
  };

  var map = null;
  //全局变量是否调用过createMarkerClusterer
  var clusterFlag = false;

  //根据传入的角度整数确定[角度图片],[车牌图标],[车牌图标文字]偏移量
  var getOffsetAndAngleIcon = function (angle) {
    var degree = parseInt(angle);
    if ((degree >= 338 && degree <= 360) || (degree >= 0 && degree < 23)) {
      //车牌图标在车辆图标下方
      return { angleIcon: "360.png", dir: "up", pixelX: -13, pixelY: 43 };
    } else if (degree >= 23 && degree < 68) {
      //车牌图标在车辆图标下方
      return { angleIcon: "45.png", dir: "up", pixelX: -23, pixelY: 39 };
    } else if (degree >= 68 && degree < 113) {
      //车牌图标在车辆图标下方
      return { angleIcon: "90.png", dir: "up", pixelX: -23, pixelY: 31 };
    } else if (degree >= 113 && degree < 158) {
      //车牌图标在车辆图标上方
      return { angleIcon: "135.png", dir: "down", pixelX: -63, pixelY: -33 };;
    } else if (degree >= 158 && degree < 203) {
      //车牌图标在车辆图标上方
      return { angleIcon: "180.png", dir: "down", pixelX: -55, pixelY: -33 };
    } else if (degree >= 203 && degree < 248) {
      //车牌图标在车辆图标上方
      return { angleIcon: "225.png", dir: "down", pixelX: -47, pixelY: -31 };
    } else if (degree >= 248 && degree < 293) {
      //车牌图标在车辆图标上方
      return { angleIcon: "270.png", dir: "down", pixelX: -47, pixelY: -23 };
    } else if (degree >= 293 && degree < 338) {
      //车牌图标在车辆图标下方
      return { angleIcon: "315.png", dir: "up", pixelX: -5, pixelY: 41 };
    } else {
      //车牌图标在车辆图标下方
      return { angleIcon: "360.png", dir: "up", pixelX: -13, pixelY: 43 };
    }
  }

  var buildCarPopup = function (point) {
    var titleHtml = "<div style='line-height:1.8em;'>";
    titleHtml += "<div style='font-size:15px;margin-top:5px;margin-left:5px;float:left;'><b>" + point.text + "</b></div>";
    titleHtml += "<div style='position: relative;top: 5%;float:right;margin-right:20px;'>";
    titleHtml += "<image src='assets/img/cars/info.png' style='margin:5px;cursor:hand;'  title='车辆信息' onclick='App.map.feedback(\"DetailInfo\",\"" + point.id + "\")'/>";
    titleHtml += "<image src='assets/img/cars/replay.png' style='margin:5px;cursor:hand;' title='轨迹回放' onclick='App.map.feedback(\"RouteReplay\",\"" + point.sid + "|" + point.text + "|" + point.sim + "\")'/>";
    titleHtml += "<image src='assets/img/cars/panorama.png' style='margin:5px;cursor:hand;' title='全景' onclick='App.map.feedback(\"Panorama\",\"" + point.lon + "," + point.lat + "|" + point.angle + "\")'/>";
    titleHtml += "</div>";
    titleHtml += "</div>";
    var event = {
      "data": point
      , "open": function (poi, poi_data, form) {
        var contentHtml = "<div style='width:370px;background-color:#fff;font-size:12px;'>";
        contentHtml += "<div style='height:20px;margin-top:5px;color:skyblue;width:60px;float:left;'>GPS时间:</div>";
        contentHtml += "<div style='height:20px;margin-top:5px;color:#333;width:180px;float:left;'>" + poi_data.time + "</div>";
        contentHtml += "<div style='height:20px;margin-top:5px;color:skyblue;width:40px;float:left;'>速度:</div>";
        contentHtml += "<div style='height:20px;margin-top:5px;color:#333;width:90px;float:left;'>" + poi_data.speed + "</div>";
        contentHtml += "<div style='height:20px;margin-top:5px;color:skyblue;width:60px;float:left;'>车辆状态:</div>";
        contentHtml += "<div style='height:20px;margin-top:5px;color:#333;width:180px;float:left;'>" + poi_data.carStatus + "</div>";
        contentHtml += "<div style='height:20px;margin-top:5px;color:skyblue;width:40px;float:left;'>经度:</div>";
        contentHtml += "<div style='height:20px;margin-top:5px;color:#333;width:90px;float:left;'>" + poi_data.lon.toFixed(2) + "</div>";
        contentHtml += "<div style='height:20px;margin-top:5px;color:skyblue;width:60px;float:left;'>报警信息:</div>";

        contentHtml += "<div style='height:20px;margin-top:5px;color:#333;width:180px;float:left;'>" + poi_data.alarmStatus + "</div>";
        contentHtml += "<div style='height:20px;margin-top:5px;color:skyblue;width:40px;float:left;'>纬度:</div>";
        contentHtml += "<div style='height:20px;margin-top:5px;color:#333;width:90px;float:left;'>" + poi_data.lat.toFixed(2) + "</div>";
        contentHtml += "<div style='height:20px;margin-top:5px;color:skyblue;width:60px;float:left;'>地址:</div>";
        var addr = $("#" + poi_data.sim + " .media-heading-sub").html();
        contentHtml += "<div id='div_addr_" + poi_data.sim + "' style='height:40px;margin-top:5px;color:#333;width:290px;float:left;'>" + addr + "</div>";
        contentHtml += "</div>";
        form.setContent(contentHtml);
      }
    }
    return new cwt.Popup(new cwt.Size(380, 0), null, "", "#ffffff", "0.8", "#000000", "1", true, titleHtml, event);
  }

  var buildPOI = function (point) {
    var angel = getOffsetAndAngleIcon(point.dir);
    var icon = new cwt.Icon(point.iconpath + angel.angleIcon, new cwt.Size(58, 61), null, 60);
    //车牌
    var caption = new cwt.Caption(point.text);
    // 当报警信息不为空时,设置当前车辆状态为报警.
    if (point.alarmStatus != "无") {
      point.state = "alarm";
    }
    caption.setOptions({ "color": point.color, "dir": angel.dir, "state": point.state });
    var popup = buildCarPopup(point);
    var lonlat = new cwt.LonLat(parseFloat(point.lon), parseFloat(point.lat));
    return new cwt.POI(point.sim, lonlat, icon, caption, popup);
  }

  //批量删除点 实时信息使用
  var removePoints = function (lisz) {
    var ll = eval(lisz);
    var relist = [];
    for (var i = 0, l = ll.length; i < l; i++) {
      var v = ll[i];
      relist.push(v);
      map.removeClusterMarker(v);
    }

    if (creatCluFlag) {
      map.removeClusterMarkers(relist);
    }
  }


  var initMap = function (map) {


    var stCtrl = new BMap.PanoramaControl(); //构造全景控件
    stCtrl.setOffset(new BMap.Size(20, 20));
    map.addControl(stCtrl);//添加全景控件

    // var mapType1 = new BMap.MapTypeControl({ mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP] });
    var mapType2 = new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_LEFT,mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]  });

    var overView = new BMap.OverviewMapControl();
    var overViewOpen = new BMap.OverviewMapControl({ isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT });

    // map.addControl(mapType1);          //2D图，卫星图
    map.addControl(mapType2);          //左上角，默认地图控件
    map.setCurrentCity("北京");        //由于有3D图，需要设置城市哦
    map.addControl(overView);          //添加默认缩略地图控件
    map.addControl(overViewOpen);      //右下角，打开

  }
  app.map = {
    "init": function (target) {
      map = new cwt.BaiduMap(document.getElementById(target), {
        mapCenter: new cwt.LonLat(options.map.center.lon, options.map.center.lat),
        zoomLevel: 12, //缩放级别
        mapType: 0, //地图类型：0普通地图，1卫星图，2卫星和路网的混合视图
        plugins: ["draw", "tool", "cluster"]
      });
      map.enableWheelZoom(); //允许鼠标滚轮缩放
      initMap(map.map);
      App.services.car.init();
    }
    , "feedback": function (key, options) {
      switch (key) {
        case "RouteReplay": {
          var _datas = options.split("|");
          App.plugins.monitors.routereplay.show({ "sid": _datas[0], "sim": _datas[2], "text": _datas[1] });
          break;
        }
        default: {
          App.logger.debug(key);
          break;
        }
      }
    }
    //批量画点 实时信息使用
    , "addPoints": function (points) {
      var cluslist = [];
      for (var i = 0; i < points.length; i++) {
        var point = points[i];
        var poi = buildPOI(point);
        cluslist.push(poi);
      }
      if (clusterFlag) {
        map.clearClusterMarkers();
      }
      var options = {
        "maxZoom": 11,
        "clickCallback": function (poi) {
          // htgl.callback( 'TargetClick', poi.id );
        },
        //该方法将被聚合类调用，用于构建一个信息窗口
        "clusterPopupMaker": function (cluslist) {
          var content = "此聚合点包含：<br>";
          for (var i = 0; i < cluslist.length; i++) {
            content += "<div style='float:left;color:#333;'>"
            content += cluslist[i].caption.content + "&nbsp;</div>";
          }
          return new cwt.Popup(null, null, content, "#ffffff", "0.8", "#000000", "1", true);
        }
        , "styles": [{
          url: 'assets/img/clusterer/m0.png',
          size: new BMap.Size(53, 52),
          textColor: '#ffffff',
          textSize: 10
        }, {
          url: 'assets/img/clusterer/m1.png',
          size: new BMap.Size(56, 55),
          textColor: '#ffffff',
          textSize: 12
        }, {
          url: 'assets/img/clusterer/m2.png',
          size: new BMap.Size(66, 65),
          textColor: '#ffffff',
          textSize: 14
        }, {
          url: 'assets/img/clusterer/m3.png',
          size: new BMap.Size(78, 77),
          textColor: '#ffffff',
          textSize: 16
        }]
      };
      map.createMarkerClusterer(cluslist, options);
      clusterFlag = true;
    }
    // 批量画点：刷新地图点位
    , "refreshPoints": function (points) {
      var cluslist = [];
      for (var i = 0; i < points.length; i++) {
        var point = points[i];
        var poi = buildPOI(point);
        cluslist.push(poi);
      }
      map.refreshMarkerClusterer(cluslist);
    }
    , "centerAndZoom": function (lon, lat) {
      map.centerAndZoom({ "lon": lon, "lat": lat });
    }
    // 路书
    , "drawLineGPS": function (points) {
      map.customLushu(points);
    }
  };
})(App);