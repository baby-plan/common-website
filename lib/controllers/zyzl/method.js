
module.exports = {
  "rootpath": "/api/method/",
  "description": "模块功能管理",
  "mapping": {
    "default": { "description": "通过查询条件筛选，返回经过分页处理的模块功能列表。" },
    "insert": { "description": "新增一个模块功能" },
    "update": { "description": "修改模块功能详细信息" },
    "delete": { "description": "删除一个模块功能" }
  },
  "entity": {
    "table": "methodinfo",
    "columns": [
      { "name": "methodid", "caption": "功能编号", "primary": true, "filter": "like" },
      { "name": "methodname", "caption": "功能名称", "filter": "like", "requid": true },
      { "name": "remark", "caption": "功能描述" },
    ]
  }
};