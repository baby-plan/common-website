require.config({
  baseUrl: '',

  map: {
    '*': {
      'css': '/assets/plugins/css.js'
    }
  },

  paths: {

    'cfgs': 'cfgs/cfgs',

    'util': 'assets/scripts/core/framework.util',
    'logger': 'assets/scripts/core/framework.logger',
    'layout': 'assets/scripts/core/framework.layout',
    'block': 'assets/scripts/core/framework.block',
    'base64': 'assets/scripts/core/framework.base64',
    'ajax': 'assets/scripts/core/framework.ajax',
    'monitor': 'assets/scripts/modules/center.monitor',
    'operation': 'assets/scripts/modules/center.operation',
    'setting': 'assets/scripts/modules/center.setting',
    'filesystem': 'assets/scripts/modules/center.filesystem',

    'jquery': '/assets/plugins/jquery.min',
    'jquery.blockUI': '/assets/plugins/jquery.blockUI.min',
    'jquery.tmpl': '/assets/plugins/jquery-tmpl/jquery.tmpl.min',
    'jquery.tmplPlus': '/assets/plugins/jquery-tmpl/jquery.tmplPlus.min',
    'bootstrap': '/assets/plugins/bootstrap/js/bootstrap.min',
    'moment': '/assets/plugins/bootstrap-daterangepicker/moment.min',
    'echarts': '/assets/plugins/echarts/echarts-all',
    // 'codemirror': '/assets/plugins/codemirror/codemirror',
    // 'codemirror-javascript': '/assets/plugins/codemirror/mode/javascript/javascript',

  },

  shim: {

    'block': ['jquery.blockUI'],
    // 'filesystem': [
    //   // 'codemirror', 'codemirror-javascript'
    //   // "/assets/plugins/codemirror/codemirror.js", "/assets/plugins/codemirror/mode/javascript/javascript.js"
    // ],

    'bootstrap': [
      'jquery',
      'css!/assets/plugins/bootstrap/css/bootstrap.min.css',
    ],
    // 'codemirror': [
    //   'css!/assets/plugins/codemirror/codemirror.css'
    // ],
    // 'codemirror-javascript': ['codemirror']
  },
  packages: [{
    name: "codemirror",
    location: "/assets/plugins/",
    main: "codemirror"
  }]
});

define(['jquery', 'layout', 'logger', 'cfgs', 'bootstrap', 'css!/assets/css/animate.css'], function ($, layout) {
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

  setTimeout(function () {

    $('section').dblclick(function () {
      if ($('body').hasClass("showmenu")) {
        $('body').removeClass("showmenu");
      } else {
        $('body').addClass("showmenu");
      }
    });
  }, 500);

  layout.init();

});
