cwt.Map = cwt.Class({
  eventTypes: null,
  listeners: null,
  initialize: function () {
    eventTypes = [cwt.Map.MOUSE_OVER, cwt.Map.MOUSE_OUT, cwt.Map.MOUSE_MOVE, cwt.Map.MOUSE_DOWN, cwt.Map.MOUSE_UP, cwt.Map.CLICK, cwt.Map.DBLCLICK, cwt.Map.RESIZE, cwt.Map.MOVE_START, cwt.Map.MOVE, cwt.Map.MOVE_END, cwt.Map.ZOOM_END, cwt.Map.DRAG_START, cwt.Map.DRAG, cwt.Map.DRAG_END, cwt.Map.POINT, cwt.Map.RECT, cwt.Map.ROUND, cwt.Map.POLYLINE, cwt.Map.POLYGON];
    this.listeners = {};
    for (var i = 0; i < eventTypes.length; i++) {
      this.listeners[eventTypes[i]] = []
    }
  },
  destroy: function () {
    this.unlistenAllEvents();
    this.unregisterAllEvents()
  },
  getMapType: function () { },
  getMapTypeDesc: function () { },
  setActionType: function (actionType) {
    this.actionType = actionType
  },
  getActionType: function () {
    return actionType
  },
  getDistance:function(pointA,pointB){},
  addOverviewMap: function () { },
  removeOverviewMap: function () { },
  addScaleBar: function () { },
  removeScaleBar: function () { },
  addPanZoomBar: function (left, top) { },
  removePanZoomBar: function () { },
  getScale: function () { },
  setScale: function (scale) { },
  getViewSize: function () { },
  getMapBounds: function () { },
  setMapBounds: function (bounds) { },
  setCenter: function (lonlat) { },
  getCenter: function () { },
  saveCenter: function () { },
  restoreCenter: function () { },
  refresh: function () { },
  getLonLatFromPixel: function (pixel) { },
  getPixelFromLonLat: function (lonlat) { },
  addPOI: function (poi) { },
  addPOIWithCallback: function (poi, cback) { },
  removePOI: function (id) { },
  clearPOIs: function () { },
  addPolyline: function (polyline) { },
  removePolyline: function (id) { },
  clearPolylines: function () { },
  addRect: function (rectArea) { },
  removeRect: function (id) { },
  clearRects: function () { },
  addCircle: function (circleArea) { },
  removeCircle: function (id) { },
  clearCircles: function () { },
  addPolygon: function (polygonArea) { },
  removePolygon: function (id) { },
  clearPolygons: function () { },
  addPanoramaLayer: function () { },
  removePanoramaLayer: function () { },
  addPanoramaCtrl: function (offset, position) { },
  removePanoramaCtrl: function () { },
  showPanorama: function (panorama) { },
  hidePanorama: function () { },
  getPanoramaData: function (lonlat, callback) { },
  createMarkerClusterer: function (pois, options) { },
  addClusterMarker: function (poi) { },
  addClusterMarkers: function (pois) { },
  clearClusterMarkers: function () { },
  getClustersCount: function () { },
  removeClusterMarker: function (id) { },
  removeClusterMarkers: function (ids) { },
  enableWheelZoom: function () { },
  disableWheelZoom: function () { },
  getWheelZoomStatus: function () { },
  registerEvent: function (type, obj, func) {
    if (func != null) {
      if (obj == null) {
        obj = this
      }
      var listeners = this.listeners[type];
      if (listeners != null) {
        var exited = false;
        for (var i = 0; i < listeners.length; i++) {
          if (listeners[i].obj == obj && listeners[i].func == func) {
            exited = true
          }
        }
        if (!exited) {
          listeners.push({
            obj: obj,
            func: func
          })
        }
      }
    }
  },
  getRegisterEvents: function (type) {
    return this.listeners[type]
  },
  unregisterEvent: function (type, obj, func) {
    if (obj == null) {
      obj = this
    }
    var listeners = this.listeners[type];
    if (listeners != null) {
      for (var i = 0; i < listeners.length; i++) {
        if (listeners[i].obj == obj && listeners[i].func == func) {
          listeners.splice(i, 1)
        }
      }
    }
  },
  unregisterAllEvents: function (type) {
    if (type) {
      var listeners = this.listeners[type];
      if (listeners != null) {
        this.listeners[type] = []
      }
    } else {
      for (var i = 0; i < eventTypes.length; i++) {
        this.listeners[eventTypes[i]] = []
      }
    }
  },
  listenAllEvent: function () { },
  unlistenAllEvents: function () { },
  stopEventChain: function (event, allowDefault) {
    if (!allowDefault) {
      if (event.preventDefault) {
        event.preventDefault()
      } else {
        event.returnValue = false
      }
    }
    if (event.stopPropagation) {
      event.stopPropagation()
    } else {
      event.cancelBubble = true
    }
  },
  VERSION: "1.1.5.0"
});
cwt.Map.ACTION_TYPE_NONE = 0;
cwt.Map.ACTION_TYPE_ZOOMIN = 1;
cwt.Map.ACTION_TYPE_ZOOMOUT = 2;
cwt.Map.ACTION_TYPE_PAN = 3;
cwt.Map.ACTION_TYPE_POINT = 4;
cwt.Map.ACTION_TYPE_RECT = 5;
cwt.Map.ACTION_TYPE_ROUND = 6;
cwt.Map.ACTION_TYPE_POLYLINE = 7;
cwt.Map.ACTION_TYPE_POLYGON = 8;
cwt.Map.ACTION_TYPE_MEASUREDIS = 9;
cwt.Map.ACTION_TYPE_MEASURE_AREA = 10;
cwt.Map.ACTION_TYPE_STOP_MEASURE = 11;
cwt.Map.MOUSE_OVER = "mouseover";
cwt.Map.MOUSE_OUT = "mouseout";
cwt.Map.MOUSE_MOVE = "mousemove";
cwt.Map.MOUSE_DOWN = "mousedown";
cwt.Map.MOUSE_UP = "mouseup";
cwt.Map.CLICK = "click";
cwt.Map.DBLCLICK = "dblclick";
cwt.Map.RESIZE = "resize";
cwt.Map.MOVE_START = "movestart";
cwt.Map.MOVE = "move";
cwt.Map.MOVE_END = "moveend";
cwt.Map.ZOOM_END = "zoomend";
cwt.Map.DRAG_START = "dragstart";
cwt.Map.DRAG = "drag";
cwt.Map.DRAG_END = "dragend";
cwt.Map.POINT = "point";
cwt.Map.RECT = "rect";
cwt.Map.ROUND = "round";
cwt.Map.POLYLINE = "polyline";
cwt.Map.POLYGON = "polygon";
