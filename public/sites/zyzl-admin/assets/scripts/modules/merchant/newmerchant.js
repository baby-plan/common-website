define(["QDP"], function (QDP) {
  "use strict";

  return {
    define: {
      name: "商户基本信息管理",
      version: "1.0.0.0",
      copyright: " Copyright 2017-2027 WangXin nvlbs,Inc."
    },

    /** 加载模块 */
    init: function () {
      console.log('init-tenant-初始化成功!');

      QDP.form.init();
      var cardSearch = function () {
        QDP.block.show('正在加载数据...');
        QDP.ajax.get(QDP.api.merchant.datas, {}, (json) => {
          $("#merchant-data").tmpl(json.data.list, {
            decode: function (text) {
              return QDP.base64.decode(text);
            }
          }).appendTo('#list');

          $("#merchant-data").tmpl(json.data.list, {
            decode: function (text) {
              return QDP.base64.decode(text);
            }
          }).appendTo('#list');

          $("#merchant-data").tmpl(json.data.list, {
            decode: function (text) {
              return QDP.base64.decode(text);
            }
          }).appendTo('#list');
          QDP.block.close();
        });
      };

      // 新增商户按钮点击事件处理函数
      $(document).on('click', '.add-new', function () {
        // alert('打开新增商户信息界面');
        QDP.form.openview({
          map: true,
          title: '新增商户信息',
          url: QDP.api.merchant.editpage,
          callback: function () {

          }
        });
      });

      // 删除选中内容
      $(document).on('click', '.content-toolbar>.btn-delete', function () {
        $('#list>.selected').each(function () {
          $(this).remove();
        })
        refreshDeleteAction();
      });

      // 全选按钮点击事件处理函数
      $(document).on('click', '.content-toolbar>.btn-selectall', function () {
        $('#list>div').each(function () {
          if ($(this).hasClass('add-new')) {
            return;
          }
          if (!$(this).hasClass('selected')) {
            $(this).addClass('selected');
          }
        });
        refreshDeleteAction();
      });

      // 反选按钮点击事件处理函数
      $(document).on('click', '.content-toolbar>.btn-selectopp', function () {
        $('#list>div').each(function () {
          if ($(this).hasClass('add-new')) {
            return;
          }
          if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
          } else {
            $(this).addClass('selected');
          }
        });
        refreshDeleteAction();
      });

      // 刷新删除按钮状态
      var refreshDeleteAction = function () {
        if ($('#list>.selected').length != 0) {
          if ($('.content-toolbar>.btn-delete').length == 0) {
            var link = $('<a/>')
              .attr("href", "javascript:;")
              .html(' <i class="fa fa-trash-o"></i> 删除 ')
              .addClass('btn btn-danger btn-delete');
            $('.content-toolbar').append(link);
          }
        } else {
          $('.content-toolbar>.btn-delete').remove();
        }
      }

      // 点击卡片时处理选中状态，同时处理批量删除按钮状态
      $(document).on('click', '#list>div', function () {
        if ($(this).hasClass('add-new')) {
          return;
        }
        if ($(this).hasClass('selected')) {
          $(this).removeClass('selected');
        } else {
          $(this).addClass('selected');
        }
        refreshDeleteAction();
      });

      $(document).on('click', 'form ul>li:not(:first)>a', function () {
        // var that = $(this);
        if ($(this).hasClass('btn-info')) {
          $(this).removeClass('btn-info');
        } else {
          $('li>.btn-info', $(this).parent().parent()).each(function () {
            $(this).removeClass('btn-info');
          });
          $(this).addClass('btn-info');
        }
        // $('li>.btn-info', $(this).parent().parent()).each(function () {
        //   if (that == $(this)) {
        //     return;
        //   }
        //   $(this).removeClass('btn-info');
        // });
        // $(this).toggleClass('btn-info');
      });

      $('#content-container').slimScroll().bind('slimscroll', function (e, pos) {
        if (pos == 'bottom') {
          cardSearch();
        } else if (pos == 'top') {
          $('#content-container').removeClass('hide-filter');
        } else {
        }
      });

      setInterval(function () {
        if ($('#content-container+.slimScrollBar').length == 0) {
          return;
        }
        var offset = $('#content-container+.slimScrollBar').offset();
        if (offset.top < 200) {
          $('#content-container').removeClass('hide-filter');
        } else {
          $('#content-container').addClass('hide-filter');
        }
      }, 500);

      // // 启用/禁用 高级查询功能
      // $('.addon-advanced').on('click', function () {
      //   // alert('test');
      // });

      // 执行查询事件处理
      $('.addon-search').on('click', function () {
        cardSearch();
      });

      // 重置查询条件事件处理
      $('.addon-reset').on('click', function () {
        $('form .btn-info').each(function () {
          $(this).removeClass('btn-info');
        });
      });
    },
    /** 卸载模块 */
    destroy: function () {
      // $(document).off("change");
    }
  };
});