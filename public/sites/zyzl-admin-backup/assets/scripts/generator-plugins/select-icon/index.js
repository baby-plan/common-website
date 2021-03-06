define([
  'cfgs',
  'core/core-modules/framework.form'
], function (cfgs, form) {
  let module = {
    "define": {
      "name": "select-icon"
    }
  };
  /**
   * 模型
   * 筛选条件、表格项、编辑项，校验内容，
   */

  /** 处理 网格显示 */
  module.grid = (column, tr, value) => {
    // 图标类型
    form.appendEmpty(tr)
      .append($("<i></i>").addClass(value))
      .append(" " + value);
  };

  /** 处理 查询条件 */
  module.filter = (column, labelContainer, valueContainer) => {
    labelContainer.append(column.text);

    var ctrl = $('<input/>')
      .addClass('form-control')
      .attr('type', 'text')
      .attr('id', column.name)
      .attr('name', column.name)
      .attr('placeholder', '请输入' + column.text + '...');
    valueContainer.append(ctrl);
  };

  /** 处理 数据编辑 */
  module.editor = (column, value, labelContainer, valueContainer) => {
    $("#" + column.name).attr("data-value", value);
  };

  /** 处理 数据有效性验证 */
  module.valid = () => {

  };

  /** 处理 对象销毁 */
  module.destroy = () => {

  }

  return module;
});