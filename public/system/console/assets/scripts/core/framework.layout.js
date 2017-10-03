define(['jquery', 'cfgs', 'block'], ($, cfgs, block) => {
  let selected = undefined;
  let isFullScreen = false;
  let source_loaded = undefined;
  let loaded = undefined;

  document.addEventListener("fullscreenchange", function () {
    // (document.fullscreen) ? "" : "not ";
  }, false);
  document.addEventListener("mozfullscreenchange", function () {
    // (document.mozFullScreen) ? "" : "not ";
  }, false);
  document.addEventListener("webkitfullscreenchange", function () {
    // (document.webkitIsFullScreen) ? "" : "not ";
  }, false);
  document.addEventListener("msfullscreenchange", function () {
    // (fullscreenState.innerHTML = ()document.msFullscreenElement) ? "" : "not ";
  }, false);

  /**
   * ajax方式加载页面内容.
   * @param {string} url 待加载内容的URL地址.
   * @param {string} callback 内容加载完成后的回调函数.
   */
  var _ajax_load_content = function (url, callback) {

    if (!url) {
      console.debug("请求地址不存在:%s", url);
      return;
    }
    console.info("准备加载:%s", url);

    block.show("正在加载页面...");

    if (source_loaded && source_loaded.destroy && typeof source_loaded.destroy === 'function') {
      source_loaded.destroy();
    }

    $(".nui-content-view").addClass("fadeOutRight");

    /** 页面加载完成时的回调函数 */
    var loadCallback = function () {
      console.info("加载完成:%s", url);

      if ($(".nui-content-view").hasClass("fadeOutRight")) {
        $(".nui-content-view").removeClass("fadeOutRight");
      }
      $(".nui-content-view").addClass("fadeInRight");
      if (callback && typeof callback === 'function') {
        callback.call();
      }
      setTimeout(function () {
        $(".nui-content-view").removeClass("fadeInRight");
      }, 500);

      block.close();
      // view.contentChanged();
    }

    /* 加载页面内容 */
    $(".nui-content-view").load(url, loadCallback);
  }

  var fullScreen = () => {
    var docElm = document.documentElement;
    //W3C  
    if (docElm.requestFullscreen) {
      isFullScreen = true;
      docElm.requestFullscreen();
    }
    //FireFox  
    else if (docElm.mozRequestFullScreen) {
      isFullScreen = true;
      docElm.mozRequestFullScreen();
    }
    //Chrome等  
    else if (docElm.webkitRequestFullScreen) {
      isFullScreen = true;
      docElm.webkitRequestFullScreen();
    }
    //IE11
    else if (docElm.msRequestFullscreen) {
      isFullScreen = true;
      docElm.msRequestFullscreen();
    }
  }

  var exitFullScreen = () => {
    if (document.exitFullscreen) {
      isFullScreen = false;
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      isFullScreen = false;
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      isFullScreen = false;
      document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
      isFullScreen = false;
      document.msExitFullscreen();
    }
  }

  var _init = () => {

    var menuContainer = $('.nui-navigator');

    $.each(cfgs.modules, (key, item) => {
      let li = $('<li/>').appendTo(menuContainer);
      let link = $('<a/>').appendTo(li);

      if (!selected) {
        selected = link;
      }

      if (item.module) {
        link.attr("data-module", item.module);
      }
      $('<i/>').addClass(item.icon).appendTo(link);
      $('<span/>').text(item.name).appendTo(link);
    });

    menuContainer.on('click', 'a', function () {
      let link = $(this);

      let moduleName = link.data("module");
      if (!moduleName) {
        return;
      }
      /** 处理mini-menu高亮状态 */
      $(".nui-navigator .nui-active").each(function () {
        $(this).removeClass("nui-active");
      });

      $(".nui-navigator>li>a>span").each(function () {
        link.parent().addClass("nui-active");
      });

      let breadcrumb = $(".nui-breadcrumb");
      $("li", breadcrumb).each((index, item) => {
        if (index == 0) {
          return;
        }
        item.remove();
      });

      breadcrumb.append(link.parent().clone());

      require([moduleName], (moduleObject) => {
        if (loaded) {
          source_loaded = loaded;
        }
        loaded = moduleObject;
        console.debug("module[%s] init", moduleName);
        moduleObject.init();
      });

    });

    selected.click();

    console.info("菜单初始化完成");
  };

  let module = {
    load: _ajax_load_content,
    isFullScreen: isFullScreen,
    toggleFullScreen: (isFullScreen == true ? exitFullScreen : fullScreen),
    exitFullScreen: exitFullScreen,
    fullScreen: fullScreen,
    init: _init,
  };

  return module;
});