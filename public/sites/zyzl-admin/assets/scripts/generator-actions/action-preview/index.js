define(['core/core-modules/framework.form', 'core/core-modules/framework.table'], function (form, table) {

  var options;
  /** 查看详情按钮时间处理程序 */
  var execute_action = function () {
    if ($(this).attr('disabled')) {
      return;
    }
    if ($(this).data('custom')) {
      return;
    }
    var data = table.getSelect();
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
  }
  return {
    "define": {
      "name": "action-preview"
    },
    /** 加载插件：打开详情界面
     * @param {JSON} data 详情展示所需要的数据内容
     * @returns 
     */
    "init": function (action, actionContainer, actionOption) {
      options = actionOption;
      let button = form.appendAction(actionContainer, 'btn-' + action, execute_action);
      if (actionOption.mulit) {
        button.addClass("qdp-mulit");
      } else {
        button.addClass("qdp-single");
      }
    },
    /** 卸载插件 */
    "destroy": function () {

    }
  };

});