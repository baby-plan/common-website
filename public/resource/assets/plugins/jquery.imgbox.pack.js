(function ($) {
  $.fn.imgBox = function (opts) {
    var width = $(window).width();
    var height = $(window).height();
    var defaults = { idName: "#lightbox" };
    var obj = $.extend({}, defaults, opts);
    var id = $(obj.idName)
    id.hide();
    $("p>img").click(function (e) {
      var img = new Image();
      img.src = $(this).attr("src");
      $("*").stop(); //停止所有正在运行的动画
      id.hide();
      
      $("img", id).attr("src", img.src);
      $("img", id).css({ "width": "500px", "height": "500px" });
      $("div:eq(1)", id).html($(this).attr("title"));

      id.css({position: "absolute"})
      $("div:eq(1)", id).css({
        "font-size": "12px", "font-family": "Arial", margin: "5px"
      })
      id.css({ "top": "5px", "left": "5px", "z-index": 1000,"width":"500px","height":"500px"}).fadeIn("slow");
    })
    $("img", id).click(function () {
      id.hide();
      $("#lightbox>img").attr("style", "width:500px;height:500px;");
      $("#greybackground").remove();
    })
  }
})(jQuery)