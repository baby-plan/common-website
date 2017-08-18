define(['jquery', 'moment'], function ($, moment) {
  var cfgs = {
    "app_name": "车友助理-商户管理平台",
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
  cfgs.dict.state = {
    '0': '禁用',
    '1': '启用',
    '2': '删除'
  };
  cfgs.dict.checkstate = {
    '0': '未审核',
    '1': '已审核'
  };

  cfgs.dict.publishstate = {
    '0': '待发布',
    '1': '已发布'
  };

  cfgs.dict.codestate = {
    '0': '待使用',
    '1': '已使用',
    '2': '已过期'
  };

  cfgs.dict.codetype = {
    '1': '免费券',
    '2': '折扣券'
  };

  cfgs.dict.codetype2 = {
    '1': '基本套餐券',
    '2': '活动套餐券',
    '3': '一次性券'
  };

  cfgs.dict.channeltype = {
    '1': '和地图',
    '2': 'H5'
  };

  cfgs.dict.servicestate = {
    '0': '禁用',
    '1': '启用'
  };

  cfgs.dict.cartype = {
    '1': '小轿车',
    '2': 'SUV/商务车'
  };

  cfgs.dict.servicetype = {
    '1': '普洗',
    '2': '精洗'
  };

  cfgs.dict.servicename = {
    '1': '小轿车普洗',
    '2': 'SUV普洗',
    '3': '商务车普洗',
    '4': '小轿车精洗',
    '5': 'SUV精洗',
    '6': '商务车精洗'
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
    "btn_next": " 下一步 <i class=\"fa fa-arrow-circle-right\"></i> ",
    "btn_export": "<i class=\"fa fa-share-square-o\"></i> 导出 ",

    "btn_check": "<i class=\"fa fa-share-square-o\"></i> 审核 ",
    "btn_publish": "<i class=\"fa fa-share-square-o\"></i> 发布 ",
    "btn_unpublish": "<i class=\"fa fa-share-square-o\"></i> 取消发布 ",
    "btn_look": "<i class=\"fa fa-share-square-o\"></i> 查看 ",
    "btn_chgpwd": "<i class=\"fa fa-share-square-o\"></i> 重置密码 ",
  };

  /** 样式相关参数设置 */
  cfgs.options.styles = {
    "btn_default": "btn btn-info",
    "btn_back": "btn btn-danger",
    "btn_save": "btn btn-success",
    "btn_reset": "btn btn-warning",
    "btn_next": "btn btn-success",
    "btn_priv": "btn btn-danger",
    'btn_edit': 'btn btn-success',
    'btn_remove': 'btn btn-danger',
    "btn_check": "btn btn-info",
    "btn_publish": "btn btn-info",
    "btn_unpublish": "btn btn-info",
    "btn_look": "btn btn-info",
    "btn_chgpwd": "btn btn-info"
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
    } else if (state.id.startWith("fa") || state.id.startWith("icon")) {
      return $('<span><i class="' + state.id + '" /></i> ' + state.text + '</span>');
    } else {
      return $('<span><i class="fa fa-book" /></i> ' + state.text + '</span>');
    }
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
    "color": '#195fff', //滚动条颜色
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
      5. url      表示模块路径，即菜单点击后打开的地址。
   */
  cfgs.modules = {
    "0100": { "parent": "000", "name": "监控中心", "icon": "fa fa-tachometer", "iconcolor": "red" },
    "0101": { "parent": "0100", "name": "服务器状态", 'module': 'module-server', 'method': 'status', "url": "views/common/serverstatus.html", "icon": "fa fa-file-text-o" },
    "0103": { "parent": "0100", "name": "服务端版本", "url": "views/common/version.server.html", "icon": "fa fa-server" },
    "0104": { "parent": "0100", "name": "客户端版本", "url": "views/common/version.client.html", "icon": "fa fa-server" },

    "0200": { "parent": "000", "name": "查询统计", "icon": "fa fa-bar-chart-o" },
    "0201": { "parent": "0200", "name": "用户全历史查询", "module": "module-order", "method": "initUserSearch", "icon": "fa fa-search" },
    "0202": { "parent": "0200", "name": "领券情况查询", "callback": "$P.activity", "icon": "fa fa-bar-chart" },
    "0203": { "parent": "0200", "name": "活跃用户统计月表", "callback": "$P.activity", "icon": "fa fa-line-chart" },
    "0204": { "parent": "0200", "name": "活跃商户统计月表", "callback": "$P.activity", "icon": "fa fa-pie-chart" },
    "0205": { "parent": "0200", "name": "商户上线成功率统计", "callback": "$P.activity", "icon": "fa fa-pie-chart" },
    "0206": { "parent": "0200", "name": "商户签约数量统计", "callback": "$P.activity", "icon": "fa fa-pie-chart" },

    "0300": { "parent": "000", "name": "订单管理", "icon": "fa fa-file-text-o" },
    "0301": { "parent": "0300", "name": "订单信息查询", "module": "module-order", 'method': 'init', "icon": "fa fa-search" },
    "0302": { "parent": "0300", "name": "结算订单查询", "module": "module-order", "method": "initSettlementSearch", "icon": "fa fa-search" },

    "0400": { "parent": "000", "name": "商户管理", "icon": "fa fa-cubes" },
    "0401": { "parent": "0400", "name": "商户基本信息管理", "module": "module-tenant", "method": "initInfo", "icon": "fa fa-file-text-o" },
    "0402": { "parent": "0400", "name": "商户服务项目管理", "module": "module-tenant", "method": "initProject", "icon": "fa fa-file-text-o" },
    "0403": { "parent": "0400", "name": "商户全历史查询", "module": "module-tenant", "method": "initHistorySearch", "icon": "fa fa-search" },

    "0500": { "parent": "000", "name": "合作方管理", "icon": "fa fa-handshake-o" },
    "0501": { "parent": "0500", "name": "合作方信息管理", "callback": "$P.options.system" },

    "100": { "parent": "000", "name": "系统维护", "icon": "fa fa-cogs" },
    "102": { "parent": "100", "name": "账户管理", "module": "module-common", "method": "init-admin", 'leave': 'uninit-admin', "icon": "fa fa-users" },
    "101": { "parent": "100", "name": "角色管理", "module": "module-common", "method": "init-role", "icon": "fa fa-users" },
    "103": { "parent": "100", "name": "日志查询", "module": "module-common", "method": "init-log-search", "icon": "fa fa-search" },
    "104": { "parent": "100", "name": "参数设置", "url": "views/common/option.html", "module": "module-common", "method": "init-options", "icon": "fa fa-cog" },
    "105": { "parent": "100", "name": "菜单功能管理", "module": "module-common", "method": "init-method", "icon": "fa fa-cog" },
    "106": { "parent": "100", "name": "菜单管理", "module": "module-common", "method": "init-module", "icon": "fa fa-cog" },

    "200": { "parent": "000", "name": "个人中心", "icon": "fa fa-user" },
    "201": { "parent": "200", "name": "我的资料", "url": "views/master/profile.html", "module": "module-common", "method": "init-profile", "icon": "fa fa-file-text-o" },
    "202": { "parent": "200", "name": "我的收藏", "url": "views/master/profile.html", "module": "module-common", "method": "init-profile", "icon": "fa fa-file-text-o" },
    "202": { "parent": "200", "name": "我的评论", "url": "views/master/profile.html", "module": "module-common", "method": "init-profile", "icon": "fa fa-file-text-o" },
    "203": { "parent": "200", "name": "我的关注", "url": "views/master/profile.html", "module": "module-common", "method": "init-profile", "icon": "fa fa-file-text-o" },
    "204": { "parent": "200", "name": "我的云盘", "url": "views/common/files.html", "module": "module-common", "method": "init-file", "icon": "fa fa-files-o" },
    "205": { "parent": "200", "name": "我的机构", "url": "views/common/orgalist.html", "module": "module-common", "method": "init-profile", "icon": "fa fa-futbol-o" },
    "206": { "parent": "200", "name": "我的活动", "url": "views/common/files.html", "module": "module-common", "method": "init-file", "icon": "fa fa-futbol-o" },
    "207": { "parent": "200", "name": "修改密码", "url": "views/master/changepwd.html", "module": "module-common", "method": "change-password", "icon": "fa fa-key" },

    "300": { "parent": "000", "name": "数据字典管理", "icon": "fa fa-book" },
    "301": { "parent": "300", "name": "行政区划管理", "module": "module-dict", "method": "package", "args": "xzqh" },
    "302": { "parent": "300", "name": "号段表管理", "module": "module-dict", "method": "init-coderange" },
    "303": { "parent": "300", "name": "活动类型", "module": "module-dict", "method": "package", "args": "activitytype" },
    "304": { "parent": "300", "name": "人员性别", "module": "module-dict", "method": "package", "args": "sex" },
    "305": { "parent": "300", "name": "机构类型", "module": "module-dict", "method": "package", "args": "orgatype" },
    "306": { "parent": "300", "name": "学校类型", "module": "module-dict", "method": "package", "args": "schooltype" },
    "307": { "parent": "300", "name": "文件类型", "module": "module-dict", "method": "package", "args": "filetype" },

    "d00": { "parent": "000", "name": "公共示例", "icon": "fa fa-object-ungroup" },
    "d01": { "parent": "d00", "name": "图标字体 | WebFont", "url": "views/sample/icons.html" },
    "d06": { "parent": "d00", "name": "统计图表 | ECHARTS", "url": "views/sample/charts.html" },
  };

  cfgs.icons = [
    'fa fa-address-book'
    , 'fa fa-address-book-o'
    , 'fa fa-tachometer'
    , 'fa fa-drivers-license'
    , 'fa.fa-bars'
    , 'fa.fa-television'
    , 'fa.fa-angle-down'
    , 'fa.fa-key'
    , 'fa.fa-key'
    , 'fa.fa-power-off'
    , 'fa.fa-address-book'
    , 'fa.fa-address-book-o'
    , 'fa.fa-address-card'
    , 'fa.fa-address-card-o'
    , 'fa.fa-bandcamp'
    , 'fa.fa-bath'
    , 'fa.fa-bathtub'
    , 'fa.fa-drivers-license'
    , 'fa.fa-drivers-license-o'
    , 'fa.fa-eercast'
    , 'fa.fa-envelope-open'
    , 'fa.fa-envelope-open-o'
    , 'fa.fa-etsy'
    , 'fa.fa-free-code-camp'
    , 'fa.fa-grav'
    , 'fa.fa-handshake-o'
    , 'fa.fa-id-badge'
    , 'fa.fa-id-card'
    , 'fa.fa-id-card-o'
    , 'fa.fa-imdb'
    , 'fa.fa-linode'
    , 'fa.fa-meetup'
    , 'fa.fa-microchip'
    , 'fa.fa-podcast'
    , 'fa.fa-quora'
    , 'fa.fa-ravelry'
    , 'fa.fa-s15'
    , 'fa.fa-shower'
    , 'fa.fa-snowflake-o'
    , 'fa.fa-superpowers'
    , 'fa.fa-telegram'
    , 'fa.fa-thermometer'
    , 'fa.fa-thermometer-0'
    , 'fa.fa-thermometer-1'
    , 'fa.fa-thermometer-2'
    , 'fa.fa-thermometer-3'
    , 'fa.fa-thermometer-4'
    , 'fa.fa-thermometer-empty'
    , 'fa.fa-thermometer-full'
    , 'fa.fa-thermometer-half'
    , 'fa.fa-thermometer-quarter'
    , 'fa.fa-thermometer-three-quarters'
    , 'fa.fa-times-rectangle'
    , 'fa.fa-times-rectangle-o'
    , 'fa.fa-user-circle'
    , 'fa.fa-user-circle-o'
    , 'fa.fa-user-o'
    , 'fa.fa-vcard'
    , 'fa.fa-vcard-o'
    , 'fa.fa-window-close'
    , 'fa.fa-window-close-o'
    , 'fa.fa-window-maximize'
    , 'fa.fa-window-minimize'
    , 'fa.fa-window-restore'
    , 'fa.fa-wpexplorer'
    , 'fa.fa-address-book'
    , 'fa.fa-address-book-o'
    , 'fa.fa-address-card'
    , 'fa.fa-address-card-o'
    , 'fa.fa-adjust'
    , 'fa.fa-american-sign-language-interpreting'
    , 'fa.fa-anchor'
    , 'fa.fa-archive'
    , 'fa.fa-area-chart'
    , 'fa.fa-arrows'
    , 'fa.fa-arrows-h'
    , 'fa.fa-arrows-v'
    , 'fa.fa-asl-interpreting'
    , 'fa.fa-assistive-listening-systems'
    , 'fa.fa-asterisk'
    , 'fa.fa-at'
    , 'fa.fa-audio-description'
    , 'fa.fa-automobile'
    , 'fa.fa-balance-scale'
    , 'fa.fa-ban'
    , 'fa.fa-bank'
    , 'fa.fa-bar-chart'
    , 'fa.fa-bar-chart-o'
    , 'fa.fa-barcode'
    , 'fa.fa-bars'
    , 'fa.fa-bath'
    , 'fa.fa-bathtub'
    , 'fa.fa-battery'
    , 'fa.fa-battery-0'
    , 'fa.fa-battery-1'
    , 'fa.fa-battery-2'
    , 'fa.fa-battery-3'
    , 'fa.fa-battery-4'
    , 'fa.fa-battery-empty'
    , 'fa.fa-battery-full'
    , 'fa.fa-battery-half'
    , 'fa.fa-battery-quarter'
    , 'fa.fa-battery-three-quarters'
    , 'fa.fa-bed'
  ];

  return cfgs;
});