(function() {
    'use strict';

    var app = {

        setPayData: function() {
            var productData = JSON.parse(window.sessionStorage.getItem('productData'));
            var submit = JSON.parse(window.sessionStorage.getItem('submit'));

            //投保人
            var applicantInfoDom = $('#applicantInfo');
            var applicantName = applicantInfoDom.find('.to-validate-name').val().trim();
            var applicantCertificate = applicantInfoDom.find('.to-validate-certificate').val().trim();
            var applicantPhone = applicantInfoDom.find('.to-validate-phone').val().trim();
            var applicantEmail = applicantInfoDom.find('.to-validate-email').val().trim();
            var applicantSexDom = applicantInfoDom.find('.to-validate-man');
            var applicantSex = applicantSexDom.length === 0 ? window.validate.getBirthdayAndSexFromID(applicantCertificate).sex : (applicantSexDom.prop('checked') ? 'M' : 'F');

            //被保险人           
            var insurantInfoList = [];
            var insurantDomList = $('#insurantInfo').find('.section-body');
            var insurantDom, insurantCertificateType, insurantCertificateNo, manSexDom, insurantName, insurantSex, insurantBirthday, resultObj;
            for (var i = 0; i < insurantDomList.length; i++) {
                insurantDom = insurantDomList.eq(i);
                insurantCertificateType = insurantDom.find('.certificate-type').val().trim();
                insurantCertificateNo = insurantDom.find('.to-validate-certificate').val().trim();
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

                insurantInfoList.push({
                    insurantInfo: {
                        'sexCode': insurantSex,
                        'mobileTelephone': '',
                        'personnelAttribute': '100',
                        'birthday': insurantBirthday,
                        'certificateNo': insurantCertificateNo,
                        'certificateType': insurantCertificateType,
                        'firstNameSpell': '',
                        'personnelAge': '',
                        'virtualInsuredNum': '1',
                        'email': '',
                        'address': '',
                        'familyNameSpell': '',
                        'destinationCountry': '',
                        'personnelName': insurantName
                    }
                });
            }

            //提交数据
            var payData = {
                'TRAN_CODE': '000093',
                'isIcpHtml': '1',
                'PRODUCTCODE': submit.productCode,
                'channelSourceCode': productData.accountInfo.CHANNEL_SOURCE_DETAIL_CODE,
                'payType': submit.payType,
                'planName': submit.planName,
                'secondMediaSource': submit.secondMediaSource,
                'remark': submit.remark,
                'mediaSource': productData.ACCOUNT,
                'ahsPolicy': {
                    'subjectInfo': [{
                        'subjectInfo': {
                            'totalModalPremium': $('#packageAmount').text(),
                            'insurantInfo': insurantInfoList,
                            'productInfo': [{
                                'productInfo': {
                                    'totalModalPremium': submit.packageAmount,
                                    'applyNum': '1',
                                    'productCode': submit.planCode
                                }
                            }]
                        }
                    }],
                    'policyBaseInfo': {
                        'totalModalPremium': $('#packageAmount').text(),
                        'insuranceBeginTime': submit.insuranceBeginTime + ' 00:00:00',
                        'currecyCode': '01',
                        'relationshipWithInsured': '9',
                        'businessType': '2',
                        'applyPersonnelNum': '1',
                        'insuranceEndTime': submit.insuranceEndTime + ' 23:59:59',
                        'applyDay': submit.maxInsuranceDay,
                        'applyMonth': submit.maxInsuranceMonth
                    },
                    'policyExtendInfo': {
                        'isSendInvoice': '3',
                        'invokeMobilePhone': applicantPhone,
                        'invokeEmail': applicantEmail
                    },
                    'insuranceApplicantInfo': {
                        'groupPersonnelInfo': {
                            'groupName': applicantName,
                            'groupCertificateType': '03',
                            'groupCertificateNo': applicantCertificate,
                            'linkManName': applicantName,
                            'linkManSexCode': applicantSex,
                            'linkManMobileTelephone': applicantPhone,
                            'linkManEmail': applicantEmail,
                            'companyAttribute': '9'
                        }
                    }
                }
            };

            window.sessionStorage.setItem('payData', JSON.stringify(payData));
        },

        pay: function() {
            var payData = window.sessionStorage.getItem('payData');

            $.ajax({
                url: '/icp/applypolicy/standardAhsDeal.do',
                type: 'post',
                data: payData,
                success: function(res) {
                    res && typeof res === 'string' && JSON.parse(res);
                    if (res.code === '00') {
                        //埋点统计
                        window.tool.payBtnTJ && window.tool.payBtnTJ();
                        window.location.href = res.payUrl;
                    } else {
                        window.wAlert('投保失败，请稍候重试');
                    }
                },
                error: function() {
                    window.wAlert('网络出错，请稍后重试');
                },
                complete: function() {
                    $('#pay').removeClass('disabled');
                }
            });
        },

        setIframe: function($target) {
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
            window.onpopstate = function(e) {
                $('.content').show();
                $('.iframe-container').remove();
                $('.title').text(headerTitle);
            };
        },

        initBirthdayTime: function() {
            var domList = $('.form-control-birthday');
            for (var i = 0; i < domList.length; i++) {
                domList.eq(i).datetimePicker({
                    title: '选择日期',
                    yearSplit: '-',
                    monthSplit: '-',
                    datetimeSplit: ' ',
                    times: function() {
                        return [];
                    }
                });
            }
        },

        setPrice: function() {
            var submit = JSON.parse(window.sessionStorage.getItem('submit'));
            if (!submit) {
                window.wAlert('数据有误');
                return false;
            }

            var quantity = $('#insurantInfo').find('.section-body').length || 1;
            var price = submit.packageAmount || 0;
            $('#packageAmount').text(price * quantity);
        },

        setInsurantOrder: function() {
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

        validate: function() {
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

        binding: function() {
            $('.page')
                .on('change', '.certificate-type', function() { //切换证件类型
                    var dynamicItemDomList = $(this).closest('.section-body').find('.dynamic-item');

                    if ($.trim($(this).val()) === '01') {
                        dynamicItemDomList.remove();
                    } else {
                        var html = '<li class="dynamic-item"> <div class="form-group">  <p class="form-group-label"> <span class="icon"><i class="icon-birthday"></i></span>出生日期 </p> <label> <input type="text" class="form-control form-control-birthday  to-validate  to-validate-birthday" placeholder="必填"> </label> </div> </li> <li class="dynamic-item"> <div class="form-group">  <p class="form-group-label"><span class="icon"><i class="icon-sex"></i></span>性别 </p> <form> <span class="form-control-radio"><input class="to-validate to-validate-man" type="radio" name="sex" checked>男</span> <span class="form-control-radio"><input class="to-validate to-validate-woman" type="radio" name="sex">女</span> </form> </div> </li>';
                        dynamicItemDomList.length === 0 && $(this).closest('li').next().after(html);
                        app.initBirthdayTime();
                    }
                })
                .on('click', '.icon-remove', function() { //删除    
                    $(this).parent().remove();
                    app.setInsurantOrder();
                    app.setPrice();
                })
                .on('click', '.btn-add', function() { //添加
                    var submit = JSON.parse(window.sessionStorage.getItem('submit'));
                    var sectinMainDom = $('.section-main');
                    var sum = sectinMainDom.find('ul').length;

                    if (submit.maxInsuredNumber && sum === submit.maxInsuredNumber - 0) {
                        window.wAlert('最多能添加' + submit.maxInsuredNumber + '个被保险人');
                        return false;
                    }

                    var html = '<ul class="section-body"> <i class="icon-remove">删除</i> <li> <div class="form-group">  <p class="form-group-label"><span class="icon"><i class="icon-man"></i></span>姓名 </p> <label> <input type="text" class="form-control  to-validate  to-validate-name" placeholder="必填"> </label> </div> </li> <li> <div class="form-group form-group-select">  <p class="form-group-label"><span class="icon"><i class="icon-card"></i></span>证件类型 </p> <label> <select class="form-control form-control-select certificate-type"> <option value="01">身份证</option> <option value="02">护照</option> <option value="03">军官证</option> <option value="05">驾驶证</option> <option value="06">港澳回乡证或台胞证</option> <option value="99">其他</option> </select> </label> </div> </li> <li> <div class="form-group">  <p class="form-group-label"> <span class="icon"><i class="icon-card-num"></i></span>证件号码 </p> <label> <input type="text" class="form-control  to-validate  to-validate-certificate" placeholder="必填"> </label> </div> </li> </ul>';
                    sectinMainDom.append(html);
                    app.setInsurantOrder();
                    $(window).scrollTop($(document).height());

                    app.setPrice();
                })
                .on('click', '#pay', function() { //支付
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

                    var $readmeCheckbox = $('.readme-checkbox');
                    if ($readmeCheckbox.length > 0 && !$readmeCheckbox.prop('checked')) {
                        window.wAlert('请勾选同意相关投保告知信息');
                        return false;
                    }

                    app.setPayData();
                    app.pay();
                    $(this).addClass('disabled');
                })
                .on('click', '.text-inner', function() { //保险条款                    
                    app.setIframe($(this));
                });
        },

        recoverPayData: function(html) {
            $('.page').html(html);
        },

        renderReadme: function(arr) {
            var resultStr = '';
            var hash = {
                1: '《保险条款》',
                2: '《投保人声明》',
                3: '《可投保职业分类表》'
            };

            if (arr instanceof Array && arr.length) {
                resultStr = '<label> <input class="readme-checkbox" type="checkbox" checked> 本人已阅读并同意 </label> <div class="readme-desc"> ';
                var html = arr.map(function(elem, index) {
                    if (hash[elem]) {
                        return '<span class="text-inner" data-hash="' + elem + '">' + hash[elem] + '</span> ';
                    }
                }).join('');
                resultStr += html + '</div>';
            }
            return resultStr;
        },

        render: function() {
            var submit = JSON.parse(window.sessionStorage.getItem('submit'));
            if (!submit) {
                window.wAlert('数据有误');
                return false;
            }

            var html = '';
            if (!submit.minInsuredNumber || !submit.maxInsuredNumber || submit.maxInsuredNumber > 0) {
                html = '<section id="insurantInfo"> <h2 class="section-title">被保险人信息</h2> <div class="section-main"><ul class="section-body" data-order="被保险人"> <i class="icon-remove">删除</i> <li> <div class="form-group"> <p class="form-group-label"><span class="icon"><i class="icon-man"></i></span>姓名 </p> <label> <input type="text" class="form-control to-validate to-validate-name" placeholder="必填"> </label> </div> </li> <li> <div class="form-group form-group-select"> <p class="form-group-label"><span class="icon"><i class="icon-card"></i></span>证件类型 </p> <label> <select class="form-control form-control-select certificate-type"> <option value="01">身份证</option> <option value="02">护照</option> <option value="03">军官证</option> <option value="05">驾驶证</option> <option value="06">港澳回乡证或台胞证</option> <option value="99">其他</option> </select> </label> </div> </li> <li> <div class="form-group"> <p class="form-group-label"> <span class="icon"><i class="icon-card-num"></i></span>证件号码 </p> <label> <input type="text" class="form-control to-validate to-validate-certificate" placeholder="必填"> </label> </div> </li> </ul></div> <div class="section-footer"> <a class="btn-add" href="javascript:void(0);" id="addInsurant">添加被保险人</a> </div> </section>';
            }

            //法律告知
            var readmeHtml = app.renderReadme((submit.lawPolicy || '1|2').split('|'));
            $('.readme').before(html).html(readmeHtml);

            $('#applicantInfo').data('min-max-sex', [submit.applicantMiniAge, submit.applicantMaxAge, submit.applicantLimitedSex].join('-'));
            $('#insurantInfo').data('min-max-sex', [submit.insuredMiniAge, submit.insuredMaxAge, submit.insuredLimitedSex].join('-'));
            $('#packageAmount').text(submit.packageAmount || '');
        },

        init: function() {
            $(".loading").hide();
            app.render();
            app.binding();
        }
    };

    app && app.init();
})();
