(function($) {
    $.fn.transitionEnd = function(callback) {
        var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
            i, dom = this;

        function fireCallBack(e) {
            /*jshint validthis:true */
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
        return this;
    };
})($);


+ function($) {
    "use strict";

    var defaults;

    var show = function(html, className) {

        className = className || "";
        var mask = $("<div class='weui_mask_transparent'></div>").appendTo(document.body);

        var tpl = '<div class="weui_toast ' + className + '">' + html + '</div>';
        var dialog = $(tpl).appendTo(document.body);

        dialog.show();
        dialog.addClass("weui_toast_visible");
    };

    var hide = function(callback) {
        $(".weui_mask_transparent").remove();
        $(".weui_toast_visible").removeClass("weui_toast_visible").transitionEnd(function() {
            var $this = $(this);
            $this.remove();
            //$('.weui_toast').remove();//sunjianguo add 两个toast同时出现就会有一个没删除，应该是bug
            callback && callback($this);
        });
    }

    $.toast = function(text, style, callback) {
        if (typeof style === "function") {
            callback = style;
        }
        var className;
        if (style == "cancel") {
            className = "weui_toast_cancel";
        } else if (style == "forbidden") {
            className = "weui_toast_forbidden";
        } else if (style == "text") {
            className = "weui_toast_text";
        }
        show('<i class="weui_icon_toast"></i><p class="weui_toast_content">' + (text || "已经完成") + '</p>', className);

        setTimeout(function() {
            hide(callback);
        }, toastDefaults.duration);
    }

    $.showLoading = function(text) {
        var html = '<div class="weui_loading">';
        for (var i = 0; i < 12; i++) {
            html += '<div class="weui_loading_leaf weui_loading_leaf_' + i + '"></div>';
        }
        html += '</div>';
        html += '<p class="weui_toast_content">' + (text || "数据加载中") + '</p>';
        show(html, 'weui_loading_toast');
    }

    $.hideLoading = function() {
        hide();
    }

    var toastDefaults = $.toast.prototype.defaults = {
        duration: 2000
    }

}($);

+ function($) {
    "use strict";

    var defaults;

    var show = function(params) {

        var mask = $("<div class='weui_mask weui_actions_mask'></div>").appendTo(document.body);

        var actions = params.actions || [];

        var actionsHtml = actions.map(function(d, i) {
            return '<div class="weui_actionsheet_cell ' + (d.className || "") + '">' + d.text + '</div>';
        }).join("");

        var titleHtml = "";

        if (params.title) {
            titleHtml = '<div class="weui_actionsheet_title">' + params.title + '</div>';
        }

        var tpl = '<div class="weui_actionsheet " id="weui_actionsheet">' +
            titleHtml +
            '<div class="weui_actionsheet_menu">' +
            actionsHtml +
            '</div>' +
            '<div class="weui_actionsheet_action">' +
            '<div class="weui_actionsheet_cell weui_actionsheet_cancel">取消</div>' +
            '</div>' +
            '</div>';
        var dialog = $(tpl).appendTo(document.body);

        dialog.find(".weui_actionsheet_menu .weui_actionsheet_cell, .weui_actionsheet_action .weui_actionsheet_cell").each(function(i, e) {
            $(e).click(function() {
                $.closeActions();
                params.onClose && params.onClose();
                if (actions[i] && actions[i].onClick) {
                    actions[i].onClick();
                }
            })
        });

        mask.show();
        dialog.show();
        mask.addClass("weui_mask_visible");
        dialog.addClass("weui_actionsheet_toggle");
    };

    var hide = function() {
        $(".weui_mask").removeClass("weui_mask_visible").transitionEnd(function() {
            $(this).remove();
        });
        $(".weui_actionsheet").removeClass("weui_actionsheet_toggle").transitionEnd(function() {
            $(this).remove();
        });
    }

    $.actions = function(params) {
        params = $.extend({}, defaults, params);
        show(params);
    }

    $.closeActions = function() {
        hide();
    }

    $(document).on("click", ".weui_actions_mask", function() {
        $.closeActions();
    });

    var defaults = $.actions.prototype.defaults = {
        title: undefined,
        onClose: undefined,
        /*actions: [{
          text: "菜单",
          className: "color-danger",
          onClick: function() {
            console.log(1);
          }
        },{
          text: "菜单2",
          className: "color-success",
          onClick: function() {
            console.log(2);
          }
        }]*/
    }

}($);
