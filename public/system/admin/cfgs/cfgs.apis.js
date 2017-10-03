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
/** 机构管理 */
API.organization = {
  /** API:机构分页数据*/
  "datas": server + "organization/",
  /** API:添加机构F数据*/
  "add": server + "organization/add",
  /** API:更新机构数据*/
  "update": server + "organization/update",
  /** API:删除机构数据*/
  "remove": server + "organization/delete"
}

/** 学校管理 */
API.school = {
  /** API:学校分页数据*/
  "datas": server + "school/",
  /** API:添加学校数据*/
  "add": server + "school/add",
  /** API:更新学校数据*/
  "update": server + "school/update",
  /** API:删除学校数据*/
  "remove": server + "school/delete"
}

/** 活动相关参数设置 */
API.activity = {
  /** API:活动分页数据*/
  "datas": server + "activity/",
  /** API:添加活动数据*/
  "add": server + "activity/add",
  /** API:更新活动数据*/
  "update": server + "activity/update",
  /** API:删除活动数据*/
  "remove": server + "activity/delete"
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
