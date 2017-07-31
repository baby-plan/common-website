define('cfgs', ['jquery'], function ($) {
  let cfgs = {
    options: {}
  };
  /* 系统模块定义
    说明：
        1. parent   表示模块父级，若为000则视为根目录。
        2. name     表示模块名称，即菜单名称
        3. icon     表示模块图标，即菜单图标
        4. callback 表示回调函数，即菜单点击后执行的脚本内容。
            备注:
            1. $P 表示插件对象，调用init方法
                例如：$P.file = App.plugins.file.init();
            2. $D 表示构造数据字典对象
                例如：$D/activitytype = App.plugins.dict.Package('activitytype','活动类型')，其中活动类型为模块名称。
            3. $M 表示模块对象
                例如：$M.profile = App.modules.profile();
        5. url      表示模块路径，即菜单点击后打开的地址。

     */
  cfgs.modules = {
    "A00000": {
      "parent": "000",
      "name": "监控中心",
      "icon": "fa fa-tachometer",
      "module": "monitor"
    },
    "B00000": {
      "parent": "000",
      "name": "系统维护",
      "icon": "fa fa-gears",
      "module": "operation"
    },
    "C00000": {
      "parent": "000",
      "name": "设置中心",
      "icon": "fa fa-cog",
      "module": "setting"
    },
    // "F00000": {
    //   "parent": "000",
    //   "name": "文件中心",
    //   "icon": "fa fa-cog",
    //   "module": "fs"
    // }
  };
  /** 文本相关参数设置 */
  cfgs.options.texts = {
    "btn_add": " <i class=\"fa fa-plus\"></i> 新增 ",
    "btn_edit": "<i class=\"fa fa-pencil\"></i> 编辑 ",
    "btn_search": "<i class=\"fa fa-search\"></i> 查询 ",
    "btn_reset": "<i class=\"fa fa-refresh\"></i> 重置 ",
    "btn_remove": " <i class=\"fa fa-trash-o\"></i> 删除 ",
    "btn_refresh": " <i class=\"fa fa-refresh\"></i> 刷新 ",
    "btn_back": "<i class=\"fa fa-arrow-circle-left\"></i> 返回 ",
    "btn_cancel": "<i class=\"fa fa-arrow-circle-left\"></i> 取消 ",
    "btn_save": " 保存 <i class=\"fa fa-arrow-circle-right\"></i> ",
    "btn_details": " <i class=\"fa fa-align-justify\"></i> 详情 ",
    "btn_priv": " <i class=\"fa fa-arrow-circle-left\"></i> 上一步 ",
    "btn_next": " 下一步 <i class=\"fa fa-arrow-circle-right\"></i> "
  };
  /** 样式相关参数设置 */
  cfgs.options.styles = {
    "btn_default": "btn btn-info",
    "btn_back": "btn btn-danger",
    "btn_save": "btn btn-success",
    "btn_reset": "btn btn-warning",
    "btn_next": "btn btn-success",
    "btn_priv": "btn btn-danger"
  };
  /** 请求相关参数设置 */
  cfgs.options.request = {
    /* 设置AJAX请求超时时间:单位毫秒*/
    "timeout": 5000
  };
  /** 当前页面选项 */
  cfgs.pageOptions = {
    /**  */
    "menus": [],
    /**  */
    "items": [],
    /** 当前选中的菜单 */
    "currentmenu": null,
    /** 最后一次分页数据请求 */
    "requestOptions": {},
    /** 最后一次请求分页数据 */
    "buffer": {},
    /** 是否读取缓存数据 */
    "fromCache": false
  };
  return cfgs;
});