module.exports = {
  "rootpath": "/api/service/",
  "description": "商户服务项目信息管理",
  "mapping": {
    "default": { "description": "通过查询条件筛选，返回经过分页处理的商户服务项目信息列表。" },
    "insert": { "description": "新增一个商户服务项目信息" },
    "update": { "description": "修改一个商户服务项目信息" },
    "delete": { "description": "删除一个商户服务项目信息" },
  },

  "entity": {
    "table": "ym_merchant_service",
    "columns": [
      { "name": "id", "caption": "服务项目编号", "primary": true, "uuid": true },
      { "name": "mch_id", "caption": "商户编号", "filter": true, "requid": true },
      { "name": "nanme", "caption": "服务项目名称", "filter": true },
      { "name": "type", "caption": "服务类型", "default": () => { return "0"; } },
      { "name": "status", "caption": "服务状态", "filter": true, "default": () => { return "0"; } },
      { "name": "service_type", "caption": "服务类别", "filter": true, "requid": true },
      { "name": "car_type", "caption": "服务车型", "filter": true, "requid": true },
      { "name": "computing_mode", "caption": "计费方式", "default": () => { return "0"; } },
      { "name": "price", "caption": "单价", "default": () => { return "0"; } },
      { "name": "contract_discount", "caption": "签约折扣", "requid": true },
      { "name": "sell_discount", "caption": "销售折扣", "requid": true },
      { "name": "discount_price", "caption": "折后价", "requid": true },
      { "name": "creator", "caption": "创建者", "insertdefault": (req) => { return req.session.user; } },
      { "name": "create_time", "caption": "创建时间", "insertdefault": () => { return new Date().getTime() / 1000; } },
      { "name": "last_modify_time", "caption": "最后修改时间", "default": () => { return new Date().getTime() / 1000; } },
      { "name": "publish_status", "caption": "发布状态", "filter": true, "default": () => { return "0"; } },
      { "name": "audit_status", "caption": "审核状态", "filter": true, "default": () => { return "0"; } },
    ]
  },
};