;(function(window) {

    window.App = {};
    var page = {
        lock: function() {
            $('body').addClass('stop-scrolling');
        },
        unlock: function() {
            $('body').removeClass('stop-scrolling');
        }
    }
    var ua = navigator.userAgent.toUpperCase();
    App.IS_ANDROID = ua.indexOf('ANDROID') != -1;
    App.IS_IOS = ua.indexOf('IPHONE OS') != -1;
    App.IS_NATIVE = (App.IS_ANDROID || App.IS_IOS) ? true : false;
    App.IS_WEIXIN = ua.indexOf('MICROMESSENGER') != -1;

    window.wLoading = {
        html: '<div class="shade"><div class="loading"><div class="loading_img"></div></div></div>',
        start: function(id) {
            if ($(".shade").length > 0) {
                $(".shade").show();
            } else {
                $("body").append(this.html);
            }
        },
        stop: function(id) {
            $(".shade").hide();
        },
        destroy: function() {
            $(".shade").remove();
        }
    };

    window.wAlert = function(msg, callback, isConfirm) {

        var divHtml = "",
            msgHtml = "",
            pHtml = "",
            callback = callback;
        if (typeof(msg) == "string") {
            msgHtml = msg;
        } else {
            $.each(msg, function(key, value) {
                msgHtml += "<p style='text-align: left'>" + value + "</p>";
            });
        }
        if (isConfirm) {
            pHtml = '<a key="sure" class="left">确定</a><a key="cancel">取消</a>';
        } else {
            pHtml = '<a key="sure">确定</a>';
        }

        if (!$("#maskLayer").length > 0) {
            divHtml = '<div class="maskLayer" id="maskLayer">' +
                '<div id="wAlert" class="showSweetAlert"><div id="wAlertText">' + msgHtml + '</div>' +
                '<div id="wAlertBtn">' + pHtml + '</div></div>' +
                '</div>';
            $("body").append(divHtml);
            page.lock();
        } else {
            page.lock();
            $('#wAlertText').html(msgHtml);
            $('#wAlertBtn').html(pHtml);
            $('#maskLayer').show();
        }

        $("#wAlertBtn a").on('click', function(e) {
            var target = $(e.currentTarget),
                key = target.attr("key"),
                result = false;
            key == "sure" && (result = true);
            page.unlock();
            callback && callback(result);
            $('#maskLayer').hide();
        });

    };

})(this);
