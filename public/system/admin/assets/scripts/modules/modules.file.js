/* ========================================================================
 * App.plugins.file v1.0
 * 0101.我的文件插件
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  "use strict";

  var viewInit = () => {
    $("#file").on("change", () => {
      if ($(this).val() != "") {
        upload();
      }
    });
    $("#btn_upload").on("click", function () {
      $("#file").click();
    });

    var upload_success = function (json) {
      dataInit();
    }

    var upload_error = function (xhr, errorMsg, errorThrown) {
      App.alert(errorThrown);
    }

    function progresschange(e) {
      // if(e.lengthComputable){
      //     $('progress').attr({value:e.loaded,max:e.total});
      // }
    }

    var upload = function () {
      var formData = new FormData($('form')[0]);
      $.ajax({
        "url": API.upload.api,
        "type": 'POST',
        "xhr": function () {
          var myXhr = $.ajaxSettings.xhr();
          if (myXhr.upload) {
            myXhr.upload.addEventListener('progress', progresschange, false);
          }
          return myXhr;
        },
        "success": upload_success,
        "error": upload_error,
        "data": formData,
        "cache": false,
        "contentType": false,
        "processData": false
      });
    }
  }

  var dataInit = () => {
    $('#file-container').empty();
    App.ajax(API.files.listapi, {}, (json) => {
      $.each(json.data.list, (index, item) => {
        item.extname = App.base64.decode(item.extname);
        // item.date = App.util.utcTostring(item.date, "yyyy-MM-dd");
        switch (item.extname) {
          case ".jpg": // 图片格式，显示图片
          case ".png":
          case ".gif":
            item.TYPE_IMAGE = 1;
            break;
          default: //其他格式文件暂时不处理
            item.TYPE_UNDEFINE = 1;
            break;
        }
      });

      $("#file_data").tmpl(json.data.list, {
        "api": () => { return API.files.getapi; }
      }).appendTo('#file-container');
    });
  }

  app.plugins.file = {
    "init": function () {
      viewInit();
      dataInit();
    }
  }
})(App);