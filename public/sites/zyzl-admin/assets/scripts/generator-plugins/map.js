define(
  [
    'http://webapi.amap.com/maps?v=1.3&key=f0948ced2976d1bcc654eff99d796a32&plugin=AMap.Autocomplete',
    'http://cache.amap.com/lbs/static/addToolbar.js'
  ],
  () => {
    var module = {};

    var insertMapModal = function (column) {
      var id = column.name;
      var viewID = 'map_' + id;
      var container = $('#ajax-content');

      var modal = $('<div/>')
        .addClass('modal fade')
        .attr('tabindex', '1')
        .attr('role', 'dialog')
        .attr('aria-labelledby', viewID + 'label')
        .attr('aria-hidden', 'true')
        .attr('id', viewID)
        .appendTo(container);
      var dialog = $('<div />')
        .addClass('modal-dialog')
        .css({ 'width': ($(window).width() - 50) + 'px' })
        .appendTo(modal);
      var content = $('<div/>')
        .addClass('modal-content')
        .appendTo(dialog);

      var header = $('<div/>')
        .addClass('modal-header')
        .appendTo(content);

      $('<button/>')
        .addClass('close')
        .attr('type', 'button')
        .attr('data-dismiss', 'modal')
        .attr('aria-hidden', 'true')
        .html(' &times;')
        .appendTo(header);
      $('<h4/>')
        .addClass('modal-title')
        .attr('id', viewID + 'label')
        .text('地图选点(鼠标滚动缩放地图,鼠标拖动移动地图)')
        .appendTo(header);

      $('<div/>')
        .addClass('modal-body')
        .attr('id', viewID + '_main')
        .css({ 'height': ($(window).height() - 150) + 'px' })
        .appendTo(content);

      var footer = $('<div/>')
        .addClass('modal-footer')
        .appendTo(content);

      var group = $('<div />')
        .addClass('form-group col-sm-4')
        .appendTo(footer);

      $('<input />')
        .attr('type', 'text')
        .attr('id', viewID + '_input')
        .attr('placeholder', '请输入关键字进行搜索')
        .addClass('form-control')
        .appendTo(group);

      $('<button />')
        .attr('type', 'button')
        .addClass('btn btn-primary')
        .html('确定')
        .appendTo(footer);

      $('<button />')
        .attr('type', 'button')
        .attr('data-dismiss', 'modal')
        .addClass('btn btn-primary')
        .html('关闭')
        .appendTo(footer);

    }

    module.init = (column, data) => {
      insertMapModal(column);
      $('#' + column.name)
        .parent()
        //  .find('.map-set')
        .on('click', function () {

          $('#map_' + column.name).modal({
            keyboard: false
          });
          $('.amap-sug-result').remove();
          setTimeout(function () {     //添加延时加载。解决问题
            var map = new AMap.Map('map_' + column.name + '_main', {
              resizeEnable: true,
            });
            //为地图注册click事件获取鼠标点击出的经纬度坐标
            var clickEventListener = map.on('click', function (e) {
              console.log(e.lnglat.getLng() + ',' + e.lnglat.getLat());
            });
            var auto = new AMap.Autocomplete({
              input: 'map_' + column.name + '_input'
            });
            AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
            function select(e) {
              if (e.poi && e.poi.location) {
                map.setZoom(15);
                map.setCenter(e.poi.location);
              }
            }
          }, 300);
        });
    }
    module.destroy = () => {

    };
    return module;
  });