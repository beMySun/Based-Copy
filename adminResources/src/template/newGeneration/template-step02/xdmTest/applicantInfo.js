(function () {
    var DATA;
    var app = {
        setPayData: function () {
            var productData = JSON.parse(window.sessionStorage.getItem('productData'));
            var submit = JSON.parse(window.sessionStorage.getItem('submit'));

            // 标的信息
            var houseInfoDom = $('#houseInfo');

            //投保人
            var applicantInfoDom = $('#applicantInfo');
            var applicantName = applicantInfoDom.find('.to-validate-name').val().trim();
            var applicantCertificateType = applicantInfoDom.find('.certificate-type').val().trim();
            var applicantCertificate = $.trim(applicantInfoDom.find('.to-validate-certificate').val());
            var applicantPhone = applicantInfoDom.find('.to-validate-phone').val().trim();
            var applicantEmail = applicantInfoDom.find('.to-validate-email').val().trim();
            var applicantSexDom = applicantInfoDom.find('.to-validate-man');
            var applicantSex, applicantBirthday, applicantAge;

            if (applicantSexDom.length === 0) {
                resultObj = window.validate.getBirthdayAndSexFromID(applicantCertificate);
                applicantSex = resultObj.sex;
                applicantBirthday = resultObj.birthday;
            } else {
                applicantSex = applicantSexDom.prop('checked') ? 'M' : 'F';
                applicantBirthday = applicantInfoDom.find('.to-validate-birthday').val().trim();
            }
            applicantAge = window.validate.getAgeFromBirthday(applicantBirthday);

            //被保险人      
            var insurantInfoList = [];
            var insurantDomList = $('#insurantInfo').find('.section-body');
            var insurantDom, insurantCertificateType, insurantCertificateNo, manSexDom, insurantName, insurantSex, insurantBirthday, insurantAge, resultObj;
            for (var i = 0; i < insurantDomList.length; i++) {
                insurantDom = insurantDomList.eq(i);
                insurantCertificateType = insurantDom.find('.certificate-type').val().trim();
                insurantCertificateNo = $.trim(insurantDom.find('.to-validate-certificate').val());
                manSexDom = insurantDom.find('.to-validate-man');
                insurantName = insurantDom.find('.to-validate-name').val().trim();

                if (manSexDom.length === 0) {
                    resultObj = window.validate.getBirthdayAndSexFromID(insurantCertificateNo);
                    insurantSex = resultObj.sex;
                    insurantBirthday = resultObj.birthday;
                } else {
                    insurantSex = manSexDom.prop('checked') ? 'M' : 'F';
                    insurantBirthday = insurantDom.find('.to-validate-birthday').val().trim();
                }
                insurantAge = window.validate.getAgeFromBirthday(insurantBirthday);

                insurantInfoList.push({
                    name: insurantName,
                    linkManName: insurantName,
                    certificateNo: insurantCertificateNo || insurantBirthday,
                    certificateType: insurantCertificateType,
                    totalActualPremium: $('#packageAmount').text(),
                    personnelType: '1',
                    birthday: insurantBirthday,
                    age: insurantAge - 0,
                    sexCode: insurantSex,
                    mobileTelephone: applicantPhone,
                    province: $('input[name=provinceCode]').val(),
                    city: $('input[name=cityCode]').val(),
                    address: $('input[name=provinceName]').val() + $('input[name=cityName]').val()
                });
            }

            var otherInfoList = [];

            var addressList = $('.to-validate-address');

            for (var i = 0; i < addressList.length; i++) {
                otherInfoList.push({
                    provinceName: $('.to-validate-address').eq(i).data('provinceName'),
                    provinceCode: $('.to-validate-address').eq(i).data('provinceCode'),
                    cityName: $('.to-validate-address').eq(i).data('cityName'),
                    cityCode: $('.to-validate-address').eq(i).data('cityCode'),
                    dutyCode: submit.dutyCode,
                    insurantAmount: submit.insurantAmount,
                    premiumAmount: submit.premiumAmount
                })
            }

            // ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
            // @desc 需要维护的责任数据
            var dutyA = [{
                "totalInsuredAmount": 240000,
                "dutyAttributeInfoList": [{
                    "dutyAttributeName": "每人医疗费用赔偿限额",
                    "dutyAttrCode": "28",
                    "dutyAttrAmountValue": "40000"
                }, {
                    "dutyAttributeName": "每人死亡限额",
                    "dutyAttrCode": "45",
                    "dutyAttrAmountValue": "80000"
                }, {
                    "dutyAttributeName": "每人伤残限额",
                    "dutyAttrCode": "46",
                    "dutyAttrAmountValue": "200000"
                }],
                "totalActualPremium": 39,
                "dutyCode": "CV00481",
                "totalStandardPremium": 39,
                "dutyName": "疫苗接种异常反应导致的身故、残疾及医疗费"
            }, {
                "totalInsuredAmount": 240000,
                "dutyAttributeInfoList": [{
                    "dutyAttributeName": "每人医疗费用赔偿限额",
                    "dutyAttrCode": "28",
                    "dutyAttrAmountValue": "40000.0"
                }, {
                    "dutyAttributeName": "每人死亡限额",
                    "dutyAttrCode": "45",
                    "dutyAttrAmountValue": "80000.0"
                }, {
                    "dutyAttributeName": "每人伤残限额",
                    "dutyAttrCode": "46",
                    "dutyAttrAmountValue": "200000.0"
                }],
                "totalActualPremium": 39,
                "dutyCode": "CV00482",
                "totalStandardPremium": 39,
                "dutyName": "疫苗接种偶合症导致的身故、残疾及医疗费"
            }, {
                "totalInsuredAmount": 100000,
                "dutyAttributeInfoList": [{
                    "dutyAttributeName": "不排除病例事故伤残限额",
                    "dutyAttrCode": "46",
                    "dutyAttrAmountValue": "10000.0"
                }],
                "totalActualPremium": 39,
                "dutyCode": "CV00483",
                "totalStandardPremium": 39,
                "dutyName": "疫苗接种不排除病例导致的身故、残疾及医疗费"
            }];

            var dutyB = [{
                "totalInsuredAmount": 360000,
                "dutyAttributeInfoList": [{
                    "dutyAttributeName": "每人医疗费用赔偿限额",
                    "dutyAttrCode": "28",
                    "dutyAttrAmountValue": "60000"
                }, {
                    "dutyAttributeName": "每人死亡限额",
                    "dutyAttrCode": "45",
                    "dutyAttrAmountValue": "120000"
                }, {
                    "dutyAttributeName": "每人伤残限额",
                    "dutyAttrCode": "46",
                    "dutyAttrAmountValue": "300000"
                }],
                "totalActualPremium": 69,
                "dutyCode": "CV00481",
                "totalStandardPremium": 69,
                "dutyName": "疫苗接种异常反应导致的身故、残疾及医疗费"
            }, {
                "totalInsuredAmount": 360000,
                "dutyAttributeInfoList": [{
                    "dutyAttributeName": "每人医疗费用赔偿限额",
                    "dutyAttrCode": "28",
                    "dutyAttrAmountValue": "60000.0"
                }, {
                    "dutyAttributeName": "每人死亡限额",
                    "dutyAttrCode": "45",
                    "dutyAttrAmountValue": "120000.0"
                }, {
                    "dutyAttributeName": "每人伤残限额",
                    "dutyAttrCode": "46",
                    "dutyAttrAmountValue": "300000.0"
                }],
                "totalActualPremium": 69,
                "dutyCode": "CV00482",
                "totalStandardPremium": 69,
                "dutyName": "疫苗接种偶合症导致的身故、残疾及医疗费"
            }, {
                "totalInsuredAmount": 20000,
                "dutyAttributeInfoList": [{
                    "dutyAttributeName": "不排除病例事故伤残限额",
                    "dutyAttrCode": "46",
                    "dutyAttrAmountValue": "20000.0"
                }],
                "totalActualPremium": 69,
                "dutyCode": "CV00483",
                "totalStandardPremium": 69,
                "dutyName": "疫苗接种不排除病例导致的身故、残疾及医疗费"
            }];

            var dutyC = [{
                "totalInsuredAmount": 600000,
                "dutyAttributeInfoList": [{
                    "dutyAttributeName": "每人医疗费用赔偿限额",
                    "dutyAttrCode": "28",
                    "dutyAttrAmountValue": "100000"
                }, {
                    "dutyAttributeName": "每人死亡限额",
                    "dutyAttrCode": "45",
                    "dutyAttrAmountValue": "200000"
                }, {
                    "dutyAttributeName": "每人伤残限额",
                    "dutyAttrCode": "46",
                    "dutyAttrAmountValue": "500000"
                }],
                "totalActualPremium": 109,
                "dutyCode": "CV00481",
                "totalStandardPremium": 109,
                "dutyName": "疫苗接种异常反应导致的身故、残疾及医疗费"
            }, {
                "totalInsuredAmount": 600000,
                "dutyAttributeInfoList": [{
                    "dutyAttributeName": "每人医疗费用赔偿限额",
                    "dutyAttrCode": "28",
                    "dutyAttrAmountValue": "100000.0"
                }, {
                    "dutyAttributeName": "每人死亡限额",
                    "dutyAttrCode": "45",
                    "dutyAttrAmountValue": "200000.0"
                }, {
                    "dutyAttributeName": "每人伤残限额",
                    "dutyAttrCode": "46",
                    "dutyAttrAmountValue": "500000.0"
                }],
                "totalActualPremium": 109,
                "dutyCode": "CV00482",
                "totalStandardPremium": 109,
                "dutyName": "疫苗接种偶合症导致的身故、残疾及医疗费"
            }, {
                "totalInsuredAmount": 30000,
                "dutyAttributeInfoList": [{
                    "dutyAttributeName": "不排除病例事故伤残限额",
                    "dutyAttrCode": "46",
                    "dutyAttrAmountValue": "10000.0"
                }],
                "totalActualPremium": 109,
                "dutyCode": "CV00483",
                "totalStandardPremium": 109,
                "dutyName": "疫苗接种不排除病例导致的身故、残疾及医疗费"
            }];

            var dutyHash = {
                MP0700012101: dutyA,
                MP0700012102: dutyB,
                MP0700012103: dutyC
            };
            var dutyInfoList = dutyHash[submit.packageCode];

            //提交数据
            // var payData = {
            //     packageCode: submit.packageCode,
            //     planCode: submit.planCode,
            //     keyCode: submit.keyCode,
            //     goods: submit.pageTitle,
            //     applicantInfoList: JSON.stringify([{
            //         name: applicantName,
            //         certificateNo: applicantCertificate,
            //         certificateType: applicantCertificateType,
            //         mobileTelephone: applicantPhone,
            //         email: applicantEmail,
            //         personnelType: '0',
            //         birthday: applicantBirthday,
            //         sexCode: applicantSex
            //     }]),
            //     insurantInfoList: JSON.stringify(insurantInfoList),
            //     provinceName: $("input[name=provinceName]").val(),
            //     provinceCode: $("input[name=provinceCode]").val(),
            //     cityName: $("input[name=cityName]").val(),
            //     cityCode: $("input[name=cityCode]").val(),

            //     dutyCode: submit.dutyCode,
            //     insurantAmount: dutyInfoList[0].totalInsuredAmount,
            //     premiumAmount: submit.premiumAmount,
            //     userID: submit.userID,
            //     homeUrl: submit.homeUrl,
            //     dutyInfoList: JSON.stringify(dutyInfoList),
            //     insurantBeginDate: submit.insuranceBeginTime + ' 00:00:00',
            //     insurantEndDate: submit.insuranceEndTime + ' 23:59:59'
            // };


            var payData = {

                applicantInfoList: JSON.stringify([{
                    name: applicantName,
                    linkManName: applicantName,
                    certificateNo: applicantCertificate,
                    certificateType: applicantCertificateType,
                    mobileTelephone: applicantPhone,
                    email: applicantEmail,
                    personnelType: '1',
                    birthday: applicantBirthday,
                    sexCode: applicantSex,
                    age: parseInt(applicantAge, 10)
                }]),

                insurantInfoList: JSON.stringify(insurantInfoList),

                baseInfo: JSON.stringify({
                    productCode: submit.planCode,
                    productName: submit.pageTitle,
                    packageCode: submit.packageCode,
                    userId: submit.userID,
                    plansId: submit.plansId,
                    totalActualPremium: parseInt(submit.premiumAmount, 10),
                    totalInsuredAmount: parseInt(dutyInfoList[0].totalInsuredAmount, 10),
                    insuranceBeginDate: submit.insuranceBeginTime + ' 00:00:00',
                    insuranceEndDate: submit.insuranceEndTime + ' 23:59:59'
                }),
                schemeNo: submit.schemeNo
            };

            DATA = payData;

            //出生日期转换为99证件类型，只转换提交的数据，缓存数据不能转换
            var tempData = JSON.parse(DATA.insurantInfoList);
            tempData[0].certificateType === '099' && (tempData[0].certificateType = '99');
            DATA.insurantInfoList = JSON.stringify(tempData);

            // 数据缓存
            var sessionData = {
                applicantInfo: {
                    name: applicantName,
                    certificateType: applicantCertificateType,
                    certificateNo: applicantCertificate,
                    birthday: applicantBirthday,
                    sex: applicantSex,
                    mobileTelephone: applicantPhone,
                    email: applicantEmail,
                },
                insurantInfo: {
                    name: insurantName,
                    certificateType: insurantCertificateType,
                    certificateNo: insurantCertificateNo,
                    birthday: insurantBirthday,
                    sex: insurantSex,
                    provinceName: $("input[name=provinceName]").val(),
                    provinceCode: $("input[name=provinceCode]").val(),
                    cityName: $("input[name=cityName]").val(),
                    cityCode: $("input[name=cityCode]").val()
                }
            }

            window.sessionStorage.setItem('sessionData', JSON.stringify(sessionData));
        },

        pay: function () {
            $.ajax({
                // url: '/icp/xiaodoumiao/applyByAIBSSystem.do',
                url: '/icp/xiaodoumiao/applyByEBCS.do',
                type: 'post',
                data: DATA,
                success: function (res) {

                    res && typeof res === 'string' && JSON.parse(res);

                    console.log(res);

                    if (res.resultCode === '00') {
                        var submit = JSON.parse(window.sessionStorage.getItem('submit'));
                        var data = {
                            keyCode: submit.keyCode,
                            productName: submit.pageTitle,
                            applyPolicyNo: res.applyPolicyNo,
                            homeUrl: submit.homeUrl
                        };

                        var result = res.result;
                        $('input[name=applyPolicyNo]').val(result.applyPolicyNo);
                        $('input[name=businessNo]').val(result.businessNo);
                        $('input[name=totalInsuredAmount]').val(result.totalInsuredAmount);
                        $('input[name=totalActualPremium]').val(result.totalActualPremium);
                        $('input[name=dataSource]').val(result.dataSource);
                        $('input[name=callBackUrl]').val(result.callBackUrl);
                        $('input[name=returnUrl]').val(result.returnUrl);
                        $('input[name=customerName]').val(result.customerName);
                        $('input[name=phoneNo]').val(result.phoneNo);
                        $('input[name=currencyNo]').val(result.currencyNo);
                        $('input[name=certNo]').val(result.certNo);
                        $('input[name=certType]').val(result.certType);
                        $('input[name=amount]').val(result.amount);
                        $('input[name=npsPayUrl]').val(result.npsPayUrl);
                        $('input[name=signMsg]').val(result.signMsg);
                        $('input[name=productName]').val(result.signMsg || submit.pageTitle);

                        //埋点统计
                        window.tool.payBtnTJ && window.tool.payBtnTJ();

                        var formObj = document.getElementById('goPay');
                        formObj.action = result.npsPayUrl;
                        formObj.target = "_self";
                        formObj.method = "post";
                        $('#pay').removeClass('disabled');

                        // formObj.submit();
                        // tip: 微信不允许代码触发submit,可能是出于安全考虑 需要手动触发事件提交

                        $('#goPay').trigger('click');
                        // click 事件代码：
                        // from: this.submit();

                        // $.ajax({
                        //     url: "/icp/xiaodoumiao/payByAIBS.do",
                        //     type: 'post',
                        //     data: data,
                        //     success: function (res) {
                        //         if (res.resultCode === '00' && res.result) {
                        //             var ori = res.result;
                        //             var codes = ori.replace(/<[^>]+>/g, "");
                        //             var sss = codes.replace('window.onload', 'ss');
                        //             (eval(sss))();
                        //         } else {
                        //             window.wAlert(res.resultMsg || '系统异常，请稍后重试');
                        //         }
                        //     },
                        //     error: function () {
                        //         window.wAlert('网络出错，请稍后重试');
                        //     },
                        //     complete: function () {
                        //         $('#pay').removeClass('disabled');
                        //     }
                        // });

                    } else {
                        $('#pay').removeClass('disabled');
                        window.wAlert(res.resultMsg || '系统异常，请稍后重试');
                    }
                },
                error: function () {
                    $('#pay').removeClass('disabled');
                    window.wAlert('网络出错，请稍后重试');
                }
            });
        },

        setIframe: function ($target) {
            var submit = JSON.parse(window.sessionStorage.getItem('submit'));
            var targetHash = ($target.data('hash') + '').trim();
            var div;

            //div创建
            switch (targetHash) {
                case '1':
                    div = document.createElement('iframe');
                    div.src = window.location.origin + '/icp_core_dmz/web/' + submit.planCode + '.html';
                    break;
                case '2':
                    div = document.createElement('div');
                    div.innerHTML = submit.applicantStatement || '暂无描述';
                    break;
                case '3':
                    div = document.createElement('iframe');
                    div.src = window.location.origin + '/icp_core_dmz/web/' + submit.planCode + 'career.html';
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
                2: '投保人声明',
                3: '可投保职业分类表'
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
                app.setPayData();
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

        setPrice: function () {
            var submit = JSON.parse(window.sessionStorage.getItem('submit'));
            if (!submit) {
                window.wAlert('数据有误');
                return false;
            }

            var quantity = $('#insurantInfo').find('.section-body').length || 1;
            var price = submit.packageAmount || 0;
            $('#packageAmount').text(price * quantity);
        },

        setInsurantOrder: function () {
            var domList = $('#insurantInfo').find('.section-body');
            var domListLength = domList.length;

            if (domListLength === 1) {
                domList.eq(0).data('order', '被保险人');
                return;
            }

            for (var i = 0; i < domListLength; i++) {
                domList.eq(i).data('order', '第' + (i + 1) + '个被保险人');
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

                if (toValidateDom.hasClass('to-validate-null')) { //标的地址、详细地址
                    result = window.validate.validateNull($.trim(toValidateDom.val()), toValidateDom.closest('.form-group').find('.form-group-label').text().trim());
                    if (result.isValid) {
                        continue;
                    }
                    return result;
                }

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
                    if (certificateType === '01') { //身份证
                        var limitedArray = toValidateDom.closest('section').data('min-max-sex').split('-');
                        result = window.validate.validateCertificate($.trim(toValidateDom.val()), limitedArray);
                    } else {
                        result = window.validate.validateCertificate($.trim(toValidateDom.val()));
                    }
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

                // if (toValidateDom.hasClass('to-validate-email')) { //邮箱
                //     result = window.validate.validateEmail($.trim(toValidateDom.val()));
                //     if (result.isValid) {
                //         continue;
                //     }
                //     result.msg = toValidateDom.closest('.section-body').data('order') + result.msg;
                //     return result;
                // }
            }

            return result;
        },

        binding: function () {
            $('.page')
                .on('change', '.certificate-type', function () { //切换证件类型

                    var certificateType = $.trim($(this).val());
                    var dynamicItemDomList = $(this).closest('.section-body').find('.dynamic-item');

                    if ($(this).closest('.section-main').length) { //操作被保险人证件类型时，做隐藏操作
                        $('.readme .toast-msg').addClass('hide');
                    }

                    if (certificateType === '01') {
                        dynamicItemDomList.remove();
                        $(this).closest('li').after('<li class="dynamic-item"> <div class="form-group"> <p class="form-group-label"> <span class="icon"><i class="icon-card-num"></i></span>证件号码 </p> <label> <input type="text" class="form-control to-validate to-validate-certificate" placeholder="必填"> </label> </div> </li>');
                    } else if (certificateType === '099') { //出生日期
                        dynamicItemDomList.remove();
                        var html = '<li class="dynamic-item"> <div class="form-group">  <p class="form-group-label"> <span class="icon"><i class="icon-birthday"></i></span>出生日期 </p> <label> <input type="text" class="form-control form-control-birthday  to-validate  to-validate-birthday" placeholder="必填"> </label> </div> </li> <li class="dynamic-item"> <div class="form-group">  <p class="form-group-label"><span class="icon"><i class="icon-sex"></i></span>性别 </p> <form> <span class="form-control-radio"><input class="to-validate to-validate-man" type="radio" name="sex" checked>男</span> <span class="form-control-radio"><input class="to-validate to-validate-woman" type="radio" name="sex">女</span> </form> </div> </li>';
                        $(this).closest('li').after(html);
                        $('.readme .toast-msg').removeClass('hide');
                    } else {
                        dynamicItemDomList.remove();
                        var html = '<li class="dynamic-item"> <div class="form-group"> <p class="form-group-label"> <span class="icon"><i class="icon-card-num"></i></span>证件号码 </p> <label> <input type="text" class="form-control to-validate to-validate-certificate" placeholder="必填"> </label> </div> </li><li class="dynamic-item"> <div class="form-group">  <p class="form-group-label"> <span class="icon"><i class="icon-birthday"></i></span>出生日期 </p> <label> <input type="text" class="form-control form-control-birthday  to-validate  to-validate-birthday" placeholder="必填"> </label> </div> </li> <li class="dynamic-item"> <div class="form-group">  <p class="form-group-label"><span class="icon"><i class="icon-sex"></i></span>性别 </p> <form> <span class="form-control-radio"><input class="to-validate to-validate-man" type="radio" name="sex" checked>男</span> <span class="form-control-radio"><input class="to-validate to-validate-woman" type="radio" name="sex">女</span> </form> </div> </li>';
                        $(this).closest('li').after(html);
                    }

                    app.initBirthdayTime();

                })
                .on('click', '.icon-remove', function () { //删除                  
                    $(this).parent().remove();
                    app.setInsurantOrder();
                    app.setPrice();
                })
                .on('click', '.btn-add', function () { //添加
                    var submit = JSON.parse(window.sessionStorage.getItem('submit'));
                    var sectinMainDom = $('.section-main');
                    var sum = sectinMainDom.find('ul').length;

                    if (submit.maxInsuredNumber && sum === submit.maxInsuredNumber - 0) {
                        window.wAlert('最多能添加' + submit.maxInsuredNumber + '个被保险人');
                        return false;
                    }

                    var html = '<ul class="section-body"><i class="icon-remove">删除</i><li><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-man"></i></span>姓名</p><label><input type="text" class="form-control to-validate to-validate-name" placeholder="必填"></label></div></li><li><div class="form-group form-group-select"><p class="form-group-label"><span class="icon"><i class="icon-card"></i></span>证件类型</p><label><select class="form-control form-control-select certificate-type"><option value="01">身份证</option><option value="99">出生证</option></select></label></div></li><li><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-card-num"></i></span>证件号码</p><label><input type="text" class="form-control to-validate to-validate-certificate" placeholder="必填"></label></div></li><li><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-address"></i></span>接种省市</p><label><input type="text" class="form-control to-validate to-validate-null to-validate-address" placeholder="必填" readonly onfocus="this.blur()"></label></div></li></ul>';
                    sectinMainDom.append(html);
                    app.setInsurantOrder();

                    $(window).scrollTop($(document).height());

                    app.setPrice();
                })
                .on('click', '#pay', function () { //支付

                    console.log('pay');

                    if ($(this).hasClass('disabled')) {
                        return;
                    }

                    var submit = JSON.parse(window.sessionStorage.getItem('submit'));
                    if (!submit) {
                        window.wAlert('数据有误');
                        return false;
                    }

                    var sectinMainDom = $('.section-main');
                    var sum = sectinMainDom.find('ul').length;
                    var minInsuredNumber = (submit.minInsuredNumber || 1) - 0;
                    if (sectinMainDom.length > 0 && sum < minInsuredNumber) {
                        window.wAlert('最少要添加' + minInsuredNumber + '个被保险人');
                        return false;
                    }

                    var result = app.validate();
                    if (!result.isValid) {
                        window.wAlert(result.msg);
                        return false;
                    }

                    var applicantemail = $('.to-validate-email').val().trim();

                    if (applicantemail) {
                        if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(applicantemail)) {
                            window.wAlert('邮箱格式有误');
                            return false;
                        }
                    }


                    var $readmeCheckbox = $('.readme-checkbox');
                    if ($readmeCheckbox.length > 0 && !$readmeCheckbox.prop('checked')) {
                        window.wAlert('请勾选同意相关投保告知信息');
                        return false;
                    }

                    app.setPayData();
                    app.pay();
                    $(this).addClass('disabled');
                })
                .on('click', '.text-inner', function () { //保险条款                    
                    app.setIframe($(this));
                })
                .on('click', '.to-validate-address', function () { //根据地区选择保险范围
                    var self = this;
                    window.scrollTo(0, window.innerHeight);
                    window.City.selectedCity(function (data) {
                        var provinceName = $('input[name=provinceName]').val();
                        var cityName = $('input[name=cityName]').val();
                        $(self).val(provinceName + ' ' + cityName);
                        $(self).data('provinceName', $("input[name=provinceName]").val());
                        $(self).data('provinceCode', $("input[name=provinceCode]").val());
                        $(self).data('cityName', $("input[name=cityName]").val());
                        $(self).data('cityCode', $("input[name=cityCode]").val());
                        $('#select_city').hide();

                        $(".title").text("投保信息");
                        setTimeout(function () {
                            window.scrollTo(0, window.innerHeight);
                        }, 50);
                        window.history.go(-2);
                    });
                    window.City.showProvince();
                    window.history.pushState({
                        title: '#selectCity'
                    }, '#selectCity', window.location.href + '#selectCity');
                    $(".title").text("选择所在地区");
                    window.onpopstate = function (e) {
                        $('#select_city').hide();
                        $(".title").text("投保信息");
                        window.scrollTo(0, window.innerHeight);
                    }
                })
        },

        recoverPayData: function (html) {
            $('.page').html(html);
        },

        renderReadme: function (arr) {
            var resultStr = '';
            var hash = {
                1: '《保险条款》',
                2: '《投保人声明》',
                3: '《可投保职业分类表》'
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

        render: function () {
            var submit = JSON.parse(window.sessionStorage.getItem('submit'));

            if (!submit) {
                window.wAlert('数据有误');
                return false;
            }

            var sessionData = JSON.parse(window.sessionStorage.getItem('sessionData'));

            if (sessionData) {
                var applicantInfo = sessionData.applicantInfo;
                var insurantInfo = sessionData.insurantInfo;

                // 地区信息和价格
                var premiumAmount = submit.premiumAmount;
                var provinceName = sessionData.insurantInfo.provinceName;
                var provinceCode = sessionData.insurantInfo.provinceCode;
                var cityCode = sessionData.insurantInfo.cityCode;
                var cityName = sessionData.insurantInfo.cityName;

                // 投保人信息
                var applicantName = applicantInfo.name;
                var applicantCertificateNo = applicantInfo.certificateNo;
                var applicantCertificateType = applicantInfo.certificateType;
                var applicantBirthday = applicantInfo.birthday;
                var applicantSex = applicantInfo.sex;
                var mobileTelephone = applicantInfo.mobileTelephone;
                var email = applicantInfo.email;

                // 被保人信息
                var insurantName = insurantInfo.name;
                var insurantCertificateNo = insurantInfo.certificateNo;
                var insurantCertificateType = insurantInfo.certificateType;
                var insurantSex = insurantInfo.sex;
                var insurantBirthday = insurantInfo.birthday;
            }


            var html = '';

            if (sessionData) {
                // 处理投保人页面缓存渲染

                $('#applicantInfo .to-validate-name').val(applicantName);
                $('#applicantInfo .to-validate-phone').val(mobileTelephone);
                $('#applicantInfo .to-validate-email').val(email);
                $('#applicantInfo .to-validate-certificate').val(applicantCertificateNo);

                // 判断缓存的证件类型
                if (applicantCertificateType !== '01') {
                    var str = '<li class="dynamic-item"> <div class="form-group">  <p class="form-group-label"> <span class="icon"><i class="icon-birthday"></i></span>出生日期 </p> <label> <input type="text" class="form-control form-control-birthday  to-validate  to-validate-birthday" placeholder="必填"> </label> </div> </li> <li class="dynamic-item"> <div class="form-group">  <p class="form-group-label"><span class="icon"><i class="icon-sex"></i></span>性别 </p> <form> <span class="form-control-radio"><input class="to-validate to-validate-man" type="radio" name="sex" checked>男</span> <span class="form-control-radio"><input class="to-validate to-validate-woman" type="radio" name="sex">女</span> </form> </div> </li>';
                    $('#applicantInfo .certificate-type').val(applicantCertificateType);

                    $('#applicantInfo .to-validate-certificate').parent().parent().parent().after(str);
                    $('#applicantInfo .to-validate-birthday').val(applicantBirthday);

                    if (applicantSex == 'M') {
                        $('#applicantInfo .to-validate-man').eq(0).prop('checked', true);
                    } else {
                        $('#applicantInfo .to-validate-woman').eq(0).prop('checked', true);
                    }
                }

                // 处理被保人页面缓存渲染
                if (!submit.minInsuredNumber || !submit.maxInsuredNumber || submit.maxInsuredNumber > 0) {
                    // if (insurantCertificateType != '01') { //非身份证
                    //     html = '<section id="insurantInfo"><h2 class="section-title">被保险人信息</h2><div class="section-main"><ul class="section-body" data-order="被保险人"><i class="icon-remove">删除</i><li><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-man"></i></span>姓名</p><label><input type="text" class="form-control to-validate to-validate-name" placeholder="必填"></label></div></li><li><div class="form-group form-group-select"><p class="form-group-label"><span class="icon"><i class="icon-card"></i></span>证件类型</p><label><select class="form-control form-control-select certificate-type"><option value="01">身份证</option><option value="99">出生证</option><option value="099">出生日期</option></select></label></div></li><li class="dynamic-item"><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-card-num"></i></span>证件号码</p><label><input type="text" class="form-control to-validate to-validate-certificate" placeholder="必填"></label></div></li><li class="dynamic-item"><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-birthday"></i></span>出生日期</p><label><input type="text" class="form-control form-control-birthday to-validate to-validate-birthday" placeholder="必填"></label></div></li><li class="dynamic-item"><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-sex"></i></span>性别</p><form><span class="form-control-radio"><input class="to-validate to-validate-man" type="radio" name="sex" checked>男</span><span class="form-control-radio"><input class="to-validate to-validate-woman" type="radio" name="sex">女</span></form></div></li><li><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-address"></i></span>接种省市</p><label><input type="text" class="form-control to-validate to-validate-null to-validate-address" placeholder="必填" readonly onfocus="this.blur()"></label></div></li></ul></div><div class="section-footer"><a class="btn-add" href="javascript:void(0);" id="addInsurant">添加被保险人</a></div></section>'
                    // } else { //身份证
                    //     html = '<section id="insurantInfo"> <h2 class="section-title">被保险人信息</h2> <div class="section-main"><ul class="section-body" data-order="被保险人"> <i class="icon-remove">删除</i> <li> <div class="form-group"> <p class="form-group-label"><span class="icon"><i class="icon-man"></i></span>姓名 </p> <label> <input type="text" class="form-control to-validate to-validate-name" placeholder="必填"> </label> </div> </li> <li> <div class="form-group form-group-select"> <p class="form-group-label"><span class="icon"><i class="icon-card"></i></span>证件类型 </p> <label> <select class="form-control form-control-select certificate-type"><option value="01">身份证</option><option value="99">出生证</option><option value="099">出生日期</option> </select> </label> </div> </li> <li class="dynamic-item"> <div class="form-group"> <p class="form-group-label"> <span class="icon"><i class="icon-card-num"></i></span>证件号码 </p> <label> <input type="text" class="form-control to-validate to-validate-certificate" placeholder="必填"> </label> </div> </li><li><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-address"></i></span>接种省市</p><label><input type="text"  class="form-control to-validate to-validate-null to-validate-address" placeholder="必填" readonly onfocus="this.blur()"></label></div></li> </ul></div> <div class="section-footer"> <a class="btn-add" href="javascript:void(0);" id="addInsurant">添加被保险人</a> </div> </section>';
                    // }

                    if (insurantCertificateType === '01') {
                        html = '<section id="insurantInfo"> <h2 class="section-title">被保险人信息</h2> <div class="section-main"><ul class="section-body" data-order="被保险人"> <i class="icon-remove">删除</i> <li> <div class="form-group"> <p class="form-group-label"><span class="icon"><i class="icon-man"></i></span>姓名 </p> <label> <input type="text" class="form-control to-validate to-validate-name" placeholder="必填"> </label> </div> </li> <li> <div class="form-group form-group-select"> <p class="form-group-label"><span class="icon"><i class="icon-card"></i></span>证件类型 </p> <label> <select class="form-control form-control-select certificate-type"><option value="099">出生日期</option> <option value="01">身份证</option><option value="99">出生证</option></select> </label> </div> </li> <li class="dynamic-item"> <div class="form-group"> <p class="form-group-label"> <span class="icon"><i class="icon-card-num"></i></span>证件号码 </p> <label> <input type="text" class="form-control to-validate to-validate-certificate" placeholder="必填"> </label> </div> </li><li><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-address"></i></span>接种省市</p><label><input type="text"  class="form-control to-validate to-validate-null to-validate-address" placeholder="必填" readonly onfocus="this.blur()"></label></div></li> </ul></div> <div class="section-footer"><a class="btn-add" href="javascript:void(0);" id="addInsurant">添加被保险人</a> </div> </section>';
                    } else if (insurantCertificateType === '099') { //出生日期
                        html = '<section id="insurantInfo"><h2 class="section-title">被保险人信息</h2><div class="section-main"><ul class="section-body" data-order="被保险人"><i class="icon-remove">删除</i><li><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-man"></i></span>姓名</p><label><input type="text" class="form-control to-validate to-validate-name" placeholder="必填"></label></div></li><li><div class="form-group form-group-select"><p class="form-group-label"><span class="icon"><i class="icon-card"></i></span>证件类型</p><label><select class="form-control form-control-select certificate-type"><option value="099">出生日期</option><option value="01">身份证</option><option value="99">出生证</option></select></label></div></li><li class="dynamic-item"><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-birthday"></i></span>出生日期</p><label><input type="text" class="form-control form-control-birthday to-validate to-validate-birthday" placeholder="必填"></label></div></li><li class="dynamic-item"><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-sex"></i></span>性别</p><form><span class="form-control-radio"><input class="to-validate to-validate-man" type="radio" name="sex" checked>男</span><span class="form-control-radio"><input class="to-validate to-validate-woman" type="radio" name="sex">女</span></form></div></li><li><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-address"></i></span>接种省市</p><label><input type="text" class="form-control to-validate to-validate-null to-validate-address" placeholder="必填" readonly onfocus="this.blur()"></label></div></li></ul></div><div class="section-footer"><a class="btn-add" href="javascript:void(0);" id="addInsurant">添加被保险人</a></div></section>'
                    } else {
                        html = '<section id="insurantInfo"><h2 class="section-title">被保险人信息</h2><div class="section-main"><ul class="section-body" data-order="被保险人"><i class="icon-remove">删除</i><li><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-man"></i></span>姓名</p><label><input type="text" class="form-control to-validate to-validate-name" placeholder="必填"></label></div></li><li><div class="form-group form-group-select"><p class="form-group-label"><span class="icon"><i class="icon-card"></i></span>证件类型</p><label><select class="form-control form-control-select certificate-type"><option value="099">出生日期</option><option value="01">身份证</option><option value="99">出生证</option></select></label></div></li><li class="dynamic-item"><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-card-num"></i></span>证件号码</p><label><input type="text" class="form-control to-validate to-validate-certificate" placeholder="必填"></label></div></li><li class="dynamic-item"><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-birthday"></i></span>出生日期</p><label><input type="text" class="form-control form-control-birthday to-validate to-validate-birthday" placeholder="必填"></label></div></li><li class="dynamic-item"><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-sex"></i></span>性别</p><form><span class="form-control-radio"><input class="to-validate to-validate-man" type="radio" name="sex" checked>男</span><span class="form-control-radio"><input class="to-validate to-validate-woman" type="radio" name="sex">女</span></form></div></li><li><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-address"></i></span>接种省市</p><label><input type="text" class="form-control to-validate to-validate-null to-validate-address" placeholder="必填" readonly onfocus="this.blur()"></label></div></li></ul></div><div class="section-footer"><a class="btn-add" href="javascript:void(0);" id="addInsurant">添加被保险人</a></div></section>'
                    }
                }

            } else { // 第一次进入页面(无缓存数据), 渲染身份证部分

                if (!submit.minInsuredNumber || !submit.maxInsuredNumber || submit.maxInsuredNumber > 0) {
                    // html = '<section id="insurantInfo"> <h2 class="section-title">被保险人信息</h2> <div class="section-main"><ul class="section-body" data-order="被保险人"> <i class="icon-remove">删除</i> <li> <div class="form-group"> <p class="form-group-label"><span class="icon"><i class="icon-man"></i></span>姓名 </p> <label> <input type="text" class="form-control to-validate to-validate-name" placeholder="必填"> </label> </div> </li> <li> <div class="form-group form-group-select"> <p class="form-group-label"><span class="icon"><i class="icon-card"></i></span>证件类型 </p> <label> <select class="form-control form-control-select certificate-type"><option value="099">出生日期</option><option value="01">身份证</option><option value="99">出生证</option></select> </label> </div> </li> <li  class="dynamic-item"> <div class="form-group"> <p class="form-group-label"> <span class="icon"><i class="icon-card-num"></i></span>证件号码 </p> <label> <input type="text" class="form-control to-validate to-validate-certificate" placeholder="必填"> </label> </div> </li><li><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-address"></i></span>接种省市</p><label><input type="text"  class="form-control to-validate to-validate-null to-validate-address" placeholder="必填" readonly onfocus="this.blur()"></label></div></li> </ul></div> <div class="section-footer"> <a class="btn-add" href="javascript:void(0);" id="addInsurant">添加被保险人</a> </div> </section>';
                    html = '<section id="insurantInfo"><h2 class="section-title">被保险人信息</h2><div class="section-main"><ul class="section-body" data-order="被保险人"><i class="icon-remove">删除</i><li><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-man"></i></span>姓名</p><label><input type="text" class="form-control to-validate to-validate-name" placeholder="必填"></label></div></li><li><div class="form-group form-group-select"><p class="form-group-label"><span class="icon"><i class="icon-card"></i></span>证件类型</p><label><select class="form-control form-control-select certificate-type"><option value="099">出生日期</option><option value="01">身份证</option><option value="99">出生证</option></select></label></div></li><li class="dynamic-item"><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-birthday"></i></span>出生日期</p><label><input type="text" class="form-control form-control-birthday to-validate to-validate-birthday" placeholder="必填"></label></div></li><li class="dynamic-item"><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-sex"></i></span>性别</p><form><span class="form-control-radio"><input class="to-validate to-validate-man" type="radio" name="sex" checked>男</span><span class="form-control-radio"><input class="to-validate to-validate-woman" type="radio" name="sex">女</span></form></div></li><li><div class="form-group"><p class="form-group-label"><span class="icon"><i class="icon-address"></i></span>接种省市</p><label><input type="text" class="form-control to-validate to-validate-null to-validate-address" placeholder="必填" readonly onfocus="this.blur()"></label></div></li></ul></div><div class="section-footer"><a class="btn-add" href="javascript:void(0);" id="addInsurant">添加被保险人</a></div></section>'

                }
            }


            var readmeHtml = app.renderReadme((submit.lawPolicy || '1|2').split('|')); //法律告知
            $('.readme').before(html).append(readmeHtml); // 插入动态元素和投保人声明到页面


            // 填充缓存值
            if (sessionData) {
                if (insurantCertificateType != '01') {
                    $('#insurantInfo .to-validate-name').eq(0).val(insurantName);
                    $('#insurantInfo .certificate-type').eq(0).val(insurantCertificateType);
                    $('#insurantInfo .to-validate-certificate').eq(0).val(insurantCertificateNo);
                    $('#insurantInfo .to-validate-birthday').eq(0).val(insurantBirthday);

                    if (insurantSex == 'M') {
                        $('#insurantInfo .to-validate-man').eq(0).prop('checked', true);
                    } else {
                        $('#insurantInfo .to-validate-woman').eq(0).prop('checked', true);
                    }
                    app.initBirthdayTime();

                } else {
                    $('#insurantInfo .to-validate-name').eq(0).val(insurantName);
                    $('#insurantInfo .certificate-type').eq(0).val(insurantCertificateType);
                    $('#insurantInfo .to-validate-certificate').eq(0).val(insurantCertificateNo);
                }

                $('#insurantInfo .to-validate-address').eq(0).val(provinceName + ' ' + cityName);

                // 读缓存填充到省市区数据源
                $('input[name=provinceName]').val(provinceName);
                $('input[name=provinceCode]').val(provinceCode);
                $('input[name=cityName]').val(cityName);
                $('input[name=cityCode]').val(cityCode);
            }

            $('#applicantInfo').data('min-max-sex', [submit.applicantMiniAge, submit.applicantMaxAge, submit.applicantLimitedSex].join('-'));
            $('#insurantInfo').data('min-max-sex', [submit.insuredMiniAge, submit.insuredMaxAge, submit.insuredLimitedSex].join('-'));
            $('#packageAmount').text(submit.packageAmount || '');

            if (submit.maxInsuredNumber == '1') {
                $('.icon-remove').hide();
                $('.section-footer').hide();
            }
            app.initBirthdayTime();
        },

        init: function () {
            $(".loading").hide();
            app.render();
            app.binding();
        }
    };

    app && app.init();
})();
