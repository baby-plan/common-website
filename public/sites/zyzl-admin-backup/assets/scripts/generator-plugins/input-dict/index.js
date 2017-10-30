define([
  "core/core-modules/framework.form",
  "core/core-modules/framework.dict"
], function (form, dict) {
  let module = {
    "define": {
      "name": "input-dict"
    }
  };
  /**
   * 模型
   * 筛选条件、表格项、编辑项，校验内容，
   */


  /** 处理 网格显示 */
  module.grid = (column, tr, value) => {
    form.appendDictText(tr, column.dict, value, column.multiple);
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

  /** 处理 预览 */
  module.preview = (column, value, labelContainer, valueContainer) => {
    labelContainer.append(column.text);

    let text;
    if (column.dict) {
      text = dict.getText(column.dict, value);
    } else {
      text = value;
    }
    $('<input/>')
      .attr('readonly', true)
      .addClass('form-control')
      .val(text)
      .appendTo(valueContainer);
  }

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
  module.editor = (column, value, labelContainer, valueContainer) => {
    form.initDict(
      column.dict,
      $("#" + column.name),
      value,
      column.multiple
    );

  };

  /** 处理 数据有效性验证 */
  module.valid = () => {

  };

  /** 处理 对象销毁 */
  module.destroy = () => {

  }

  return module;
});