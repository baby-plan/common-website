define(['core/core-modules/framework.ajax',
  'core/core-modules/framework.form',
  'core/core-modules/framework.table',
  'core/core-modules/framework.layout'], function (ajax, form, table, layout) {

    var options;
    var execute_action = function () {
      if ($(this).attr('disabled')) {
        return;
      }
      var primary = $(this).data("args");
      var confirmCallback = function (result) {
        if (!result) {
          return;
        }
        var options = {};
        options[primaryKey] = primary;
        ajax.post(plugin_option.apis.delete, options, function () {
          table.reload();
        });
      };
      dialog.confirm("确定删除记录?", confirmCallback);
    };

    return {
      "define": {
        "name": "action-delete"
      },
      /** 加载插件：打开编辑页面
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