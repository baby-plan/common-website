define(["QDP",
  'http://webapi.amap.com/maps?v=1.3&key=f0948ced2976d1bcc654eff99d796a32&plugin=AMap.Autocomplete',
  'http://cache.amap.com/lbs/static/addToolbar.js'
], function (QDP) {

  var placeSearch, eventArgs, marker, map;

  /** 地图点击事件处理函数
   * @param {JSON} e 
   */
  var onMapClick = function (e) {

    if (marker) {
      marker.setMap(null);
      marker = null;
    }

    if (placeSearch) {
      placeSearch.clear();
    }

    marker = new AMap.Marker({
      icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
      position: [e.lnglat.getLng(), e.lnglat.getLat()]
    });

    marker.setMap(map);

    eventArgs = {
      lng: e.lnglat.getLng(),
      lat: e.lnglat.getLat()
    };

    $('#btn-ok').attr('class', 'btn btn-success').attr('disabled', false);
  };

  /** 查询按钮点击事件处理函数 */
  var onSearch = function () {
    var text = $('#map-input').val();
    //关键字查询
    if (placeSearch) {
      placeSearch.search(text);
    }
  }

  /** 查询结果点击事件处理函数 */
  var onItemClick = function (e) {
    if (marker) {
      marker.setMap(null);
      marker = null;
    }
    if (e.data && e.data.location) {
      map.setZoom(15);
      map.setCenter(e.data.location);
      eventArgs = {
        lng: e.data.location.lng,
        lat: e.data.location.lat
      };
      $('#btn-ok').attr('class', 'btn btn-success').attr('disabled', false);
    }
  }

  /** 对话框确定按钮点击事件处理函数 */
  var onSubmitClick = function () {
    module.close();
    //EVENT-RAISE:map.submit 对话框确定按钮点击事件
    QDP.raise("map.submit", { "lng": eventArgs.lng, "lat": eventArgs.lat });
  }

  var showMapContainer = function () {
    if (map) { return; }

    map = new AMap.Map('map-main', {
      resizeEnable: true,
    });

    if (eventArgs && eventArgs.lng && eventArgs.lat) {
      marker = new AMap.Marker({
        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
        position: [eventArgs.lng, eventArgs.lat]
      });
      marker.setMap(map);
      map.setZoomAndCenter(15, [eventArgs.lng, eventArgs.lat]);
      $('#btn-ok').attr('class', 'btn btn-success').attr('disabled', false);
    } else {
      $('#btn-ok').attr('class', 'btn btn-default').attr('disabled', true);
    }

    //为地图注册click事件获取鼠标点击出的经纬度坐标
    map.on('click', onMapClick);

    $(".map-search").on("click", onSearch);

    AMap.service(["AMap.PlaceSearch"], function () {
      placeSearch = new AMap.PlaceSearch({ //构造地点查询类
        pageSize: 5,
        pageIndex: 1,
        map: map,
        panel: 'map-input-panel'
      });

      AMap.event.addListener(placeSearch, "markerClick", onItemClick);
      AMap.event.addListener(placeSearch, "listElementClick", onItemClick);

      // var mch_addr = $("#store_addr").val();
      // if (mch_addr) {
      //   $('#map-input').val(mch_addr);
      //   if (placeSearch) {
      //     placeSearch.search(mch_addr);
      //   }
      // }
    });

    //EVENT-RAISE:map.initialized 地图加载完成事件
    QDP.raise("map.initialized", {});

  }

  var module = {
    "init": function () {
      $("#map-container .modal-dialog").width($(window).width() - 50);
      $("#map-container .modal-body").height($(window).height() - 220);
      // 地图容器中的确定按钮点击事件处理函数
      $("#map #btn-ok").on('click', onSubmitClick);
    },
    /** 打开地图选点对话框
     * @returns */
    "show": function () {
      $('.amap-sug-result').remove();
      $('#map').modal({ keyboard: false });
      //添加延时加载。解决问题
      setTimeout(showMapContainer, 300);
    },
    /** 关闭地图选点对话框
     * @returns */
    "close": function () {
      $('#map').modal('hide');
    },
    /** 输入关键字在地图中查询POI
     * @param {string} text 查询的关键字
     * @returns
     */
    "search": function (text) {
      if (text) {
        $('#map-input').val(text);
        if (placeSearch) {
          placeSearch.search(text);
        }
      }
    }
  }

  return module;

});