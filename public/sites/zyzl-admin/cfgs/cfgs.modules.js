
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
    "0100": { "parent": "000", "name": "监控中心", "icon": "fa fa-tachometer", "iconcolor": "red" },
    "0101": { "parent": "0100", "name": "服务器状态", "url": "views/common/serverstatus.html", "callback": "$M.server.status", "icon": "fa fa-file-text-o" },
    "0103": { "parent": "0100", "name": "服务端版本", "url": "views/common/version.server.html", "icon": "fa fa-server" },
    "0104": { "parent": "0100", "name": "客户端版本", "url": "views/common/version.client.html", "icon": "fa fa-server" },

    "0200": { "parent": "000", "name": "查询统计", "icon": "fa fa-bar-chart-o" },
    "0201": { "parent": "0200", "name": "用户全历史查询", "callback": "$M.order.initUserSearch", "icon": "fa fa-search" },
    "0202": { "parent": "0200", "name": "领券情况查询", "callback": "$P.activity", "icon": "fa fa-bar-chart" },
    "0203": { "parent": "0200", "name": "活跃用户统计月表", "callback": "$P.activity", "icon": "fa fa-line-chart" },
    "0204": { "parent": "0200", "name": "活跃商户统计月表", "callback": "$P.activity", "icon": "fa fa-pie-chart" },
    "0205": { "parent": "0200", "name": "商户上线成功率统计", "callback": "$P.activity", "icon": "fa fa-pie-chart" },
    "0206": { "parent": "0200", "name": "商户签约数量统计", "callback": "$P.activity", "icon": "fa fa-pie-chart" },

    "0300": { "parent": "000", "name": "订单管理", "icon": "fa fa-file-text-o" },
    "0301": { "parent": "0300", "name": "订单信息查询", "callback": "$M.order.init", "icon": "fa fa-search" },
    "0302": { "parent": "0300", "name": "结算订单查询", "callback": "$M.order.init", "icon": "fa fa-search" },

    "0400": { "parent": "000", "name": "商户管理", "icon": "fa fa-cubes" },
    "0401": { "parent": "0400", "name": "商户基本信息管理", "callback": "$M.tenant.initInfo", "icon": "fa fa-file-text-o" },
    "0402": { "parent": "0400", "name": "商户服务项目管理", "callback": "$M.tenant.initProject", "icon": "fa fa-file-text-o" },
    "0403": { "parent": "0400", "name": "商户全历史查询", "callback": "$M.tenant.initSearch", "icon": "fa fa-search" },

    "0500": { "parent": "000", "name": "合作方管理", "icon": "fa fa-handshake-o" },
    "0501": { "parent": "0500", "name": "合作方信息管理", "callback": "$P.options.system"},

    "100": { "parent": "000", "name": "系统维护", "icon": "fa fa-cogs" },
    "102": { "parent": "100", "name": "账户管理", "callback": "App.plugins.admin.init", "icon": "fa fa-users" },
    "101": { "parent": "100", "name": "角色管理", "callback": "App.plugins.role.init", "icon": "fa fa-users" },
    "103": { "parent": "100", "name": "日志查询", "callback": "App.plugins.syslog.init", "icon": "fa fa-search" },
    "104": { "parent": "100", "name": "参数设置", "url": "views/common/option.html", "callback": "$P.options.system", "icon": "fa fa-cog" },
    "105": { "parent": "100", "name": "菜单管理", "callback": "$P.options.system", "icon": "fa fa-cog" },

    "300": { "parent": "000", "name": "数据字典管理", "icon": "fa fa-book" },
    "301": { "parent": "300", "name": "活动类型", "callback": "$D/activitytype" },
    "306": { "parent": "300", "name": "行政区划管理", "callback": "$P.options.system", "icon": "fa fa-cog" },
    "307": { "parent": "300", "name": "号段表管理", "callback": "$P.options.system", "icon": "fa fa-cog" },

    "d00": { "parent": "000", "name": "公共示例", "icon": "fa fa-object-ungroup" },
    "d01": { "parent": "d00", "name": "图标字体 | WebFont", "url": "views/sample/icons.html" },
    "d06": { "parent": "d00", "name": "统计图表 | ECHARTS", "url": "views/sample/charts.html" },
};