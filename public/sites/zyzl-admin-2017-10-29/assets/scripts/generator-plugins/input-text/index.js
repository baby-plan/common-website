define([
  'core/core-modules/framework.form',
  'core/core-modules/framework.base64'
], function (form, base64) {
  let module = {
    "define": {
      "name": "input-text"
    }
  };


  /** 处理 网格显示 */
  module.grid = (column, tr, value, totalindex, index) => {
    var text;
    var sourceText;

    if (column.base64) {
      value = base64.decode(value);
    }

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

  /** 处理 预览 */
  module.preview = (column, value, labelContainer, valueContainer) => {
    labelContainer.append(column.text);
    let text = value;
    if (column.base64) {
      text = base64.decode(value);
    }

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

    if (value && column.base64) {
      value = base64.encode(value);
    }
    return value;
  };

  /** 处理 数据编辑 */
  module.editor = (column, value, labelContainer, valueContainer) => {
    $("#" + column.name).val(value);
    if (column.primary && value) {
      $("#" + column.name).attr("readonly", true);
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