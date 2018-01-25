var pingan_sdk_appid;
var pingan_sdk_vn;
var pingan_sdk_vc;
var keyCode

var getQueryString = function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

var productDetailFirstTimer = setInterval(function() {
    var productDetailTemp = JSON.parse(sessionStorage.getItem('productData'));
    if (productDetailTemp) {
        if (window.location.origin.indexOf('test') == -1 && window.location.origin.indexOf('localhost') == -1) {
            pingan_sdk_appid = '134D94707C924A2AAC710E6BFBAE4D31';
        } else {
            pingan_sdk_appid = '89F2A227101F471F9865DF00BB979B2C';
        }
        pingan_sdk_vn = 'noCar_1.21.0';
        pingan_sdk_vc = productDetailTemp.ACCOUNT || 'noCar_20170426';
        productDetailAddScript('js/tianYanStatistics/h5Sdk.js');
        clearInterval(productDetailFirstTimer);
    }
}, 30);

// var productDetailSecondTimer = setInterval(function() {
//     var temp = JSON.parse(sessionStorage.getItem('productData'));
//     if (typeof SKAPP != 'undefined' && $('#J-btn-buy').length > 0 && temp) {
//         var _planCode = temp.planInfoList[0].localProMap.planCode,
//             _planName = temp.planInfoList[0].localProMap.planName;
//         SKAPP.onEvent('nl_pdname0_btn', '产品名称', { pdn: _planName });
//         SKAPP.onEvent('nl_select0_page', '套餐选择页', { pdc: _planCode });
//         $('#J-btn-buy').click(function() {
//             SKAPP.onEvent('nl_buy0_btn', '购买按钮', { pdc: _planCode });
//         });
//         $('.icon-tel').click(function() {
//             SKAPP.onEvent('nl_call0_btn', '拨打95511按钮', { pdc: _planCode });
//         });
//         clearInterval(productDetailThirdTimer);
//         clearInterval(productDetailSecondTimer);
//     }
// }, 30);
// 

var productDetailThirdTimer = setInterval(function() {
    keyCode = getQueryString('keyCode');
    // 需要在公共的按钮上添加一个类作为标示， 在统计代码中监听即可。
    if (typeof SKAPP != 'undefined' && $('.buy_tytj').length > 0 && $('.tj-product').length >0) {
        
        $('.tj-product').click(function() {
            SKAPP.onEvent(keyCode, '产品介绍页面', { 产品介绍: '产品介绍导航按钮' });
        })
        $('.tj-know').click(function() {
            SKAPP.onEvent(keyCode, '产品介绍页面', { 投保须知: '投保须知导航按钮' });
        })
        $('.tj-claim').click(function() {
            SKAPP.onEvent(keyCode, '产品介绍页面', { 理赔指南: '理赔指南导航按钮' });
        })
        $('.tj-question').click(function() {
            SKAPP.onEvent(keyCode, '产品介绍页面', { 常见问题: '常见问题导航按钮' });
        })
        // $('head').click(function() {
        //     SKAPP.onEvent(keyCode, '产品介绍页面', { 立即投保: '立即投保按钮' });
        // });
        // clearInterval(productDetailSecondTimer);
        clearInterval(productDetailThirdTimer);
    }
}, 30);


function productDetailAddScript(url) {
    var head = document.getElementsByTagName('head')[0];
    var js = document.createElement('script');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', url);
    head.appendChild(js);
}
