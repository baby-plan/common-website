define([
  "core/core-modules/framework.form",
  'core/core-modules/framework.row'
], function (form, row) {
  let module = {};
  /**
   * 模型
   * 筛选条件、表格项、编辑项，校验内容，
   */


  /** 处理 网格显示 */
  module.grid = (column, tr, value) => {
    row.addDictText(tr, column.dict, value, column.multiple);
  };

  /** 处理 查询条件 */
  module.filter = (column, labelContainer, valueContainer) => {
    labelContainer.append(column.text);

    var ctrl = $('<select/>')
      .addClass('form-control')
      .attr('id', column.name)
      .attr('name', column.name);
    if (column.multiple) {
      ctrl.attr('multiple', true);
    }
    valueContainer.append(ctrl);

    form.initDict(column.dict, ctrl, null);
  };

  /** 处理 获取筛选结果 */
  module.getFilter = (column) => {
    var value = $("#" + column.name).val();
    if (!value || value == "") {
      return;
    }
    if (column.multiple) {
      return value.join();
    } else {
      return value;
    }
  };

  /** 处理 数据编辑 */
  module.editor = (column, labelContainer, valueContainer, value) => {
    labelContainer.append(column.text);

    var ctrl = $('<input/>')
      .addClass('form-control')
      .attr('type', 'text')
      .attr('id', column.name)
      .attr('name', column.name)
      .attr('placeholder', '请输入' + column.text + '...');

    if (value) {
      ctrl.val(value);
      if (column.primary) {
        ctrl.attr("readonly", true);
      }
    }

    if (column.label) {
      valueContainer.append(
        $('<div/>')
          .addClass('input-group')
          .append(ctrl)
          .append(
          $('<span/>')
            .addClass('input-grop-addon')
            .append(column.label)
          )
      );
    } else {
      valueContainer.append(ctrl);
    }

  };

  /** 处理 数据有效性验证 */
  module.valid = () => {

  };

  /** 处理 对象销毁 */
  module.destroy = () => {

  }

  return module;
});