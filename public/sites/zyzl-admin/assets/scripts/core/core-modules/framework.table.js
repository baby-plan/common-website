define(['jquery', 'cfgs',
  'core/core-modules/framework.ajax',
  'core/core-modules/framework.event'],
  function ($, cfgs, ajax, event) {

    /**
     * 根据缓存数据索引获取数据内容
     * @param {number} index 缓存数据的索引
     */
    var getdata = (index) => {
      if (cfgs.pageOptions.buffer && cfgs.pageOptions.buffer.data.length > 0) {
        return cfgs.pageOptions.buffer.data[index];
      } else {
        return;
      }
    };

    var render = (target, columns) => {
      console.log("渲染表格");
      target.addClass("datatable table table-striped table-bordered table-hover");
      var row = $("<div />").addClass("col-sm-12 bottom text-right").appendTo(target.parent().parent());
      $("<ul/>").addClass("pagination").appendTo(row);
      target.wrapAll("<div class=\"table-scrollable\"></div>");
      $("<span/>").addClass("pageinfo").appendTo(row);
      row.hide();
      var thead = $("<thead/>").appendTo(target);
      var tr = $("<tr/>").appendTo(thead);
      $.each(columns, (index, column) => {
        $("<th/>").html(column).addClass("center").appendTo(tr);
      });
    }

    /** 初始化表格注册按钮事件.
     * @param {object} options 请求参数选项
     *  pagecount : 页面总数.
     *  pageindex : 当前页面索引.
     * @private
     */
    var _regist_table = (options) => {
      var defaults = { "pagecount": "1", "pageindex": "1" };
      var options = $.extend(defaults, options);
      // 仅有1页时,删除分页内容
      if (options.pagecount == 1) {
        $(".pagination").parent().hide();
        return;
      } else {
        $(".pagination").parent().show();
      }
      $(".pagination").empty();
      $(".pageinfo").text("共" + cfgs.pageOptions.buffer.recordcount + "条记录,每页" + cfgs.pageOptions.buffer.pagesize + "条,共" + options.pagecount + "页");
      var paper_index = options.pageindex * 1;
      var paper_count = 5;
      var begin = paper_index - 2;
      var end = paper_index + 2;

      var li = $("<li />").appendTo($(".pagination"));
      $("<a href=\"javascript:;\"/>").text("首页").attr("data-index", 1).appendTo(li);
      if (paper_index == 1) {
        li.addClass("disabled");
      }
      li = $("<li />").appendTo($(".pagination"));
      $("<a href=\"javascript:;\"/>").text("上一页").attr("data-index", paper_index - 1).appendTo(li);
      if (paper_index == 1) {
        li.addClass("disabled");
      }
      if (begin < 1) {
        if (paper_count <= options.pagecount) {
          end = paper_count;
        } else {
          end = options.pagecount;
        }
        begin = 1;
      } else if (end >= options.pagecount) {
        end = options.pagecount;
        begin = end - paper_count + 1;
        if (begin < 1) {
          begin = 1;
        }
      }
      for (; begin <= end; begin++) {
        li = $("<li />").appendTo($(".pagination"));
        $("<a href=\"javascript:;\"/>").attr("data-index", begin).text(begin).appendTo(li);
        if (paper_index == begin) {
          li.addClass("active");
        }
      }
      li = $("<li />").appendTo($(".pagination"));
      $("<a href=\"javascript:;\"/>").text("下一页").attr("data-index", (paper_index + 1)).appendTo(li);
      if (paper_index == options.pagecount) {
        li.addClass("disabled");
      }
      li = $("<li />").appendTo($(".pagination"));
      $("<a href=\"javascript:;\"/>").text("末页").attr("data-index", options.pagecount).appendTo(li);
      if (paper_index == options.pagecount) {
        li.addClass("disabled");
      }
      // 注册内容中的点击事件
      $(".pagination>li>a").on("click", function () {
        //  当前选中的页或禁用的页不响应事件
        if ($(this).parent().hasClass("active")
          || $(this).parent().hasClass("disabled")) {
          return;
        }
        var index = $(this).attr("data-index");
        module.reload(index);
      });
    };

    /** 将缓存中的数据填充至表格 @private */
    var displayTable = function () {
      var start_index = (cfgs.pageOptions.buffer.pageindex - 1) * cfgs.pageOptions.buffer.pagesize + 1;
      /* 生成页面数据起始索引 */
      var table = getTable();
      $("tbody", table).empty();
      if (cfgs.pageOptions.buffer.data.length > 0) {
        $.each(cfgs.pageOptions.buffer.data, function (index, item) {
          /* 填充数据*/
          cfgs.pageOptions.requestOptions.parsefn($("<tr />").appendTo(table), index, start_index + index, item);
        });
      }
      var selector = $('table>tbody>tr[class*="selected"]');
      // EVENT-RAISE:table.selected table选中行后触发 {selector,length}
      event.raise('table.selected', {
        "selector": selector,
        "length": selector.length
      });
      _regist_table({
        "pagecount": cfgs.pageOptions.buffer.pagecount,
        "pageindex": cfgs.pageOptions.buffer.pageindex
      });
    }

    /** 获取需要处理的表格对象 @private*/
    var getTable = function () {
      return $(".qdp-table");
    }

    /** 公共数据处理:回调parsefn填充数据并且生成分页按钮
     * @param {object} options 请求参数选项.
     *  api       : 请求数据的地址
     *  args      : 请求API附带的参数
     *  pageindex : 分页索引
     *  parsefn   : 填充表格的解析函数,参数为新增的列,列索引,列数据索引,数据内容对象
     *  token     : 请求的TOKEN,默认为当前用户TOKEN
     */
    var load = (options) => {
      /* 缓存最后一次操作，用于删除数据后重新加载 */
      cfgs.pageOptions.requestOptions = options;
      var defaults = {
        "pagenumber": 1
      };
      var reqOptions = $.extend(defaults, options.args);
      if (options.pageindex) {
        reqOptions.pagenumber = options.pageindex;
      }
      var table = getTable();
      var callback = {
        /*操作成功-填充列表数据*/
        "success": function () { // 
          displayTable();
        },
        /*清空表格数据*/

        "clear": function () {
          $("tbody", table).empty();
        },
        /*数据为空-追加空数据行*/

        "noneDate": function () {
          var tr = $("<tr />").appendTo(table);
          $("<td/>").text("没有数据")
            .attr("colspan", $("thead>tr>th", table).length)
            //.attr("height", 40*5)
            .appendTo(tr);
          _regist_table({
            "pagecount": 1,
            "pageindex": 1
          });
        },

        "busy": function () {
          var tr = $("<tr />").appendTo(table);
          $("<td/>").text("正在检索数据,请稍候...")
            .attr("colspan", $("thead>tr>th", table).length)
            //.attr("height", 40*5)
            .appendTo(tr);
        }
      };
      ajax.get(options.api, reqOptions, callback);
    }

    /** 使用 load 前一次参数重新加载并处理数据
     * @param {number} pageindex 请求新页面的索引
     */
    var reload = (pageindex) => {
      if (cfgs.pageOptions.requestOptions) {
        if (pageindex) {
          cfgs.pageOptions.requestOptions.pageindex = pageindex;
        }
        module.load(cfgs.pageOptions.requestOptions);
      }
    }

    var Export = () => {
      console.debug('导出EXCEL');
      var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) },
        format = function (s, c) {
          return s.replace(/{(\w+)}/g,
            function (m, p) { return c[p]; })
        }
      return function (name) {
        var table = document.getElementById('table');
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
        window.location.href = uri + base64(format(template, ctx))
      }
    }

    var getSelectData = function () {
      var datas = getSelectDatas();
      if (datas.length == 1) {
        return datas[0];
      } else {
        return null;
      }
    }

    var getSelectDatas = function () {
      var selector = $('table tr[class*="selected"]');
      var datas = [];
      $.each(selector, function (index, item) {
        var id = $(item).attr('data-id');
        var data = getdata(id);
        datas.push(data);
      });

      return datas;
    }

    var module = {
      'define': {
        "name": "PLUGIN-LAYOUT-TABLE",
        "version": "1.0.1.0",
        'copyright': ' Copyright 2017-2027 WangXin nvlbs,Inc.',
      },
      getdata: getdata,
      render: render,
      load: load,
      reload: reload,
      export: Export,
      getSelects: getSelectDatas,
      getSelect: getSelectData
    };

    return module;

  });