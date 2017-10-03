/* ========================================================================
 * App.plugins.activity v1.0
 * 601.activity 活动相关
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {

  /** 发布活动所需要经历的步骤 */
  var steps = [
    /** 步骤1，用于录入基本信息 */
    {
      "text": "(第一步)",
      "url": "views/activity/publish.step.1.html",
      "callback": function () {
        App.form.init();
        $(".btn_next").on("click", onclick_next); // 处理下一步按钮事件
      }
    },
    /** 步骤2，用于录入地址信息 */
    {
      "text": "(第二步)",
      "url": "views/activity/publish.step.2.html",
      "callback": function () {
        App.form.init();
        $(".btn_priv").on("click", onclick_priv); // 处理上一步按钮事件
        $(".btn_next").on("click", onclick_next); // 处理下一步按钮事件
      }
    },
    /** 步骤3，用于录入地址信息 */
    {
      "text": "(第三步)",
      "url": "views/activity/publish.step.3.html",
      "callback": function () {
        App.form.init();
        $(".btn_priv").on("click", onclick_priv); // 处理上一步按钮事件
        $(".btn_next").on("click", onclick_next); // 处理下一步按钮事件
      }
    },
    /** 步骤4，用于录入地址信息 */
    {
      "text": "(第四步)",
      "url": "views/activity/publish.step.4.html",
      "callback": function () {
        App.form.init();
        $(".btn_priv").on("click", onclick_priv); // 处理上一步按钮事件
        $(".btn_finish").on("click", onclick_finish); // 处理完成按钮事件
      }
    },
  ];

  /** 当前步骤 */
  var current_step = 0;

  /** 当前待发布的活动 */
  var data = {};

  /** 下一步按钮点击事件处理函数 */
  var onclick_next = function () {
    if (current_step < steps.length - 1) {
      current_step = current_step + 1;
    }
    var step = steps[current_step];
    App.form.openview({
      "url": step.url,
      "title": step.text,
      "callback": step.callback,
      "map": false
    });
  };

  /** 上一步按钮点击事件处理函数 */
  var onclick_priv = function () {
    if (current_step > 0) {
      current_step = current_step - 1;
    }
    var step = steps[current_step];
    App.form.openview({
      "url": step.url,
      "title": step.text,
      "callback": step.callback,
      "map": false
    });
  };

  var onclick_finish = function () {
    App.alertText("完成");
  };

  app.plugins.activity = {
    /** 初始化活动清单功能 */
    "init": function () {
      var options = {
        "apis": {
          "list": API.activity.datas,
          "insert": API.activity.add,
          "update": API.activity.update,
          "delete": API.activity.remove
        },
        "texts": {
          "insert": "新增活动信息",
          "update": "活动信息编辑"
        },
        "headers": {
          "edit": {
            "text": "活动信息"
          },
          "table": {
            "text": "活动信息列表"
          }
        },
        "actions": {
          "insert": true,
          "update": true,
          "delete": true
        },
        "columns": [{
            "name": "_index",
            "text": "序号"
          },
          {
            "name": "id",
            "primary": true
          },
          {
            "name": "name",
            "text": "活动名称",
            "base64": true,
            "edit": true,
            "filter": true,
            "overflow": 10
          },
          {
            "name": "type",
            "text": "活动类型",
            "dict": "activitytype",
            "edit": true,
            "filter": true
          },
          {
            "name": "describe",
            "text": "活动描述",
            "type": "mulittext",
            "rows": 5,
            "base64": true,
            "edit": true,
            "overflow": 10
          },
          {
            "name": "price",
            "text": "单价",
            "edit": true,
            "filter": true
          },
          {
            "name": "begintime",
            "text": "起始时间",
            "type": "datetime",
            "edit": true,
            "filter": "daterange"
          },
          {
            "name": "endtime",
            "text": "结束时间",
            "type": "datetime",
            "edit": true,
            "filter": "daterange"
          },
          {
            "name": "person",
            "text": "成人限额",
            "edit": true
          },
          {
            "name": "children",
            "text": "孩子限额",
            "edit": true
          },
          {
            "name": "_action",
            "text": "操作"
          }
        ]
      };
      App.plugins.common.init(options);
    },
    /** 初始化发布活动界面 */
    "publish": function () {
      steps[0].callback();
    }
  }
})(App);