define([
  'core/core-modules/framework.row'
], function (row) {
  let module = {};
  /**
   * 模型
   * 筛选条件、表格项、编辑项，校验内容，
   */

  /** 处理 网格显示 */
  module.grid = (column, tr, value, totalindex) => {
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
      row.addText(tr, text).attr('title', sourceText);
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

  /** 处理 获取筛选结果 */
  module.getFilter = (column) => {
    var value = $("#" + column.name).val();
    if (!value || value == "") {
      return;
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