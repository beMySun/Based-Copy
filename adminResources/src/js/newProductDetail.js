;(function() {
    var app = {
        init: function() {
                var urlParameters = window.tool.getUrlParameters();
                if (!urlParameters.keyCode||urlParameters.keyCode == 'undefined'||urlParameters.keyCode == 'null') {
                    $('.loading').hide();
                    window.wAlert('请在链接中配置keyCode参数');
                    return false
                }
                window.tool.setSessionStorage('urlParameters', urlParameters); 
                if(urlParameters.flag == 'EXX'){
                    var agentNo = urlParameters.agentNo?urlParameters.agentNo:'';
                    var ciph = urlParameters.ciph?urlParameters.ciph:'';
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
                            if (res.code === '00') { //成功
                                app.getProductData();
                            } else {
                                window.wAlert(res.msg);
                                $('.loading').hide();
                            }
                        },
                        error: function() {
                            window.wAlert('网络出错，请稍后再试');
                            $('.loading').hide();
                        }
                    })
                }else{
                    app.getProductData();
                };
            },//end init
            getProductData:function(){
                var urlParameters = window.tool.getUrlParameters();
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
                                window.tool.getTemplate(productData, 'step01', 1);
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
                                        window.tool.getTemplate(productData, 'step01', 1);
                                    }
                                };
                                window.tool.ajax(ops);
                            };

                        } else {
                            window.wAlert(productData.msg);
                            $('.loading').hide();
                        }
                    },
                    error: function() {
                        window.wAlert('网络出错，请稍后再试');
                        $('.loading').hide();
                    }
                });
            }
    };

    $(function() {
        app && app.init();
    });

})();
