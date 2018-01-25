;(function(global) {

    var Share = function() {

        var version = '0.0.1',

            Bools = {
                checkObjType: function(a) {
                    return Object.prototype.toString.call(a) === '[object Object]';
                },
                checkFunType: function(a) {
                    return "function" == typeof a;
                },
                checkWechat: function() {
                    return "micromessenger" == navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ? !0 : !1;
                },
                checkIsInclude: function(name) {
                    var js = /js$/i.test(name);
                    var resource = document.getElementsByTagName(js ? 'script' : 'shareLink');
                    var length = resource.length;
                    for (var index = 0; index < length; index++) {
                        if (resource[index][js ? 'src' : 'href'].indexOf(name) != -1)
                            return true;
                    }
                    return false;
                }
            },

            Engine = {
                initWXShare: function() {
                    console.log('配置微信分享数据:');

                    console.log(wechatData);

                    wx.config({
                        debug: true,
                        appId: wechatData.appId, // 必填，公众号的唯一标识
                        timestamp: wechatData.timestamp, // 必填，生成签名的时间戳
                        nonceStr: wechatData.nonceStr, // 必填，生成签名的随机串
                        signature: wechatData.signature, // 必填，签名
                        jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ']
                    });

                    wx.ready(function() {
                        wx.checkJsApi({
                            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ'],
                            fail: function(res) {
                                console.log("微信版本过低，请升级到新版本！");
                            }
                        });

                        wx.onMenuShareTimeline({
                            title: wechatData.shareTitle,
                            desc: wechatData.shareDesc,
                            link: wechatData.shareLink,
                            imgUrl: wechatData.shareImgUrl,                           
                            success: function(res) {
                                console.log("分享到朋友圈成功！");
                            },
                            fail: function(res) {
                                console.log("分享到朋友圈失败！");
                            }
                        });

                        wx.onMenuShareAppMessage({
                            title: wechatData.shareTitle,
                            desc: wechatData.shareDesc,
                            link: wechatData.shareLink,
                            imgUrl: wechatData.shareImgUrl,                             
                            success: function(res) {
                                console.log("分享到微信好友成功！");
                            },
                            fail: function(res) {
                                console.log("分享到微信好友失败！");
                            }
                        });

                        wx.onMenuShareQQ({
                            title: wechatData.shareTitle,
                            desc: wechatData.shareDesc,
                            link: wechatData.shareLink,
                            imgUrl: wechatData.shareImgUrl,
                            success: function(res) {
                                console.log("分享到QQ好友成功！");
                            },
                            fail: function(res) {
                                console.log("分享到QQ好友失败！");
                            }
                        });
                    });                    
                },
                startRun: function(assign, config) {
                    Getters.setShareInfo(assign, config);
                }
            },

            wechatData = {},

            Getters = {
                http: function(uri, method, data, headers, success, error) {
                    var xhr = new XMLHttpRequest();
                    xhr.open(method, uri, true);
                    if (headers) {
                        for (var p in headers) {
                            xhr.setRequestHeader(p, headers[p]);
                        }
                    }
                    xhr.addEventListener('readystatechange', function(e) {
                        if (xhr.readyState === 4) {
                            if (String(xhr.status).match(/^2\d\d$/)) {
                                success(xhr.responseText);
                            } else {
                                error(xhr);
                            }
                        } else {
                            console.log('网络出错，请稍候重试');
                        }
                    });
                    xhr.send(data);
                },

                get: function(uri, data, success, error) {
                    this.http(uri, 'GET', data, null, success, error);
                },

                post: function(uri, data, success, error) {
                    if (typeof data === 'object' && !(data instanceof String || (FormData && data instanceof FormData))) {
                        var params = [];
                        for (var p in data) {
                            if (data[p] instanceof Array) {
                                for (var i = 0; i < data[p].length; i++) {
                                    params.push(encodeURIComponent(p) + '[]=' + encodeURIComponent(data[p][i]));
                                }
                            } else {
                                params.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p]));
                            }
                        }
                        data = params.join('&');
                    }

                    this.http(uri, 'POST', data || null, {
                        "Content-type": "application/x-www-form-urlencoded"
                    }, success, error);
                },
                jsLoader: function(src, load, error) {
                    var script = document.createElement('script');
                    script.src = src;
                    script.addEventListener('load', load);
                    script.addEventListener('error', error);
                    (document.getElementsByTagName('head')[0] || document.body || document.documentElement).appendChild(script);
                },

                setShareInfo: function(assigns, config) {
                    var _self = this;

                    if (Bools.checkWechat() && Bools.checkObjType(assigns)) {
                        console.log('in wechat');
                        wechatData.shareTitle = assigns.shareTitle;
                        wechatData.shareDesc = assigns.shareDesc;
                        wechatData.shareImgUrl = assigns.shareImgUrl;
                        wechatData.shareLink = assigns.shareLink;

                        if (!Bools.checkIsInclude('jweixin-1.0.0.js')) {
                            _self.jsLoader('https://res.wx.qq.com/open/js/jweixin-1.0.0.js', function() {
                                _self.configWxShare(config);
                            }, function(e) {
                                throw new Error(e);
                            });
                        } else {
                            _self.configWxShare(config);
                        }
                    } else {
                        console.log('not in wechat');
                    }
                },

                configWxShare: function(config) {
                    var _self = this;
                    var uri = config.url || window.location.origin + '/getWeChatShareSign.do';
                    var data = config.params;

                    $.ajax({
                        url: uri,
                        type: 'post',
                        data: JSON.stringify(data),
                        success: function(res) {
                            res = typeof res === 'object' ? res : JSON.parse(res);
                            if (res.code === '00') {
                                wechatData.appId = res.appId;
                                wechatData.timestamp = res.timestamp;
                                wechatData.nonceStr = res.noncestr;
                                wechatData.signature = res.signature;
                                Engine.initWXShare();
                            } else {
                                console.log('返回数据有误:' + res);
                            }

                        },
                        error: function() {
                            console.log('网络出错，请刷新页面');
                        }
                    })


                }
            };

        return {
            ready: function() {
                // 待添加的方法，SEO处理等
                // Getters.getSeoData();
            },
            init: function(assign, config) {
                Engine.startRun(assign, config);
            }
        }
    }();

    Share.ready();

    // 暴露外部接口
    global.iShare = function(assign, config) {
        Share.init(assign, config);
    }

    // 支持AMD规范
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = iShare;
    }
    // 支持CMD规范
    if (typeof define === 'function') {
        define(function() {
            return iShare; 
        });
    }
})(this);
