define(
  [
    'core/core-modules/framework.form',
    'http://webapi.amap.com/maps?v=1.3&key=f0948ced2976d1bcc654eff99d796a32&plugin=AMap.Autocomplete',
    'http://cache.amap.com/lbs/static/addToolbar.js'
  ],
  function (form) {

    let module = {
      "define": {
        "name": "select-map"
      },
      // "init": function (column, data, events) {

      // },
      /** 处理 数据编辑 
       * @param {JSON} column 
       * @param {string} value 
       * @param {Element} labelContainer 
       * @param {Element} valueContainer 
       * @param {JSON} sourceData 
       */
      "editor": function (column, value, labelContainer, valueContainer, sourceData) {
        var placeSearch;

        var showMapContainer = function () {
          var marker, map = new AMap.Map('map-main', { "resizeEnable": true });

          // #region 初始化数据
          if (eventArgs) {
            if (eventArgs.lng && eventArgs.lat) {
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
          // #endregion // #region 初始化数据

          // #region 为地图注册click事件获取鼠标点击出的经纬度坐标
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
          var autocomplate = new AMap.Autocomplete({ input: "map-input" });
          AMap.event.addListener(autocomplate, "select", function (e) {
            placeSearch.setCity(e.poi.adcode);
            placeSearch.search(e.poi.name);  //关键字查询查询
          });
          // #endregion // #region 为地图注册click事件获取鼠标点击出的经纬度坐标

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

            var searchText;
            if (column.locationcolumn) {
              searchText = $('#' + column.locationcolumn).val();
            } else {
              searchText = $('#location').val();
            }
            if (searchText) {
              $('#map-input').val(searchText);
              if (autocomplate) {
                autocomplate.search(searchText);
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
            var validator = $(".core-form").data("bootstrapValidator");
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

        if (sourceData) {

          if (column.lngcolumn && column.latcolumn) {
            eventArgs = { "lng": sourceData[column.lngcolumn], "lat": sourceData[column.latcolumn] };
          } else {
            eventArgs = { "lng": sourceData.lng, "lat": sourceData.lat };
          }

          if (eventArgs.lng && eventArgs.lat) {
            $("#" + column.name).val(eventArgs.lng + "," + eventArgs.lat);
          }
        }

        $('.ajax-content').append($("<div/>").attr("id", "map-container"));
        $("#map-container").load("views/templates/select-map/template.html", mapContainerInit);

      },
      "grid": (column, tr, value, totalindex, index) => {
        form.appendText(tr, 'type=“map” 尚未处理');
      },
    }, _events, eventArgs;

    module.destroy = function () {

    };

    module.get = function (data) {
      _events.get(data, eventArgs);
    };

    return module;
  });