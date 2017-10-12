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
    'module-order': 'modules/modules.order',
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

    'module-demo-charts': 'modules/demo/charts',
    'map-baidu': 'http://api.map.baidu.com/api?v=2.0&ak=2d12993ce41407db4050140fe342d9ba',

    'map-amap': 'http://webapi.amap.com/maps?v=1.3&key=f0948ced2976d1bcc654eff99d796a32',
    'map-amap-main': 'http://webapi.amap.com/ui/1.0/main.js',
    'map-amap-tool': 'http://webapi.amap.com/demos/js/liteToolbar.js',
    // <script src="http://webapi.amap.com/maps?v=1.3&key=f0948ced2976d1bcc654eff99d796a32"></script>
    // <script src="http://webapi.amap.com/ui/1.0/main.js"></script>
    // <script src="http://webapi.amap.com/demos/js/liteToolbar.js"></script>

    'echarts': '/assets/plugins/echarts/echarts.min',
    'echarts-all': '/assets/plugins/echarts/echarts.all',
    //系统公共引用
    'jquery': '/assets/plugins/jquery.min',
    'jquery.slimscroll': '/assets/plugins/jquery.slimscroll.min',
    'jquery.blockUI': '/assets/plugins/jquery.blockUI.min',
    'jquery.easing': '/assets/plugins/jquery.easing.min',
    'jquery.timeago': '/assets/plugins/jquery.timeago.min',
    'jquery.cookie': '/assets/plugins/jquery.cookie.min',
    'jquery.uniform': '/assets/plugins/uniform/jquery.uniform.min',
    'jquery.fbmodel': '/assets/plugins/jquery.fbmodel',
    'jquery.md5': '/assets/plugins/jQuery.md5',
    'jquery.template': '/assets/plugins/jquery.loadTemplate',
    'jquery.tmpl': '/assets/plugins/jquery-tmpl/jquery.tmpl.min',
    'jquery.tmplPlus': '/assets/plugins/jquery-tmpl/jquery.tmplPlus.min',
    'jquery.peity': '/assets/plugins/peity/jquery.peity.min',
    'bootstrap': '/assets/plugins/bootstrap/js/bootstrap.min',
    'bootbox': '/assets/plugins/bootbox.min',
    'select2': '/assets/plugins/select2/select2',
    'select2-CN': '/assets/plugins/select2/select2_locale_zh-CN',
    'bootstrapValidator': '/assets/plugins/bootstrapValidator/bootstrapValidator.min',
    'moment': '/assets/plugins/bootstrap-daterangepicker/moment.min',
    'bootstrap-daterangepicker': '/assets/plugins/bootstrap-daterangepicker/daterangepicker',

    'bootstrap-datetimepicker': '/assets/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min',
    'bootstrap-datetimepicker-CN': '/assets/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.zh-CN',

    'jstree': '/assets/plugins/jstree/jstree.min',
    'bootstrap-collapse': '/assets/plugins/bootstrap-collapse',

    'codemirror': [
      '/assets/plugins/codemirror/codemirror',
      '/assets/plugins/codemirror/mode/javascript/javascript.js'
    ],
    'ion.rangeSlider': '/assets/plugins/ionRangeSlider/ion.rangeSlider.min',

  },

  shim: {
    'bootstrap': ['jquery'],
    'bootstrap-collapse': ['jquery', 'bootstrap'],
    'bootbox': ['jquery', 'bootstrap'],
    'jquery.template': ['jquery'],
    'jquery.tmpl': ['jquery'],
    'jquery.tmplPlus': ['jquery.tmpl'],
    'jquery.slimscroll': ['jquery'],
    'jquery.blockUI': ['jquery'],
    'jquery.easing': ['jquery'],
    'jquery.timeago': ['jquery'],
    'jquery.cookie': ['jquery'],
    'jquery.uniform': [
      'jquery',
      'css!/assets/plugins/uniform/css/uniform.default.min.css'
    ],
    'jquery.fbmodel': ['jquery'],
    'jquery.md5': ['jquery'],
    'jquery.peity': ['jquery'],
    'select2': [
      'css!/assets/plugins/select2/select2.css',
      'css!/assets/plugins/select2/select2-bootstrap.css'
    ],
    'select2-CN': ['select2'],
    'bootstrap-datetimepicker-CN': ['bootstrap-datetimepicker'],
    'jstree': [
      'css!/assets/plugins/jstree/themes/default/style.min.css'
    ],
    'bootstrapValidator': [
      'css!/assets/plugins/bootstrapValidator/bootstrapValidator.min.css'
    ],
    'bootstrap-daterangepicker': [
      'moment',
      'css!/assets/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css'
    ],
    'bootstrap-datetimepicker': [
      'moment',
      'css!/assets/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css'
    ],
    'ion.rangeSlider': [
      'css!/assets/plugins/ionRangeSlider/ion.rangeSlider.css',
      'css!/assets/plugins/ionRangeSlider/ion.rangeSlider.skinFlat.css'
    ],
    'codemirror': [
      'css!/assets/plugins/codemirror/codemirror.css',
      'css!/assets/plugins/codemirror/ambiance.css'
    ],

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