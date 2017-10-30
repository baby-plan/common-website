﻿define([], function () {
  const server = "http://" + window.location.host + "/api/";
  var API = {};
  /** API: */
  API.upload = {
    /** API: */
    "api": server + "upload"
  }
  /** API: */
  API.moritor = {
    /** API: */
    "serverstatusapi": server + "environment"
  }
  /** API: */
  API.datadict = {
    /** API:字典项分页数据*/
    "datas": server + "dict/?dictkey={dictkey}",
    /** API:字典项分页数据*/
    "dataallapi": server + "dict/all",
    /** API:添加字典项数据*/
    "add": server + "dict/add?dictkey={dictkey}",
    /** API:更新字典项数据*/
    "update": server + "dict/update?dictkey={dictkey}",
    /** API:删除字典项数据*/
    "remove": server + "dict/delete?dictkey={dictkey}"
  }
  /** 登录模块相关设置 */
  API.login = {
    /** API:修改密码接口*/
    "changepwdapi": server + "account/changepwd",
    /** API:修改信息接口*/
    "changeinfoapi": server + "account/changeinfo",
    /** API:登录接口*/
    "loginapi": server + "account/login",
    /** API:注销接口*/
    "logoutapi": server + "account/logout",
    /** 用户TOKEN保存COOKIE关键字*/
    "token_cookie": "htyx_user_token",
    /** 用户数据保存COOKIE关键字*/
    "token_json_cookie": "htyx_user_json"
  }
  /** 系统管理 - 角色管理 */
  API.role = {
    /** API:角色分页列表*/
    "datas": server + "roles/",
    /** API:添加角色*/
    "add": server + "roles/add",
    /** API:更新角色*/
    "update": server + "roles/update",
    /** API:删除角色*/
    "remove": server + "roles/delete",
    /** API:角色无分页列表*/
    "alldatasapi": server + "roles/all",
  }
  /** 系统管理 - 用户管理 */
  API.admin = {
    /** API:用户分页数据*/
    "datas": server + "users/",
    /** API:添加用户数据*/
    "add": server + "users/add",
    /** API:更新用户数据*/
    "update": server + "users/update",
    /** API:删除用户数据*/
    "remove": server + "users/delete"
  }
  API.logs = {
    /** API:操作日志分页*/
    "datas": server + "logs/",
    /** API:获取日志类型列表*/
    "typesapi": server + "logs/types"
  }
  /** 系统设置项查询 */
  API.options = {
    /** API:获取参数设置*/
    "getoptionapi": server + "settings/read",
    /** API:保存参数设置*/
    "setoptionapi": server + "settings/save",
    /** API:*/
    "getapi": server + "settings"
  }
  /** 商户管理 */
  API.merchant = {
    /** API:商户分页数据*/
    "datas": server + "merchant/",
    /** API:添加商户数据*/
    "add": server + "merchant/add",
    /** API:更新商户数据*/
    "update": server + "merchant/update",
    /** API:删除商户数据*/
    "remove": server + "merchant/delete",
    /** API:商户无分页列表*/
    "alldatasapi": server + "merchant/all",
    /** API:发布商户数据*/
    "publish": server + "merchant/publish",
    /** API:审核商户数据*/
    "check": server + "merchant/check",
  }
  /** 商户服务项目管理 */
  API.service = {
    /** API:商户服务项目分页数据*/
    "datas": server + "service/",
    /** API:添加商户服务项目数据*/
    "add": server + "service/add",
    /** API:更新商户服务项目数据*/
    "update": server + "service/update",
    /** API:删除商户服务项目数据*/
    "remove": server + "service/delete"
  }
  /** 号码段管理 */
  API.coderange = {
    /** API:号码段分页数据*/
    "datas": server + "coderange/",
    /** API:添加号码段数据*/
    "add": server + "coderange/add",
    /** API:更新号码段数据*/
    "update": server + "coderange/update",
    /** API:删除号码段数据*/
    "remove": server + "coderange/delete"
  }
  return API;
});