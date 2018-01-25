$(function() {

    var urlParameters = window.tool.getUrlParameters();
    var keyCode = urlParameters.keyCode;

    if (urlParameters.flag == 'EXX') {
        window.tool.getScript('js/newProductDetail.js');
    } else {
        if (!keyCode) {
            $('.loading').hide();
            window.wAlert('请在链接中配置keyCode参数');
            return false;
        }
        window.sessionStorage.removeItem('productData');
        window.sessionStorage.clear();
        var options = {
            // url: '/icp/mobile_single_insurance/newQueryProductDetails.do',
            // type: 'POST',
            url: '../../mock/pet.json',
            type: 'get',            
            data: $.extend({}, urlParameters),
            success: function(productData) {
                productData && typeof productData === 'string' && (productData = JSON.parse(productData));
                if (productData.code === '00') {
                    var icpProductInfo = productData.icpProductInfo || {};
                    if (!(icpProductInfo.pageTemplateId || productData.template) || !productData.templateType) {
                        $('.loading').hide();
                        window.wAlert('产品数据有误');
                        return false;
                    }

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
                    }

                } else {
                    $('.loading').hide();
                    window.wAlert(productData.msg || '系统出错，请稍后再试');
                }
            }
        };
        window.tool.ajax(options);
    }
});
