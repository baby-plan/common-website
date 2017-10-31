let { generator, db, base64 } = require('../../core/framework');
module.exports = {
  "rootpath": "/api/module/",
  "description": "菜单管理",
  "mapping": {
    "default": { "description": "通过查询条件筛选，返回经过分页处理的菜单列表。" },
    "insert": { "description": "新增一个菜单" },
    "update": { "description": "修改菜单详细信息" },
    "delete": { "description": "删除一个菜单" },
    "parentall": { "description": "获取父级菜单列表" },
    "modules": { "description": "获取模块菜单清单." }
  },
  "entity": {
    "table": "moduleinfo",
    "columns": [
      { "name": "ModuleID", "caption": "菜单编号", "primary": true },
      { "name": "ModuleName", "caption": "菜单名称", "filter": "like", "requid": true },
      { "name": "ModuleParent", "caption": "所属父级", "filter": true },
      { "name": "ModulePage", "caption": "页面地址" },
      { "name": "ModulePackage", "caption": "页面组件包" },
      { "name": "ModuleInitMethod", "caption": "页面初始化方法" },
      { "name": "ModuleArgs", "caption": "页面参数" },
      { "name": "ModuleMethods", "caption": "页面功能清单" },
      { "name": "ModuleDestory", "caption": "页面销毁函数" },
      { "name": "ModuleIcon", "caption": "页面图标" },
      { "name": "ModuleDesc", "caption": "页面描述" },
      { "name": "CreateUser", "caption": "创建者", "insertdefault": (req, res) => { return req.session.user; } },
      { "name": "CreateTime", "caption": "创建时间", "insertdefault": (req, res) => { return new Date().getTime() / 1000; } },
      { "name": "LastModifyUser", "caption": "最后修改者", "default": (req, res) => { return req.session.user; } },
      { "name": "LastModiftTime", "caption": "最后修改时间", "default": (req, res) => { return new Date().getTime() / 1000; } },
      { "name": "state", "caption": "状态", "filter": true, "default": (req, res) => { return "0"; } },
    ]
  },
  "parentall": (req, res) => {
    var sql = 'SELECT ModuleID,ModuleName from moduleinfo where ModuleParent=?';
    var params = ['000'];
    db.query(sql, params, function (err, rows, fields) {
      if (err) {
        res.send(generator.message(err.message));
      } else {
        // rows.forEach(function (row) {
        //   row.ModuleName = base64.encode(row.ModuleName);
        // });
        res.send(generator.data({ "list": rows }));
      }
    });
  },
  "modules": (req, res) => {
    var sql = 'SELECT * from moduleinfo';
    db.query(sql, [], function (err, rows, fields) {
      if (err) {
        res.send(generator.message(err.message));
      } else {
        var lists = [];
        rows.forEach(function (row) {
          lists.push({
            id: row.ModuleID,
            parent: row.ModuleParent,
            name: base64.encode(row.ModuleName),
            module: base64.encode(row.ModulePackage),
            method: base64.encode(row.ModuleInitMethod),
            icon: row.ModuleIcon,
            url: base64.encode(row.ModulePage),
            args: base64.encode(row.ModuleArgs),
            leave: base64.encode(row.ModuleDestory)
          });
          row.ModuleName = base64.encode(row.ModuleName);
        });
        res.send(generator.data({ "list": lists }));
      }
    });
  }
};
