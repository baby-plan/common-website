define(
  [
    'http://webapi.amap.com/maps?v=1.3&key=f0948ced2976d1bcc654eff99d796a32&plugin=AMap.Autocomplete',
    'http://cache.amap.com/lbs/static/addToolbar.js'
  ],
  function () {
    let module = {}, _events, eventArgs;
    module.init = function (column, data, events) {
      if (!events) {
        console.error("map-plugin 初始化失败：参数events未设置");
        return;
      } else if (!events.get || typeof events.get != 'function') {
        console.error("map-plugin 初始化失败：参数 get 异常");
        return;
      } else if (!events.set || typeof events.set != 'function') {
        console.error("map-plugin 初始化失败：参数 set 异常");
        return;
      }
      _events = events;
      var placeSearch;

      $('#ajax-content').append(
        $("<div/>").attr("id", "map-container") //.load("map/template.html")
      );

      var showMapContainer = function () {
        var marker, map = new AMap.Map('map-main', {
          resizeEnable: true,
        });

        if (eventArgs) {
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

        }

        //为地图注册click事件获取鼠标点击出的经纬度坐标
        map.on('click', function (e) {
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
        });

        $(".map-search").on("click", function () {
          var text = $('#map-input').val();
          //关键字查询
          if (placeSearch) {
            placeSearch.search(text);
          }
        });

        //注册监听，当选中某条记录时会触发
        AMap.event.addListener(new AMap.Autocomplete({ input: "map-input" }), "select", function (e) {
          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name);  //关键字查询查询
        });

        AMap.service(["AMap.PlaceSearch"], function () {
          placeSearch = new AMap.PlaceSearch({ //构造地点查询类
            pageSize: 5,
            pageIndex: 1,
            map: map,
            panel: 'map-input-panel'
          });

          var searchClick = function (e) {
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

          AMap.event.addListener(placeSearch, "markerClick", searchClick);
          AMap.event.addListener(placeSearch, "listElementClick", searchClick);

          if (events.init && typeof events.init === 'function') {
            var initValue = events.init();
            if (initValue) {
              $('#map-input').val(initValue);
              if (placeSearch) {
                placeSearch.search(initValue);
              }
            }
          }
        });

      }

      var mapContainerInit = function () {

        $("#map-container .modal-dialog").width($(window).width() - 50);
        $("#map-container .modal-body").height($(window).height() - 220);
        // 地图容器中的确定按钮点击事件处理函数
        $("#map #btn-ok").on('click', function () {
          if (!eventArgs || !eventArgs.lng || !eventArgs.lat) {
            return;
          }
          $("#" + column.name).val(eventArgs.lng + "," + eventArgs.lat);
          var validator = $("#role-form").data("bootstrapValidator");
          if (validator) {
            validator.updateStatus(column.name, "NOT_VALIDATED", null).validateField(column.name);
          }
          $('#map').modal('hide');
        });

        $('#' + column.name).parent()
          .on('click', function () {
            $('.amap-sug-result').remove();
            $('#map').modal({ keyboard: false });
            //添加延时加载。解决问题
            setTimeout(showMapContainer, 300);
          });
      };

      if (data) {
        eventArgs = events.set(data);
        if (eventArgs && eventArgs.lng && eventArgs.lat) {
          $("#" + column.name).val(eventArgs.lng + "," + eventArgs.lat);
        }
      }

      $("#map-container").load("assets/scripts/generator-plugins/map/template.html", mapContainerInit);
    }

    module.destroy = function () {

    };

    module.get = function (data) {
      _events.get(data, eventArgs);
    };

    return module;
  });