var productData = JSON.parse(sessionStorage.getItem('productData'));

if (productData && productData.accountInfo.ACCOUNT) {

    var ACCOUNT = productData.accountInfo.ACCOUNT;
    if (ACCOUNT === 'JDXJ_CPS' || '494ed84a60bd49ed8845a649ea2f73cc') {
        var telIcon = document.getElementsByClassName('icon-tel')[0];
        if (telIcon) {
            telIcon.style.cssText = "display:none";
        }
    }
}