define(['QDP'], (QDP) => {
  let module = {
    "define": {
      "name": "upload-inmag"
    }
  }, _events, eventArgs;
  module.init = (column, data, events) => {
    if (!events) {
      console.error("upload-plugin 初始化失败：参数events未设置");
      return;
    } else if (!events.get || typeof events.get != 'function') {
      console.error("upload-plugin 初始化失败：参数 get 异常");
      return;
    }

    _events = events;

    var id = column.name;
    var fileCtrlID = 'upimg_' + id;
    var formID = 'form_' + id;
    var container = $('#ajax-content');

    var form = $('<form/>')
      .attr('enctype', 'multipart/form-data')
      .css('display', 'none')
      .attr('id', formID)
      .appendTo(container);

    $('<input/>')
      .attr('type', 'file')
      .attr('name', fileCtrlID)
      .attr('id', fileCtrlID)
      .appendTo(form)
      .on("change", function () {
        if ($(this).val() != "") {
          //exec_upload();
          var imgurl;
          if (navigator.userAgent.indexOf("MSIE") >= 1) { // IE 
            imgurl = $(this).value;
          } else if (navigator.userAgent.indexOf("Firefox") > 0) { // Firefox 
            imgurl = window.URL.createObjectURL($(this)[0].files.item(0));
          } else if (navigator.userAgent.indexOf("Chrome") > 0) { // Chrome 
            imgurl = window.URL.createObjectURL($(this)[0].files.item(0));
          }

          $('#' + id + '_img').attr('src', imgurl);
          $('#' + id).val(imgurl);

          if ($("#role-form").data("bootstrapValidator")) {
            $("#role-form")
              .data("bootstrapValidator")
              .updateStatus(id, "NOT_VALIDATED", null)
              .validateField(id);
          }
          eventArgs = { "url": imgurl };
        }
      });

    if (data && data[column.name]) {
      var url = data[column.name];
      url = QDP.base64.decode(url);
      $('#' + id + '_img').attr('src', url);
      $('#' + id).val(url);
      eventArgs = { "url": url };
    }

    $('#' + id + '_img')
      .css('minHeight', '200px')
      .on('click', function () { $("#" + fileCtrlID).click(); });
    $('#' + id)
      .parent()
      .on('click', function () { $("#" + fileCtrlID).click(); });
  }

  // 执行文件上传
  var exec_upload = function () {

    var upload_success = function (json) {
      // dataInit();
    }

    var upload_error = function (xhr, errorMsg, errorThrown) {
      alert(errorThrown)
      // App.alert(errorThrown);
    }

    function progresschange(e) {
      // if(e.lengthComputable){
      //     $('progress').attr({value:e.loaded,max:e.total});
      // }
    }

    // var formData = new FormData($('#' + formID)[0]);
    // $.ajax({
    //   "url": api.upload.api,
    //   "type": 'POST',
    //   "xhr": function () {
    //     var myXhr = $.ajaxSettings.xhr();
    //     if (myXhr.upload) {
    //       myXhr.upload.addEventListener('progress', progresschange, false);
    //     }
    //     return myXhr;
    //   },
    //   "success": upload_success,
    //   "error": upload_error,
    //   "data": formData,
    //   "cache": false,
    //   "contentType": false,
    //   "processData": false
    // });

  }

  module.destroy = () => {

  };

  module.get = function (data) {
    _events.get(data, eventArgs);
  };


  return module;
});