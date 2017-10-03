
module.exports = {
  "rootpath": "/api/organization/",
  "description":"机构管理",
  "mapping": {
    "default": { "description": "获取培训机构列表" },
    "insert": { "description": "新增培训机构" },
    "update": { "description": "修改培训机构" },
    "delete": { "description": "删除培训机构" }
  },
  "entity": {
    "table": "object_organization",
    "columns": [
      { "name": "id","caption":"学校编号", "primary": true },
      { "name": "name","caption":"机构名称", "base64": true, "requid": true, "filter": "like" },
      { "name": "type","caption":"机构类型", "filter": "multiple", "requid": true },
      { "name": "addr", "base64": true, "requid": true, "filter": "like" },
      { "name": "telphone", "filter": "like" },
      { "name": "describe", "base64": true, "filter": true },
      { "name": "jointime", "filter": "daterange" },
      { "name": "imgs" }
    ]
  }
};