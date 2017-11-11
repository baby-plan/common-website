//轨迹回放插件
(function (app) {
  var currentCar; // 当前车辆
  var map, parentView; // 当前模式窗口

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

    // $(".modal-title", parentView).append(" - " + currentCar.text);
    var contentHeight = $(".modal-body", parentView).height();
    var mapHeight = contentHeight - $(".modal-body .row", parentView).eq(0).height();
    $("#allmap").height(mapHeight);
  }

  app.plugins.setup.electricFence = function (parent) {
    _initialize(parent);
  };
})(App);
