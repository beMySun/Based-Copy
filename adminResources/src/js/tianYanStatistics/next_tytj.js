var pingan_sdk_appid;
var pingan_sdk_vn;
var pingan_sdk_vc;

var applicantTemp = JSON.parse(sessionStorage.getItem('productData'));
if (applicantTemp) {
    if (window.location.origin.indexOf('test') == -1 && window.location.origin.indexOf('localhost') == -1) {
        pingan_sdk_appid = '134D94707C924A2AAC710E6BFBAE4D31';
    } else {
        pingan_sdk_appid = '89F2A227101F471F9865DF00BB979B2C';
    }
    pingan_sdk_vn = 'noCar_1.21.0';
    pingan_sdk_vc = applicantTemp.ACCOUNT || 'noCar_20170426';
    applicantAddScript('https://dn-mailattachments.qbox.me/h5sdk001.js');
};

var applicantTimer = setInterval(function() {
    var temp = JSON.parse(sessionStorage.getItem('productData'));
    if (typeof SKAPP != 'undefined' && $('#nextStep').length > 0 && temp) {
        var _planCode = temp.planInfoList[0].localProMap.planCode,
            _planName = temp.planInfoList[0].localProMap.planName;
        SKAPP.onEvent('nl_pdname0_btn', '产品名称', { pdn: _planName });
        SKAPP.onEvent('nl_info0_page', '投保人信息填写页', { pdc: _planCode });
        $('#nextStep').click(function() {
            SKAPP.onEvent('nonlfe_next0_btn', '下一步按钮', { pdc: _planCode });
        });
        $('.icon-tel').click(function() {
            SKAPP.onEvent('nl_call0_btn', '拨打95511按钮', { pdc: _planCode });
        });
        clearInterval(applicantTimerStep2);
        clearInterval(applicantTimer);
    }
}, 30);

var applicantTimerStep2 = setInterval(function() {
    var temp = JSON.parse(sessionStorage.getItem('productData'));
    if (typeof SKAPP != 'undefined' && $('.pay_tytj').length > 0 && temp) {
        var _planCode = temp.planInfoList[0].localProMap.planCode,
            _planName = temp.planInfoList[0].localProMap.planName;

        SKAPP.onEvent('nl_pdname0_btn', '产品名称', { pdn: _planName });
        SKAPP.onEvent('nl_info0_page', '投保人信息填写页', { pdc: _planCode });

        $('.pay_tytj').click(function() {
            SKAPP.onEvent('nonlfe_next0_btn', '支付按钮', { pdc: _planCode });
        });
        clearInterval(applicantTimer);
        clearInterval(applicantTimerStep2);
    }
}, 30);


function applicantAddScript(url) {
    var head = document.getElementsByTagName('head')[0];
    var js = document.createElement('script');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', url);
    head.appendChild(js);
}
