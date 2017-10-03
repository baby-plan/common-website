
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
    "0102": { "parent": "0100", "name": "高德地图", "url": "views/common/amap.html", "callback": "$M.map.initamap", "leave": "$M.map.deinitamap", "icon": "fa fa-send" },
    "0103": { "parent": "0100", "name": "服务端版本", "url": "views/common/version.server.html", "icon": "fa fa-server" },
    "0104": { "parent": "0100", "name": "客户端版本", "url": "views/common/version.client.html", "icon": "fa fa-server" },

    "0200": { "parent": "000", "name": "个人中心", "icon": "fa fa-user" },
    "0201": { "parent": "0200", "name": "我的资料", "url": "views/master/profile.html", "callback": "$M.profile", "icon": "fa fa-file-text-o" },
    "0202": { "parent": "0200", "name": "我的收藏", "url": "views/master/profile.html", "callback": "$M.profile", "icon": "fa fa-file-text-o" },
    "0202": { "parent": "0200", "name": "我的评论", "url": "views/master/profile.html", "callback": "$M.profile", "icon": "fa fa-file-text-o" },
    "0203": { "parent": "0200", "name": "我的关注", "url": "views/master/profile.html", "callback": "$M.profile", "icon": "fa fa-file-text-o" },
    "0204": { "parent": "0200", "name": "我的云盘", "url": "views/common/files.html", "callback": "$P.file", "icon": "fa fa-files-o" },
    "0205": { "parent": "0200", "name": "我的机构", "url": "views/common/orgalist.html", "callback": "App.modules.organization.list", "icon": "fa fa-futbol-o" },
    "0206": { "parent": "0200", "name": "我的活动", "url": "views/common/files.html", "callback": "$P.file", "icon": "fa fa-futbol-o" },
    "0207": { "parent": "0200", "name": "修改密码", "url": "views/master/changepwd.html", "icon": "fa fa-key" },

    "100": { "parent": "000", "name": "系统维护", "icon": "fa fa-cogs" },
    "101": { "parent": "100", "name": "角色管理", "callback": "App.plugins.role.init", "icon": "fa fa-users" },
    "102": { "parent": "100", "name": "用户管理", "callback": "App.plugins.admin.init", "icon": "fa fa-users" },
    "103": { "parent": "100", "name": "日志查询", "callback": "App.plugins.syslog.init", "icon": "fa fa-search" },
    "104": { "parent": "100", "name": "参数设置", "url": "views/common/option.html", "callback": "$P.options.system", "icon": "fa fa-cog" },

    "300": { "parent": "000", "name": "数据字典管理", "icon": "fa fa-book" },
    "301": { "parent": "300", "name": "活动类型", "callback": "$D/activitytype" },
    "302": { "parent": "300", "name": "人员性别", "callback": "$D/sex" },
    "303": { "parent": "300", "name": "机构类型", "callback": "$D/orgatype" },
    "304": { "parent": "300", "name": "学校类型", "callback": "$D/schooltype" },
    "305": { "parent": "300", "name": "文件类型", "callback": "$D/filetype" },

    "400": { "parent": "000", "name": "机构管理", "icon": "fa fa-cubes" },
    "401": { "parent": "400", "name": "机构明细", "callback": "$M.organization.init", "icon": "fa fa-file-text-o" },
    "402": { "parent": "400", "name": "机构浏览", "url": "views/common/orgalist.html", "callback": "$M.organization.list", "icon": "fa fa-file-text-o" },

    "500": { "parent": "000", "name": "学校管理", "icon": "fa fa-graduation-cap" },
    "501": { "parent": "500", "name": "学校明细", "callback": "$M.school.init", "icon": "fa fa-file-text-o" },

    "600": { "parent": "000", "name": "活动管理", "icon": "fa fa-futbol-o" },
    "601": { "parent": "600", "name": "发布活动", "url": "views/activity/publish.step.1.html", "callback": "App.plugins.activity.publish", "icon": "fa fa-flag" },
    "602": { "parent": "600", "name": "活动明细", "callback": "$P.activity", "icon": "fa fa-futbol-o" },

    "900": { "parent": "000", "name": "统计分析", "icon": "fa fa-bar-chart-o" },
    "901": { "parent": "900", "name": "活动分类统计", "callback": "$P.activity", "icon": "fa fa-area-chart" },
    "902": { "parent": "900", "name": "活动报名统计", "callback": "$P.activity", "icon": "fa fa-bar-chart" },
    "903": { "parent": "900", "name": "活动费用统计", "callback": "$P.activity", "icon": "fa fa-line-chart" },
    "904": { "parent": "900", "name": "会员统计", "callback": "$P.activity", "icon": "fa fa-pie-chart" },

    "d00": { "parent": "000", "name": "公共示例", "icon": "fa fa-object-ungroup" },
    "d01": { "parent": "d00", "name": "图标字体 | WebFont", "url": "views/sample/icons.html" },
    "d02": { "parent": "d00", "name": "代码框 | code", "url": "views/sample/code.html" },
    "d03": { "parent": "d00", "name": "时间轴 | timeline", "url": "views/sample/timeline.html" },
    "d04": { "parent": "d00", "name": "即时通讯 | WebSocket", "url": "views/sample/websocket.html" },
    "d05": { "parent": "d00", "name": "CSS动画", "url": "views/sample/animation.html" },
    "d06": { "parent": "d00", "name": "统计图表 | ECHARTS", "url": "views/sample/charts.html" },
    "d07": { "parent": "d00", "name": "加载动画 | Loading", "url": "views/sample/loading.html" }
};