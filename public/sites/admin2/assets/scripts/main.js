require.config({
  baseUrl: '',

  map: {
    '*': {
      'css': '/assets/plugins/css.js'
    }
  },

  paths: {
    'jquery': '/assets/plugins/jquery.min',
    'jquery.slimscroll': '/assets/plugins/jquery.slimscroll.min',
    'jquery.blockUI': '/assets/plugins/jquery.blockUI.min',
    'jquery.easing': '/assets/plugins/jquery.easing.min',
    'jquery.timeago': '/assets/plugins/jquery.timeago.min',
    'jquery.cookie': '/assets/plugins/jquery.cookie.min',
    'jquery.uniform': '/assets/plugins/uniform/jquery.uniform.min',
    'jquery.fbmodel': '/assets/plugins/jquery.fbmodel',
    'jquery.md5': '/assets/plugins/jQuery.md5',
    'jquery.tmpl': '/assets/plugins/jquery-tmpl/jquery.tmpl.min',
    'jquery.tmplPlus': '/assets/plugins/jquery-tmpl/jquery.tmplPlus.min',
    'jquery.peity': '/assets/plugins/peity/jquery.peity.min',
    'bootstrap': '/assets/plugins/bootstrap/js/bootstrap.min',
    'bootbox': '/assets/plugins/bootbox.min',
    'select2': [
      '/assets/plugins/select2/select2',
      '/assets/plugins/select2/select2_locale_zh-CN'
    ],
    'bootstrapValidator': '/assets/plugins/bootstrapValidator/bootstrapValidator.min',
    'moment': '/assets/plugins/bootstrap-daterangepicker/moment.min',
    'bootstrap-daterangepicker': '/assets/plugins/bootstrap-daterangepicker/daterangepicker',
    'bootstrap-datetimepicker': [
      '/assets/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min', '/assets/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.zh-CN'
    ],

    'jstree': '/assets/plugins/jstree/jstree.min',
    'bootstrap-collapse': '/assets/plugins/bootstrap-collapse',

    'codemirror': [
      '/assets/plugins/codemirror/codemirror',
      '/assets/plugins/codemirror/mode/javascript/javascript.js'
    ],
    'ion.rangeSlider': '/assets/plugins/ionRangeSlider/ion.rangeSlider.min',
    'echarts': '/assets/plugins/echarts/echarts-all',

    'amap': 'http://webapi.amap.com/maps?v=1.3&key=f0948ced2976d1bcc654eff99d796a32',
    'amap-main': 'http://webapi.amap.com/ui/1.0/main',
    'amap-tool': 'http://webapi.amap.com/demos/js/liteToolbar',

    'cfgs': 'cfgs/cfgs',
    'API': 'cfgs/apis',
    'view': 'assets/scripts/core/core.view',

    'define': 'assets/scripts/core/app.define',
    'app': 'assets/scripts/app',
    'App-form': 'assets/scripts/core/app.form',
    'App-table': 'assets/scripts/core/app.table',
    'App-util': 'assets/scripts/core/app.util',
    'App-logger': 'assets/scripts/core/app.logger',
    'App-ajax': 'assets/scripts/core/app.ajax',
    'App-block': 'assets/scripts/core/app.block',
    'App-route': 'assets/scripts/core/app.route',
    'App-dialog': 'assets/scripts/core/app.dialog',
    'App-cookie': 'assets/scripts/core/app.cookie',

    'module-server': 'assets/scripts/modules/modules.server',
    'module-map': 'assets/scripts/modules/modules.map',
  },

  shim: {
    'app': ['jquery',
      'bootstrap',
      'cfgs',
      'define',
      'App-util',
      'assets/scripts/core/app.base64',
      'App-route',
      'App-form',
      'App-cookie',
      'module-server',
      'module-map'
    ],
    'App-util': ['jquery', 'jquery.md5'],
    'App-logger': ['App-util'],
    'App-block': ['jquery', 'jquery.blockUI', 'App-logger'],
    'App-dialog': ['jquery', 'bootbox', 'App-util', 'App-logger', 'jquery.fbmodel'],
    'App-ajax': ['jquery', 'App-util', 'App-logger', 'App-block'],
    'App-route': ['App-ajax'],

    'App-cookie': ['jquery', 'jquery.cookie', 'App-logger'],

    'App-form': [
      'App-ajax',
      'App-dialog',
      'App-block',,
      'jquery.slimscroll',
      'css!/assets/fonts/font.css',
      'css!/assets/css/animate.css',
      'css!assets/css/loading.css',
      'css!assets/css/color.css',
      'css!assets/css/responsive.css'
    ],

    'module-map': ['amap', 'amap-main', 'amap-tool'],

    'amap-main': ['amap'],
    'amap-tool': ['amap'],

    'bootstrap': [
      'jquery',
      'css!/assets/plugins/bootstrap/css/bootstrap.min.css',
      'jquery.tmpl', 'jquery.tmplPlus'
    ],

    'bootstrap-collapse': ['jquery', 'bootstrap'],

    'bootbox': ['jquery', 'bootstrap'],

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
    ]
  }
});

require(['app',
  // 'jquery.slimscroll',
  // 'jquery.easing',
  // 'jquery.timeago',
  // 'jquery.md5',
  // 'jquery.tmpl',
  // 'jquery.uniform',
  // 'jquery.peity',
  // 'select2',
  // 'jstree',
  // 'bootstrap-daterangepicker',
  // 'bootstrap-datetimepicker',
  // 'bootstrap-collapse',
  // 'codemirror',
  // 'ion.rangeSlider',
  // 'echarts'
], function (App) {
  App.onReady();
});