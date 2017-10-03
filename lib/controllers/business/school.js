
module.exports = {
  "rootpath": "/api/school/",
  "description":"学校管理",
  "mapping": {
    "default": { "description": "获取学校列表" },
    "insert": { "description": "新增学校" },
    "update": { "description": "修改学校" },
    "delete": { "description": "删除学校" }
  },
  "entity": {
    "table": "object_school",
    "columns": [
      { "name": "id","caption":"学校编号", "primary": true },
      { "name": "name","caption":"学校名称", "base64": true, "requid": true, "filter": "like" },
      { "name": "type","caption":"学校类型", "filter": "multiple", "requid": true },
      { "name": "addr","caption":"学校地址", "base64": true, "requid": true, "filter": "like" },
      { "name": "telphone","caption":"联系电话", "filter": "like" },
      { "name": "describe","caption":"学校简介", "base64": true, "filter": true },
      { "name": "jointime","caption":"加入时间", "filter": "daterange" },
      { "name": "imgs","caption":"图片" }
    ]
  }
};