
$(function () {
    var app = {
        init: function () {
            app.render();
            app.bindEvents();
        },

        render: function () {
            var warn = document.querySelector('.warn');
            var main = document.querySelector('.main');
            var isInWechat = app.isWeiXin();
            $('.loading').hide();
            
            // if (isInWechat) {
            //     main.style.display = 'block';
            //     warn.style.display = 'none';
            // } else {
            //     main.style.display = 'none';
            //     warn.style.display = 'block';
            // }
            
            var openId = app.getUrlParameters().openId || '';
            var callBackUrl = app.getUrlParameters().callBackUrl || '';
            app.setSessionStorage('openId', openId);
            app.setSessionStorage('callBackUrl', callBackUrl);

            // var newURL = app.delUrlParam(window.location.href, 'openId');
            // console.log(newURL);
            // if ('pushState' in history) {
            //     history.pushState({}, 0, newURL);
            //     console.log(app.getSessionStorage('openId'));
            // }
        },

        bindEvents: function () {
            var btn = document.querySelector('#get');
            btn.onclick = function () {
                window.location.href = "applicant.html"
            }
        },

        getUrlParameters: function () {
            var urlParameters = {};
            decodeURIComponent(window.location.search).replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
                urlParameters[key] = value;
            });
            return urlParameters;
        },

        getSessionStorage: function (name) {
            return JSON.parse(window.sessionStorage.getItem(name));
        },

        setSessionStorage: function (name, value) {
            window.sessionStorage.setItem(name, JSON.stringify(value));
        },

        isWeiXin: function () {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        },
        delUrlParam: function (url, ref) {
            var str = "";
            if (url.indexOf('?') != -1) {
                str = url.substr(url.indexOf('?') + 1);
            }
            else {
                return url;
            }
            var arr = "";
            var returnurl = "";
            var setparam = "";
            if (str.indexOf('&') != -1) {
                arr = str.split('&');
                for (i in arr) {
                    if (arr[i].split('=')[0] != ref) {
                        returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
                    }
                }
                return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
            }
            else {
                arr = str.split('=');
                if (arr[0] == ref) {
                    return url.substr(0, url.indexOf('?'));
                }
                else {
                    return url;
                }
            }
        }
    };
    app.init();
});