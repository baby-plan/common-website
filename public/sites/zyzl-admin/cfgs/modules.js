define(["cfgs"], function (cfgs) {
  /* 系统模块定义
说明：
    1. parent   表示模块父级，若为000则视为根目录。
    2. name     表示模块名称，即菜单名称
    3. icon     表示模块图标，即菜单图标
    5. url      表示模块路径，即菜单点击后打开的地址。
 */
  cfgs.modules = {

    "HOME": {
      "name": "首页", "icon": "fa fa-home",
      "module": "module-server", "method": "status",
      "url": "views/common/chart.html",
      "actions": [
      ]
    },

    "MCH_MANAGEMENT": {
      "name": "商户基本信息管理", "icon": "fa fa-file-text-o",
      "module": "module-merchant",
      "actions": [
        { "id": "MCH_MANAGEMENT_INSERT", "name": "新增", "action": "insert" },
        { "id": "MCH_MANAGEMENT_UPDATE", "name": "编辑", "action": "update" },
        { "id": "MCH_MANAGEMENT_DELETE", "name": "删除", "action": "delete" },
        { "id": "MCH_MANAGEMENT_EXPORT", "name": "导出", "action": "export" },
        { "id": "MCH_MANAGEMENT_CHECH", "name": "审核", "action": "check" },
        { "id": "MCH_MANAGEMENT_PUBLISH", "name": "发布", "action": "publish" },
        { "id": "MCH_MANAGEMENT_UNPUBLISH", "name": "取消发布", "action": "unpublish" },
        { "id": "MCH_MANAGEMENT_RESETPASSWORD", "name": "重置密码", "action": "resetpassword" },
      ]
    },

    "MCH_SERVICE_MANAGEMENT": {
      "name": "商户服务项目管理", "icon": "fa fa-file-text-o",
      "module": "module-merchant-service",
      "actions": [
        { "id": "MCH_SERVICE_MANAGEMENT_INSERT", "name": "新增", "action": "insert" },
        { "id": "MCH_SERVICE_MANAGEMENT_UPDATE", "name": "编辑", "action": "update" },
        { "id": "MCH_SERVICE_MANAGEMENT_DELETE", "name": "删除", "action": "delete" },
        { "id": "MCH_SERVICE_MANAGEMENT_EXPORT", "name": "导出", "action": "export" },
        { "id": "MCH_SERVICE_MANAGEMENT_CHECH", "name": "审核", "action": "check" },
      ]
    },

    "MCH_HISTORY": {
      "name": "商户全历史查询", "icon": "fa fa-search",
      "module": "module-merchant-history",
      "actions": [
        { "id": "MCH_HISTORY_EXPORT", "name": "导出", "action": "export" }
      ]
    },

    "USER_HISTORY": {
      "name": "用户全历史查询", "icon": "fa fa-search",
      "module": "module-user-history",
      "actions": [
        { "id": "USER_HISTORY_EXPORT", "name": "导出", "action": "export" }
      ]
    },

    "ORDER_SEARCH": {
      "name": "订单信息查询", "icon": "fa fa-search",
      "module": "module-order",
      "actions": [
        { "id": "ORDER_SEARCH_EXPORT", "name": "导出", "action": "export" }
      ]
    },

    "SETTLE_REPORT": {
      "name": "结算报表查询", "icon": "fa fa-search",
      "module": "module-order-report",
      "actions": [
        { "id": "SETTLE_REPORT_EXPORT", "name": "导出", "action": "export" }
      ]
    },

    "TICKET_SEARCH": {
      "name": "领券情况查询", "icon": "fa fa-search",
      "module": "module-user-ticket",
      "actions": [
        { "id": "TICKET_SEARCH_EXPORT", "name": "导出", "action": "export" }
      ]
    },
    "MANAGEMENT": {
      "name": "业务管理视角"
    },
    "USER_ACTIVE_TOTAL": {
      "name": "活跃用户统计月表", "icon": "fa fa-search", "parent": "MANAGEMENT",
      "module": "module-user-active",
      "actions": [
        { "id": "USER_ACTIVE_TOTAL_EXPORT", "name": "导出", "action": "export" }
      ]
    },

    "MCH_ACTIVE_TOTAL": {
      "name": "活跃商户统计月表", "icon": "fa fa-search", "parent": "MANAGEMENT",
      "module": "module-merchant-active",
      "actions": [
        { "id": "MCH_ACTIVE_TOTAL_EXPORT", "name": "导出", "action": "export" }
      ]
    },

    "MCH_SUCCESS_RATE": {
      "name": "商户上线成功率统计", "icon": "fa fa-search", "parent": "MANAGEMENT",
      "module": "module-merchant-success",
      "actions": [
        { "id": "MCH_SUCCESS_RATE_EXPORT", "name": "导出", "action": "export" }
      ]
    },

    "MCH_SIGN": {
      "name": "商户签约数量统计", "icon": "fa fa-search", "parent": "MANAGEMENT",
      "module": "module-merchant-sign",
      "actions": [
        { "id": "MCH_SIGN_EXPORT", "name": "导出", "action": "export" }
      ]
    },

    "MCH_SIGN_DETAIL": {
      "name": "商户签约明细", "icon": "fa fa-search", "parent": "MANAGEMENT",
      "module": "module-merchant-signdetail",
      "actions": [
        { "id": "MCH_SIGN_DETAIL_EXPORT", "name": "导出", "action": "export" }
      ]
    },

    "PARTNER_MANAGMENT": {
      "name": "合作方信息管理", "parent": "MANAGEMENT",
      "module": "module-partner",
      "actions": [
        { "id": "PARTNER_MANAGMENT_INSERT", "name": "新增", "action": "insert" },
        { "id": "PARTNER_MANAGMENT_UPDATE", "name": "编辑", "action": "update" },
        { "id": "PARTNER_MANAGMENT_DELETE", "name": "删除", "action": "delete" },
        { "id": "PARTNER_MANAGMENT_EXPORT", "name": "导出", "action": "export" },
        { "id": "PARTNER_MANAGEMENT_RESETPASSWORD", "name": "重置密码", "action": "resetpassword" },
      ]
    },
    "SYSTEM_MANAGEMENT": {
      "name": "系统管理视角"
    },
    // "0015": { "parent": "000", "name": "菜单管理", "module": "common-module", "icon": "fa fa-cog" },
    "ACCOUNT_MANAGMENT": {
      "name": "账户管理", "icon": "fa fa-users", "parent": "SYSTEM_MANAGEMENT",
      "module": "common-admin",
      "actions": [
        { "id": "ACCOUNT_MANAGMENT_INSERT", "name": "新增", "action": "insert" },
        { "id": "ACCOUNT_MANAGMENT_UPDATE", "name": "编辑", "action": "update" },
        { "id": "ACCOUNT_MANAGMENT_DELETE", "name": "删除", "action": "delete" },
        { "id": "ACCOUNT_MANAGMENT_EXPORT", "name": "导出", "action": "export" },
      ]
    },

    "ROLE_MANAGMENT": {
      "name": "角色管理", "icon": "fa fa-users", "parent": "SYSTEM_MANAGEMENT",
      "module": "common-role",
      "actions": [
        { "id": "ROLE_MANAGMENT_INSERT", "name": "新增", "action": "insert" },
        { "id": "ROLE_MANAGMENT_UPDATE", "name": "编辑", "action": "update" },
        { "id": "ROLE_MANAGMENT_DELETE", "name": "删除", "action": "delete" },
        { "id": "ROLE_MANAGMENT_EXPORT", "name": "导出", "action": "export" },
      ]
    },

    "AREA_MANAGMENT": {
      "name": "行政区划管理", "icon": "fa fa-book", "parent": "SYSTEM_MANAGEMENT",
      "module": "common-dict", "method": "init-coderange",
      "actions": [
        { "id": "AREA_MANAGEMENT_INSERT", "name": "新增", "action": "insert" },
        { "id": "AREA_MANAGEMENT_UPDATE", "name": "编辑", "action": "update" },
        { "id": "AREA_MANAGEMENT_DELETE", "name": "删除", "action": "delete" },
        { "id": "AREA_MANAGEMENT_EXPORT", "name": "导出", "action": "export" },
      ]
    },

    "CODE_MANAGEMENT": {
      "name": "号段表管理", "icon": "fa fa-book", "parent": "SYSTEM_MANAGEMENT",
      "module": "common-dict",
      "actions": [
        { "id": "CODE_MANAGEMENT_INSERT", "name": "新增", "action": "insert" },
        { "id": "CODE_MANAGEMENT_UPDATE", "name": "编辑", "action": "update" },
        { "id": "CODE_MANAGEMENT_DELETE", "name": "删除", "action": "delete" },
        { "id": "CODE_MANAGEMENT_EXPORT", "name": "导出", "action": "export" },
      ]
    },

    "SYS_LOG": {
      "name": "日志查询", "icon": "fa fa-search", "parent": "SYSTEM_MANAGEMENT",
      "module": "module-common", "method": "init-log-search",
      "actions": [
        { "id": "SYS_LOG_EXPORT", "name": "导出", "action": "export" }
      ]
    },

    "SYS_MONITOR": {
      "name": "系统监控(后期设想)", "icon": "fa fa-tachometer",
      "url": "views/summary/serverstatus.html",
      "module": "module-server",
      "actions": [
      ]
    },
    // "0021": { "parent": "000", "name": "服务类型", "module": "module-dict", args: "servicetype", "icon": "fa fa-book" },
    // "0022": { "parent": "000", "name": "车辆类型", "module": "module-dict", args: "cartype", "icon": "fa fa-book" },


    // "d00": { "parent": "000", "name": "公共示例", "icon": "fa fa-object-ungroup" },
    "d01": {
      "name": "图标字体 | WebFont",
      "url": "views/sample/icons.html",
      "actions": [
      ]
    },
    // "d03": { "parent": "d00", "name": "时间轴 | timeline", "url": "views/sample/timeline.html" },
    // "d05": { "parent": "d00", "name": "CSS动画", "url": "views/sample/animation.html" },
    // "d06": { "parent": "d00", "name": "统计图表 | ECHARTS", "url": "views/sample/charts.html", "module": 'module-demo-charts' },
    // "d07": { "parent": "d00", "name": "加载动画 | Loading", "url": "views/sample/loading.html" }

  };

});