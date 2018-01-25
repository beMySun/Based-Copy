;(function() {
    var app = {

        //初始化函数
        init: function() {
                var productData = window.tool.getSessionStorage('productData');
                var urlParameters = window.tool.getSessionStorage('urlParameters');
                var themeStyle = window.sessionStorage.getItem('themeStyle');
                var urlP = window.tool.getUrlParameters();
                if(urlParameters.flag == 'EXX'){
                    var agentNo = urlP.agentNo?urlP.agentNo:'';
                    var ciph = urlP.ciph?urlP.ciph:'';
                    var url = '/icp/validateExxUserInfo.do';
                    $.ajax({
                        url: url,
                        type: 'post',
                        data: {
                            applySelfCardSourceNo: agentNo,
                            ciph:ciph
                        },
                        success: function(res) {
                            var res = typeof res === 'object' ? res : JSON.parse(res);
                            if (res.code === '00') {
                                if (productData) {
                                   if (themeStyle) {
                                        window.tool.setStyle(themeStyle);
                                    };
                                    tool.getTemplate(productData, 'step02', 2);
                                } else {
                                    app.getProductData();
                                }
                            } else {
                                window.tool.toast(res.msg);
                                $('.loading').hide();
                            }
                        },
                        error: function() {
                            window.tool.toast('网络出错，请刷新页面');
                            $('.loading').hide();
                        }
                    })
                }else{
                    if (productData) {
                        if (themeStyle) {
                            window.tool.setStyle(themeStyle);
                        };
                        tool.getTemplate(productData, 'step02', 2);
                    } else {
                        app.getProductData();
                    }
                }
            },
            getProductData:function(){
                var productData = window.tool.getSessionStorage('productData');
                var urlParameters = window.tool.getSessionStorage('urlParameters');
                var themeStyle = window.sessionStorage.getItem('themeStyle');
                var url = '/icp/mobile_single_insurance/newQueryProductDetails.do';
                $.ajax({
                    url: url,
                    type: 'GET',
                    data: {
                        keyCode: urlParameters.keyCode
                    },
                    success: function(productData) {
                        productData = typeof productData === 'object' ? productData : JSON.parse(productData);
                        if (productData.code === '00') {
                            if (!productData.color) {
                                window.tool.setSessionStorage('urlParameters', urlParameters);
                                window.tool.setSessionStorage('productData', productData);
                                window.tool.getTemplate(productData, 'step02', 2);
                            } else {
                                var ops = {
                                    url: productData.color,
                                    success: function(themeStyle) {
                                        if (themeStyle) {
                                            window.tool.setStyle(themeStyle);
                                            window.sessionStorage.setItem('themeStyle', themeStyle);
                                        }
                                    },
                                    error: function() {},
                                    complete: function() {
                                        window.tool.setSessionStorage('urlParameters', urlParameters);
                                        window.tool.setSessionStorage('productData', productData);
                                        window.tool.getTemplate(productData, 'step02', 2);
                                    }
                                };
                                window.tool.ajax(ops);
                            };

                        } else {
                            window.tool.toast(productData.msg);
                            $('.loading').hide();
                        }
                    },
                    error: function() {
                        window.tool.toast('网络出错，请刷新页面');
                        $('.loading').hide();
                    }
                });

            }

    };

    $(function() {
        app && app.init();
    });

})();
