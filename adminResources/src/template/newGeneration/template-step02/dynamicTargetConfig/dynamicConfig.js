(function() {
    'use strict';
    var app = {

        setPayData: function() {
            var productData = JSON.parse(window.sessionStorage.getItem('productData'));
            var submit = JSON.parse(window.sessionStorage.getItem('submit'));
            // 标的信息
            var eleObj = window.tool.getSessionStorage('eleObj');
            var targetArr = [];
            if (!!eleObj) {
                targetArr = window.tool.getSessionStorage('eleObj').targetArr;
            }
            //投保人
            var applicantInfoDom = $('#applicantInfo');
            var applicantName = applicantInfoDom.find('.to-validate-name').val().trim();
            var applicantCertificateType = applicantInfoDom.find('.certificate-type').val().trim();
            var applicantCertificate = applicantInfoDom.find('.to-validate-certificate').val().trim();
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
            var pageData;
            if (!submit.maxInsuredNumber || parseInt(submit.maxInsuredNumber) <= 1) {
                var isSelf = '0';
                if ($('.is-self').is(':checked')) {
                    isSelf = '1';
                    insurantInfoList.push({
                            'name': applicantName,
                            'birthday': applicantBirthday,
                            'sexCode': applicantSex,
                            'certificateNo': applicantCertificate,
                            'certificateType': applicantCertificateType,
                            'mobileTelephone': applicantPhone,
                            'relationshipWithApplicant': '1'
                    });
                } else {
                    isSelf = '0';
                    var onlyBirth,onlyAge,onlySexCode,onlyType,onlyNo,onlyPhone;
                    onlyNo = $('.only-other-no').val().trim();
                    if ($('.only-other-type').val() === '01') {
                        resultObj = window.validate.getBirthdayAndSexFromID(onlyNo);
                        onlySexCode = resultObj.sex;
                        onlyBirth = resultObj.birthday;
                    } else {
                        onlySexCode = $('#onlyOneSelf').find('.to-validate-man').prop('checked') ? 'M' : 'F';
                        onlyBirth = $('#onlyOneSelf').find('.to-validate-birthday').val().trim();
                    };
                    onlyAge = window.validate.getAgeFromBirthday(onlyBirth);
                    onlyPhone = $('#onlyOneSelf').find('.only-other-phone').val().trim();
                    insurantInfoList.push({
                            'name': $.trim($('.only-other-name').val()),
                            'birthday': onlyBirth,
                            'sexCode': onlySexCode,
                            'certificateNo': onlyNo,
                            'certificateType': $('.only-other-type').val(),
                            'mobileTelephone': onlyPhone,
                            'relationshipWithApplicant': ''
                    });
                }
                pageData = '<div class="section-main" id="onlyOneSelf">' + $("#onlyOneSelf").html() + '</div>'; 
            } else {
                var insurantDomList = $('#insurantInfo').find('.section-body');
                var insurantDom, insurantCertificateType, insurantCertificateNo, manSexDom, insurantName, insurantSex, insurantBirthday, insurantAge, resultObj,relation,insurantPhone;
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
                    insurantAge = window.validate.getAgeFromBirthday(insurantBirthday);
                    relation = insurantDom.find('.select-certificate-type').val();
                    insurantPhone = insurantDom.find('.insurance-phone').val().trim();
                    insurantInfoList.push({
                            'name': insurantName,
                            'birthday': insurantBirthday,
                            'sexCode': insurantSex,
                            'certificateNo': insurantCertificateNo,
                            'certificateType': insurantCertificateType,
                            'relationshipWithApplicant': relation,
                            'mobileTelephone': insurantPhone
                    });
                }
                pageData = '<div class="section-main" id="moreInsurance">' + $("#moreInsurance").html() + '</div><div class="section-footer"><a class="btn-add" href="javascript:void(0);" id="addInsurant">添加被保险人</a> </div>'; 
            }
            //投保人
            var applicantInfo = {
                name: applicantName,
                type: applicantCertificateType,
                typeNo: applicantCertificate,
                sexCode: applicantSex,
                birthday: applicantBirthday,
                phone: applicantPhone,
                email: applicantEmail,
                isSelf: isSelf,
                packageAmount: $.trim($('#packageAmount').text())
            }
            window.sessionStorage.setItem('applicantData', JSON.stringify(applicantInfo));
            //提交数据
            if (submit.typeCode == '01' || submit.typeCode == '03') {
                var len = insurantInfoList.length;
                if (!!targetArr.length) {
                    for (var i=0; i<len; i++) {
                        var lens = targetArr.length;
                        for (var j=0; j<lens; j++) {
                            if (targetArr[j].elementTypeName === 'input' || targetArr[j].elementTypeName === 'select' || targetArr[j].elementTypeName === 'textarea' ) {
                                insurantInfoList[i][targetArr[j].elementKey] = $('.' + targetArr[j].elementKey).val();
                            } else {
                                insurantInfoList[i][targetArr[j].elementKey] = $('.' + targetArr[j].elementKey).text();
                            }
                        }
                    };
                }
            }
            var payData = {
                partnerCode: submit.partnerCode,
                productId: submit.productId,
                planId: submit.planId,
                packageId: submit.packageId,
                typeCode: submit.typeCode,
                timestamp: window.tool.getCurrentDateTime(),
                orderNo: (new Date()).getTime()+''+parseInt(Math.random()*Math.pow(10,7)),
                productInfo: {
                    applyNum: 1,
                    totalActualPremium: $.trim($('#packageAmount').text()),
                    insuranceBeginDate: submit.insuranceBeginTime,
                    insuranceEndDate: submit.insuranceEndTime
                },
                applicantInfo: {
                    name: applicantName,
                    mobileTelephone: applicantPhone,
                    certificateNo: applicantCertificate,
                    certificateType: applicantCertificateType,
                    birthday: applicantBirthday,
                    sexCode: applicantSex,
                    email: applicantEmail,
                    address: '',
                    postcode: ''
                },
                insurantInfoList: insurantInfoList,
                extendInfo: {
                    invokeMobilePhone: applicantPhone,
                    invokeEmail: applicantEmail
                }
            };

            if (submit.typeCode=== '03') {
                payData.applicantInfo = {
                    groupName: applicantName,
                    groupCertificateNo: applicantCertificate,
                    groupCertificateType: '99',
                    companyAttribute: '9',
                    postCode: '',
                    groupAbbr: '',
                    businessRegisterId: '',
                    address: '',
                    linkManName: applicantName,
                    linkManMobileTelephone: applicantPhone,
                    linkManEmail: applicantEmail
                }
            } else if (submit.typeCode === '02') {
                payData.propertyTargetInfoList = [];
                var obj = {};
                obj.propertyTargetMap = {};
                if (!!targetArr.length) {
                    var len = targetArr.length;
                    for (var j=0; j<len; j++) {
                        if (targetArr[j].elementTypeName === 'input' || targetArr[j].elementTypeName === 'select' || targetArr[j].elementTypeName === 'textarea' ) {
                            obj.propertyTargetMap[targetArr[j].elementKey] = $('.' + targetArr[j].elementKey).val();
                        } else {
                            obj.propertyTargetMap[targetArr[j].elementKey] = $('.' + targetArr[j].elementKey).text();
                        };
                        
                    }
                }
                payData.propertyTargetInfoList.push(obj);
            };
            window.sessionStorage.setItem('payData', JSON.stringify(payData));
            
            window.sessionStorage.setItem('pageData', pageData);
        },

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
            var submit = JSON.parse(window.sessionStorage.getItem('submit'));
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
            if (parseInt(submit.maxInsuredNumber) > 1) {
                result = app.isOnlyCertificate();
                if (!result.isValid) {
                    return result;
                }
            }

            if (parseInt(submit.maxInsuredNumber) > 1) {
                result = app.isChooseRelation();
                if (!result.isValid) {
                    return result;
                }
            }
            //动态验证标的信息
            result = this.checkTarget();
            if (!result.isValid) {
                return result;
            }
            return result;
        },

        //动态验证标的信息

        checkTarget: function() {
            var eleObj = window.tool.getSessionStorage('eleObj');
            var targetArr = [];
            if (!!eleObj) {
                targetArr = window.tool.getSessionStorage('eleObj').targetArr;
            }
            var $targetDom = $('.target-dom');

            var dom = [];
            var result = {
                isValid: true,
                msg: 'ok'
            };
            if ($targetDom && $targetDom.length !== 0 && targetArr.length !== 0) {
                for (var i=0; i<$targetDom.length; i++) {
                    var checkList = targetArr[i].checkRuleInfo;
                    // for (var j=0; j<checkList.length; j++) {
                    //     result = this.checkRulesSwitch(checkList[j].checkRuleWebDetail, checkList[j].checkPromptMessage, $($targetDom[i]));
                    //     if (!result.isValid) {
                    //         return result;
                    //     }
                    // };
                    if (!checkList) {
                        continue;
                    }
                    result = this.checkRulesSwitch(checkList.checkRuleWebDetail, checkList.checkPromptMessage, $($targetDom[i]));
                    if (!result.isValid) {
                        return result;
                    }
                };
            }
            return result;
        },

        //动态验证标的信息

        checkRulesSwitch: function(reg, msg, obj) {
            var result = {
                isValid: true,
                msg: 'ok'
            };
            if (!!reg) {
                var reg = eval(reg);
                if (!reg.test($.trim(obj.val()))) {
                    result.isValid = false;
                    result.msg = msg;
                };
            };
            return result
        },

        isOnlyCertificate: function() {
            var moreCertificate = $('#moreInsurance').find('.to-validate-certificate');
            var len = moreCertificate.length;
            var result = {
                isValid: true,
                msg: 'ok'
            };
            if (len !== 0) {
                for(var i = 0; i<len; i++) {

                    for (var j=i+1; j<len; j++) {
                        if ($.trim($(moreCertificate[i]).val()) === $.trim($(moreCertificate[j]).val())) {
                            result.isValid = false;
                            result.msg = '第' + (i+1) + '和第' + (j+1) + '个被保险人证件号码不能相同';
                            return result;
                        }
                    }

                }
            } else {
                console.log('err');
                result.isValid = false;
                result.msg = '请添加被保险人';
                return result;
            }
            return result;
        },
        isChooseRelation: function() {
            var relation = $('#moreInsurance').find('.select-certificate-type');
            var len = relation.length;
            var result = {
                isValid: true,
                msg: 'ok'
            };
            if (len !== 0) {
                for(var i = 0; i<len; i++) {
                    if ($(relation[i]).val() === '00') {
                        result.isValid = false;
                        result.msg = '请选择第' + (i+1) + '个被保人与投保人关系';
                        return result;
                    }
                }
            } else {
                console.log('err');
                result.isValid = false;
                result.msg = '请添加被保险人';
                return result;
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
                        var html = '<li class="dynamic-item self cancel"> <div class="form-group">  <p class="form-group-label"> <span class="icon"><i class="icon-birthday"></i></span>出生日期 </p> <label> <input type="text" class="form-control form-control-birthday  to-validate  to-validate-birthday" placeholder="必填"> </label> </div> </li> <li class="dynamic-item self cancel"> <div class="form-group">  <p class="form-group-label"><span class="icon"><i class="icon-sex"></i></span>性别 </p> <form> <span class="form-control-radio"><input class="to-validate to-validate-man" type="radio" name="sex" checked>男</span> <span class="form-control-radio"><input class="to-validate to-validate-woman" type="radio" name="sex">女</span> </form> </div> </li>';
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

                    var html = '<ul class="section-body"> <i class="icon-remove">删除</i>'
                                +'<li><div class="form-group form-group-select">'
                            +'<p class="form-group-label">与投保人关系</p>' 
                            +'<label>'
                                +'<select class="form-control form-control-select select-certificate-type">'
                                    +'<option value="00">请选择</option>'
                                    +'<option value="1">本人</option>'
                                    +'<option value="3">父子</option>'
                                    +'<option value="4">父女</option>'
                                    +'<option value="A">母子</option>'
                                    +'<option value="B">母女</option>'
                                    +'<option value="2">配偶</option>'
                                    +'<option value="I">子女</option>'
                                    +'<option value="9">其他</option>'
                                +'</select> '
                            +'</label> '
                        +'</div> '
                        +'</li>  <li> <div class="form-group">  <p class="form-group-label"><span class="icon"><i class="icon-man"></i></span>姓名 </p> <label> <input type="text" class="form-control  to-validate  to-validate-name" placeholder="必填"> </label> </div> </li> <li> <div class="form-group form-group-select">  <p class="form-group-label"><span class="icon"><i class="icon-card"></i></span>证件类型 </p> <label> <select class="form-control form-control-select certificate-type"> <option value="01">身份证</option> <option value="02">护照</option> <option value="03">军官证</option> <option value="05">驾驶证</option> <option value="06">港澳回乡证或台胞证</option> <option value="99">其他</option> </select> </label> </div> </li> <li> <div class="form-group">  <p class="form-group-label"> <span class="icon"><i class="icon-card-num"></i></span>证件号码 </p> <label> <input type="text" class="form-control  to-validate  to-validate-certificate" placeholder="必填"> </label> </div> </li> <li> <div class="form-group">  <p class="form-group-label"> <span class="icon"><i class="icon-phone"></i></span>手机号码 </p> <label> <input type="tel" class="form-control insurance-phone" placeholder="非必填" maxlength="11"> </label> </div> </li></ul>';
                    sectinMainDom.append(html);
                    app.setInsurantOrder();

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

                    if (!$('.readme-checkbox').prop('checked')) {
                        window.wAlert('请勾选同意保险条款和投保人声明');
                        return false;
                    }

                    app.setPayData();
                    app.pay();
                    $(this).addClass('disabled');
                })
                .on('click', '.text-inner', function() { //保险条款                    
                    app.setIframe($(this));
                });

                app.relationChange();
                app.applicantChange();
        },
        relationChange: function() {
            $('.page').on('change', '.select-certificate-type', function() {
                var $parent = $(this).closest('ul');
                if($(this).val() === '1') {
                    var $dom = $('#applicantInfo');
                    $parent.find('.to-validate-name').val($dom.find('.to-validate-name').val());
                    $parent.find('.certificate-type').val($dom.find('.certificate-type').val());
                    $parent.find('.to-validate-certificate').val($dom.find('.to-validate-certificate').val());
                    $parent.find('.certificate-type').change();
                    if ($dom.find('.certificate-type').val() !== '01') {
                        if ($dom.find('.to-validate-man').length === 0) {
                            var html = '<li class="dynamic-item self cancel"> <div class="form-group">  <p class="form-group-label"> <span class="icon"><i class="icon-birthday"></i></span>出生日期 </p> <label> <input type="text" class="form-control form-control-birthday  to-validate  to-validate-birthday" placeholder="必填"> </label> </div> </li> <li class="dynamic-item self cancel"> <div class="form-group">  <p class="form-group-label"><span class="icon"><i class="icon-sex"></i></span>性别 </p> <form> <span class="form-control-radio"><input class="to-validate to-validate-man" type="radio" name="sex" checked>男</span> <span class="form-control-radio"><input class="to-validate to-validate-woman" type="radio" name="sex">女</span> </form> </div> </li>';
                            $dom.find('li').eq(2).after(html);
                        }
                        $parent.find('.to-validate-birthday').val($dom.find('.to-validate-birthday').val());
                        var sex = $dom.find('.to-validate-man').prop('checked') ? 'M' : 'F'
                        if (sex === 'M') {
                            $parent.find('.to-validate-woman').removeAttr('checked');
                            $parent.find('.to-validate-man').attr('checked',true) 
                        } else {
                            $parent.find('.to-validate-man').removeAttr('checked');
                            $parent.find('.to-validate-woman').attr('checked',true)
                        };
                        
                    }
                    $parent.find('.insurance-phone').val($dom.find('.to-validate-phone').val());
                    $(this).closest('ul').find('input').attr('disabled', true);
                    $(this).closest('ul').find('.certificate-type').attr('disabled', true);
                    
                } else {
                    $parent.find('.self').remove();
                    $(this).closest('ul').find('input').val('');
                    $parent.find('.certificate-type').val('01');
                    $(this).closest('ul').find('input').removeAttr('disabled');
                    $(this).closest('ul').find('.certificate-type').removeAttr('disabled');
                };
                
            });
        },
        recoverPayData: function(html) {
            $('.page').html(html);
        },
        applicantChange: function() {
                var $dom = $('#applicantInfo');
                $dom.find('.to-validate-name').on('input propertychange', function() {
                    app.chooseSelf();
                });

                $dom.find('.certificate-type').on('change', function() {
                    app.chooseSelf();
                });

                $dom.find('.to-validate-certificate').on('input propertychange', function() {
                    app.chooseSelf();
                });

                $dom.find('.to-validate-phone').on('input propertychange', function() {
                    app.chooseSelf();
                });
                $('#applicantInfo').on('change', '.to-validate-birthday', function() {
                    app.chooseSelf();
                })

                $('#applicantInfo').on('change', '.to-validate-woman', function() {
                    app.chooseSelf();
                })

                $('#applicantInfo').on('change', '.to-validate-man', function() {
                    app.chooseSelf();
                })
                
        },
        chooseSelf: function() {
            var uls = $('.page').find('#moreInsurance').find('.select-certificate-type');
            var len = uls.length;
            for (var i=0; i<len; i++) {
                if ($(uls[i]).val() === '1') {
                    $(uls[i]).change();
                }
            }
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
            var html = '';
            if (!submit) {
                window.wAlert('数据有误');
                return false;
            }

            var applicantPage = window.sessionStorage.getItem('applicantPage');
            if (0) {
                app.recoverPayData(applicantPage);
                app.initBirthdayTime();
            } else if (!submit.maxInsuredNumber || parseInt(submit.maxInsuredNumber) <= 1) {
                html = '<div class="section-main" id="onlyOneSelf">'
                        +'<ul class="section-body self-ul" data-order="被保险人" id="onlyOneSelfUl">' 
                            +'<li class="only-for-self">'
                                +'<div class="form-group">'
                                    +'<p class="form-group-label">'
                                        +'为本人投保'
                                   +'</p>'
                                    +'<label>'
                                        +'<input type="checkbox" class="form-control to-validate to-validate-name is-self" placeholder="必填" checked>'
                                    +'</label>'
                               +' </div>'
                            +'</li>' 
                        +'</ul>'
                    +'</div>';
                $('#insurantInfo').append(html);
                app.changeOnlySelf();
            } else if (parseInt(submit.maxInsuredNumber) > 1) {
                html = '<div class="section-main" id="moreInsurance">'
                        +'<ul class="section-body" data-order="被保险人"> <i class="icon-remove">删除</i><li><div class="form-group form-group-select">' 
                            +'<p class="form-group-label">与投保人关系'
                            +'</p>' 
                            +'<label>' 
                                +'<select class="form-control form-control-select select-certificate-type">'
                                    +'<option value="00">请选择</option>'
                                    +'<option value="1">本人</option>'
                                    +'<option value="3">父子</option>'
                                    +'<option value="4">父女</option>'
                                    +'<option value="A">母子</option>'
                                    +'<option value="B">母女</option>'
                                    +'<option value="2">配偶</option>'
                                    +'<option value="I">子女</option>'
                                    +'<option value="9">其他</option>'
                                +'</select>' 
                            +'</label>' 
                        +'</div>' 
                        +'</li>' 
                        +'<li> <div class="form-group"> <p class="form-group-label"><span class="icon"><i class="icon-man"></i></span>姓名 </p> <label> <input type="text" class="form-control to-validate to-validate-name" placeholder="必填"> </label> </div> </li> <li> <div class="form-group form-group-select"> <p class="form-group-label"><span class="icon"><i class="icon-card"></i></span>证件类型 </p> <label> <select class="form-control form-control-select certificate-type"> <option value="01">身份证</option> <option value="02">护照</option> <option value="03">军官证</option> <option value="05">驾驶证</option> <option value="06">港澳回乡证或台胞证</option> <option value="99">其他</option> </select> </label> </div> </li> <li> <div class="form-group"> <p class="form-group-label"> <span class="icon"><i class="icon-card-num"></i></span>证件号码 </p> <label> <input type="text" class="form-control to-validate to-validate-certificate" placeholder="必填"> </label> </div> </li><li> <div class="form-group">  <p class="form-group-label"> <span class="icon"><i class="icon-phone"></i></span>手机号码 </p> <label> <input type="tel" class="form-control insurance-phone" placeholder="非必填" maxlength="11"> </label> </div> </li> </ul></div> <div class="section-footer"> <a class="btn-add" href="javascript:void(0);" id="addInsurant">添加被保险人</a> </div>';
                $('#insurantInfo').append(html);
            }

            //法律告知
            var readmeHtml = app.renderReadme((submit.lawPolicy || '1|2').split('|'));
            $('.readme').html(readmeHtml);
            
            $('#applicantInfo').data('min-max-sex', [submit.applicantMiniAge, submit.applicantMaxAge, submit.applicantLimitedSex].join('-'));
            $('#insurantInfo').data('min-max-sex', [submit.insuredMiniAge, submit.insuredMaxAge, submit.insuredLimitedSex].join('-'));
            $('#packageAmount').text(submit.packageAmount || '');
        },

        changeOnlySelf: function() {
            $('.page').on('click','.is-self', function() {
                if ($(this).is(":checked")) {
                    $('#insurantInfo .self').remove();
                    $('.only-for-self').css('border-bottom','0');
                } else {
                    var str = '<li class="self">'
                                +'<div class="form-group">' 
                                    +'<p class="form-group-label">'
                                       +'<span class="icon"><i class="icon-man"></i></span>姓名' 
                                    +'</p>' 
                                    +'<label>' 
                                       +'<input type="text" class="form-control to-validate to-validate-name only-other-name" placeholder="必填">' 
                                    +'</label>' 
                               +'</div>' 
                            +'</li>' 
                            +'<li class="self">'
                                +'<div class="form-group form-group-select">' 
                                    +'<p class="form-group-label">'
                                        +'<span class="icon"><i class="icon-card"></i></span>证件类型'
                                    +'</p>' 
                                    +'<label>' 
                                        +'<select class="form-control form-control-select certificate-type only-other-type">' 
                                            +'<option value="01">身份证</option>' 
                                            +'<option value="02">护照</option>' 
                                            +'<option value="03">军官证</option>' 
                                            +'<option value="05">驾驶证</option>' 
                                            +'<option value="06">港澳回乡证或台胞证</option>' 
                                            +'<option value="99">其他</option>' 
                                        +'</select>' 
                                    +'</label>' 
                                +'</div>' 
                            +'</li>' 
                            +'<li class="self">' 
                                +'<div class="form-group">' 
                                    +'<p class="form-group-label">' 
                                        +'<span class="icon"><i class="icon-card-num"></i></span>证件号码' 
                                    +'</p>' 
                                    +'<label>' 
                                        +'<input type="text" class="form-control to-validate to-validate-certificate only-other-no" placeholder="必填">' 
                                    +'</label>' 
                               +'</div>' 
                            +'</li>'
                            +'<li class="self">' 
                                +'<div class="form-group">' 
                                   +'<p class="form-group-label">' 
                                       +' <span class="icon"><i class="icon-phone"></i></span>手机号码' 
                                    +'</p>' 
                                    +'<label>' 
                                        +'<input type="text" class="form-control  to-validate-certificate only-other-phone" placeholder="非必填" maxlength="11">' 
                                    +'</label>' 
                                +'</div>' 
                            +'</li>';
                    $('.self-ul').append(str);
                    $('.only-for-self').css('border-bottom','1px solid #ddd');
                }
            })
        },

        init: function() {
            app.render();
            app.binding();
        }
    };

    app && app.init();
    window.app = app;
})();
