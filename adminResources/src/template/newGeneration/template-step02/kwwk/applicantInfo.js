(function () {

    'use strict';

    var app = {

        setPayData: function () {
            var productData = JSON.parse(window.sessionStorage.getItem('productData'));

            //投保人
            var applicantInfoDom = $('#applicantInfo');
            var applicantName = applicantInfoDom.find('.to-validate-name').val().trim();
            // var applicantCertificateType = applicantInfoDom.find('.certificate-type').val().trim();
            var applicantCertificate = applicantInfoDom.find('.to-validate-certificate').val().trim();
            var applicantPhone = applicantInfoDom.find('.to-validate-phone').val().trim();
            var applicantSexDom = applicantInfoDom.find('.to-validate-man');
            var applicantSex, applicantBirthday, applicantAge, resultObj;

            if (applicantSexDom.length === 0) {
                resultObj = window.validate.getBirthdayAndSexFromID(applicantCertificate);
                applicantSex = resultObj.sex;
                applicantBirthday = resultObj.birthday;
            } else {
                applicantSex = applicantSexDom.prop('checked') ? 'M' : 'F';
                applicantBirthday = applicantInfoDom.find('.to-validate-birthday').val().trim();
            }
            applicantAge = window.validate.getAgeFromBirthday(applicantBirthday);

            var partnerCode = productData.partnerCode;
            var typeCode = productData.productInfo.planList[0].typeCode;
            var productId = productData.productInfo.productId;
            var packageId = productData.productInfo.planList[0].packageList[0].packageId;
            var planId = productData.productInfo.planList[0].planId;
            var orderNo = (new Date()).getTime() + '' + parseInt(Math.random() * Math.pow(10, 7));
            var timestamp = app.getTimestamp();
            var premium = productData.productInfo.planList[0].packageList[0].packageAmount;

            var today = new Date();
            var tomorrow = new Date(today.setDate(today.getDate() + 1));
            var maxInsuranceMonth = productData.productInfo.planList[0].maxInsuranceMonth - 0;
            var maxInsuranceDay = productData.productInfo.planList[0].maxInsuranceDay - 0;
            var insuranceBeginDate = app.getFutureDate(tomorrow, 0, 0, 0);;
            var insuranceEndDate = app.getFutureDate(new Date(insuranceBeginDate), 0, maxInsuranceMonth - 0, maxInsuranceDay - 1);

            var newData = {
                "partnerCode": partnerCode,
                "typeCode": typeCode,
                "productId": productId,
                "planId": planId,
                "packageId": packageId,
                "timestamp": timestamp,
                "orderNo": orderNo,
                "productInfo": {
                    "applyNum": "1",
                    "totalActualPremium": premium,
                    "insuranceBeginDate": insuranceBeginDate + " " + "00:00:00",
                    "insuranceEndDate": insuranceEndDate + " " + "23:59:59"
                },
                "applicantInfo": {
                    "openId": app.getSessionStorage('openId') || '',
                    "name": applicantName,
                    "mobileTelephone": applicantPhone,
                    "certificateNo": applicantCertificate,
                    "certificateType": "01",
                    "birthday": applicantBirthday,
                    "sexCode": applicantSex
                },
                "insurantInfoList": [
                    {
                        "name": applicantName,
                        "certificateNo": applicantCertificate,
                        "certificateType": "01",
                        "birthday": applicantBirthday,
                        "sexCode": applicantSex
                    }
                ]
            }

            window.sessionStorage.setItem('newData', JSON.stringify(newData));
        },
        getTimestamp: function () {
            var myDate = new Date();
            var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
            var month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
            var day = myDate.getDate(); //获取当前日(1-31)
            var hour = myDate.getHours(); //获取当前小时数(0-23)
            var miniute = myDate.getMinutes(); //获取当前分钟数(0-59)
            var seconds = myDate.getSeconds(); //获取当前秒数(0-59)

            return year + '-' + month + '-' + day + ' ' + hour + ':' + miniute + ':' + seconds;
        },
        getFutureDate: function (startDate, afterYear, afterMonth, afterDay) {
            var futureDate, year, month, day;

            if (arguments.length === 3) {
                afterDay = arguments[2];
                afterMonth = arguments[1];
                afterYear = arguments[0];
                startDate = new Date(startDate);
            }

            if (arguments.length === 4 && Object.prototype.toString.call(startDate) !== "[object Date]") {
                startDate = new Date(startDate);
            }

            //计算年
            futureDate = startDate.setFullYear(startDate.getFullYear() + parseInt(afterYear));
            futureDate = new Date(futureDate);
            // 计算月
            futureDate = futureDate.setMonth(futureDate.getMonth() + parseInt(afterMonth));
            futureDate = new Date(futureDate);
            // 计算日
            futureDate = futureDate.setDate(futureDate.getDate() + parseInt(afterDay));
            futureDate = (new Date(futureDate));

            year = futureDate.getFullYear();

            month = futureDate.getMonth() + 1;
            month = month < 10 ? '0' + month : month;

            day = futureDate.getDate();
            day = day < 10 ? '0' + day : day;

            futureDate = [year, month, day].join('-');

            return futureDate;
        },
        disableButton: function () {
            $('#pay').addClass('disabled');
            $('.btn-text').text('领取中');
        },

        resetButton: function () {
            $('#pay').removeClass('disabled')
            $('.btn-text').text('免费领取');
        },

        pay: function () {

            app.disableButton();

            var data = window.sessionStorage.getItem('newData');
            var callBackUrl = app.getSessionStorage('callBackUrl');

            $.ajax({
                url: '/icp/mobile_single_insurance/giftInsuranceApply.do',
                type: 'post',
                data: data,
                success: function (res) {
                    res && typeof res === 'string' && JSON.parse(res);
                    if (res.resultCode === '00') {
                        //埋点统计
                        window.tool.payBtnTJ && window.tool.payBtnTJ();
                        
                        window.wAlert('领取成功', function () {
                            app.resetButton();
                            if (callBackUrl) {
                                window.location.href = callBackUrl;
                            }
                        });

                    } else {
                        window.wAlert(res.msg || '领取失败');
                        app.resetButton();
                    }
                },
                error: function () {
                    window.wAlert('网络出错，请稍后重试');
                    app.resetButton();
                }
            });
        },

        setIframe: function ($target) {
            var productData = JSON.parse(window.sessionStorage.getItem('productData'));
            var targetHash = ($target.data('hash') + '').trim();
            var div;
            var planCode = productData.productInfo.planList[0].planCode;
            var applicantStatement = productData.productInfo.planList[0].applicantStatement;
            //div创建
            switch (targetHash) {
                case '1':
                    div = document.createElement('iframe');
                    div.src = window.location.origin + '/icp_core_dmz/web/' + planCode + '.html';
                    break;
                case '2':
                    div = document.createElement('div');
                    div.innerHTML = applicantStatement || '暂无描述';
                    break;
                default:
                    div = document.createElement('div');
                    div.innerHTML = '暂无描述';
                    break;
            }

            // 容器处理
            var parentDom = document.createElement('div');
            parentDom.className = 'iframe-container';
            div.className = 'desc';
            parentDom.appendChild(div);
            $('.content').hide().after(parentDom);

            //标题处理
            var hash = {
                1: '保险条款',
                2: '投保人声明'
            };
            var $title = $('.title');
            var headerTitle = $title.text();
            $title.text(hash[targetHash] || '暂无描述');

            //返回处理
            window.history.pushState({
                title: '#insuranceClause'
            }, '#insuranceClause', window.location.href + '#insuranceClause');
            window.onpopstate = function (e) {
                $('.content').show();
                $('.iframe-container').remove();
                $('.title').text(headerTitle);
            };
        },

        initBirthdayTime: function () {
            var domList = $('.form-control-birthday');
            for (var i = 0; i < domList.length; i++) {
                domList.eq(i).datetimePicker({
                    title: '选择日期',
                    yearSplit: '-',
                    monthSplit: '-',
                    datetimeSplit: ' ',
                    times: function () {
                        return [];
                    }
                });
            }
        },
        isWeiXin: function () {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        },
        validate: function () {
            var result = {
                isValid: true,
                msg: 'ok'
            };

            //校验
            var toValidateDomList = $('.to-validate');
            for (var i = 0; i < toValidateDomList.length; i++) {
                var toValidateDom = toValidateDomList.eq(i);

                if (toValidateDom.hasClass('to-validate-name')) { //姓名
                    result = window.validate.validateName($.trim(toValidateDom.val()));
                    if (result.isValid) {
                        continue;
                    }
                    result.msg = toValidateDom.closest('.section-body').data('order') + result.msg;
                    return result;
                }

                if (toValidateDom.hasClass('to-validate-certificate')) { //证件号
                    var certificateType = toValidateDom.closest('.section-body').find('.certificate-type').val();
                    // if (certificateType === '01') { //身份证
                        var limitedArray = toValidateDom.closest('section').data('min-max-sex').split('-');
                        result = window.validate.validateCertificate($.trim(toValidateDom.val()), limitedArray);
                    // } else {
                    //     result = window.validate.validateCertificate($.trim(toValidateDom.val()));
                    // }
                    if (result.isValid) {
                        continue;
                    }
                    result.msg = toValidateDom.closest('.section-body').data('order') + result.msg;
                    return result;
                }

                if (toValidateDom.hasClass('to-validate-birthday')) { //出生日期
                    var limitedArray = toValidateDom.closest('section').data('min-max-sex').split('-');
                    result = window.validate.validateBirthday($.trim(toValidateDom.val()), limitedArray[0], limitedArray[1]);
                    if (result.isValid) {
                        continue;
                    }
                    result.msg = toValidateDom.closest('.section-body').data('order') + result.msg;
                    return result;
                }

                if (toValidateDom.hasClass('to-validate-man')) { //男
                    var limitedArray = toValidateDom.closest('section').data('min-max-sex').split('-');
                    result = window.validate.validateSex(toValidateDom.prop('checked') ? '1' : '2', limitedArray[2]);
                    if (result.isValid) {
                        continue;
                    }
                    result.msg = toValidateDom.closest('.section-body').data('order') + result.msg;
                    return result;
                }

                if (toValidateDom.hasClass('to-validate-woman')) { //女
                    var limitedArray = toValidateDom.closest('section').data('min-max-sex').split('-');
                    result = window.validate.validateSex(toValidateDom.prop('checked') ? '2' : '1', limitedArray[2]);
                    if (result.isValid) {
                        continue;
                    }
                    result.msg = toValidateDom.closest('.section-body').data('order') + result.msg;
                    return result;
                }

                if (toValidateDom.hasClass('to-validate-phone')) { //手机
                    result = window.validate.validatePhone($.trim(toValidateDom.val()));
                    if (result.isValid) {
                        continue;
                    }
                    result.msg = toValidateDom.closest('.section-body').data('order') + result.msg;
                    return result;
                }

                if (toValidateDom.hasClass('to-validate-email')) { //邮箱
                    result = window.validate.validateEmail($.trim(toValidateDom.val()));
                    if (result.isValid) {
                        continue;
                    }
                    result.msg = toValidateDom.closest('.section-body').data('order') + result.msg;
                    return result;
                }
            }

            return result;
        },

        binding: function () {
            $('.page')
                // .on('change', '.certificate-type', function () { //切换证件类型
                //     var dynamicItemDomList = $(this).closest('.section-body').find('.dynamic-item');

                //     if ($.trim($(this).val()) === '01') {
                //         dynamicItemDomList.remove();
                //     } else {
                //         var html = '<li class="dynamic-item"> <div class="form-group">  <p class="form-group-label"> <span class="icon"><i class="icon-birthday"></i></span>出生日期 </p> <label> <input type="text" class="form-control form-control-birthday  to-validate  to-validate-birthday" placeholder="必填"> </label> </div> </li> <li class="dynamic-item"> <div class="form-group">  <p class="form-group-label"><span class="icon"><i class="icon-sex"></i></span>性别 </p> <form> <span class="form-control-radio"><input class="to-validate to-validate-man" type="radio" name="sex" checked>男</span> <span class="form-control-radio"><input class="to-validate to-validate-woman" type="radio" name="sex">女</span> </form> </div> </li>';
                //         dynamicItemDomList.length === 0 && $(this).closest('li').next().after(html);
                //         app.initBirthdayTime();
                //     }
                // })

                .on('click', '#pay', function () { //支付

                    if ($(this).hasClass('disabled')) {
                        return;
                    }

                    var result = app.validate();

                    if (!result.isValid) {
                        window.wAlert(result.msg);
                        return false;
                    }

                    var $readmeCheckbox = $('.readme-checkbox');
                    if ($readmeCheckbox.length > 0 && !$readmeCheckbox.prop('checked')) {
                        window.wAlert('请勾选同意相关投保告知信息');
                        return false;
                    }

                    app.setPayData();
                    app.pay();

                })
                .on('click', '.text-inner', function () { //保险条款                    
                    app.setIframe($(this));
                });
        },

        recoverPayData: function (html) {
            $('.page').html(html);
        },

        renderReadme: function (arr) {
            var resultStr = '';
            var hash = {
                1: '《保险条款》',
                2: '《投保人声明》'
            };

            if (arr instanceof Array && arr.length) {
                resultStr = '<label> <input class="readme-checkbox" type="checkbox" checked> 本人已阅读并同意 </label> <div class="readme-desc"> ';
                var html = arr.map(function (elem, index) {
                    if (hash[elem]) {
                        return '<span class="text-inner" data-hash="' + elem + '">' + hash[elem] + '</span> ';
                    }
                }).join('');
                resultStr += html + '</div>';
            }
            return resultStr;
        },
        getSessionStorage: function (name) {
            return JSON.parse(window.sessionStorage.getItem(name));
        },

        setSessionStorage: function (name, value) {
            window.sessionStorage.setItem(name, JSON.stringify(value));
        },
        render: function () {
            $('.loading').hide();
            var isInWechat = app.isWeiXin();

            // if (isInWechat) {
            //     $('.page').show();
            //     $('.warn').hide();
            // } else {
            //     $('.page').hide();
            //     $('.warn').show();
            // }

            //法律告知
            var readmeHtml = app.renderReadme(('1|2').split('|'));
            var productData = JSON.parse(window.sessionStorage.getItem('productData'));
            var applicantMiniAge = productData.productInfo.planList[0].applicantMiniAge - 0 || 25;
            var applicantMaxAge = productData.productInfo.planList[0].applicantMaxAge - 0 || 50;
            var applicantLimitedSex = productData.productInfo.planList[0].applicantLimitedSex - 0 || 0;
            $('#applicantInfo').data('min-max-sex', [applicantMiniAge, applicantMaxAge, applicantLimitedSex].join('-'));

        },

        init: function () {
            app.render();
            app.binding();
        }
    };
    app && app.init();
})();
