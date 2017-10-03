// var server = "http://192.168.3.97:8080/api/";
var img_server = undefined; //"http://localhost:3000/";

if (!img_server) {
  img_server = "http://" + window.location.host + "/";
}
// const img_server = "http://192.168.1.104:3000/";
const server = img_server + "api/";

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
  "btn_next": " 下一步 <i class=\"fa fa-arrow-circle-right\"></i> ",
  "btn_finish": " 完成 <i class=\"fa fa-arrow-circle-right\"></i> "
};
/** 样式相关参数设置 */
cfgs.options.styles = {
  "btn_default": "btn btn-info",
  "btn_back": "btn btn-danger",
  "btn_save": "btn btn-success",
  "btn_reset": "btn btn-warning",
  "btn_next": "btn btn-success",
  "btn_priv": "btn btn-danger",
  "btn_finish": "btn btn-success"
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
var pageOptions = {
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