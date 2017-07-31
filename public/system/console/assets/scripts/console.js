require.config({
  baseUrl: '',

  map: {
    '*': {
      'css': '/assets/plugins/css.js'
    }
  },

  paths: {
    'jquery': '/assets/plugins/jquery.min',
    'jquery.blockUI': '/assets/plugins/jquery.blockUI.min',
    'jquery.tmpl': '/assets/plugins/jquery-tmpl/jquery.tmpl.min',
    'jquery.tmplPlus': '/assets/plugins/jquery-tmpl/jquery.tmplPlus.min',
    'bootstrap': '/assets/plugins/bootstrap/js/bootstrap.min',
    'moment': '/assets/plugins/bootstrap-daterangepicker/moment.min',
    'echarts': '/assets/plugins/echarts/echarts-all',

    'cfgs': 'cfgs/cfgs',
    'app': 'assets/scripts/app',

    'util': 'assets/scripts/core/framework.util',
    'logger': 'assets/scripts/core/framework.logger',
    'layout': 'assets/scripts/core/framework.layout',
    'block': 'assets/scripts/core/framework.block',
    'base64': 'assets/scripts/core/framework.base64',
    'ajax': 'assets/scripts/core/framework.ajax',
    'monitor': 'assets/scripts/modules/center.monitor',
    'operation': 'assets/scripts/modules/center.operation',
    'setting': 'assets/scripts/modules/center.setting',
  },

  shim: {
    'app': ['jquery',
      'cfgs',
      'css!/assets/css/animate.css',
    ],
    'block': ['jquery.blockUI'],
    'bootstrap': [
      'jquery',
      'css!/assets/plugins/bootstrap/css/bootstrap.min.css',
    ],
  }
});

require(['app', 'bootstrap'], function (App) {
  App.onReady();
});