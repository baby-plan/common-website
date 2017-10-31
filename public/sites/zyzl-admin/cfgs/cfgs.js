define(["jquery"], function ($) {
  var cfgs = {
    "site": {
      title: "中国移动通讯 - 车友助理 - 商户管理平台",
      keywords: "商户管理平台,大数据统计中心",
      description: "商户管理平台",
    },
    debug: true,
    output: {
      debug: true,
      info: true,
      warn: true,
      error: true
    },
    /* 是否使用已设定的初始页面,rootable:true 使用菜单第一项作为起始页面,否则使用root定义的内容为起始页面 */
    rootable: true,
    root: ["商户基本信息管理"],
    /** API: */
    cache: {},
    /** API: */
    settings: {},
    /** API: */
    dict: {},
    options: {}
    /* 设定初始页面 */
    //, "root": ["会员管理", "会员明细"]
  };

  /** 公共编辑页面地址 */
  cfgs.editpage = "views/common/edits.html";
  /** 公共列表页面地址 */
  cfgs.listpage = "views/common/searchs.html";
  /** 公共列表页面地址 */
  cfgs.chartpage = "views/common/chart.html";
  /** 公共详情页面地址 */
  cfgs.detailpage = "views/common/preview.html";
  /** 模式对话框页面地址 */
  cfgs.modalpage = "views/common/dialog.html";
  /** 导航栏页面地址 */
  cfgs.navpage = "views/master/navigation.html";
  /** PAGE:登录页面*/
  cfgs.loginpage = "views/master/login.html";
  /** PAGE:系统主页面*/
  cfgs.mainpage = "views/master/main.html";

  /** 当前页面选项 */
  cfgs.pageOptions = {
    /**  */
    menus: [],
    /**  */
    items: [],
    /** 当前选中的菜单 */
    currentmenu: null,
    /** 最后一次分页数据请求 */
    requestOptions: {},
    /** 最后一次请求分页数据 */
    buffer: {},
    /** 是否读取缓存数据 */
    fromCache: false
  };

  /** 各项内容模板设置 */
  cfgs.templates = {
    "cell": "<td class='center'/>",
  };

  /** 各项数据默认值设置 */

  cfgs.options.defaults = {
    dateformat: "YYYY-MM-DD",
    dateformat2: "yyyy-MM-dd",
    datetimeformat: "yyyy-MM-dd HH:mm:ss"
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
  };

  cfgs.options.datetimepicker = {
    format: "yyyy-mm-dd hh:ii:ss",
    autoclose: true,
    todayBtn: true,
    language: "zh-CN",
    startDate: "2010-01-01 00:00:00",
    pickerPosition: "bottom-left" //,
    //minuteStep: 6,
    // minView: 1
  };

  /** 文本相关参数设置 */
  cfgs.options.texts = {
    'btn-add': '<i class="fa fa-plus"></i> 新增',
    'btn-insert': '<i class="fa fa-plus"></i> 新增',
    'btn-edit': '<i class="fa fa-pencil"></i> 编辑',
    'btn-update': '<i class="fa fa-pencil"></i> 编辑',
    'btn-search': '<i class="fa fa-search"></i> 查询',
    'btn-reset': '<i class="fa fa-spinner"></i> 重置',
    'btn-remove': '<i class="fa fa-trash-o"></i> 删除',
    'btn-delete': '<i class="fa fa-trash-o"></i> 删除',
    'btn-refresh': '<i class="fa fa-refresh"></i> 刷新',
    'btn-back': '<i class="fa fa-arrow-circle-left"></i> 返回',
    'btn-cancel': '<i class="fa fa-arrow-circle-left"></i> 取消',
    'btn-save': '保存 <i class="fa fa-arrow-circle-right"></i>',
    'btn-details': '<i class="fa fa-align-justify"></i> 详情',
    'btn-priv': '<i class="fa fa-arrow-circle-left"></i> 上一步',
    'btn-next': '下一步 <i class="fa fa-arrow-circle-right"></i>',
    'btn-export': '<i class="fa fa-share-square-o"></i> 导出',

    'btn-close': '<i class="fa fa-check-circle-o"></i> 关闭',
    'btn-audit': '<i class="fa fa-check-circle-o"></i> 审核',
    'btn-submit': '<i class="fa fa-check-circle-o"></i> 提交审核',
    'btn-approval': '<i class="fa fa-check-circle-o"></i> 通过审核',
    'btn-reject': '<i class="fa fa-check-circle"></i> 驳回审核',
    'btn-check': '<i class="fa fa-check-circle-o"></i> 审核',
    'btn-publish': '<i class="fa fa-external-link"></i> 发布',
    'btn-unpublish': '<i class="fa fa-external-link-square"></i> 取消发布',
    'btn-preview': '<i class="fa fa-eye"></i> 查看',
    'btn-chgpwd': '<i class="fa fa-key"></i> 重置密码',
    'btn-selectall': '<i class="fa fa-check-square-o"></i> 全选',
    'btn-selectopp': '<i class="fa fa-check-square"></i> 反选'
  };

  /** 样式相关参数设置 */
  cfgs.options.styles = {
    'btn-default': "",
    // 'btn-back': "btn btn-danger",
    // 'btn-save': "btn btn-success",
  };

  /** 请求相关参数设置 */
  cfgs.options.request = {
    /* 设置AJAX请求超时时间:单位毫秒*/
    timeout: 5000
  };

  /**
   * 
   * @param {JSON} state 
   */
  var stateformat = function (state) {
    if (!state.id) {
      return state.text;
    } else if (state.id.startWith("fa") || state.id.startWith("icon")) {
      return $(
        '<span><i class="' + state.id + '" /></i> ' + state.text + "</span>"
      );
    } else {
      return $('<span><i class="fa fa-book" /></i> ' + state.text + "</span>");
    }
  };

  /** 下拉列表选项 */
  cfgs.options.select2 = {
    placeholder: "请在列表中选择...",
    allowClear: true,
    language: "zh-CN",
    templateResult: stateformat,
    templateSelection: stateformat
  };

  /** 滚动条选项 */
  cfgs.options.scroller = {
    // width: "auto", //可滚动区域宽度
    size: "6px", //组件宽度
    color: "#0786d6", //滚动条颜色
    position: "right", //组件位置:left/right
    distance: "1px", //组件与侧边之间的距离
    opacity: 1, //滚动条透明度
    alwaysVisible: true, //是否 始终显示组件
    disableFadeOut: false, //是否 鼠标经过可滚动区域时显示组件，离开时隐藏组件
    railVisible: false, //是否 显示轨道
    railColor: "#fff", //轨道颜色
    railOpacity: 1, //轨道透明度
    railDraggable: true, //是否 滚动条可拖动
    allowPageScroll: false, //是否 使用滚轮到达顶端/底端时，滚动窗口
    // "wheelStep": 20, //滚轮滚动量
    // "touchScrollStep": 200, //滚动量当用户使用手势
    borderRadius: "0", //滚动条圆角
    railBorderRadius: "0px" //轨道圆角
  };

  /** 当前页面选项 */
  cfgs.pageOptions = {
    /**  */
    menus: [],
    /**  */
    items: [],
    /** 当前选中的菜单 */
    currentmenu: null,
    /** 最后一次分页数据请求 */
    requestOptions: {},
    /** 最后一次请求分页数据 */
    buffer: {},
    /** 是否读取缓存数据 */
    fromCache: false
  };

  cfgs.tooltip = {
    compute: [
      "店铺门市价：指的是商户对非会员、非优惠期间执行的普通用户洗车价格。"
      , "折扣券签约价：指的是车友助理业务支撑方与签约商户确定的对折扣券补贴前的洗车费用。"
      , "免费券结算价：指的是用户使用免费券到商户洗车后，由车友主助理业务支撑方支付给商户的洗车费用。"
      , "应结算金额计算方法："
      , "折扣券应结算金额 = 折扣券签约价 - 用户实际支付"
      , "免费券应结算金额 = 免费券结算价 - 用户实际支付"
      , "举例说明：A省支撑方承诺的洗车折扣率为5折，门市价为30元，折扣券签约价为20元，免费券结算价为25元。用户使用免费券去洗车无需支付洗车费用，但支撑方需向商户支付免费洗车费用为25元；用户使用折扣券洗车，由用户支付洗车费用为15元，但是支撑方给商户的折扣券补贴费用为20-15=5元。"
    ]
  }

  return cfgs;
});
