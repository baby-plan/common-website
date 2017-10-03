module.exports = {
  "rootpath": "/api/merchant/",
  "description": "商户管理",
  "mapping": {
    "default": { "description": "通过查询条件筛选，返回经过分页处理的商户信息列表。" },
    "insert": { "description": "新增一个商户信息" },
    "update": { "description": "修改一个商户信息" },
    "delete": { "description": "删除一个商户信息" }
  },
  "entity": {
    "table": "ym_merchant",
    "columns": [
      { "name": "id", "caption": "商户编号", "primary": true },
      { "name": "mch_name", "caption": "商户名称", "base64": true, "filter": "like", "requid": true },
      { "name": "store_name", "caption": "店铺名称", "base64": true, "filter": true },
      { "name": "photo_url", "caption": "封面图片", "base64": true, },
      { "name": "mch_phone", "caption": "联系电话", "base64": true, },
      { "name": "mch_addr", "caption": "商户地址", "base64": true, },
      { "name": "province_code", "caption": "省份代码"},
      { "name": "city_code", "caption": "城市代码" },
      { "name": "county_code", "caption": "区县代码"},
      { "name": "description", "caption": "商户描述", "base64": true, },
      { "name": "poi_id", "caption": "页面描述", "base64": true, },
      { "name": "creator", "caption": "创建者", "base64": true, "insertdefault": (req, res) => { return req.session.user; } },
      { "name": "create_time", "caption": "创建时间", "insertdefault": (req, res) => { return new Date().getTime() / 1000; } },
      { "name": "last_modify_time", "caption": "最后修改时间", "default": (req, res) => { return new Date().getTime() / 1000; } },
      { "name": "publish_status", "caption": "状态", "filter": true, "default": (req, res) => { return "0"; } },
      { "name": "audit_status", "caption": "状态", "filter": true, "default": (req, res) => { return "0"; } },
    ]
  }
};