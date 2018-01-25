$(function() {
    'use strict';

    var urlParametersObj = window.tool.getUrlParameters();
    var prizeType = urlParametersObj.prizeType; //几等奖
    var policyNo = urlParametersObj.policyNo; //保单号
    var pageType = urlParametersObj.pageType; //detail

    var app = {

        render: function() {
            if (!policyNo) {
                window.tool.alertMsg('sorry', '保单号缺失');
                return false;
            }

            if (!prizeType) {
                window.tool.alertMsg('sorry', '奖品类型缺失');
                return false;
            }

            var pageHtml = window.tool.getPrizeHtml(prizeType);
            if (!pageHtml) {
                window.tool.alertMsg('sorry', '奖品类型有误');
                return false;
            }

            $('body').prepend(pageHtml);
        },

        getPrizeDetail: function() {
            if (!policyNo) {
                window.tool.alertMsg('sorry', '保单号缺失');
                return false;
            }

            var ops = {
                url: '/icp/activity/getPolicyActivityAward.do',
                data: {
                    policyNo: policyNo
                },
                success: function(res) {
                    res && typeof res === 'string' && (res = JSON.parse(res));

                    if (res && res.resultCode === '00' && res.policyActivityAward) {
                        var prizeInfo = res.policyActivityAward;
                        var prizeType = prizeInfo.activityAwardType;
                        var pageHtml = window.tool.getPrizeHtml(prizeType, prizeInfo);
                        $('body').prepend(pageHtml);
                    } else {
                        window.tool.alertMsg('sorry', res.resultMsg || '系统出错，请稍后重试');
                    }
                }
            };
            window.tool.ajax(ops);
        },

        //弹窗事件
        alertEventBinding: function() {
            $(document).on('click', '.icon-btn-close', function() {
                $('.alert').remove();
            });
        },

        submitEventBinding: function() {
            $(document).on('click', '.icon-submit', function() { //提交
                if ($(this).hasClass('submit-diabled')) {
                    window.tool.alertMsg('sorry', '请勿重复提交数据');
                    return false;
                }

                if (!policyNo) {
                    window.tool.alertMsg('sorry', '保单号缺失');
                    return false;
                }

                var contactDom = $('input[name=contact]');
                var contactDomLength = contactDom.length;
                var contactDomVal = $.trim(contactDom.val());
                if (contactDomLength > 0 && !contactDomVal) {
                    window.tool.alertMsg('sorry', '请输入联系人');
                    return false;
                }

                var phoneDom = $('input[name=phone]');
                var phoneDomLength = phoneDom.length;
                var phoneDomVal = $.trim(phoneDom.val());
                if (phoneDomLength > 0 && !/^1[3|4|5|7|8]\d{9}$/.test(phoneDomVal)) {
                    window.tool.alertMsg('sorry', '请输入正确的手机号');
                    return false;
                }

                var addressDom = $('input[name=address]');
                var addressDomLength = addressDom.length;
                var addressDomVal = $.trim(addressDom.val());
                if (addressDomLength > 0 && !addressDomVal) {
                    window.tool.alertMsg('sorry', '请输入寄送地址');
                    return false;
                }

                $(this).addClass('submit-diabled');
                var ops = {
                    url: '/icp/activity/updateExpress.do',
                    type: 'post',
                    data: {
                        policyNo: policyNo,
                        userName: contactDomVal,
                        telephoneNumber: phoneDomVal,
                        telephoneNumberType: $.trim($('select[name=phoneType]').val()),
                        address: addressDomVal
                    },
                    success: function(res) {
                        res && typeof res === 'string' && (res = JSON.parse(res));

                        if (res && res.resultCode === '00') {
                            if (prizeType === 'A' || prizeType === 'B') {
                                window.tool.alertMsg('success', '信息填写成功<br>工作人员将在5个工作日内和您取得联系，确认获奖信息');
                            } else if (prizeType === 'D') {
                                window.tool.alertMsg('success', '信息填写成功<br>工作人员将在2个工作日内完成流量充值');
                            } else {
                                window.tool.alertMsg('success', '信息填写成功');
                            }

                            var toHref = '/icp/adminResources/src/newGeneration/orderList.html' + window.location.search;
                            $('.icon-btn').removeClass('icon-btn-close').attr('href', toHref);
                        } else {
                            $('.icon-submit').removeClass('submit-diabled');
                            window.tool.alertMsg('sorry', res.resultMsg || '系统出错，请稍后重试');
                        }
                    },
                    error: function() {
                        $('.icon-submit').removeClass('submit-diabled');
                        window.tool.alertMsg('sorry', '网络出错，请稍后重试');
                    }
                };
                window.tool.ajax(ops);
            });
        },

        init: function() {
            if (pageType === 'detail') {
                app.getPrizeDetail();
            } else {
                app.render();
                app.submitEventBinding();
            }
            app.alertEventBinding();
        }
    };

    app && app.init();
});
