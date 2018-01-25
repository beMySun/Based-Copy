$(function () {
    'use strict';

    var productData = window.tool.getSessionStorage('productData');
    var urlParameters = window.tool.getSessionStorage('urlParameters');
    var windowHeight = $(window).height();
    var dates = {};
    var planInfo = {};
    var selectedPackage = {};
    var app = {

        //获取偿付能力数据
        getSolvency: function () {
            var solvency = window.sessionStorage.getItem('solvency');
            if (solvency) {
                $('.notice-detail').append('<div class="solvency"><h2>重要信息告知</h2>' + solvency + '</div>');
                return;
            }

            $.ajax({
                url: '/icp/getSolvency.do',
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (res && res.resultCode === '00' && res.solvency) {
                        window.sessionStorage.setItem('solvency', res.solvency);
                        $('.notice-detail').append('<div class="solvency"><h2>重要信息告知</h2>' + res.solvency + '</div>');
                    }
                },
                error: function (res) { }
            });
        },


        //提交的数据
        setSubmitData: function () {
            // var packageData = app.getSelectedPackage($('.package-item.active').data('packagecode') || planInfo.packageList[0].packageCode, planInfo.packageList);

            var submit = {
                insuranceBeginTime: $('#beginDateTime').val().trim(),
                insuranceEndTime: $('#endDateTime').val().trim(),
                applyNum: $('#applyNum').text().trim(),
                productCode: productData.PRODUCTCODE,
                keyCode: urlParameters.keyCode,
                secondMediaSource: urlParameters.userId || urlParameters.secondMediaSource,
                remark: urlParameters.remark,
                isShowUploader: $('.A4 option').not(function () { return !this.selected }).attr('data-code') == '0' ? false : true
            };

            //优先取icpProductInfo的法律告知  2017-07-21
            if (productData.icpProductInfo && productData.icpProductInfo.lawPolicy) {
                submit.lawPolicy = productData.icpProductInfo.lawPolicy;
            }

            var packageData = selectedPackage;
            submit = $.extend({}, planInfo.localProMap, packageData, submit);

            if (!packageData.insuredLimitedSex) {
                submit.insuredLimitedSex = planInfo.localProMap.insuredLimitedSex;
            }

            window.tool.setSessionStorage('submit', submit);
        },

        getSelectedPackage: function (packageCode, packageList) {
            var result = {};
            for (var i = 0; i < packageList.length; i++) {
                if (packageList[i].packageCode === packageCode) {
                    result = {
                        packageCode: packageCode,
                        packageName: packageList[i].packageName,
                        insuredMaxAge: packageList[i].insuredMaxAge,
                        insuredMiniAge: packageList[i].insuredMiniAge,
                        packageAmount: packageList[i].packageAmount,
                        minInsuredNumber: packageList[i].minInsuredNumber,
                        maxInsuredNumber: packageList[i].maxInsuredNumber
                    };
                    break;
                }
            }
            return result;
        },

        //获取承保期限和保险期限
        getDatesFromPlanInfo: function (planInfo) {

            var today = new Date();
            var tomorrow = new Date(today.setDate(today.getDate() + 1));

            var leastBeginTime = planInfo.localProMap.leastBeginTime;
            leastBeginTime = leastBeginTime ? (new Date(leastBeginTime)) : tomorrow;

            //保险期
            var maxInsuranceMonth = planInfo.localProMap.maxInsuranceMonth;
            var maxInsuranceDay = planInfo.localProMap.maxInsuranceDay;

            //起保期
            var maxUnderWriteMonth = planInfo.localProMap.maxUnderWriteMonth;
            var maxUnderWriteDay = planInfo.localProMap.maxUnderWriteDay;

            //日期非空判断
            maxInsuranceMonth = maxInsuranceMonth ? maxInsuranceMonth - 0 : 0;
            maxInsuranceDay = maxInsuranceDay ? maxInsuranceDay - 0 : 0;
            maxUnderWriteMonth = maxUnderWriteMonth ? maxUnderWriteMonth - 0 : 0;
            maxUnderWriteDay = maxUnderWriteDay ? maxUnderWriteDay - 0 : 0;

            //最小起期和最小止期
            var minStartDate = tool.getFutureDate(leastBeginTime, 0, 0, 0);
            var minEndDate = tool.getFutureDate(new Date(minStartDate), 0, maxInsuranceMonth, maxInsuranceDay - 1);

            //最大起期和最大止期
            var maxStartDate = tool.getFutureDate(new Date(), 0, maxUnderWriteMonth, maxUnderWriteDay);
            var maxEndDate = tool.getFutureDate(new Date(maxStartDate), 0, maxInsuranceMonth, maxInsuranceDay - 1);

            return {
                leastBeginTime: leastBeginTime,
                maxInsuranceMonth: maxInsuranceMonth,
                maxInsuranceDay: maxInsuranceDay,
                maxUnderWriteMonth: maxUnderWriteMonth,
                maxUnderWriteDay: maxUnderWriteDay,
                minStartDate: minStartDate, //最小起期
                minEndDate: minEndDate, //最小止期
                maxStartDate: maxStartDate, //最大起期
                maxEndDate: maxEndDate //最大止期
            }
        },

        setIframe: function (src) {
            var headerTitle = $('.title').text();

            var parentDom = document.createElement('div');
            parentDom.className = 'iframe-container';
            var iframe = document.createElement('iframe');
            iframe.src = src || '';
            parentDom.appendChild(iframe);

            $('.content').hide().after(parentDom);
            $('.title').text('保险条款');

            window.history.pushState({
                title: '#insuranceClause'
            }, '#insuranceClause', window.location.href + '#insuranceClause');
            window.onpopstate = function (e) {
                $('.content').show();
                $('.iframe-container').remove();
                $('.title').text(headerTitle);
            };
        },

        //specifiedDate是否在指定的时间范围(日期入参格式：yyyy-mm-dd，yyyy/mm/dd)，title可选
        isDateInRange: function (specifiedDate, startDate, endDate, title) {
            specifiedDate = specifiedDate.trim();
            startDate = startDate.trim();
            endDate = endDate.trim();
            var spDate = new Date(specifiedDate);
            var stDate = new Date(startDate);
            var enDate = new Date(endDate);
            var result = {
                isDateInRange: true,
                msg: 'ok'
            };
            title = title || '日期';

            if (spDate < stDate) {
                result.isDateInRange = false;
                result.msg = title + '不能早于' + startDate;
            } else if (spDate > enDate) {
                result.isDateInRange = false;
                result.msg = title + '不能晚于' + endDate;
            }
            return result;
        },

        initBeginDateTime: function (DateString, callback) {
            var input = DateString;
            if (Object.prototype.toString.call(DateString) === "[object Date]") {
                input = window.tool.getFutureDate(DateString, 0, 0, 0);
            } else if (!DateString || (typeof DateString !== 'string')) {
                input = window.tool.getFutureDate(new Date(), 0, 0, 0);
            }

            $("#beginDateTime").val(input + ' ').datetimePicker({
                title: "选择日期",
                yearSplit: "-",
                monthSplit: "-",
                datetimeSplit: " ",
                times: function () {
                    return [];
                },
                onChange: callback
            });
        },

        renderAllTime: function (planInfo) {
            var dates = app.getDatesFromPlanInfo(planInfo);
            $('#insuranceTime').text(dates.maxInsuranceMonth ? dates.maxInsuranceMonth + '月' : dates.maxInsuranceDay + '天');
            $('#endDateTime').val(dates.minEndDate + ' ');
            app.initBeginDateTime(dates.minStartDate, function (e) {
                var endDateTime = window.tool.getFutureDate(new Date(e.value.join('-')), 0, dates.maxInsuranceMonth, dates.maxInsuranceDay - 1);
                $('#endDateTime').val(endDateTime + ' ');
            });
        },

        changePackage: function (packageList) {

            // A: 指宠物责任意外伤害， 第一个可选列表
            // B: 指宠物健康医疗， 第二个可选列表
            // amount 字段用于显示给用户选择
            // A, B 这两段数据 需要手工维护:

            var A = [{
                'amount': "10万",
                'insuranceCoverage': "100000",
                'liabilityCode': "CV83101",
                "insuranceTypeCode": "PL0283001"
            },
            {
                "liabilityCode": "CV83101",
                "insuranceTypeCode": "PL0283001",
                "insuranceCoverage": "120000",
                'amount': "12万",
            },
            {
                "liabilityCode": "CV83101",
                "insuranceTypeCode": "PL0283001",
                "insuranceCoverage": "200000",
                'amount': "20万",
            }, {
                "liabilityCode": "CV83101",
                "insuranceTypeCode": "PL0283001",
                "insuranceCoverage": "300000",
                'amount': "30万",
            }];

            var B = [{
                "insuranceTypeCode": "PL0200132",
                "insuranceCoverage": "10000",
                'amount': "1万(38项)",
            }, {
                "insuranceTypeCode": "PL0200133",
                "insuranceCoverage": "10000",
                'amount': "2万(58项)",

            }, {
                "insuranceTypeCode": "PL0200134",
                "insuranceCoverage": "20000",
                'amount': "2万(116项)",
            },];

            var liabilityStr = '';
            var str1 = '';
            var str2 = '<option data-code="0">不投保</option>';
            for (var i = 0; i < A.length; i++) {
                str1 += '<option data-code=' + A[i].liabilityCode + ' data-typecode=' + A[i].insuranceTypeCode + ' data-amount=' + A[i].insuranceCoverage + '>' + A[i].amount + '</option>';
            }

            for (var i = 0; i < B.length; i++) {
                str2 += '<option data-code=' + B[i].insuranceTypeCode + '>' + B[i].amount + '</option>';
            }

            liabilityStr = '<li class="item">' + '<p class="item-title select">' + '<span>' + '宠物责任意外伤害、身故、残疾' + '</span>' + '<select class="A1">' + str1 + '</select>' + '</p>' + '</li>' +
                '<li class="item">' + '<p class="item-title">' + '<span>' + '宠物责任意外医疗' + '</span>' + '<span class="A2">' + '10000' + '</span>' + '</p>' + '</li>' +
                '<li class="item">' + '<p class="item-title">' + '<span>' + '宠物责任意外财产损失' + '</span>' + '<span class="A3">' + '10000' + '</span>' + '</p>' + '</li>' +
                '<li class="item">' + '<p class="item-title">' + '<span>' + '芯片排异反应意外身故' + '</span>' + '<span class="A5">' + '1500' + '</span>' + '</p>' + '</li>' +
                '<li class="item">' + '<p class="item-title select">' + '<span>' + '宠物健康医疗' + '</span>' + '<select class="A4">' + str2 + '</select>' + '</p>' + '</li>';

            var productDetailHtml = '<div class="product-detail"><h2><span>保障内容</span><span>保障金额(元)</span></h2> <ul class="product-detail-list">' + liabilityStr + '</ul> <p class="more-detail"><span id="moreDetail" data-plancode="' + planInfo.localProMap.planCode + '">更多详情请查看《保险条款》</span></p></div>';
            $('.product-detail').remove();
            $('.product').append(productDetailHtml);

            app.selectIndex();
        },
        selectIndex: function () {

            var keyA = {
                'code': $('.A1 option').not(function () {
                    return !this.selected
                }).attr('data-code'),
                'typeCode': $('.A1 option').not(function () {
                    return !this.selected
                }).attr('data-typecode'),
                'amount': $('.A1 option').not(function () {
                    return !this.selected
                }).attr('data-amount'),
            }

            var keyATypeCode = keyA.typeCode;
            var keyACode = keyA.code;
            var keyAamount = keyA.amount;
            var keyBCode = $('.A4 option').not(function () {
                return !this.selected
            }).attr('data-code');
            var packageList = productData.planInfoList[0].packageList;

            var i, j, packageIndex = [],
                targetPackage = [],
                pp = [];
            // 根据条件A筛选一次
            for (i = 0; i < packageList.length; i++) {
                for (j = 0; j < packageList[i].liabilityList.length; j++) {
                    var liabilityList = productData.planInfoList[0].packageList[i].liabilityList;
                    if (liabilityList[j].liabilityCode === keyACode &&
                        liabilityList[j].insuranceTypeCode === keyATypeCode &&
                        liabilityList[j].insuranceCoverage === keyAamount) {
                        packageIndex.push(i);
                        targetPackage.push(packageList[i]);
                    }
                }
            }

            // 根据条件B筛选一次
            for (i = 0; i < targetPackage.length; i++) {
                if (keyBCode == '0' && targetPackage[i].liabilityList.length == 3) { // B 不选
                    app.setAmount(targetPackage[i]);
                } else {
                    for (var j = 0; j < targetPackage[i].liabilityList.length; j++) {
                        var liabilityList = targetPackage[i].liabilityList;
                        if (keyBCode == liabilityList[j].insuranceTypeCode) {
                            app.setAmount(targetPackage[i]);
                        }
                    }
                }
            }

        },

        setAmount: function (targetPackage) {

            console.log(targetPackage.packageName);

            selectedPackage = targetPackage;

            var packageName = targetPackage.packageName;
            var packagePrice = targetPackage.packageAmount;

            // 获得套餐价格 和另外两条责任的价格
            var A2, A3;
            var liabilityList = targetPackage.liabilityList;

            for (var i = 0; i < liabilityList.length; i++) {
                if (liabilityList[i].liabilityCode == 'CV83102') { // 宠物责任意外医疗
                    A2 = liabilityList[i].insuranceCoverage
                }

                if (liabilityList[i].liabilityCode == 'CV83103') { // 宠物责任财产损失
                    A3 = liabilityList[i].insuranceCoverage
                }
            }

            //  console.log('宠物责任意外医疗价格:'+A2)
            //  console.log('宠物责任财产损失: '+A3)

            var A2Price, A3Price;
            A2Price = app.convertPrice(A2);
            A3Price = app.convertPrice(A3);


            $('.A2').text(A2Price);
            $('.A3').text(A3Price);
            $('#packageAmount').text(packagePrice);
        },
        convertPrice: function (amount) {
            // 简单处理价格
            var price;
            if (amount.length == 3) {
                price = (amount / 100) + '百';
            } else if (amount.length == 4) {
                price = (amount / 1000) + '千';
            } else if (amount.length >= 5) {
                price = (amount / 10000) + '万';
            }
            return price;
        },
        renderProduct: function (planCode, planInfoList) {
            var packageList = [];
            var productOptionHtml = ''; //产品下拉列表

            for (var i = 0; i < planInfoList.length; i++) {
                if (planInfoList[i].localProMap.planCode === planCode) {
                    planInfo = planInfoList[i]; //外部全局
                    packageList = planInfo.packageList;
                }
                productOptionHtml += '<option value="' + planInfoList[i].localProMap.planCode + '">' + planInfoList[i].localProMap.planName + '</option> ';
            }

            $('.title').text(planInfo.localProMap.productName || '');

            var bannerHtml = '<section class="banner"> <img class="banner-img" src="' + '/icp/downloadFile.do?fileName=' + (planInfo.localProMap.productImageTopUrl || '').split('=')[1] + '=0' + '"><p class="banner-desc">' + (productData.icpProductInfo.productDesc || '') + '</p> </section>';
            var productDescHtml = '<div class="product-desc"> <img src="' + '/icp/downloadFile.do?fileName=' + (planInfo.localProMap.productImageIntroduceUrl || '').split('=')[1] + '=0' + '"></div>';
            var productSchemeHtml = planInfoList.length < 2 ? '' : '<div class="product-scheme"><div class="form-group form-group-select"> <label> 产品方案：</label> <form><select class="form-control form-control-select" id="productScheme">' + productOptionHtml + '</select> </form> </div> </div>';

            var packageSchemeHtml = '';
            var slideUpPackageListHtml = '';
            if (packageList && packageList.length > 1) {
                var packageListHtml = '';
                var slideUpListHtml = '';
                for (var i = 0; i < packageList.length; i++) {
                    if (i > 0) {
                        packageListHtml += '<li class="package-tab-item ' + 'className' + packageList[i].packageCode + '" data-packagecode="' + packageList[i].packageCode + '">' + packageList[i].packageName + '</li>';
                        slideUpListHtml += '<li class="package-item ' + 'className' + packageList[i].packageCode + '" data-packagecode="' + packageList[i].packageCode + '">' + packageList[i].packageName + '</li>';
                    } else {
                        packageListHtml += '<li class="package-tab-item active ' + 'className' + packageList[i].packageCode + '"  data-packagecode="' + packageList[i].packageCode + '">' + packageList[i].packageName + '</li>';
                        slideUpListHtml += '<li class="package-item active ' + 'className' + packageList[i].packageCode + '" data-packagecode="' + packageList[i].packageCode + '">' + packageList[i].packageName + '</li>';
                    }
                }
                packageSchemeHtml = '<div class="package-scheme"><ul class="package-tab">' + packageListHtml + '</ul></div>';
                slideUpPackageListHtml = '<li class="wrap-item wrap-item-package"> <label>保障方案</label> <div class="wrap-item-right"> <ul class="package-list">' + slideUpListHtml + '</ul> </div> </li>';
            }

            var noticeHtml = '<section class="notice" id="notice"> <h2 class="wrap-title">投保须知</h2> <div class="wrap-body notice-detail"> <img src="' + '/icp/downloadFile.do?fileName=' + (planInfo.localProMap.productImageNoticeUrl || '').split('=')[1] + '=0' + '"> </div> </section>';
            var claimHtml = '<section class="claim" id="claim"> <h2 class="wrap-title">理赔指南</h2> <div class="wrap-body claim-detail"> <img src="' + '/icp/downloadFile.do?fileName=' + (planInfo.localProMap.productImageClaimUrl || '').split('=')[1] + '=0' + '"> </div> </section>';
            var quesionHtml = '<section class="quesion" id="quesion"> <h2 class="wrap-title">常见问题</h2> <div class="wrap-body quesion-detail"> <img src="' + '/icp/downloadFile.do?fileName=' + (planInfo.localProMap.productImageIproblemUrl || '').split('=')[1] + '=0' + '"> </div> </section>';

            $('.banner,.notice,.claim,.quesion,.wrap-item-package,.begin-date-time').remove();
            $('.nav').before(bannerHtml);
            $('.product').empty().prepend(productDescHtml + productSchemeHtml).after(noticeHtml + claimHtml + quesionHtml);
            $('#productScheme').val(planCode); //切换时，产品方案跟着变

            var beginDateTimeHtml = '<li class="wrap-item icon-active begin-date-time"> <label>保险起期</label> <div class="wrap-item-right"> <input class="date" id="beginDateTime" type="text"> <span class="time">00时</span> </div> </li>';
            $('.wrap').prepend(beginDateTimeHtml);

            //时间处理
            app.renderAllTime(planInfo);
            //获取偿付能力
            app.getSolvency();
            dates = app.getDatesFromPlanInfo(planInfo); //外部全局

            app.changePackage(packageList);
        },

        binding: function () {
            $('.page')
                .on('click', '.nav-tab-item', function () { //导航tab
                    var $this = $(this);
                    var scrollTop = $('#' + $this.data('scroll-to')).offset().top - $('.nav').offset().height;

                    $this.addClass('active').siblings().removeClass('active');
                    $('html,body').scrollTop(scrollTop);
                })
                .on('click', '.package-tab-item', function () { //套餐tab
                    $(this).addClass('active').siblings().removeClass('active');
                })
                .on('click', '.package-item', function () { //套餐btn
                    $(this).addClass('active').siblings().removeClass('active');
                })
                .on('click', '.ui-mask', function () { //弹窗消退
                    $('body').removeClass('stop-scrolling');
                    $('.slide-up-wrap').removeClass('active');
                })
                .on('click', '#moreDetail', function () { //查看保险条款
                    var planCode = $(this).data('plancode');
                    var src = window.location.origin + '/icp_core_dmz/web/' + planCode + '.html';
                    app.setIframe(src);
                })
                .on('change', '.A1', function () {
                    app.selectIndex();
                })
                .on('change', '.A4', function () {
                    app.selectIndex();
                })
                .on('click', '#buy', function () { //立即投保

                    console.log(selectedPackage);

                    var slideUpWrapDom = $('.slide-up-wrap');
                    if (slideUpWrapDom.hasClass('active')) {
                        var checkResult = app.isDateInRange($('#beginDateTime').val(), dates.minStartDate, dates.maxStartDate, '保险起期');
                        if (!checkResult.isDateInRange) {
                            window.wAlert(checkResult.msg);
                            return false;
                        }
                        app.setSubmitData();
                        //埋点统计
                        window.tool.buyBtnTJ && window.tool.buyBtnTJ();
                        window.location.href = 'otherPages/pet/petKind.html'
                    } else {
                        $('body').addClass('stop-scrolling');
                        slideUpWrapDom.addClass('active');
                    }
                });

            $(document).on('click', '.close-picker', function () {
                var checkResult = app.isDateInRange($('#beginDateTime').val().trim(), dates.minStartDate, dates.maxStartDate, '保险起期');
                if (!checkResult.isDateInRange) {
                    window.wAlert(checkResult.msg);
                    return false;
                }
            });

            $(window).on('scroll', function (e) {
                //nav浮动
                var $this = $(this);
                var navDom = $('.nav');
                var productDom = $('.product');
                var navHeight = navDom.offset().height;
                var navTop = productDom.offset().top - navHeight;
                var scrollTop = $this.scrollTop();

                if (scrollTop >= navTop) {
                    navDom.addClass('active');
                    productDom.addClass('active');
                } else {
                    navDom.removeClass('active');
                    productDom.removeClass('active');
                }

                //nav切换
                var noticeTop = $('#notice').offset().top - navHeight;
                var claimTop = $('#claim').offset().top - navHeight;
                var quesionTop = $('#quesion').offset().top - navHeight;
                var itemDomList = navDom.find('.nav-tab-item');

                if (scrollTop >= quesionTop || scrollTop === $(document).height() - $this.height()) {
                    itemDomList.removeClass('active').eq(3).addClass('active');
                } else if (scrollTop >= claimTop) {
                    itemDomList.removeClass('active').eq(2).addClass('active');
                } else if (scrollTop >= noticeTop) {
                    itemDomList.removeClass('active').eq(1).addClass('active');
                } else {
                    itemDomList.removeClass('active').eq(0).addClass('active');
                }
            });

        },

        render: function () {
            if (!productData) {
                window.wAlert('云产品数据有误');
                $('.page').remove();
                return false;
            }

            var planInfoList = productData.planInfoList;
            if (!planInfoList || planInfoList.length < 0) {
                window.wAlert('套餐数据有误');
                $('.page').remove();
                return false;
            }

            var planCode = $.trim(planInfoList[0].localProMap.planCode);
            if (!planCode) {
                window.wAlert('产品代码有误');
                $('.page').remove();
                return false;
            }

            app.renderProduct(planCode, planInfoList);
        },

        init: function () {
            app.render();
            app.binding();
            $('.loading').hide();
        }
    };

    app && app.init();
});
