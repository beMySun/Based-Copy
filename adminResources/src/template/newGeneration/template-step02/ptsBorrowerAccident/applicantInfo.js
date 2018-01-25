;(function() {

    var urlP = JSON.parse(window.sessionStorage.getItem('urlParameters'));
    var submit = JSON.parse(window.sessionStorage.getItem('submit'));
    var productData = JSON.parse(window.sessionStorage.getItem('productData'));
    var $err = $('#err');
    var planInfoList = JSON.parse(window.sessionStorage.getItem('planInfoList'));

    if (planInfoList) {
        var planInfoListLength = planInfoList.length;
        for(var i = 0; i < planInfoListLength; i++) {
            delete planInfoList[i].isMain;
            delete planInfoList[i].totalStandardPremium;
            delete planInfoList[i].totalAgreePremium;
            delete planInfoList[i].totalActualPremium;

            for(var j = 0; j < planInfoList[i].dutyInfoList.length; j++) {
                delete planInfoList[i].dutyInfoList[j].riskDutyRelationInfoList;
                delete planInfoList[i].dutyInfoList[j].totalStandardPremium;
            }
        }
    }   

    if (productData) {
        var minage = submit.applicantMiniAge || productData.planInfoList[0].localProMap.applicantMiniAge;
        var maxage = submit.applicantMaxAge || productData.planInfoList[0].localProMap.applicantMaxAge;
        var limitsex = submit.applicantLimitedSex ||  productData.planInfoList[0].localProMap.applicantLimitedSex;
        var applicantStatement = submit.applicantStatement || productData.planInfoList[0].localProMap.applicantStatement;
        var planCode = submit.planCode || productData.planInfoList[0].localProMap.planCode;
        var insuredMinage = submit.insuredMiniAge || productData.planInfoList[0].packageList[0].insuredMiniAge;
        var insuredMaxage = submit.insuredMaxage || productData.planInfoList[0].packageList[0].insuredMaxAge;
        var insuredLimitsex = submit.insuredLimitedSex || productData.planInfoList[0].localProMap.insuredLimitedSex;
        var loanBank = productData.AGENT_CHINESE_NAME || '平安银行股份有限公司宁波分行' ;
        $('#loanBank').val(loanBank);
    }

    $('#forSelf').on('click', function() {

        if ($(this).is(':checked')) {

            $('#insurantName').val($('#applicantName').val());

            if ($('#applicantCertType').val() === '01') {

                $('#insurantCertType').val('01');
                $('#insurantForPaperNo1').val($('#applicantForPaperNo1').val());

                $("#insurantBirthdayBox").hide();
                $("#insurantSexBox").hide();

            } else {

                $('#insurantCertType').val($('#applicantCertType').val());
                $('#insurantForPaperNo1').val($('#applicantForPaperNo1').val());
                $("#insurantBirthdayBox").show();
                $("#insurantSexBox").show();
                $('#J-datePicker-insurant').val($('#J-datePicker-applicant').val());

                if ($('#applicantBoy').is(':checked')) {
                    $('#insurantBoy').prop('checked', true);
                } else {
                    $('#insurantGirl').prop('checked', true);
                }
            }

        } else {
            resetInsurantInfo();
        }
    });

    function resetInsurantInfo() {
        $('#insurantName').val('');
        $('#insurantCertType').val('01');
        $('#insurantForPaperNo1').val('');
        $('#J-datePicker-insurant').val('');
        $("#insurantBirthdayBox").hide();
        $("#insurantSexBox").hide();
    }

    $('#applicantName').on('blur', function() {
        var $name = $(this).val();
        var name = ConvertPinyin($name);

        if ($('#forSelf').is(':checked')) {
            $('#insurantName').val($('#applicantName').val());
        }
    });


    $('#applicantForPaperNo1').on('blur', function() {
        if ($('#forSelf').is(':checked')) {
            $("#insurantForPaperNo1").val($(this).val());
        }
    });


    $("#applicantCertType").on('change', function() {
        $(".label-select").css('width', '76px');
        if ($(this).val() === '01') {
            $("#applicantBirthdayBox").hide();
            $("#applicantSexBox").hide();
        } else {
            if ($(this).val() == '05') {
                $(".label-select").css('width', '160px');
            }
            $("#applicantBirthdayBox").show();
            $("#applicantSexBox").show();
            $("#applicantBoy").prop('checked', true);
        }

        $("#applicantForPaperNo1").val('');

        if ($('#forSelf').is(':checked')) {

            if ($(this).val() === '01') {

                $("#insurantCertType").val($("#applicantCertType").val());
                $("#insurantBirthdayBox").hide();
                $("#insurantSexBox").hide();

            } else {

                $("#insurantCertType").val($("#applicantCertType").val());
                $("#insurantBirthdayBox").show();
                $("#insurantSexBox").show();

                if ($('#applicantBoy').is(':checked')) {
                    $('#insurantBoy').prop('checked', true);
                } else {
                    $('#insurantGirl').prop('checked', true);
                }
            }
            $("#insurantForPaperNo1").val('');
        }

    });

    $('#J-datePicker-applicant').on('change', function() {

        if ($('#forSelf').is(':checked')) {
            $('#J-datePicker-insurant').val($(this).val());
        }
    });


    $('#applicantBoy').on('click', function() {
        if ($('#forSelf').is(':checked')) {
            $('#insurantBoy').prop('checked', true);
        }
    });

    $('#applicantGirl').on('click', function() {
        if ($('#forSelf').is(':checked')) {
            $('#insurantGirl').prop('checked', true);
        }
    });

    $('#insurantCertType').on('change', function() {
        $('.label-select').css('width', '76px');
        if ($(this).val() === '01') {
            $('#insurantBirthdayBox').hide();
            $('#insurantSexBox').hide();
        } else {
            if ($(this).val() === '05') {
                $(".label-select").css('width', '160px');
            }
            $('#insurantBirthdayBox').show();
            $('#insurantSexBox').show();
            $('#insurantBoy').prop('checked', true);
        }
        $('#insurantForPaperNo1').val('');
    });

    // 是否显示需要纸质报单
    if (submit && submit.showPaper) {
        $('#paperLabel').show();
    } else {
        $('#paperLabel').hide();
    };

    $('#needPapper').on('click', function() {
        var checked = $(this).prop('checked');
        if (checked) {
            $('#needPapperBox').show();
        } else {
            $('#needPapperBox').hide();
        }
    });

    $('#selectProvence').cityPicker({
        title: "选择省市",
        showDistrict: true
    });

    $('body').on('click', '.go-back', function() {
        window.location.href = './productDetail.html?keyCode=' + urlP.keyCode;
    });

    var app = {

        init: function() {
            ErrWarn.creat();
            this.render();
            this.readRule();
            this.initDateTime();
            this.getAjaxData();
            this.pay();
        },
        render: function() {
            if (submit) {
                $('#amount').text(submit.amount);
            }

            var info = JSON.parse(window.sessionStorage.getItem('applicantInfo'));
            if (info) {
                $('#applicantName').val(info.applicantName);
                if (info.applicantCertType === '01') {
                    $('#applicantCertType').val('01');
                    $('#applicantBirthdayBox').hide();
                    $('#applicantSexBox').hide();
                } else {
                    $('#applicantCertType').val(info.applicantCertType);
                    $('#applicantBirthdayBox').show();
                    $('#applicantSexBox').show();
                    $('#J-datePicker-applicant').val(info.applicantBirthday);
                    info.applicantGender === 'M' ? $('#applicantBoy').attr('checked', true) : $('#applicantGirl').attr('checked', true);
                };
                $('#applicantForPaperNo1').val(info.applicantCertNo);
                $('#applicantMobile').val(info.applicantMobile);
                $('#applicantEmail').val(info.applicantEmail);
            }

            if ($('header').css('background-color') !== 'rgb(255, 255, 255)') {
                $('.btn-back').css('border-color', '#fff');
                $(".title").css('color', '#fff');
            } else {
                $('.btn-back').css('border-color', '#000');
                $(".title").css('color', '#000');
            }

            // if ($('#hideInsuranceClause .ruleHeader').css('background-color') === 'rgb(255, 255, 255)') {
            //     $('#hideInsuranceClause .icon-arrow-back').css('border-color', '#000');
            //     $("#title").css('color', '#000');

            // } else {
            //     $('#hideInsuranceClause .icon-arrow-back').css('border-color', '#fff');
            //     $("#title").css('color', '#fff');
            // }

            $('#hideInsuranceClause .icon-arrow-back').css('border-color', '#000');
            $("#title").css('color', '#000');

            $('.loading').hide();

        },

        initDateTime: function() {

            $('#J-datePicker-applicant').datetimePicker({
                title: "出生日期",
                min: "1900-01-01",
                max: "2100-01-01",
                yearSplit: "-",
                monthSplit: "-",
                datetimeSplit: " ",
                times: function() {
                    return []
                },
                onChange: function(i, h, j) {}
            });

            $('#J-datePicker-insurant').datetimePicker({
                title: "出生日期",
                min: "1900-01-01",
                max: "2100-01-01",
                yearSplit: "-",
                monthSplit: "-",
                datetimeSplit: " ",
                times: function() {
                    return []
                },
                onChange: function(i, h, j) {}
            });
        },

        getAjaxData: function() {
            var productInfo = {
                productName: '个人银行卡盗失险'
            }
            var productDetail = JSON.parse(window.sessionStorage.getItem('productInfo')) || productInfo;
            if (productDetail) {
                $('#productName').text(productDetail.productName);
                $('.loading').hide();
            };
        },

        checkData: function() {
            var _that = this;
            
            if ($('#loanCode').val().trim() === '') {
                ErrWarn.errShow('贷款合同号不能为空');
                return false;
            }

            // 投保人信息校验
            if ($('#applicantName').val().trim() === '') {
                ErrWarn.errShow('投保人姓名不能为空');
                return false;
            }

            if ($('#applicantForPaperNo1').val().trim() === '') {
                ErrWarn.errShow('投保人证件号码不能为空');
                return false;
            }

            if ($('#applicantCertType').val() === '01' && $('#applicantForPaperNo1').val().trim() !== '') {

                if (!validate.checkCertNo($('#applicantForPaperNo1').val(), $err.find('p'))) {
                    ErrWarn.errShow('投保人身份证格式不正确');
                    return false;
                }

                if (!validate.checkCertNoAge($('#applicantForPaperNo1').val(), '1', minage, maxage, $err.find('p'))) {
                    ErrWarn.errShow('投保人必须在 ' + minage + ' 到 ' + maxage + ' 周岁之间');
                    return false;
                }

                if (!validate.checkSexLimit(validate.getSex($('#applicantForPaperNo1').val()), limitsex, $err.find('p'), '1')) {
                    var str = limitsex == 1 ? '男性' : '女性'
                    ErrWarn.errShow('投保人必须是' + str);
                    return false;
                }

            }

            if ($('#applicantCertType').val() !== '01' && $('#applicantForPaperNo1').val() !== '') {
                if ($("#J-datePicker-applicant").val() === '') {
                    ErrWarn.errShow('请选择出生日期');
                    return false;
                };
                if (!validate.checkOtherTypeAge($("#J-datePicker-applicant").val(), '1', minage, maxage, $err.find('p'))) {
                    ErrWarn.errShow('投保人必须在' + minage + '到' + maxage + '周岁之间');
                    return false;
                };
                if (!validate.checkSexLimit($('#applicantBoy').is(":checked") ? "M" : "F", limitsex, $err.find('p'), '1')) {
                    var str = limitsex === 1 ? '男性' : '女性'
                    ErrWarn.errShow('投保人必须是' + str);
                    return false;
                };
            }

            if ($('#applicantMobile').val().trim() === '') {
                ErrWarn.errShow('投保人手机号码不能为空');
                return false;
            }

            if (!validate.checkMobile($('#applicantMobile').val(), $err.find('p'))) {
                ErrWarn.errShow('投保人手机号码格式不正确');
                return false;
            }

            if ($('#applicantEmail').val().trim() === '') {
                ErrWarn.errShow('邮箱不能为空');
                return false;
            }

            if (!validate.checkEmail($('#applicantEmail').val(), $err.find('p'))) {
                ErrWarn.errShow('邮箱格式不正确');
                return false;
            }


            // 被保险人信息校验
            if ($('#insurantName').val().trim() === '') {
                ErrWarn.errShow('被保险人姓名不能为空');
                return false;
            }

            if ($('#insurantForPaperNo1').val().trim() === '') {
                ErrWarn.errShow('被保险人证件号码不能为空');
                return false;
            }

            if ($('#insurantCertType').val() === '01' && $('#insurantForPaperNo1').val().trim() !== '') {

                if (!validate.checkCertNo($('#insurantForPaperNo1').val(), $err.find('p'))) {
                    ErrWarn.errShow('被保险人身份证格式不正确');
                    return false;
                }


                if (!validate.checkCertNoAge($('#insurantForPaperNo1').val(), '2', insuredMinage, insuredMaxage, $err.find('p'))) {
                    ErrWarn.errShow('被保险人必须在 ' + insuredMinage + ' 到 ' + insuredMaxage + ' 周岁之间');
                    return false;
                }

                if (!validate.checkSexLimit(validate.getSex($('#insurantForPaperNo1').val()), insuredLimitsex, $err.find('p'), '1')) {

                    var str = insuredLimitsex == 1 ? '男性' : '女性'

                    ErrWarn.errShow('被保险人必须是 ' + str);
                    return false;
                }
            }

            if ($('#insurantCertType').val() !== '01' && $('#insurantForPaperNo1').val().trim() !== '') {

                if ($('#J-datePicker-insurant').val() === '') {
                    ErrWarn.errShow('请选择被保险人的出生日期');
                    return false;
                }

                if (!validate.checkOtherTypeAge($('#J-datePicker-insurant').val(), '2', insuredMinage, insuredMaxage, $err.find('p'))) {
                    ErrWarn.errShow('被保险人必须在' + insuredMinage + '到' + insuredMaxage + '周岁之间');
                    return false;
                }

                if (!validate.checkSexLimit($('#insurantBoy').is(':checked') ? "M" : "F", insuredLimitsex, $err.find('p'), '2')) {
                    var str = insuredLimitsex == 1 ? '男性' : '女性'
                    ErrWarn.errShow('被保险人必须是 ' + str);
                    return false;
                }
            }

            if (!$("#checkbox_send").is(':checked')) {
                ErrWarn.errShow('请勾选并阅读声明和条款');
                return false;
            }

            return true;
        },

        pay: function() {
            var _that = this;
            $('#pay').on('click', function() {
                if (!_that.checkData()) {
                    console.log('验证不通过');
                } else {

                    var productData = $.extend({}, _that.getApplicantInfo());
                    var url = "/icp/mobile_single_insurance/ptsApplyInsurance.do";
                    $('#pay p').css('background', '#dcdcdc').text('正在支付...');
                    $.ajax({
                        url: url,
                        type: 'post',
                        data: JSON.stringify(productData),
                        success: function(res) {
                            res = typeof res === 'object' ? res : JSON.parse(res);
                            if (res.code === '00') {
                                $("#pay p").css('background', productData.color).text('支付');

                                //埋点统计
                                window.tool.payBtnTJ && window.tool.payBtnTJ();
                                window.location.href = res.payUrl;
                            } else {
                                ErrWarn.errShow('投保失败，请稍候重试');
                                $("#pay p").css('background', productData.color).text('支付');
                            }
                        },
                        error: function() {
                            ErrWarn.errShow('网络出错，请刷新页面');
                            $('#pay p').css('background', productData.color).text('支付');
                        }
                    })
                }
            })
        },

        getApplicantInfo: function() {

            var applicantBirthday, applicantSex;
            var insurantBirthday, insurantSex, insurantAge;

            if ($('#applicantCertType').val() === '01') {
                var data = validate.getSFZBirthdayAndSex($('#applicantForPaperNo1').val());
                applicantBirthday = data.birthday;
                applicantSex = data.sex;
            } else {
                applicantBirthday = $('#J-datePicker-applicant').val().trim();
                applicantSex = $('#applicantBoy').is(':checked') === true ? 'M' : 'F';
            }

            if ($('#insurantCertType').val() === '01') {
                var data = validate.getSFZBirthdayAndSex($('#insurantForPaperNo1').val());
                insurantBirthday = data.birthday;
                insurantSex = data.sex;
                insurantAge = validate.getAgeByIdNo($('#insurantForPaperNo1').val());

            } else {
                insurantBirthday = $('#J-datePicker-insurant').val().trim();
                insurantSex = $("#insurantBoy").is(':checked') === true ? 'M' : 'F';
                insurantAge = validate.getAgeByDate($('#J-datePicker-insurant').val());
            }

            var info = {};
            info.applyNum = submit.applyNum;
            info.secondMediaSource = submit.secondMediaSource;
            info.remark = submit.remark;
            info.insuranceBeginTime = submit.insuranceBeginTime;
            info.insuranceEndTime = submit.insuranceEndTime;
            info.productCode = submit.productCode;
            info.planCode = submit.planCode;
            info.planName = submit.planName;
            info.packageCode = submit.packageCode;
            info.applicantInfo = {
                'name': $('#applicantName').val(),
                'birthday': applicantBirthday,
                "sexCode": applicantSex,
                "certificateNo": $('#applicantForPaperNo1').val(),
                "certificateType": $('#applicantCertType').val(),
                "email": $('#applicantEmail').val(),
                "mobileTelephone": $('#applicantMobile').val()

            };

            info.insurantInfoList = [{
                    "name": $('#insurantName').val(),
                    "birthday": insurantBirthday,
                    "age": insurantAge,
                    "sexCode": insurantSex,
                    "certificateNo": $('#insurantForPaperNo1').val(),
                    "certificateType": $('#insurantCertType').val(),
                    "totalActualPremium": submit.amount,
                    "relationshipWithApplicant": $('#forSelf').is(':checked') === true ? '1' : '9'
                }

            ];

            info.targetInfo = {
                "loadInstitution": $('#loanBank').val(),
                "loanContractNo": $('#loanCode').val(),
                "loanAmount": submit.loanAmount,
                "loanBeginDate": submit.insuranceBeginTime + ' 00:00:00',
                "loadnEndDate": submit.insuranceEndTime + ' 23:59:59'               
            }; 

            info.planInfoList = planInfoList;

            return info;
        },

        announcement: function(id) {
            var g, d, h, i, j, f, k, protocal, c;
            switch (id) {
                case 1:
                    $('#hideContent').hide();
                    g = "保险条款";
                    h = "#sytk";
                    j = document.createElement("iframe");
                    protocal = window.location.href.indexOf('https') === 0 ? 'https' : 'http';
                    k = protocal + '://' + window.location.host + '/icp_core_dmz/web/' + planCode + '.html';
                    j.setAttribute("id", "miuisProvision");
                    $('#hideInsuranceClause').append(j);
                    $('#miuisProvision').attr("src", k);
                    break;
                case 2:
                    $('#hideContent').show();
                    g = "投保声明";
                    h = "#tbsm";
                    d = applicantStatement;
                    break;
                case 3 :
                    $('#hideContent').hide();
                    g = "可投保的职业分类表";
                    h = "#zyfl";
                    j = document.createElement("iframe");
                    protocal = window.location.href.indexOf('https') === 0 ? 'https' : 'http';
                    k = protocal + '://' + window.location.host + '/icp_core_dmz/web/' + planCode + 'career.html';
                    j.setAttribute("id", "miuisProvision");
                    $('#hideInsuranceClause').append(j);
                    $('#miuisProvision').attr("src", k);                    
                    break;                    
            }
            $('#title').text(g);
            $('#hideContent').html(d);
            $('.contaitent').hide();
            $('.footer').hide();
            $('#hideInsuranceClause').show();

            window.history.pushState({
                title: h
            }, h, window.location.href + h);

            window.onpopstate = function(e) {
                if (id == 1 || id == 3) {
                    $('#miuisProvision').remove();
                };
                $('#hideInsuranceClause').hide();
                $('.contaitent').show();
                $('.footer').show();
            };
        },

        readRule: function() {
            var _that = this;
            $('#confirm_know_bxtk').on('click', function() {
                _that.announcement(1)
            });
            $('#confirm_know_tbxz').on('click', function() {
                _that.announcement(2)
            });
            $('#confirm_know_zyfl').on('click', function() {
                _that.announcement(3)
            });            
        }
    }

    app.init();

})();