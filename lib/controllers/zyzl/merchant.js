let { generator, base64, db } = require('../../core/framework');
module.exports = {
  "rootpath": "/api/merchant/",
  "description": "商户管理",
  "mapping": {
    "default": { "description": "通过查询条件筛选，返回经过分页处理的商户信息列表。" },
    "insert": { "description": "新增一个商户信息" },
    "update": { "description": "修改一个商户信息" },
    "delete": { "description": "删除一个商户信息" },
    "all": { "description": "获取全部商户名称及编号列表" },
  },
  "entity": {
    "table": "ym_merchant",
    "columns": [
      { "name": "id", "caption": "商户编号", "primary": true, "uuid": true },
      { "name": "mch_name", "caption": "商户名称", "filter": "like", "requid": true },
      { "name": "store_name", "caption": "店铺名称", "filter": true },
      { "name": "photo_url", "caption": "封面图片", },
      { "name": "mch_phone", "caption": "联系电话", },
      { "name": "mch_addr", "caption": "商户地址", },
      { "name": "province_code", "caption": "省份代码" },
      { "name": "city_code", "caption": "城市代码" },
      { "name": "county_code", "caption": "区县代码" },
      { "name": "description", "caption": "商户描述", },
      { "name": "poi_id", "caption": "页面描述", },
      { "name": "signatory", "caption": "签约人", },
      { "name": "location_lon", "caption": "经度" },
      { "name": "location_lat", "caption": "纬度" },
      { "name": "creator", "caption": "创建者", "insertdefault": (req, res) => { return req.session.user; } },
      { "name": "create_time", "caption": "创建时间", "insertdefault": (req, res) => { return new Date().getTime() / 1000; } },
      { "name": "last_modify_time", "caption": "最后修改时间", "default": (req, res) => { return new Date().getTime() / 1000; } },
      { "name": "publish_status", "caption": "发布状态", "filter": true, "default": (req, res) => { return "0"; } },
      { "name": "audit_status", "caption": "审核状态", "filter": true, "default": (req, res) => { return "0"; } },
    ]
  },
  "all": (req, res) => {
    var sql = 'SELECT id,mch_name  from ym_merchant';
    var params = [];
    db.query(sql, params, function (err, rows, fields) {
      if (err) {
        res.send(generator.message(err.message));
      } else {
        rows.forEach(function (row) {
          row.mch_name = base64.encode(row.mch_name);
        });
        res.send(generator.data({ "list": rows }));
      }
    });
  }
};