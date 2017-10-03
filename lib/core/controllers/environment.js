let {
  generator
} = require('../framework');
module.exports = {
  "rootpath": "/api/environment/",
  "description": "服务器环境",
  "mapping": {
    "default": {
      "description": "获取系统运行环境",
      "rule": ["asd"],
      "auth": false
    }
  },
  "default": (req, res) => {
    var os = require("os");
    var json = {};
    json.temp = os.tmpdir();
    json.endianness = os.endianness();
    json.hostname = os.hostname();
    json.type = os.type();
    json.platform = os.platform();
    json.arch = os.arch();
    json.release = os.release();
    json.uptime = os.uptime();
    json.loadavg = os.loadavg();
    json.totalmem = os.totalmem();
    json.freemem = os.freemem();
    json.cpus = os.cpus();
    json.networkInterfaces = os.networkInterfaces();
    res.send(generator.data(json));
  }
}