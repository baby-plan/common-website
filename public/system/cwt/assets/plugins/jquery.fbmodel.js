(function($){
  $.fn.fbmodal = function(options, callback){  
    var defaults = {  
      "title"   : "弹出窗口",
      "opacity" : 0.2,
      "top"     : "30%",
      "width": "",
      "height":"",
      "close"   : false
    };  
    var options = $.extend(defaults, options);
    var fbmodalHtml=
      '<div id="fbmodal" class="box border default">\
        <div class="box-title">\
          <h4></h4>\
        </div>\
        <div class="box-body">\
        </div>\
      </div>';

    var fbWidth = function(){ 
      var windowWidth=$(window).width();
      var fbmodalWidth=$("#fbmodal").width();
      var fbWidth=windowWidth / 2 - fbmodalWidth / 2;
      $("#fbmodal").css("left",fbWidth);
    }
    var fadeOut = function(){
      $("#fbmodal").fadeOut( function(){
        $("#fbmodal").remove();
        $("#fbmodal_overlay").remove();
      });
    };
    
    if( options.close){
      fadeOut();
    }else{
      var dat=this.html();
      $("body").append(fbmodalHtml);
      $('#fbmodal').css("top",options.top);
      $('#fbmodal .box-title h4').append(options.title);
      $('#fbmodal .box-body').append(dat).css("width", options.width);
      if (options.height) {
        $('#fbmodal .box-body').append(dat).css("height", options.height);
      }
      $("body").append('<div id="fbmodal_overlay" class="fbmodal_hide"></div>');
      $("#fbmodal_overlay").addClass("fbmodal_overlay").fadeTo(0,options.opacity);
      fbWidth();
      $(window).bind("resize", function(){
        fbWidth();
      }); 
      $(".fbmodal_hide").click( function(){
        fadeOut();
      });
    }
  }
})(jQuery); 