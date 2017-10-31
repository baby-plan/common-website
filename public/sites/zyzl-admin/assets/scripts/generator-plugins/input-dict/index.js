define([
  "core/core-modules/framework.form",
  "core/core-modules/framework.dict"
], function (form, dict) {
  let module = {
    "define": {
      "name": "input-dict"
    }
  };

  /** 处理 网格显示
   * @param {JSON} column 字段定义
   * @param {Element} tr 当前行容器TR
   * @param {string} value 字段值
   * @returns
   */
  module.grid = (column, tr, value) => {
    form.appendDictText(tr, column.dict, value, column.multiple);
  };

  /** 处理 查询条件
   * @param {JSON} column 字段定义
   * @param {Element} labelContainer 标签容器
   * @param {Element} valueContainer 内容输入容器
   * @returns
   */
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

  /** 处理 数据编辑
   * @param {JSON} column 字段定义
   * @param {Element} labelContainer 标签容器
   * @param {Element} valueContainer 内容输入容器
   * @returns
   */
  module.editor = (column, labelContainer, valueContainer) => {
    var ctrl = $('<select/>')
      .addClass('form-control')
      .attr('id', column.name)
      .attr('name', column.name);
    if (column.multiple) {
      ctrl.attr('multiple', true);
    }
    valueContainer.append(ctrl);
    form.initDict(
      column.dict,
      ctrl,
      null,
      column.multiple
    );
  };

  /** 处理 设置内容
   * @param {JSON} column 字段定义
   * @param {string} value 字段的值
   * @param {JSON} entity 字段所属对象
   * @param {Element} parent 字段控件容器
   * @returns
   */
  module.setValue = (column, value, entity, parent) => {
    let ctrl = $('#' + column.name, parent)
    if (ctrl.length == 0) {
      return;
    }
    if (ctrl.eq(0)[0].tagName == "SELECT") {
      ctrl.val(value).trigger("change");
    } else {
      ctrl.val(dict.getText(column.dict, value));
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