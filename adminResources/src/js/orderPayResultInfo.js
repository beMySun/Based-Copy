(function() {
    'use strict;'

    var app = {
        setStyle: function(styleText) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = styleText;
            document.getElementsByTagName('head')[0].appendChild(style);
        },

        getRemoteData: function() {
            var urlParameters = {};
            window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
                urlParameters[key] = value;
            });

            var postData = {
                paymentDate: urlParameters.paymentDate,
                paymentState: urlParameters.paymentState,
                remark: (urlParameters.remark || '').split('_')[0],
                bankOrderNo: urlParameters.bankOrderNo,
                businessNo: urlParameters.businessNo,
                userId: urlParameters.userId,
                errorMsg: urlParameters.errorMsg,
                ciphertext: urlParameters.ciphertext,
                saleRecordId: urlParameters.partner_business_id
            };

            $.ajax({
                type: "POST",
                url: "/icp/mobileSinglePlatform/npsWebPayCallBackForIcpCore.do",
                data: postData,
                dataType: "json",
                success: function(res) {
                    res && typeof res === 'string' && (res = JSON.parse(res));
                    if (res && res.resultCode === '00') {
                        var InsuranceDetailHtml = '<li class="list-group-item"> <label>产品名称：</label> <p>' + (res.productName || '') + '</p> </li> <li class="list-group-item"> <label>保单号：</label> <p>' + (res.policyNo || '') + '</p> </li> <li class="list-group-item"> <label>保险期限：</label> <p>' + (res.insureBeginTime || '') + '至' + (res.insureEndTime || '') + '</p> </li> <li class="list-group-item"> <label>保费：</label> <p>' + (res.amount || '') + '元</p> </li>';
                        $('#payStatus').removeClass('fail').addClass('success').find('.inner-text').text('支付成功');
                        $('#InsuranceDetail').html(InsuranceDetailHtml);
                        $('#pageRefresh').addClass('hidden');
                    } else {
                        $('#payStatus').removeClass('success').addClass('fail').find('.inner-text').text('系统繁忙,请稍后刷新');
                        $('#pageRefresh').removeClass('hidden');
                    }
                },
                error: function() {
                    $('#payStatus').removeClass('success').addClass('fail').find('.inner-text').text('网络出错,请稍后刷新');
                    $('#pageRefresh').removeClass('hidden');
                }
            });
        },

        //定时器
        setRefreshTimer: function(second) {
            second = typeof second === 'number' && second > 0 ? second : 5;

            var pageRefreshDom = $('#pageRefresh');
            pageRefreshDom.addClass('diabled').text(second + 's');
            second--;

            var refreshTimer = setInterval(function() {
                if (second > 0) {
                    pageRefreshDom.text(second + 's');
                    second--;
                } else {
                    pageRefreshDom.removeClass('diabled').text('刷新');
                    clearInterval(refreshTimer);
                }
            }, 1000);
        },

        //完成
        pageFinish: function() {
            $('#pageFinish').on('click', function() {
                var sessionUrlParameters = JSON.parse(window.sessionStorage.getItem('urlParameters'));
                var jumpToHref = '';
                if (sessionUrlParameters && sessionUrlParameters.callBackUrl) {
                    jumpToHref = sessionUrlParameters.callBackUrl;
                } else {
                    var searchStr = "?";
                    for (var key in sessionUrlParameters) {
                        searchStr += key + '=' + sessionUrlParameters[key] + '&';
                    }
                    jumpToHref = 'productDetail.html' + searchStr.slice(0, -1);
                }

                window.location.href = jumpToHref;
            });
        },

        //刷新
        pageRefresh: function() {
            $('#pageRefresh').on('click', function() {
                if (!$(this).hasClass('diabled')) {
                    $('#payStatus').removeClass('success fail').find('.inner-text').text('正在承保');
                    $('#InsuranceDetail').html('');
                    app.getRemoteData();
                    app.setRefreshTimer(5); //倒计五秒
                }
            });
        },

        binding: function() {
            app.pageFinish();
            app.pageRefresh();
        },

        init: function() {
            var themeStyle = window.sessionStorage.getItem('themeStyle'); //主题色
            if (themeStyle) {
                app.setStyle(themeStyle);
            }
            app.binding();
            app.getRemoteData();
        }
    };

    app && app.init();
})();
