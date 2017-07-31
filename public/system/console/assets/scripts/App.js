define(['jquery', 'layout'], function ($, layout) {
  let app = {
    "userinfo": {},
    /** 当前登录用户的信息 */
    "plugins": {},

    /** 当前登录用户的信息 */
    "modules": {
      "actions": {}
    },
    onReady: () => {
      require(['logger'], () => {
        console.info("应用程序启动");
        let isScreen = false;

        setTimeout(function () {
          // $('section').each(function () {
          //   $(this).attr('data-margin-left', $(this).css("marginLeft"));
          // });

          $('section').dblclick(function () {
            if ($('body').hasClass("showmenu")) {
              $('body').removeClass("showmenu");
              // var marginLeft = $(this).attr("data-margin-left");

              // $('section').each(function () {
              //   $(this).css({ "marginLeft": "calc(" + $(this).attr("data-margin-left") + '-' + marginLeft + ")" });
              // });

              // $('body').css({ "paddingLeft": marginLeft.replace("-", "") });
            } else {
              // $('section').each(function () {
              //   $(this).css({ "marginLeft": $(this).attr("data-margin-left") });
              // });
              // $('body').css({ "paddingLeft": '0' });
              $('body').addClass("showmenu");
            }
          });
        }, 500);

        // $('section').hover(() => {
        //   $('body').removeClass("showmenu");
        // }, () => {
        //   $('body').addClass("showmenu");
        // });
        $('#fullscreen').on('click', () => {
          isScreen = !isScreen;
          if (isScreen) {
            layout.fullScreen();
          } else {
            layout.exitFullScreen();
          }

          // <i class="fa fa-toggle-off"></i>
          //              <i class="fa fa-toggle-on"></i>
          // layout.toggleFullScreen();
        });

        layout.init();
      });
    }
  }
  return app;
});