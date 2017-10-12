require.config({
  baseUrl: 'assets/scripts/',

  map: {
    '*': {
      'css': '/assets/plugins/css.js'
    }
  },

  paths: {

    'QDP': 'core/core',
    'cfgs': '../../cfgs/cfgs',
    'API': '../../cfgs/apis',

    'module-server': 'modules/modules.server',
    'module-common': 'modules/modules.common',
    'module-merchant2': 'modules/modules.merchant',
    'module-options': 'modules/modules.options',
    'module-user-ticket': 'modules/user/tickets',

    'module-user-active': 'modules/user/active.month',
    'module-user-history': 'modules/user/history',

    'module-merchant-active': 'modules/merchant/active.month',
    'module-merchant-success': 'modules/merchant/success.rate',
    'module-merchant-sign': 'modules/merchant/sign',
    'module-merchant-signdetail': 'modules/merchant/sign.detail',
    'module-merchant-history': 'modules/merchant/history',
    'module-merchant': 'modules/merchant/management',
    'module-merchant-service': 'modules/merchant/services',

    'module-partner': 'modules/partner/management',

    'common-module': 'modules/commons/module',
    'common-role': 'modules/commons/role',
    'common-admin': 'modules/commons/admin',
    'common-dict': 'modules/commons/dict',

    'module-order': 'modules/order/search',
    'module-order-report': 'modules/order/report',

    'module-demo-charts': 'modules/demo/charts',

    //系统公共引用
    'jquery': '/assets/plugins/jquery.min',
    'jquery.slimscroll': '/assets/plugins/jquery.slimscroll.min',
    'jquery.blockUI': '/assets/plugins/jquery.blockUI.min',
    'jquery.cookie': '/assets/plugins/jquery.cookie.min',
    'jquery.uniform': '/assets/plugins/uniform/jquery.uniform.min',
    'jquery.fbmodel': '/assets/plugins/jquery.fbmodel',
    'jquery.md5': '/assets/plugins/jQuery.md5',
    'jquery.template': '/assets/plugins/jquery.loadTemplate',
    'jquery.tmpl': '/assets/plugins/jquery-tmpl/jquery.tmpl.min',
    'jquery.tmplPlus': '/assets/plugins/jquery-tmpl/jquery.tmplPlus.min',
    'bootstrap': '/assets/plugins/bootstrap/js/bootstrap.min',
    'bootbox': '/assets/plugins/bootbox.min',
    'select2': '/assets/plugins/select2/select2',
    'select2-CN': '/assets/plugins/select2/select2_locale_zh-CN',
    'bootstrapValidator': '/assets/plugins/bootstrapValidator/bootstrapValidator.min',

    'bootstrap-datetimepicker': '/assets/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min',
    'bootstrap-datetimepicker-CN': '/assets/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.zh-CN',
    // 高德地图引用
    'map-amap': 'http://webapi.amap.com/maps?v=1.3&key=f0948ced2976d1bcc654eff99d796a32',
    'map-amap-main': 'http://webapi.amap.com/ui/1.0/main.js',
    'map-amap-tool': 'http://webapi.amap.com/demos/js/liteToolbar.js',
    // 百度ECharts 引用
    'echarts': '/assets/plugins/echarts/echarts.min',
    'echarts-all': '/assets/plugins/echarts/echarts.all',
  },

  shim: {
    'bootstrap': ['jquery'],
    'bootbox': ['jquery', 'bootstrap'],
    'jquery.template': ['jquery'],
    'jquery.tmpl': ['jquery'],
    'jquery.tmplPlus': ['jquery.tmpl'],
    'jquery.slimscroll': ['jquery'],
    'jquery.blockUI': ['jquery'],
    'jquery.cookie': ['jquery'],
    'jquery.uniform': [
      'jquery',
      'css!/assets/plugins/uniform/css/uniform.default.min.css'
    ],
    'jquery.fbmodel': ['jquery'],
    'jquery.md5': ['jquery'],
    'select2': [
      'css!/assets/plugins/select2/select2.css',
      'css!/assets/plugins/select2/select2-bootstrap.css'
    ],
    'select2-CN': ['select2'],

    'bootstrapValidator': [
      'css!/assets/plugins/bootstrapValidator/bootstrapValidator.min.css'
    ],
    'bootstrap-datetimepicker': [
      '/assets/plugins/bootstrap-daterangepicker/moment.min',
      'css!/assets/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css'
    ],
    'bootstrap-datetimepicker-CN': ['bootstrap-datetimepicker'],

    'map-amap-main': ['map-amap'],
    'map-amap-tool': ['map-amap'],
  }

});

define(['jquery', 'QDP',
  '../../cfgs/modules',
  '../../cfgs/dicts',
  '../../cfgs/powers',
  'plugins/plugins.actions',
  'plugins/plugins-province',
  'plugins/plugins-events',
], function ($, QDP) {
  QDP.Start();
});