//告警查询插件
(function (app) {

  app.plugins.searchs.alert = {
    init: function () {
      App.services.car.fill("#treeview");
    }
  };
})(App);
