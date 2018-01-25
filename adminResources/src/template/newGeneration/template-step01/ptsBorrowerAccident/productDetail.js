$(function() {

    'use strict';

    var $err = $("#err");
    var productData = JSON.parse(window.sessionStorage.getItem('productData'));
    var maxInsuranceDay = productData.planInfoList[0].localProMap.maxInsuranceDay || 0;
    var maxInsuranceMonth = productData.planInfoList[0].localProMap.maxInsuranceMonth || 0;
    var maxUnderWriteDay = productData.planInfoList[0].localProMap.maxUnderWriteDay || 0;
    var maxUnderWriteMonth = productData.planInfoList[0].localProMap.maxUnderWriteMonth || 0;
    var submit = {};
    var amount = 0;
    var maxInsurance;
    var color = window.sessionStorage.getItem('color');
    var targetPlan = []; // 满足判断条件的套餐集合的下标
    var getPriceSuccess = false;

    //获取URL中所有的参数，返回一个key-value对象
    function getUrlParameters() {
        var urlParameters = {};
        decodeURIComponent(window.location.href).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
            urlParameters[key] = value;
        });
        return urlParameters;
    };


    // 如果一个云产品包含 >＝2 个产品，则需要现实选择框, 否则不显示
    if (productData.planInfoList.length >= 2) {
        $('#productBox').show();
    } else {
        $('#productBox').hide();
    }

    if (productData && productData.planInfoList) {
        var options = '';
        for (var i = 0, len = productData.planInfoList.length; i < len; i++) {
            options += '<option value=' + i + '>' + productData.planInfoList[i].localProMap.planName + '</option>';
        }
        $('#productList').empty().append(options);
    }

    // 当产品仅包含>=2个套餐，才显示套餐名称的tab
    if (productData && productData.planInfoList[0].packageList.length >= 2) {
        $('#tcUl').show();
        $('#plans').show();
        $('#product .product-ts').css('border-bottom', '1px solid #dcdcdc');
    } else {
        $('#tcUl').hide();
        $('#plans').hide();
        $('#product .product-ts').css('border-bottom', 'none');
    }

    $('#productBox select').on('change', function() {

        var selectedIndex = $(this).val();
        if (productData && productData.planInfoList[selectedIndex].packageList.length >= 2) {
            $('#tcUl').show();
            $('#plans').show();
            $('#product .product-ts').css('border-bottom', '1px solid #dcdcdc');
        } else {
            $('#tcUl').hide();
            $('#plans').hide();
            $('#product .product-ts').css('border-bottom', 'none');
        }
        ProductDetail.renderProductData(selectedIndex);
        ProductDetail.initEndDateTime();
        fillDateToPage();
        calculatePrice();
    });

    window.sessionStorage.setItem('productDetailUrl', window.location.href);

    function unique(array) {
        var n = [];
        for (var i = 0; i < array.length; i++) {
            if (n.indexOf(array[i]) == -1) {
                n.push(array[i]);
            }
        }
        return n;
    };

    $(document).on('click', '.close-picker', function(event) {


        var insuranceBeginTime = $('.ins-start-date').text().trim();
        var insuranceEndTime = $('.ins-end-date').text().trim();

        if (insuranceBeginTime > insuranceEndTime) {
            var nextBeginTime = ProductDetail.getNextDate(insuranceBeginTime, '1');
            $('.ins-end-date').text(nextBeginTime);
            //  $('#J-datePicker-end').val(nextBeginTime);
        }

        // var nextBeginTime = ProductDetail.getNextDate(insuranceBeginTime, '1');
        // var previousEndDate = ProductDetail.getNextDate(insuranceEndTime, '2');
        // console.log(nextBeginTime);
        // console.log(previousEndDate);  
        // checkDate();

        if (checkDate()) {
            calculatePrice();
        }

    });


    $(document).on('blur', '.money-input', function() {

        var $this = $(this);
        if ($this.val() > 1000000) {
            ErrWarn.errShow('保障金额不能超过100万元');
            $this.val('1');
        } else if ($this.val() < 1) {
            ErrWarn.errShow('保障金额不能低于1元');
            $this.val('1');
        } else {
            calculatePrice();
        }

    });

    function checkDate() {
        var insuranceBeginTime = $('.ins-start-date').text().trim();
        var insuranceEndTime = $('.ins-end-date').text().trim();
        var date = ProductDetail.getLimitDate();
        var stDate = new Date(insuranceBeginTime);
        var enDate = new Date(insuranceEndTime);
        //起期是否合法 
        if (!ProductDetail.isInsuranceTimeValid(date, 'start', '保险起期')) {
            $('#insuranceDay').text('0');
            return false;
        }
        //止期是否合法
        if (!ProductDetail.isInsuranceTimeValid(date, 'end', '保险止期')) {
            $('#insuranceDay').text('0');
            return false;
        }

        fillDateToPage();
        return true;
    }

    $('.icon-goback').on('click', function() {
        window.history.go(-1);
    });

    function getUrlParam(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return '';
    };


    function calculatePrice() {
        var selectedIndex = $('#productList').val() || 0; // 选择的产品下标
        var planCode; // 产品代码
        var planName;
        var mediaSource;
        var packageCode = $('.tc-a.active').data('packagecode') || productData.planInfoList[0].packageList[0].packageCode;
        if (productData) {
            mediaSource = productData.accountInfo.mediaSource;
            // 接口需要的productcode 即是这里的planCode
            planCode = productData.planInfoList[selectedIndex].localProMap.planCode;
            planName = productData.planInfoList[selectedIndex].localProMap.planName;
        }
        var insuranceBeginTime = $('.ins-start-date').text().trim() + ' 00:00:00';
        var insuranceEndTime = $('.ins-end-date').text().trim() + ' 23:59:59';

        console.log(insuranceBeginTime);
        console.log(insuranceEndTime);

        var $dutyItemList = $('.tc-detail-li');
        var dutyInfoList = [];

        var planInfoList = [];
        $dutyItemList.forEach(function(item, index) {
            planInfoList.push({
                    "dutyInfoList": [{
                        'dutyCode': $('.tc-detail-li').eq(index).data('code'),
                        'insuredAmount': $('.tc-detail-li').eq(index).find('.right .money-input').val().trim() || '0'
                    }],
                    "planCode": $('.tc-detail-li').eq(index).data('typecode')
                }

            )
        });

        var productInfoList = [{
            "typeCode": productData.planInfoList[0].localProMap.typeCode,
            "baseInfo": {
                "insuranceBeginDate": insuranceBeginTime,
                "insuranceEndDate": insuranceEndTime,
                "productCode": planCode
            },
            "extendInfo": {
                "isGoUmsDiscount": "Y"
            },
            "targetInfo": {
                "loadInstitution": productData.accountInfo.AGENT_CHINESE_NAME || '平安银行股份有限公司宁波分行',
                "loanContractNo": "DK002302323",
                "loanAmount": "500000000",
                "loanBeginDate": insuranceBeginTime,
                "loadnEndDate": insuranceEndTime
            },
            "riskGroupInfoList": [{
                "planInfoList": planInfoList,
                "applyNum": 1,
                "combinedProductCode": planCode
            }]
        }];

        var data = {
            "mediaSource": productData.ACCOUNT,
            "productInfoList": productInfoList
        };

        console.log(data);

        if (!checkDate()) {
            return fasle;
        } else {
            $('#amount').text('计算中...');

            var url = '/icp/mobile_single_insurance/ptsCalInsuranceAmount.do';
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'JSON',
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(res) {
                    typeof res === 'string' && (res = JSON.parse(res));
                    if (res.resultCode === '00') {
                        submit.amount = res.productList[0].totalActualPremium;
                        $('#amount').text(res.productList[0].totalActualPremium + '元');
                        getPriceSuccess = true;
                        var planInfoList = res.productList[0].planInfoList;
                        window.sessionStorage.setItem('planInfoList', JSON.stringify(planInfoList));
                    } else {
                        getPriceSuccess = false;
                        $('#amount').text('计算保费失败');
                        ErrWarn.errShow('计算保费失败, 请稍后重试');
                    }
                },
                error: function(res) {
                    getPriceSuccess = false;
                    ErrWarn.errShow('计算保费失败, 请稍后重试');
                    $('#amount').text('计算保费失败');
                }
            });
        }
    };

    function fillDateToPage() {
        var insuranceBeginTime = $('.ins-start-date').text().trim();
        var insuranceEndTime = $('.ins-end-date').text().trim();
        // 计算两个日期之间的天数
        var days = ProductDetail.getDays(insuranceBeginTime, insuranceEndTime);
        if (days === 365) {
            $('#insuranceDay').text('1年');
        } else {
            $('#insuranceDay').text(days + '天');
        }

    };

    //获取偿付能力数据
    function getSolvency() {
        var solvency = window.sessionStorage.getItem('solvency');
        if (solvency) {
            $('#insurance').append('<span class="solvency"><span>重要信息告知</span>' + solvency + '</span>');
            return;
        }

        $.ajax({
            url: '/icp/getSolvency.do',
            type: 'POST',
            dataType: 'json',
            success: function(res) {
                if (res && res.resultCode === '00' && res.solvency) {
                    window.sessionStorage.setItem('solvency', res.solvency);
                    $('#insurance').append('<span class="solvency"><span>重要信息告知</span>' + res.solvency + '</span>');
                }
            },
            error: function(res) {}
        });
    }

    var ProductDetail = {

        //责任信息结构
        liabilityStruc: function(data) {
            var coverage = '';
            coverage += '<input class= "money-icon money-input" type="number" pattern="[0-9]*" oninput="if(value.length>5)value=value.slice(0,7)" autocomplete="off" placeholder="不超过100万元" value=' + data.insuranceCoverage + ' data-amount=' + data.insuranceCoverage + '>';
            return '<li class="tc-detail-li" data-code=' + data.liabilityCode + ' data-name=' + data.liabilityName + ' data-typecode=' + data.insuranceTypeCode + '>' + '<p class="left">' + (data.liabilityName || '') + '</p>' + '<p class="right">' + '' + coverage + '' + '<img src="img/btn_arrow_black_right@2x.png" alt="" class="icon-img">' + '</p>' + '</li>' + '<li  class="tc-text" style="display:none;">' + '<p>' + (data.liabilityDesc || '暂无描述') + '</p>' + '</li>';
        },

        //保险起止日期是否有效
        isInsuranceTimeValid: function(dates, startOrEnd, toastTitle) {
            var insuranceBeginTime = $('.ins-start-date').text().trim();
            var insuranceEndTime = $('.ins-end-date').text().trim();

            if (startOrEnd === 'start') { //起期
                var result = ProductDetail.isDateInRange(insuranceBeginTime, dates.minStartDate, dates.maxStartDate, toastTitle);
            } else { //止期
                var dynamicEndDate = ProductDetail.getFutureDate(new Date(insuranceBeginTime), 0, dates.maxInsuranceMonth, dates.maxInsuranceDay - 1);
                var result = ProductDetail.isDateInRange(insuranceEndTime, insuranceBeginTime, dynamicEndDate, toastTitle);
            }

            if (!result.isDateInRange) {
                ErrWarn.errShow(result.msg);
                return false;
            }
            return true;
        },
        init: function() {
            ErrWarn.creat();
            this.scrollTop();
            this.maskClick();
            this.renderProductData();
            this.pay();
            this.clickFun();
            this.initStartDateTime();
            this.initEndDateTime();
            calculatePrice();
            fillDateToPage();
            //偿付能力
            getSolvency();
        },
        getFutureDate: function(startDate, afterYear, afterMonth, afterDay) {
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
        getLimitDate: function() {

            var selectedIndex = $('#productList').val() || 0;
            var today = new Date();
            var tomorrow = new Date(today.setDate(today.getDate() + 1));

            var leastBeginTime = productData.planInfoList[selectedIndex].localProMap.leastBeginTime;

            leastBeginTime = leastBeginTime ? (new Date(leastBeginTime)) : tomorrow;
            // var leastBeginTime = leastBeginTime ? (new Date(leastBeginTime)) : (new Date());

            //起保期
            var maxUnderWriteMonth = productData.planInfoList[selectedIndex].localProMap.maxUnderWriteMonth || 0;
            var maxUnderWriteDay = productData.planInfoList[selectedIndex].localProMap.maxUnderWriteDay || 0;

            //保险期
            var maxInsuranceMonth = productData.planInfoList[selectedIndex].localProMap.maxInsuranceMonth || 0;
            var maxInsuranceDay = productData.planInfoList[selectedIndex].localProMap.maxInsuranceDay || 0;
            //日期非空判断
            maxInsuranceMonth = maxInsuranceMonth ? maxInsuranceMonth - 0 : 0;
            maxInsuranceDay = maxInsuranceDay ? maxInsuranceDay - 0 : 0;
            maxUnderWriteMonth = maxUnderWriteMonth ? maxUnderWriteMonth - 0 : 0;
            maxUnderWriteDay = maxUnderWriteDay ? maxUnderWriteDay - 0 : 0;

            //最小起期和最小止期
            var minStartDate = ProductDetail.getFutureDate(leastBeginTime, 0, 0, 0);
            var minEndDate = ProductDetail.getFutureDate(new Date(minStartDate), 0, maxInsuranceMonth, maxInsuranceDay - 1);

            //最大起期和最大止期
            var maxStartDate = ProductDetail.getFutureDate(new Date(), 0, maxUnderWriteMonth, maxUnderWriteDay);
            var maxEndDate = ProductDetail.getFutureDate(new Date(maxStartDate), 0, maxInsuranceMonth, maxInsuranceDay - 1);

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
        renderProductData: function(index) {
            var dataIndex = index || 0;
            var tchtml = '';
            var tcBtn = '';
            var length = productData.planInfoList[dataIndex].packageList.length;
            var localProMap = productData.planInfoList[dataIndex].localProMap;
            var packageList = productData.planInfoList[dataIndex].packageList;
            var width = 100 / length + '%';
            $('header .title').text(localProMap.productName);
            for (var i = 0; i < length; i++) {
                tchtml += '<li class="three" style="width:' + width + '"><a class="tc-a" data-i=' + i + ' data-packageCode=' + packageList[i].packageCode + '>' + packageList[i].packageName + '</a></li>'
                tcBtn += '<button data-i=' + i + ' class="info-btn" data-packageCode=' + packageList[i].packageCode + '>' + packageList[i].packageName + '</button>';
            };
            $("#tcUl").empty().html(tchtml);
            $("#choosePlan").empty().html(tcBtn);
            $("#show-des").text(productData.icpProductInfo.productDesc || '');
            $("#more").attr('data-code', localProMap.planCode);

            $("#productDes img").attr('src', '/icp/downloadFile.do?fileName=' + (localProMap.productImageIntroduceUrl.split('='))[1] + '=0');
            $("#bgImg").attr('src', '/icp/downloadFile.do?fileName=' + (localProMap.productImageTopUrl.split('='))[1] + '=0');
            $("#insurance img").attr('src', '/icp/downloadFile.do?fileName=' + (localProMap.productImageNoticeUrl.split('='))[1] + '=0');
            $("#claim img").attr('src', '/icp/downloadFile.do?fileName=' + (localProMap.productImageClaimUrl.split('='))[1] + '=0');
            $("#quesion img").attr('src', '/icp/downloadFile.do?fileName=' + (localProMap.productImageIproblemUrl.split('='))[1] + '=0');

            submit.productCode = productData.PRODUCTCODE;
            submit.planCode = localProMap.planCode;
            submit.planName = localProMap.planName || '';
            $('#tcUl').find('li .tc-a').eq(0).addClass('active').css('background', color);

            $('.info-right button').eq(0).addClass('btn-active');

            submit.packageCode = $('#tcUl').find('.tc-a').eq(0).attr("data-packagecode");
            $(".loading").hide();

            ProductDetail.dutyList(dataIndex, 0);

            if ($("header").css("background-color") !== 'rgb(255, 255, 255)') {
                $("#goBackImg").hide();
                $("#goBack").show();
                $("#tkBackImg").hide();
                $("#tkBack").show();
                $(".title").css('color', '#fff');
            } else {
                $(".title").css('color', '#000');
            }

        },
        // 产品序号， 套餐序号
        dutyList: function(productIndex, planIndex) {
            var packageList = productData.planInfoList[productIndex].packageList;
            var liabilityList = packageList[planIndex].liabilityList,
                amount = packageList[planIndex].packageAmount; // 套餐价格

            //兼容共享保额
            var resultObj = {};
            for (var i = 0; i < liabilityList.length; i++) {
                if (!liabilityList[i].insuranceTypeMergeFlag) {
                    resultObj[i + 'notShare'] = {
                        liabilityName: liabilityList[i].liabilityName || '',
                        liabilityDesc: liabilityList[i].liabilityDesc || '',
                        insuranceCoverage: liabilityList[i].insuranceCoverage || '1000000',
                        liabilityCode: liabilityList[i].liabilityCode || '',
                        insuranceTypeCode: liabilityList[i].insuranceTypeCode || ''
                    };
                } else if (resultObj['share' + (liabilityList[i].insuranceTypeMergeFlag)]) {
                    resultObj['share' + (liabilityList[i].insuranceTypeMergeFlag)].liabilityName += '、' + (liabilityList[i].liabilityName || '');
                    resultObj['share' + (liabilityList[i].insuranceTypeMergeFlag)].liabilityDesc += liabilityList[i].liabilityDesc ? ('、' + liabilityList[i].liabilityDesc) : '';
                } else {
                    resultObj['share' + liabilityList[i].insuranceTypeMergeFlag] = {
                        liabilityName: liabilityList[i].liabilityName || '',
                        liabilityDesc: liabilityList[i].liabilityDesc || '',
                        insuranceCoverage: liabilityList[i].insuranceCoverage || '1000000',
                        liabilityCode: liabilityList[i].liabilityCode || '',
                        insuranceTypeCode: liabilityList[i].insuranceTypeCode || ''
                    };
                }
            }
            var liabilityStr = '';
            if (!$.isEmptyObject(resultObj)) {
                for (var key in resultObj) {
                    liabilityStr += ProductDetail.liabilityStruc(resultObj[key]);
                }
            }

            $("#tcDetailText").html(liabilityStr);

            $('.tc-text').forEach(function(item, index) {
                if ($('.tc-text').eq(index).find('p').text().trim() === '') {
                    $('.tc-text').eq(index).prev().find('.right img').css('display', 'none');
                }
            });

        },
        initStartDateTime: function() {
            var _that = this;
            var date = new Date();
            var today = date.getFullYear() + '-' + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate());
            today = _that.getNextDate(today, '1');
            $("#J-datePicker-start").val(today);
            $(".ins-start-date").text(today);

            var endDate = this.getFutureDate(new Date(today.replace(/-/g, "-")).getTime(), 0, maxUnderWriteMonth, maxUnderWriteDay);
            endDate = _that.getNextDate(endDate, '2');

            $("#J-datePicker-start").datetimePicker({
                title: "选择日期",
                min: today,
                max: '2100-01-01',
                yearSplit: "-",
                monthSplit: "-",
                datetimeSplit: " ",
                times: function() {
                    return []
                },
                onChange: function(i, h, j) {
                    setTimeout(function() {
                        var chooseD = $("#J-datePicker-start").val();
                        $(".ins-start-date").text(chooseD);
                    }, 50);
                }
            })
        },
        initEndDateTime: function() {
            var selectedIndex = $('#productList').val();
            var leastBeginTime = leastBeginTime ? (new Date(leastBeginTime)) : (new Date());
            //起保期
            var maxUnderWriteMonth = productData.planInfoList[selectedIndex].localProMap.maxUnderWriteMonth || 0;
            var maxUnderWriteDay = productData.planInfoList[selectedIndex].localProMap.maxUnderWriteDay || 0;

            //最小起期和最小止期
            // var minStartDate = ProductDetail.getFutureDate(leastBeginTime, 0, 0, 1);
            // var minEndDate = ProductDetail.getFutureDate(new Date(minStartDate), 0, maxInsuranceMonth, maxInsuranceDay - 1);

            var minStartDate = ProductDetail.getFutureDate(leastBeginTime, 0, 0, 1);
            var minEndDate = ProductDetail.getFutureDate(new Date(minStartDate), 0, 0, 365 - 1);
            // 业务需求： 页面不管后台配置多少， 页面第一次默认显示1年；

            var _that = this;
            var date = new Date();
            var today = date.getFullYear() + '-' + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate());
            today = _that.getNextDate(today, '1');

            $("#J-datePicker-end").val(minEndDate); // 这里需要填充默认的最大保险止期
            $(".ins-end-date").text(minEndDate);
            $('#insuranceDay').text('1年');
            var endDate = this.getFutureDate(new Date(today.replace(/-/g, "-")).getTime(), 0, maxUnderWriteMonth, maxUnderWriteDay);
            endDate = _that.getNextDate(endDate, '2');

            $("#J-datePicker-end").datetimePicker({
                title: "选择日期",
                min: today,
                max: '2100-01-01',
                yearSplit: "-",
                monthSplit: "-",
                datetimeSplit: " ",
                times: function() {
                    return []
                },
                onChange: function(i, h, j) {
                    setTimeout(function() {
                        var chooseD = $("#J-datePicker-end").val();
                        $(".ins-end-date").text(chooseD);
                    }, 50);
                }
            })
        },
        isDateInRange: function(specifiedDate, startDate, endDate, title) {
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
                result.msg = title + '不能低于 ' + startDate;
            } else if (spDate > enDate) {
                result.isDateInRange = false;
                result.msg = title + '不能超过 ' + endDate;
            }
            return result;
        },
        getNextDate: function(date, id) {
            if (id == '1') {
                var nextDate = new Date(new Date(date.replace(/-/g, '/')).getTime() + 1 * 24 * 60 * 60 * 1000);
            } else {
                var nextDate = new Date(new Date(date.replace(/-/g, '/')).getTime() - 1 * 24 * 60 * 60 * 1000);
            };
            var month = nextDate.getMonth() + 1 < 10 ? '0' + (nextDate.getMonth() + 1) : nextDate.getMonth() + 1;
            var date = nextDate.getDate() < 10 ? '0' + nextDate.getDate() : nextDate.getDate();
            var returnDate = nextDate.getFullYear() + '-' + month + '-' + date;
            return returnDate;
        },
        endDate: function(chooseD, d) {
            var sec = this.dataNum(d);
            var endDateSec = (new Date(chooseD.replace(/-/g, '/'))).getTime() + sec;
            endDateSec = new Date(endDateSec);
            var endDate = endDateSec.getFullYear() + '-' + ((endDateSec.getMonth() + 1) >= 10 ? (endDateSec.getMonth() + 1) : '0' + (endDateSec.getMonth() + 1)) + '-' + (endDateSec.getDate() >= 10 ? endDateSec.getDate() : '0' + endDateSec.getDate());
            return endDate;
        },

        getDays: function(sDate1, sDate2) {
            // @para：2000-01-01
            var t1 = new Date(sDate1.replace(/-/g, "/"));
            var t2 = new Date(sDate2.replace(/-/g, "/"));
            var days = parseInt((t2.getTime() - t1.getTime()) / (1000 * 60 * 60 * 24) + 1, 10);
            return days;
        },
        getHeight: function() {
            var height = 0;
            // height = parseInt($(".show-picture").css('height'))+parseInt($("#tab1").css('height'))+parseInt($("#product").css('height'));
            height = parseInt($("#product").css('height'));
            return height;
        },
        scrollTop: function() {
            window.onscroll = function() {
                var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                var jsH = parseInt($(".show-picture").css('height'));
                var tab1Top = $('#tab1').offset().top;
                var productDescTop = $('#productDes').offset().top;
                var insuranceTop = $('#insurance').offset().top;
                var claimTop = $('#claim').offset().top;
                var halfWindowHeight = $(window).height() / 4;
                if (scrollTop >= tab1Top) {
                    $("#tab").addClass('tab');
                    $("#tab").show();
                } else {
                    $("#tab").hide();
                    $("#tab").removeClass('tab');
                };
                $('.a').removeClass('a-active');
                if (scrollTop <= productDescTop + halfWindowHeight) {
                    // 产品介绍
                    $("#js").addClass('a-active');
                    $("#js-fixed").addClass('a-active');
                } else if (productDescTop <= scrollTop && scrollTop <= insuranceTop) {
                    // 投保须知
                    $("#tx").addClass('a-active');
                    $("#tx-fixed").addClass('a-active');
                } else if (insuranceTop <= scrollTop && scrollTop <= claimTop) {
                    // 理赔指南
                    $("#lz").addClass('a-active');
                    $("#lz-fixed").addClass('a-active');
                } else {
                    // 常见问题
                    $("#cj").addClass('a-active');
                    $("#cj-fixed").addClass('a-active');
                };
            };
        },
        pay: function() {
            var _that = this;
            $("#pay").on('click', function() {
                var char = $("#amount").text().slice(0, 1);
                var numReg = /^\d$/;
                if ($("#mask").css('display') == 'none') {
                    $(".info").css("bottom", "-500px");
                    $("#mask").show();
                    _that.animateFun('1');
                } else {

                    if (!checkDate()) {
                        return false;
                    }

                    if (!getPriceSuccess) {
                        ErrWarn.errShow('计算保费失败, 请稍后重试');
                        return false;
                    }

                    if (!numReg.test(char)) {
                        return false;
                    }

                    if ($('input[name="applyForVisa"]:checked').val() === 'Y') {
                        submit.showPaper = true;
                    } else {
                        submit.showPaper = false;
                    }

                    if ($('#tcUl').css('display') === '-webkit-box' && $('.info-btn.btn-active').length === 0) {
                        ErrWarn.errShow('请选择套餐');
                        return false;
                    }
                    var insuredLimitedSex;
                    if (productData.planInfoList.length === 1 && productData.planInfoList[0].packageList.length === 1) {
                        submit.insuredMiniAge = productData.planInfoList[0].packageList[0].insuredMiniAge;
                        submit.insuredMaxAge = productData.planInfoList[0].packageList[0].insuredMaxAge;
                        submit.lawPolicy = productData.planInfoList[0].localProMap.lawPolicy;

                        //insuredLimitedSex优先取套餐里的  2017-07-21
                        insuredLimitedSex = productData.planInfoList[0].packageList[0].insuredLimitedSex;
                        submit.insuredLimitedSex = insuredLimitedSex || productData.planInfoList[0].localProMap.insuredLimitedSex;


                    } else {
                        var planIndex = $('#productList').val() || 0; // 产品的下标
                        var packageIndex; // 此产品下，选中的套餐的下标

                        if (productData && productData.planInfoList[planIndex].packageList.length >= 2) {
                            packageIndex = $('.info-btn').index('.info-btn.btn-active');
                        } else {
                            packageIndex = 0;
                        }

                        submit.insuredMiniAge = productData.planInfoList[planIndex].packageList[packageIndex].insuredMiniAge;
                        submit.insuredMaxAge = productData.planInfoList[planIndex].packageList[packageIndex].insuredMaxAge;
                        submit.lawPolicy = productData.planInfoList[planIndex].localProMap.lawPolicy;

                        //insuredLimitedSex优先取套餐里的  2017-07-21
                        insuredLimitedSex = productData.planInfoList[planIndex].packageList[packageIndex].insuredLimitedSex;
                        submit.insuredLimitedSex = insuredLimitedSex || productData.planInfoList[planIndex].localProMap.insuredLimitedSex;
                    }

                    //优先取icpProductInfo的法律告知  2017-07-21
                    if (productData.icpProductInfo && productData.icpProductInfo.lawPolicy) {
                        submit.lawPolicy = productData.icpProductInfo.lawPolicy;
                    }

                    submit.packageCode = $('.tc-a.active').data('packagecode');
                    submit.insuranceBeginTime = $.trim($("#J-datePicker-start").val());
                    submit.insuranceEndTime = $.trim($("#J-datePicker-end").val());
                    submit.amount = $("#amount").text().slice(0, $("#amount").text().length - 1);
                    submit.applyNum = '1';
                    submit.loanAmount = $('.money-input').eq(0).val();
                    submit.secondMediaSource = getUrlParameters().secondMediaSource || getUrlParameters().userId;
                    submit.remark = getUrlParameters().remark || '';
                    window.sessionStorage.setItem('submit', JSON.stringify(submit));
                    window.sessionStorage.removeItem('applicantInfo');
                    //埋点统计
                    window.tool.buyBtnTJ && window.tool.buyBtnTJ();
                    window.location.href = 'applicant.html';
                }
            });
        },
        animateFun: function(num) {
            var bottom = parseInt($(".info").css('bottom')),
                time = null;
            if (num == '1') {
                time = setInterval(function() {
                    bottom += 50;
                    $(".info").css('bottom', bottom + 'px');
                    if (bottom == '50') {
                        clearInterval(time);
                    };
                }, 10);
            } else {
                time = setInterval(function() {
                    bottom -= 50;
                    $(".info").css('bottom', bottom + 'px');
                    if (bottom == '-500') {
                        var amount = $("#amount").text().slice(0, $("#amount").text().length - 1);
                        if (typeof amount === "number") {
                            $("#amount").text(amount + '元');
                        } else {
                            $("#amount").text('计算保费失败');
                        }

                        $("#inputNum").val("1");
                        $("#mask").hide();
                        clearInterval(time);
                    };
                }, 10);
            };
            $(".info").show();
        },
        changeActive: function(code) {
            $('.tc-a').removeClass('active').css('background', '#fff');
            $('.info-right button').removeClass('btn-active');
            $('.tc-a').eq(code).addClass('active').css('background', color);
            $('.info-right button').eq(code).addClass('btn-active').css('background', color);
        },
        clickFun: function() {

            var _that = this;
            var title_height = 40;

            $("body").on('click', '.a', function() {
                $('.a').removeClass('a-active');
                var $this = $(this);
                var ids = $this.attr('data-id');
                $this.addClass('a-active');
                if (ids === '01') { // 产品介绍
                    document.body.scrollTop = $('#productDes').offset().top - title_height
                } else if (ids === '02') { //  投保须知
                    document.body.scrollTop = $('#insurance').offset().top - title_height
                } else if (ids === '03') { // 理赔指南
                    document.body.scrollTop = $('#claim').offset().top - title_height
                } else { // 常见问题
                    document.body.scrollTop = $('#quesion').offset().top - title_height
                }
            });
            // 保障方案
            $("body").on('click', '.info-right button', function() {

                var $this = $(this);
                var i = $this.attr('data-i');

                if ($this.hasClass('btn-active')) {
                    // do nothing
                } else {
                    $('.info-right button').removeClass('btn-active');
                    $this.addClass('btn-active').css('background', color);
                    submit.packageCode = $this.attr('data-packageCode');
                    ProductDetail.dutyList($('#productBox select').val(), i);
                    ProductDetail.changeActive(i);
                    calculatePrice();
                }
            });

            // 套餐
            $("body").on('click', '.tc-a', function() {

                var $this = $(this);
                var i = $this.attr('data-i');

                if ($this.hasClass('active')) {
                    // do nothing
                } else {

                    $('.tc-a').removeClass('active');
                    $this.addClass('active').css('background', color);
                    ProductDetail.dutyList($('#productBox select').val(), i);
                    ProductDetail.changeActive(i);

                    calculatePrice();
                }
            });

            $("body").on('click', '.right img', function() {
                var $this = $(this);
                var describeText = $this.parent().parent().next('.tc-text');
                if (describeText.css('display') == 'none') {
                    describeText.show();
                    $this.css('transform', 'rotate(90deg)');
                } else {
                    describeText.hide();
                    $this.css('transform', 'rotate(0deg)');
                }
            });
            $("#more").on('click', function() {
                $("#body").scrollTop(0);
                var code = $("#more").attr('data-code')
                _that.announcement(1, code);
            });
        },
        maskClick: function() {
            var _that = this;
            $('body').on('click', '.mask', function() {
                _that.animateFun('2');
            });
            $('body').on('click', '#cancel', function() {
                _that.animateFun('2');
            });
        },
        announcement: function(id, code) {
            var g, d, h, i, j, f, k, planCode, protocal;
            switch (id) {
                case 1:
                    g = "保险条款";
                    d = "";
                    h = "#sytk";
                    j = document.createElement("iframe");
                    planCode = code;
                    protocal = window.location.href.indexOf('https') === 0 ? 'https' : 'http';
                    k = protocal + '://' + window.location.host + '/icp_core_dmz/web/' + planCode + '.html';
                    j.setAttribute("id", "miuisProvision");
                    $("#hideInsuranceClause").append(j);
                    $("#miuisProvision").attr("src", k);
                    break;
            }
            $("#title").html(g);
            $("#hideContent").html(d);
            $(".contaitent").hide();
            $(".footer").hide();
            $("#hideInsuranceClause").show();
            window.history.pushState({
                title: h
            }, h, window.location.href + h);
            window.onpopstate = function(e) {
                $("#miuisProvision").remove();
                $("#hideInsuranceClause").hide();
                $(".contaitent").show();
                $(".footer").show();
            };
        }
    };
    ProductDetail.init();
})
