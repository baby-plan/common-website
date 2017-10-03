
module.exports = {
  "rootpath": "/api/activity/",
  "description": "活动管理",
  "mapping": {
    "default": { "description": "通过查询条件筛选，返回经过分页处理的活动列表。" },
    "insert": { "description": "新增一个活动" },
    "update": { "description": "修改活动详细信息" },
    "delete": { "description": "删除一个活动" }
  },
  "entity": {
    "table": "object_activity",
    "columns": [
      { "name": "id", "caption": "编号", "primary": true },
      { "name": "name", "caption": "活动名称", "base64": true, "filter": "like", "requid": true },
      { "name": "price", "caption": "报名费用", "filter": true, "requid": true },
      { "name": "describe", "caption": "活动介绍", "base64": true, "filter": true },
      { "name": "endtime", "caption": "结束时间", "requid": true, "filter": "daterange" },
      { "name": "begintime", "caption": "开始时间", "requid": true, "filter": "daterange" },
      { "name": "imgs", "caption": "图片列表", "filter": true },
      { "name": "person", "caption": "成人数量", "filter": true, "requid": true },
      { "name": "children", "caption": "孩子数量", "filter": true, "requid": true },
      { "name": "type", "caption": "活动类型", "filter": true, "requid": true },
      { "name": "sender", "caption": "活动发起者", "default": (req, res) => { return req.session.user; } },
      { "name": "sendertype", "caption": "发起者类型", "default": (req, res) => { return "self"; } }
    ]
  }
};