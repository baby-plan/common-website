define(["QDP"], function (QDP) {
  "use strict";

  /** 初始化编辑界面,若data有值则视为编辑数据,否则视为新增数据
   * @param {JSON} data 编辑时传入的数据,新增时不需要
   */
  var initEditor = function (data) {
    /* 初始化编辑界面 */
    var container = $("#province-container");

    container.on('click', 'label', function () {
      $(this).toggleClass("selected");
    });

    $.each(QDP.config.dict.province, function (code, province) {
      container.append(
        $("<div/>")
          .addClass("col-sm-3 col-xs-4")
          .append(
          $("<label/>")
            .addClass('form-label')
            .attr('id', code)
            .text(province.text)
          )
      );
    });

    /* 请求角色详情 */
    if (data) {
      QDP.generator.setValue(data);
      data.province = '210000,310000';
      if (data.province) {
        var ids = data.province.split(',');
        ids.forEach(function (id) {
          $('#' + id).addClass('selected');
        });
      }
    }
    QDP.form.render();

    /* 处理保存按钮事件 */
    $(".btn-save").on("click", function (e) {
      //TODO:数组类型AJAX提交处理
      var requestURL;
      var args = {
        "name": $("#rolename").val(),
        funcids: ""
      };
      if (args.rolename == "") {
        QDP.alert("角色名称不能为空!");
        return;
      }
      var powers = [];
      $("#role-container .checkall span[class='checked']>input").each(function () {
        var module = $(this);
        let power = {
          id: module.attr("id"),
          actions: []
        };

        $("span[class='checked']>input", $("[data-id='" + power.id + "']")).each(function () {
          power.actions.push($(this).attr("id"));
        });

        powers.push(power);
      });
      args.powers = powers;

      $("span[class='checked']>input", $("div[data-id]")).each(function () {
        args.funcids += $(this).attr("id") + ",";
      });
      if (args.funcids.length > 0) {
        args.funcids = args.funcids.substr(0, args.funcids.length - 1);
      } else {
        QDP.alert("请为该角色设置权限!");
        return;
      }
      if (data) {
        args.id = data.id;
        requestURL = QDP.api.role.update;
      } else {
        requestURL = QDP.api.role.add;
      }
      QDP.post(requestURL, args);
    });

  }

  return {
    "define": {
      "name": "合作方基本信息管理",
      "version": "1.0.0.0",
      "copyright": " Copyright 2017-2027 WangXin nvlbs,Inc."
    },
    /** 加载模块 */
    "init": function () {
      var options = {
        "apis": {
          "list": QDP.api.admin.datas,
          "insert": QDP.api.admin.add,
          "update": QDP.api.admin.update,
          "delete": QDP.api.admin.remove
        },
        "texts": { "insert": "新增合作方信息", "update": "合作方信息编辑" },
        "actions": { "insert": true, "update": true, "delete": true },
        "views": {
          "edit": {
            "page": "views/business/partner-edit.html",
            "callback": initEditor
          }
        },
        "columns": [
          { "name": "_index", "text": "序号" },
          { "name": "id", "primary": true },
          {
            "name": "name", "text": "合作方名称", "edit": true,
            "filter": true, "filterindex": 1
          },
          { "name": "partner_addr", "text": "合作方地址", "edit": true },
          {
            "name": "province", "text": "负责的省份", "multiple": true, "dict": "province", "edit": true,
            "filter": true, "filterindex": 2
          },
          {
            "name": "link_man", "text": "负责人", "edit": true,
            "filter": true, "filterindex": 3, "novalid": true
          },
          {
            "name": "partner_phone", "text": "联系电话", "edit": true,
            "filter": true, "filterindex": 4
          },
          { "name": "start_time", "text": "生效时间", "type": 'date', "edit": true },
          { "name": "end_time", "text": "有效时间", "type": 'date', "edit": true },
          { "name": "date", "text": "创建时间", "type": "datetime" },
          {
            "name": "begin_date", "text": "创建开始时间", "type": "date",
            "filter": true, "filterindex": 5, "display": false
          },
          {
            "name": "end_date", "text": "创建结束时间", "type": "date",
            "filter": true, "filterindex": 6, "display": false
          },
          {
            "name": "description", "text": "描述", "type": "mulittext",
            "edit": true, "novalid": true
          }
        ]
      };
      QDP.generator.build(options);
    },
    /** 卸载模块 */
    "destroy": function () {

    }
  };
});
