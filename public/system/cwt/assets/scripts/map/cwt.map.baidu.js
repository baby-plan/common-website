cwt.BaiduMap = cwt.Class(cwt.Map, {
  "drawingManager": null,
  "rectZoom": null,
  "distanceTool": null,
  "markerClusterer": null,
  gpsConverterLoaded: false,
  overviewMap: null,
  scaleControl: null,
  zoomPanControl: null,
  mapCenter: null,
  _mapType: 0,
  lineHash: null,
  rectHash: null,
  circleHash: null,
  polygonHash: null,
  poiHash: null,
  datas: [],
  data: [],
  lushu: null,
  lushuClear: [],
  tote: 0,
  count: 0,
  num: 0,
  drawType: [],
  runType: [],
  luShuIcon: null,
  speed: 1500,
  clusterPOIHash: null,
  clusterMarkerHash: null,
  eventListeners: null,
  eventHash: null,
  drawOverlayArray: [],
  lastDrawOverlay: null,
  clearLastDrawingMode: false,
  panoramaLayer: null,
  panoramaCtrl: null,
  panorama: null,
  wheelZoomStatus: false,
  initialize: function (container, params) {
    this.map = null;
    cwt.Map.prototype.initialize.apply(this, arguments);
    var scope = this;
    this.lineHash = new cwt.Hash();
    this.rectHash = new cwt.Hash();
    this.circleHash = new cwt.Hash();
    this.polygonHash = new cwt.Hash();
    this.poiHash = new cwt.Hash();
    eventListeners = new Array();
    eventHash = new cwt.Hash();
    this.listenAllEvent();
    // 处理图层类型
    switch (params.mapType) {
      case 1:
        scope.map = new BMap.Map(container, {
          mapType: BMAP_SATELLITE_MAP
        });
        scope._mapType = 1
        break;
      case 2:
        scope.map = new BMap.Map(container, {
          mapType: BMAP_HYBRID_MAP
        });
        scope._mapType = 2
        break;
      case 0:
        scope.map = new BMap.Map(container);
        scope._mapType = 0
        break;
    }
    // 处理地图中心点
    var mapCenter = params.mapCenter;
    if (!mapCenter) {
      mapCenter = new cwt.LonLat(116.404, 39.915)
    }
    // 处理地图缩放级别
    var zoomLevel = params.zoomLevel;
    if (!zoomLevel) {
      zoomLevel = 14
    }
    var point = new BMap.Point(mapCenter.lon, mapCenter.lat);
    scope.map.centerAndZoom(point, zoomLevel);
    scope.map.setMapStyle({ style: "googlelite" });
    // 处理地图插件支持
    if (params.plugins) {
      for (var i = 0; i < params.plugins.length; i++) {
        switch (params.plugins[i]) {
          case "tool":
            scope.gpsConverterLoaded = true
            break;
          case "draw":
            var styleOptions = {
              strokeColor: "red",
              fillColor: "red",
              strokeWeight: 3,
              strokeOpacity: 0.8,
              fillOpacity: 0.6,
              strokeStyle: "solid"
            };
            scope.drawingManager = new BMapLib.DrawingManager(scope.map, {
              isOpen: false,
              enableDrawingTool: false,
              drawingToolOptions: {
                anchor: BMAP_ANCHOR_TOP_RIGHT,
                offset: new BMap.Size(5, 5),
                scale: 0.8
              },
              circleOptions: styleOptions,
              polylineOptions: styleOptions,
              polygonOptions: styleOptions,
              rectangleOptions: styleOptions
            });
            break;
        }
      }
    }

  },
  destroy: function () {
    cwt.Map.prototype.destroy.apply(this, arguments)
  },
  getMapType: function () {
    return "BaiduMap[" + this.map.getMapType().getName() + "]"
  },
  setMapType: function (mapType) {
    if (this._mapType == mapType) {
      return
    }
    if (mapType == 1) {
      this.map.setMapType(BMAP_SATELLITE_MAP);
      this._mapType = 1
    } else {
      if (mapType == 2) {
        this.map.setMapType(BMAP_HYBRID_MAP);
        this._mapType = 2
      } else {
        if (mapType == -1) {
          this._mapType = -1
        } else {
          this.map.setMapType(BMAP_NORMAL_MAP);
          this._mapType = 0
        }
      }
    }
  },
  getMapTypeDesc: function () {
    return "BaiduMap[" + this.map.getMapType().getTips() + "]"
  },
  setActionType: function (actionType) {
    actionType = parseInt(actionType);
    this.actionType = actionType;
    this.resetActionType(actionType);
    switch (this.actionType) {
      case cwt.Map.ACTION_TYPE_NONE:
        this.resetActionType(actionType);
        break;
      case cwt.Map.ACTION_TYPE_ZOOMIN:
        this.rectZoom = new BMapLib.RectangleZoom(this.map, {
          followText: "拖拽鼠标进行操作",
          zoomType: 1
        });
        this.rectZoom.open();
        break;
      case cwt.Map.ACTION_TYPE_ZOOMOUT:
        this.rectZoom = new BMapLib.RectangleZoom(this.map, {
          followText: "拖拽鼠标进行操作",
          zoomType: 0
        });
        this.rectZoom.open();
        break;
      case cwt.Map.ACTION_TYPE_PAN:
        this.map.enableDragging();
        break;
      case cwt.Map.ACTION_TYPE_MEASUREDIS:
        this.distanceTool = new BMapLib.DistanceTool(this.map);
        this.distanceTool.open()
        break;
      case cwt.Map.ACTION_TYPE_MEASURE_AREA:
        if (this.drawingManager) {
          this.drawingManager.enableCalculate()
        }
        break;
      case cwt.Map.ACTION_TYPE_POINT:
        if (this.drawingManager) {
          this.drawingManager.open();
          this.drawingManager.setDrawingMode(BMAP_DRAWING_MARKER)
        }
        break;
      case cwt.Map.ACTION_TYPE_RECT:
        if (this.drawingManager) {
          this.drawingManager.open();
          this.drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE)
        }
        break;
      case cwt.Map.ACTION_TYPE_ROUND:
        if (this.drawingManager) {
          this.drawingManager.open();
          this.drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE)
        }
        break;
      case cwt.Map.ACTION_TYPE_POLYLINE:
        if (this.drawingManager) {
          this.drawingManager.open();
          this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYLINE)
        }
        break;
      case cwt.Map.ACTION_TYPE_POLYGON:
        if (this.drawingManager) {
          this.drawingManager.open();
          this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON)
        }
        break
    }
  },
  resetActionType: function (currentActionType) {
    if (currentActionType != cwt.Map.ACTION_TYPE_MEASURE_AREA && currentActionType != cwt.Map.ACTION_TYPE_RECT && currentActionType != cwt.Map.ACTION_TYPE_ROUND && currentActionType != cwt.Map.ACTION_TYPE_POLYLINE && currentActionType != cwt.Map.ACTION_TYPE_POLYGON) {
      if (this.drawingManager) {
        this.drawingManager.disableCalculate();
        this.drawingManager.close()
      }
    }
    if (this.rectZoom) {
      this.rectZoom.close()
    }
    if (this.distanceTool) {
      this.distanceTool.close()
    }
  },
  getActionType: function () {
    return this.actionType
  },
  addOverviewMap: function (left, top, position) {
    if (!this.overviewMap) {
      this.overviewMap = new BMap.OverviewMapControl({
        isOpen: true,
        anchor: position,
        offset: new BMap.Size(left, top)
      });
      this.map.addControl(this.overviewMap)
    } else {
      this.overviewMap.show()
    }
  },
  removeOverviewMap: function () {
    this.overviewMap.hide()
  },
  addScaleBar: function (left, top, position) {
    if (!this.scaleControl) {
      this.scaleControl = new BMap.ScaleControl({
        anchor: position,
        offset: new BMap.Size(left, top)
      });
      this.map.addControl(this.scaleControl)
    } else {
      this.scaleControl.show()
    }
  },
  removeScaleBar: function () {
    this.scaleControl.hide()
  },
  addPanZoomBar: function (left, top, anchor) {
    if (!this.zoomPanControl) {
      this.zoomPanControl = new BMap.NavigationControl({
        anchor: anchor,
        type: BMAP_NAVIGATION_CONTROL_LARGE,
        offset: new BMap.Size(left, top)
      });
      this.map.addControl(this.zoomPanControl)
    } else {
      this.zoomPanControl.show()
    }
  },
  removePanZoomBar: function () {
    this.map.removeControl(this.zoomPanControl);
    this.zoomPanControl = null
  },
  getScale: function () {
    return this.map.getZoom()
  },
  setScale: function (scale) {
    this.map.setZoom(scale)
  },
  getViewSize: function () {
    var size = this.map.getSize();
    return new cwt.Size(size.width, size.height)
  },
  getMapBounds: function () {
    var bs = this.map.getBounds();
    var bssw = bs.getSouthWest();
    var bsne = bs.getNorthEast();
    return new cwt.Bounds(bssw.lng, bssw.lat, bsne.lng, bsne.lat)
  },
  setMapBounds: function (bounds) {
    var bssw = new BMap.Point(bounds.left, bounds.bottom);
    var bsne = new BMap.Point(bounds.right, bounds.top);
    var pointArray = [bssw, bsne];
    this.map.setViewport(pointArray)
  },
  centerAndZoom: function (lonlat, zoom) {
    var center = new BMap.Point(lonlat.lon, lonlat.lat);
    if (zoom) {
      this.map.centerAndZoom(center, zoom);
    } else {
      this.map.setCenter(center);
    }
  },
  getCenter: function () {
    var center = this.map.getCenter();
    return new cwt.LonLat(center.lng, center.lat)
  },
  saveCenter: function () {
    this.mapCenter = this.getCenter()
  },
  restoreCenter: function () {
    if (this.mapCenter) {
      this.setCenter(this.mapCenter)
    }
  },
  refresh: function () {
    this.map.reset()
  },
  getDistance: function (pointA, pointB) {
    var baiduPointA = new BMap.Point(pointA.lon, pointA.lat);
    var baiduPointB = new BMap.Point(pointB.lon, pointB.lat);
    var distance = this.map.getDistance(baiduPointA, baiduPointB).toFixed(2);
    return distance
  },
  getLonLatFromPixel: function (pixel) {
    var baiduPixel = new BMap.Pixel(pixel.x, pixel.y);
    var baiduPoint = this.map.pixelToPoint(baiduPixel);
    var lonlat = new cwt.LonLat(baiduPoint.lng, baiduPoint.lat);
    return lonlat
  },
  getPixelFromLonLat: function (lonlat) {
    var baiduPoint = new BMap.Point(lonlat.lon, lonlat.lat);
    var baiduPixel = this.map.pointToPixel(baiduPoint);
    var pixel = new cwt.Pixel(baiduPixel.x, baiduPixel.y);
    return pixel
  },
  setViewPort: function (pois, options) {
    var baiduPoints = [];
    for (var i = 0; i < pois.length; i++) {
      var poi = pois[i];
      var baiduPoint = new BMap.Point(poi.lonlat.lon, poi.lonlat.lat);
      baiduPoints.push(baiduPoint)
    }
    this.map.setViewport(baiduPoints, options)
  }
  , "buildBaiduMarker": function (poi) {
    var point = new BMap.Point(poi.lonlat.lon, poi.lonlat.lat);
    var marker = new BMap.Marker(point);

    if (poi.icon) {
      var markerIcon = null;
      if (poi.icon.size) {
        markerIcon = new BMap.Icon(poi.icon.url, new BMap.Size(poi.icon.size.w, poi.icon.size.h))
      } else {
        markerIcon = new BMap.Icon(poi.icon.url, new BMap.Size(32, 32))
      }
      if (poi.icon.offset) {
        markerIcon.setAnchor(new BMap.Size(poi.icon.offset.x, poi.icon.offset.y))
      }
      marker.setIcon(markerIcon)
    }

    if (poi.caption) {
      var caption = poi.caption;
      var labContent = caption.content + "<span class='arrow-" + caption.options.dir + "-" + caption.options.state + "'></span>";
      var markerLabel = new BMap.Label(labContent);
      
      if (caption.options.dir == "down") {
        markerLabel.setOffset(new BMap.Size(5, -25));
      } else if (caption.options.dir == "up") {
        markerLabel.setOffset(new BMap.Size(5, 55));
      }

      var color = poi.caption.options.color;
      markerLabel.setStyle({ "backgroundColor": color, "fontSize": "16px", "border": "solid 3px #fff", "borderRadius": "5px", "color": "#fff", "padding": "3px 8px" });
      marker.setLabel(markerLabel);
    }

    if (poi.popup) {
      var infoWindowOpt = {};
      if (poi.popup.size) {
        infoWindowOpt.width = poi.popup.size.w;
        if (poi.popup.size.h != 0) {
          infoWindowOpt.height = poi.popup.size.h
        }
      }
      if (poi.popup.offset) {
        infoWindowOpt.offset = new BMap.Size(poi.popup.offset.x, poi.popup.offset.y)
      }
      if (poi.popup.title) {
        infoWindowOpt.enableSendToPhone = false;
        infoWindowOpt.title = poi.popup.title;
        infoWindowOpt.enableAutoPan = false;
        infoWindowOpt.searchTypes = [];
        var markerInfoWindow = new BMapLib.SearchInfoWindow(this.map, poi.popup.content, infoWindowOpt);
        marker.addEventListener("click",
          function (e) {
            markerInfoWindow.open(e.target.getPosition())
          });
        if (poi.popup.event) {
          var poi_data = poi.popup.event.data;
          if (poi.popup.event.open) {
            markerInfoWindow.addEventListener("open", function (e) {
              poi.popup.event.open(poi, poi_data, markerInfoWindow);
            });
          }
          if (poi.popup.event.close) {
            markerInfoWindow.addEventListener("close", function (e) {
              poi.popup.event.close(poi, poi_data, markerInfoWindow);
            });
          }
        }
      } else {
        infoWindowOpt.enableMessage = false;
        var markerInfoWindow = new BMap.InfoWindow(poi.popup.content, infoWindowOpt);
        marker.addEventListener("click",
          function () {
            this.openInfoWindow(markerInfoWindow)
          });
        markerInfoWindow.addEventListener("open", function (e) {
          // alert(e.type);
        });
      }
    }

    return marker
  },
  // Point相关操作
  "addPOI": function (poi, callback) {
    var prepoi = this.poiHash.get(poi.id);
    if (prepoi) {
      if (prepoi.marker && prepoi.isshowed) {
        this.map.removeOverlay(prepoi.marker)
      }
      this.map.closeInfoWindow();
      prepoi.isshowed = false
    } else {
      prepoi = {}
    }
    var marker = this.buildBaiduMarker(poi);
    if (typeof (callbak) == "function" && poi.popup) {
      marker.addEventListener("infowindowopen", callback)
    }
    this.map.addOverlay(marker);
    poi.marker = marker;
    poi.isshowed = true;
    this.poiHash.put(poi.id, poi);
  },
  removePOI: function (id) {
    var poi = this.poiHash.get(id);
    if (poi) {
      if (poi.marker) {
        this.map.closeInfoWindow();
        this.map.removeOverlay(poi.marker)
      }
      this.poiHash.remove(id)
    }
  },
  clearPOIs: function () {
    var keySet = this.poiHash.keySet();
    for (var i = 0, length = keySet.length; i < length; i++) {
      this.removePOI(keySet[i])
    }
    this.poiHash.removeAll()
  },
  // Polyline相关操作
  addPolyline: function (polyline) {
    var prepolyline = this.lineHash.get(polyline.id);
    if (prepolyline) {
      this.map.removeOverlay(prepolyline.overlay);
      if (prepolyline.arrows) {
        for (var i = 0; i < prepolyline.arrows.length; i++) {
          this.map.removeOverlay(prepolyline.arrows[i])
        }
        this.map.removeEventListener("zoomend", prepolyline.refreshArrowFunction)
      }
      if (prepolyline.linePoints) {
        for (var i = 0; i < prepolyline.linePoints.length; i++) {
          this.map.removeOverlay(prepolyline.linePoints[i])
        }
        this.map.removeEventListener("zoomend", prepolyline.refreshLinePointsFunction)
      }
    }
    var baiduPoints = new Array();
    var points = polyline.points;
    for (var i = 0, length = points.length; i < length; i++) {
      baiduPoints.push(new BMap.Point(points[i].lon, points[i].lat))
    }
    var baiduPolyline = new BMap.Polyline(baiduPoints);
    if (polyline.style == null) {
      polyline.style = cwt.Style.lineDefault()
    } else {
      if (typeof polyline.style == "function") {
        polyline.style = polyline.style()
      }
    }
    baiduPolyline.setStrokeColor(polyline.style.strokeColor);
    baiduPolyline.setStrokeWeight(polyline.style.strokeWidth);
    var strokeStyle = polyline.style.strokeStyle;
    if (polyline.style.strokeStyle == "dash") {
      strokeStyle = "dashed"
    }
    baiduPolyline.setStrokeStyle(strokeStyle);
    baiduPolyline.setStrokeOpacity(polyline.style.strokeOpacity);
    this.map.addOverlay(baiduPolyline);
    polyline.isshowed = true;
    polyline.overlay = baiduPolyline;
    if (polyline.hasArrow) {
      this.addArrow(polyline, baiduPolyline, 20, 15)
    }
    if (polyline.pointStyle) {
      this.addLinePoint(polyline, baiduPolyline, polyline.pointStyle)
    }
    this.lineHash.put(polyline.id, polyline)
  },
  addLinePoint: function (cwtPolyline, baiduPolyline, pointStyle) {
    var linePoints = new Array();
    var baiduLinePoints = baiduPolyline.getPath();
    var pointCount = baiduLinePoints.length;
    var baiduPointStyle = {
      strokeColor: pointStyle.strokeColor,
      strokeOpacity: pointStyle.strokeOpacity,
      strokeWeight: pointStyle.strokeWidth,
      fillColor: pointStyle.fillColor,
      fillOpacity: pointStyle.fillOpacity
    };
    var anyPoint = baiduLinePoints[0];
    var anyPixel = this.map.pointToPixel(anyPoint);
    var newPixel = new BMap.Pixel(anyPixel.x, anyPixel.y + pointStyle.pointRadius);
    var newPoint = this.map.pixelToPoint(newPixel);
    var radius = this.map.getDistance(anyPoint, newPoint);
    for (var i = 0; i < pointCount; i++) {
      var circle = new BMap.Circle(baiduLinePoints[i], radius, baiduPointStyle);
      this.map.addOverlay(circle);
      linePoints.push(circle)
    }
    cwtPolyline.linePoints = linePoints;
    var that = this;
    var refreshLinePointsFunction = function () {
      for (var i = 0; i < cwtPolyline.linePoints.length; i++) {
        that.map.removeOverlay(cwtPolyline.linePoints[i])
      }
      that.map.removeEventListener("zoomend", cwtPolyline.refreshLinePointsFunction);
      that.addLinePoint(cwtPolyline, baiduPolyline, pointStyle)
    };
    cwtPolyline.refreshLinePointsFunction = refreshLinePointsFunction;
    this.map.addEventListener("zoomend", cwtPolyline.refreshLinePointsFunction)
  },
  addArrow: function (cwtPolyline, baiduPolyline, length, angleValue) {
    var arrows = new Array();
    var linePoint = baiduPolyline.getPath();
    var arrowCount = linePoint.length;
    for (var i = 1; i < arrowCount; i++) {
      var pixelStart = this.map.pointToPixel(linePoint[i - 1]);
      var midPoint = new BMap.Point(linePoint[i].lng + (linePoint[i - 1].lng - linePoint[i].lng) / 2, linePoint[i].lat + (linePoint[i - 1].lat - linePoint[i].lat) / 2);
      var pixelEnd = this.map.pointToPixel(midPoint);
      var angle = angleValue * Math.PI / 180;
      var r = length;
      var delta = 0;
      var param = 0;
      var pixelTemX,
        pixelTemY;
      var pixelX,
        pixelY,
        pixelX1,
        pixelY1;
      if (pixelEnd.x - pixelStart.x == 0) {
        pixelTemX = pixelEnd.x;
        if (pixelEnd.y > pixelStart.y) {
          pixelTemY = pixelEnd.y - r
        } else {
          pixelTemY = pixelEnd.y + r
        }
        var bcLength = Math.round(r * Math.tan(angle));
        pixelX = pixelTemX - bcLength;
        pixelX1 = pixelTemX + bcLength;
        pixelY = pixelY1 = pixelTemY
      } else {
        delta = (pixelEnd.y - pixelStart.y) / (pixelEnd.x - pixelStart.x);
        param = Math.sqrt(delta * delta + 1);
        if ((pixelEnd.x - pixelStart.x) < 0) {
          pixelTemX = pixelEnd.x + r / param;
          pixelTemY = pixelEnd.y + delta * r / param
        } else {
          pixelTemX = pixelEnd.x - r / param;
          pixelTemY = pixelEnd.y - delta * r / param
        }
        pixelX = pixelTemX + Math.round(Math.tan(angle) * r * delta / param);
        pixelY = pixelTemY - Math.round(Math.tan(angle) * r / param);
        pixelX1 = pixelTemX - Math.round(Math.tan(angle) * r * delta / param);
        pixelY1 = pixelTemY + Math.round(Math.tan(angle) * r / param)
      }
      var pointArrow = this.map.pixelToPoint(new BMap.Pixel(pixelX, pixelY));
      var pointArrow1 = this.map.pixelToPoint(new BMap.Pixel(pixelX1, pixelY1));
      var arrowOptions = {
        strokeColor: baiduPolyline.getStrokeColor(),
        strokeOpacity: 1,
        strokeWeight: 1,
        fillColor: baiduPolyline.getStrokeColor(),
        fillOpacity: 1
      };
      var arrow = new BMap.Polygon([pointArrow, midPoint, pointArrow1], arrowOptions);
      this.map.addOverlay(arrow);
      arrows.push(arrow)
    }
    cwtPolyline.arrows = arrows;
    var that = this;
    var refreshArrowFunction = function () {
      for (var i = 0; i < cwtPolyline.arrows.length; i++) {
        that.map.removeOverlay(cwtPolyline.arrows[i])
      }
      console.log("移除箭头并重绘");
      that.map.removeEventListener("zoomend", cwtPolyline.refreshArrowFunction);
      that.addArrow(cwtPolyline, baiduPolyline, length, angleValue)
    };
    cwtPolyline.refreshArrowFunction = refreshArrowFunction;
    this.map.addEventListener("zoomend", cwtPolyline.refreshArrowFunction)
  },
  removePolyline: function (id) {
    var polyline = this.lineHash.get(id);
    if (polyline) {
      this.map.removeOverlay(polyline.overlay);
      if (polyline.arrows) {
        for (var i = 0; i < polyline.arrows.length; i++) {
          this.map.removeOverlay(polyline.arrows[i])
        }
        this.map.removeEventListener("zoomend", polyline.refreshArrowFunction)
      }
      if (polyline.linePoints) {
        for (var i = 0; i < polyline.linePoints.length; i++) {
          this.map.removeOverlay(polyline.linePoints[i])
        }
        this.map.removeEventListener("zoomend", polyline.refreshLinePointsFunction)
      }
      this.lineHash.remove(id);
      polyline = null
    }
  },
  clearPolylines: function () {
    var keySet = this.lineHash.keySet();
    for (var i = 0, length = keySet.length; i < length; i++) {
      var polyline = this.lineHash.get(keySet[i]);
      this.map.removeOverlay(polyline.overlay);
      if (polyline.arrows) {
        for (var j = 0; j < polyline.arrows.length; j++) {
          this.map.removeOverlay(polyline.arrows[j])
        }
        this.map.removeEventListener("zoomend", polyline.refreshArrowFunction)
      }
      if (polyline.linePoints) {
        for (var j = 0; j < polyline.linePoints.length; j++) {
          this.map.removeOverlay(polyline.linePoints[j])
        }
        this.map.removeEventListener("zoomend", polyline.refreshLinePointsFunction)
      }
    }
    this.lineHash.removeAll()
  },
  // Rect相关操作
  addRect: function (rectArea) {
    var prerect = this.rectHash.get(rectArea.id);
    if (prerect && prerect.isshowed) {
      this.map.removeOverlay(prerect.overlay);
      prerect.isshowed = false
    } else {
      prerect = {}
    }
    var baiduPoints = new Array();
    baiduPoints.push(new BMap.Point(rectArea.bounds.left, rectArea.bounds.top));
    baiduPoints.push(new BMap.Point(rectArea.bounds.right, rectArea.bounds.top));
    baiduPoints.push(new BMap.Point(rectArea.bounds.right, rectArea.bounds.bottom));
    baiduPoints.push(new BMap.Point(rectArea.bounds.left, rectArea.bounds.bottom));
    var overlay = new BMap.Polygon(baiduPoints);
    if (rectArea.style == null) {
      rectArea.style = cwt.Style.polygonDefault()
    } else {
      if (typeof rectArea.style == "function") {
        rectArea.style = rectArea.style()
      }
    }
    overlay.setStrokeColor(rectArea.style.strokeColor);
    overlay.setFillColor(rectArea.style.fillColor);
    overlay.setStrokeOpacity(rectArea.style.strokeOpacity);
    overlay.setFillOpacity(rectArea.style.fillOpacity);
    overlay.setStrokeWeight(rectArea.style.strokeWidth);
    overlay.setStrokeStyle(rectArea.style.strokeStyle);
    this.map.addOverlay(overlay);
    rectArea.overlay = overlay;
    rectArea.isshowed = true;
    this.rectHash.put(rectArea.id, rectArea)
  },
  removeRect: function (id) {
    var rect = this.rectHash.get(id);
    if (rect) {
      this.map.removeOverlay(rect.overlay);
      this.rectHash.remove(id)
    }
  },
  clearRects: function () {
    var keySet = this.rectHash.keySet();
    for (var i = 0, length = keySet.length; i < length; i++) {
      var rect = this.rectHash.get(keySet[i]);
      this.map.removeOverlay(rect.overlay)
    }
    this.rectHash.removeAll()
  },
  // Circel相关操作
  addCircle: function (circleArea) {
    var precircleArea = this.circleHash.get(circleArea.id);
    if (precircleArea && precircleArea.isshowed) {
      this.map.removeOverlay(precircleArea.overlay);
      precircleArea.isshowed = false
    } else {
      precircleArea = {}
    }
    if (circleArea.style == null) {
      circleArea.style = cwt.Style.polygonDefault()
    } else {
      if (typeof circleArea.style == "function") {
        circleArea.style = circleArea.style()
      }
    }
    var center = new BMap.Point(circleArea.originLonlat.lon, circleArea.originLonlat.lat);
    var overlay = new BMap.Circle(center, circleArea.radius * 100000);
    overlay.setStrokeColor(circleArea.style.strokeColor);
    overlay.setFillColor(circleArea.style.fillColor);
    overlay.setStrokeOpacity(circleArea.style.strokeOpacity);
    overlay.setFillOpacity(circleArea.style.fillOpacity);
    overlay.setStrokeWeight(circleArea.style.strokeWidth);
    overlay.setStrokeStyle(circleArea.style.strokeStyle);
    this.map.addOverlay(overlay);
    circleArea.overlay = overlay;
    circleArea.isshowed = true;
    this.circleHash.put(circleArea.id, circleArea)
  },
  removeCircle: function (id) {
    var circleArea = this.circleHash.get(id);
    if (circleArea) {
      this.map.removeOverlay(circleArea.overlay);
      this.circleHash.remove(id)
    }
  },
  clearCircles: function () {
    var keySet = this.circleHash.keySet();
    for (var i = 0, length = keySet.length; i < length; i++) {
      var circleArea = this.circleHash.get(keySet[i]);
      this.map.removeOverlay(circleArea.overlay)
    }
    this.circleHash.removeAll()
  },
  // Polygon相关操作
  "addPolygon": function (polygonArea) {
    var prepolygonArea = this.polygonHash.get(polygonArea.id);
    if (prepolygonArea && prepolygonArea.isshowed) {
      this.map.removeOverlay(prepolygonArea.overlay);
      prepolygonArea.isshowed = false
    } else {
      prepolygonArea = {}
    }
    if (polygonArea.style == null) {
      polygonArea.style = cwt.Style.polygonDefault()
    } else {
      if (typeof polygonArea.style == "function") {
        polygonArea.style = polygonArea.style()
      }
    }
    var baiduPoints = new Array();
    for (var i = 0, length = polygonArea.points.length; i < length; i++) {
      baiduPoints.push(new BMap.Point(polygonArea.points[i].lon, polygonArea.points[i].lat))
    }
    var overlay = new BMap.Polygon(baiduPoints);
    overlay.setStrokeColor(polygonArea.style.strokeColor);
    overlay.setFillColor(polygonArea.style.fillColor);
    overlay.setStrokeOpacity(polygonArea.style.strokeOpacity);
    overlay.setFillOpacity(polygonArea.style.fillOpacity);
    overlay.setStrokeWeight(polygonArea.style.strokeWidth);
    overlay.setStrokeStyle(polygonArea.style.strokeStyle);
    this.map.addOverlay(overlay);
    polygonArea.overlay = overlay;
    polygonArea.isshowed = true;
    this.polygonHash.put(polygonArea.id, polygonArea)
  },
  "removePolygon": function (id) {
    var polygonArea = this.polygonHash.get(id);
    if (polygonArea) {
      this.map.removeOverlay(polygonArea.overlay);
      this.polygonHash.remove(id)
    }
  },
  "clearPolygons": function () {
    var keySet = this.polygonHash.keySet();
    for (var i = 0, length = keySet.length; i < length; i++) {
      var polygonArea = this.polygonHash.get(keySet[i]);
      this.map.removeOverlay(polygonArea.overlay)
    }
    this.polygonHash.removeAll()
  },

  enableDMCloseBtn: function (on) {
    if (this.drawingManager) {
      if (on) {
        this.drawingManager.enableCloseBtn()
      } else {
        this.drawingManager.diableCloseBtn()
      }
    }
  },

  addPanoramaLayer: function () {
    if (!this.panoramaLayer) {
      this.panoramaLayer = new BMap.PanoramaCoverageLayer();
      this.map.addTileLayer(this.panoramaLayer)
    }
  },
  removePanoramaLayer: function () {
    if (this.panoramaLayer) {
      this.map.removeTileLayer(this.panoramaLayer);
      this.panoramaLayer = null
    }
  },

  addPanoramaCtrl: function (offset, position) {
    if (!this.panoramaCtrl) {
      this.panoramaCtrl = new BMap.PanoramaControl();
      if (position == 0) {
        this.panoramaCtrl.setAnchor(BMAP_ANCHOR_TOP_LEFT)
      } else {
        if (position == 1) {
          this.panoramaCtrl.setAnchor(BMAP_ANCHOR_TOP_RIGHT)
        } else {
          if (position == 2) {
            this.panoramaCtrl.setAnchor(BMAP_ANCHOR_BOTTOM_LEFT)
          } else {
            if (position == 3) {
              this.panoramaCtrl.setAnchor(BMAP_ANCHOR_BOTTOM_RIGHT)
            }
          }
        }
      }
      this.panoramaCtrl.setOffset(new BMap.Size(offset.w, offset.h));
      this.map.addControl(this.panoramaCtrl)
    }
  },
  removePanoramaCtrl: function () {
    if (this.panoramaCtrl) {
      this.map.removeControl(this.panoramaCtrl);
      this.panoramaCtrl = null
    }
  },
  showPanorama: function (panorama) {
    if (!panorama.position) {
      alert("未设置全景图经纬度");
      return
    }
    if (panorama.id) {
      var container = document.getElementById(panorama.id);
      if (!container) {
        alert("指定的全景图容器ID不存在");
        return
      }
    }
    var id = panorama.id ? panorama.id : this.map.getContainer();
    var baiduPanorama = new BMap.Panorama(id);
    if (panorama.zoom > 0) {
      baiduPanorama.setZoom(panorama.zoom)
    }
    baiduPanorama.setPosition(new BMap.Point(panorama.position.lon, panorama.position.lat));
    var heading = panorama.heading ? panorama.heading : -40;
    var pitch = panorama.pitch ? panorama.pitch : 6;
    baiduPanorama.setPov({
      heading: heading,
      pitch: pitch
    });
    this.panorama = baiduPanorama
  },
  hidePanorama: function () {
    if (this.panorama) {
      this.panorama.hide();
      this.panorama = null
    }
  },
  getPanoramaData: function (lonlat, callback) {
    var panoramaService = new BMap.PanoramaService();
    panoramaService.getPanoramaByLocation(new BMap.Point(lonlat.lon, lonlat.lat),
      function (data) {
        if (data) {
          var position = new cwt.LonLat(data.position.Lng, data.position.lat);
          var panoramaData = new cwt.PanoramaData(data.id, position, data.description);
          callback(panoramaData)
        } else {
          callback(null)
        }
      })
  },
  // 点位聚合相关
  createMarkerClusterer: function (pois, options) {
    var clusterMarkers = [];
    if (pois) {
      if (!this.clusterPOIHash) {
        this.clusterPOIHash = new cwt.Hash();
        this.clusterMarkerHash = new cwt.Hash()
      } else {
        this.clusterPOIHash.removeAll();
        this.clusterMarkerHash.removeAll()
      }
      var i = 0;
      var count = pois.length ? pois.length : 1;
      for (i = 0; i < count; i++) {
        var poi = pois[i];
        var marker = this.buildBaiduMarker(poi);
        marker.poi = poi;
        this.clusterMarkerHash.put(poi.lonlat.lon + "" + poi.lonlat.lat, poi);
        poi.marker = marker;
        var that = this;
        if (options.clickCallback && typeof (options.clickCallback) == "function") {
          marker.addEventListener("click",
            function (event) {
              var targetPOI = that.clusterMarkerHash.get(event.target.getPosition().lng + "" + event.target.getPosition().lat);
              options.clickCallback(targetPOI)
            })
        }
        poi.isshowed = true;
        this.clusterPOIHash.put(poi.id, poi);
        clusterMarkers.push(marker)
      }
    }
    var clusterOptions = {
      markers: clusterMarkers
    };
    if (options) {
      if (options.girdSize) {
        clusterOptions.girdSize = options.girdSize
      }
      if (options.maxZoom) {
        clusterOptions.maxZoom = options.maxZoom
      }
      if (options.minClusterSize) {
        clusterOptions.minClusterSize = options.minClusterSize
      }
      if (options.isAverangeCenter) {
        clusterOptions.isAverangeCenter = options.isAverangeCenter
      }
      if (options.styles) {
        clusterOptions.styles = options.styles
      }
      if (options.clickCallback) {
        clusterOptions.clickCallback = options.clickCallback
      }
      if (options.clusterPopupMaker) {
        clusterOptions.clusterPopupMaker = options.clusterPopupMaker
      }
    }
    this.markerClusterer = new BMapLib.MarkerClusterer(this.map, clusterOptions)
  },
  // 刷新聚合点位信息
  refreshMarkerClusterer: function (pois) {
    var clusterMarkersforAdd = [];
    var clusterMarkersforRemove = [];
    if (pois) {
      this.map.closeInfoWindow();
      for (var i = 0; i < pois.length; i++) {
        var poi = this.clusterPOIHash.get(pois[i].id);
        if (poi) {
          var marker = poi.marker;
          clusterMarkersforRemove.push(marker);
          this.clusterPOIHash.remove(poi.id);
          this.clusterMarkerHash.remove(poi.lonlat.lon + "" + poi.lonlat.lat);

          poi = pois[i];
          marker = this.buildBaiduMarker(poi);
          marker.poi = poi;
          poi.marker = marker;
          marker.addEventListener("click", function (event) {
            var targetPOI = that.clusterMarkerHash.get(event.target.getPosition().lng + "" + event.target.getPosition().lat);
            options.clickCallback(targetPOI)
          });
          poi.isshowed = true;
          this.clusterPOIHash.put(poi.id, poi);
          this.clusterMarkerHash.put(poi.lonlat.lon + "" + poi.lonlat.lat, poi);

          clusterMarkersforAdd.push(marker)
        }
      }
    }
    this.markerClusterer.removeMarkers(clusterMarkersforRemove);
    this.markerClusterer.addMarkers(clusterMarkersforAdd);
  },
  clearClusterMarkers: function () {
    this.markerClusterer.clearMarkers();
    this.clusterPOIHash.removeAll();
    this.clusterMarkerHash.removeAll()
  },
  getClustersCount: function () {
    return this.markerClusterer.getClustersCount()
  },
  showInfoWindowOnCluster: function (id, popup) {
    var poi = this.clusterPOIHash.get(id);
    var marker = poi.marker;
    var _popup = null;
    if (popup) {
      _popup = popup
    } else {
      if (poi.popup) {
        _popup = poi.popup
      }
    }
    var markerInfoWindow = null;
    var infoWindowOpt = {};
    if (_popup.size) {
      infoWindowOpt.width = _popup.size.w;
      infoWindowOpt.height = _popup.size.h
    }
    if (_popup.offset) {
      infoWindowOpt.offset = new BMap.Size(_popup.offset.x, _popup.offset.y)
    }
    if (_popup.title) {
      infoWindowOpt.enableSendToPhone = false;
      infoWindowOpt.title = _popup.title;
      infoWindowOpt.enableAutoPan = false;
      infoWindowOpt.searchTypes = [];
      markerInfoWindow = new BMapLib.SearchInfoWindow(this.map, _popup.content, infoWindowOpt)
    } else {
      infoWindowOpt.enableMessage = false;
      markerInfoWindow = new BMap.InfoWindow(poi.popup.content, infoWindowOpt);
      markerInfoWindow.disableCloseOnClick();
      var that = this;
      markerInfoWindow.addEventListener("clickclose",
        function () {
          that.markerClusterer.destroyInfoWindow()
        })
    }
    this.markerClusterer.showInfoWindowOnCluster(marker, markerInfoWindow)
  },
  setCluserMouseoverListener: function (listener) { },

  enableWheelZoom: function () {
    this.map.enableScrollWheelZoom();
    this.wheelZoomStatus = true
  },
  disableWheelZoom: function () {
    this.map.disableScrollWheelZoom();
    this.wheelZoomStatus = false
  },
  getWheelZoomStatus: function () {
    return this.wheelZoomStatus
  },

  registerEvent: function (type, obj, func) {
    if (func != null) {
      if (obj == null) {
        obj = this
      }
      var baiduEventName = eventHash.get(type);
      if (baiduEventName) {
        for (var i = 0; i < eventListeners.length; i++) {
          if (eventListeners[i][0] == type && eventListeners[i][1] == obj) {
            if (type == cwt.Map.POINT || type == cwt.Map.RECT || type == cwt.Map.ROUND || type == cwt.Map.POLYLINE || type == cwt.Map.POLYGON) {
              this.clearLastDrawing()
            }
            return
          }
        }
        var listenerCallbackFun;
        if (type == cwt.Map.CLICK) {
          var that = this;
          if (obj.CLASS_NAME == "cwt.POI") {
            var poi = this.poiHash.get(obj.id);
            var pointFuncWrapper = function (type, target) {
              func(obj)
            };
            listenerCallbackFun = cwt.Util.bind(pointFuncWrapper, this);
            poi.marker.addEventListener(baiduEventName, listenerCallbackFun)
          } else {
            var clickFuncWrapper = function (e) {
              var ev = new cwt.Event();
              ev.object = that.map;
              ev.eventType = e.type;
              var p = new cwt.Pixel(e.pixel.x, e.pixel.y);
              var lonlat = new cwt.LonLat(e.point.lng, e.point.lat);
              ev.pixel = p;
              ev.lonlat = lonlat;
              func(ev)
            };
            listenerCallbackFun = cwt.Util.bind(clickFuncWrapper, this);
            this.map.addEventListener(baiduEventName, listenerCallbackFun)
          }
        } else {
          if (type == cwt.Map.POINT) {
            var that = this;
            this.clearLastDrawing();
            var clickFuncWrapper = function (overlay) {
              that.clearLastDrawing();
              that.drawOverlayArray.push(overlay);
              that.lastDrawOverlay = overlay;
              var ev = new cwt.Event();
              var lonlat = new cwt.LonLat(overlay.getPosition().lng, overlay.getPosition().lat);
              ev.lonlat = lonlat;
              func(ev)
            };
            listenerCallbackFun = cwt.Util.bind(clickFuncWrapper, this);
            this.drawingManager.addEventListener(baiduEventName, listenerCallbackFun)
          } else {
            if (type == cwt.Map.RECT) {
              var that = this;
              this.clearLastDrawing();
              var rectFuncWrapper = function (overlay) {
                that.clearLastDrawing();
                that.drawOverlayArray.push(overlay);
                that.lastDrawOverlay = overlay;
                var southWest = overlay.getBounds().getSouthWest();
                var northEast = overlay.getBounds().getNorthEast();
                var bounds = new cwt.Bounds(southWest.lng, southWest.lat, northEast.lng, northEast.lat);
                var e = new cwt.Event();
                e.bounds = bounds;
                func(e)
              };
              listenerCallbackFun = cwt.Util.bind(rectFuncWrapper, this);
              this.drawingManager.addEventListener(baiduEventName, listenerCallbackFun)
            } else {
              if (type == cwt.Map.ROUND) {
                var that = this;
                this.clearLastDrawing();
                var circleFuncWrapper = function (overlay) {
                  that.clearLastDrawing();
                  that.drawOverlayArray.push(overlay);
                  that.lastDrawOverlay = overlay;
                  var center = overlay.getCenter();
                  var lonlat = new cwt.LonLat(center.lng, center.lat);
                  var radius = overlay.getRadius();
                  var e = new cwt.Event();
                  e.lonlat = lonlat;
                  e.radius = radius;
                  func(e)
                };
                listenerCallbackFun = cwt.Util.bind(circleFuncWrapper, this);
                this.drawingManager.addEventListener(baiduEventName, listenerCallbackFun)
              } else {
                if (type == cwt.Map.POLYLINE) {
                  var that = this;
                  this.clearLastDrawing();
                  var polylineFuncWrapper = function (overlay) {
                    that.clearLastDrawing();
                    that.drawOverlayArray.push(overlay);
                    that.lastDrawOverlay = overlay;
                    var baiduPoints = overlay.getPath();
                    var points = new Array();
                    for (var i = 0, length = baiduPoints.length; i < length; i++) {
                      points.push(new cwt.LonLat(baiduPoints[i].lng, baiduPoints[i].lat))
                    }
                    var e = new cwt.Event();
                    e.points = points;
                    func(e)
                  };
                  listenerCallbackFun = cwt.Util.bind(polylineFuncWrapper, this);
                  this.drawingManager.addEventListener(baiduEventName, listenerCallbackFun)
                } else {
                  if (type == cwt.Map.POLYGON) {
                    var that = this;
                    this.clearLastDrawing();
                    var polygonFuncWrapper = function (overlay) {
                      that.clearLastDrawing();
                      that.drawOverlayArray.push(overlay);
                      that.lastDrawOverlay = overlay;
                      var baiduPoints = overlay.getPath();
                      var points = new Array();
                      for (var i = 0, length = baiduPoints.length; i < length; i++) {
                        points.push(new cwt.LonLat(baiduPoints[i].lng, baiduPoints[i].lat))
                      }
                      var e = new cwt.Event();
                      e.points = points;
                      func(e)
                    };
                    listenerCallbackFun = cwt.Util.bind(polygonFuncWrapper, this);
                    this.drawingManager.addEventListener(baiduEventName, listenerCallbackFun)
                  } else {
                    listenerCallbackFun = cwt.Util.bind(func, this);
                    this.map.addEventListener(baiduEventName, listenerCallbackFun)
                  }
                }
              }
            }
          }
        }
        eventListeners.push([type, obj, func, listenerCallbackFun])
      } else {
        alert("百度地图不支持[" + type + "]事件")
      }
    }
  },
  setClearLastDrawingMode: function (mode) {
    this.clearLastDrawingMode = mode
  },
  clearLastDrawing: function () {
    if (this.clearLastDrawingMode) {
      for (var i = 0; i < this.drawOverlayArray.length; i++) {
        if (this.drawOverlayArray[i] == this.lastDrawOverlay) {
          this.drawOverlayArray.splice(i, 1);
          break
        }
      }
      this.map.removeOverlay(this.lastDrawOverlay)
    }
  },
  clearAllPreDrawing: function () {
    for (var i = 0; i < this.drawOverlayArray.length; i++) {
      this.map.removeOverlay(this.drawOverlayArray[i])
    }
    this.drawOverlayArray = []
  },
  getRegisterEvents: function (type) {
    alert("百度地图不支持此方法")
  },
  unregisterEvent: function (type, obj, func) {
    var baiduEventName = eventHash.get(type);
    if (baiduEventName) {
      for (var i = 0; i < eventListeners.length; i++) {
        if (eventListeners[i][0] == type && eventListeners[i][1] == obj) {
          this.map.removeEventListener(baiduEventName, eventListeners[i][3]);
          eventListeners.splice(i, 1);
          break
        }
      }
    } else {
      alert("百度地图不支持[" + type + "]事件")
    }
  },
  unregisterAllEvents: function (type) {
    if (type) {
      var baiduEventName = eventHash.get(type);
      for (var i = 0; i < eventListeners.length; i++) {
        if (eventListeners[i][0] == type) {
          this.map.removeEventListener(baiduEventName, eventListeners[i][2]);
          eventListeners.splice(i, 1)
        }
      }
    } else {
      for (var i = 0; i < eventListeners.length; i++) {
        this.map.removeEventListener(eventListeners[i][0], eventListeners[i][2])
      }
      eventListeners = new Array()
    }
  },
  listenAllEvent: function () {
    var events = [[cwt.Map.MOUSE_OVER, "mouseover"], [cwt.Map.MOUSE_OUT, "mouseout"], [cwt.Map.MOUSE_MOVE, "mousemove"], [cwt.Map.CLICK, "click"], [cwt.Map.DBLCLICK, "dblclick"], [cwt.Map.RESIZE, "resize"], [cwt.Map.MOVE_START, "movestart"], [cwt.Map.MOVE, "moving"], [cwt.Map.MOVE_END, "zoomend"], [cwt.Map.DRAG_START, "dragstart"], [cwt.Map.DRAG, "dragging"], [cwt.Map.DRAG_END, "dragend"], [cwt.Map.ZOOM_END, "zoomend"], [cwt.Map.POINT, "markercomplete"], [cwt.Map.RECT, "rectanglecomplete"], [cwt.Map.ROUND, "circlecomplete"], [cwt.Map.POLYLINE, "polylinecomplete"], [cwt.Map.POLYGON, "polygoncomplete"]];
    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      eventHash.put(event[0], event[1])
    }
  },
  unlistenAllEvents: function () { },

  VERSION: "1.0.0"
});
