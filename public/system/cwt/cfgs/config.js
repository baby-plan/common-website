var cfgs = {
  "app_name": "车务通"
  , "logo": ""
  , "domain": "/cwt/"
  , "loginPage": "login.html"
  , "mainPage": "index.html"
  , "debug": false
  , "output": { "debug": false, "info": true, "warn": true, "error": true }
  /* 系统模块定义 */
  , "parts": {
    /*车辆列表*/
    "tree": { "parent": "#treeContainer", "url": "views/parts/tree.html" },
    /*通知栏*/
    "notify": { "parent": ".nav-bar-plugins", "url": "views/parts/inbox.html", "complated": "App.notify.init()" },
    "setting-menu": { "parent": "#setting-menu", "url": "views/parts/settings.html", "complated": "App.theme.init()" }
  }
  , "modules": {
    "1": { "parent": "-", "name": "基本功能" }
    // , "100": { "parent": "000", "icon": "icon-speedometer", "name": "监控中心" }
    // , "102": { "theme": "bg-green", "name": "多窗口监控", "url": "#", "complated": "" }
    , "300": { "parent": "000", "icon": "icon-bar-chart", "name": "统计中心" }
    , "301": { "theme": "#ECA877", "iconImage": "定位统计.png", "name": "定位统计", "url": "views/common-statistic.html", "complated": "App.plugins.statistics.location" }
    , "302": { "theme": "#F1AC08", "iconImage": "里程统计.png", "name": "里程统计", "url": "views/common-statistic.html", "complated": "App.plugins.statistics.mileage" }
    , "303": { "theme": "#8455DB", "iconImage": "油耗统计.png", "name": "油耗统计", "url": "views/common-statistic.html", "complated": "App.plugins.statistics.fuelquery" }
    , "304": { "theme": "#7FC822", "iconImage": "告警统计.png", "name": "告警统计", "url": "views/statistics/report-statistic.html", "complated": "App.plugins.statistics.alarm" }
    , "305": { "theme": "#ECA877", "iconImage": "离线统计.png", "name": "离线统计", "url": "views/common-statistic.html", "complated": "App.plugins.statistics.offline" }
    , "306": { "theme": "#38B2F1", "iconImage": "告警查询.png", "name": "告警查询", "url": "views/statistics/report-statistic.html", "complated": "App.plugins.searchs.alarm" }
    , "307": { "theme": "#7FC822", "iconImage": "停车统计.png", "name": "停车查询", "url": "views/common-statistic.html", "complated": "App.plugins.statistics.park" }
    , "308": { "theme": "#F2B588", "iconImage": "终端查询.png", "name": "终端查询", "url": "views/statistics/terminal-search.html", "complated": "App.plugins.statistics.terminalquery" }
    , "309": { "theme": "#DD64B1", "iconImage": "轨迹查询.png", "name": "轨迹查询", "url": "views/common-statistic.html", "complated": "App.plugins.statistics.trajectoryquery" }
    , "310": { "theme": "#139B79", "iconImage": "指令查询.png", "name": "指令查询", "url": "views/searchs/command-search.html", "complated": "App.plugins.searchs.command" }
    , "311": { "theme": "#3A3FB2", "iconImage": "日志查询.png", "name": "日志查询", "url": "views/statistics/log-search.html", "complated": "App.plugins.statistics.logquery", "icon": "fa fa-bar-chart-o" }

    , "400": { "parent": "000", "icon": "icon-settings", "name": "设置中心" }
    , "401": { "theme": "#F2B588", "iconImage": "定位设置.png", "name": "定位设置", "url": "views/setup/location.html", "complated": "setuplocation" }
    , "402": { "theme": "#F7DB53", "iconImage": "电子围栏.png", "name": "电子围栏", "url": "views/setup/electric-fence.html", "complated": "App.plugins.setup.electricFence" }
    , "403": { "theme": "#7FC822", "iconImage": "偏航告警.png", "name": "偏航告警", "url": "#", "complated": "" }
    , "404": { "theme": "#3D43A9", "iconImage": "超速告警.png", "name": "超速告警", "url": "#", "complated": "" }
    , "405": { "theme": "#018FE9", "iconImage": "兴趣图形.png", "name": "兴趣图形", "url": "views/setup/graphical.html", "complated": "" }
    , "406": { "theme": "#F2B588", "iconImage": "告警设置.png", "name": "离线告警", "url": "#", "complated": "" }
    , "407": { "theme": "#018FE9", "iconImage": "分组管理.png", "name": "分组管理", "url": "views/manager/group-list.html", "complated": "App.plugins.manager.groupmanager" }
    , "408": { "theme": "#DD123D", "iconImage": "角色管理.png", "name": "角色管理", "complated": "App.plugins.manager.rolemanager" }
    , "409": { "theme": "#DD123D", "iconImage": "操作员管理.png", "name": "操作员管理", "complated": "App.plugins.manager.operatormanager" }
    , "411": { "theme": "#F1AC08", "iconImage": "车辆管理.png", "name": "车辆管理", "complated": "App.plugins.manager.carmanager" }
    , "412": { "theme": "#3A3FB2", "iconImage": "人员管理.png", "name": "人员管理", "url": "#", "complated": "" }
    , "413": { "theme": "#7FC822", "iconImage": "驾驶员管理.png", "name": "驾驶员管理", "url": "#", "complated": "" }
    , "800": { "parent": "000", "icon": "fa fa-cab", "name": "调度中心" }
    , "801": { "theme": '#F19B13', "iconImage": "新-用车申请.png", "name": "用车申请", "url": "views/dispatch/01.request.html", "complated": "App.plugins.dispatch.request.init" }
    , "802": { "theme": '#ee9B79', "iconImage": "新-用车审批.png", "name": "用车审批", "url": "views/dispatch/02.approval.html", "complated": "App.plugins.dispatch.approval.init" }
    , "803": { "theme": '#ab0569', "iconImage": "新-车辆调度.png", "name": "车辆调度", "url": "views/dispatch/03.dispatch.html", "complated": "App.plugins.dispatch.dispatch.init" }
    , "804": { "theme": '#D50569', "iconImage": "新-派车单管理.png", "name": "派车单管理", "url": "views/dispatch/04.order.html", "complated": "App.plugins.dispatch.order.init" }
    , "805": { "theme": '#703F93', "iconImage": "新-车辆归队.png", "name": "车辆归队", "url": "views/dispatch/05.rejoin.html", "complated": "App.plugins.dispatch.rejoin.init" }
  }
};
var server = "http://cwt.jsadc.com/CWTCSServer/";
if (cfgs.debug) {
  server = "http://localhost:8080/cwt/api.jsp?api=";
}

/* 业务逻辑参数 */
var bus_cfgs = {
  "cache": {}
  , "options": {}
  , "login": {
    "token_cookie": "ecr_user_token"
    , "token_json_cookie": "ecr_user_json"
    /* API:请求验证码 */
    , "captchaapi": server + "getCaptcha"
    /* API:请求登录 */
    , "loginapi": server + "login"
  }
  , "carservice": {
    /* API:请求目标列表 */
    "targetlistapi": server + "queryTargetList"
    /* API:请求定位 */
    , "trackapi": server + "getTrack"
    /* API:请求最后轨迹 */
    , "lasttrackapi": server + "queryLastTrack"
    /* API:请求实时轨迹 */
    , "realtrackapi": server + "getTrack"
    /* API:请求订阅 */
    , "Subscribeapi": server + ((cfgs.debug) ? "addSubscribe&iType=P,R,M" : "addSubscribe?iType=P,R,M")
  }
  /* 监控中心模块 */
  , "monitor": {
    "getTrackTimeapi": server + "getTrackTime"
    , "tarckPlayapi": server + "tarckPlay"//sid={0}&startUtc={1}&endUtc={2}&timeInterval={3}
  }
  /* 设置中心模块 */
  , "setting": {
    /* PAGE:车辆信息设置修改页面 */
    "requesteditpage": "views/newsletter/setuo_vehicleinfo_update.html",
    /* API：车辆信息设置查询*/
    "vehicleListapi": server + "vehicleList",
    /* API：操作员列表查询*/
    "operatorlistapi": server + "operatorList"
  }
  /* 调度中心模块 */
  , "dispatch": {
    /* PAGE:用车申请编辑页面 */
    "requesteditpage": "views/dispatch/edit.html"
    /* PAGE:用车详情页面 */
    , "detailspage": "views/dispatch/details.html"
    /* PAGE:审批界面*/
    , "approvalpage": "views/dispatch/approval.html"
    /* PAGE:驳回界面*/
    , "rejectpage": "views/dispatch/reject.html"
    /* PAGE:调度界面*/
    , "dispatchpage": "views/dispatch/dispatch.html"
    /* PAGE:归队界面*/
    , "rejoinpage": "views/dispatch/rejoin.html"
    /* API：用车申请列表查询*/
    , "requestlistapi": server + "applyQuery"
    /* API：用车申请详情查询*/
    , "detailsapi": server + "applyDetail"
    /* API:用车申请取消 */
    , "requestdeleteapi": server + "applyCancel"
    /* API：新增用车申请*/
    , "applyAddapi": server + "applyAdd"
    /* API：审批提交*/
    , "applySumbitapi": server + "applySumbit"
    /* API：用车审批详情查询*/
    , "approvalQueryapi": server + "approveQuery"
    /* API：审批通过提交调度*/
    , "applyApproveapi": server + "applyApprove"
    /* API：车辆归队列表查询*/
    , "rejoinlistapi": server + "guidui_query"
    /* API：车辆调度列表查询*/
    , "dispatchlistapi": server + "carDispatchQuery"
    /* API：派车单列表查询*/
    , "orderlistapi": server + "paichedan_query"
    /* API：车辆信息列表查询（调度）*/
    , "carlistapi": server + "vehicleListPcd"
    /* API：驾驶员信息列表查询（调度）*/
    , "driverlistapi": server + "driverListPcd"
    /* API：派车单信息列表（可多个）*/
    , "dispatchapi": server + "carDispatch"
    /* API：调度驳回*/
    , "dispatchRejectapi": server + "dispatchReject"
    /* API：调度完结*/
    , "dispatchOverapi": server + "dispatchOver"
    /* API：作废派车单*/
    , "orderCancelapi": server + "paichedan_dele"
    /* API：车辆归队*/
    , "orderRejoinapi": server + "car_guidui_update"
  }
  /*统计中心模块*/
  , "reportStatistics": {
    /*API:定位统计*/
    "locationapi": server + "locationStat"//"http://localhost:8080/cwt/api.jsp?api=locationStat"//
    /*告警统计*/
    , "requestlistapi": server + "reportCountStat"
    /*里程统计*/
    , "mileageStatapi": server + "mileageStat"
    /*油耗统计*/
    , "oilCostStatapi": server + "oilCostStat"
    /*指令统计*/
    , "commandStatapi": server + "commandStat"
    /*定位统计*/
    , "locationStatapi": server + "locationStat"
    /*终端查询*/
    , "terminalStatapi": server + "terminalStat"
    /*照片查询*/
    , "photoStatapi": server + "photoStat"
    /*日志统计*/
    , "logStatapi": server + "logStat"
    /*轨迹查询*/
    , "trackStatapi": server + "trackStat"
    /*停车查询*/
    , "parkStatapi": server + "parkStat",
    /** 告警查询 */
    "reportStatapi": server + "reportStat",
  }

  /*设置中心-车辆管理模块*/
  , "carmanager": {
    /*API：车辆分页列表*/
    "datas": server + "vehicleList"
    /*API：更新车辆信息*/
    , "update": server + "updaterole"
    , "listpage": "views/manager/car-list.html"
    , "editpage": "views/manager/car-edit.html"
  }
  /*设置中心-分组管理模块*/
  , "groupmanager": {
    /*API：分组分页列表*/
    "datas": server + "getTargetGroupingList"
    /*API：更新车辆信息*/
    , "update": server + "updaterole"
  }
  /*设置中心-操作员管理模块*/
  , "operatormanager": {
    /*API：操作员分页列表*/
    "datas": server + "operatorList"
    , "listpage": "views/manager/operator-list.html"
    , "editpage": "views/manager/operator-edit.html"
  }
  /*设置中心-角色管理模块*/
  , "rolemanager": {
    /*API：分组分页列表*/
    "datas": server + "operatorRoleList"
    , "listpage": "views/manager/role-list.html"
    , "editpage": "views/manager/role-edit.html"
  }
};
/* 各项内容模板设置 */
bus_cfgs.templates = {
  "cell": "<td class='center'/>"
};
/* 各项数据默认值设置 */
bus_cfgs.options.defaults = {
  "dateformatsort": "YYYY-MM-DD"
  , "dateformatsort2": "yyyy-MM-dd HH:mm"
  , "dateformat": "yyyy-MM-dd HH:mm:ss"
};
/* 数据字典相关设置 */
bus_cfgs.dict = {
  "sex": { "0": "男", "1": "女" }
  , "color": { "": "未设置", "ff0000": "红色", "ffffff": "白色", "000000": "黑色" }
  , "LOGINMODE": { "A": "LBS人员定位", "E": "GPS车辆定位(APN)", "F": "GPS车辆定位(CMNET)" }
  //申请状态
  , "SQZT": { "": "全部", "1": "未提交", "2": "审核中", "3": "审核通过", "4": "已驳回" }
  , "DDZT": { "": "全部", "1": "未调度", "2": "调度中", "3": "调度完成", "4": "调度驳回" }
  , "YCFW": { "": "全部", "1": "市内", "2": "省内", "3": "省外" }
  //客服类型
  , "KEFU": { "": "全部", "1": "投诉", "2": "需求建议" }
  //是否
  , "SF": { "": "全部", "1": "是", "2": "否" }
  //告警类型
  , "GJLX": { "": "所有告警类型", "1": "速度异常告警", "2": "区域告警", "3": "非法开门告警", "4": "紧急告警", "5": "邮箱开盖告警", "6": "主电源断电告警" }
  //出车状态
  , "CCZT": { "": "全部", "1": "出车中", "2": "已归队" }
  //处理状态
  , "CLZT": { "": "全部", "1": "待办", "2": "已办" }
  //车辆类型
  , "CLLX": { "": "全部", "1": "小型客车", "2": "中型客车", "3": "大型客车" }
  //调度身份
  , "DDSF": { "": "全部", "1": "申请人", "2": "审核员", "3": "调度员" }
  //驾驶员状态
  , "JSTZT": { "0": "正常在岗", "1": "离岗", "2": "其他" }
  /** 指令类型 */
  , "ZLLX": {
    "": "全部", "GC.TC.CALL": "点名动作",
    "GC.TST.MILE": "里程设置动作",
    "GC.TST.CALL_NO_LIST": "呼入呼出下发",
    "GC.TC.DOOR": "开关门动作",
    "GC.TC.OIL": "油路开关动作",
    "GC.EC.TAKE_PHOTO": "拍照动作",
    "GC.RTST.REGION_ENTER": "进区域告警下发",
    "GC.RTST.REGION_OUT": "出区域告警下发",
    "GC.RTST.SPEED": "速度告警下发",
  }
};
/*异常字典定义*/
bus_cfgs.dict.errorCode = {
  "9999": "系统错误"
  , "8888": "JSON格式错误"
  , "1001": "账号不存在"
  , "1002": "密码错误"
};
/* 日期选择控件参数设置 */
bus_cfgs.options.datepicker = {
  format: "yyyy-mm-dd",
  autoclose: true,
  todayBtn: true,
  language: "zh-CN",
  startDate: "2010-01-01",
  minView: "month",
  pickerPosition: "bottom-left"
}
bus_cfgs.options.datetimepicker = {
  format: "yyyy-mm-dd hh:ii:ss",
  autoclose: true,
  todayBtn: true,
  language: "zh-CN",
  startDate: "2010-01-01 00:00:00",
  pickerPosition: "bottom-left"//,
  //minuteStep: 6,
  // minView: 1
}
/* 文本相关参数设置 */
bus_cfgs.options.texts = {
  "btn_delete": " <i class=\"fa fa-trash-o\"></i> 删除 "
  , "btn_add": "<i class=\"fa fa-plus\"></i> 新增"
  , "btn_details": " <i class=\"fa fa-info\"></i> 详情 "
  , "btn_back": "<i class=\"fa fa-arrow-circle-left\"></i> 返回"
  , "btn_export": "<i class=\"fa fa-share-square-o\"></i> 导出"
  , "btn_search": "<i class=\"fa fa-search\"></i> 查询"
  , "btn_refresh": "<i class=\"fa fa-refresh\"></i> 刷新"
  , "btn_save": " 保存 <i class=\"fa fa-arrow-circle-right\"></i>"
  , "btn_cancel": "<i class=\"fa fa-arrow-circle-left\"></i> 取消 "
  , "btn_ok": " 确定 <i class=\"fa fa-arrow-circle-right\"></i> "
  , "btn_submit": " <i class=\"icon-share-alt\"></i> 提交 "
  , "btn_reset": " <i class=\"icon-refresh\"></i> 重置 "

  , "btn_close": "<i class=\"glyphicon glyphicon-remove\"></i> 关闭 "
  , "btn_reject": "<i class=\"fa fa-arrow-circle-left\"></i> 驳回 "
  , "btn_createPCD": "<i class=\"fa fa-arrow-circle-right\"></i> 生成派车单 "
  , "btn_rejoin": "<i class=\"fa fa-arrow-circle-right\"></i> 归队 "

  , "btn_edit": "<i class=\"fa fa-pencil\"></i> 编辑 "
  , "btn_select": " <i class=\"fa fa-check-square-o\"></i> 选择 "
  , "btn_carback": " <i class=\"fa fa-check-square-o\"></i> 车辆归队 "
  , "btn_tonext": "<i class=\"fa fa-arrow-circle-right\"></i> 提交审批 "
  , "btn_todispatch": "<i class=\"fa fa-arrow-circle-right\"></i> 提交调度 "
  , "btn_dispatch": "<i class=\"fa fa-arrow-circle-right\"></i> 调度 "
  , "btn_nodispatch": "<i class=\"fa fa-arrow-circle-right\"></i> 无单调度 "
  , "btn_dispatchfinish": "<i class=\"fa fa-arrow-circle-right\"></i> 调度完结 "
  , "btn_supplement": "<i class=\"fa fa-arrow-circle-right\"></i> 补单 "

  , "btn_start": " <i class=\"fa fa-arrow-circle-right\"></i> 开始 "
  , "btn_pause": " <i class=\"icon-share-alt\"></i> 暂停 "
  , "btn_stop": " <i class=\"icon-refresh\"></i> 停止 "
};
/* 样式相关参数设置 */
bus_cfgs.options.styles = {
  "default": "btn btn-default"
};
/* 页面相关参数设置 */
bus_cfgs.options.page = {
  "size": 8,
  "texts": {
    "first": "<i class=\"icon-control-start\"></i> 首页"
    , "priv": "<i class=\"icon-control-rewind\"></i> 上一页"
    , "next": "下一页 <i class=\"	 icon-control-forward\"></i>"
    , "last": "末页 <i class=\"icon-control-end\"></i>"
  }
};
/* 请求相关参数设置 */
bus_cfgs.options.request = {
  /* 设置AJAX请求超时时间:单位毫秒*/
  "timeout": 120000
  , "monitor": 60000
};
/* 下拉列表选项 */
bus_cfgs.options.select2 = { allowClear: true, language: "zh-CN" };
/*-----------------------------------------------------------------------------------*/
/*  当前页面选项
/*-----------------------------------------------------------------------------------*/
var pageOptions = {
  menus: []
  , items: []
  , currentmenu: null   /* 当前选中的菜单 */
  , requestOptions: {}  /* 最后一次分页数据请求 */
  , buffer: {}          /* 最后一次请求分页数据 */
  , fromCache: false    /* 是否读取缓存数据 */
};
/*
/// <summary>表示请求验证码的服务地址</summary>
public const string QueryCaptcha = "{serverurl}getCaptcha";

/// <summary>表示请求用户登录的服务地址</summary>
public const string QueryLogin = "{serverurl}login?sessionId={0}&u={1}&p={2}&captcha={3}&netType={4}";

/// <summary>表示请求目标列表的服务地址</summary>
public const string QueryTargetList = "{serverurl}queryTargetList?sessionId={sessionid}&operId={operateid}";

/// <summary>表示请求订阅的服务地址</summary>
public const string QuerySubscribe = "{serverurl}addSubscribe?sessionId={sessionid}&tid={0}&iType={1}";

/// <summary>表示请求最后轨迹的服务地址</summary>
public const string QueryLastTrack = "{serverurl}queryLastTrack?sessionId={sessionid}&sids={0}";

/// <summary>表示请求实时轨迹的服务地址</summary>
public const string QueryTrack = "{serverurl}getTrack?sessionId={sessionid}";

/// <summary>表示请求车辆详细信息的服务地址</summary>
public const string QueryVehicleTargetDetail = "{serverurl}queryVehicleTargetDetail?sessionId={sessionid}&targetId={0}";

/// <summary>表示人员定位的服务地址</summary>
public const string BatchCall = "{serverurl}batchCall?sessionId={sessionid}&sIds={0}";

/// <summary>表示人员详细信息服务地址</summary>
public const string QueryPersonTargetDetail = "{serverurl}queryPersonTargetDetail?sessionId={sessionid}&targetId={0}";

/// <summary>表示定位统计服务地址</summary>
public const string LocationStat = "{serverurl}locationStat?sessionId={sessionid}&startTime={0}&endTime={1}&sIds={2}&start={3}&limit={4}";

/// <summary>表示停车统计服务地址</summary>
public const string ParkStat = "{serverurl}parkStat?sessionId={sessionid}&startTime={0}&endTime={1}&sIds={2}&start={3}&limit={4}&times={5}";

/// <summary>表示停车统计服务地址2</summary>
public const string OldParkStat = "{serverurl}oldParkStat?sessionId={sessionid}&startTime={0}&endTime={1}&sIds={2}&start={3}&limit={4}&times={5}";

/// <summary>表示里程统计服务地址</summary>
public const string MileageStat = "{serverurl}mileageStat?sessionId={sessionid}&startTime={0}&endTime={1}&sIds={2}&start={3}&limit={4}";

/// <summary>表示离线统计服务地址</summary>
public const string OffLineStat = "{serverurl}offLineReportStat?sessionId={sessionid}&day={0}&sIds={1}&start={2}&limit={3}";

/// <summary>表示油耗统计服务地址</summary>
public const string OilCostStat = "{serverurl}oilCostStat?sessionId={sessionid}&startTime={0}&endTime={1}&sIds={2}&start={3}&limit={4}";
    
/// <summary>表示终端统计服务地址</summary>
public const string TerminalStat = "{serverurl}terminalStat?sessionId={sessionid}&sIds={0}&start={1}&limit={2}&groupId={3}&targetName={4}&sim={5}&planName={6}&isPlan={7}";

/// <summary>表示日志统计服务地址</summary>
public const string LogStat = "{serverurl}logStat?sessionId={sessionid}&startTime={0}&endTime={1}&content={2}&start={3}&limit={4}";

/// <summary>表示指令统计服务地址</summary>
public const string CommandStat = "{serverurl}commandStat?sessionId={sessionid}&startTime={0}&endTime={1}&sIds={2}&start={3}&limit={4}&cmdName={5}&operName={6}";

/// <summary>表示告警查询服务地址</summary>
public const string ReportStat = "{serverurl}reportStat?sessionId={sessionid}&rType={0}&startTime={1}&endTime={2}&sIds={3}&start={4}&limit={5}";

/// <summary>表示告警统计服务地址</summary>
public const string AlarmCountStat = "{serverurl}reportCountStat?sessionId={sessionid}&rType={0}&startTime={1}&endTime={2}&sIds={3}&start={4}&limit={5}";

/// <summary>表示轨迹统计服务地址</summary>
public const string TrackStat = "{serverurl}trackStat?sessionId={sessionid}&startTime={0}&endTime={1}&sIds={2}&start={3}&limit={4}&sHour={5}&eHour={6}&type={7}";

/// <summary>表示照片统计服务地址</summary>
public const string PhotoStat = "{serverurl}photoStat?sessionId={sessionid}&startTime={0}&endTime={1}&sIds={2}&start={3}&limit={4}";

/// <summary>表示里程重置服务地址</summary>
public const string MileageReset = "{serverurl}mileReset?sessionId={sessionid}&sIds={0}&mile={1}";

/// <summary>表示立即拍照服务地址</summary>
public const string OncePhoto = "{serverurl}oncePhoto?sessionId={sessionid}&sIds={0}";

/// <summary>表示油路控制服务地址</summary>
public const string OilControl = "{serverurl}oilControl?sessionId={sessionid}&sIds={0}&c={1}";

/// <summary>表示远程开关门服务地址</summary>
public const string OnOffDoor = "{serverurl}onOffDoor?sessionId={sessionid}&sIds={0}&d={1}";

/// <summary>表示终端密码验证服务地址</summary>
public const string PwCheckURL = "{serverurl}pswCheck?sessionId={sessionid}&targetId={0}&psw={1}";

/// <summary>表示查询车辆信息服务地址</summary>
public const string VehicleList = "{serverurl}vehicleList?sessionId={sessionid}&gName={0}&driver={1}&vName={2}&sim={3}&start={4}&limit={5}";

/// <summary>表示查询车辆信息服务地址（调度）</summary>
public const string VehicleListDiaodu = "{serverurl}vehicleListPcd?sessionId={sessionid}&gName={0}&driver={1}&vName={2}&sim={3}&start={4}&limit={5}";

/// <summary>表示查询驾驶员信息服务地址（调度）</summary>
public const string DriverListDiaodu = "{serverurl}driverListPcd?sessionId={sessionid}&vName={0}&sex={1}&dName={2}&dNum={3}&vType={4}&start={5}&limit={6}";

/// <summary>表示新增车辆类型服务地址</summary>
public const string VehicleTypeAdd = "{serverurl}vehicleTypeAdd?sessionId={sessionid}&name={0}&desc={1}&remark={2}";

/// <summary>表示车辆类型服务地址</summary>
public const string VehicleTypeQuery = "{serverurl}vehicleTypeQuery?sessionId={sessionid}";

/// <summary>表示查询驾驶员信息服务地址</summary>
public const string DriverList = "{serverurl}driverList?sessionId={sessionid}&vName={0}&sex={1}&dName={2}&dNum={3}&vType={4}&start={5}&limit={6}";

/// <summary>表示查询目标分组信息服务地址</summary>
public const string TargetGroupingList = "{serverurl}getTargetGroupingList?sessionId={sessionid}&gName={0}&gRuel={1}&start={2}&limit={3}";

public const string Upload = "{serverurl}upload?sessionId={sessionid}";

public const string DriverAdd = "{serverurl}driverAdd?sessionId={sessionid}&dName={0}&vName={1}&dNum={2}&sex={3}&date={4}&iCard={5}&address={6}&phone={7}&tel={8}&vType={9}&photo={10}&remark={11}";

public const string DriverUpdate = "{serverurl}driverUpdate?sessionId={sessionid}&dName={0}&vName={1}&dNum={2}&sex={3}&date={4}&iCard={5}&address={6}&phone={7}&tel={8}&vType={9}&photo={10}&remark={11}&driverId={12}";

public const string VehicleUpdate = "{serverurl}vehicleUpdate?sessionId={sessionid}&id={0}&vName={1}&simCode={2}&vType={3}&vColor={4}&vCharacter={5}&oilConsume={6}&vOwner={7}&phone={8}&password={9}&frameCode={10}&engineCode={11}&drivingLicence={12}&drivingLicenseDate={13}&runDate={14}&businessCode={15}&money={16}&buyDate={17}&registerDate={18}&saleMerchant={19}&invoiceCode={20}&subjoinMoneyCode={21}&photo={22}&remark={23}&areaCode={24}&qryType={25}&qryNum={26}";

public const string QryVehicleDriver = "{serverurl}qryVehicle_driver?sessionId={sessionid}&vName={0}&sim={1}&active={2}&gName={3}&start={4}&limit={5}";

public const string DriverDel = "{serverurl}driverDel?sessionId={sessionid}&driverId={0}";

public const string PersonUpdate = "{serverurl}personUpdate?sessionId={sessionid}&pId={0}&pName={1}&position={2}&sex={3}&sim={4}&idCard={5}&officeTel={6}&homeTel={7}&address={8}&department={9}&photo={10}";

public const string PersonDel = "{serverurl}personDel?sessionId={sessionid}&pId={0}";

public const string Img = "{serverurl}getImg?f={0}";

/// <summary>表示人员信息列表服务地址</summary>
public const string PersonList = "{serverurl}personList?sessionId={sessionid}&gName={0}&sim={1}&pName={2}&openStat={3}&sex={4}&rzStat={5}&birth={6}&start={7}&limit={8}";

/// <summary>表示定位计划服务地址</summary>
public const string LocatePlanList = "{serverurl}locatePlanList?sessionId={sessionid}&start={0}&limit={1}";

/// <summary>表示新增定位计划服务地址</summary>
public const string LocatePlanAdd = "{serverurl}locatePlanAdd?sessionId={sessionid}&name={0}&sDate={1}&eDate={2}&locateInterval={3}&num={4}&type={5}";

/// <summary>表示删除定位计划服务地址</summary>
public const string LocatePlanDel = "{serverurl}locatePlanDel?sessionId={sessionid}&id={0}&type={1}";

/// <summary>表示绑定关系定位计划服务地址</summary>
public const string LocatePlanBound = "{serverurl}locatePlanBound?sessionId={sessionid}&pId={0}&tmnId={1}&pName={2}&tName={3}";

/// <summary>表示普通超速告警设置服务地址</summary>
public const string SpeedAlarmSetting1 = "{serverurl}speedReportSetup?sessionId={sessionid}&type=1&speedType={0}&speed={1}&priority={2}&interval={3}&needConfirm={4}&onNow={5}&sids={6}";

/// <summary>表示时间段超速告警设置地址</summary>
public const string SpeedAlarmSetting2 = "{serverurl}speedReportSetup?sessionId={sessionid}&sDate={0}&eDate={1}&speed={2}&interval={3}&sIds={4}";

/// <summary>表示离线车辆列表地址</summary>
public const string OffLineReportList = "{serverurl}offLineReportList?sessionId={sessionid}&start={0}&limit={1}";

/// <summary>表示离线告警设置地址</summary>
public const string OffLineUpdate = "{serverurl}offLineUpdate?sessionId={sessionid}&frequency={0}&type={1}&num={2}&sendOp={3}&id={4}";

/// <summary>表示离线告警详情地址</summary>
public const string OffLineReportDetail = "{serverurl}offLineReportDetail?sessionId={sessionid}&id={abc}";

/// <summary>表示操作员信息管理查询地址</summary>
public const string OperatorList = "{serverurl}operatorList?sessionId={sessionid}&userName={0}&loginName={1}&telphone={2}&state={3}&dispatch_identity={4}&start={5}&limit={6}";

/// <summary>表示操作员信息管理查询地址</summary>
public const string OperatorDetail = "{serverurl}operatorDetail?sessionId={sessionid}&id={0}";

/// <summary>表示操作员信息管理查询地址</summary>
public const string OperatorUpdate = "{serverurl}operatorUpdate?sessionId={sessionid}&id={0}&userName={1}&telphone={2}&email={3}&dispatch_identity={4}&remark={5}";

/// <summary>表示显示操作员已绑定的目标组查询地址</summary>
public const string ShowTarGroup = "{serverurl}showTarGroup?sessionId={sessionid}&operId={0}";

/// <summary>表示分配目标组地址</summary>
public const string MatchOperTmnGroup = "{serverurl}matchOperTmnGroup?sessionId={sessionid}&operId={0}&targetGroups={1}";

/// <summary>表示分配目标组地址</summary>
public const string OperatorRoleMatching = "{serverurl}operatorRoleMatching?sessionId={sessionid}&operId={0}&roleIds={1}";

/// <summary>表示目标组新增地址</summary>
public const string TargetGroupingAdd = "{serverurl}targetGroupingAdd?sessionId={sessionid}&gName={0}&gParentId={1}&groupType={2}&intro={3}&remark={4}&ruleId={5}";

/// <summary>表示目标组新增地址</summary>
public const string TargetGroupingUpdate = "{serverurl}targetGroupingUpdate?sessionId={sessionid}&gName={0}&gParentId={1}&groupType={2}&intro={3}&remark={4}&ruleId={5}&gId={6}";

/// <summary>表示目标组删除地址</summary>
public const string TargetGroupingDel = "{serverurl}targetGroupingDel?sessionId={sessionid}&gId={0}";

/// <summary>表示目标组删除地址</summary>
public const string AddTargetMacting = "{serverurl}addTargetMacting?sessionId={sessionid}&groupId={0}&targetIds={1}";

/// <summary>表示目标组删除地址</summary>
public const string RemoveTargetMacting = "{serverurl}removeTargetMacting?sessionId={sessionid}&groupId={0}&targetIds={1}";

/// <summary>表示查询操作员角色列表地址</summary>
public const string OperatorRoleList = "{serverurl}operatorRoleList?sessionId={sessionid}&op_id={0}&name={1}&remark={2}&start={3}&limit={4}";

/// <summary>表示新增操作员角色信息地址</summary>
public const string OperatorRoleAdd = "{serverurl}operatorRoleAdd?sessionId={sessionid}&name={0}&remark={1}&intro={2}&isOperator=1&isAdmin=2";

/// <summary>表示新增操作员角色信息地址</summary>
public const string OperatorRoleUpdate = "{serverurl}operatorRoleUpdate?sessionId={sessionid}&name={0}&remark={1}&intro={2}&isOperator=1&isAdmin=2&id={3}";

/// <summary>表示删除操作员角色信息地址</summary>
public const string OperatorRoleDel = "{serverurl}operatorRoleDel?sessionId={sessionid}&operIds={0}";

/// <summary>表示查询客服进度列表地址</summary>
public const string CustomerServiceList = "{serverurl}customerServiceList?sessionId={sessionid}&type={0}&startTime={1}&endTime={2}&start={3}&limit={4}";
    
/// <summary>表示查询轨迹时间段列表地址</summary>
public const string TrackTime = "{serverurl}getTrackTime?sessionId={sessionid}&startTime={0}&endTime={1}&sim={2}";

/// <summary>表示查询轨迹回放数据地址</summary>
public const string TrackPlay = "{serverurl}tarckPlay?sessionId={sessionid}&sid={0}&startUtc={1}&endUtc={2}&timeInterval={3}";
/// <summary>PositionNoneCenter</summary>
public const string PositionNoneCenter = "{serverurl}requestLocationDesc?sessionId={sessionid}&lon={0}&lat={1}&uuid={guid}";
*/
