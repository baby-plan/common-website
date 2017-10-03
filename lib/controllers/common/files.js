let { sqlmethod, generator, base64, db, catalog, uuid, config } = require('../../core/framework'),
  formidable = require('formidable'),
  fs = require('fs'),
  path = require("path");

var entity = {
  "table": "common_files",
  "columns": [
    { "name": "id", "primary": true },
    { "name": "name", "base64": true, "requid": true },
    { "name": "path", "base64": true, "requid": true },
    { "name": "size", "requid": true },
    { "name": "extname", "base64": true, "requid": true }
  ]
}
module.exports = {
  "rootpath": "",
  "description": "文件管理",
  "mapping": {
    "list": { "url": "/api/files", "description": "获取用户拥有的文件列表" },
    "upload": { "url": "/api/upload", "description": "文件上传", "method": "post" },
    "get": { "url": "/file", "description": "根据编号获取文件", "auth": false },
    "update": { "url": "/api/files/update", "description": "修改文件信息" },
    "delete": { "url": "/api/files/delete", "description": "删除文件" }
  },
  "entity": entity,
  "upload": (req, res) => {
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';		//设置编辑
    form.uploadDir = catalog("upload");	 //设置上传目录
    //   form.uploadDir = form.uploadDir + req.session.user + "/";
    form.keepExtensions = true;	 //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
    form.parse(req, function (err, fields, files) {
      if (err) {
        res.send(generator.message(err.message));
      } else {
        var file = files.file;
        var newcatalog = form.uploadDir + req.session.user + "/";
        var extname = path.extname(file.path);
        var avatarName = uuid() + extname;
        if (!fs.existsSync(newcatalog)) {
          fs.mkdirSync(newcatalog);
        }
        var newPath = newcatalog + avatarName;
        fs.renameSync(file.path, newPath);  //重命名
        var sql = "INSERT INTO common_files(name,path,size,extname,owner,date) VALUES(?,?,?,?,?,?)";
        var time = new Date().getTime() / 1000;
        var params = [file.name, newPath, file.size, extname, req.session.user, time];
        db.query(sql, params, function (err, result) {
          if (err) {
            res.send(generator.message(err.message));
          } else {
            res.send(generator.data({ "name": avatarName, "path": newPath.replace("public/", "") }));
          }
        });
      }
    });
  },
  "list": (req, res) => {
    var sql = 'SELECT * FROM `common_files` WHERE `owner`=?';
    var params = [req.session.user];
    db.query(sql, params, function (err, rows, fields) {
      if (err) {
        res.send(generator.message(err.message));
      } else {
        rows.forEach(function (row) {
          row.name = base64.encode(row.name);
          row.path = base64.encode(row.path);
          row.extname = base64.encode(row.extname);
        });
        res.send(generator.data({ "list": rows }));
      }
    });
  },
  "get": (req, res) => {
    var id = req.query.id;
    if (id == undefined) {
      res.send(generator.error("404", "请求的文件不存在"));
      return;
    }
    var sql = "SELECT * FROM `common_files` WHERE `id`=?";
    var params = [id];
    db.query(sql, params, function (err, result) {
      if (err) {
        res.send(generator.message(err.message));
      } else {
        var info = result[0];
        if (info == undefined) {
          res.redirect("/" + config.catalog.upload + "/headshot.png");
        } else {
          res.redirect(info.path.replace(config.catalog.upload, "/avatar/"));
        }
        // res.writeHead('200', { 'Content-Type': 'image/jpeg' });    //写http头部信息
        // var info = result[0];
        // var content = fs.readFileSync(info.path, "binary");
        // res.write(content, "binary");
      }
    });
  }
};