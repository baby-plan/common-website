define(['core/core-modules/framework.form'], function (form) {
  return {
    "define": {
      "name": "action-preview"
    },
    /** 加载插件：打开详情界面
     * @param {JSON} data 详情展示所需要的数据内容
     * @returns 
     */
    "init": function (options, data) {
      switch (options.mode) {
        case "modal":
          form.openWidow({
            'url': options.page,
            'title': options.title,
            'width': options.width,
            'height': options.height,
            'onshow': function (parent) {
              if (options.callback && typeof options.callback === 'function') {
                options.callback(data, parent);
              }
            }
          });
          break;
        case "page":
          form.openview({
            'url': options.page,
            'title': options.title,
            'callback': function () {
              if (options.callback && typeof options.callback === 'function') {
                options.callback(data);
              }
            }
          });
          break;
        default:
          break;
      }
    },
    /** 卸载插件 */
    "destroy": function () {

    }
  };

});