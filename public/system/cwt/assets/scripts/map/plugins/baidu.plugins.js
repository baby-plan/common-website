/**
 * @namespace BMap的所有library类均放在BMapLib命名空间下
 */
var BMapLib = window.BMapLib = BMapLib || {};

( function () {
  var getExtendedBounds = function ( map, bounds, gridSize ) {
    bounds = cutBoundsInRange( bounds );
    var pixelNE = map.pointToPixel( bounds.getNorthEast() );
    var pixelSW = map.pointToPixel( bounds.getSouthWest() );
    pixelNE.x += gridSize;
    pixelNE.y -= gridSize;
    pixelSW.x -= gridSize;
    pixelSW.y += gridSize;
    var newNE = map.pixelToPoint( pixelNE );
    var newSW = map.pixelToPoint( pixelSW );
    return new BMap.Bounds( newSW, newNE )
  };
  var cutBoundsInRange = function ( bounds ) {
    var maxX = getRange( bounds.getNorthEast().lng, -180, 180 );
    var minX = getRange( bounds.getSouthWest().lng, -180, 180 );
    var maxY = getRange( bounds.getNorthEast().lat, -74, 74 );
    var minY = getRange( bounds.getSouthWest().lat, -74, 74 );
    return new BMap.Bounds( new BMap.Point( minX, minY ), new BMap.Point( maxX, maxY ) )
  };
  var getRange = function ( i, mix, max ) {
    mix && ( i = Math.max( i, mix ) );
    max && ( i = Math.min( i, max ) );
    return i
  };
  var isArray = function ( source ) {
    return "[object Array]" === Object.prototype.toString.call( source )
  };
  var indexOf = function ( item, source ) {
    var index = -1;
    if ( isArray( source ) ) {
      if ( source.indexOf ) {
        index = source.indexOf( item )
      } else {
        for ( var i = 0, m; m = source[i]; i++ ) {
          if ( m === item ) {
            index = i;
            break
          }
        }
      }
    }
    return index
  };
  var MarkerClusterer = BMapLib.MarkerClusterer = function ( map, options ) {
    if ( !map ) {
      return
    }
    this._map = map;
    this._markers = [];
    this._clusters = [];
    var opts = options || {};
    this._gridSize = opts.gridSize || 60;
    this._maxZoom = opts.maxZoom || 18;
    this._minClusterSize = opts.minClusterSize || 2;
    this._isAverageCenter = false;
    if ( opts.isAverageCenter != undefined ) {
      this._isAverageCenter = opts.isAverageCenter
    }
    this._styles = opts.styles || [];
    var that = this;
    this._map.addEventListener( "zoomend",
    function () {
      that._redraw();
      if ( that._infoWindowMarker ) {
        var windowType = that._infoWindow.toString();
        if ( windowType == "[object Overlay]" ) { } else {
          if ( windowType == "[object InfoWindow]" ) {
            that.showInfoWindowOnCluster( that._infoWindowMarker, that._infoWindow )
          }
        }
      }
    } );
    this._map.addEventListener( "moveend",
    function () {
      that._redraw()
    } );
    this.clickCallback = opts.clickCallback || null;
    this.clusterPopupMaker = opts.clusterPopupMaker || null;
    this._oldSelectedCluster = null;
    this._infoWindowMarker = null;
    this._infoWindow = null;
    this.timeoutHandler = null;
    var mkrs = opts.markers;
    isArray( mkrs ) && this.addMarkers( mkrs )
  };
  MarkerClusterer.prototype.addMarkers = function ( markers ) {
    for ( var i = 0, len = markers.length; i < len; i++ ) {
      this._pushMarkerTo( markers[i] )
    }
    this._createClusters()
  };
  MarkerClusterer.prototype._pushMarkerTo = function ( marker ) {
    var index = indexOf( marker, this._markers );
    if ( index === -1 ) {
      marker.isInCluster = false;
      this._markers.push( marker )
    }
  };
  MarkerClusterer.prototype.addMarker = function ( marker ) {
    this._pushMarkerTo( marker );
    this._createClusters()
  };
  MarkerClusterer.prototype._createClusters = function () {
    var mapBounds = this._map.getBounds();
    var extendedBounds = getExtendedBounds( this._map, mapBounds, this._gridSize );
    for ( var i = 0, marker; marker = this._markers[i]; i++ ) {
      if ( !marker.isInCluster && extendedBounds.containsPoint( marker.getPosition() ) ) {
        this._addToClosestCluster( marker )
      }
    }
  };
  MarkerClusterer.prototype._addToClosestCluster = function ( marker ) {
    var distance = 4000000;
    var clusterToAddTo = null;
    var position = marker.getPosition();
    for ( var i = 0, cluster; cluster = this._clusters[i]; i++ ) {
      var center = cluster.getCenter();
      if ( center ) {
        var d = this._map.getDistance( center, marker.getPosition() );
        if ( d < distance ) {
          distance = d;
          clusterToAddTo = cluster
        }
      }
    }
    if ( clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds( marker ) ) {
      clusterToAddTo.addMarker( marker )
    } else {
      var cluster = new Cluster( this );
      cluster.addMarker( marker );
      this._clusters.push( cluster )
    }
  };
  MarkerClusterer.prototype._clearLastClusters = function () {
    for ( var i = 0, cluster; cluster = this._clusters[i]; i++ ) {
      cluster.remove()
    }
    this._clusters = [];
    this._removeMarkersFromCluster()
  };
  MarkerClusterer.prototype._removeMarkersFromCluster = function () {
    for ( var i = 0, marker; marker = this._markers[i]; i++ ) {
      marker.isInCluster = false
    }
  };
  MarkerClusterer.prototype._removeMarkersFromMap = function () {
    for ( var i = 0, marker; marker = this._markers[i]; i++ ) {
      marker.isInCluster = false;
      tmplabel = marker.getLabel();
      this._map.removeOverlay( marker );
      marker.setLabel( tmplabel )
    }
  };
  MarkerClusterer.prototype._removeMarker = function ( marker ) {
    var index = indexOf( marker, this._markers );
    if ( index === -1 ) {
      return false
    }
    tmplabel = marker.getLabel();
    this._map.removeOverlay( marker );
    marker.setLabel( tmplabel );
    this._markers.splice( index, 1 );
    return true
  };
  MarkerClusterer.prototype.removeMarker = function ( marker ) {
    var success = this._removeMarker( marker );
    if ( success ) {
      this._clearLastClusters();
      this._createClusters()
    }
    return success
  };
  MarkerClusterer.prototype.removeMarkers = function ( markers ) {
    var success = false;
    for ( var i = 0; i < markers.length; i++ ) {
      var r = this._removeMarker( markers[i] );
      success = success || r
    }
    if ( success ) {
      this._clearLastClusters();
      this._createClusters()
    }
    return success
  };
  MarkerClusterer.prototype.clearMarkers = function () {
    this._clearLastClusters();
    this._removeMarkersFromMap();
    this._markers = []
  };
  MarkerClusterer.prototype._redraw = function () {
    this._clearLastClusters();
    this._createClusters()
  };
  MarkerClusterer.prototype.getGridSize = function () {
    return this._gridSize
  };
  MarkerClusterer.prototype.setGridSize = function ( size ) {
    this._gridSize = size;
    this._redraw()
  };
  MarkerClusterer.prototype.getMaxZoom = function () {
    return this._maxZoom
  };
  MarkerClusterer.prototype.setMaxZoom = function ( maxZoom ) {
    this._maxZoom = maxZoom;
    this._redraw()
  };
  MarkerClusterer.prototype.getStyles = function () {
    return this._styles
  };
  MarkerClusterer.prototype.setStyles = function ( styles ) {
    this._styles = styles;
    this._redraw()
  };
  MarkerClusterer.prototype.getMinClusterSize = function () {
    return this._minClusterSize
  };
  MarkerClusterer.prototype.setMinClusterSize = function ( size ) {
    this._minClusterSize = size;
    this._redraw()
  };
  MarkerClusterer.prototype.isAverageCenter = function () {
    return this._isAverageCenter
  };
  MarkerClusterer.prototype.getMap = function () {
    return this._map
  };
  MarkerClusterer.prototype.getMarkers = function () {
    return this._markers
  };
  MarkerClusterer.prototype.getClustersCount = function () {
    var count = 0;
    for ( var i = 0, cluster; cluster = this._clusters[i]; i++ ) {
      cluster.isReal() && count++
    }
    return count
  };
  MarkerClusterer.prototype.getContainerCluster = function ( marker ) {
    var contrainerCluster = null;
    for ( var i = 0, cluster; cluster = this._clusters[i]; i++ ) {
      if ( cluster.isMarkerInCluster( marker ) && cluster._isReal ) {
        contrainerCluster = cluster;
        break
      }
    }
    return contrainerCluster
  };
  MarkerClusterer.prototype.showInfoWindowOnCluster = function ( marker, infoWindow ) {
    if ( !marker ) {
      return
    }
    var cluster = this.getContainerCluster( marker );
    var point = null;
    var windowType = infoWindow.toString();
    if ( cluster ) {
      point = cluster.getCenter();
      if ( windowType == "[object Overlay]" ) {
        infoWindow.open( point )
      } else {
        if ( windowType == "[object InfoWindow]" ) {
          this._map.openInfoWindow( infoWindow, point )
        }
      }
      this._infoWindowMarker = marker;
      this._infoWindow = infoWindow;
      if ( this.timeoutHandler ) {
        clearTimeout( this.timeoutHandler );
        this.timeoutHandler = null
      }
      this._map.setCenter( point )
    } else {
      if ( windowType == "[object Overlay]" ) {
        infoWindow.close()
      } else {
        if ( windowType == "[object InfoWindow]" ) {
          this._map.closeInfoWindow()
        }
      }
      if ( marker ) {
        this._map.setCenter( marker.getPosition() )
      }
      var that = this;
      this.timeoutHandler = setTimeout( function () {
        that._infoWindowMarker = null;
        that._infoWindow = null
      },
      500 )
    }
  };
  MarkerClusterer.prototype.destroyInfoWindow = function () {
    this._infoWindowMarker = null;
    this._infoWindow = null
  };
  MarkerClusterer.prototype.makeClusterSelected = function ( marker ) {
    if ( this._oldSelectedCluster ) { }
    var cluster = this.getContainerCluster( marker );
    if ( cluster ) { }
  };
  function Cluster( markerClusterer ) {
    this._markerClusterer = markerClusterer;
    this._map = markerClusterer.getMap();
    this._minClusterSize = markerClusterer.getMinClusterSize();
    this._isAverageCenter = markerClusterer.isAverageCenter();
    this._center = null;
    this._markers = [];
    this._gridBounds = null;
    this._isReal = false;
    this._clusterMarker = new BMapLib.TextIconOverlay( this._center, this._markers.length, {
      styles: this._markerClusterer.getStyles()
    } )
  }
  Cluster.prototype.addMarker = function ( marker ) {
    if ( this.isMarkerInCluster( marker ) ) {
      return false
    }
    if ( !this._center ) {
      this._center = marker.getPosition();
      this.updateGridBounds()
    } else {
      if ( this._isAverageCenter ) {
        var l = this._markers.length + 1;
        var lat = ( this._center.lat * ( l - 1 ) + marker.getPosition().lat ) / l;
        var lng = ( this._center.lng * ( l - 1 ) + marker.getPosition().lng ) / l;
        this._center = new BMap.Point( lng, lat );
        this.updateGridBounds()
      }
    }
    marker.isInCluster = true;
    this._markers.push( marker );
    var len = this._markers.length;
    if ( len < this._minClusterSize ) {
      this._map.addOverlay( marker );
      return true
    } else {
      if ( len === this._minClusterSize ) {
        for ( var i = 0; i < len; i++ ) {
          tmplabel = this._markers[i].getLabel();
          this._markers[i].getMap() && this._map.removeOverlay( this._markers[i] );
          this._markers[i].setLabel( tmplabel )
        }
      }
    }
    this._map.addOverlay( this._clusterMarker );
    this._isReal = true;
    this.updateClusterMarker();
    return true
  };
  Cluster.prototype.isMarkerInCluster = function ( marker ) {
    if ( this._markers.indexOf ) {
      return this._markers.indexOf( marker ) != -1
    } else {
      for ( var i = 0, m; m = this._markers[i]; i++ ) {
        if ( m === marker ) {
          return true
        }
      }
    }
    return false
  };
  Cluster.prototype.isMarkerInClusterBounds = function ( marker ) {
    return this._gridBounds.containsPoint( marker.getPosition() )
  };
  Cluster.prototype.isReal = function ( marker ) {
    return this._isReal
  };
  Cluster.prototype.updateGridBounds = function () {
    var bounds = new BMap.Bounds( this._center, this._center );
    this._gridBounds = getExtendedBounds( this._map, bounds, this._markerClusterer.getGridSize() )
  };
  Cluster.prototype.updateClusterMarker = function () {
    if ( this._map.getZoom() > this._markerClusterer.getMaxZoom() ) {
      this._clusterMarker && this._map.removeOverlay( this._clusterMarker );
      for ( var i = 0, marker; marker = this._markers[i]; i++ ) {
        this._map.addOverlay( marker )
      }
      return
    }
    if ( this._markers.length < this._minClusterSize ) {
      this._clusterMarker.hide();
      return
    }
    if ( this._markerClusterer.clusterPopupMaker ) {
      var pois = [];
      for ( var i = 0; i < this._markers.length; i++ ) {
        pois.push( this._markers[i].poi )
      }
      var popup = this._markerClusterer.clusterPopupMaker( pois );
      var infoWindowOpt = {};
      if ( popup.size ) {
        infoWindowOpt.width = popup.size.w;
        infoWindowOpt.height = popup.size.h
      }
      if ( popup.offset ) {
        infoWindowOpt.offset = new BMap.Size( popup.offset.x, popup.offset.y )
      }
      infoWindowOpt.enableMessage = false;
      var clusterInfoWindow = new BMap.InfoWindow( popup.content, infoWindowOpt );
      this._clusterMarker.addEventListener( "mouseover",
      function () {
        this._map.openInfoWindow( clusterInfoWindow, this.getPosition() )
      } );
      this._clusterMarker.addEventListener( "mouseout",
      function () {
        this._map.closeInfoWindow()
      } )
    }
    this._clusterMarker.setPosition( this._center );
    this._clusterMarker.setText( this._markers.length );
    var thatMap = this._map;
    var thatBounds = this.getBounds();
    var that = this;
    this._clusterMarker.addEventListener( "click",
    function ( event ) {
      thatMap.setViewport( thatBounds )
    } )
  };
  Cluster.prototype.remove = function () {
    for ( var i = 0, m; m = this._markers[i]; i++ ) {
      var tmplabel = this._markers[i].getLabel();
      this._markers[i].getMap() && this._map.removeOverlay( this._markers[i] );
      this._markers[i].setLabel( tmplabel )
    }
    this._map.removeOverlay( this._clusterMarker );
    this._markers.length = 0;
    delete this._markers
  };
  Cluster.prototype.getBounds = function () {
    var bounds = new BMap.Bounds( this._center, this._center );
    for ( var i = 0, marker; marker = this._markers[i]; i++ ) {
      bounds.extend( marker.getPosition() )
    }
    return bounds
  };
  Cluster.prototype.getCenter = function () {
    return this._center
  }
} )();

( function () {
  var BMAP_ZOOM_IN = 0;
  var BMAP_ZOOM_OUT = 1;
  var RectangleZoom = BMapLib.RectangleZoom = function ( map, opts ) {
    if ( !map ) {
      return
    }
    this._map = map;
    this._opts = {
      zoomType: BMAP_ZOOM_IN,
      followText: "",
      strokeWeight: 2,
      strokeColor: "#111",
      style: "solid",
      fillColor: "#ccc",
      opacity: 0.4,
      cursor: "crosshair",
      autoClose: false
    };
    this._setOptions( opts );
    this._opts.strokeWeight = this._opts.strokeWeight <= 0 ? 1 : this._opts.strokeWeight;
    this._opts.opacity = this._opts.opacity < 0 ? 0 : this._opts.opacity > 1 ? 1 : this._opts.opacity;
    if ( this._opts.zoomType < BMAP_ZOOM_IN || this._opts.zoomType > BMAP_ZOOM_OUT ) {
      this._opts.zoomType = BMAP_ZOOM_IN
    }
    this._isOpen = false;
    this._fDiv = null;
    this._followTitle = null
  };
  RectangleZoom.prototype._setOptions = function ( opts ) {
    if ( !opts ) {
      return
    }
    for ( var p in opts ) {
      if ( typeof ( opts[p] ) != "undefined" ) {
        this._opts[p] = opts[p]
      }
    }
  };
  RectangleZoom.prototype.setStrokeColor = function ( color ) {
    if ( typeof color == "string" ) {
      this._opts.strokeColor = color;
      this._updateStyle()
    }
  };
  RectangleZoom.prototype.setLineStroke = function ( width ) {
    if ( typeof width == "number" && Math.round( width ) > 0 ) {
      this._opts.strokeWeight = Math.round( width );
      this._updateStyle()
    }
  };
  RectangleZoom.prototype.setLineStyle = function ( style ) {
    if ( style == "solid" || style == "dashed" ) {
      this._opts.style = style;
      this._updateStyle()
    }
  };
  RectangleZoom.prototype.setOpacity = function ( opacity ) {
    if ( typeof opacity == "number" && opacity >= 0 && opacity <= 1 ) {
      this._opts.opacity = opacity;
      this._updateStyle()
    }
  };
  RectangleZoom.prototype.setFillColor = function ( color ) {
    this._opts.fillColor = color;
    this._updateStyle()
  };
  RectangleZoom.prototype.setCursor = function ( cursor ) {
    this._opts.cursor = cursor;
    OperationMask.setCursor( this._opts.cursor )
  };
  RectangleZoom.prototype._updateStyle = function () {
    if ( this._fDiv ) {
      this._fDiv.style.border = [this._opts.strokeWeight, "px ", this._opts.style, " ", this._opts.color].join( "" );
      var st = this._fDiv.style,
      op = this._opts.opacity;
      st.opacity = op;
      st.MozOpacity = op;
      st.KhtmlOpacity = op;
      st.filter = "alpha(opacity=" + ( op * 100 ) + ")"
    }
  };
  RectangleZoom.prototype.getCursor = function () {
    return this._opts.cursor
  };
  RectangleZoom.prototype._bind = function () {
    this.setCursor( this._opts.cursor );
    var me = this;
    addEvent( this._map.getContainer(), "mousemove",
    function ( e ) {
      if ( !me._isOpen ) {
        return
      }
      if ( !me._followTitle ) {
        return
      }
      e = window.event || e;
      var t = e.target || e.srcElement;
      if ( t != OperationMask.getDom( me._map ) ) {
        me._followTitle.hide();
        return
      }
      if ( !me._mapMoving ) {
        me._followTitle.show()
      }
      var pt = OperationMask.getDrawPoint( e, true );
      me._followTitle.setPosition( pt )
    } );
    if ( this._opts.followText ) {
      var t = this._followTitle = new BMap.Label( this._opts.followText, {
        offset: new BMap.Size( 14, 16 )
      } );
      this._followTitle.setStyles( {
        color: "#333",
        borderColor: "#ff0103"
      } )
    }
  };
  RectangleZoom.prototype.open = function () {
    if ( this._isOpen == true ) {
      return true
    }
    if ( !!BMapLib._toolInUse ) {
      return
    }
    this._isOpen = true;
    BMapLib._toolInUse = true;
    if ( !this.binded ) {
      this._bind();
      this.binded = true
    }
    if ( this._followTitle ) {
      this._map.addOverlay( this._followTitle );
      this._followTitle.hide()
    }
    var me = this;
    var map = this._map;
    var ieVersion = 0;
    if ( /msie (\d+\.\d)/i.test( navigator.userAgent ) ) {
      ieVersion = document.documentMode || +RegExp["\x241"]
    }
    var beginDrawRect = function ( e ) {
      e = window.event || e;
      if ( e.button != 0 && !ieVersion || ieVersion && e.button != 1 ) {
        return
      }
      if ( !!ieVersion && OperationMask.getDom( map ).setCapture ) {
        OperationMask.getDom( map ).setCapture()
      }
      if ( !me._isOpen ) {
        return
      }
      me._bind.isZooming = true;
      addEvent( document, "mousemove", drawingRect );
      addEvent( document, "mouseup", endDrawRect );
      me._bind.mx = e.layerX || e.offsetX || 0;
      me._bind.my = e.layerY || e.offsetY || 0;
      me._bind.ix = e.pageX || e.clientX || 0;
      me._bind.iy = e.pageY || e.clientY || 0;
      insertHTML( OperationMask.getDom( map ), "beforeBegin", me._generateHTML() );
      me._fDiv = OperationMask.getDom( map ).previousSibling;
      me._fDiv.style.width = "0";
      me._fDiv.style.height = "0";
      me._fDiv.style.left = me._bind.mx + "px";
      me._fDiv.style.top = me._bind.my + "px";
      stopBubble( e );
      return preventDefault( e )
    };
    var drawingRect = function ( e ) {
      if ( me._isOpen == true && me._bind.isZooming == true ) {
        var e = window.event || e;
        var curX = e.pageX || e.clientX || 0;
        var curY = e.pageY || e.clientY || 0;
        var dx = me._bind.dx = curX - me._bind.ix;
        var dy = me._bind.dy = curY - me._bind.iy;
        var tw = Math.abs( dx ) - me._opts.strokeWeight;
        var th = Math.abs( dy ) - me._opts.strokeWeight;
        me._fDiv.style.width = ( tw < 0 ? 0 : tw ) + "px";
        me._fDiv.style.height = ( th < 0 ? 0 : th ) + "px";
        var mapSize = [map.getSize().width, map.getSize().height];
        if ( dx >= 0 ) {
          me._fDiv.style.right = "auto";
          me._fDiv.style.left = me._bind.mx + "px";
          if ( me._bind.mx + dx >= mapSize[0] - 2 * me._opts.strokeWeight ) {
            me._fDiv.style.width = mapSize[0] - me._bind.mx - 2 * me._opts.strokeWeight + "px";
            me._followTitle && me._followTitle.hide()
          }
        } else {
          me._fDiv.style.left = "auto";
          me._fDiv.style.right = mapSize[0] - me._bind.mx + "px";
          if ( me._bind.mx + dx <= 2 * me._opts.strokeWeight ) {
            me._fDiv.style.width = me._bind.mx - 2 * me._opts.strokeWeight + "px";
            me._followTitle && me._followTitle.hide()
          }
        }
        if ( dy >= 0 ) {
          me._fDiv.style.bottom = "auto";
          me._fDiv.style.top = me._bind.my + "px";
          if ( me._bind.my + dy >= mapSize[1] - 2 * me._opts.strokeWeight ) {
            me._fDiv.style.height = mapSize[1] - me._bind.my - 2 * me._opts.strokeWeight + "px";
            me._followTitle && me._followTitle.hide()
          }
        } else {
          me._fDiv.style.top = "auto";
          me._fDiv.style.bottom = mapSize[1] - me._bind.my + "px";
          if ( me._bind.my + dy <= 2 * me._opts.strokeWeight ) {
            me._fDiv.style.height = me._bind.my - 2 * me._opts.strokeWeight + "px";
            me._followTitle && me._followTitle.hide()
          }
        }
        stopBubble( e );
        return preventDefault( e )
      }
    };
    var endDrawRect = function ( e ) {
      if ( me._isOpen == true ) {
        removeEvent( document, "mousemove", drawingRect );
        removeEvent( document, "mouseup", endDrawRect );
        if ( !!ieVersion && OperationMask.getDom( map ).releaseCapture ) {
          OperationMask.getDom( map ).releaseCapture()
        }
        var centerX = parseInt( me._fDiv.style.left ) + parseInt( me._fDiv.style.width ) / 2;
        var centerY = parseInt( me._fDiv.style.top ) + parseInt( me._fDiv.style.height ) / 2;
        var mapSize = [map.getSize().width, map.getSize().height];
        if ( isNaN( centerX ) ) {
          centerX = mapSize[0] - parseInt( me._fDiv.style.right ) - parseInt( me._fDiv.style.width ) / 2
        }
        if ( isNaN( centerY ) ) {
          centerY = mapSize[1] - parseInt( me._fDiv.style.bottom ) - parseInt( me._fDiv.style.height ) / 2
        }
        var ratio = Math.min( mapSize[0] / Math.abs( me._bind.dx ), mapSize[1] / Math.abs( me._bind.dy ) );
        ratio = Math.floor( ratio );
        var px1 = new BMap.Pixel( centerX - parseInt( me._fDiv.style.width ) / 2, centerY - parseInt( me._fDiv.style.height ) / 2 );
        var px2 = new BMap.Pixel( centerX + parseInt( me._fDiv.style.width ) / 2, centerY + parseInt( me._fDiv.style.height ) / 2 );
        if ( px1.x == px2.x && px1.y == px2.y ) {
          me._bind.isZooming = false;
          me._fDiv.parentNode.removeChild( me._fDiv );
          me._fDiv = null;
          return
        }
        var pt1 = map.pixelToPoint( px1 );
        var pt2 = map.pixelToPoint( px2 );
        var bds = new BMap.Bounds( pt1, pt2 );
        delete me._bind.dx;
        delete me._bind.dy;
        delete me._bind.ix;
        delete me._bind.iy;
        if ( !isNaN( ratio ) ) {
          if ( me._opts.zoomType == BMAP_ZOOM_IN ) {
            targetZoomLv = Math.round( map.getZoom() + ( Math.log( ratio ) / Math.log( 2 ) ) );
            if ( targetZoomLv < map.getZoom() ) {
              targetZoomLv = map.getZoom()
            }
          } else {
            targetZoomLv = Math.round( map.getZoom() + ( Math.log( 1 / ratio ) / Math.log( 2 ) ) );
            if ( targetZoomLv > map.getZoom() ) {
              targetZoomLv = map.getZoom()
            }
          }
        } else {
          targetZoomLv = map.getZoom() + ( me._opts.zoomType == BMAP_ZOOM_IN ? 1 : -1 )
        }
        var targetCenterPt = map.pixelToPoint( {
          x: centerX,
          y: centerY
        },
        map.getZoom() );
        map.centerAndZoom( targetCenterPt, targetZoomLv );
        var pt = OperationMask.getDrawPoint( e );
        if ( me._followTitle ) {
          me._followTitle.setPosition( pt );
          me._followTitle.show()
        }
        me._bind.isZooming = false;
        me._fDiv.parentNode.removeChild( me._fDiv );
        me._fDiv = null
      }
      var southWestPoint = bds.getSouthWest(),
      northEastPoint = bds.getNorthEast(),
      southEastPoint = new BMap.Point( northEastPoint.lng, southWestPoint.lat ),
      northWestPoint = new BMap.Point( southWestPoint.lng, northEastPoint.lat ),
      rect = new BMap.Polygon( [southWestPoint, northWestPoint, northEastPoint, southEastPoint] );
      rect.setStrokeWeight( 2 );
      rect.setStrokeOpacity( 0.3 );
      rect.setStrokeColor( "#111" );
      rect.setFillColor( "" );
      map.addOverlay( rect );
      new Animation( {
        duration: 240,
        fps: 20,
        delay: 500,
        render: function ( t ) {
          var opacity = 0.3 * ( 1 - t );
          rect.setStrokeOpacity( opacity )
        },
        finish: function () {
          map.removeOverlay( rect );
          rect = null
        }
      } );
      if ( me._opts.autoClose ) {
        setTimeout( function () {
          if ( me._isOpen == true ) {
            me.close()
          }
        },
        70 )
      }
      stopBubble( e );
      return preventDefault( e )
    };
    OperationMask.show( this._map );
    this.setCursor( this._opts.cursor );
    if ( !this._isBeginDrawBinded ) {
      addEvent( OperationMask.getDom( this._map ), "mousedown", beginDrawRect );
      this._isBeginDrawBinded = true
    }
    return true
  };
  RectangleZoom.prototype.close = function () {
    if ( !this._isOpen ) {
      return
    }
    this._isOpen = false;
    BMapLib._toolInUse = false;
    this._followTitle && this._followTitle.hide();
    OperationMask.hide()
  };
  RectangleZoom.prototype._generateHTML = function () {
    return ["<div style='position:absolute;z-index:300;border:", this._opts.strokeWeight, "px ", this._opts.style, " ", this._opts.strokeColor, "; opacity:", this._opts.opacity, "; background: ", this._opts.fillColor, "; filter:alpha(opacity=", Math.round( this._opts.opacity * 100 ), "); width:0; height:0; font-size:0'></div>"].join( "" )
  };
  function insertHTML( element, position, html ) {
    var range,
    begin;
    if ( element.insertAdjacentHTML ) {
      element.insertAdjacentHTML( position, html )
    } else {
      range = element.ownerDocument.createRange();
      position = position.toUpperCase();
      if ( position == "AFTERBEGIN" || position == "BEFOREEND" ) {
        range.selectNodeContents( element );
        range.collapse( position == "AFTERBEGIN" )
      } else {
        begin = position == "BEFOREBEGIN";
        range[begin ? "setStartBefore" : "setEndAfter"]( element );
        range.collapse( begin )
      }
      range.insertNode( range.createContextualFragment( html ) )
    }
    return element
  }
  function beforeEndHTML( parent, chlidHTML ) {
    insertHTML( parent, "beforeEnd", chlidHTML );
    return parent.lastChild
  }
  function stopBubble( e ) {
    var e = window.event || e;
    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true
  }
  function preventDefault( e ) {
    var e = window.event || e;
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
    return false
  }
  function addEvent( element, type, listener ) {
    if ( !element ) {
      return
    }
    type = type.replace( /^on/i, "" ).toLowerCase();
    if ( element.addEventListener ) {
      element.addEventListener( type, listener, false )
    } else {
      if ( element.attachEvent ) {
        element.attachEvent( "on" + type, listener )
      }
    }
  }
  function removeEvent( element, type, listener ) {
    if ( !element ) {
      return
    }
    type = type.replace( /^on/i, "" ).toLowerCase();
    if ( element.removeEventListener ) {
      element.removeEventListener( type, listener, false )
    } else {
      if ( element.detachEvent ) {
        element.detachEvent( "on" + type, listener )
      }
    }
  }
  var OperationMask = {
    _map: null,
    _html: "<div style='background:transparent url(http://api.map.baidu.com/images/blank.gif);position:absolute;left:0;top:0;width:100%;height:100%;z-index:1000' unselectable='on'></div>",
    _maskElement: null,
    _cursor: "default",
    _inUse: false,
    show: function ( map ) {
      if ( !this._map ) {
        this._map = map
      }
      this._inUse = true;
      if ( !this._maskElement ) {
        this._createMask( map )
      }
      this._maskElement.style.display = "block"
    },
    _createMask: function ( map ) {
      this._map = map;
      if ( !this._map ) {
        return
      }
      var elem = this._maskElement = beforeEndHTML( this._map.getContainer(), this._html );
      var stopAndPrevent = function ( e ) {
        stopBubble( e );
        return preventDefault( e )
      };
      addEvent( elem, "mouseup",
      function ( e ) {
        if ( e.button == 2 ) {
          stopAndPrevent( e )
        }
      } );
      addEvent( elem, "contextmenu", stopAndPrevent );
      elem.style.display = "none"
    },
    getDrawPoint: function ( e, n ) {
      e = window.event || e;
      var x = e.layerX || e.offsetX || 0;
      var y = e.layerY || e.offsetY || 0;
      var t = e.target || e.srcElement;
      if ( t != OperationMask.getDom( this._map ) && n == true ) {
        while ( t && t != this._map.getContainer() ) {
          if ( !( t.clientWidth == 0 && t.clientHeight == 0 && t.offsetParent && t.offsetParent.nodeName.toLowerCase() == "td" ) ) {
            x += t.offsetLeft;
            y += t.offsetTop
          }
          t = t.offsetParent
        }
      }
      if ( t != OperationMask.getDom( this._map ) && t != this._map.getContainer() ) {
        return
      }
      if ( typeof x === "undefined" || typeof y === "undefined" ) {
        return
      }
      if ( isNaN( x ) || isNaN( y ) ) {
        return
      }
      return this._map.pixelToPoint( new BMap.Pixel( x, y ) )
    },
    hide: function () {
      if ( !this._map ) {
        return
      }
      this._inUse = false;
      if ( this._maskElement ) {
        this._maskElement.style.display = "none"
      }
    },
    getDom: function ( map ) {
      if ( !this._maskElement ) {
        this._createMask( map )
      }
      return this._maskElement
    },
    setCursor: function ( cursor ) {
      this._cursor = cursor || "default";
      if ( this._maskElement ) {
        this._maskElement.style.cursor = this._cursor
      }
    }
  };
  function Animation( opts ) {
    var defaultOptions = {
      duration: 1000,
      fps: 30,
      delay: 0,
      transition: Transitions.linear,
      onStop: function () { }
    };
    if ( opts ) {
      for ( var i in opts ) {
        defaultOptions[i] = opts[i]
      }
    }
    this._opts = defaultOptions;
    if ( defaultOptions.delay ) {
      var me = this;
      setTimeout( function () {
        me._beginTime = new Date().getTime();
        me._endTime = me._beginTime + me._opts.duration;
        me._launch()
      },
      defaultOptions.delay )
    } else {
      this._beginTime = new Date().getTime();
      this._endTime = this._beginTime + this._opts.duration;
      this._launch()
    }
  }
  Animation.prototype._launch = function () {
    var me = this;
    var now = new Date().getTime();
    if ( now >= me._endTime ) {
      if ( typeof me._opts.render == "function" ) {
        me._opts.render( me._opts.transition( 1 ) )
      }
      if ( typeof me._opts.finish == "function" ) {
        me._opts.finish()
      }
      return
    }
    me.schedule = me._opts.transition(( now - me._beginTime ) / me._opts.duration );
    if ( typeof me._opts.render == "function" ) {
      me._opts.render( me.schedule )
    }
    if ( !me.terminative ) {
      me._timer = setTimeout( function () {
        me._launch()
      },
      1000 / me._opts.fps )
    }
  };
  var Transitions = {
    linear: function ( t ) {
      return t
    },
    reverse: function ( t ) {
      return 1 - t
    },
    easeInQuad: function ( t ) {
      return t * t
    },
    easeInCubic: function ( t ) {
      return Math.pow( t, 3 )
    },
    easeOutQuad: function ( t ) {
      return -( t * ( t - 2 ) )
    },
    easeOutCubic: function ( t ) {
      return Math.pow(( t - 1 ), 3 ) + 1
    },
    easeInOutQuad: function ( t ) {
      if ( t < 0.5 ) {
        return t * t * 2
      } else {
        return -2 * ( t - 2 ) * t - 1
      }
    },
    easeInOutCubic: function ( t ) {
      if ( t < 0.5 ) {
        return Math.pow( t, 3 ) * 4
      } else {
        return Math.pow( t - 1, 3 ) * 4 + 1
      }
    },
    easeInOutSine: function ( t ) {
      return ( 1 - Math.cos( Math.PI * t ) ) / 2
    }
  }
} )();

/**
 * @fileoverview 百度地图的鼠标绘制工具，对外开放。
 * 允许用户在地图上点击完成鼠标绘制的功能。
 * 使用者可以自定义所绘制结果的相关样式，例如线宽、颜色、测线段距离、面积等等。
 * 主入口类是<a href="symbols/BMapLib.DrawingManager.html">DrawingManager</a>，
 * 基于Baidu Map API 1.4。
 *
 * @author Baidu Map Api Group 
 * @version 1.4
 * 绘制的矩形和多边形增加关闭按钮   @20140429 by wutiansheng 
 */

/**
 * 定义常量, 绘制的模式
 * @final {Number} DrawingType
 */
var BMAP_DRAWING_MARKER = "marker",     // 鼠标画点模式
    BMAP_DRAWING_POLYLINE = "polyline",   // 鼠标画线模式
    BMAP_DRAWING_CIRCLE = "circle",     // 鼠标画圆模式
    BMAP_DRAWING_RECTANGLE = "rectangle",  // 鼠标画矩形模式
    BMAP_DRAWING_POLYGON = "polygon";    // 鼠标画多边形模式

( function () {

  /**
   * 声明baidu包
   */
  var baidu = baidu || { guid: "$BAIDU$" };
  ( function () {
    // 一些页面级别唯一的属性，需要挂载在window[baidu.guid]上
    window[baidu.guid] = {};

    /**
     * 将源对象的所有属性拷贝到目标对象中
     * @name baidu.extend
     * @function
     * @grammar baidu.extend(target, source)
     * @param {Object} target 目标对象
     * @param {Object} source 源对象
     * @returns {Object} 目标对象
     */
    baidu.extend = function ( target, source ) {
      for ( var p in source ) {
        if ( source.hasOwnProperty( p ) ) {
          target[p] = source[p];
        }
      }
      return target;
    };

    /**
     * @ignore
     * @namespace
     * @baidu.lang 对语言层面的封装，包括类型判断、模块扩展、继承基类以及对象自定义事件的支持。
     * @property guid 对象的唯一标识
     */
    baidu.lang = baidu.lang || {};

    /**
     * 返回一个当前页面的唯一标识字符串。
     * @function
     * @grammar baidu.lang.guid()
     * @returns {String} 当前页面的唯一标识字符串
     */
    baidu.lang.guid = function () {
      return "TANGRAM__" + ( window[baidu.guid]._counter++ ).toString( 36 );
    };

    window[baidu.guid]._counter = window[baidu.guid]._counter || 1;

    /**
     * 所有类的实例的容器
     * key为每个实例的guid
     */
    window[baidu.guid]._instances = window[baidu.guid]._instances || {};

    /**
     * Tangram继承机制提供的一个基类，用户可以通过继承baidu.lang.Class来获取它的属性及方法。
     * @function
     * @name baidu.lang.Class
     * @grammar baidu.lang.Class(guid)
     * @param {string} guid	对象的唯一标识
     * @meta standard
     * @remark baidu.lang.Class和它的子类的实例均包含一个全局唯一的标识guid。
     * guid是在构造函数中生成的，因此，继承自baidu.lang.Class的类应该直接或者间接调用它的构造函数。<br>
     * baidu.lang.Class的构造函数中产生guid的方式可以保证guid的唯一性，及每个实例都有一个全局唯一的guid。
     */
    baidu.lang.Class = function ( guid ) {
      this.guid = guid || baidu.lang.guid();
      window[baidu.guid]._instances[this.guid] = this;
    };

    window[baidu.guid]._instances = window[baidu.guid]._instances || {};

    /**
     * 判断目标参数是否string类型或String对象
     * @name baidu.lang.isString
     * @function
     * @grammar baidu.lang.isString(source)
     * @param {Any} source 目标参数
     * @shortcut isString
     * @meta standard
     *             
     * @returns {boolean} 类型判断结果
     */
    baidu.lang.isString = function ( source ) {
      return '[object String]' == Object.prototype.toString.call( source );
    };

    /**
     * 判断目标参数是否为function或Function实例
     * @name baidu.lang.isFunction
     * @function
     * @grammar baidu.lang.isFunction(source)
     * @param {Any} source 目标参数
     * @returns {boolean} 类型判断结果
     */
    baidu.lang.isFunction = function ( source ) {
      return '[object Function]' == Object.prototype.toString.call( source );
    };

    /**
     * 重载了默认的toString方法，使得返回信息更加准确一些。
     * @return {string} 对象的String表示形式
     */
    baidu.lang.Class.prototype.toString = function () {
      return "[object " + ( this._className || "Object" ) + "]";
    };

    /**
     * 释放对象所持有的资源，主要是自定义事件。
     * @name dispose
     * @grammar obj.dispose()
     */
    baidu.lang.Class.prototype.dispose = function () {
      delete window[baidu.guid]._instances[this.guid];
      for ( var property in this ) {
        if ( !baidu.lang.isFunction( this[property] ) ) {
          delete this[property];
        }
      }
      this.disposed = true;
    };

    /**
     * 自定义的事件对象。
     * @function
     * @name baidu.lang.Event
     * @grammar baidu.lang.Event(type[, target])
     * @param {string} type	 事件类型名称。为了方便区分事件和一个普通的方法，事件类型名称必须以"on"(小写)开头。
     * @param {Object} [target]触发事件的对象
     * @meta standard
     * @remark 引入该模块，会自动为Class引入3个事件扩展方法：addEventListener、removeEventListener和dispatchEvent。
     * @see baidu.lang.Class
     */
    baidu.lang.Event = function ( type, target ) {
      this.type = type;
      this.returnValue = true;
      this.target = target || null;
      this.currentTarget = null;
    };

    /**
     * 注册对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
     * @grammar obj.addEventListener(type, handler[, key])
     * @param 	{string}   type         自定义事件的名称
     * @param 	{Function} handler      自定义事件被触发时应该调用的回调函数
     * @param 	{string}   [key]		为事件监听函数指定的名称，可在移除时使用。如果不提供，方法会默认为它生成一个全局唯一的key。
     * @remark 	事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，即"click"和"onclick"会被认为是同一种事件。 
     */
    baidu.lang.Class.prototype.addEventListener = function ( type, handler, key ) {
      if ( !baidu.lang.isFunction( handler ) ) {
        return;
      }
      !this.__listeners && ( this.__listeners = {} );
      var t = this.__listeners, id;
      if ( typeof key == "string" && key ) {
        if ( /[^\w\-]/.test( key ) ) {
          throw ( "nonstandard key:" + key );
        } else {
          handler.hashCode = key;
          id = key;
        }
      }
      type.indexOf( "on" ) != 0 && ( type = "on" + type );
      typeof t[type] != "object" && ( t[type] = {} );
      id = id || baidu.lang.guid();
      handler.hashCode = id;
      t[type][id] = handler;
    };

    /**
     * 移除对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
     * @grammar obj.removeEventListener(type, handler)
     * @param {string}   type     事件类型
     * @param {Function|string} handler  要移除的事件监听函数或者监听函数的key
     * @remark 	如果第二个参数handler没有被绑定到对应的自定义事件中，什么也不做。
     */
    baidu.lang.Class.prototype.removeEventListener = function ( type, handler ) {
      if ( baidu.lang.isFunction( handler ) ) {
        handler = handler.hashCode;
      } else if ( !baidu.lang.isString( handler ) ) {
        return;
      }
      !this.__listeners && ( this.__listeners = {} );
      type.indexOf( "on" ) != 0 && ( type = "on" + type );
      var t = this.__listeners;
      if ( !t[type] ) {
        return;
      }
      t[type][handler] && delete t[type][handler];
    };

    /**
     * 派发自定义事件，使得绑定到自定义事件上面的函数都会被执行。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
     * @grammar obj.dispatchEvent(event, options)
     * @param {baidu.lang.Event|String} event 	Event对象，或事件名称(1.1.1起支持)
     * @param {Object} options 扩展参数,所含属性键值会扩展到Event对象上(1.2起支持)
     * @remark 处理会调用通过addEventListenr绑定的自定义事件回调函数之外，还会调用直接绑定到对象上面的自定义事件。
     * 例如：<br>
     * myobj.onMyEvent = function(){}<br>
     * myobj.addEventListener("onMyEvent", function(){});
     */
    baidu.lang.Class.prototype.dispatchEvent = function ( event, options ) {
      if ( baidu.lang.isString( event ) ) {
        event = new baidu.lang.Event( event );
      }
      !this.__listeners && ( this.__listeners = {} );
      options = options || {};
      for ( var i in options ) {
        event[i] = options[i];
      }
      var i, t = this.__listeners, p = event.type;
      event.target = event.target || this;
      event.currentTarget = this;
      p.indexOf( "on" ) != 0 && ( p = "on" + p );
      baidu.lang.isFunction( this[p] ) && this[p].apply( this, arguments );
      if ( typeof t[p] == "object" ) {
        for ( i in t[p] ) {
          t[p][i].apply( this, arguments );
        }
      }
      return event.returnValue;
    };

    /**
     * 为类型构造器建立继承关系
     * @name baidu.lang.inherits
     * @function
     * @grammar baidu.lang.inherits(subClass, superClass[, className])
     * @param {Function} subClass 子类构造器
     * @param {Function} superClass 父类构造器
     * @param {string} className 类名标识
     * @remark 使subClass继承superClass的prototype，
     * 因此subClass的实例能够使用superClass的prototype中定义的所有属性和方法。<br>
     * 这个函数实际上是建立了subClass和superClass的原型链集成，并对subClass进行了constructor修正。<br>
     * <strong>注意：如果要继承构造函数，需要在subClass里面call一下，具体见下面的demo例子</strong>
     * @shortcut inherits
     * @meta standard
     * @see baidu.lang.Class
     */
    baidu.lang.inherits = function ( subClass, superClass, className ) {
      var key, proto,
          selfProps = subClass.prototype,
          clazz = new Function();
      clazz.prototype = superClass.prototype;
      proto = subClass.prototype = new clazz();
      for ( key in selfProps ) {
        proto[key] = selfProps[key];
      }
      subClass.prototype.constructor = subClass;
      subClass.superClass = superClass.prototype;

      if ( "string" == typeof className ) {
        proto._className = className;
      }
    };

    /**
     * @ignore
     * @namespace baidu.dom 操作dom的方法。
     */
    baidu.dom = baidu.dom || {};

    /**
     * 从文档中获取指定的DOM元素
     * 
     * @param {string|HTMLElement} id 元素的id或DOM元素
     * @meta standard
     * @return {HTMLElement} DOM元素，如果不存在，返回null，如果参数不合法，直接返回参数
     */
    baidu._g = baidu.dom._g = function ( id ) {
      if ( baidu.lang.isString( id ) ) {
        return document.getElementById( id );
      }
      return id;
    };

    /**
     * 从文档中获取指定的DOM元素
     * @name baidu.dom.g
     * @function
     * @grammar baidu.dom.g(id)
     * @param {string|HTMLElement} id 元素的id或DOM元素
     * @meta standard
     *             
     * @returns {HTMLElement|null} 获取的元素，查找不到时返回null,如果参数不合法，直接返回参数
     */
    baidu.g = baidu.dom.g = function ( id ) {
      if ( 'string' == typeof id || id instanceof String ) {
        return document.getElementById( id );
      } else if ( id && id.nodeName && ( id.nodeType == 1 || id.nodeType == 9 ) ) {
        return id;
      }
      return null;
    };

    /**
     * 在目标元素的指定位置插入HTML代码
     * @name baidu.dom.insertHTML
     * @function
     * @grammar baidu.dom.insertHTML(element, position, html)
     * @param {HTMLElement|string} element 目标元素或目标元素的id
     * @param {string} position 插入html的位置信息，取值为beforeBegin,afterBegin,beforeEnd,afterEnd
     * @param {string} html 要插入的html
     * @remark
     * 
     * 对于position参数，大小写不敏感<br>
     * 参数的意思：beforeBegin&lt;span&gt;afterBegin   this is span! beforeEnd&lt;/span&gt; afterEnd <br />
     * 此外，如果使用本函数插入带有script标签的HTML字符串，script标签对应的脚本将不会被执行。
     * 
     * @shortcut insertHTML
     * @meta standard
     *             
     * @returns {HTMLElement} 目标元素
     */
    baidu.insertHTML = baidu.dom.insertHTML = function ( element, position, html ) {
      element = baidu.dom.g( element );
      var range, begin;

      if ( element.insertAdjacentHTML ) {
        element.insertAdjacentHTML( position, html );
      } else {
        // 这里不做"undefined" != typeof(HTMLElement) && !window.opera判断，其它浏览器将出错？！
        // 但是其实做了判断，其它浏览器下等于这个函数就不能执行了
        range = element.ownerDocument.createRange();
        // FF下range的位置设置错误可能导致创建出来的fragment在插入dom树之后html结构乱掉
        // 改用range.insertNode来插入html, by wenyuxiang @ 2010-12-14.
        position = position.toUpperCase();
        if ( position == 'AFTERBEGIN' || position == 'BEFOREEND' ) {
          range.selectNodeContents( element );
          range.collapse( position == 'AFTERBEGIN' );
        } else {
          begin = position == 'BEFOREBEGIN';
          range[begin ? 'setStartBefore' : 'setEndAfter']( element );
          range.collapse( begin );
        }
        range.insertNode( range.createContextualFragment( html ) );
      }
      return element;
    };

    /**
     * 为目标元素添加className
     * @name baidu.dom.addClass
     * @function
     * @grammar baidu.dom.addClass(element, className)
     * @param {HTMLElement|string} element 目标元素或目标元素的id
     * @param {string} className 要添加的className，允许同时添加多个class，中间使用空白符分隔
     * @remark
     * 使用者应保证提供的className合法性，不应包含不合法字符，className合法字符参考：http://www.w3.org/TR/CSS2/syndata.html。
     * @shortcut addClass
     * @meta standard
     * 	            
     * @returns {HTMLElement} 目标元素
     */
    baidu.ac = baidu.dom.addClass = function ( element, className ) {
      element = baidu.dom.g( element );
      var classArray = className.split( /\s+/ ),
          result = element.className,
          classMatch = " " + result + " ",
          i = 0,
          l = classArray.length;

      for ( ; i < l; i++ ) {
        if ( classMatch.indexOf( " " + classArray[i] + " " ) < 0 ) {
          result += ( result ? ' ' : '' ) + classArray[i];
        }
      }

      element.className = result;
      return element;
    };

    /**
     * @ignore
     * @namespace baidu.event 屏蔽浏览器差异性的事件封装。
     * @property target 	事件的触发元素
     * @property pageX 		鼠标事件的鼠标x坐标
     * @property pageY 		鼠标事件的鼠标y坐标
     * @property keyCode 	键盘事件的键值
     */
    baidu.event = baidu.event || {};

    /**
     * 事件监听器的存储表
     * @private
     * @meta standard
     */
    baidu.event._listeners = baidu.event._listeners || [];

    /**
     * 为目标元素添加事件监听器
     * @name baidu.event.on
     * @function
     * @grammar baidu.event.on(element, type, listener)
     * @param {HTMLElement|string|window} element 目标元素或目标元素id
     * @param {string} type 事件类型
     * @param {Function} listener 需要添加的监听器
     * @remark
     *  1. 不支持跨浏览器的鼠标滚轮事件监听器添加<br>
     *  2. 改方法不为监听器灌入事件对象，以防止跨iframe事件挂载的事件对象获取失败            
     * @shortcut on
     * @meta standard
     * @see baidu.event.un
     *             
     * @returns {HTMLElement|window} 目标元素
     */
    baidu.on = baidu.event.on = function ( element, type, listener ) {
      type = type.replace( /^on/i, '' );
      element = baidu._g( element );
      var realListener = function ( ev ) {
        // 1. 这里不支持EventArgument,  原因是跨frame的事件挂载
        // 2. element是为了修正this
        listener.call( element, ev );
      },
      lis = baidu.event._listeners,
      filter = baidu.event._eventFilter,
      afterFilter,
      realType = type;
      type = type.toLowerCase();
      // filter过滤
      if ( filter && filter[type] ) {
        afterFilter = filter[type]( element, type, realListener );
        realType = afterFilter.type;
        realListener = afterFilter.listener;
      }
      // 事件监听器挂载
      if ( element.addEventListener ) {
        element.addEventListener( realType, realListener, false );
      } else if ( element.attachEvent ) {
        element.attachEvent( 'on' + realType, realListener );
      }

      // 将监听器存储到数组中
      lis[lis.length] = [element, type, listener, realListener, realType];
      return element;
    };

    /**
     * 为目标元素移除事件监听器
     * @name baidu.event.un
     * @function
     * @grammar baidu.event.un(element, type, listener)
     * @param {HTMLElement|string|window} element 目标元素或目标元素id
     * @param {string} type 事件类型
     * @param {Function} listener 需要移除的监听器
     * @shortcut un
     * @meta standard
     *             
     * @returns {HTMLElement|window} 目标元素
     */
    baidu.un = baidu.event.un = function ( element, type, listener ) {
      element = baidu._g( element );
      type = type.replace( /^on/i, '' ).toLowerCase();

      var lis = baidu.event._listeners,
          len = lis.length,
          isRemoveAll = !listener,
          item,
          realType, realListener;

      //如果将listener的结构改成json
      //可以节省掉这个循环，优化性能
      //但是由于un的使用频率并不高，同时在listener不多的时候
      //遍历数组的性能消耗不会对代码产生影响
      //暂不考虑此优化
      while ( len-- ) {
        item = lis[len];

        // listener存在时，移除element的所有以listener监听的type类型事件
        // listener不存在时，移除element的所有type类型事件
        if ( item[1] === type
            && item[0] === element
            && ( isRemoveAll || item[2] === listener ) ) {
          realType = item[4];
          realListener = item[3];
          if ( element.removeEventListener ) {
            element.removeEventListener( realType, realListener, false );
          } else if ( element.detachEvent ) {
            element.detachEvent( 'on' + realType, realListener );
          }
          lis.splice( len, 1 );
        }
      }
      return element;
    };

    /**
     * 获取event事件,解决不同浏览器兼容问题
     * @param {Event}
     * @return {Event}
     */
    baidu.getEvent = baidu.event.getEvent = function ( event ) {
      return window.event || event;
    }

    /**
     * 获取event.target,解决不同浏览器兼容问题
     * @param {Event}
     * @return {Target}
     */
    baidu.getTarget = baidu.event.getTarget = function ( event ) {
      var event = baidu.getEvent( event );
      return event.target || event.srcElement;
    }

    /**
     * 阻止事件的默认行为
     * @name baidu.event.preventDefault
     * @function
     * @grammar baidu.event.preventDefault(event)
     * @param {Event} event 事件对象
     * @meta standard
     */
    baidu.preventDefault = baidu.event.preventDefault = function ( event ) {
      var event = baidu.getEvent( event );
      if ( event.preventDefault ) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
    };

    /**
     * 停止事件冒泡传播
     * @param {Event}
     */
    baidu.stopBubble = baidu.event.stopBubble = function ( event ) {
      event = baidu.getEvent( event );
      event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    }

  } )();

  //用来存储用户实例化出来的drawingmanager对象
  var instances = [];

  /** 
   * @exports DrawingManager as BMapLib.DrawingManager 
   */
  var DrawingManager =
      /**
       * DrawingManager类的构造函数
       * @class 鼠标绘制管理类，实现鼠标绘制管理的<b>入口</b>。
       * 实例化该类后，即可调用该类提供的open
       * 方法开启绘制模式状态。
       * 也可加入工具栏进行选择操作。
       * 
       * @constructor
       * @param {Map} map Baidu map的实例对象
       * @param {Json Object} opts 可选的输入参数，非必填项。可输入选项包括：<br />
       * {"<b>isOpen</b>" : {Boolean} 是否开启绘制模式
       * <br />"<b>enableDrawingTool</b>" : {Boolean} 是否添加绘制工具栏控件，默认不添加
       * <br />"<b>drawingToolOptions</b>" : {Json Object} 可选的输入参数，非必填项。可输入选项包括
       * <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"<b>anchor</b>" : {ControlAnchor} 停靠位置、默认左上角
       * <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"<b>offset</b>" : {Size} 偏移值。
       * <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"<b>scale</b>" : {Number} 工具栏的缩放比例,默认为1
       * <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"<b>drawingModes</b>" : {DrawingType<Array>} 工具栏上可以选择出现的绘制模式,将需要显示的DrawingType以数组型形式传入，如[BMAP_DRAWING_MARKER, BMAP_DRAWING_CIRCLE] 将只显示画点和画圆的选项
       * <br />"<b>enableCalculate</b>" : {Boolean} 绘制是否进行测距(画线时候)、测面(画圆、多边形、矩形)
       * <br />"<b>markerOptions</b>" : {CircleOptions} 所画的点的可选参数，参考api中的<a href="http://developer.baidu.com/map/reference/index.php?title=Class:%E6%80%BB%E7%B1%BB/%E8%A6%86%E7%9B%96%E7%89%A9%E7%B1%BB">对应类</a>
       * <br />"<b>circleOptions</b>" : {CircleOptions} 所画的圆的可选参数，参考api中的<a href="http://developer.baidu.com/map/reference/index.php?title=Class:%E6%80%BB%E7%B1%BB/%E8%A6%86%E7%9B%96%E7%89%A9%E7%B1%BB">对应类</a>
       * <br />"<b>polylineOptions</b>" : {CircleOptions} 所画的线的可选参数，参考api中的<a href="http://developer.baidu.com/map/reference/index.php?title=Class:%E6%80%BB%E7%B1%BB/%E8%A6%86%E7%9B%96%E7%89%A9%E7%B1%BB">对应类</a>
       * <br />"<b>polygonOptions</b>" : {PolygonOptions} 所画的多边形的可选参数，参考api中的<a href="http://developer.baidu.com/map/reference/index.php?title=Class:%E6%80%BB%E7%B1%BB/%E8%A6%86%E7%9B%96%E7%89%A9%E7%B1%BB">对应类</a>
       * <br />"<b>rectangleOptions</b>" : {PolygonOptions} 所画的矩形的可选参数，参考api中的<a href="http://developer.baidu.com/map/reference/index.php?title=Class:%E6%80%BB%E7%B1%BB/%E8%A6%86%E7%9B%96%E7%89%A9%E7%B1%BB">对应类</a>
       *
       * @example <b>参考示例：</b><br />
       * var map = new BMap.Map("container");<br />map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);<br />
       * var myDrawingManagerObject = new BMapLib.DrawingManager(map, {isOpen: true, 
       *     drawingType: BMAP_DRAWING_MARKER, enableDrawingTool: true,
       *     enableCalculate: false,
       *     drawingToolOptions: {
       *         anchor: BMAP_ANCHOR_TOP_LEFT,
       *         offset: new BMap.Size(5, 5),
       *         drawingTypes : [
       *             BMAP_DRAWING_MARKER,
       *             BMAP_DRAWING_CIRCLE,
       *             BMAP_DRAWING_POLYLINE,
       *             BMAP_DRAWING_POLYGON,
       *             BMAP_DRAWING_RECTANGLE 
       *          ]
       *     },
       *     polylineOptions: {
       *         strokeColor: "#333"
       *     });
       */
      BMapLib.DrawingManager = function ( map, opts ) {
        if ( !map ) {
          return;
        }
        instances.push( this );

        opts = opts || {};

        this._initialize( map, opts );
      }

  // 通过baidu.lang下的inherits方法，让DrawingManager继承baidu.lang.Class
  baidu.lang.inherits( DrawingManager, baidu.lang.Class, "DrawingManager" );

  /**
   * 开启地图的绘制模式
   *
   * @example <b>参考示例：</b><br />
   * myDrawingManagerObject.open();
   */
  DrawingManager.prototype.open = function () {
    // 判断绘制状态是否已经开启
    if ( this._isOpen == true ) {
      return true;
    }
    closeInstanceExcept( this );

    this._open();
  }

  /**
   * 关闭地图的绘制状态
   *
   * @example <b>参考示例：</b><br />
   * myDrawingManagerObject.close();
   */
  DrawingManager.prototype.close = function () {

    // 判断绘制状态是否已经开启
    if ( this._isOpen == false ) {
      return true;
    }

    this._close();
  }

  /**
   * 设置当前的绘制模式，参数DrawingType，为5个可选常量:
   * <br/>BMAP_DRAWING_MARKER    画点
   * <br/>BMAP_DRAWING_CIRCLE    画圆
   * <br/>BMAP_DRAWING_POLYLINE  画线
   * <br/>BMAP_DRAWING_POLYGON   画多边形
   * <br/>BMAP_DRAWING_RECTANGLE 画矩形
   * @param {DrawingType} DrawingType
   * @return {Boolean} 
   *
   * @example <b>参考示例：</b><br />
   * myDrawingManagerObject.setDrawingMode(BMAP_DRAWING_POLYLINE);
   */
  DrawingManager.prototype.setDrawingMode = function ( drawingType ) {
    //与当前模式不一样时候才进行重新绑定事件
    if ( this._drawingType != drawingType ) {
      closeInstanceExcept( this );
      this._setDrawingMode( drawingType );
    }
  }

  /**
   * 获取当前的绘制模式
   * @return {DrawingType} 绘制的模式
   *
   * @example <b>参考示例：</b><br />
   * alert(myDrawingManagerObject.getDrawingMode());
   */
  DrawingManager.prototype.getDrawingMode = function () {
    return this._drawingType;
  }

  /**
   * 打开距离或面积计算
   *
   * @example <b>参考示例：</b><br />
   * myDrawingManagerObject.enableCalculate();
   */
  DrawingManager.prototype.enableCalculate = function () {

    this._addGeoUtilsLibrary();
    this._enableCalculate = true;
  }

  /**
   * 关闭距离或面积计算
   *
   * @example <b>参考示例：</b><br />
   * myDrawingManagerObject.disableCalculate();
   */
  DrawingManager.prototype.disableCalculate = function () {
    this._enableCalculate = false;
  }

  /**
   * 后续绘制的图形允许显示关闭按钮
   */
  DrawingManager.prototype.enableCloseBtn = function () {
    this._enableCloseBtn = true;
  }

  /**
   * 后续绘制的图形不显示关闭按钮
   */
  DrawingManager.prototype.diableCloseBtn = function () {
    this._enableCloseBtn = false;
  }

  /**
   	 * 鼠标绘制完成后，派发总事件的接口
     * @name DrawingManager#overlaycomplete
     * @event
     * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
     * <br />{"<b>drawingMode</b> : {DrawingType} 当前的绘制模式
     * <br />"<b>overlay</b>：{Marker||Polyline||Polygon||Circle} 对应的绘制模式返回对应的覆盖物
     * <br />"<b>calculate</b>：{Number} 需要开启计算模式才会返回这个值，当绘制线的时候返回距离、绘制多边形、圆、矩形时候返回面积，单位为米，
     * <br />"<b>label</b>：{Label} 计算面积时候出现在Map上的Label对象
     *
     * @example <b>参考示例：</b>
     * myDrawingManagerObject.addEventListener("overlaycomplete", function(e) {
     *     alert(e.drawingMode);
     *     alert(e.overlay);
     *     alert(e.calculate);
     *     alert(e.label);
     * });
     */

  /**
   * 绘制点完成后，派发的事件接口
   * @name DrawingManager#markercomplete
   * @event
   * @param {Marker} overlay 回调函数会返回相应的覆盖物，
   * <br />{"<b>overlay</b> : {Marker} 
   *
   * @example <b>参考示例：</b>
   * myDrawingManagerObject.addEventListener("circlecomplete", function(e, overlay) {
   *     alert(overlay);
   * });
   */

  /**
   * 绘制圆完成后，派发的事件接口
   * @name DrawingManager#circlecomplete
   * @event
   * @param {Circle} overlay 回调函数会返回相应的覆盖物，
   * <br />{"<b>overlay</b> : {Circle} 
   */

  /**
   * 绘制线完成后，派发的事件接口
   * @name DrawingManager#polylinecomplete
   * @event
   * @param {Polyline} overlay 回调函数会返回相应的覆盖物，
   * <br />{"<b>overlay</b> : {Polyline} 
   */

  /**
   * 绘制多边形完成后，派发的事件接口
   * @name DrawingManager#polygoncomplete
   * @event
   * @param {Polygon} overlay 回调函数会返回相应的覆盖物，
   * <br />{"<b>overlay</b> : {Polygon} 
   */

  /**
   * 绘制矩形完成后，派发的事件接口
   * @name DrawingManager#rectanglecomplete
   * @event
   * @param {Polygon} overlay 回调函数会返回相应的覆盖物，
   * <br />{"<b>overlay</b> : {Polygon} 
   */

  /**
   * 初始化状态
   * @param {Map} 地图实例
   * @param {Object} 参数
   */
  DrawingManager.prototype._initialize = function ( map, opts ) {

    /**
     * map对象
     * @private
     * @type {Map}
     */
    this._map = map;

    /**
     * 配置对象
     * @private
     * @type {Object}
     */
    this._opts = opts;

    /**
     * 当前的绘制模式, 默认是绘制点
     * @private
     * @type {DrawingType}
     */
    this._drawingType = opts.drawingMode || BMAP_DRAWING_MARKER;

    /**
     * 是否添加添加鼠标绘制工具栏面板
     */
    if ( opts.enableDrawingTool ) {
      var drawingTool = new DrawingTool( this, opts.drawingToolOptions );
      this._drawingTool = drawingTool;
      map.addControl( drawingTool );
    }

    //是否计算绘制出的面积 
    if ( opts.enableCalculate === true ) {
      this.enableCalculate();
    } else {
      this.disableCalculate();
    }

    //是否显示关闭按钮
    if ( opts.enableCloseBtn === true ) {
      this.enableCloseBtn();
    } else {
      this.diableCloseBtn();
    }

    /**
     * 是否已经开启了绘制状态
     * @private
     * @type {Boolean}
     */
    this._isOpen = !!( opts.isOpen === true );
    if ( this._isOpen ) {
      this._open();
    }

    this.markerOptions = opts.markerOptions || {};
    this.circleOptions = opts.circleOptions || {};
    this.polylineOptions = opts.polylineOptions || {};
    this.polygonOptions = opts.polygonOptions || {};
    this.rectangleOptions = opts.rectangleOptions || {};

  },

  /**
   * 开启地图的绘制状态
   * @return {Boolean}，开启绘制状态成功，返回true；否则返回false。
   */
  DrawingManager.prototype._open = function () {

    this._isOpen = true;

    //添加遮罩，所有鼠标操作都在这个遮罩上完成
    if ( !this._mask ) {
      this._mask = new Mask();
    }
    this._map.addOverlay( this._mask );
    this._setDrawingMode( this._drawingType );

  }

  /**
   * 设置当前的绘制模式
   * @param {DrawingType}
   */
  DrawingManager.prototype._setDrawingMode = function ( drawingType ) {

    this._drawingType = drawingType;

    /**
     * 开启编辑状态时候才重新进行事件绑定
     */
    if ( this._isOpen ) {
      //清空之前的自定义事件
      this._mask.__listeners = {};

      switch ( drawingType ) {
        case BMAP_DRAWING_MARKER:
          this._bindMarker();
          break;
        case BMAP_DRAWING_CIRCLE:
          this._bindCircle();
          break;
        case BMAP_DRAWING_POLYLINE:
        case BMAP_DRAWING_POLYGON:
          this._bindPolylineOrPolygon();
          break;
        case BMAP_DRAWING_RECTANGLE:
          this._bindRectangle();
          break;
      }
    }

    /** 
     * 如果添加了工具栏，则也需要改变工具栏的样式
     */
    if ( this._drawingTool && this._isOpen ) {
      this._drawingTool.setStyleByDrawingMode( drawingType );
    }
  }

  /**
   * 关闭地图的绘制状态
   * @return {Boolean}，关闭绘制状态成功，返回true；否则返回false。
   */
  DrawingManager.prototype._close = function () {

    this._isOpen = false;

    if ( this._mask ) {
      this._map.removeOverlay( this._mask );
    }

    /** 
     * 如果添加了工具栏，则关闭时候将工具栏样式设置为拖拽地图
     */
    if ( this._drawingTool ) {
      this._drawingTool.setStyleByDrawingMode( "hander" );
    }
  }

  /**
   * 绑定鼠标画点的事件
   */
  DrawingManager.prototype._bindMarker = function () {

    var me = this,
        map = this._map,
        mask = this._mask;

    /**
     * 鼠标点击的事件
     */
    var clickAction = function ( e ) {
      // 往地图上添加marker
      var marker = new BMap.Marker( e.point, me.markerOptions );
      map.addOverlay( marker );
      me._dispatchOverlayComplete( marker );
    }

    mask.addEventListener( 'click', clickAction );
  }

  /**
   * 绑定鼠标画圆的事件
   */
  DrawingManager.prototype._bindCircle = function () {

    var me = this,
        map = this._map,
        mask = this._mask,
        circle = null,
        centerPoint = null; //圆的中心点

    /**
     * 开始绘制圆形
     */
    var startAction = function ( e ) {
      centerPoint = e.point;
      circle = new BMap.Circle( centerPoint, 0, me.circleOptions );
      map.addOverlay( circle );
      mask.enableEdgeMove();
      mask.addEventListener( 'mousemove', moveAction );
      baidu.on( document, 'mouseup', endAction );
    }

    /**
     * 绘制圆形过程中，鼠标移动过程的事件
     */
    var moveAction = function ( e ) {
      circle.setRadius( me._map.getDistance( centerPoint, e.point ) );
    }

    /**
     * 绘制圆形结束
     */
    var endAction = function ( e ) {
      var calculate = me._calculate( circle, e.point );
      me._dispatchOverlayComplete( circle, calculate );
      centerPoint = null;
      mask.disableEdgeMove();
      mask.removeEventListener( 'mousemove', moveAction );
      baidu.un( document, 'mouseup', endAction );
    }

    /**
     * 鼠标点击起始点
     */
    var mousedownAction = function ( e ) {
      baidu.preventDefault( e );
      baidu.stopBubble( e );
      if ( centerPoint == null ) {
        startAction( e );
      }
    }

    mask.addEventListener( 'mousedown', mousedownAction );
  }

  /**
   * 画线和画多边形相似性比较大，公用一个方法
   */
  DrawingManager.prototype._bindPolylineOrPolygon = function () {

    var me = this,
        map = this._map,
        mask = this._mask,
        points = [],   //用户绘制的点
        drawPoint = null; //实际需要画在地图上的点
    overlay = null,
    isBinded = false;

    /**
     * 鼠标点击的事件
     */
    var startAction = function ( e ) {
      points.push( e.point );
      drawPoint = points.concat( points[points.length - 1] );
      if ( points.length == 1 ) {
        if ( me._drawingType == BMAP_DRAWING_POLYLINE ) {
          overlay = new BMap.Polyline( drawPoint, me.polylineOptions );
        } else if ( me._drawingType == BMAP_DRAWING_POLYGON ) {
          overlay = new BMap.Polygon( drawPoint, me.polygonOptions );
        }
        map.addOverlay( overlay );
      } else {
        overlay.setPath( drawPoint );
      }
      if ( !isBinded ) {
        isBinded = true;
        mask.enableEdgeMove();
        mask.addEventListener( 'mousemove', mousemoveAction );
        mask.addEventListener( 'dblclick', dblclickAction );
      }
    }

    /**
     * 鼠标移动过程的事件
     */
    var mousemoveAction = function ( e ) {
      overlay.setPositionAt( drawPoint.length - 1, e.point );
    }

    /**
     * 鼠标双击的事件
     */
    var dblclickAction = function ( e ) {
      baidu.stopBubble( e );
      isBinded = false;
      mask.disableEdgeMove();
      mask.removeEventListener( 'mousemove', mousemoveAction );
      mask.removeEventListener( 'dblclick', dblclickAction );
      overlay.setPath( points );
      var endPoint = points[points.length - 1];
      var calculate = me._calculate( overlay, endPoint );
      me._dispatchOverlayComplete( overlay, calculate );

      if ( me._drawingType == BMAP_DRAWING_POLYGON ) {
        //添加关闭按钮
        me._addCloseIcon( endPoint, overlay, calculate );
      }
      points.length = 0;
      drawPoint.length = 0;
    }

    mask.addEventListener( 'click', startAction );

    //双击时候不放大地图级别
    mask.addEventListener( 'dblclick', function ( e ) {
      baidu.stopBubble( e );
    } );
  }

  /**
   * 绑定鼠标画矩形的事件
   */
  DrawingManager.prototype._bindRectangle = function () {

    var me = this,
        map = this._map,
        mask = this._mask,
        polygon = null,
        startPoint = null;

    /**
     * 开始绘制矩形
     */
    var startAction = function ( e ) {
      baidu.stopBubble( e );
      baidu.preventDefault( e );
      startPoint = e.point;
      var endPoint = startPoint;
      polygon = new BMap.Polygon( me._getRectanglePoint( startPoint, endPoint ), me.rectangleOptions );
      map.addOverlay( polygon );
      mask.enableEdgeMove();
      mask.addEventListener( 'mousemove', moveAction );
      baidu.on( document, 'mouseup', endAction );
    }

    /**
     * 绘制矩形过程中，鼠标移动过程的事件
     */
    var moveAction = function ( e ) {
      polygon.setPath( me._getRectanglePoint( startPoint, e.point ) );
    }

    /**
     * 绘制矩形结束
     */
    var endAction = function ( e ) {
      var calculate = me._calculate( polygon, polygon.getPath()[2] );
      me._dispatchOverlayComplete( polygon, calculate );
      startPoint = null;
      mask.disableEdgeMove();
      mask.removeEventListener( 'mousemove', moveAction );
      baidu.un( document, 'mouseup', endAction );
      //添加关闭按钮
      me._addCloseIcon( polygon.getPath()[2], polygon, calculate );
    }

    mask.addEventListener( 'mousedown', startAction );
  }

  /**
   * 添加显示所绘制图形的面积或者长度
   * @param {overlay} 覆盖物
   * @param {point} 显示的位置
   */
  DrawingManager.prototype._calculate = function ( overlay, point ) {
    var result = {
      data: 0,    //计算出来的长度或面积
      label: null  //显示长度或面积的label对象
    };
    if ( this._enableCalculate && BMapLib.GeoUtils ) {
      var type = overlay.toString();
      //不同覆盖物调用不同的计算方法
      switch ( type ) {
        case "[object Polyline]":
          var data = BMapLib.GeoUtils.getPolylineDistance( overlay );
          //异常情况处理
          if ( !data || data < 0 ) {
            data = 0;
          } else {
            //保留2位小数位
            data = data.toFixed( 2 );
          }
          result.data = data + "米";
          break;
        case "[object Polygon]":
          var data = BMapLib.GeoUtils.getPolygonArea( overlay );
          //异常情况处理
          if ( !data || data < 0 ) {
            data = 0;
            result.data = "面积：" + data + "平方米";
          } else {
            if ( data > 1000000 ) {
              //保留2位小数位
              data = ( data / 1000000 ).toFixed( 2 );
              result.data = "面积：" + data + "平方公里";
            }
            else {
              //保留2位小数位
              data = data.toFixed( 2 );
              result.data = "面积：" + data + "平方米";
            }
          }

          break;
        case "[object Circle]":
          var radius = overlay.getRadius();
          var data = Math.PI * radius * radius;
          if ( data > 1000000 ) {
            //保留2位小数位
            data = ( data / 1000000 ).toFixed( 2 );
            result.data = "面积：" + data + "平方公里";
          }
          else {
            //保留2位小数位
            data = data.toFixed( 2 );
            result.data = "面积：" + data + "平方米";
          }
          break;
      }

      result.label = this._addLabel( point, result.data );
    }
    return result;
  }

  /**
   * 开启测距和测面功能需要依赖于GeoUtils库
   * 所以这里判断用户是否已经加载,若未加载则用js动态加载
   */
  DrawingManager.prototype._addGeoUtilsLibrary = function () {
    if ( !BMapLib.GeoUtils ) {
      var script = document.createElement( 'script' );
      script.setAttribute( "type", "text/javascript" );
      script.setAttribute( "src", 'http://api.map.baidu.com/library/GeoUtils/1.2/src/GeoUtils_min.js' );
      document.body.appendChild( script );
    }
  }
  /**
	 * 添加关闭图标
	 * @param {Point} point 显示的位置，即鼠标最后位置
	 * @param {Overlay} overlay 绘制的图形
	 */
  DrawingManager.prototype._addCloseIcon = function ( point, overlay, calculate ) {
    if ( !this._enableCloseBtn ) {
      return;
    }

    var me = this;
    var closeIcon = new BMap.Icon( "http://api.map.baidu.com/images/mapctrls.gif", new BMap.Size( 12, 12 ), { imageOffset: new BMap.Size( 0, -14 ) } );
    var btnOffset = [14, -6];
    var closeBtn = new BMap.Marker( point,
        {
          icon: closeIcon,
          offset: new BMap.Size( btnOffset[0], btnOffset[1] ),
          baseZIndex: 3600000,
          enableMassClear: true
        }
    );
    this._map.addOverlay( closeBtn );
    closeBtn.setTitle( "清除绘制的图形" );
    // 点击关闭按钮，绑定关闭按钮事件
    closeBtn.addEventListener( "click", function ( e ) {
      if ( calculate.label ) {
        calculate.label.remove();
      }
      overlay.remove();
      closeBtn.remove();
      closeBtn = null;
      //me.stopBubble(e);


    } );

    //me._drawingTool._close();
    me._close();
  }

  /**
   * 向地图中添加文本标注
   * @param {Point}
   * @param {String} 所以显示的内容
   */
  DrawingManager.prototype._addLabel = function ( point, content ) {
    var label = new BMap.Label( content, {
      position: point
    } );
    this._map.addOverlay( label );
    return label;
  }

  /**
   * 根据起终点获取矩形的四个顶点
   * @param {Point} 起点
   * @param {Point} 终点
   */
  DrawingManager.prototype._getRectanglePoint = function ( startPoint, endPoint ) {
    return [
        new BMap.Point( startPoint.lng, startPoint.lat ),
        new BMap.Point( endPoint.lng, startPoint.lat ),
        new BMap.Point( endPoint.lng, endPoint.lat ),
        new BMap.Point( startPoint.lng, endPoint.lat )
    ];
  }

  /**
   * 派发事件
   */
  DrawingManager.prototype._dispatchOverlayComplete = function ( overlay, calculate ) {
    var options = {
      'overlay': overlay,
      'drawingMode': this._drawingType
    };
    if ( calculate ) {
      options.calculate = calculate.data || null;
      options.label = calculate.label || null;
    }
    this.dispatchEvent( this._drawingType + 'complete', overlay );
    this.dispatchEvent( 'overlaycomplete', options );
  }

  /**
   * 创建遮罩对象
   */
  function Mask() {
    /**
     * 鼠标到地图边缘的时候是否自动平移地图
     */
    this._enableEdgeMove = false;
  }

  Mask.prototype = new BMap.Overlay();

  /**
   * 这里不使用api中的自定义事件，是为了更灵活使用
   */
  Mask.prototype.dispatchEvent = baidu.lang.Class.prototype.dispatchEvent;
  Mask.prototype.addEventListener = baidu.lang.Class.prototype.addEventListener;
  Mask.prototype.removeEventListener = baidu.lang.Class.prototype.removeEventListener;

  Mask.prototype.initialize = function ( map ) {
    var me = this;
    this._map = map;
    var div = this.container = document.createElement( "div" );
    var size = this._map.getSize();
    div.style.cssText = "position:absolute;background:url(about:blank);cursor:crosshair;width:" + size.width + "px;height:" + size.height + "px";
    this._map.addEventListener( 'resize', function ( e ) {
      me._adjustSize( e.size );
    } );
    this._map.getPanes().floatPane.appendChild( div );
    this._bind();
    return div;
  };

  Mask.prototype.draw = function () {
    var map = this._map,
        point = map.pixelToPoint( new BMap.Pixel( 0, 0 ) ),
        pixel = map.pointToOverlayPixel( point );
    this.container.style.left = pixel.x + "px";
    this.container.style.top = pixel.y + "px";
  };

  /**
   * 开启鼠标到地图边缘，自动平移地图
   */
  Mask.prototype.enableEdgeMove = function () {
    this._enableEdgeMove = true;
  }

  /**
   * 关闭鼠标到地图边缘，自动平移地图
   */
  Mask.prototype.disableEdgeMove = function () {
    clearInterval( this._edgeMoveTimer );
    this._enableEdgeMove = false;
  }

  /**
   * 绑定事件,派发自定义事件
   */
  Mask.prototype._bind = function () {

    var me = this,
        map = this._map,
        container = this.container,
        lastMousedownXY = null,
        lastClickXY = null;

    /**
     * 根据event对象获取鼠标的xy坐标对象
     * @param {Event}
     * @return {Object} {x:e.x, y:e.y}
     */
    var getXYbyEvent = function ( e ) {
      return {
        x: e.clientX,
        y: e.clientY
      }
    };

    var domEvent = function ( e ) {
      var type = e.type;
      e = baidu.getEvent( e );
      point = me.getDrawPoint( e ); //当前鼠标所在点的地理坐标

      var dispatchEvent = function ( type ) {
        e.point = point;
        me.dispatchEvent( e );
      }

      if ( type == "mousedown" ) {
        lastMousedownXY = getXYbyEvent( e );
      }

      var nowXY = getXYbyEvent( e );
      //click经过一些特殊处理派发，其他同事件按正常的dom事件派发
      if ( type == "click" ) {
        //鼠标点击过程不进行移动才派发click和dblclick
        if ( Math.abs( nowXY.x - lastMousedownXY.x ) < 5 && Math.abs( nowXY.y - lastMousedownXY.y ) < 5 ) {
          if ( !lastClickXY || !( Math.abs( nowXY.x - lastClickXY.x ) < 5 && Math.abs( nowXY.y - lastClickXY.y ) < 5 ) ) {
            dispatchEvent( 'click' );
            lastClickXY = getXYbyEvent( e );
          } else {
            lastClickXY = null;
          }
        }
      } else {
        dispatchEvent( type );
      }
    }

    /**
     * 将事件都遮罩层的事件都绑定到domEvent来处理
     */
    var events = ['click', 'mousedown', 'mousemove', 'mouseup', 'dblclick'],
        index = events.length;
    while ( index-- ) {
      baidu.on( container, events[index], domEvent );
    }

    //鼠标移动过程中，到地图边缘后自动平移地图
    baidu.on( container, 'mousemove', function ( e ) {
      if ( me._enableEdgeMove ) {
        me.mousemoveAction( e );
      }
    } );
  };

  //鼠标移动过程中，到地图边缘后自动平移地图
  Mask.prototype.mousemoveAction = function ( e ) {
    function getClientPosition( e ) {
      var clientX = e.clientX,
          clientY = e.clientY;
      if ( e.changedTouches ) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      }
      return new BMap.Pixel( clientX, clientY );
    }

    var map = this._map,
        me = this,
        pixel = map.pointToPixel( this.getDrawPoint( e ) ),
        clientPos = getClientPosition( e ),
        offsetX = clientPos.x - pixel.x,
        offsetY = clientPos.y - pixel.y;
    pixel = new BMap.Pixel(( clientPos.x - offsetX ), ( clientPos.y - offsetY ) );
    this._draggingMovePixel = pixel;
    var point = map.pixelToPoint( pixel ),
        eventObj = {
          pixel: pixel,
          point: point
        };
    // 拖拽到地图边缘移动地图
    this._panByX = this._panByY = 0;
    if ( pixel.x <= 20 || pixel.x >= map.width - 20
        || pixel.y <= 50 || pixel.y >= map.height - 10 ) {
      if ( pixel.x <= 20 ) {
        this._panByX = 8;
      } else if ( pixel.x >= map.width - 20 ) {
        this._panByX = -8;
      }
      if ( pixel.y <= 50 ) {
        this._panByY = 8;
      } else if ( pixel.y >= map.height - 10 ) {
        this._panByY = -8;
      }
      if ( !this._edgeMoveTimer ) {
        this._edgeMoveTimer = setInterval( function () {
          map.panBy( me._panByX, me._panByY, { "noAnimation": true } );
        }, 30 );
      }
    } else {
      if ( this._edgeMoveTimer ) {
        clearInterval( this._edgeMoveTimer );
        this._edgeMoveTimer = null;
      }
    }
  }

  /*
   * 调整大小
   * @param {Size}
   */
  Mask.prototype._adjustSize = function ( size ) {
    this.container.style.width = size.width + 'px';
    this.container.style.height = size.height + 'px';
  };

  /**
   * 获取当前绘制点的地理坐标
   *
   * @param {Event} e e对象
   * @return Point对象的位置信息
   */
  Mask.prototype.getDrawPoint = function ( e ) {

    var map = this._map,
    trigger = baidu.getTarget( e ),
    x = e.offsetX || e.layerX || 0,
    y = e.offsetY || e.layerY || 0;
    if ( trigger.nodeType != 1 ) trigger = trigger.parentNode;
    while ( trigger && trigger != map.getContainer() ) {
      if ( !( trigger.clientWidth == 0 &&
          trigger.clientHeight == 0 &&
          trigger.offsetParent && trigger.offsetParent.nodeName == 'TD' ) ) {
        x += trigger.offsetLeft || 0;
        y += trigger.offsetTop || 0;
      }
      trigger = trigger.offsetParent;
    }
    var pixel = new BMap.Pixel( x, y );
    var point = map.pixelToPoint( pixel );
    return point;

  }

  /**
   * 绘制工具面板，自定义控件
   */
  function DrawingTool( drawingManager, drawingToolOptions ) {
    this.drawingManager = drawingManager;

    drawingToolOptions = this.drawingToolOptions = drawingToolOptions || {};
    // 默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
    this.defaultOffset = new BMap.Size( 10, 10 );

    //默认所有工具栏都显示
    this.defaultDrawingModes = [
        BMAP_DRAWING_MARKER,
        BMAP_DRAWING_CIRCLE,
        BMAP_DRAWING_POLYLINE,
        BMAP_DRAWING_POLYGON,
        BMAP_DRAWING_RECTANGLE
    ];
    //工具栏可显示的绘制模式
    if ( drawingToolOptions.drawingModes ) {
      this.drawingModes = drawingToolOptions.drawingModes;
    } else {
      this.drawingModes = this.defaultDrawingModes
    }

    //用户设置停靠位置和偏移量
    if ( drawingToolOptions.anchor ) {
      this.setAnchor( drawingToolOptions.anchor );
    }
    if ( drawingToolOptions.offset ) {
      this.setOffset( drawingToolOptions.offset );
    }
  }

  // 通过JavaScript的prototype属性继承于BMap.Control
  DrawingTool.prototype = new BMap.Control();

  // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
  // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
  DrawingTool.prototype.initialize = function ( map ) {
    // 创建一个DOM元素
    var container = this.container = document.createElement( "div" );
    container.className = "BMapLib_Drawing";
    //用来设置外层边框阴影
    var panel = this.panel = document.createElement( "div" );
    panel.className = "BMapLib_Drawing_panel";
    if ( this.drawingToolOptions && this.drawingToolOptions.scale ) {
      this._setScale( this.drawingToolOptions.scale );
    }
    container.appendChild( panel );
    // 添加内容
    panel.innerHTML = this._generalHtml();
    //绑定事件
    this._bind( panel );
    // 添加DOM元素到地图中
    map.getContainer().appendChild( container );
    // 将DOM元素返回
    return container;
  }

  //生成工具栏的html元素
  DrawingTool.prototype._generalHtml = function ( map ) {

    //鼠标经过工具栏上的提示信息
    var tips = {};
    tips["hander"] = "拖动地图";
    tips[BMAP_DRAWING_MARKER] = "画点";
    tips[BMAP_DRAWING_CIRCLE] = "画圆";
    tips[BMAP_DRAWING_POLYLINE] = "画折线";
    tips[BMAP_DRAWING_POLYGON] = "画多边形";
    tips[BMAP_DRAWING_RECTANGLE] = "画矩形";

    var getItem = function ( className, drawingType ) {
      return '<a class="' + className + '" drawingType="' + drawingType + '" href="javascript:void(0)" title="' + tips[drawingType] + '" onfocus="this.blur()"></a>';
    }

    var html = [];
    html.push( getItem( "BMapLib_box BMapLib_hander", "hander" ) );
    for ( var i = 0, len = this.drawingModes.length; i < len; i++ ) {
      var classStr = 'BMapLib_box BMapLib_' + this.drawingModes[i];
      if ( i == len - 1 ) {
        classStr += ' BMapLib_last';
      }
      html.push( getItem( classStr, this.drawingModes[i] ) );
    }
    return html.join( '' );
  }

  /**
   * 设置工具栏的缩放比例
   */
  DrawingTool.prototype._setScale = function ( scale ) {
    var width = 390,
        height = 50,
        ml = -parseInt(( width - width * scale ) / 2, 10 ),
        mt = -parseInt(( height - height * scale ) / 2, 10 );
    this.container.style.cssText = [
        "-moz-transform: scale(" + scale + ");",
        "-o-transform: scale(" + scale + ");",
        "-webkit-transform: scale(" + scale + ");",
        "transform: scale(" + scale + ");",
        "margin-left:" + ml + "px;",
        "margin-top:" + mt + "px;",
        "*margin-left:0px;", //ie6、7
        "*margin-top:0px;",  //ie6、7
        "margin-left:0px\\0;", //ie8
        "margin-top:0px\\0;",  //ie8
        //ie下使用滤镜
        "filter: progid:DXImageTransform.Microsoft.Matrix(",
        "M11=" + scale + ",",
        "M12=0,",
        "M21=0,",
        "M22=" + scale + ",",
        "SizingMethod='auto expand');"
    ].join( '' );
  }

  //绑定工具栏的事件
  DrawingTool.prototype._bind = function ( panel ) {
    var me = this;
    baidu.on( this.panel, 'click', function ( e ) {
      var target = baidu.getTarget( e );
      var drawingType = target.getAttribute( 'drawingType' );
      me.setStyleByDrawingMode( drawingType );
      me._bindEventByDraingMode( drawingType );
    } );
  }

  //设置工具栏当前选中的项样式
  DrawingTool.prototype.setStyleByDrawingMode = function ( drawingType ) {
    if ( !drawingType ) {
      return;
    }
    var boxs = this.panel.getElementsByTagName( "a" );
    for ( var i = 0, len = boxs.length; i < len; i++ ) {
      var box = boxs[i];
      if ( box.getAttribute( 'drawingType' ) == drawingType ) {
        var classStr = "BMapLib_box BMapLib_" + drawingType + "_hover";
        if ( i == len - 1 ) {
          classStr += " BMapLib_last";
        }
        box.className = classStr;
      } else {
        box.className = box.className.replace( /_hover/, "" );
      }
    }
  }

  //设置工具栏当前选中的项样式
  DrawingTool.prototype._bindEventByDraingMode = function ( drawingType ) {
    var drawingManager = this.drawingManager;
    //点在拖拽地图的按钮上
    if ( drawingType == "hander" ) {
      drawingManager.close();
    } else {
      drawingManager.setDrawingMode( drawingType );
      drawingManager.open();
    }
  }

  /*
   * 关闭其他实例的绘制模式
   * @param {DrawingManager} 当前的实例
   */
  function closeInstanceExcept( instance ) {
    var index = instances.length;
    while ( index-- ) {
      if ( instances[index] != instance ) {
        instances[index].close();
      }
    }
  }

} )();
/**
 * @fileoverview 百度地图的可根据当前poi点来进行周边检索、公交、驾车查询的信息窗口，对外开放。
 * 主入口类是<a href="symbols/BMapLib.SearchInfoWindow.html">SearchInfoWindow</a>，
 * 基于Baidu Map API 1.4。
 *
 * @author Baidu Map Api Group
 * @version 1.4
 * 
 * version 1.4.1,wutiansheng@20140623
 * 1.在点击地图后，自动关闭弹出的信息窗口
 */
//常量，searchInfoWindow可选择的检索类型
var BMAPLIB_TAB_SEARCH = 0, BMAPLIB_TAB_TO_HERE = 1, BMAPLIB_TAB_FROM_HERE = 2;
( function () {
  //声明baidu包
  var T, baidu = T = baidu || { version: '1.5.0' };
  baidu.guid = '$BAIDU$';
  //以下方法为百度Tangram框架中的方法，请到http://tangram.baidu.com 查看文档
  ( function () {
    window[baidu.guid] = window[baidu.guid] || {};

    baidu.lang = baidu.lang || {};
    baidu.lang.isString = function ( source ) {
      return '[object String]' == Object.prototype.toString.call( source );
    };
    baidu.lang.Event = function ( type, target ) {
      this.type = type;
      this.returnValue = true;
      this.target = target || null;
      this.currentTarget = null;
    };


    baidu.object = baidu.object || {};
    baidu.extend =
    baidu.object.extend = function ( target, source ) {
      for ( var p in source ) {
        if ( source.hasOwnProperty( p ) ) {
          target[p] = source[p];
        }
      }

      return target;
    };
    baidu.event = baidu.event || {};
    baidu.event._listeners = baidu.event._listeners || [];
    baidu.dom = baidu.dom || {};

    baidu.dom._g = function ( id ) {
      if ( baidu.lang.isString( id ) ) {
        return document.getElementById( id );
      }
      return id;
    };
    baidu._g = baidu.dom._g;
    baidu.event.on = function ( element, type, listener ) {
      type = type.replace( /^on/i, '' );
      element = baidu.dom._g( element );
      var realListener = function ( ev ) {
        // 1. 这里不支持EventArgument,  原因是跨frame的事件挂载
        // 2. element是为了修正this
        listener.call( element, ev );
      },
          lis = baidu.event._listeners,
          filter = baidu.event._eventFilter,
          afterFilter,
          realType = type;
      type = type.toLowerCase();
      // filter过滤
      if ( filter && filter[type] ) {
        afterFilter = filter[type]( element, type, realListener );
        realType = afterFilter.type;
        realListener = afterFilter.listener;
      }

      // 事件监听器挂载
      if ( element.addEventListener ) {
        element.addEventListener( realType, realListener, false );
      } else if ( element.attachEvent ) {
        element.attachEvent( 'on' + realType, realListener );
      }
      // 将监听器存储到数组中
      lis[lis.length] = [element, type, listener, realListener, realType];
      return element;
    };

    baidu.on = baidu.event.on;
    baidu.event.un = function ( element, type, listener ) {
      element = baidu.dom._g( element );
      type = type.replace( /^on/i, '' ).toLowerCase();

      var lis = baidu.event._listeners,
          len = lis.length,
          isRemoveAll = !listener,
          item,
          realType, realListener;
      while ( len-- ) {
        item = lis[len];

        if ( item[1] === type
            && item[0] === element
            && ( isRemoveAll || item[2] === listener ) ) {
          realType = item[4];
          realListener = item[3];
          if ( element.removeEventListener ) {
            element.removeEventListener( realType, realListener, false );
          } else if ( element.detachEvent ) {
            element.detachEvent( 'on' + realType, realListener );
          }
          lis.splice( len, 1 );
        }
      }

      return element;
    };
    baidu.un = baidu.event.un;
    baidu.dom.g = function ( id ) {
      if ( 'string' == typeof id || id instanceof String ) {
        return document.getElementById( id );
      } else if ( id && id.nodeName && ( id.nodeType == 1 || id.nodeType == 9 ) ) {
        return id;
      }
      return null;
    };
    baidu.g = baidu.G = baidu.dom.g;
    baidu.string = baidu.string || {};

    baidu.browser = baidu.browser || {};
    baidu.browser.ie = baidu.ie = /msie (\d+\.\d+)/i.test( navigator.userAgent ) ? ( document.documentMode || +RegExp['\x241'] ) : undefined;
    baidu.dom._NAME_ATTRS = ( function () {
      var result = {
        'cellpadding': 'cellPadding',
        'cellspacing': 'cellSpacing',
        'colspan': 'colSpan',
        'rowspan': 'rowSpan',
        'valign': 'vAlign',
        'usemap': 'useMap',
        'frameborder': 'frameBorder'
      };

      if ( baidu.browser.ie < 8 ) {
        result['for'] = 'htmlFor';
        result['class'] = 'className';
      } else {
        result['htmlFor'] = 'for';
        result['className'] = 'class';
      }

      return result;
    } )();
    baidu.dom.setAttr = function ( element, key, value ) {
      element = baidu.dom.g( element );
      if ( 'style' == key ) {
        element.style.cssText = value;
      } else {
        key = baidu.dom._NAME_ATTRS[key] || key;
        element.setAttribute( key, value );
      }
      return element;
    };
    baidu.setAttr = baidu.dom.setAttr;
    baidu.dom.setAttrs = function ( element, attributes ) {
      element = baidu.dom.g( element );
      for ( var key in attributes ) {
        baidu.dom.setAttr( element, key, attributes[key] );
      }
      return element;
    };
    baidu.setAttrs = baidu.dom.setAttrs;
    baidu.dom.create = function ( tagName, opt_attributes ) {
      var el = document.createElement( tagName ),
          attributes = opt_attributes || {};
      return baidu.dom.setAttrs( el, attributes );
    };

    baidu.cookie = baidu.cookie || {};


    baidu.cookie._isValidKey = function ( key ) {
      // http://www.w3.org/Protocols/rfc2109/rfc2109
      // Syntax:  General
      // The two state management headers, Set-Cookie and Cookie, have common
      // syntactic properties involving attribute-value pairs.  The following
      // grammar uses the notation, and tokens DIGIT (decimal digits) and
      // token (informally, a sequence of non-special, non-white space
      // characters) from the HTTP/1.1 specification [RFC 2068] to describe
      // their syntax.
      // av-pairs   = av-pair *(";" av-pair)
      // av-pair    = attr ["=" value] ; optional value
      // attr       = token
      // value      = word
      // word       = token | quoted-string

      // http://www.ietf.org/rfc/rfc2068.txt
      // token      = 1*<any CHAR except CTLs or tspecials>
      // CHAR       = <any US-ASCII character (octets 0 - 127)>
      // CTL        = <any US-ASCII control character
      //              (octets 0 - 31) and DEL (127)>
      // tspecials  = "(" | ")" | "<" | ">" | "@"
      //              | "," | ";" | ":" | "\" | <">
      //              | "/" | "[" | "]" | "?" | "="
      //              | "{" | "}" | SP | HT
      // SP         = <US-ASCII SP, space (32)>
      // HT         = <US-ASCII HT, horizontal-tab (9)>

      return ( new RegExp( "^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24" ) ).test( key );
    };

    baidu.cookie.getRaw = function ( key ) {
      if ( baidu.cookie._isValidKey( key ) ) {
        var reg = new RegExp( "(^| )" + key + "=([^;]*)(;|\x24)" ),
            result = reg.exec( document.cookie );

        if ( result ) {
          return result[2] || null;
        }
      }

      return null;
    };

    baidu.cookie.get = function ( key ) {
      var value = baidu.cookie.getRaw( key );
      if ( 'string' == typeof value ) {
        value = decodeURIComponent( value );
        return value;
      }
      return null;
    };

    baidu.cookie.setRaw = function ( key, value, options ) {
      if ( !baidu.cookie._isValidKey( key ) ) {
        return;
      }

      options = options || {};
      //options.path = options.path || "/"; // meizz 20100402 设定一个初始值，方便后续的操作
      //berg 20100409 去掉，因为用户希望默认的path是当前路径，这样和浏览器对cookie的定义也是一致的

      // 计算cookie过期时间
      var expires = options.expires;
      if ( 'number' == typeof options.expires ) {
        expires = new Date();
        expires.setTime( expires.getTime() + options.expires );
      }

      document.cookie =
          key + "=" + value
          + ( options.path ? "; path=" + options.path : "" )
          + ( expires ? "; expires=" + expires.toGMTString() : "" )
          + ( options.domain ? "; domain=" + options.domain : "" )
          + ( options.secure ? "; secure" : '' );
    };

    baidu.cookie.set = function ( key, value, options ) {
      baidu.cookie.setRaw( key, encodeURIComponent( value ), options );
    };

    baidu.cookie.remove = function ( key, options ) {
      options = options || {};
      options.expires = new Date( 0 );
      baidu.cookie.setRaw( key, '', options );
    };// 声明快捷

    //检验是否是正确的手机号
    baidu.isPhone = function ( phone ) {
      return /\d{11}/.test( phone );
    }

    //检验是否是正确的激活码
    baidu.isActivateCode = function ( vcode ) {
      return /\d{4}/.test( vcode );
    }


    T.undope = true;
  } )();

  /**
   * @exports SearchInfoWindow as BMapLib.SearchInfoWindow
   */

  var SearchInfoWindow =
      /**
       * SearchInfoWindow类的构造函数
       * @class SearchInfoWindow <b>入口</b>。
       * 可以定义检索模版。
       * @constructor
       * @param {Map} map Baidu map的实例对象.
       * @param {String} content searchInfoWindow中的内容,支持HTML内容.
       * @param {Json Object} opts 可选的输入参数，非必填项。可输入选项包括：<br />
       * {<br />"<b>title</b>" : {String} searchInfoWindow的标题内容，支持HTML内容<br/>
       * {<br />"<b>width</b>" : {Number} searchInfoWindow的内容宽度<br/>
       * {<br />"<b>height</b>" : {Number} searchInfoWindow的内容高度 <br/>
       * {<br />"<b>offset</b>" : {Size} searchInfoWindow的偏移量<br/>
       * <br />"<b>enableAutoPan</b>" : {Boolean} 是否启动自动平移功能,默认开启    <br />
       * <br />"<b>panel</b>" : {String} 用来展现检索信息的面板,可以是dom元素或元素的ID值 <br />
       * <br />"<b>searchTypes</b>" : {Array} 通过传入数组设置检索面板的Tab选项共有三个选项卡可选择，选项卡顺序也按照数组的顺序来排序，传入空数组则不显示检索模版，不设置此参数则默认所有选项卡都显示。数组可传入的值为常量：BMAPLIB_TAB_SEARCH<周边检索>, BMAPLIB_TAB_TO_HERE<到去这里>, BMAPLIB_TAB_FROM_HERE<从这里出发>  <br />
       * <br />"<b>enableSendToPhone</b>" : {Boolean} 是否启动发送到手机功能,默认开启    <br />
       * }<br />.
       * @example <b>参考示例：</b><br />
       * var searchInfoWindow = new BMapLib.SearchInfoWindow(map,"百度地图api",{
       *     title "百度大厦",
       *     width  : 280,
       *     height : 50,
       *     panel  : "panel", //检索结果面板
       *     enableAutoPan : true, //自动平移
       *     enableSendToPhone : true, //是否启动发送到手机功能
       *     searchTypes :[
       *         BMAPLIB_TAB_SEARCH,   //周边检索
       *         BMAPLIB_TAB_TO_HERE,  //到这里去
       *         BMAPLIB_TAB_FROM_HERE //从这里出发
       *     ]
       * });
       */
      BMapLib.SearchInfoWindow = function ( map, content, opts ) {

        //存储当前实例
        this.guid = guid++;
        BMapLib.SearchInfoWindow.instance[this.guid] = this;

        this._isOpen = false;
        this._map = map;

        this._opts = opts = opts || {};
        this._content = content || "";
        this._opts.width = opts.width;
        this._opts.height = opts.height;
        this._opts._title = opts.title || "";
        this._opts.offset = opts.offset || new BMap.Size( 0, 0 );
        this._opts.enableAutoPan = opts.enableAutoPan === false ? false : true;
        this._opts._panel = opts.panel || null;
        this._opts._searchTypes = opts.searchTypes; //传入数组形式
        this._opts.enableSendToPhone = opts.enableSendToPhone; //是否开启发送到手机
        that = this;
        this.mapClickFunction = function () {
          //在发生地图点击事件时，关闭所有信息窗口
          that._closeOtherSearchInfo();
        };
      }
  SearchInfoWindow.prototype = new BMap.Overlay();
  SearchInfoWindow.prototype.initialize = function ( map ) {
    this._closeOtherSearchInfo();
    var me = this;

    var div = this._createSearchTemplate();

    var floatPane = map.getPanes().floatPane;
    floatPane.style.width = "auto";
    floatPane.appendChild( div );
    this._initSearchTemplate();
    //设置完内容后，获取div的宽度,高度
    this._getSearchInfoWindowSize();
    this._boxWidth = parseInt( this.container.offsetWidth, 10 );
    this._boxHeight = parseInt( this.container.offsetHeight, 10 );
    //阻止各种冒泡事件
    baidu.event.on( div, "onmousedown", function ( e ) {
      me._stopBubble( e );
    } );
    baidu.event.on( div, "onmouseover", function ( e ) {
      me._stopBubble( e );
    } );
    baidu.event.on( div, "click", function ( e ) {
      me._stopBubble( e );
    } );

    baidu.event.on( div, "dblclick", function ( e ) {
      me._stopBubble( e );
    } );
    return div;
  }
  SearchInfoWindow.prototype.draw = function () {
    this._isOpen && this._adjustPosition( this._point );
  }
  /**
   * 打开searchInfoWindow
   * @param {Marker|Point} location 要在哪个marker或者point上打开searchInfoWindow
   * @return none
   *
   * @example <b>参考示例：</b><br />
   * searchInfoWindow.open();
   */
  SearchInfoWindow.prototype.open = function ( anchor ) {
    this._map.closeInfoWindow();
    var me = this, poi;



    if ( !this._isOpen ) {
      /*
      if (this._isHide) {
        this.show();
        this._isHide = false;
        this._isOpen = true;
        
        setTimeout(function(){
          me._dispatchEvent(me,"open",{"point" : me._point});
          me._map.addEventListener("click",mapClickFunction);
        },10);
        return;
      }
    
      */
      this._map.addOverlay( this );
      this._isOpen = true;
      //延迟10ms派发open事件，使后绑定的事件可以触发。
      setTimeout( function () {
        me._dispatchEvent( me, "open", { "point": me._point } );
        //注册地图点击事件监听，用于关闭信息窗口
        me._map.addEventListener( "click", me.mapClickFunction );
      }, 10 );


    }
    if ( anchor instanceof BMap.Point ) {
      poi = anchor;
      //清除之前存在的marker事件绑定，如果存在的话
      this._removeMarkerEvt();
      this._marker = null;
    } else if ( anchor instanceof BMap.Marker ) {
      //如果当前marker不为空，说明是第二个marker，或者第二次点open按钮,先移除掉之前绑定的事件
      if ( this._marker ) {
        this._removeMarkerEvt();
      }
      poi = anchor.getPosition();
      this._marker = anchor;
      !this._markerDragend && this._marker.addEventListener( "dragend", this._markerDragend = function ( e ) {
        me._point = e.point;
        me._adjustPosition( me._point );
        me._panBox();
        me.show();
      } );
      //给marker绑定dragging事件，拖动marker的时候，searchInfoWindow也跟随移动
      !this._markerDragging && this._marker.addEventListener( "dragging", this._markerDragging = function () {
        me.hide();
        me._point = me._marker.getPosition();
        me._adjustPosition( me._point );
      } );
    }
    //打开的时候，将infowindow显示
    this.show();
    this._point = poi;
    this._panBox();
    this._adjustPosition( this._point );
  }
  /**
   * 关闭searchInfoWindow
   * @return none
   *
   * @example <b>参考示例：</b><br />
   * searchInfoWindow.close();
   */
  SearchInfoWindow.prototype.close = function () {
    if ( this._isOpen ) {
      this._map.removeOverlay( this );
      this._disposeAutoComplete();
      this._isOpen = false;
      //取消地图地点事件监听，防止事件重复触发
      this._map.removeEventListener( "click", this.mapClickFunction );
      this._dispatchEvent( this, "close", { "point": this._point } );
    }
  }

  /**
   	 * 打开searchInfoWindow时，派发事件的接口
     * @name SearchInfoWindow#Open
     * @event
     * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
     * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
     * <br />"<b>type</b>：{String} 事件类型,
     * <br />"<b>point</b>：{Point} searchInfoWindow的打开位置}
     *
     * @example <b>参考示例：</b>
     * searchInfoWindow.addEventListener("open", function(e) {
     *     alert(e.type);
     * });
     */
  /**
    * 关闭searchInfoWindow时，派发事件的接口
    * @name SearchInfoWindow#Close
    * @event
    * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
    * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
    * <br />"<b>type</b>：{String} 事件类型,
    * <br />"<b>point</b>：{Point} searchInfoWindow的关闭位置}
    *
    * @example <b>参考示例：</b>
    * searchInfoWindow.addEventListener("close", function(e) {
    *     alert(e.type);
    * });
    */
  /**
     * 启用自动平移
     * @return none
     *
     * @example <b>参考示例：</b><br />
     * searchInfoWindow.enableAutoPan();
     */
  SearchInfoWindow.prototype.enableAutoPan = function () {
    this._opts.enableAutoPan = true;
  }
  /**
   * 禁用自动平移
   * @return none
   *
   * @example <b>参考示例：</b><br />
   * searchInfoWindow.disableAutoPan();
   */
  SearchInfoWindow.prototype.disableAutoPan = function () {
    this._opts.enableAutoPan = false;
  }
  /**
   * 设置searchInfoWindow的内容
   * @param {String|HTMLElement} content 弹出气泡中的内容，支持HTML格式
   * @return none
   *
   * @example <b>参考示例：</b><br />
   * searchInfoWindow.setContent("百度地图API");
   */
  SearchInfoWindow.prototype.setContent = function ( content ) {
    this._setContent( content );
    this._getSearchInfoWindowSize();
    this._adjustPosition( this._point );
  },
  /**
   * 设置searchInfoWindow的内容
   * @param {String|HTMLElement} title 弹出气泡中的内容，支持HTML格式
   * @return none
   *
   * @example <b>参考示例：</b><br />
   * searchInfoWindow.setTitle("百度地图API");
   */
  SearchInfoWindow.prototype.setTitle = function ( title ) {
    this.dom.title.innerHTML = title;
    this._opts._title = title;
  }
  /**
   * 获取searchInfoWindow的内容
   * @return {String} String
   *
   * @example <b>参考示例：</b><br />
   * alret(searchInfoWindow.getContent());
   */
  SearchInfoWindow.prototype.getContent = function () {
    return this.dom.content.innerHTML;
  },
  /**
   * 获取searchInfoWindow的标题
   * @return {String} String
   *
   * @example <b>参考示例：</b><br />
   * alert(searchInfoWindow.getTitle());
   */
  SearchInfoWindow.prototype.getTitle = function () {
    return this.dom.title.innerHTML;
  }
  /**
   * 设置信息窗的地理位置
   * @param {Point} point 设置position
   * @return none
   *
   * @example <b>参考示例：</b><br />
   * searchInfoWindow.setPosition(new BMap.Point(116.35,39.911));
   */
  SearchInfoWindow.prototype.setPosition = function ( poi ) {
    this._point = poi;
    this._adjustPosition( poi );
    this._panBox();
    this._removeMarkerEvt();
  }
  /**
   * 获得信息窗的地理位置
   * @return {Point} 信息窗的地理坐标
   *
   * @example <b>参考示例：</b><br />
   * searchInfoWindow.getPosition();
   */
  SearchInfoWindow.prototype.getPosition = function () {
    return this._point;
  }
  /**
   * 返回信息窗口的箭头距离信息窗口在地图
   * 上所锚定的地理坐标点的像素偏移量。
   * @return {Size} Size
   *
   * @example <b>参考示例：</b><br />
   * searchInfoWindow.getOffset();
   */
  SearchInfoWindow.prototype.getOffset = function () {
    return this._opts.offset;
  },

  baidu.object.extend( SearchInfoWindow.prototype, {
    /**
     * 保持屏幕只有一个searchInfoWindow,关闭现在已打开的searchInfoWindow
     */
    _closeOtherSearchInfo: function () {
      var instance = BMapLib.SearchInfoWindow.instance,
          len = instance.length;
      while ( len-- ) {
        if ( instance[len]._isOpen ) {
          instance[len].close();
        }
      }
    },

    /**
   * 设置searchInfoWindow的内容
   * @param {String|HTMLElement} content 弹出气泡中的内容
   * @return none
   *
   * @example <b>参考示例：</b><br />
   * searchInfoWindow.setContent("百度地图API");
   */
    _setContent: function ( content ) {
      if ( !this.dom || !this.dom.content ) {
        return;
      }
      //string类型的content
      if ( typeof content.nodeType === "undefined" ) {
        this.dom.content.innerHTML = content;
      } else {
        this.dom.content.appendChild( content );
      }

      var me = this;
      me._adjustContainerWidth();

      this._content = content;
    },
    /**
     * 调整searchInfoWindow的position
     * @return none
     */
    _adjustPosition: function ( poi ) {
      var pixel = this._getPointPosition( poi );
      var icon = this._marker && this._marker.getIcon();
      if ( this._marker ) {
        this.container.style.bottom = -( pixel.y - this._opts.offset.height - icon.anchor.height + icon.infoWindowAnchor.height ) - this._marker.getOffset().height + 2 + 30 + "px";
        this.container.style.left = pixel.x - icon.anchor.width + this._marker.getOffset().width + icon.infoWindowAnchor.width - this._boxWidth / 2 + 28 + "px";
      } else {
        this.container.style.bottom = -( pixel.y - this._opts.offset.height ) + 30 + "px";
        this.container.style.left = pixel.x - this._boxWidth / 2 + 25 + "px";
      }
    },
    /**
     * 得到searchInfoWindow的position
     * @return Point  searchInfoWindow当前的position
     */
    _getPointPosition: function ( poi ) {
      this._pointPosition = this._map.pointToOverlayPixel( poi );
      return this._pointPosition;
    },
    /**
     * 得到searchInfoWindow的高度跟宽度
     * @return none
     */
    _getSearchInfoWindowSize: function () {
      this._boxWidth = parseInt( this.container.offsetWidth, 10 );
      this._boxHeight = parseInt( this.container.offsetHeight, 10 );
    },
    /**
     * 阻止事件冒泡
     * @return none
     */
    _stopBubble: function ( e ) {
      if ( e && e.stopPropagation ) {
        e.stopPropagation();
      } else {
        window.event.cancelBubble = true;
      }
    },
    /**
     * 自动平移searchInfoWindow，使其在视野中全部显示
     * @return none
     */
    _panBox: function () {
      if ( !this._opts.enableAutoPan ) {
        return;
      }
      var mapH = parseInt( this._map.getContainer().offsetHeight, 10 ),
          mapW = parseInt( this._map.getContainer().offsetWidth, 10 ),
          boxH = this._boxHeight,
          boxW = this._boxWidth;
      //searchInfoWindow窗口本身的宽度或者高度超过map container
      if ( boxH >= mapH || boxW >= mapW ) {
        return;
      }
      //如果point不在可视区域内
      if ( !this._map.getBounds().containsPoint( this._point ) ) {
        this._map.setCenter( this._point );
      }
      var anchorPos = this._map.pointToPixel( this._point ),
          panTop, panY,
          //左侧超出
          panLeft = boxW / 2 - 28 - anchorPos.x + 10,
          //右侧超出
          panRight = boxW / 2 + 28 + anchorPos.x - mapW + 10;
      if ( this._marker ) {
        var icon = this._marker.getIcon();
      }

      //上侧超出
      var h = this._marker ? icon.anchor.height + this._marker.getOffset().height - icon.infoWindowAnchor.height : 0;
      panTop = boxH - anchorPos.y + this._opts.offset.height + h + 31 + 10;

      panX = panLeft > 0 ? panLeft : ( panRight > 0 ? -panRight : 0 );
      panY = panTop > 0 ? panTop : 0;
      this._map.panBy( panX, panY );
    },
    _removeMarkerEvt: function () {
      this._markerDragend && this._marker.removeEventListener( "dragend", this._markerDragend );
      this._markerDragging && this._marker.removeEventListener( "dragging", this._markerDragging );
      this._markerDragend = this._markerDragging = null;
    },
    /**
   * 集中派发事件函数
   *
   * @private
   * @param {Object} instance 派发事件的实例
   * @param {String} type 派发的事件名
   * @param {Json} opts 派发事件里添加的参数，可选
   */
    _dispatchEvent: function ( instance, type, opts ) {
      type.indexOf( "on" ) != 0 && ( type = "on" + type );
      var event = new baidu.lang.Event( type );
      if ( !!opts ) {
        for ( var p in opts ) {
          event[p] = opts[p];
        }
      }
      instance.dispatchEvent( event );
    },

    /**
     * 检索infowindow模板的初始化操作
     */
    _initSearchTemplate: function () {
      this._initDom();
      this._initPanelTemplate();
      this.setTitle( this._opts._title );
      if ( this._opts.height ) {
        this.dom.content.style.height = parseInt( this._opts.height, 10 ) + "px";
      }
      this._setContent( this._content );
      this._initService();
      this._bind();
      if ( this._opts._searchTypes ) {
        this._setSearchTypes();
      }
      this._mendIE6();
    },

    /**
     * 创建检索模板
     * @return dom
     */
    _createSearchTemplate: function () {
      if ( !this._div ) {
        var div = baidu.dom.create( 'div', {
          "class": "BMapLib_SearchInfoWindow",
          "id": "BMapLib_SearchInfoWindow" + this.guid
        } );
        var template = [
            '<div class="BMapLib_bubble_top">',
                '<div class="BMapLib_bubble_title" id="BMapLib_bubble_title' + this.guid + '"></div>',
                '<div class="BMapLib_bubble_tools">',
                    '<div class="BMapLib_bubble_close" title="关闭" id="BMapLib_bubble_close' + this.guid + '">',
                    '</div>',
                    '<div class="BMapLib_sendToPhone" title="发送到手机" id="BMapLib_sendToPhone' + this.guid + '">',
                    '</div>',
                '</div>',
            '</div>',
            '<div class="BMapLib_bubble_center">',
                '<div class="BMapLib_bubble_content" id="BMapLib_bubble_content' + this.guid + '">',
                '</div>',
                '<div class="BMapLib_nav" id="BMapLib_nav' + this.guid + '">',
                    '<ul class="BMapLib_nav_tab" id="BMapLib_nav_tab' + this.guid + '">', //tab选项卡
                        '<li class="BMapLib_first BMapLib_current" id="BMapLib_tab_search' + this.guid + '" style="display:block;">',
                            '<span class="BMapLib_icon BMapLib_icon_nbs"></span>在附近找',
                        '</li>',
                        '<li class="" id="BMapLib_tab_tohere' + this.guid + '" style="display:block;">',
                            '<span class="BMapLib_icon BMapLib_icon_tohere"></span>到这里去',
                        '</li>',
                        '<li class="" id="BMapLib_tab_fromhere' + this.guid + '" style="display:block;">',
                            '<span class="BMapLib_icon BMapLib_icon_fromhere"></span>从这里出发',
                        '</li>',
                    '</ul>',
                    '<ul class="BMapLib_nav_tab_content">', //tab内容
                        '<li id="BMapLib_searchBox' + this.guid + '">',
                            '<table width="100%" align="center" border=0 cellpadding=0 cellspacing=0>',
                                '<tr><td style="padding-left:8px;"><input id="BMapLib_search_text' + this.guid + '" class="BMapLib_search_text" type="text" maxlength="100" autocomplete="off"></td><td width="55" style="padding-left:7px;"><input id="BMapLib_search_nb_btn' + this.guid + '" type="submit" value="搜索" class="iw_bt"></td></tr>',
                            '</table>',
                        '</li>',
                        '<li id="BMapLib_transBox' + this.guid + '" style="display:none">',
                            '<table width="100%" align="center" border=0 cellpadding=0 cellspacing=0>',
                                '<tr><td width="30" style="padding-left:8px;"><div id="BMapLib_stationText' + this.guid + '">起点</div></td><td><input id="BMapLib_trans_text' + this.guid + '" class="BMapLib_trans_text" type="text" maxlength="100" autocomplete="off"></td><td width="106" style="padding-left:7px;"><input id="BMapLib_search_bus_btn' + this.guid + '" type="button" value="公交" class="iw_bt" style="margin-right:5px;"><input id="BMapLib_search_drive_btn' + this.guid + '" type="button" class="iw_bt" value="驾车"></td></tr>',
                            '</table>',
                        '</li>',
                    '</ul>',
                '</div>',
            '</div>',
            '<div class="BMapLib_bubble_bottom"></div>',
            '<img src="http://api.map.baidu.com/library/SearchInfoWindow/1.4/src/iw_tail.png" width="58" height="31" alt="" class="BMapLib_trans" id="BMapLib_trans' + this.guid + '" style="left:144px;"/>'
        ];
        div.innerHTML = template.join( "" );
        this._div = div;
      }
      return this._div;
    },

    /**
     * 创建面板
     */
    _initPanelTemplate: function () {
      var panel = baidu.g( this._opts._panel );
      if ( !this.dom.panel && panel ) {
        panel.innerHTML = "";
        this.dom.panel = panel;
        //供地址选择页用的提示文字
        var address = baidu.dom.create( 'div' );
        address.style.cssText = "display:none;background:#FD9;height:30px;line-height:30px;text-align:center;font-size:12px;color:#994C00;";
        panel.appendChild( address );
        this.dom.panel.address = address;
        //供地址检索面板用
        var localSearch = baidu.dom.create( 'div' );
        panel.appendChild( localSearch );
        this.dom.panel.localSearch = localSearch;
      }
    },

    /**
     * 获取相关的DOM元素
     */
    _initDom: function () {
      if ( !this.dom ) {
        this.dom = {
          container: baidu.g( "BMapLib_SearchInfoWindow" + this.guid ) //容器
            , content: baidu.g( "BMapLib_bubble_content" + this.guid )   //主内容
            , title: baidu.g( "BMapLib_bubble_title" + this.guid )     //标题
            , closeBtn: baidu.g( "BMapLib_bubble_close" + this.guid )     //关闭按钮
            , transIco: baidu.g( "BMapLib_trans" + this.guid )            //infowindow底下三角形
            , navBox: baidu.g( "BMapLib_nav" + this.guid )              //检索容器
            , navTab: baidu.g( "BMapLib_nav_tab" + this.guid )          //tab容器
            , seartTab: baidu.g( "BMapLib_tab_search" + this.guid )       //在附近找tab
            , tohereTab: baidu.g( "BMapLib_tab_tohere" + this.guid )       //到这里去tab
            , fromhereTab: baidu.g( "BMapLib_tab_fromhere" + this.guid )     //从这里出发tab
            , searchBox: baidu.g( "BMapLib_searchBox" + this.guid )        //普通检索容器
            , transBox: baidu.g( "BMapLib_transBox" + this.guid )         //公交驾车检索容器，从这里出发和到这里去公用一个容器
            , stationText: baidu.g( "BMapLib_stationText" + this.guid )      //起点或终点文本
            , nbBtn: baidu.g( "BMapLib_search_nb_btn" + this.guid )    //普通检索按钮
            , busBtn: baidu.g( "BMapLib_search_bus_btn" + this.guid )   //公交驾车检索按钮
            , driveBtn: baidu.g( "BMapLib_search_drive_btn" + this.guid ) //驾车检索按钮
            , searchText: baidu.g( "BMapLib_search_text" + this.guid )      //普通检索文本框
            , transText: baidu.g( "BMapLib_trans_text" + this.guid )       //公交驾车检索文本框
            , sendToPhoneBtn: baidu.g( "BMapLib_sendToPhone" + this.guid )      //发送到手机
        }
        this.container = this.dom.container;
      }
    },

    /**
     * 设置infowindow内容的宽度
     */
    _adjustContainerWidth: function () {
      var width = 250,
          height = 0;
      if ( this._opts.width ) {
        width = parseInt( this._opts.width, 10 );
        width += 10;
      } else {
        width = parseInt( this.dom.content.offsetWidth, 10 );
      }
      if ( width < 250 ) {
        width = 250;
      }

      this._width = width;
      //设置container的宽度
      this.container.style.width = this._width + "px";
      this._adjustTransPosition();
    },

    /**
     * 调整infowindow下三角形的位置
     */
    _adjustTransPosition: function () {
      //调整三角形的位置
      this.dom.transIco.style.left = this.container.offsetWidth / 2 - 2 - 29 + "px";
      this.dom.transIco.style.top = this.container.offsetHeight - 2 + "px";
    },

    /**
     * 初始化各检索服务
     */
    _initService: function () {
      var map = this._map;
      var me = this;
      var renderOptions = {}
      renderOptions.map = map;

      if ( this.dom.panel ) {
        renderOptions.panel = this.dom.panel.localSearch;
      }

      if ( !this.localSearch ) {
        this.localSearch = new BMap.LocalSearch( map, {
          renderOptions: renderOptions
            , onSearchComplete: function ( result ) {
              me._clearAddress();
              me._drawCircleBound();
            }
        } );
      }

      if ( !this.transitRoute ) {
        this.transitRoute = new BMap.TransitRoute( map, {
          renderOptions: renderOptions
            , onSearchComplete: function ( results ) {
              me._transitRouteComplete( me.transitRoute, results );
            }
        } );
      }

      if ( !this.drivingRoute ) {
        this.drivingRoute = new BMap.DrivingRoute( map, {
          renderOptions: renderOptions
            , onSearchComplete: function ( results ) {
              me._transitRouteComplete( me.drivingRoute, results );
            }
        } );
      }
    },

    /**
     * 绑定事件
     */
    _bind: function () {
      var me = this;

      //关闭按钮
      baidu.on( this.dom.closeBtn, "click", function ( e ) {
        me.close();
      } );

      //发送到手机按钮
      baidu.on( this.dom.sendToPhoneBtn, "click", function ( e ) {
        me._sendToPhone();
      } );

      //周边检索tab键
      baidu.on( this.dom.seartTab, "click", function ( e ) {
        me._showTabContent( BMAPLIB_TAB_SEARCH );
      } );

      //到这里去tab
      baidu.on( this.dom.tohereTab, "click", function ( e ) {
        me._showTabContent( BMAPLIB_TAB_TO_HERE );
      } );

      //从这里出发tab
      baidu.on( this.dom.fromhereTab, "click", function ( e ) {
        me._showTabContent( BMAPLIB_TAB_FROM_HERE );
      } );

      //周边检索按钮
      baidu.on( this.dom.nbBtn, "click", function ( e ) {
        me._localSearchAction();
      } );

      //公交检索按钮
      baidu.on( this.dom.busBtn, "click", function ( e ) {
        me._transitRouteAction( me.transitRoute );
      } );

      //驾车检索按钮
      baidu.on( this.dom.driveBtn, "click", function ( e ) {
        me._transitRouteAction( me.drivingRoute );
      } );

      //文本框自动完成提示
      this._autoCompleteIni();

      if ( this._opts.enableSendToPhone === false ) {
        this.dom.sendToPhoneBtn.style.display = 'none';
      }
    },

    /**
     * 显示tab内容
     */
    _showTabContent: function ( type ) {
      this._hideAutoComplete();
      var tabs = this.dom.navTab.getElementsByTagName( "li" ),
          len = tabs.length;

      for ( var i = 0, len = tabs.length; i < len; i++ ) {
        tabs[i].className = "";
      }

      //显示当前tab content并高亮tab
      switch ( type ) {
        case BMAPLIB_TAB_SEARCH:
          this.dom.seartTab.className = "BMapLib_current";
          this.dom.searchBox.style.display = "block";
          this.dom.transBox.style.display = "none";
          break;
        case BMAPLIB_TAB_TO_HERE:
          this.dom.tohereTab.className = "BMapLib_current";
          this.dom.searchBox.style.display = "none";
          this.dom.transBox.style.display = "block";
          this.dom.stationText.innerHTML = "起点";
          this._pointType = "endPoint";
          break;
        case BMAPLIB_TAB_FROM_HERE:
          this.dom.fromhereTab.className = "BMapLib_current";
          this.dom.searchBox.style.display = "none";
          this.dom.transBox.style.display = "block";
          this.dom.stationText.innerHTML = "终点";
          this._pointType = "startPoint";
          break;
      }

      this._firstTab.className += " BMapLib_first";
    },

    /**
     * 绑定自动完成事件
     */
    _autoCompleteIni: function () {
      this.searchAC = new BMap.Autocomplete( {
        "input": this.dom.searchText
          , "location": this._map
      } );
      this.transAC = new BMap.Autocomplete( {
        "input": this.dom.transText
          , "location": this._map
      } );
    },

    /**
     * 关闭autocomplete
     */
    _hideAutoComplete: function () {
      this.searchAC.hide();
      this.transAC.hide();
    },

    /**
     * 销毁autoComplete对象
     */
    _disposeAutoComplete: function () {
      this.searchAC.dispose();
      this.transAC.dispose();
    },

    /**
     * 触发localsearch事件
     */
    _localSearchAction: function () {
      var kw = this._kw = this.dom.searchText.value;
      if ( kw == "" ) {
        //检测是否为空
        this.dom.searchText.focus();
      } else {
        this._reset();
        this.close();
        var radius = this._radius = 1000;
        this.localSearch.searchNearby( kw, this._point, radius );
      }
    },

    /**
     * 画周边检索的圆形圈
     */
    _drawCircleBound: function () {
      this._closeCircleBound();
      var circle = this._searchCircle = new BMap.Circle( this._point, this._radius, {
        strokeWeight: 3,
        strokeOpacity: 0.4,
        strokeColor: "#e00",
        filColor: "#00e",
        fillOpacity: 0.4
      } );

      var label = this._searchLabel = new RadiusToolBar( this._point, this.guid );

      this._map.addOverlay( circle );
      this._map.addOverlay( label );
      this._hasCircle = true;
    },

    /**
     * 修改周边检索的半径
     */
    _changeSearchRadius: function () {
      var radius = parseInt( baidu.g( "BMapLib_search_radius" + this.guid ).value, 10 );
      if ( radius > 0 && radius != this._radius ) {
        this._radius = radius;
        this.localSearch.searchNearby( this._kw, this._point, radius );
        this._closeCircleBound();
      }
    },

    /**
     * 关闭周边检索的圆形圈
     */
    _closeCircleBound: function ( radius ) {
      if ( this._searchCircle ) {
        this._map.removeOverlay( this._searchCircle );
      }
      if ( this._searchLabel ) {
        this._map.removeOverlay( this._searchLabel );
      }
      this._hasCircle = false;
    },

    /**
     * 公交驾车检索查询
     */
    _transitRouteAction: function ( transitDrive ) {
      var kw = this.dom.transText.value;
      if ( kw == "" ) {
        //检测是否为空
        this.dom.transText.focus();
      } else {
        this._reset();
        this.close();
        var transPoi = this._getTransPoi( kw );
        transitDrive.search( transPoi.start, transPoi.end );
      }
    },

    /**
     * 公交驾车查询结束操作
     */
    _transitRouteComplete: function ( transitDrive, results ) {
      this._clearAddress();
      var status = transitDrive.getStatus();
      //导航结果未知的情况
      if ( status == BMAP_STATUS_UNKNOWN_ROUTE ) {
        var startStatus = results.getStartStatus(),
            endStatus = results.getEndStatus(),
            tip = "";
        tip = "找不到相关的线路";
        if ( startStatus == BMAP_ROUTE_STATUS_EMPTY && endStatus == BMAP_ROUTE_STATUS_EMPTY ) {
          tip = "找不到相关的起点和终点";
        } else {
          if ( startStatus == BMAP_ROUTE_STATUS_EMPTY ) {
            tip = "找不到相关的起点";
          }
          if ( endStatus == BMAP_ROUTE_STATUS_EMPTY ) {
            tip = "找不到相关的终点";
          }
        }
        //当前搜索的点找不到明确的路线，但是可以检索到poi点
        if ( this._pointType == "startPoint" && endStatus == BMAP_ROUTE_STATUS_ADDRESS || this._pointType == "endPoint" && startStatus == BMAP_ROUTE_STATUS_ADDRESS ) {
          this._searchAddress( transitDrive );
        } else {
          this.dom.panel.address.style.display = "block";
          this.dom.panel.address.innerHTML = tip;
        }
      }

    },

    /**
     * 检索起点或终点的可选地址
     */
    _searchAddress: function ( transitDrive ) {
      var me = this;
      var panel = this.dom.panel;
      if ( !this.lsAddress ) {
        var renderOptions = { map: this._map };
        if ( panel ) {
          renderOptions.panel = this.dom.panel.localSearch;
        }
        this.lsAddress = new BMap.LocalSearch( this._map, { renderOptions: renderOptions } );
      }
      var station = me._pointType == "startPoint" ? "终点" : "起点";
      if ( panel ) {
        this.dom.panel.address.style.display = "block";
        this.dom.panel.address.innerHTML = "请选择准确的" + station;
      }
      this.lsAddress.setInfoHtmlSetCallback( function ( poi, html ) {
        var button = document.createElement( 'div' );
        button.style.cssText = "position:relative;left:50%;margin:5px 0 0 -30px;width:60px;height:27px;line-height:27px;border:1px solid #E0C3A6;text-align:center;color:#B35900;cursor:pointer;background-color:#FFEECC;border-radius:2px; background-image: -webkit-gradient(linear, left top, left bottom, from(#FFFDF8), to(#FFEECC))";
        button.innerHTML = '设为' + station;
        html.appendChild( button );
        baidu.on( button, "click", function () {
          me._clearAddress();
          var nowPoint = poi.marker.getPosition();
          if ( station == "起点" ) {
            transitDrive.search( nowPoint, me._point );
          } else {
            transitDrive.search( me._point, nowPoint );
          }
        } );
      } );
      this._reset();
      this.lsAddress.search( this.dom.transText.value );
    },

    /**
     * 获取公交驾车的起终点
     */
    _getTransPoi: function ( kw ) {
      var start, end;

      if ( this._pointType == "startPoint" ) {
        start = this._point;
        end = kw;
      } else {
        start = kw;
        end = this._point;
      }

      return {
        "start": start,
        "end": end
      }
    },

    /**
     * 设置当前可提供的检索类型
     */
    _setSearchTypes: function () {
      var searchTypes = this._unique( this._opts._searchTypes ),
          navTab = this.dom.navTab,
          tabs = [this.dom.seartTab, this.dom.tohereTab, this.dom.fromhereTab],
          i = 0,
          len = 0,
          curIndex = 0,
          tab;

      this.tabLength = searchTypes.length;
      tabWidth = Math.floor(( this._width - this.tabLength + 1 ) / this.tabLength );
      if ( searchTypes.length == 0 ) {
        //若为空则不显示检索面板
        this.dom.navBox.style.display = "none";
      } else {
        for ( i = 0, len = tabs.length; i < len; i++ ) {
          tabs[i].className = "";
          tabs[i].style.display = "none";
        }

        for ( i = 0; i < this.tabLength; i++ ) {
          tab = tabs[searchTypes[i]];
          if ( i == 0 ) {
            tab.className = "BMapLib_first BMapLib_current";
            this._firstTab = tab;
            curIndex = searchTypes[i];
          }
          if ( i == this.tabLength - 1 ) {
            //最后一个tab的宽度
            var lastWidth = this._width - ( this.tabLength - 1 ) * ( tabWidth + 1 );
            if ( baidu.browser.ie == 6 ) {
              tab.style.width = lastWidth - 3 + "px";
            } else {
              tab.style.width = lastWidth + "px";
            }
          } else {
            tab.style.width = tabWidth + "px";
          }
          tab.style.display = "block";
        }

        //按照数组顺序排序tab
        if ( searchTypes[1] != undefined ) {
          navTab.appendChild( tabs[searchTypes[1]] )
        }
        if ( searchTypes[2] != undefined ) {
          navTab.appendChild( tabs[searchTypes[2]] )
        }
        this._showTabContent( curIndex );
      }
      this._adjustTransPosition();
    },

    /**
     * 对用户提供的检索类型去重，并剔除无效的结果
     */
    _unique: function ( arr ) {
      var len = arr.length,
          result = arr.slice( 0 ),
          i,
          datum;
      // 从后往前双重循环比较
      // 如果两个元素相同，删除后一个
      while ( --len >= 0 ) {
        datum = result[len];
        if ( datum < 0 || datum > 2 ) {
          result.splice( len, 1 );
          continue;
        }
        i = len;
        while ( i-- ) {
          if ( datum == result[i] ) {
            result.splice( len, 1 );
            break;
          }
        }
      }
      return result;
    },

    /**
     * 清除最近的结果
     */
    _reset: function () {
      this.localSearch.clearResults();
      this.transitRoute.clearResults();
      this.drivingRoute.clearResults();
      this._closeCircleBound();
      this._hideAutoComplete();
    },

    /**
     * 清除地址选择页结果
     */
    _clearAddress: function () {
      if ( this.lsAddress ) {
        this.lsAddress.clearResults();
      }
      if ( this.dom.panel ) {
        this.dom.panel.address.style.display = "none";
      }
    },

    /**
      * IE6下处理PNG半透明
      * @param {Object} infoWin
      */
    _mendIE6: function ( infoWin ) {
      if ( !baidu.browser.ie || baidu.browser.ie > 6 ) {
        return;
      }
      var popImg = this.container.getElementsByTagName( "IMG" );
      for ( var i = 0; i < popImg.length; i++ ) {
        if ( popImg[i].src.indexOf( '.png' ) < 0 ) {
          continue;
        }
        popImg[i].style.cssText += ';FILTER: progid:DXImageTransform.Microsoft.AlphaImageLoader(src=' + popImg[i].src + ',sizingMethod=crop)'
        popImg[i].src = "http://api.map.baidu.com/images/blank.gif";
      }
    },

    /**
      * 发送到手机
      */
    _sendToPhone: function () {
      this.showPopup();
    },

    /**
     * 弹出信息框
     */
    showPopup: function () {
      if ( !this.pop ) {
        this.pop = new Popup( this );
      }
      this._map.addOverlay( this.pop );
    }
  } );

  // 显示半径的自定义label
  function RadiusToolBar( point, guid ) {
    this._point = point;
    this.guid = guid;
  }
  RadiusToolBar.prototype = new BMap.Overlay();
  RadiusToolBar.prototype.initialize = function ( map ) {
    this._map = map;
    var div = this._div = document.createElement( "div" );

    function stopBubble( e ) {
      if ( e && e.stopPropagation ) {
        e.stopPropagation();
      } else {
        window.event.cancelBubble = true;
      }
    }
    baidu.on( div, 'mousedown', stopBubble );
    baidu.on( div, 'click', stopBubble );
    baidu.on( div, 'dblclick', stopBubble );
    var searchInfoWindow = BMapLib.SearchInfoWindow.instance[this.guid];
    div.style.cssText = 'position:absolute;white-space:nowrap;background:#fff;padding:1px;border:1px solid red;z-index:99;';
    div.innerHTML = '<input type="text" value="' + searchInfoWindow._radius + '" style="width:30px;" id="BMapLib_search_radius' + this.guid + '"/>m <a href="javascript:void(0)" title="修改" onclick="BMapLib.SearchInfoWindow.instance[' + this.guid + ']._changeSearchRadius()" style="font-size:12px;text-decoration:none;color:blue;">修改</a><img src="http://api.map.baidu.com/images/iw_close1d3.gif" alt="关闭" title="关闭" style="cursor:pointer;padding:0 5px;" onclick="BMapLib.SearchInfoWindow.instance[' + this.guid + ']._closeCircleBound()"/>';
    map.getPanes().labelPane.appendChild( div );
    return div;
  }
  RadiusToolBar.prototype.draw = function () {
    var map = this._map;
    var pixel = map.pointToOverlayPixel( this._point );
    this._div.style.left = pixel.x + 10 + "px";
    this._div.style.top = pixel.y - 25 + "px";
  }


  //后端服务地址
  var serviceHost = "http://api.map.baidu.com";

  /**
   * 创建弹层对象
   */
  function Popup( iw ) {
    this.iw = iw;
  }

  Popup.prototype = new BMap.Overlay();

  baidu.extend( Popup.prototype, {
    initialize: function ( map ) {
      var me = this;
      this._map = map;
      this.container = this.generalDom();
      this._map.getContainer().appendChild( this.container );
      this.initDom();
      this.bind();
      this.getAddressByPoint();
      this.getRememberPhone();
      this.addPhoneNum = 0;
      return this.container;
    },
    draw: function () {
    },
    generalDom: function () {
      var dom = document.createElement( 'div' ),
          size = this._map.getSize(),
          top = 0,
          left = 0;
      if ( size.width > 450 ) {
        left = ( size.width - 450 ) / 2;
      }
      if ( size.height > 260 ) {
        top = ( size.height - 260 ) / 2;
      }
      dom.style.cssText = "position:absolute;background:#fff;width:480px;height:260px;top:" + top + "px;left:" + left + "px;ovflow:hidden;";
      var html = [
          '<div class="BMapLib_sms_tab_container">',
              '<span>发送到手机</span>',
              '<span id="BMapLib_sms_tip" style="display:none;">',
              '</span>',
          '</div>',
          '<div id="BMapLib_sms_pnl_phone" class="BMapLib_sms_pnl_phone" style="display: block;">',
              '<div class="BMapLib_ap" id="pnl_phone_left" style="display: block;">',
                  '<table>',
                    '<tr>',
                      '<th>发送方手机号</th>',
                      '<td><input type="text" bid="" id="BMapLib_phone_0" maxlength="11" class="BMapLib_sms_input BMapLib_sms_input_l" /><span id="BMapLib_activateTip"></span></td>',
                    '</tr>',
                    '<tr id="BMapLib_activateBox" style="display:none;">',
                      '<th>激活码</th>',
                      '<td><input type="text" id="BMapLib_activate" class="BMapLib_sms_input BMapLib_sms_input_s" maxlength="4"/><input type="button" value="获取" id="BMapLib_activate_btn" bid="activate" />',
                    '</tr>',
                      '<tr>',
                          '<th></th>',
                          '<td>',
                          '</td>',
                      '</tr>',
                    '<tr>',
                      '<th style="vertical-align:top;padding-top:7px;">接收方手机号</th>',
                      '<td><div><input type="text" id="BMapLib_phone_1" class="BMapLib_sms_input BMapLib_sms_input_l" maxlength="11"/><input type="checkbox" id="BMapLib_is_remember_phone"/>记住此号</div>',
                              '<div id="BMapLib_add_phone_con"></div>',
                              '<div><a href="javascript:void(0)" id="BMapLib_add_phone_btn" bid="addPhone">新增</a></div>',
                          '</td>',
                    '</tr>',
                      '<tr>',
                      '<th></th>',
                      '<td ><input type="text" id="BMapLib_ver_input"  maxlength="4" style="width:67px;border: 1px solid #a5acb2;vertical-align: middle;height:18px;" tabindex="5" placeholder="验证码"><img width="69" height="20" id="BMapLib_ver_image" bid="BMapLib_ver_image" style="border: 1px solid #d5d5d5;vertical-align:middle;margin-left: 5px;" alt="点击更换数字" title="点击更换数字"></td>',
                      '</tr>',
                    '<tr>',
                      '<th></th>',
                      '<td><input type="button" value="免费发送到手机" bid="sendToPhoneBtn"/></td>',
                    '</tr>',
                  '</table>',
              '</div>',
            '<div class="BMapLib_mp" id="pnl_phone_right" style="display: block;">',
                    '<div class="BMapLib_mp_title">短信内容：</div>',
                    '<div id="BMapLib_msgContent" class="BMapLib_msgContent"></div>',
            '</div>',
            '<div style="clear:both;"></div>',
            '<p id="BMapLib_sms_declare_phone" class="BMapLib_sms_declare_phone">百度保证不向任何第三方提供输入的手机号码</p>',
            '<div id="tipError" class="tip fail" style="display:none;">',
              '<span id="tipText"></span>',
              '<a href="javascript:void(0)" id="tipClose" class="cut"></a>',
            '</div>',
            '<div id="sms_lack_tip" style="display:none;">已达每日5次短信上限</div>',
            '<div id="sms_unlogin_tip" style="display:none;">',
                  '<div style="padding-left:40px;">',
                      '<ul class="login_ul"><li id="normal_login-2" class="login_hover"><a href="javascript:void(0)">手机登录</a></li></ul>',
                      '<div id="loginBox_02" class="loginBox">',
                          '<div id="pass_error_info-2" class="pass_error_style"></div>',
                          '<div id="passports-2"></div>',
                          '<div id="loginIframe_iph-2" style="display:none"></div>',
                      '</div>',
                  '</div>',
                '<div class="nopass" style="padding-left:128px;">没有百度帐号？<a href="https://passport.baidu.com/v2/?reg&amp;regType=1&amp;tpl=ma" target="_blank">立即注册</a></div>',
            '</div>',
          '</div>',
          '<button class="BMapLib_popup_close" bid="close"></button>',
          '<div id="BMapLib_success_tip" style="display:none;">您的短信已经发送到您的手机，请注意查收!</div>'

      ].join( '' );
      dom.innerHTML = html;
      return dom;
    },
    initDom: function () {
      this.dom = {
        sms_tip: baidu.g( 'BMapLib_sms_tip' ),  //提示框
        activate_btn: baidu.g( 'BMapLib_activate_btn' ), //获取激活码按钮
        fromphone: baidu.g( "BMapLib_phone_0" ),
        tophone: baidu.g( "BMapLib_phone_1" ),
        isRememberPhone: baidu.g( "BMapLib_is_remember_phone" ),
        sms_container: baidu.g( 'BMapLib_sms_pnl_phone' ),
        success_tip: baidu.g( 'BMapLib_success_tip' ), // 发送成功提示框
        add_phone_con: baidu.g( 'BMapLib_add_phone_con' ),
        add_phone_btn: baidu.g( 'BMapLib_add_phone_btn' ),
        activateBox: baidu.g( 'BMapLib_activateBox' ),
        activateTip: baidu.g( 'BMapLib_activateTip' ),
        activate_input: baidu.g( "BMapLib_activate" ),
        ver_image: baidu.g( "BMapLib_ver_image" ),
        ver_input: baidu.g( "BMapLib_ver_input" )

      }
    },
    showTip: function ( result ) {
      var error = result.error;
      var tipObj = {
        'PHONE_NUM_INVALID': '手机号码无效',
        'SMS_SEND_SUCCESS': '发送到手机成功',
        'AK_INVALID': '你所使用的key无效',
        'INTERNAL_ERROR': '服务器错误',
        'OVER_MAX_ACTIVATE_TIME': '今天已超过发送激活码最大次数',
        'SMS_ACTIVATE_SUCCESS': '激活码已发送到您的手机，请注意查收！',
        'ACTIVATE_FAIL': '手机激活码无效',
        'SMS_LACK': '今天您还能往5个手机发送短信',
        'PARAM_INVALID': '请填完所有选项',
        'SEND_ACTIVATE_FAIL': '激活码发送失败',
        'VCODE_VERITY_FAIL': '验证码校验失败'
      }
      var tip = tipObj[error];
      if ( error == 'SMS_LACK' ) {
        var res_sms = result.res_sms;
        tip = "今天您还能往" + res_sms + "个手机发送短信";
        this.addPhoneNum = res_sms - 1;
      }
      this.renderImageVer();
      if ( tip ) {
        this.dom.sms_tip.innerHTML = tip;
        this.dom.sms_tip.style.display = "inline";
      }
      if ( error == 'SMS_SEND_SUCCESS' ) {
        this.rememberPhone();
        this.sendSuccess();
      }
    },
    //绑定事件
    bind: function () {
      var me = this;
      me.renderImageVer();
      baidu.on( this.container, 'click', function ( e ) {
        var target = e.target || e.srcElement,
            bid = target.getAttribute( 'bid' );
        switch ( bid ) {
          case 'close':
            me.closeActon();
            break;
          case 'sendToPhoneBtn':
            me.sendAction();
            break;
          case 'activate':
            me.activateAction();
            break;
          case 'addPhone':
            me.addPhoneAction();
            break;
          case 'deletePhone':
            me.deletePhoneAction( target );
            break;
          case 'BMapLib_ver_image':
            me.renderImageVer();
        }
      } );

      var phone0 = baidu.g( 'BMapLib_phone_0' );
      var phone1 = baidu.g( 'BMapLib_phone_1' );
      //限制输入的字符，只能输数字和逗号
      this.container.onkeypress = function ( e ) {

        var event = e || window.e,
            keyCode = event.which || event.keyCode,
            result = false;
        if ( keyCode >= 48 && keyCode <= 57 || keyCode == 44 || keyCode == 8 ) {
          result = true;
        }
        return result;
      };
      this.dom.ver_input.onkeypress = function ( e ) {
        me._stopBubble( e );
        var event = e || window.e,
            keyCode = event.which || event.keyCode,
            result = false;
        if ( keyCode >= 48 && keyCode <= 57 || keyCode >= 65 && keyCode <= 90 || keyCode >= 97 && keyCode <= 122 ) {
          result = true;
        }
        return result;

      };

      baidu.on( this.dom.fromphone, 'blur', function () {
        if ( baidu.isPhone( this.value ) ) {
          me.checkActivateAction();
        } else {
          me.dom.activateTip.innerHTML = "";
          me.dom.activateBox.style.display = "none";
        }
      } );

      baidu.on( this.dom.activate_input, 'blur', function () {
        if ( baidu.isActivateCode( this.value ) ) {
          me.checkActivateAction();
        }
      } );
    },
    /**
     * 阻止事件冒泡
     * @return none
     */
    _stopBubble: function ( e ) {
      if ( e && e.stopPropagation ) {
        e.stopPropagation();
      } else {
        window.event.cancelBubble = true;
      }
    },
    //请求验证码.
    renderImageVer: function () {
      var me = this;
      //验证码想着绑定
      this.request( "http://map.baidu.com/maps/services/captcha?", { "cbName": "cb" }, function ( data ) {
        me.vcode = data['content']['vcode'];
        me.dom.ver_image.src = 'http://map.baidu.com/maps/services/captcha/image?vcode=' + me.vcode;
      } );
    },
    //验证手机号是否已经激活
    checkActivateAction: function () {
      var param = {
        phone: this.dom.fromphone.value,
        activate: this.dom.activate_input.value,
        cbName: 'callback'
      }
      var me = this;
      this.request( this.config.ckActivateURL, param, function ( res ) {
        if ( !res || res.isactivate == false ) {
          //未激活
          me.dom.activateBox.style.display = "table-row";
          me.dom.activateTip.style.color = "red";
          me.dom.activateTip.innerHTML = "未激活";
        } else {
          //已激活
          me.dom.activateBox.style.display = "none";
          me.dom.activateTip.style.color = "green";
          me.dom.activateTip.innerHTML = "已激活";
        }
      } );
    },
    //点击激活按钮事件
    activateAction: function () {
      var me = this;
      var ak = this._map.getKey();
      var params = {
        phone: this.dom.fromphone.value,
        ak: ak,
        cbName: "callback"
      }
      if ( baidu.isPhone( params.phone ) ) {
        this.request( this.config.activateURL, params, function ( result ) {
          if ( result ) {
            me.showTip( result );
          }
        } );
      } else {
        this.showTip( {
          error: 'PHONE_NUM_INVALID'
        } );
      }
    },
    //点击关闭按钮事件
    closeActon: function () {
      this._map.removeOverlay( this );
    },
    // 获取短信的内容
    getMessage: function () {
    },
    // 免费发送到手机点击事件
    sendAction: function () {
      var me = this;
      if ( this.validate() ) {
        tophoneStr = baidu.g( "BMapLib_phone_1" ).value;
        var addPhones = this.dom.add_phone_con.getElementsByTagName( 'input' );
        for ( var i = 0, len = addPhones.length; i < len; i++ ) {
          if ( baidu.isPhone( addPhones[i].value ) ) {
            tophoneStr += ',' + addPhones[i].value;
          } else {
            this.showTip( {
              error: 'PHONE_NUM_INVALID'
            } );
            return;
          }
        }
        var ak = this._map.getKey();
        var params = {
          fromphone: baidu.g( "BMapLib_phone_0" ).value,  //发送方手机
          tophone: tophoneStr,                        //发送到手机
          ak: ak,                               //用户ak
          activate: this.dom.activate_input.value,     //激活码
          code_input: this.dom.ver_input.value,
          vcode: this.vcode,
          content: baidu.g( "BMapLib_phone_0" ).value + "分享一个位置给您，" + this.messageContent,
          cbName: 'callback'
        };
        this.request( this.config.sendURL, params, function ( result ) {
          if ( result ) {
            me.showTip( result );
          }
        } );
      }
    },
    //检验数据格式是否正确
    validate: function () {
      var flag = true;
      if ( !( baidu.isPhone( this.dom.fromphone.value ) && baidu.isPhone( this.dom.tophone.value ) ) ) {
        flag = false;
        this.showTip( {
          error: 'PHONE_NUM_INVALID'
        } );
      };
      return flag;
    },
    getAddressByPoint: function () {
      var pt = this.iw._point,
          me = this,
          gc = new BMap.Geocoder();
      gc.getLocation( pt, function ( rs ) {
        if ( rs && rs.addressComponents ) {
          var addComp = rs.addressComponents;
          me.address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
          me.generalMessage();
        }
      } );
    },
    generalMessage: function () {
      var msgContent = baidu.g( 'BMapLib_msgContent' );
      var msg = "";
      var iw = this.iw;
      var point = iw.getPosition();
      if ( this.userPhone ) {
        msg += this.userPhone + "分享一个位置给您，";
      }
      if ( iw.getTitle ) {
        msg += "名称为：" + iw.getTitle() + "，";
      }
      if ( this.address ) {
        msg += "大致位置在" + this.address + "，";
      }
      var uri = "http://api.map.baidu.com/marker?location=" + point.lat + "," + point.lng + "&title=" + encodeURIComponent( iw.getTitle() ) + "&content=" + encodeURIComponent( iw.getContent() ) + "&output=html";
      var params = {
        url: encodeURIComponent( uri ),
        t: new Date().getTime(),
        cbName: 'callback'
      };
      var me = this;
      this.request( this.config.shortURL, params, function ( result ) {
        msg += "查看地图：" + result.url ? result.url : uri;
        me.messageContent = msg;
        msgContent.innerHTML = msg;
      } );
    },
    //记住手机号码
    rememberPhone: function () {
      if ( this.dom.isRememberPhone.checked ) {
        var phone = this.dom.tophone.value;
        baidu.cookie.set( 'BMapLib_phone', phone, {
          path: '/',
          expires: 30 * 24 * 60 * 60 * 1000
        } );
      }
    },
    //获取记住的手机号码
    getRememberPhone: function () {
      var phone = baidu.cookie.get( 'BMapLib_phone' );
      if ( phone ) {
        this.dom.tophone.value = phone;
        this.dom.isRememberPhone.checked = true;
      }
    },
    //发送成功后执行
    sendSuccess: function () {
      this.dom.sms_container.style.display = "none";
      this.dom.success_tip.style.display = "block";
      var me = this;
      setTimeout( function () {
        me._map.removeOverlay( me );
      }, 1500 );
    },
    //新增手机号事件
    addPhoneAction: function () {
      if ( this.addPhoneNum >= 4 ) {
      } else {
        var div = document.createElement( 'div' );
        div.innerHTML = '<input type="text" class="BMapLib_sms_input BMapLib_sms_input_l" maxlength="11"/><a href="javascript:void(0);" style="margin-left:5px;" bid="deletePhone">删除</a>';
        this.dom.add_phone_con.appendChild( div );
        this.addPhoneNum++;
      }
    },
    //删除一个手机号事件
    deletePhoneAction: function ( target ) {
      target.parentNode.parentNode.removeChild( target.parentNode );
      this.addPhoneNum--;
    },
    //jsonp 请求
    request: function ( url, params, cbk ) {
      // 生成随机数
      var timeStamp = ( Math.random() * 100000 ).toFixed( 0 );
      // 全局回调函数
      BMapLib["BMapLib_cbk" + timeStamp] = function ( json ) {
        cbk && cbk( json );
        delete BMapLib["BMapLib_cbk" + timeStamp];
      };

      for ( var item in params ) {
        if ( item != "cbName" ) {
          url += '&' + item + "=" + params[item];
        }
      }

      var me = this;
      url += "&" + params.cbName + "=BMapLib.BMapLib_cbk" + timeStamp;

      scriptRequest( url );
    },
    config: {
      sendURL: serviceHost + "/ws/message?method=send",
      activateURL: serviceHost + "/ws/message?method=activate",
      ckActivateURL: serviceHost + "/ws/message?method=ckActivate",
      shortURL: "http://j.map.baidu.com/?"
    }

  } );

  /**
   * script标签请求
   * @param {String} url      请求脚本url 
   */
  function scriptRequest( url ) {
    var script = document.createElement( "script" );
    script.setAttribute( "type", "text/javascript" );
    script.setAttribute( "src", url );
    // 脚本加载完成后进行移除
    if ( script.addEventListener ) {
      script.addEventListener( 'load', function ( e ) {
        var t = e.target || e.srcElement;
        t.parentNode.removeChild( t );
      }, false );
    }
    else if ( script.attachEvent ) {
      script.attachEvent( 'onreadystatechange', function ( e ) {
        var t = window.event.srcElement;
        if ( t && ( t.readyState == 'loaded' || t.readyState == 'complete' ) ) {
          t.parentNode.removeChild( t );
        }
      } );
    }
    // 使用setTimeout解决ie6无法发送问题
    setTimeout( function () {
      document.getElementsByTagName( 'head' )[0].appendChild( script );
      script = null;
    }, 1 );
  }



  //用来存储创建出来的实例
  var guid = 0;
  BMapLib.SearchInfoWindow.instance = [];
} )();
