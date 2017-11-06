define([
  'cfgs',
  'core/core-modules/framework.form',
  'core/core-modules/framework.util'
], function (cfgs, form, util) {
  let module = {
    "define": {
      "name": "input-date"
    }
  };
  /**
   * 模型
   * 筛选条件、表格项、编辑项，校验内容，
   */

  /** 处理 网格显示
   * @param {JSON} column 字段定义
   * @param {Element} tr 当前行容器TR
   * @param {string} value 字段值
   * @returns
   */
  module.grid = (column, tr, value) => {
    // 显示时间类型
    var format;
    if (column.type == 'date') {
      format = cfgs.options.defaults.dateformat2;
    } else if (column.type == 'datetime') {
      format = cfgs.options.defaults.datetimeformat;
    }

    form.appendDateText(tr, value, format);
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
      .addClass('form-control form-date')
      .attr('type', 'text')
      .attr('id', column.name)
      .attr('name', column.name)
      .attr('placeholder', '请选择' + column.text + '...');
    valueContainer.append(ctrl);
  };

  /** 处理 预览 */
  module.preview = (column, value, labelContainer, valueContainer) => {
    labelContainer.append(column.text);
    let format;
    if (column.type == 'date') {
      format = cfgs.options.defaults.dateformat2;
    } else if (column.type == 'datetime') {
      format = cfgs.options.defaults.datetimeformat;
    }

    $('<input/>')
      .attr('readonly', true)
      .addClass('form-control')
      .val(util.utcTostring(value, format))
      .appendTo(valueContainer);
  }

  /** 处理 获取筛选结果 */
  module.getFilter = (column) => {
    var value = $("#" + column.name).val();
    if (!value || value == "") {
      return;
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
    var ctrl = $('<input/>')
      .addClass('form-control form-' + column.type)
      .attr('type', 'text')
      .attr('id', column.name)
      .attr('name', column.name)
      .attr('placeholder', '请选择' + column.text + '...');
    valueContainer.append(ctrl);
  };

  /** 处理 设置内容
   * @param {JSON} column 字段定义
   * @param {string} value 字段的值
   * @param {JSON} entity 字段所属对象
   * @param {Element} parent 字段控件容器
   * @returns
   */
  module.setValue = (column, value, entity, parent) => {
    let format;
    if (column.type == 'date') {
      format = cfgs.options.defaults.dateformat2;
    } else if (column.type == 'datetime') {
      format = cfgs.options.defaults.datetimeformat;
    }

    $("#" + column.name, parent).val(
      util.utcTostring(value, format)
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