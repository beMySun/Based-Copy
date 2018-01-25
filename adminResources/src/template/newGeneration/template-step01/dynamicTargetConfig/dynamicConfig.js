$(function() {
    'use strict';

    var productData = window.tool.getSessionStorage('productData');
    var urlParameters = window.tool.getSessionStorage('urlParameters');

    var dates = {};
    var planInfo = {};
    var planIds = [];

    var app = {

        //获取偿付能力数据
        getSolvency: function() {
            var solvency = window.sessionStorage.getItem('solvency');
            if (solvency) {
                $('.notice-detail').append('<div class="solvency"><h2>重要信息告知</h2>' + solvency + '</div>');
                return;
            }

            $.ajax({
                url: '/icp/getSolvency.do',
                type: 'POST',
                dataType: 'json',
                success: function(res) {
                    if (res && res.resultCode === '00' && res.solvency) {
                        window.sessionStorage.setItem('solvency', res.solvency);
                        $('.notice-detail').append('<div class="solvency"><h2>重要信息告知</h2>' + res.solvency + '</div>');
                    }
                },
                error: function(res) {}
            });
        },

        //动态报价价格设置
        calculatePrice: function(packageId) {
            var data = {
                partnerCode: productData.partnerCode,
                productId: productData.productInfo.productId,
                planId: planInfo.planId,
                packageId: packageId,
                tiemStamp: window.tool.getCurrentDateTime(),
                orderNo: (new Date()).getTime() + '' + parseInt(Math.random() * Math.pow(10, 7)),
                productInfo: {
                    applyNum: $('#applyNum').val(),
                    insuranceBeginTime: $('#beginDateTime').val() + ' 00:00:00',
                    insuranceBeginTime: $('#endDateTime').val() + ' 23:59:59'
                },
                targetInfo: {}
            };
            $.ajax({
                url: '/icp/mobile_single_insurance/commonInsuranceQuote.do',
                type: 'post',
                data: data,
                success: function(res) {
                    res && typeof res === 'string' && JSON.parse(res);
                    if (res.resultCode === '00') {
                        $('#packageAmount').text(res.totalActualPremium);
                    } else {
                        window.wAlert('报价失败，请稍候重试');
                    }
                },
                error: function() {
                    window.wAlert('网络出错，请稍后重试');
                }
            });
        },

        //动态报价时间设置
        setAutoInsuranceTime: function() {
            $('#insuranceTime').text(dates.maxInsuranceMonth ? dates.maxInsuranceMonth + '月' : dates.maxInsuranceDay + '天');
            $("#beginDateTime").val(dates.minStartDate + ' ').datetimePicker({
                title: "选择日期",
                yearSplit: "-",
                monthSplit: "-",
                datetimeSplit: " ",
                times: function() {
                    return [];
                }
            });
            $('#endDateTime').val(dates.minEndDate + ' ').datetimePicker({
                title: "选择日期",
                yearSplit: "-",
                monthSplit: "-",
                datetimeSplit: " ",
                times: function() {
                    return [];
                }
            });
        },

        //责任信息渲染
        setLiabilityInfo: function(liabilityList) {
            //兼容共享保额
            var resultObj = {};
            for (var i = 0; i < liabilityList.length; i++) {
                if (!liabilityList[i].insuranceTypeMergeFlag) {
                    resultObj[i + 'notShare'] = {
                        liabilityName: liabilityList[i].liabilityName || '',
                        liabilityDesc: liabilityList[i].liabilityDesc || '',
                        insuranceCoverage: liabilityList[i].insuranceCoverage || ''
                    };
                } else if (resultObj['share' + (liabilityList[i].insuranceTypeMergeFlag)]) {
                    resultObj['share' + (liabilityList[i].insuranceTypeMergeFlag)].liabilityName += '、' + (liabilityList[i].liabilityName || '');
                    resultObj['share' + (liabilityList[i].insuranceTypeMergeFlag)].liabilityDesc += liabilityList[i].liabilityDesc ? ('、' + liabilityList[i].liabilityDesc) : '';
                } else {
                    resultObj['share' + liabilityList[i].insuranceTypeMergeFlag] = {
                        liabilityName: liabilityList[i].liabilityName || '',
                        liabilityDesc: liabilityList[i].liabilityDesc || '',
                        insuranceCoverage: liabilityList[i].insuranceCoverage || ''
                    };
                }
            }
            var liabilityStr = '';
            if (!$.isEmptyObject(resultObj)) {
                for (var key in resultObj) {
                    if (resultObj.hasOwnProperty(key)) {
                        var data = resultObj[key];
                        liabilityStr += '<li class="item">' + '<p class="item-title">' + '<span>' + (data.liabilityName || '') + '</span>' + '<span>' + (data.insuranceCoverage || '') + '</span>' + '</p>' + '<p class="item-desc">' + (data.liabilityDesc || '暂无描述') + '</p>' + '</li>';
                    }
                }
            }
            var productDetailHtml = '<div class="product-detail"><h2><span>保障内容</span><span>保障金额(元)</span></h2> <ul class="product-detail-list">' + liabilityStr + '</ul> <p class="more-detail"><span id="moreDetail" data-plancode="' + planInfo.planCode + '">更多详情请查看《保险条款》</span></p></div>';
            $('.product-detail').remove();
            $('.product').append(productDetailHtml);
        },

        //提交的数据
        setSubmitData: function() {
            var packageData = app.getSelectedPackage($('.package-item.active').data('packagecode') || planInfo.packageList[0].packageCode, planInfo.packageList);
            var submit = {
                insuranceBeginTime: $('#beginDateTime').val().trim() + ' 00:00:00',
                insuranceEndTime: $('#endDateTime').val().trim() + ' 23:59:59',
                applyNum: $('#applyNum').text().trim(),
                partnerCode: productData.partnerCode,
                productCode: productData.productInfo.productCode,
                productId: productData.productInfo.productId,
                productName: productData.productInfo.productName,
                keyCode: urlParameters.keyCode,
                secondMediaSource: urlParameters.userId || urlParameters.secondMediaSource,
                remark: urlParameters.remark,
                planIds: planIds.join(',')
            };
            //优先取icpProductInfo的法律告知
            if (productData.icpProductInfo && productData.icpProductInfo.lawPolicy) {
                submit.lawPolicy = productData.icpProductInfo.lawPolicy;
            }
            submit = $.extend({}, planInfo, packageData, submit);
            window.tool.setSessionStorage('submit', submit);
        },

        //获取选中的套餐信息
        getSelectedPackage: function(packageCode, packageList) {
            var result = {};
            if (packageList.length > 1) {
                for (var i = 0; i < packageList.length; i++) {
                    if (packageList[i].packageCode === packageCode) {
                        result = {
                            packageCode: packageCode,
                            packageId: packageList[i].packageId,
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
            } else {
                result = {
                    packageCode: packageCode,
                    packageId: packageList[0].packageId,
                    packageName: packageList[0].packageName
                }
                if (planInfo.planSource !== 'N') {
                    result.insuredMaxAge = planInfo.insuredMaxAge;
                    result.insuredMiniAge = planInfo.insuredMiniAge;
                    result.packageAmount = planInfo.premium;
                    result.maxInsuredNumber = planInfo.maxInsuredNumber;
                    result.minInsuredNumber = planInfo.minInsuredNumber;
                } else {
                    result.insuredMaxAge = packageList[0].insuredMaxAge;
                    result.insuredMiniAge = packageList[0].insuredMiniAge;
                    result.packageAmount = packageList[0].packageAmount;
                    result.maxInsuredNumber = packageList[0].maxInsuredNumber;
                    result.minInsuredNumber = packageList[0].minInsuredNumber;
                }
            }
            return result;
        },

        //获取投保期限和保险期限
        getDatesFromPlanInfo: function(planInfo) {
            var today = new Date();
            var tomorrow = new Date(today.setDate(today.getDate() + 1));
            var leastBeginTime = planInfo.leastBeginTime;
            leastBeginTime = leastBeginTime ? (new Date(leastBeginTime)) : tomorrow;

            //保险期
            var maxInsuranceMonth = planInfo.maxInsuranceMonth; //最大保险期限(月)
            var maxInsuranceDay = planInfo.maxInsuranceDay; //最大保险期限(天)
            //起保期
            var maxUnderWriteMonth = planInfo.maxUnderWriteMonth; //最晚可投保日期(月)
            var maxUnderWriteDay = planInfo.maxUnderWriteDay; //最晚可投保日期(天)

            //日期非空判断(转化为number类型)
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

        //设置保险条款
        setIframe: function(src) {
            var parentDom = document.createElement('div');
            parentDom.className = 'iframe-container';
            var scrollTop = $(window).scrollTop();
            var iframe = document.createElement('iframe');
            iframe.src = src || '';
            parentDom.appendChild(iframe);
            $('.content').hide().after(parentDom);

            var headerTitle = $('.title').text(); //先保存之前的title
            $('.title').text('保险条款');

            window.history.pushState({
                title: '#insuranceClause'
            }, '#insuranceClause', window.location.href + '#insuranceClause');
            window.onpopstate = function(e) {
                $('.content').show();
                $('.iframe-container').remove();
                $(window).scrollTop(scrollTop);
                $('.title').text(headerTitle);
            };
        },

        //specifiedDate是否在指定的时间范围(日期入参格式：yyyy-mm-dd，yyyy/mm/dd)，title可选
        isDateInRange: function(specifiedDate, startDate, endDate, title) {
            specifiedDate = specifiedDate.trim();
            startDate = startDate.trim();
            endDate = endDate.trim();
            title = title || '日期';
            var spDate = new Date(specifiedDate);
            var stDate = new Date(startDate);
            var enDate = new Date(endDate);
            var result = {
                isDateInRange: true,
                msg: 'ok'
            };

            if (spDate < stDate) {
                result.isDateInRange = false;
                result.msg = title + '不能早于' + startDate;
            } else if (spDate > enDate) {
                result.isDateInRange = false;
                result.msg = title + '不能晚于' + endDate;
            }
            return result;
        },

        //固定保费时间设置
        setInsuranceTime: function() {
            $('#insuranceTime').text(dates.maxInsuranceMonth ? dates.maxInsuranceMonth + '月' : dates.maxInsuranceDay + '天'); //保险期限
            $('#endDateTime').val(dates.minEndDate + ' '); //默认的保险止期为最小止期

            $("#beginDateTime").val(dates.minStartDate + ' ').datetimePicker({ //初始化保险起期为最小起期
                title: "选择日期",
                yearSplit: "-",
                monthSplit: "-",
                datetimeSplit: " ",
                times: function() {
                    return [];
                },
                onChange: function(e) {
                    var endDateTime = window.tool.getFutureDate(new Date(e.value.join('-')), 0, dates.maxInsuranceMonth, dates.maxInsuranceDay - 1);
                    $('#endDateTime').val(endDateTime + ' '); //插件根据保险起期设置保险止期
                }
            });
        },

        //切换套餐
        changePackage: function(packageCode, packageList) {
            if (packageList.length > 1) {
                for (var i = 0; i < packageList.length; i++) {
                    if (packageList[i].packageCode === packageCode) {
                        var liabilityList = packageList[i].liabilityList || [];
                        if (planInfo.isDynamicAmount === '0') {
                            $('#packageAmount').text(packageList[i].packageAmount || '');
                        } else {
                            app.calculatePrice(packageList[i].packageId);
                        }
                        break;
                    }
                }
                app.setLiabilityInfo(liabilityList);
                //套餐联动
                var selector = '.package-tab-item.className' + packageCode + ',.package-item.className' + packageCode;
                $(selector).addClass('active').siblings().removeClass('active');
            } else {
                var liabilityList = packageList[0].liabilityList || [];
                if (planInfo.planSource !== 'N') {
                    $('#packageAmount').text(planInfo.premium);
                } else {
                    $('#packageAmount').text(packageList[0].packageAmount || '');
                }
                app.setLiabilityInfo(liabilityList);
            }
        },

        //切换产品
        changeProduct: function(planCode, planList) {
            var productOptionHtml = '';
            for (var i = 0; i < planList.length; i++) {
                if (planList[i].planCode === planCode) {
                    planInfo = planList[i]; //外部全局
                    var packageList = planInfo.packageList || [];
                };
                productOptionHtml += '<option value="' + planList[i].planCode + '">' + planList[i].planName + '</option> ';
                planIds.push(planList[i].planId);
            }

            var productSchemeHtml = planList.length < 2 ? '' : '<div class="product-scheme"><div class="form-group form-group-select"> <label> 产品方案：</label> <form><select class="form-control form-control-select" id="productScheme">' + productOptionHtml + '</select> </form> </div> </div>';

            var packageSchemeHtml = ''; //套餐列表
            var slideUpSchemeHtml = ''; //套餐列表(默认隐藏的，第一次点击立即投保显示)
            if (packageList && packageList.length > 1) {
                var packageListHtml = '';
                var slideUpListHtml = '';
                for (var i = 0; i < packageList.length; i++) {
                    if (i > 0) {
                        packageListHtml += '<li class="package-tab-item ' + 'className' + packageList[i].packageCode + '" data-packagecode="' + packageList[i].packageCode + '">' + packageList[i].packageName + '</li>';
                        slideUpListHtml += '<li class="package-item ' + 'className' + packageList[i].packageCode + '" data-packagecode="' + packageList[i].packageCode + '">' + packageList[i].packageName + '</li>';
                    } else { //默认为第一个套餐添加active类
                        packageListHtml += '<li class="package-tab-item active ' + 'className' + packageList[i].packageCode + '"  data-packagecode="' + packageList[i].packageCode + '">' + packageList[i].packageName + '</li>';
                        slideUpListHtml += '<li class="package-item active ' + 'className' + packageList[i].packageCode + '" data-packagecode="' + packageList[i].packageCode + '">' + packageList[i].packageName + '</li>';
                    }
                }
                packageSchemeHtml = '<div class="package-scheme"><ul class="package-tab">' + packageListHtml + '</ul></div>';
                slideUpSchemeHtml = '<li class="wrap-item wrap-item-package"> <label>保障方案</label> <div class="wrap-item-right"> <ul class="package-list">' + slideUpListHtml + '</ul> </div> </li>';
            }

            $('.product-scheme,.package-scheme').remove();
            $('.product').append(productSchemeHtml + packageSchemeHtml);
            $('#productScheme').val(planCode); //默认显示第一个产品；切换时，产品方案跟着变

            $('.wrap-item-package,.begin-date-time').remove();
            var beginDateTimeHtml = '<li class="wrap-item icon-active begin-date-time"> <label>保险起期</label> <div class="wrap-item-right"> <input class="date" id="beginDateTime" type="text"> <span class="time">00时</span> </div> </li>';
            $('.wrap').prepend(slideUpSchemeHtml + beginDateTimeHtml);

            //时间处理
            dates = app.getDatesFromPlanInfo(planInfo); //外部全局

            if (planInfo.isDynamicAmount === '0') {
                app.setInsuranceTime();
            } else {
                $('#endDateTime').closest('.wrap-item').addClass('icon-active');
                $('#endDateTime').removeAttr('readonly');
                app.setAutoInsuranceTime();
                app.calculatePrice(packageList[0].packageId);
            }

            app.changePackage(packageList[0].packageCode, packageList); //默认显示该产品的第一个套餐
        },

        //渲染与云产品相关的结构
        setClouldProduct: function(clouldProductInfo) {
            $('.title').text(clouldProductInfo.productName || '');

            var bannerHtml = '<section class="banner"> <img class="banner-img" src="' + '/icp/downloadFile.do?fileName=' + (clouldProductInfo.productImageTopUrl || '').split('=')[1] + '=0' + '"><p class="banner-desc">' + (productData.productDesc || '') + '</p> </section>';
            var productDescHtml = '<div class="product-desc"> <img src="' + '/icp/downloadFile.do?fileName=' + (clouldProductInfo.productImageIntroduceUrl || '').split('=')[1] + '=0' + '"></div>';
            var noticeHtml = '<section class="notice" id="notice"> <h2 class="wrap-title">投保须知</h2> <div class="wrap-body notice-detail"> <img src="' + '/icp/downloadFile.do?fileName=' + (clouldProductInfo.productImageNoticeUrl || '').split('=')[1] + '=0' + '"> </div> </section>';
            var claimHtml = '<section class="claim" id="claim"> <h2 class="wrap-title">理赔指南</h2> <div class="wrap-body claim-detail"> <img src="' + '/icp/downloadFile.do?fileName=' + (clouldProductInfo.productImageClaimUrl || '').split('=')[1] + '=0' + '"> </div> </section>';
            var questionHtml = '<section class="question" id="question"> <h2 class="wrap-title">常见问题</h2> <div class="wrap-body question-detail"> <img src="' + '/icp/downloadFile.do?fileName=' + (clouldProductInfo.productImageIproblemUrl || '').split('=')[1] + '=0' + '"> </div> </section>';

            $('.banner,.notice,.claim,.question').remove();
            $('.nav').before(bannerHtml);
            $('.product').empty().prepend(productDescHtml).after(noticeHtml + claimHtml + questionHtml);
            //获取偿付能力
            app.getSolvency();
        },

        binding: function() {
            $('.page')
                .on('click', '.nav-tab-item', function() { //导航tab
                    var $this = $(this);
                    var scrollTop = $('#' + $this.data('scroll-to')).offset().top - $('.nav').offset().height;

                    $this.addClass('active').siblings().removeClass('active');
                    $('html,body').scrollTop(scrollTop);
                })
                .on('click', '.item', function() { //保障内容
                    $(this).toggleClass('active');
                })
                .on('click', '.ui-mask', function() { //弹窗消退
                    $('body').removeClass('stop-scrolling');
                    $('.slide-up-wrap').removeClass('active');
                })
                .on('change', '#productScheme', function() { //产品方案
                    app.changeProduct($(this).val(), productData.productInfo.planList);
                    $(window).scrollTop(0);
                })
                .on('click', '.package-tab-item , .package-item', function() { //套餐方案
                    $(this).addClass('active').siblings().removeClass('active');
                    app.changePackage($(this).data('packagecode'), planInfo.packageList);
                })
                .on('click', '#moreDetail', function() { //查看保险条款
                    var planCode = $(this).data('plancode');
                    var src = window.location.origin + '/icp_core_dmz/web/' + planCode + '.html';
                    app.setIframe(src);
                })
                .on('click', '#buy', function() { //立即投保
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
                        window.location.href = 'applicant.html';
                    } else {
                        $('body').addClass('stop-scrolling');
                        slideUpWrapDom.addClass('active');
                    }
                });

            $(document).on('click', '.close-picker', function() { //时间选择插件完成按钮
                if (planInfo.isDynamicAmount === '0') {
                    //保险起期校验
                    var checkResultStart = app.isDateInRange($('#beginDateTime').val(), dates.minStartDate, dates.maxStartDate, '保险起期');
                    if (!checkResultStart.isDateInRange) {
                        window.wAlert(checkResultStart.msg);
                        return false;
                    }
                } else {
                    //保险起期校验
                    var checkResultStart = app.isDateInRange($('#beginDateTime').val(), dates.minStartDate, dates.maxStartDate, '保险起期');
                    if (!checkResultStart.isDateInRange) {
                        window.wAlert(checkResultStart.msg);
                        return false;
                    }
                    //保险止期校验
                    var checkResultEnd = app.isDateInRange($('#endDateTime').val(), dates.minEndDate, dates.maxEndDate, '保险止期');
                    if (!checkResultEnd.isDateInRange) {
                        window.wAlert(checkResultEnd.msg);
                        return false;
                    }
                    var selectedPackageId = app.getSelectedPackage($('.package-item.active').data('packagecode') || planInfo.packageList[0].packageCode, planInfo.packageList);
                    app.calculatePrice(selectedPackageId);
                }
            });

            $(window).on('scroll', function(e) {
                //nav固定定位
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
                var questionTop = $('#question').offset().top - navHeight;
                var itemDomList = navDom.find('.nav-tab-item');

                if (scrollTop >= questionTop || scrollTop === $(document).height() - $this.height()) {
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

        render: function() {
            if (!productData || !(productData.productInfo)) {
                window.wAlert('云产品数据有误');
                $('.page').remove();
                return false;
            }

            var clouldProductInfo = productData.productInfo;
            app.setClouldProduct(clouldProductInfo);

            var planList = clouldProductInfo.planList;
            if (!planList || planList.length < 0) {
                window.wAlert('产品数据有误');
                $('.page').remove();
                return false;
            }

            var planCode = $.trim(planList[0].planCode);
            if (!planCode) {
                window.wAlert('产品代码有误');
                $('.page').remove();
                return false;
            }

            app.changeProduct(planCode, planList);
        },

        init: function() {
            app.render();
            app.binding();
            $('.loading').hide();
        }
    };

    app && app.init();
});
