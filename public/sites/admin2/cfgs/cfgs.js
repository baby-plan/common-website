define('cfgs', ['jquery', 'moment'], function ($, moment) {
  var cfgs = {
    "app_name": "悦通慧享-教育平台后台管理系统",
    "debug": true,
    "output": {
      "debug": true,
      "info": true,
      "warn": true,
      "error": true
    },
    /* 是否使用已设定的初始页面,rootable:true 使用菜单第一项作为起始页面,否则使用root定义的内容为起始页面 */
    "rootable": true,
    /** API: */
    "cache": {},
    /** API: */
    "settings": {},
    /** API: */
    "dict": {},
    "options": {}
    /* 设定初始页面 */
    //, "root": ["会员管理", "会员明细"]
  };

  /** 各项内容模板设置 */
  cfgs.templates = {
    "cell": "<td class='center'/>"
  };
  /** 各项数据默认值设置 */
  cfgs.options.defaults = {
    "dateformat": "YYYY-MM-DD",
    "dateformat2": "yyyy-MM-dd",
    "datetimeformat": "yyyy-MM-dd HH:mm:ss"
  };
  /** 日期选择控件参数设置 */
  cfgs.options.datepicker = {
    format: "yyyy-mm-dd",
    autoclose: true,
    todayBtn: true,
    language: "zh-CN",
    startDate: "2010-01-01",
    minView: "month",
    pickerPosition: "bottom-left"
  }
  cfgs.options.datetimepicker = {
    format: "yyyy-mm-dd hh:ii:ss",
    autoclose: true,
    todayBtn: true,
    language: "zh-CN",
    startDate: "2010-01-01 00:00:00",
    pickerPosition: "bottom-left" //,
    //minuteStep: 6,
    // minView: 1
  }
  /** 文本相关参数设置 */
  cfgs.options.texts = {
    "btn_add": " <i class=\"fa fa-plus\"></i> 新增 ",
    "btn_edit": "<i class=\"fa fa-pencil\"></i> 编辑 ",
    "btn_search": "<i class=\"fa fa-search\"></i> 查询 ",
    "btn_reset": "<i class=\"fa fa-refresh\"></i> 重置 ",
    "btn_remove": " <i class=\"fa fa-trash-o\"></i> 删除 ",
    "btn_refresh": " <i class=\"fa fa-refresh\"></i> 刷新 ",
    "btn_back": "<i class=\"fa fa-arrow-circle-left\"></i> 返回 ",
    "btn_cancel": "<i class=\"fa fa-arrow-circle-left\"></i> 取消 ",
    "btn_save": " 保存 <i class=\"fa fa-arrow-circle-right\"></i> ",
    "btn_details": " <i class=\"fa fa-align-justify\"></i> 详情 ",
    "btn_priv": " <i class=\"fa fa-arrow-circle-left\"></i> 上一步 ",
    "btn_next": " 下一步 <i class=\"fa fa-arrow-circle-right\"></i> "
  };
  /** 样式相关参数设置 */
  cfgs.options.styles = {
    "btn_default": "btn btn-info",
    "btn_back": "btn btn-danger",
    "btn_save": "btn btn-success",
    "btn_reset": "btn btn-warning",
    "btn_next": "btn btn-success",
    "btn_priv": "btn btn-danger"
  };
  /** 请求相关参数设置 */
  cfgs.options.request = {
    /* 设置AJAX请求超时时间:单位毫秒*/
    "timeout": 5000
  };
  /** 时间段选项 */
  cfgs.options.daterange = {
    "opens": "left",
    "startDate": moment().subtract(29, "days"),
    "endDate": moment(),
    "minDate": "2012-01-01",
    "maxDate": moment(),
    "dateLimit": {
      days: 60
    },
    "showDropdowns": true,
    "showWeekNumbers": false,
    "timePicker": false,
    "timePickerIncrement": 1,
    "timePicker12Hour": false,
    "ranges": {
      "今天": [moment(), moment()],
      "昨天": [moment().subtract(1, "days"), moment().subtract(1, "days")],
      "最近1周": [moment().subtract(6, "days"), moment()],
      "最近30天": [moment().subtract(29, "days"), moment()],
      "本月": [moment().startOf("month"), moment().endOf("month")],
      "上月": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")]
    },
    "buttonClasses": ["btn"],
    "applyClass": "btn-info",
    "cancelClass": "btn-default",
    "format": 'YYYY-M-DD',
    "separator": " to ",
    "locale": {
      "applyLabel": "确定",
      "cancelLabel": "取消",
      "fromLabel": "起始日期",
      "toLabel": "结束日期",
      "customRangeLabel": "自定义时间段",
      "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
      "monthNames": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      "firstDay": 1
    }
  };

  var stateformat = function (state) {
    if (!state.id) {
      return state.text;
    }
    var $state = $(
      '<span><i class="fa fa-book" /></i> ' + state.text + '</span>'
    );
    return $state;
  }
  /** 下拉列表选项 */
  cfgs.options.select2 = {
    placeholder: "请在列表中选择...",
    "allowClear": true,
    "language": "zh-CN",
    "templateResult": stateformat,
    "templateSelection": stateformat
  };
  /** 滚动条选项 */
  cfgs.options.scroller = {
    "width": "auto", //可滚动区域宽度
    "size": '5px', //组件宽度
    "color": '#1d9d74', //滚动条颜色
    "position": 'right', //组件位置:left/right
    "distance": '1px', //组件与侧边之间的距离
    "opacity": 1, //滚动条透明度
    "alwaysVisible": false, //是否 始终显示组件
    "disableFadeOut": true, //是否 鼠标经过可滚动区域时显示组件，离开时隐藏组件
    "railVisible": true, //是否 显示轨道
    "railColor": '#dbdbdb', //轨道颜色
    "railOpacity": 1, //轨道透明度
    "railDraggable": true, //是否 滚动条可拖动
    "allowPageScroll": false, //是否 使用滚轮到达顶端/底端时，滚动窗口
    // "wheelStep": 20, //滚轮滚动量
    // "touchScrollStep": 200, //滚动量当用户使用手势
    "borderRadius": '4px', //滚动条圆角
    "railBorderRadius": '0px' //轨道圆角
  };
  /** 当前页面选项 */
  cfgs.pageOptions = {
    /**  */
    "menus": [],
    /**  */
    "items": [],
    /** 当前选中的菜单 */
    "currentmenu": null,
    /** 最后一次分页数据请求 */
    "requestOptions": {},
    /** 最后一次请求分页数据 */
    "buffer": {},
    /** 是否读取缓存数据 */
    "fromCache": false
  };
  /* 公共编辑页面地址*/
  cfgs.editpage = "views/common/edits.html";
  /* 公共列表页面地址*/
  cfgs.listpage = "views/common/searchs.html";
  /* 系统模块定义
  说明：
      1. parent   表示模块父级，若为000则视为根目录。
      2. name     表示模块名称，即菜单名称
      3. icon     表示模块图标，即菜单图标
      4. callback 表示回调函数，即菜单点击后执行的脚本内容。
          备注:
          1. $P 表示插件对象，调用init方法
              例如：$P.file = App.plugins.file.init();
          2. $D 表示构造数据字典对象
              例如：$D/activitytype = App.plugins.dict.Package('activitytype','活动类型')，其中活动类型为模块名称。
          3. $M 表示模块对象
              例如：$M.profile = App.modules.profile();
      5. url      表示模块路径，即菜单点击后打开的地址。

   */
  cfgs.modules = {
    "0100": {
      "parent": "000",
      "name": "监控中心",
      "icon": "fa fa-tachometer",
      "iconcolor": "red"
    },
    "0101": {
      "parent": "0100",
      "name": "服务器状态",
      "url": "views/common/serverstatus.html",
      "callback": "$M.server.status",
      "icon": "fa fa-file-text-o"
    },
    "0102": {
      "parent": "0100",
      "name": "高德地图",
      "url": "views/common/amap.html",
      "callback": "$M.map.initamap",
      "leave": "$M.map.deinitamap",
      "icon": "fa fa-send"
    },
    "0103": {
      "parent": "0100",
      "name": "服务端版本",
      "url": "views/common/version.server.html",
      "icon": "fa fa-server"
    },
    "0104": {
      "parent": "0100",
      "name": "客户端版本",
      "url": "views/common/version.client.html",
      "icon": "fa fa-server"
    },

    "0200": {
      "parent": "000",
      "name": "个人中心",
      "icon": "fa fa-user"
    },
    "0201": {
      "parent": "0200",
      "name": "我的资料",
      "url": "views/master/profile.html",
      "callback": "$M.profile",
      "icon": "fa fa-file-text-o"
    },
    "0202": {
      "parent": "0200",
      "name": "我的收藏",
      "url": "views/master/profile.html",
      "callback": "$M.profile",
      "icon": "fa fa-file-text-o"
    },
    "0202": {
      "parent": "0200",
      "name": "我的评论",
      "url": "views/master/profile.html",
      "callback": "$M.profile",
      "icon": "fa fa-file-text-o"
    },
    "0203": {
      "parent": "0200",
      "name": "我的关注",
      "url": "views/master/profile.html",
      "callback": "$M.profile",
      "icon": "fa fa-file-text-o"
    },
    "0204": {
      "parent": "0200",
      "name": "我的云盘",
      "url": "views/common/files.html",
      "callback": "$P.file",
      "icon": "fa fa-files-o"
    },
    "0205": {
      "parent": "0200",
      "name": "我的机构",
      "url": "views/common/orgalist.html",
      "callback": "App.modules.organization.list",
      "icon": "fa fa-futbol-o"
    },
    "0206": {
      "parent": "0200",
      "name": "我的活动",
      "url": "views/common/files.html",
      "callback": "$P.file",
      "icon": "fa fa-futbol-o"
    },
    "0207": {
      "parent": "0200",
      "name": "修改密码",
      "url": "views/master/changepwd.html",
      "icon": "fa fa-key"
    },

    "100": {
      "parent": "000",
      "name": "系统维护",
      "icon": "fa fa-cogs"
    },
    "101": {
      "parent": "100",
      "name": "角色管理",
      "callback": "App.plugins.role.init",
      "icon": "fa fa-users"
    },
    "102": {
      "parent": "100",
      "name": "用户管理",
      "callback": "App.plugins.admin.init",
      "icon": "fa fa-users"
    },
    "103": {
      "parent": "100",
      "name": "日志查询",
      "callback": "App.plugins.syslog.init",
      "icon": "fa fa-search"
    },
    "104": {
      "parent": "100",
      "name": "参数设置",
      "url": "views/common/option.html",
      "callback": "$P.options.system",
      "icon": "fa fa-cog"
    },

    "300": {
      "parent": "000",
      "name": "数据字典管理",
      "icon": "fa fa-book"
    },
    "301": {
      "parent": "300",
      "name": "活动类型",
      "callback": "$D/activitytype"
    },
    "302": {
      "parent": "300",
      "name": "人员性别",
      "callback": "$D/sex"
    },
    "303": {
      "parent": "300",
      "name": "机构类型",
      "callback": "$D/orgatype"
    },
    "304": {
      "parent": "300",
      "name": "学校类型",
      "callback": "$D/schooltype"
    },
    "305": {
      "parent": "300",
      "name": "文件类型",
      "callback": "$D/filetype"
    },

    "400": {
      "parent": "000",
      "name": "机构管理",
      "icon": "fa fa-cubes"
    },
    "401": {
      "parent": "400",
      "name": "机构明细",
      "callback": "$M.organization.init",
      "icon": "fa fa-file-text-o"
    },
    "402": {
      "parent": "400",
      "name": "机构浏览",
      "url": "views/common/orgalist.html",
      "callback": "$M.organization.list",
      "icon": "fa fa-file-text-o"
    },

    "500": {
      "parent": "000",
      "name": "学校管理",
      "icon": "fa fa-graduation-cap"
    },
    "501": {
      "parent": "500",
      "name": "学校明细",
      "callback": "$M.school.init",
      "icon": "fa fa-file-text-o"
    },

    "600": {
      "parent": "000",
      "name": "活动管理",
      "icon": "fa fa-futbol-o"
    },
    "601": {
      "parent": "600",
      "name": "发布活动",
      "url": "views/activity/publish.step.1.html",
      "callback": "App.plugins.activity.publish",
      "icon": "fa fa-flag"
    },
    "602": {
      "parent": "600",
      "name": "活动明细",
      "callback": "$P.activity",
      "icon": "fa fa-futbol-o"
    },

    "900": {
      "parent": "000",
      "name": "统计分析",
      "icon": "fa fa-bar-chart-o"
    },
    "901": {
      "parent": "900",
      "name": "活动分类统计",
      "callback": "$P.activity",
      "icon": "fa fa-area-chart"
    },
    "902": {
      "parent": "900",
      "name": "活动报名统计",
      "callback": "$P.activity",
      "icon": "fa fa-bar-chart"
    },
    "903": {
      "parent": "900",
      "name": "活动费用统计",
      "callback": "$P.activity",
      "icon": "fa fa-line-chart"
    },
    "904": {
      "parent": "900",
      "name": "会员统计",
      "callback": "$P.activity",
      "icon": "fa fa-pie-chart"
    },

    "d00": {
      "parent": "000",
      "name": "公共示例",
      "icon": "fa fa-object-ungroup"
    },
    "d01": {
      "parent": "d00",
      "name": "图标字体 | WebFont",
      "url": "views/sample/icons.html"
    },
    "d02": {
      "parent": "d00",
      "name": "代码框 | code",
      "url": "views/sample/code.html"
    },
    "d03": {
      "parent": "d00",
      "name": "时间轴 | timeline",
      "url": "views/sample/timeline.html"
    },
    "d04": {
      "parent": "d00",
      "name": "即时通讯 | WebSocket",
      "url": "views/sample/websocket.html"
    },
    "d05": {
      "parent": "d00",
      "name": "CSS动画",
      "url": "views/sample/animation.html"
    },
    "d06": {
      "parent": "d00",
      "name": "统计图表 | ECHARTS",
      "url": "views/sample/charts.html"
    },
    "d07": {
      "parent": "d00",
      "name": "加载动画 | Loading",
      "url": "views/sample/loading.html"
    }
  };

  return cfgs;
});