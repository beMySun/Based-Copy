$(function () {
    'use strict';

    var productData = window.tool.getSessionStorage('productData');
    var urlParameters = window.tool.getSessionStorage('urlParameters');
    var windowHeight = $(window).height();
    var dates = {};
    var planInfo = {};

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
                error: function (res) {}
            });
        },

        //提交的数据
        setSubmitData: function () {
            var packageData = app.getSelectedPackage($('.package-item.active').data('packagecode') || planInfo.packageList[0].packageCode, planInfo.packageList);
            var submit = {
                insuranceBeginTime: $('#beginDateTime').val().trim(),
                insuranceEndTime: $('#endDateTime').val().trim(),
                applyNum: $('#applyNum').text().trim(),
                packageAmount: $.trim($('#packageAmount').text()),
                productCode: productData.PRODUCTCODE,
                keyCode: urlParameters.keyCode,
                secondMediaSource: urlParameters.userId || urlParameters.secondMediaSource,
                remark: urlParameters.remark
            };

            //优先取icpProductInfo的法律告知
            if (productData.icpProductInfo && productData.icpProductInfo.lawPolicy) {
                submit.lawPolicy = productData.icpProductInfo.lawPolicy;
            }

            //优先取accountInfo里面的payType
            if (productData.accountInfo && productData.accountInfo.payType) {
                submit.payType = productData.accountInfo.payType;
            }

            submit = $.extend({}, planInfo.localProMap, packageData, submit);
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
                    //先取套餐里面的性别限制值   2017-07-21
                    packageList[i].insuredLimitedSex && (result.insuredLimitedSex = packageList[i].insuredLimitedSex);
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

        //获取两个日期之间的天数
        getDateDiff: function (startDate, endDate) {
            var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
            var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
            var dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
            return Math.ceil(dates);
        },

        //比较两个日期先后,入参格式（yyyy-mm-dd,yyyy-mm-dd）
        compareTwoDate: function (date01, date02) {
            return new Date(date01) > new Date(date02);
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

        //从套餐中获取险种对应的责任代码和保额
        getLiability: function (packageId, packageList) {
            var length = packageList.length;
            var liabilityList = [];
            while (length--) {
                if (packageId === packageList[length].packageId) {
                    liabilityList = packageList[length].liabilityList;
                    break;
                }
            }

            var hash = {};
            var code;
            var i = liabilityList.length;
            while (i--) {
                code = liabilityList[i].insuranceTypeCode;
                (!hash[code]) && (hash[code] = []);
                hash[code].push({
                    dutyCode: liabilityList[i].liabilityCode,
                    insuredAmount: liabilityList[i].insuranceCoverage
                });
            }

            var result = [];
            for (var k in hash) {
                result.push({
                    planCode: k,
                    dutyInfoList: hash[k]
                });
            }
            return result;
        },

        //从产品中获取套餐ID，packageCode不传或者为undefined时，默认取第一个套餐的ID
        getPackageId: function (planId, packageCode) {
            var productData = window.tool.getSessionStorage('productData');
            var planList = productData.planInfoList;
            var plan;
            packageCode && (packageCode += '');

            var i = planList.length;
            while (i--) {
                if (planId === planList[i].localProMap.id) {
                    plan = planList[i];
                }
            }

            if (!plan) {
                return '';
            }

            if (!packageCode) {
                return plan.packageList[0].packageId;
            }

            var packageList = plan.packageList;
            var length = packageList.length;
            while (length--) {
                if (packageList[length].packageCode === packageCode) {
                    return packageList[length].packageId;
                }
            }
            return '';
        },

        //动态报价
        getDynamicPrice: function () {
            var insuranceBeginDate = $('#beginDateTime').val().trim() + ' 00:00:00';
            var insuranceEndDate = $('#endDateTime').val().trim() + ' 23:59:59';
            var planId = planInfo.localProMap.id;

            var packageCode = $('.package-tab-item.active').data('packagecode');
            var packageId = app.getPackageId(planId, packageCode);

            var sendData = {
                partnerCode: productData.ACCOUNT,
                productId: productData.icpProductInfo.productId,
                planId: planId,
                packageId: packageId,
                timestamp: window.tool.getCurrentDateTime(),
                orderNo: (new Date()).getTime() + '' + parseInt(Math.random() * Math.pow(10, 7)),
                productInfo: {
                    applyNum: $('#applyNum').text(),
                    totalActualPremium: 0,
                    insuranceBeginDate: insuranceBeginDate,
                    insuranceEndDate: insuranceEndDate
                },
                insurantInfoList: [{
                    name: "陈陈",
                    birthday: "1990-09-20",
                    age: "27",
                    sexCode: "M",
                    certificateNo: "007",
                    certificateType: "02"
                }],
                planInfoList: app.getLiability(packageId, planInfo.packageList),
                targetInfo: {}
            };

            var insuranceTime = app.getDateDiff(insuranceBeginDate, insuranceEndDate);
            $('#insuranceTime').text(insuranceTime + '天');
            $('#btnPrice').addClass('price-loading').removeClass('price-fail');

            $.ajax({
                url: '/icp/mobile_single_insurance/commonInsuranceQuote.do',
                type: 'post',
                dataType: 'json',
                data: JSON.stringify(sendData),
                success: function (res) {
                    if (res && res.resultCode === '00') {
                        //dynamic-price：xx元起
                        $('#btnPrice').removeClass('dynamic-price price-loading price-fail');
                        $('#packageAmount').text(res.totalActualPremium || '0');
                    } else {
                        $('#btnPrice').addClass('price-fail').removeClass('price-loading');
                    }
                },
                error: function () {
                    $('#btnPrice').addClass('price-fail').removeClass('price-loading');
                }
            });
        },

        //切换产品时，重新初始化保险起期和保险止期
        refleshDateTime: function (isDynamicAmount) {
            var className = '';
            var readOnly = ' readonly="true" ';
            var onChange = function (e) {
                var endDateTime = window.tool.getFutureDate(new Date(e.value.join('-')), 0, dates.maxInsuranceMonth, dates.maxInsuranceDay - 1);
                $('#endDateTime').val(endDateTime + ' ');
            };

            //动态报价
            if (isDynamicAmount === '1') {
                className = ' icon-active ';
                readOnly = '';
                onChange = function () {};
            }

            var beginDateTimeHtml = '<li class="wrap-item icon-active begin-date-time"> <label>保险起期</label> <div class="wrap-item-right"> <input class="date" id="beginDateTime" type="text"> <span class="time">00时</span> </div> </li>';
            var endDateTimeHtml = '<li class="wrap-item ' + className + ' end-date-time"> <label>保险止期</label> <div class="wrap-item-right"> <input class="date" id="endDateTime" type="text" ' + readOnly + '> <span class="time">24时</span> </div> </li>';
            $('.begin-date-time,.end-date-time').remove();
            $('.wrap').prepend(beginDateTimeHtml + endDateTimeHtml);

            $("#beginDateTime").val(dates.minStartDate + ' ').datetimePicker({
                title: "选择日期",
                yearSplit: "-",
                monthSplit: "-",
                datetimeSplit: " ",
                times: function () {
                    return [];
                },
                onChange: onChange
            });

            $('#endDateTime').val(dates.minEndDate + ' ');

            //固定保费时返回
            if (isDynamicAmount === '0') {
                return;
            }
            $('#endDateTime').datetimePicker({
                title: "选择日期",
                yearSplit: "-",
                monthSplit: "-",
                datetimeSplit: " ",
                times: function () {
                    return [];
                }
            });
        },

        // 切换套餐
        changePackage: function (packageCode, packageList) {
            var liabilityList = [];
            var packageAmount = ''; //套餐价格
            for (var i = 0; i < packageList.length; i++) {
                if (packageList[i].packageCode === packageCode) {
                    liabilityList = packageList[i].liabilityList || [];
                    $('#packageAmount').text(packageList[i].packageAmount || '--');
                    break;
                }
            }

            var liabilityListHtml = '';
            for (var i = 0; i < liabilityList.length; i++) {
                liabilityListHtml += '<li class="item"> <p class="item-title"><span>' + (liabilityList[i].liabilityName || '') + '</span><span>' + (liabilityList[i].insuranceCoverage || '') + '</span></p> <p class="item-desc">' + (liabilityList[i].liabilityDesc || '暂无描述') + '</p> </li>';
            }

            var productDetailHtml = '<div class="product-detail"><h2><span>保障内容</span><span>保障金额(元)</span></h2> <ul class="product-detail-list">' + liabilityListHtml + '</ul> <p class="more-detail"><span id="moreDetail" data-plancode="' + planInfo.localProMap.planCode + '">更多详情请查看《保险条款》</span></p></div>';
            $('.product-detail').remove();
            $('.product').append(productDetailHtml);

            if (packageList.length < 2) {
                return;
            }

            //套餐联动
            var selector = '.package-tab-item.className' + packageCode + ',.package-item.className' + packageCode;
            $(selector).addClass('active').siblings().removeClass('active');
        },

        // 切换产品
        changeProduct: function (planCode, planInfoList) {
            var packageList = [];
            //产品下拉列表
            var productOptionHtml = '';

            for (var i = 0; i < planInfoList.length; i++) {
                if (planCode === planInfoList[i].localProMap.planCode) {
                    //外部全局
                    planInfo = planInfoList[i];
                    packageList = planInfo.packageList;
                }
                productOptionHtml += '<option value="' + planInfoList[i].localProMap.planCode + '">' + planInfoList[i].localProMap.planName + '</option> ';
            }

            //标题
            $('.title').text(planInfo.localProMap.productName || '');

            var bannerHtml = '<section class="banner"> <img class="banner-img" src="' + '/icp/downloadFile.do?fileName=' + (planInfo.localProMap.productImageTopUrl || '').split('=')[1] + '=0' + '"><p class="banner-desc">' + (productData.icpProductInfo.productDesc || '') + '</p> </section>';
            var productDescHtml = '<div class="product-desc"> <img src="' + '/icp/downloadFile.do?fileName=' + (planInfo.localProMap.productImageIntroduceUrl || '').split('=')[1] + '=0' + '"></div>';
            var productSchemeHtml = planInfoList.length < 2 ? '' : '<div class="product-scheme"><div class="form-group form-group-select"> <label> 产品方案：</label> <form><select class="form-control form-control-select" id="productScheme">' + productOptionHtml + '</select> </form> </div> </div>';

            //处理套餐html
            var packageSchemeHtml = '';
            var slideUpPackageListHtml = '';
            if (packageList && packageList.length > 1) {
                var packageListHtml = '';
                var slideUpListHtml = '';
                var active;
                for (var i = 0; i < packageList.length; i++) {
                    active = i ? ' ' : ' active ';
                    packageListHtml += '<li class="package-tab-item' + active + 'className' + packageList[i].packageCode + '" data-packagecode="' + packageList[i].packageCode + '">' + packageList[i].packageName + '</li>';
                    slideUpListHtml += '<li class="package-item' + active + 'className' + packageList[i].packageCode + '" data-packagecode="' + packageList[i].packageCode + '">' + packageList[i].packageName + '</li>';
                }
                packageSchemeHtml = '<div class="package-scheme"><ul class="package-tab">' + packageListHtml + '</ul></div>';
                slideUpPackageListHtml = '<li class="wrap-item wrap-item-package"> <label>保障方案</label> <div class="wrap-item-right"> <ul class="package-list">' + slideUpListHtml + '</ul> </div> </li>';
            }

            var noticeHtml = '<section class="notice" id="notice"> <h2 class="wrap-title">投保须知</h2> <div class="wrap-body notice-detail"> <img src="' + '/icp/downloadFile.do?fileName=' + (planInfo.localProMap.productImageNoticeUrl || '').split('=')[1] + '=0' + '"> </div> </section>';
            var claimHtml = '<section class="claim" id="claim"> <h2 class="wrap-title">理赔指南</h2> <div class="wrap-body claim-detail"> <img src="' + '/icp/downloadFile.do?fileName=' + (planInfo.localProMap.productImageClaimUrl || '').split('=')[1] + '=0' + '"> </div> </section>';
            var quesionHtml = '<section class="quesion" id="quesion"> <h2 class="wrap-title">常见问题</h2> <div class="wrap-body quesion-detail"> <img src="' + '/icp/downloadFile.do?fileName=' + (planInfo.localProMap.productImageIproblemUrl || '').split('=')[1] + '=0' + '"> </div> </section>';

            $('.banner,.notice,.claim,.quesion,.wrap-item-package').remove();
            $('.nav').before(bannerHtml);
            $('.product').empty().prepend(productDescHtml + productSchemeHtml + packageSchemeHtml).after(noticeHtml + claimHtml + quesionHtml);


            //切换时，产品方案跟着变
            $('#productScheme').val(planCode);

            //获取偿付能力
            app.getSolvency();
            //处理投保相关的限制时间（外部全局）
            dates = app.getDatesFromPlanInfo(planInfo);
            //处理保险起止期
            app.refleshDateTime(planInfo.localProMap.isDynamicAmount);
            //处理弹窗套餐
            $('.wrap').prepend(slideUpPackageListHtml);
            // 处理保险期限
            $('#insuranceTime').text(dates.maxInsuranceMonth ? dates.maxInsuranceMonth + '月' : dates.maxInsuranceDay + '天');

            //先清除动态报价时添加的类           
            $('#btnPrice').removeClass('dynamic-price price-loading price-fail');
            planInfo.localProMap.isDynamicAmount === '1' && $('#btnPrice').addClass('dynamic-price');

            app.changePackage(packageList[0].packageCode, packageList);
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
                .on('click', '.item', function () { //保障内容
                    $(this).toggleClass('active');
                })
                .on('click', '.ui-mask', function () { //弹窗消退
                    $('body').removeClass('stop-scrolling');
                    $('.slide-up-wrap').removeClass('active');
                })
                .on('change', '#productScheme', function () { //产品方案
                    app.changeProduct($(this).val(), productData.planInfoList);
                })
                .on('click', '.package-tab-item , .package-item', function () { //套餐方案
                    app.changePackage($(this).data('packagecode'), planInfo.packageList);
                    $('#btnPrice').removeClass('price-loading price-fail');
                    //不报价
                    if (planInfo.localProMap.isDynamicAmount === '0') {
                        $('#btnPrice').removeClass('dynamic-price');
                        return;
                    }

                    //报价
                    $('#btnPrice').addClass('dynamic-price');
                    if ($(this).hasClass('package-item')) {
                        app.getDynamicPrice();
                    }
                })
                .on('click', '#moreDetail', function () { //查看保险条款
                    var planCode = $(this).data('plancode');
                    var src = window.location.origin + '/icp_core_dmz/web/' + planCode + '.html';
                    app.setIframe(src);
                })
                .on('click', '#buy', function () { //立即投保
                    var slideUpWrapDom = $('.slide-up-wrap');
                    if (slideUpWrapDom.hasClass('active')) {
                        var $btnDynamicPrice = $('#btnPrice');
                        if ($btnDynamicPrice.hasClass('price-loading')) {
                            window.wAlert('正在计算保费');
                            return false;
                        }

                        if ($btnDynamicPrice.hasClass('price-fail')) {
                            window.wAlert('保费计算失败');
                            return false;
                        }

                        if (app.compareTwoDate($('#beginDateTime').val().trim(), $('#endDateTime').val().trim())) {
                            window.wAlert('保险起期不能晚于保险止期');
                            return false;
                        }

                        //保险起期校验
                        var checkResult = app.isDateInRange($('#beginDateTime').val().trim(), dates.minStartDate, dates.maxStartDate, '保险起期');
                        if (!checkResult.isDateInRange) {
                            window.wAlert(checkResult.msg);
                            return false;
                        }

                        //动态报价时，校验止期
                        if (planInfo.localProMap.isDynamicAmount === '1') {
                            var dynamicEndDate = window.tool.getFutureDate(new Date($('#beginDateTime').val().trim()), 0, dates.maxInsuranceMonth, dates.maxInsuranceDay - 1);
                            checkResult = app.isDateInRange($('#endDateTime').val(), $('#beginDateTime').val().trim(), dynamicEndDate, '保险止期');
                            if (!checkResult.isDateInRange) {
                                window.wAlert(checkResult.msg);
                                return false;
                            }
                        }

                        app.setSubmitData();
                        //埋点统计
                        window.tool.buyBtnTJ && window.tool.buyBtnTJ();
                        window.location.href = 'applicant.html';
                        return;
                    }

                    // 报价
                    if (planInfo.localProMap.isDynamicAmount === '1') {
                        app.getDynamicPrice();
                    }

                    $('body').addClass('stop-scrolling');
                    slideUpWrapDom.addClass('active');

                });

            $(document).on('click', '.close-picker', function () {
                if (app.compareTwoDate($('#beginDateTime').val().trim(), $('#endDateTime').val().trim())) {
                    window.wAlert('保险起期不能晚于保险止期');
                    return false;
                }

                //保险起期校验
                var checkResult = app.isDateInRange($('#beginDateTime').val().trim(), dates.minStartDate, dates.maxStartDate, '保险起期');
                if (!checkResult.isDateInRange) {
                    window.wAlert(checkResult.msg);
                    return false;
                }

                //动态报价时，校验止期
                if (planInfo.localProMap.isDynamicAmount === '1') {
                    var dynamicEndDate = window.tool.getFutureDate(new Date($('#beginDateTime').val().trim()), 0, dates.maxInsuranceMonth, dates.maxInsuranceDay - 1);
                    checkResult = app.isDateInRange($('#endDateTime').val(), $('#beginDateTime').val().trim(), dynamicEndDate, '保险止期');
                    if (!checkResult.isDateInRange) {
                        window.wAlert(checkResult.msg);
                        return false;
                    }
                    app.getDynamicPrice();
                }
            });

            $(window).on('scroll', function () {

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

            app.changeProduct(planCode, planInfoList);
        },

        init: function () {
            app.render();
            app.binding();
            $('.loading').hide();
        }
    };

    app && app.init();
});