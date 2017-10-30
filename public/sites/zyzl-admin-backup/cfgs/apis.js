define([], function () {
  const img_server = "http://" + window.location.host + "/";
  const server = img_server + "api/";

  var API = {
    page: {
      navigation: "views/master/navigation.html",
    }
  };
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
  API.profile = {
    /** API: */
    "listapi": server + "article/",
    /** API:用户详细信息数据*/
    "info": server + "users/info"
  }

  /** API: */
  API.files = {
    /** API: */
    "listapi": server + "files/",
    /** API: */
    "upload": server + "files/upload",
    /** API: */
    "update": server + "files/update",
    /** API: */
    "delete": server + "files/delete",
    /** API: */
    "getapi": img_server + "file/?id="
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
    /** PAGE:登录页面*/
    "page": "views/master/login.html",
    /** PAGE:系统主页面*/
    "mainpage": "views/master/main.html",
    /** PAGE:修改密码页面*/
    "changepwdpage": "views/master/changepwd.html",
    /** PAGE:修改信息页面*/
    "changeinfopage": "views/master/changeinfo.html",
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
    /** PAGE:角色信息编辑*/
    "editpage": "views/role/roleedit.html"
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
    /** PAGE:商户信息编辑页面 */
    "editpage": "views/merchant/editor.html",
    /** PAGE:商户详情页面 */
    "detailPage": "views/merchant/detail.html"
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
  /** 模块功能管理 */
  API.method = {
    /** API:分页数据*/
    "datas": server + "method/",
    /** API:添加数据*/
    "add": server + "method/add",
    /** API:更新数据*/
    "update": server + "method/update",
    /** API:删除数据*/
    "remove": server + "method/delete"
  }
  /** 菜单管理 */
  API.module = {
    /** API:分页数据*/
    "datas": server + "module/",
    /** API:添加数据*/
    "add": server + "module/add",
    /** API:更新数据*/
    "update": server + "module/update",
    /** API:删除数据*/
    "remove": server + "module/delete",
    "parents": server + "module/parentall",
    "all": server + "module/modules"
  }

  /** 评论相关参数设置 */
  API.comment = {
    /** API:评论分页数据*/
    "datas": server + "comment/",
    /** API:添加评论数据*/
    "add": server + "comment/add",
    /** API:更新评论数据*/
    "update": server + "comment/update",
    /** API:删除评论数据*/
    "remove": server + "comment/delete",
    /** PAGE:追加评论操作页面 */
    "appendpage": "views/action/comment.html"
  }
  return API;
});