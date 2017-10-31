define(['cfgs', 'API', 'core/core-modules/framework.form'], function (cfgs, api, form) {
  let module = {
    "define": {
      "name": "select-merchant"
    }
  };
  let generator;
  module.init = (_generator) => {
    generator = _generator;
  };

  /** 处理 网格显示
   * @param {JSON} column 字段定义
   * @param {Element} tr 当前行容器TR
   * @param {string} value 字段值
   * @returns
   */
  module.grid = (column, tr, value) => {

  };

  /** 处理 查询条件
   * @param {JSON} column 字段定义
   * @param {Element} labelContainer 标签容器
   * @param {Element} valueContainer 内容输入容器
   * @returns
   */
  module.filter = (column, labelContainer, valueContainer) => {

  };

  // #region editor
  var onOpenSelector = function () {
    form.openWidow({
      'url': cfgs.listpage,
      'title': '选择商户',
      'width': '800px',
      'onshow': function () {
        var options = {
          "apis": {
            "list": api.merchant.datas,
          },
          "actions": { "select": false, "preview": false, "export": false },
          "columns": [
            { "name": "_index", "text": "序号" },
            { "name": "mch_name", "text": "商户名称", "edit": true, "filter": true },
            { "name": "store_name", "text": "店铺名称", "edit": true, "filter": true },
            { "name": "user_name", "text": "用户名", "edit": true, "filter": true },
            { "name": "store_phone", "text": "联系电话", "edit": true },
            { "name": "store_addr", "text": "详细地址", "edit": true, "overflow": 15 },
            { "name": "create_time", "text": "创建时间", "type": "datetime" },
          ]
        };
        
        generator.build(options);
      }
    });
  }
  // #endregion // #region editor

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
      .attr('readonly', true)
      .attr('placeholder', '请选择' + column.text + '...');

    valueContainer.append(
      $('<div/>')
        .addClass('input-group')
        .append(ctrl)
        .append(
        $('<span/>')
          .addClass('input-group-addon')
          .append('选择商户')
        )
        .on('click', onOpenSelector)
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
    $("#" + column.name, parent).val(value);
  };

  /** 处理 数据有效性验证 */
  module.valid = () => {

  };

  /** 处理 对象销毁 */
  module.destroy = () => {

  }

  return module;
});