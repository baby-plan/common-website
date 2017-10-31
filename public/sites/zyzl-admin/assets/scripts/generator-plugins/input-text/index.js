define(['core/core-modules/framework.form'], function (form) {
  let module = {
    "define": {
      "name": "input-text"
    }
  };

  /** 处理 网格显示
   * @param {JSON} column 字段定义
   * @param {Element} tr 当前行容器TR
   * @param {string} value 字段值
   * @returns
   */
  module.grid = (column, tr, value, totalindex, index) => {
    var text;
    var sourceText;

    if (column.name == '_index') {
      sourceText = text = totalindex;
    } else if (column.primary) {
      if (column.display) {
        sourceText = text = value;
      }
    } else if (column.overflow != undefined &&
      column.overflow > 0 &&
      value &&
      value.length > column.overflow) {
      text = value.substring(0, column.overflow) + "...";
      sourceText = value;
    } else {
      if (!value) {
        value = '';
      }
      sourceText = text = value;
    }
    if (text != undefined) {
      form.appendText(tr, text).attr('title', sourceText);
      if (column.name == '_index') {
        tr.attr('data-id', index);
      }
    }
  };

  /** 处理 查询条件
   * @param {JSON} column 字段定义
   * @param {Element} labelContainer 标签容器
   * @param {Element} valueContainer 内容输入容器
   * @returns
   */
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

  /** 处理 预览 */
  module.preview = (column, value, labelContainer, valueContainer) => {
    labelContainer.append(column.text);
    let text = value;
    if (column.label) {
      text += ' ' + column.label;
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
    return value;
  };

  /** 处理 数据编辑
   * @param {JSON} column 字段定义
   * @param {Element} labelContainer 标签容器
   * @param {Element} valueContainer 内容输入容器
   * @returns
   */
  module.editor = (column, labelContainer, valueContainer) => {

    var ctrl = $('<input/>')
      .addClass('form-control')
      .attr('type', 'text')
      .attr('id', column.name)
      .attr('name', column.name)
      .attr('placeholder', '请输入' + column.text + '...');

    if (column.label) {
      valueContainer.append(
        $('<div/>')
          .addClass('input-group')
          .append(ctrl)
          .append($('<span/>').addClass('input-group-addon').html(column.label))
      );
    } else {
      valueContainer.append(ctrl);
    }

  };

  /** 处理 设置内容
   * @param {JSON} column 字段定义
   * @param {string} value 字段的值
   * @param {JSON} entity 字段所属对象
   * @param {Element} parent 字段控件容器
   * @returns
   */
  module.setValue = (column, value, entity, parent) => {
    $("#" + column.name, parent).val(value);
    if (column.primary && value) {
      $("#" + column.name, parent).attr("readonly", true);
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