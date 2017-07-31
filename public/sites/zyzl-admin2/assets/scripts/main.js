require.config({
  baseUrl: 'assets/scripts/',

  map: {
    '*': {
      'css': '/assets/plugins/css.js'
    }
  },

  paths: {

    'cfgs': '../../cfgs/cfgs',
    'API': '../../cfgs/apis',
    'app': 'app',

    'util': 'core/framework.util',
    'logger': 'core/framework.logger',
    'layout': 'core/framework.layout',
    'block': 'core/framework.block',
    'base64': 'core/framework.base64',
    'ajax': 'core/framework.ajax',
    'generator': 'core/framework.generator',
    'dialog': 'core/framework.dialog',
    'plugin-dict': 'plugins/plugins.dict',
    'module-server': 'modules/modules.server',
    'module-role': 'modules/modules.role',
    'module-order': 'modules/modules.order',
    'module-admin': 'modules/modules.admin',
    'module-log': 'modules/modules.log',

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

  },

  shim: {
    'layout': [
      'jquery.slimscroll',
      'bootstrap-daterangepicker',
      'bootstrap-datetimepicker',
      'jquery.uniform',
      'select2',
      'jquery.fbmodel',
      'bootstrap',
      'css!/assets/plugins/bootstrap/css/bootstrap.min.css',
      'css!/assets/css/animate.css',
      'css!/assets/fonts/font.css',
      'css!/assets/css/animate.css',
      'css!../css/loading.css',
      'css!../css/color.css',
      'css!../css/login.css',
      'css!../css/responsive.css'
    ],
    'block': ['jquery.blockUI'],
    'bootstrap': ['jquery'],
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


define(['jquery', 'layout', 'logger'], function ($, layout) {
  console.info("应用程序启动");
  let isScreen = false;
  $('#fullscreen').on('click', function () {
    isScreen = !isScreen;
    if (isScreen) {
      layout.fullScreen();
    } else {
      layout.exitFullScreen();
    }
  });
  layout.gotoMain();
});