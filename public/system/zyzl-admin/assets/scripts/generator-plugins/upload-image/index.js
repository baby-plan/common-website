define(['QDP'], (QDP) => {
  let module = {
    "define": {
      "name": "upload-image"
    },
    /** 处理 数据编辑 
     * @param {JSON} column 
     * @param {string} value 
     * @param {Element} labelContainer 
     * @param {Element} valueContainer 
     * @param {JSON} sourceData 
     */
    "editor": function (column, value, labelContainer, valueContainer, sourceData) {
      var id = column.name;
      var fileCtrlID = 'upimg_' + id;
      var formID = 'form_' + id;
      var container = $('.ajax-content');

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

            if ($(".core-form").data("bootstrapValidator")) {
              $(".core-form")
                .data("bootstrapValidator")
                .updateStatus(id, "NOT_VALIDATED", null)
                .validateField(id);
            }
            eventArgs = { "url": imgurl };
          }
        });

      if (sourceData && sourceData[column.name]) {
        var url = sourceData[column.name];
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
    },
    /** 处理 网格显示
     * @param {JSON} column
     * @param {Element} tr
     * @param {string} value
     */
    "grid": function (column, tr, value) {
      QDP.form.appendHTML(tr, "<img src='" + value + "' style='width:70px;height:30px'>");
    }
  }, _events, eventArgs;

  // // 执行文件上传
  // var exec_upload = function () {

  //   var upload_success = function (json) {
  //     // dataInit();
  //   }

  //   var upload_error = function (xhr, errorMsg, errorThrown) {
  //     alert(errorThrown)
  //     // App.alert(errorThrown);
  //   }

  //   function progresschange(e) {
  //     // if(e.lengthComputable){
  //     //     $('progress').attr({value:e.loaded,max:e.total});
  //     // }
  //   }

  //   // var formData = new FormData($('#' + formID)[0]);
  //   // $.ajax({
  //   //   "url": api.upload.api,
  //   //   "type": 'POST',
  //   //   "xhr": function () {
  //   //     var myXhr = $.ajaxSettings.xhr();
  //   //     if (myXhr.upload) {
  //   //       myXhr.upload.addEventListener('progress', progresschange, false);
  //   //     }
  //   //     return myXhr;
  //   //   },
  //   //   "success": upload_success,
  //   //   "error": upload_error,
  //   //   "data": formData,
  //   //   "cache": false,
  //   //   "contentType": false,
  //   //   "processData": false
  //   // });

  // }

  module.destroy = () => {

  };

  module.get = function (data) {
    _events.get(data, eventArgs);
  };


  return module;
});