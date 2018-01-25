(function() {
    'use strict';

    var submit = JSON.parse(window.sessionStorage.getItem('submit'));
    if (!submit) {
        window.wAlert('数据有误');
        return false;
    }

    var hashObj = {
        1: '保险条款',
        2: '投保人声明',
        3: '可投保职业分类表'
    };

    var app = {
        //组装数据
        setPayData: function() {
            //产品信息
            var productInfo = {
                applyNum: submit.applyNum,
                totalActualPremium: $('#packageAmount').text(),
                insuranceBeginDate: submit.insuranceBeginTime,
                insuranceEndDate: submit.insuranceEndTime
            }

            //投保人信息
            var applicantInfoDom = $('#applicantInfo');
            var applicantName = applicantInfoDom.find('.to-validate-name').val().trim();
            var applicantCertificateType = applicantInfoDom.find('.certificate-type').val().trim();
            var applicantCertificateNo = applicantInfoDom.find('.to-validate-certificate').val().trim();
            var applicantPhone = applicantInfoDom.find('.to-validate-phone').val().trim();
            var applicantEmail = applicantInfoDom.find('.to-validate-email').val().trim();
            var applicantSexDom = applicantInfoDom.find('.to-validate-man');
            var applicantSex, applicantBirthday, resultObj;
            if (applicantSexDom.length === 0) {
                resultObj = window.validate.getBirthdayAndSexFromID(applicantCertificateNo);
                applicantSex = resultObj.sex;
                applicantBirthday = resultObj.birthday;
            } else {
                applicantSex = applicantSexDom.prop('checked') ? 'M' : 'F';
                applicantBirthday = applicantInfoDom.find('.to-validate-birthday').val().trim();
            }
            //投保人信息对个意、団意作区分
            var applicantInfo;
            if(submit.typeCode === '03') {
                applicantInfo = {
                    groupName: applicantName,
                    groupCertificateType: '99',
                    groupCertificateNo: applicantCertificateNo,
                    companyAttribute: '9',
                    linkManName: applicantName,
                    linkManMobileTelephone: applicantPhone,
                    linkManEmail: applicantEmail
                };
            }else{
                applicantInfo = {
                    name: applicantName,
                    certificateType: applicantCertificateType,
                    certificateNo: applicantCertificateNo,
                    birthday: applicantBirthday,
                    sexCode: applicantSex,
                    mobileTelephone: applicantPhone,
                    email: applicantEmail
                };
            }

            // if (submit.typeCode === '01') {
            //     var applicantInfo = {
            //         name: applicantName,
            //         certificateType: applicantCertificateType,
            //         certificateNo: applicantCertificateNo,
            //         birthday: applicantBirthday,
            //         sexCode: applicantSex,
            //         mobileTelephone: applicantPhone,
            //         email: applicantEmail
            //     };
            // } else if(submit.typeCode === '03') {
            //     var applicantInfo = {
            //         groupName: applicantName,
            //         groupCertificateType: '99',
            //         groupCertificateNo: applicantCertificateNo,
            //         companyAttribute: '9',
            //         linkManName: applicantName,
            //         linkManMobileTelephone: applicantPhone,
            //         linkManEmail: applicantEmail
            //     };
            // }
            
            //被保险人信息   
            var insurantInfoList = [];
            var insurantInfoDomList = $('#insurantInfo').find('.section-body');
            for (var i = 0; i < insurantInfoDomList.length; i++) {
                var insurantInfoDom = insurantInfoDomList.eq(i);
                var insurantName = insurantInfoDom.find('.to-validate-name').val().trim();
                var insurantCertificateType = insurantInfoDom.find('.certificate-type').val().trim();
                var insurantCertificateNo = insurantInfoDom.find('.to-validate-certificate').val().trim();
                var insurantSexDom = insurantInfoDom.find('.to-validate-man');
                var insurantSex, insurantBirthday, resultObj;
                if (insurantSexDom.length === 0) {
                    resultObj = window.validate.getBirthdayAndSexFromID(insurantCertificateNo);
                    insurantSex = resultObj.sex;
                    insurantBirthday = resultObj.birthday;
                } else {
                    insurantSex = insurantSexDom.prop('checked') ? 'M' : 'F';
                    insurantBirthday = insurantInfoDom.find('.to-validate-birthday').val().trim();
                }
                insurantInfoList.push({
                    name: insurantName,
                    certificateType: insurantCertificateType,
                    certificateNo: insurantCertificateNo,
                    birthday: insurantBirthday,
                    sexCode: insurantSex
                });
            }

            //提交的数据
            var payData = {
                partnerCode: submit.partnerCode,
                productId: submit.productId,
                planId: submit.planId,
                packageId: submit.packageId,
                typeCode: submit.typeCode,
                timestamp: window.tool.getCurrentDateTime(),
                orderNo: (new Date()).getTime()+''+parseInt(Math.random()*Math.pow(10,7)),
                productInfo: productInfo,
                applicantInfo: applicantInfo,
                insurantInfoList: insurantInfoList,
                extendInfo: {}
            };

            window.sessionStorage.setItem('payData', JSON.stringify(payData));
        },

        //支付
        pay: function() {
            var payData = window.sessionStorage.getItem('payData');

            $.ajax({
                url: '/icp/mobile_single_insurance/commonInsuranceApply.do',
                type: 'post',
                data: payData,
                success: function(res) {
                    res && typeof res === 'string' && JSON.parse(res);
                    if (res.resultCode === '00') {
                        //埋点统计
                        // var urlParameters = JSON.parse(window.sessionStorage.getItem('urlParameters'));
                        // SKAPP.onEvent(urlParameters.keyCode, '投保信息填写页面', { 订单支付: '支付按钮' });
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

        //保险条款、投保人声明等设置
        setIframe: function($target) {
            var targetHash = ($target.data('hash') + '').trim();
            var sonDom;

            switch (targetHash) {
                case '1':  //保险条款
                    sonDom = document.createElement('iframe');
                    sonDom.src = window.location.origin + '/icp_core_dmz/web/' + submit.planCode + '.html';
                    break;
                case '2':  //投保人声明
                    sonDom = document.createElement('div');
                    sonDom.innerHTML = submit.applicantStatement || '暂无描述';
                    break;
                case '3':  //可投保职业分类表
                    sonDom = document.createElement('iframe');
                    sonDom.src = window.location.origin + '/icp_core_dmz/web/' + submit.planCode + 'career.html';
                    break;
                default:
                    sonDom = document.createElement('div');
                    sonDom.innerHTML = '暂无描述';
                    break;
            }

            //容器处理
            var parentDom = document.createElement('div');
            parentDom.className = 'iframe-container';
            sonDom.className = 'desc';
            parentDom.appendChild(sonDom);
            $('.content').hide().after(parentDom);

            var $title = $('.title');
            var headerTitle = $title.text();  //更新title之前先保存之前的title
            $title.text(hashObj[targetHash] || '暂无描述');

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

        //初始化出生日期
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

        //设置保费
        setPrice: function() {
            var quantity = $('#insurantInfo').find('.section-body').length || 1;
            var price = submit.packageAmount || 0;
            $('#packageAmount').text(price * quantity);
        },

        //设置被保人次序
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

        //校验数据
        validate: function() {
            var result = {
                isValid: true,
                msg: 'ok'
            };

            var toValidateDomList = $('.to-validate');
            for (var i = 0; i < toValidateDomList.length; i++) {
                var toValidateDom = toValidateDomList.eq(i);

                if (toValidateDom.hasClass('to-validate-name')) {  //姓名
                    result = window.validate.validateName($.trim(toValidateDom.val()));
                    if (result.isValid) {
                        continue;
                    }
                    result.msg = toValidateDom.closest('.section-body').data('order') + result.msg;
                    return result;
                }

                if (toValidateDom.hasClass('to-validate-certificate')) {  //证件号
                    var certificateType = toValidateDom.closest('.section-body').find('.certificate-type').val();
                    if (certificateType === '01') {  //身份证
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

                if (toValidateDom.hasClass('to-validate-birthday')) {  //出生日期
                    var limitedArray = toValidateDom.closest('section').data('min-max-sex').split('-');
                    result = window.validate.validateBirthday($.trim(toValidateDom.val()), limitedArray[0], limitedArray[1]);
                    if (result.isValid) {
                        continue;
                    }
                    result.msg = toValidateDom.closest('.section-body').data('order') + result.msg;
                    return result;
                }

                if (toValidateDom.hasClass('to-validate-man')) {  //男
                    var limitedArray = toValidateDom.closest('section').data('min-max-sex').split('-');
                    result = window.validate.validateSex(toValidateDom.prop('checked') ? '1' : '2', limitedArray[2]);
                    if (result.isValid) {
                        continue;
                    }
                    result.msg = toValidateDom.closest('.section-body').data('order') + result.msg;
                    return result;
                }

                if (toValidateDom.hasClass('to-validate-woman')) {  //女
                    var limitedArray = toValidateDom.closest('section').data('min-max-sex').split('-');
                    result = window.validate.validateSex(toValidateDom.prop('checked') ? '2' : '1', limitedArray[2]);
                    if (result.isValid) {
                        continue;
                    }
                    result.msg = toValidateDom.closest('.section-body').data('order') + result.msg;
                    return result;
                }

                if (toValidateDom.hasClass('to-validate-phone')) {  //手机
                    result = window.validate.validatePhone($.trim(toValidateDom.val()));
                    if (result.isValid) {
                        continue;
                    }
                    result.msg = toValidateDom.closest('.section-body').data('order') + result.msg;
                    return result;
                }

                if (toValidateDom.hasClass('to-validate-email')) {  //邮箱
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
                .on('change', '.certificate-type', function() {  //证件类型切换
                    var dynamicItemDomList = $(this).closest('.section-body').find('.dynamic-item');

                    if ($.trim($(this).val()) === '01') {
                        dynamicItemDomList.remove();
                    } else {
                        var html = '<li class="dynamic-item"> <div class="form-group">  <p class="form-group-label"> <span class="icon"><i class="icon-birthday"></i></span>出生日期 </p> <label> <input type="text" class="form-control form-control-birthday  to-validate  to-validate-birthday" placeholder="必填"> </label> </div> </li> <li class="dynamic-item"> <div class="form-group">  <p class="form-group-label"><span class="icon"><i class="icon-sex"></i></span>性别 </p> <form> <span class="form-control-radio"><input class="to-validate to-validate-man" type="radio" name="sex" checked>男</span> <span class="form-control-radio"><input class="to-validate to-validate-woman" type="radio" name="sex">女</span> </form> </div> </li>';
                        dynamicItemDomList.length === 0 && $(this).closest('li').next().after(html);
                        app.initBirthdayTime();
                    }
                })
                .on('click', '.icon-remove', function() {  //删除被保人                  
                    $(this).parent().remove();
                    app.setInsurantOrder();
                    app.setPrice();
                })
                .on('click', '.btn-add', function() {  //添加被保人
                    var sectionMainDom = $('.section-main');
                    var sum = sectionMainDom.find('ul').length;

                    if (submit.maxInsuredNumber && sum === submit.maxInsuredNumber - 0) {
                        window.wAlert('最多能添加' + submit.maxInsuredNumber + '个被保险人');
                        return false;
                    }

                    var html = '<ul class="section-body"> <i class="icon-remove">删除</i> <li> <div class="form-group">  <p class="form-group-label"><span class="icon"><i class="icon-man"></i></span>姓名 </p> <label> <input type="text" class="form-control  to-validate  to-validate-name" placeholder="必填"> </label> </div> </li> <li> <div class="form-group form-group-select">  <p class="form-group-label"><span class="icon"><i class="icon-card"></i></span>证件类型 </p> <label> <select class="form-control form-control-select certificate-type"> <option value="01">身份证</option> <option value="02">护照</option> <option value="03">军官证</option> <option value="05">驾驶证</option> <option value="06">港澳回乡证或台胞证</option> <option value="99">其他</option> </select> </label> </div> </li> <li> <div class="form-group">  <p class="form-group-label"> <span class="icon"><i class="icon-card-num"></i></span>证件号码 </p> <label> <input type="text" class="form-control  to-validate  to-validate-certificate" placeholder="必填"> </label> </div> </li> </ul>';
                    sectionMainDom.append(html);
                    app.setInsurantOrder();
                    $(window).scrollTop($(document).height());

                    app.setPrice();
                })
                .on('click', '#pay', function() {  //支付
                    if ($(this).hasClass('disabled')) {
                        return;
                    }

                    var sectionMainDom = $('.section-main');
                    var sum = sectionMainDom.find('ul').length;
                    var minInsuredNumber = (submit.minInsuredNumber || 1) - 0;
                    if (sectionMainDom.length > 0 && sum < minInsuredNumber) {
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
                .on('click', '.text-inner', function() {  //保险条款                    
                    app.setIframe($(this));
                });
        },

        //本人已阅读......
        setReadme: function(arr) {
            var resultStr = '';
            if (arr instanceof Array && arr.length) {
                resultStr = '<label> <input class="readme-checkbox" type="checkbox" checked> 本人已阅读并同意 </label> <div class="readme-desc"> ';
                var html = arr.map(function(elem, index) {
                    if (hashObj[elem]) {
                        return '<span class="text-inner" data-hash="' + elem + '">' + hashObj[elem] + '</span> ';
                    }
                }).join('');
                resultStr += html + '</div>';
            }
            return resultStr;
        },

        render: function() {
            //被保人
            var html = '';
            if (!submit.minInsuredNumber || !submit.maxInsuredNumber || submit.maxInsuredNumber > 0) {
                html = '<section id="insurantInfo"> <h2 class="section-title">被保险人信息</h2> <div class="section-main"><ul class="section-body" data-order="被保险人"> <i class="icon-remove">删除</i> <li> <div class="form-group"> <p class="form-group-label"><span class="icon"><i class="icon-man"></i></span>姓名 </p> <label> <input type="text" class="form-control to-validate to-validate-name" placeholder="必填"> </label> </div> </li> <li> <div class="form-group form-group-select"> <p class="form-group-label"><span class="icon"><i class="icon-card"></i></span>证件类型 </p> <label> <select class="form-control form-control-select certificate-type"> <option value="01">身份证</option> <option value="02">护照</option> <option value="03">军官证</option> <option value="05">驾驶证</option> <option value="06">港澳回乡证或台胞证</option> <option value="99">其他</option> </select> </label> </div> </li> <li> <div class="form-group"> <p class="form-group-label"> <span class="icon"><i class="icon-card-num"></i></span>证件号码 </p> <label> <input type="text" class="form-control to-validate to-validate-certificate" placeholder="必填"> </label> </div> </li> </ul></div> <div class="section-footer"> <a class="btn-add" href="javascript:void(0);" id="addInsurant">添加被保险人</a> </div> </section>';
            }

            //法律告知
            var readmeHtml = app.setReadme((submit.lawPolicy || '1|2').split('|'));
            $('.readme').before(html).html(readmeHtml);

            $('#applicantInfo').data('min-max-sex', [submit.applicantMiniAge, submit.applicantMaxAge, submit.applicantLimitedSex].join('-'));
            $('#insurantInfo').data('min-max-sex', [submit.insuredMiniAge, submit.insuredMaxAge, submit.insuredLimitedSex].join('-'));
            $('#packageAmount').text(submit.packageAmount || '');

            //如果最小被保人个数和最大被保人个数都是1的话，隐藏添加被保人按钮
            if(submit.minInsuredNumber === '1' && submit.maxInsuredNumber === '1') {
                $('#insurantInfo').find('.section-footer').hide();
            }
        },

        init: function() {
            app.render();
            app.binding();
            $(".loading").hide();
        }
    };

    app && app.init();
})();
