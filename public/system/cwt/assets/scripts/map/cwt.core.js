cwt = {};
cwt.Util = {};
cwt.Util.extend = function (destination, source) {
  if (destination && source) {
    for (var property in source) {
      var value = source[property];
      if (value !== undefined) {
        destination[property] = value
      }
    }
    var sourceIsEvt = typeof window.Event == "function" && source instanceof window.Event;
    if (!sourceIsEvt && source.hasOwnProperty && source.hasOwnProperty("toString")) {
      destination.toString = source.toString
    }
  }
  return destination
};
cwt.Util.addScripts = function (jsfiles, charset, language, type, event, defer) {
  var ajaxDode = function (oXML) {
    var jstext = oXML.responseText;
    cwt.Util.writeScript(jstext, this.charset, this.language, this.type, this.event, this.defer)
  };
  for (var i = 0; i < jsfiles.length; i++) {
    var ajax = new cwt.Ajax();
    var obj = {
      charset: charset,
      language: language,
      type: type,
      event: event,
      defer: defer
    };
    ajax.connect(jsfiles[i], cwt.Ajax.METHOD_GET, "", false, cwt.Util.bind(ajaxDode, obj))
  }
};
cwt.Util.addScripts2 = function (jsfiles) {
  var allScriptTags = "";
  for (var i = 0; i < jsfiles.length; i++) {
    if (/MSIE/.test(navigator.userAgent) || /Safari/.test(navigator.userAgent)) {
      var currentScriptTag = "<script src='" + jsfiles[i] + "'><\/script>";
      allScriptTags += currentScriptTag
    } else {
      var s = document.createElement("script");
      s.src = jsfiles[i];
      var h = document.getElementsByTagName("head").length ? document.getElementsByTagName("head")[0] : document.body;
      h.appendChild(s)
    }
  }
  if (allScriptTags) {
    document.write(allScriptTags)
  }
};
cwt.Util.writeScript = function (jstext, charset, language, src, type, event, defer) {
  var s = document.createElement("script");
  if (charset) {
    s.charset = charset
  }
  if (language) {
    s.language = language
  }
  if (src) {
    s.src = src
  }
  if (type) {
    s.type = type
  }
  if (event) {
    s.event = event
  }
  if (defer) {
    s.defer = defer
  }
  if (jstext) {
    s.text = jstext
  }
  var h = document.getElementsByTagName("head").length ? document.getElementsByTagName("head")[0] : document.body;
  h.appendChild(s);
  return s
};
cwt.Util.loadScript = function (url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState == "loaded" || script.readyState == "complete") {
        script.onreadystatechange = null;
        if (typeof (callback) == "function") {
          callback()
        }
      }
    }
  } else {
    script.onload = function () {
      if (typeof (callback) == "function") {
        callback()
      }
    }
  }
  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script)
};
cwt.Util.writeCss = function (href, type) {
  var link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  if (type) {
    link.setAttribute("type", type)
  } else {
    link.setAttribute("type", "text/css")
  }
  link.setAttribute("href", href);
  document.getElementsByTagName("head")[0].appendChild(link);
  return link
};
cwt.Util.getElement = function () {
  var elements = [];
  for (var i = 0; i < arguments.length; i++) {
    var element = arguments[i];
    if (typeof element == "string") {
      element = document.getElementById(element)
    }
    if (arguments.length == 1) {
      return element
    }
    elements.push(element)
  }
  return elements
};
cwt.Util.observeEvent = function (elementParam, name, observer, useCapture) {
  var element = cwt.Util.getElement(elementParam);
  useCapture = useCapture || false;
  if (name == "keypress" && (navigator.appVersion.match(/Konqueror|Safari|KHTML/) || element.attachEvent)) {
    name = "keydown"
  }
  if (element.addEventListener) {
    element.addEventListener(name, observer, useCapture)
  } else {
    if (element.attachEvent) {
      element.attachEvent("on" + name, observer)
    }
  }
};
cwt.Util.bind = function (func, object) {
  var args = Array.prototype.slice.apply(arguments, [2]);
  return function () {
    var newArgs = args.concat(Array.prototype.slice.apply(arguments, [0]));
    return func.apply(object, newArgs)
  }
};
cwt.Util.bindAsEventListener = function (func, object) {
  return function (event) {
    return func.call(object, event || window.event)
  }
};
cwt.Class = function () {
  var Class = function () {
    if (arguments && arguments[0] != cwt.Class.isPrototype) {
      this.initialize.apply(this, arguments)
    }
  };
  var extended = {};
  var parent;
  for (var i = 0; i < arguments.length; ++i) {
    if (typeof arguments[i] == "function") {
      parent = arguments[i].prototype
    } else {
      parent = arguments[i]
    }
    cwt.Util.extend(extended, parent)
  }
  Class.prototype = extended;
  return Class
};
cwt.Class.isPrototype = function () { };
cwt.Class.create = function () {
  return function () {
    if (arguments && arguments[0] != cwt.Class.isPrototype) {
      this.initialize.apply(this, arguments)
    }
  }
};
cwt.Class.inherit = function () {
  var superClass = arguments[0];
  var proto = new superClass(cwt.Class.isPrototype);
  for (var i = 1; i < arguments.length; i++) {
    if (typeof arguments[i] == "function") {
      var mixin = arguments[i];
      arguments[i] = new mixin(cwt.Class.isPrototype)
    }
    cwt.Util.extend(proto, arguments[i])
  }
  return proto
};
cwt.Hash = cwt.Class({
  container: null,
  initialize: function () {
    this.container = {}
  },
  destroy: function () {
    this.removeAll();
    this.container = null
  },
  put: function (key, value) {
    this.container[key] = value
  },
  remove: function (key) {
    delete (this.container[key])
  },
  removeAll: function () {
    var keySet = this.keySet();
    for (var i = 0; i < keySet.length; i++) {
      this.remove(keySet[i])
    }
  },
  get: function (key) {
    return this.container[key]
  },
  keySet: function () {
    var keyset = [];
    var count = 0;
    for (var key in this.container) {
      if (key == "extend") {
        continue
      }
      keyset[count] = key;
      count++
    }
    return keyset
  },
  size: function () {
    var count = 0;
    for (var key in this.container) {
      if (key == "extend") {
        continue
      }
      count++
    }
    return count
  },
  toString: function () {
    var str = "";
    for (var i = 0, keys = this.keySet(), len = keys.length; i < len; i++) {
      str = str + keys[i] + "=" + this.container[keys[i]] + ";\n"
    }
    return str
  }
});
cwt.Ajax = function () {
  var xmlhttp,
    bComplete = false;
  try {
    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP")
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
    } catch (e) {
      try {
        xmlhttp = new XMLHttpRequest()
      } catch (e) {
        xmlhttp = false
      }
    }
  }
  if (!xmlhttp) {
    return null
  }
  this.xmlhttp = xmlhttp;
  this.connect = function (sURL, sMethod, sVars, bAsync, fnDone) {
    if (!xmlhttp) {
      return false
    }
    bComplete = false;
    sMethod = sMethod.toUpperCase();
    try {
      if (sMethod == "GET") {
        xmlhttp.open(sMethod, sURL + "?" + sVars, bAsync);
        sVars = ""
      } else {
        xmlhttp.open(sMethod, sURL, bAsync);
        xmlhttp.setRequestHeader("Method", "POST " + sURL + " HTTP/1.1");
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
      }
      if (bAsync) {
        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState == 4 && !bComplete) {
            bComplete = true;
            if (fnDone) {
              fnDone(xmlhttp)
            }
          }
        }
      }
      xmlhttp.send(sVars);
      if (!bAsync) {
        fnDone(xmlhttp)
      }
    } catch (z) {
      return false
    }
    return true
  };
  return this
};
cwt.Ajax.METHOD_GET = "GET";
cwt.Ajax.METHOD_POST = "POST";
cwt.Pixel = function (x, y) {
  this.x = x;
  this.y = y;
  this.toString = function () {
    return "x=" + this.x + ",y=" + this.y
  };
  this.clone = function () {
    return new Pixel(this.x, this.y)
  }
};
cwt.Pixel.CLASS_NAME = "cwt.Pixel";
cwt.Pixel.prototype.CLASS_NAME = "cwt.Pixel";
cwt.Size = function (w, h) {
  this.w = w;
  this.h = h;
  this.toString = function () {
    return "w=" + this.w + ",h=" + this.h
  };
  this.clone = function () {
    return new Size(this.w, this.h)
  }
};
cwt.Size.CLASS_NAME = "cwt.Size";
cwt.Size.prototype.CLASS_NAME = "cwt.Size";
cwt.LonLat = function (lon, lat) {
  this.lon = lon;
  this.lat = lat;
  this.toString = function () {
    return "lon=" + this.lon + ",lat=" + this.lat
  };
  this.clone = function () {
    return new cwt.LonLat(this.lon, this.lat)
  }
};
cwt.LonLat.CLASS_NAME = "cwt.LonLat";
cwt.LonLat.prototype.CLASS_NAME = "cwt.LonLat";
cwt.Bounds = function (left, bottom, right, top) {
  this.left = left;
  this.top = top;
  this.right = right;
  this.bottom = bottom;
  this.contains = function (lonlat) {
    return this.left <= lonlat.lon && this.right >= lonlat.lon && this.bottom <= lonlat.lat && this.top >= lonlat.lat
  };
  this.setString = function (strRect) {
    var tmp_array = strRect.split(",");
    if (tmp_array.length >= 4) {
      this.left = parseFloat(tmp_array[0]);
      this.bottom = parseFloat(tmp_array[1]);
      this.right = parseFloat(tmp_array[2]);
      this.top = parseFloat(tmp_array[3])
    }
  };
  this.toString = function () {
    return "left=" + this.left + ",bottom=" + this.bottom + ",right=" + this.right + ",top=" + this.top
  };
  this.clone = function () {
    return new cwt.Bounds(this.left, this.bottom, this.right, this.top)
  }
};
cwt.Bounds.CLASS_NAME = "cwt.Bounds";
cwt.Bounds.prototype.CLASS_NAME = "cwt.Bounds";
cwt.Style = function () {
  this.fillColor = "#FF9510";
  this.fillOpacity = 0.9;
  this.hoverFillColor = "white";
  this.hoverFillOpacity = 0.8;
  this.strokeColor = "#000000";
  this.strokeOpacity = 1;
  this.strokeWidth = 2;
  this.strokeStyle = "solid";
  this.strokeLinecap = "round";
  this.hoverStrokeColor = "red";
  this.hoverStrokeOpacity = 1;
  this.hoverStrokeWidth = 0.2;
  this.pointRadius = 6;
  this.hoverPointRadius = 1;
  this.hoverPointUnit = "%";
  this.pointerEvents = "visiblePainted"
};
cwt.Style.pointDefault = function () {
  var style = new cwt.Style();
  style.fillColor = "#FF9510";
  style.fillOpacity = 0.9;
  style.hoverFillColor = "white";
  style.hoverFillOpacity = 0.8;
  style.strokeColor = "#000000";
  style.strokeOpacity = 1;
  style.strokeWidth = 2;
  style.strokeStyle = "solid";
  style.strokeLinecap = "round";
  style.hoverStrokeColor = "red";
  style.hoverStrokeOpacity = 1;
  style.hoverStrokeWidth = 0.2;
  style.pointRadius = 6;
  style.hoverPointRadius = 1;
  style.hoverPointUnit = "%";
  style.pointerEvents = "visiblePainted";
  return style
};
cwt.Style.lineDefault = function () {
  var style = new cwt.Style();
  style.fillColor = "#0000FF";
  style.fillOpacity = 0.4;
  style.hoverFillColor = "white";
  style.hoverFillOpacity = 0.8;
  style.strokeColor = "#6600FF";
  style.strokeOpacity = 0.6;
  style.strokeWidth = 2;
  style.strokeStyle = "solid";
  style.strokeLinecap = "round";
  style.hoverStrokeColor = "red";
  style.hoverStrokeOpacity = 1;
  style.hoverStrokeWidth = 0.2;
  style.pointRadius = 6;
  style.hoverPointRadius = 1;
  style.hoverPointUnit = "%";
  style.pointerEvents = "visiblePainted";
  return style
};
cwt.Style.polygonDefault = function () {
  var style = new cwt.Style();
  style.fillColor = "#FFFFFF";
  style.fillOpacity = 0.6;
  style.hoverFillColor = "white";
  style.hoverFillOpacity = 0.8;
  style.strokeColor = "#333333";
  style.strokeOpacity = 0.8;
  style.strokeWidth = 1;
  style.strokeStyle = "solid";
  style.strokeLinecap = "round";
  style.hoverStrokeColor = "red";
  style.hoverStrokeOpacity = 1;
  style.hoverStrokeWidth = 0.2;
  style.pointRadius = 6;
  style.hoverPointRadius = 1;
  style.hoverPointUnit = "%";
  style.pointerEvents = "visiblePainted";
  return style
};
cwt.Polyline = function (id, points, hasArrow, style, pointStyle) {
  this.id = id;
  this.points = points;
  this.hasArrow = hasArrow;
  this.style = style ? style : cwt.Style.lineDefault();
  this.pointStyle = pointStyle;
  this.toString = function () {
    return "id=" + this.id + ",points=(" + (this.points ? this.points.join(";") : "") + "),hasArrow=" + this.hasArrow + ",style=(" + this.style + ")pointStyle=(" + this.pointStyle + ")"
  };
  this.clone = function () {
    var points = null;
    if (this.points) {
      var length = this.points.length;
      points = new Array(length);
      for (var i = 0; i < length; i++) {
        points[i] = this.points[i].clone()
      }
    }
    return new cwt.Polyline(this.id, points, this.hasArrow, this.style)
  }
};
cwt.Polyline.CLASS_NAME = "cwt.Polyline";
cwt.Polyline.prototype.CLASS_NAME = "cwt.Polyline";
cwt.Rect = function (id, bounds, style) {
  this.id = id;
  this.bounds = bounds;
  this.style = style ? style : cwt.Style.polygonDefault();
  this.toString = function () {
    return "id=" + this.id + ",bounds=(" + this.bounds + "),style=" + this.style
  };
  this.clone = function () {
    return new cwt.Rect(this.id, this.bounds.clone(), this.style)
  }
};
cwt.Rect.CLASS_NAME = "cwt.Rect";
cwt.Rect.prototype.CLASS_NAME = "cwt.Rect";
cwt.Circle = function (id, originLonlat, radius, style) {
  this.id = id;
  this.originLonlat = originLonlat;
  this.radius = radius;
  this.style = style ? style : cwt.Style.polygonDefault();
  this.toString = function () {
    return "id=" + this.id + ",originLonlat=(" + this.originLonlat + "),radius=" + this.radius + "style=" + this.style
  };
  this.clone = function () {
    return new cwt.Circle(this.id, this.originLonlat ? this.originLonlat.clone() : null, this.radius, this.style)
  }
};
cwt.Circle.CLASS_NAME = "cwt.Circle";
cwt.Circle.prototype.CLASS_NAME = "cwt.Circle";
cwt.Polygon = function (id, points, style) {
  this.id = id;
  this.points = points;
  this.style = style ? style : cwt.Style.polygonDefault();
  this.addPoint = function (point) {
    if (points == null || points == undefined) {
      points = []
    }
    if (point != null && point != undefined) {
      points.add(point)
    }
  };
  this.toString = function () {
    return "id=" + this.id + ",points=(" + (this.points ? this.points.join(";") : "") + ",style=" + this.style
  };
  this.clone = function () {
    var points = null;
    if (this.points) {
      var length = this.points.length;
      points = new Array(length);
      for (var i = 0; i < length; i++) {
        points[i] = this.points[i].clone()
      }
    }
    return new cwt.Polygon(this.id, points, this.style)
  }
};
cwt.Polygon.CLASS_NAME = "cwt.Polygon";
cwt.Polygon.prototype.CLASS_NAME = "cwt.Polygon";
cwt.Icon = function (url, size, offset, angle) {
  this.url = url;
  this.size = size;
  this.offset = offset;
  this.angle = angle;
  this.toString = function () {
    return "url=" + this.url + ",size=(" + this.size + "),offset=(" + this.offset + "),angle=" + this.angle
  };
  this.clone = function () {
    return new cwt.Icon(this.url, this.size ? this.size.clone() : null, this.offset ? this.offset.clone() : null, this.angle)
  }
};
cwt.Icon.CLASS_NAME = "cwt.Icon";
cwt.Icon.prototype.CLASS_NAME = "cwt.Icon";
cwt.Popup = function (size, offset, content, bgColor, opacity, borderColor, borderWidth, closeBox, title,event) {
  this.size = size;
  this.offset = offset;
  this.content = content;
  this.closeBox = closeBox;
  this.bgColor = bgColor;
  this.title = title;
  this.opacity = opacity;
  this.borderColor = borderColor;
  this.borderWidth = borderWidth;
  this.event = event;
  this.toString = function () {
    return "size=(" + this.size + "),offset=(" + this.offset + "),content=" + this.content + ",closeBox=" + this.closeBox + ",bgColor=" + this.bgColor + ",opacity=" + this.opacity + ",borderColor=" + this.borderColor + ",borderWidth=" + this.borderWidth + ",title=" + this.title
  };
  this.clone = function () {
    return new cwt.Popup(this.size ? this.size.clone() : null, this.offset ? this.offset.clone() : null, this.content, this.bgColor, this.opacity, this.borderColor, this.borderWidth, this.closeBox,this.title,this.event)
  }
};
cwt.Popup.CLASS_NAME = "cwt.Popup";
cwt.Popup.prototype.CLASS_NAME = "cwt.Popup";
cwt.Caption = function (content) {
  this.content = content;
  this.setOptions = function(opts){
    this.options = opts;
  };
};
cwt.Caption.CLASS_NAME = "cwt.Caption";
cwt.Caption.prototype.CLASS_NAME = "cwt.Caption";
cwt.POI = function (id, lonlat, icon, caption, popup) {
  this.id = id;
  this.lonlat = lonlat;
  this.icon = icon;
  this.caption = caption;
  this.popup = popup;
  this.toString = function () {
    return "id=" + this.id + ",lonlat=(" + this.lonlat + "),icon=(" + this.icon + "),caption=(" + this.caption + "),popup=(" + this.popup + ")"
  };
  this.clone = function () {
    return new cwt.POI(this.id, this.lonlat ? this.lonlat.clone() : null, this.icon ? this.icon.clone() : null, this.caption ? this.caption.clone() : null, this.popup ? this.popup.clone() : null)
  }
};
cwt.POI.CLASS_NAME = "cwt.POI";
cwt.POI.prototype.CLASS_NAME = "cwt.POI";
cwt.GPSData = function (id, lonlat, utc, heading, iconUrl, captionText, popupText) {
  this.id = id;
  this.lonlat = lonlat;
  this.utc = utc;
  this.heading = heading;
  this.iconUrl = iconUrl;
  this.captionText = captionText;
  this.popupText = popupText
};
cwt.GPSData.CLASS_NAME = "cwt.GPSData";
cwt.GPSData.prototype.CLASS_NAME = "cwt.GPSData";
cwt.RegionOverlay = function () {
  this.zdcRegionOverlay = new ZdcRegionOverlay();
  this.addRegion = function (key, minzoom, maxzoom, color, highlight, opcation) {
    this.zdcRegionOverlay.addRegion(key, minzoom, maxzoom, color, highlight, opcation)
  };
  this.isFull = function () {
    return this.zdcRegionOverlay.isFull()
  };
  this.removeRegion = function (key) {
    this.zdcRegionOverlay.removeRegion(key)
  }
};
cwt.RegionOverlay.CLASS_NAME = "cwt.RegionOverlay";
cwt.RegionOverlay.prototype.CLASS_NAME = "cwt.RegionOverlay";
cwt.Panorama = function (id, position) {
  this.id = id;
  this.position = position;
  this.zoom = 0;
  this.heading = 0;
  this.pitch = 0;
  this.setId = function (id) {
    this.id = id
  };
  this.getId = function () {
    return this.id
  };
  this.setPosition = function (position) {
    this.position = position
  };
  this.getPosition = function () {
    return this.position
  };
  this.setZoom = function (zoom) {
    this.zoom = zoom
  };
  this.getZoom = function () {
    return this.zoom
  };
  this.setHeading = function (heading) {
    this.heading = heading
  };
  this.getHeading = function () {
    return this.heading
  };
  this.setPitch = function (pitch) {
    this.pitch = pitch
  };
  this.getPitch = function () {
    return this.pitch
  }
};
cwt.Panorama.CLASS_NAME = "cwt.Panorama";
cwt.Panorama.prototype.CLASS_NAME = "cwt.Panorama";
cwt.PanoramaData = function (id, position, description) {
  this.id = id;
  this.position = position;
  this.description = description;
  this.toString = function () {
    return "Id=" + this.id + ",经纬度(" + this.position + "),位置描述=" + this.description
  }
};
cwt.PanoramaData.CLASS_NAME = "cwt.PanoramaData";
cwt.PanoramaData.prototype.CLASS_NAME = "cwt.PanoramaData";
function getValue(value, defaultValue) {
  if (value == null || value == undefined || new String(value) == "") {
    return defaultValue
  } else {
    return new String(value).replace(/,/g, ".")
  }
}
cwt.Event = cwt.Class({
  object: null,
  eventType: null,
  pixel: null,
  lonlat: null,
  points: null,
  bounds: null,
  radius: null,
  initialize: function (options) {
    cwt.Util.extend(this, options)
  },
  destroy: function () {
    this.object = null;
    this.eventType = null;
    this.pixel = null;
    this.lonlat = null;
    this.points = null;
    this.bounds = null;
    this.radius = null
  }
});