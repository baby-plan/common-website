/* ========================================================================
 * App.dialog v1.0
 * 提示框组件（ALERT ： bootbox） 
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * 
 * ======================================================================== */
(function(app) {
    //自定义弹出对话框样式
    //=======================================================================
    app.alert = function(options) {
        var defaults = {
            buttons: {
                ok: { label: "确定", className: "btn-success" }
            }
            , message: options.message
            , title: options.title
        }
        var options = $.extend(defaults, options);
        bootbox.alert(options);
    };
    //  带有确定|取消按钮的弹出式对话框.
    //@params text      对话框提示的信息.
    //@params callback  操作完成反馈 function(bool),参数为BOOLEAN.
    //=======================================================================
    app.confirm = function(text, callback) {
        bootbox.dialog({
            "message": text,
            "title": "操作确认",
            "buttons": {
                "success": {
                    "label": "确定",
                    "className": "btn-success",
                    "callback": function() { callback(true); }
                },
                "danger": {
                    "label": "取消",
                    "className": "btn-danger",
                    "callback": function() { callback(false); }
                }
            }
        });
    }
    // 带有确定按钮的弹出式对话框.
    // @params text      对话框提示的信息
    // @params callback  操作完成反馈 function()
    //=======================================================================
    app.alertText = function(text, callback) {
        App.alert({ "message": text, "callback": callback });
    };

    app.dialog = {
        /*-----------------------------------------------------------------------------------*/
        /*  加载内容的对话框.
        /*@params options   参数设置.
        /*[可选结构]
        /*  url       : 包含对话框内容的文件地址.
        /*  title     : 对话框的标题.
        /*  width     : 对话框的宽度.
        /*  height    : 对话框的高度.
        /*  callback  : 操作完成反馈 function().
        /*-----------------------------------------------------------------------------------*/
        "load": function(options) {
            if (!options.width) {
                options.width = "600";
            }
            $(".fbmodal").html("");
            $(".fbmodal").load(options.url, function() {
                $(".fbmodal").fbmodal({
                    "title": options.title,
                    "width": options.width,
                    "height": options.height,
                    "top": options.top
                });
                App.form.init();
                if (typeof options.callback == 'function') { options.callback(); }
            });
        }
        /*-----------------------------------------------------------------------------------*/
        /*  关闭对话框.
        /*-----------------------------------------------------------------------------------*/
        , "close": function() {
            $(".fbmodal").fbmodal({ "close": true });
            $("#fbmodal_overlay,#fbmodal").remove();
        }
    }
})(App);