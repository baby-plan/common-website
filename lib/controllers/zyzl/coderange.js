module.exports = {
  "rootpath": "/api/coderange/",
  "description": "号码段管理",
  "mapping": {
    "default": { "description": "通过查询条件筛选，返回经过分页处理的号码段列表。" },
    "insert": { "description": "新增一个号码段" },
    "update": { "description": "修改号码段详细信息" },
    "delete": { "description": "删除一个号码段" }
  },
  "entity": {
    "table": "codedefine",
    "columns": [
      { "name": "codeid", "caption": "号段编号", "primary": true },
      { "name": "codename", "caption": "号段名称", "filter": "like", "requid": true },
      { "name": "provinceid", "caption": "所属省代码", "filter": true, "requid": true },
      { "name": "cityid", "caption": "所属市代码", "filter": true, "requid": true },
      { "name": "state", "caption": "状态", "filter": true, "default": (req, res) => { return "0"; } },
    ]
  }
};