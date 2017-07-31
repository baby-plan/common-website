/* ========================================================================
* App.modules.map v1.0
* 0101.高德地图
* ========================================================================
* Copyright 2016-2026 WangXin nvlbs,Inc.
* ======================================================================== */
(function (app) {
  if (!app.modules.map) {
    app.modules.map = {};
  }

  var resizeMap = () => {
    var breadcrumbHeight = $(".content-header").outerHeight();
    var headerHeight = $("header").outerHeight();
    var windowHeight = $(window).outerHeight();
    var footerHeader = $("footer").outerHeight();
    var contentHeight = windowHeight - headerHeight - footerHeader;
    $("#out-content").next().hide();
    $("#out-content").append($("<div id='main-map'/>"));
    $("#main-map").height(contentHeight);
  };

  var google_domain = 'http://mt0.google.cn/vt/lyrs=';
  // var google_domain = 'http://mt1.google.cn/vt/lyrs=';
  // var google_domain = 'http://mt2.google.cn/vt/lyrs=';
  // var google_domain = 'http://mt3.google.cn/vt/lyrs=';

  // m：路线图  
  // t：地形图  
  // p：带标签的地形图  
  // s：卫星图  
  // y：带标签的卫星图  
  // h：标签层（路名、地名等）
  var map_type = 's';
  var map_code = "110";
  var map_language = 'zh-CN';
  var map_gl = 'cn';

  var google = google_domain + map_type + '@' + map_code + '&hl=' + map_language + '&gl=' + map_gl;
  // var google = 'http://mt2.google.cn/vt/lyrs=s@110&hl=zh-CN&gl=cn';
  // 地图：http://mt2.google.cn/vt/lyrs=m@177000000&hl=zh-CN&gl=cn
  // 影像底图：http://mt3.google.cn/vt/lyrs=s@110&hl=zh-CN&gl=cn
  // 影像底图：http://mt2.google.cn/vt/lyrs=s@727&hl=zh-CN&gl=cn

  // 初始化地图
  app.modules.map.initamap = function () {

    $(window).on('resize', resizeMap);

    resizeMap();

    AMapUI.loadUI(['control/BasicControl'], function (BasicControl) {
      var map;

      var replaceImg = () => {
        var zoom = map.getZoom();
        if (zoom < 14) {
          return;
        }
        $(".amap-satellite>img").each(function (index, item) {
          var src = item.src;

          if (src.indexOf('google') > -1) {

          } else {
            var i = src.indexOf('&x=');
            var args = src.substring(i);
            item.src = google + args;
          }
        });
      };

      var layerCtrl2 = new BasicControl.LayerSwitcher({
        // theme: 'dark',
        position: 'rt',
        //自定义基础图层
        baseLayers: [{
          id: 'tile',
          name: '栅格图层',
          layer: new AMap.TileLayer()
        }, {
          enable: true,
          id: 'satellite',
          name: '卫星图层',
          layer: new AMap.TileLayer.Satellite()
        }
        ],
        //自定义覆盖图层
        overlayLayers: [{
          enable: true,
          id: 'traffic',
          name: '交通路况',
          layer: new AMap.TileLayer.Traffic()
        }, {
          id: 'roadNet',
          name: '交通路网',
          layer: new AMap.TileLayer.RoadNet()
        }, {
          id: 'build',
          name: "3D建筑",
          layer: new AMap.Buildings()
        }, {
          id: 'ImageLayer',
          name: "ImageLayer",
          layer: new AMap.ImageLayer()
        }
          // , {
          //   id: 'indoor',
          //   name: '室内地图',
          //   layer: new AMap.IndoorMap({ alwaysShow: true })
          // }
        ]
      });

      // layerCtrl2.on('layerPropChanged', function (e) {

      //   if (e.layer.id == "satellite" && layer.props.enable) {
      //     setTimeout(replaceImg, 2000);
      //   }
      // });

      var map = new AMap.Map('main-map', {
        resizeEnable: true,
        layers: layerCtrl2.getEnabledLayers()
      });

      map.setCity("铁岭");
      map.addControl(layerCtrl2);

      map.on("dragging", replaceImg);
      map.on("moveend", function () {
        replaceImg();
        // 2秒后再次验证是否全部替换
        setTimeout(replaceImg, 2000);
      });

      // 比例尺
      map.plugin(["AMap.Scale"], function () {
        var scale = new AMap.Scale();
        map.addControl(scale);
      });
      // 工具栏
      map.plugin(["AMap.ToolBar"], function () {
        //加载工具条 
        var tool = new AMap.ToolBar();
        map.addControl(tool);
      });

    });

  };
  // 卸载地图
  app.modules.map.deinitamap = function () {

    $(window).off('resize', resizeMap);
    $("#out-content").empty();
    $("#out-content").next().show();
  }
})(App);