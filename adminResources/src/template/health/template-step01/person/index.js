// 产品信息页面

//接口数据：productData
//业务数据：submit
//开发测试时请带参数访问：productDetail.html?keyCode=123
//跟通用模板区别：样式一样
//动态报价source：ashInsuranceForGroup2
//使用于模板：境内旅游、个人报价

(function() {

    //常用功能函数集
    var tool = {

        //获取未来日期字符串yyyy-mm-dd，getFutureDate([Date,]number,number,number)
        getFutureDate: function(startDate, afterYear, afterMonth, afterDay) {
            var futureDate, year, month, day;

            if (arguments.length === 3) {
                afterDay = arguments[2];
                afterMonth = arguments[1];
                afterYear = arguments[0];
                startDate = new Date();
            }

            if (arguments.length === 4 && Object.prototype.toString.call(startDate) !== "[object Date]") {
                startDate = new Date();
            }

            //计算年
            futureDate = startDate.setFullYear(startDate.getFullYear() + afterYear);
            futureDate = new Date(futureDate);
            // 计算月
            futureDate = futureDate.setMonth(futureDate.getMonth() + afterMonth);
            futureDate = new Date(futureDate);
            // 计算日
            futureDate = futureDate.setDate(futureDate.getDate() + afterDay);
            futureDate = (new Date(futureDate));

            year = futureDate.getFullYear();

            month = futureDate.getMonth() + 1;
            month = month < 10 ? '0' + month : month;

            day = futureDate.getDate();
            day = day < 10 ? '0' + day : day;

            futureDate = [year, month, day].join('-');

            return futureDate
        },
        //读session
        getSessionStorage: function(name) {
            return JSON.parse(window.sessionStorage.getItem(name));
        },
        //写session
        setSessionStorage: function(name, value) {
            window.sessionStorage.setItem(name, JSON.stringify(value));
        },
        //提示信息
        showMsg: function(text) {
            var html = '<div class="ui-toast">' + text + '</div>',
                $uiToast = $('.ui-toast');

            if ($uiToast.length > 0) {
                $uiToast.text(text);
            } else {
                $('footer').append(html);
            }

        },
        //specifiedDate是否在指定的时间范围(日期入参格式：yyyy-mm-dd，yyyy/mm/dd)
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
        //日期插件
        datetimePicker: function(options) {
            var settings = $.extend({
                selector: '',
                input: '2017-01-01',
                title: '选择日期',
                min: '1900-01-01',
                max: '2100-01-01',
                onChange: function() {}
            }, options);

            $(settings.selector).val(settings.input).datetimePicker({
                title: settings.title, //modal标题
                min: settings.min, // YYYY-MM-DD 最大最小值只比较年月日，不比较时分秒
                max: settings.max, // YYYY-MM-DD
                yearSplit: '-', //年和月之间的分隔符
                monthSplit: '-', //月和日之间的分隔符
                datetimeSplit: ' ', // 日期和时间之间的分隔符，不可为空
                times: function() { //不显示时间
                    return []
                },
                onChange: settings.onChange
            }); //end 日期插件
        }
    };

    var pageCrl = {

        //渲染函数
        render: function(productData) {
            var planInfoList = productData.planInfoList; //套餐列表

            //多个套餐，加选择方案
            var planSelectHtml = '';
            if (planInfoList.length > 1) {
                planSelectHtml =
                    '<div class="date-row date-row-icon plan-to-select">' +
                    '<label>选择方案</label>' +
                    '<p>' +
                    '<select name="plan" class="plan">';

                for (var i = 0; i < planInfoList.length; i++) {
                    planSelectHtml += '<option value="' + planInfoList[i].localProMap.planCode + '">' + planInfoList[i].localProMap.planName + '</option>';
                }

                planSelectHtml += '</select></p></div>';
            }

            //循环险种和价格、保费
            var html = '';
            for (var i = 0; i < planInfoList.length; i++) {
                var planList = planInfoList[i].remoteProMap.planList;
                var localProMap = planInfoList[i].localProMap;

                //表头html00
                var html00 = '<section class="insurance-section  plan' + localProMap.planCode + '"  data-plancode="' + localProMap.planCode + '">';

                //保障范围html01
                var html01 = '';
                if (planList && planList.length > 0) {
                    html01 = [
                        '<h2>',
                        '<span class="fn-left">保障范围</span>',
                        '<span class="fn-right ">保险金额</span>',
                        '</h2>'
                    ].join('');
                }

                //责任列表html02
                var html02 = '';
                if (planList && planList.length > 0) {
                    for (var j = 0; j < planList.length; j++) {
                        //begin 责任
                        var dutyList = planList[j].dutyList;
                        if (dutyList && dutyList.length > 0) {
                            for (var k = 0; k < dutyList.length; k++) {
                                var tempHtml = [
                                    '<li>',
                                    '<span class="fn-left">',
                                    dutyList[k].dutyChineseName,
                                    '</span>',
                                    '<span>',
                                    dutyList[k].dutyAmount,
                                    '</span>',
                                    '<span>',
                                    '元',
                                    '</span>',
                                    '</li>'
                                ].join('');
                                html02 += tempHtml;
                            }
                        }
                        // end 责任
                    }
                }
                html02 = '<ul>' + html02 + '</ul>';

                //标准保费html03
                var html03 = [
                    '<div class="standard-fee">',
                    '<span class="standard-fee-title">标准保费</span>',
                    '<span class="standard-fee-digit">',
                    localProMap.amount,
                    '</span>',
                    '<span class="standard-fee-text">元</span>',
                    '</div> ',
                    '</section> '
                ].join('');

                html += html00 + html01 + html02 + html03;
            } //end 最外层循环

            //插入页面
            $('.date-section').prepend(planSelectHtml).after(html);
            $('header .title').text(productData.planInfoList[0].localProMap.planName); //默认第一个套餐
            $('.insurance-section').eq(0).addClass('selected'); //默认第一个套餐
        },

        //保险起期
        initbeginDate: function(productData, planCode, hasRecoveryData) { //hasRecoveryData 用了判断是否是缓存数据
            var planInfo = pageCrl.getPlanInfo(productData, planCode); //当前套餐
            var dates = pageCrl.getDatesFromPlanInfo(planInfo); //当前套餐相关的日期字段集合

            //切换套餐时，删除DOM销毁日期实例，再重新实例化
            $('#J-datePicker').remove();
            $('.date-to-select p').append('<input class="datePicker" type="text" id="J-datePicker">');
            hasRecoveryData && (dates.minStartDate = hasRecoveryData);
            $('.ins-start-date').text(dates.minStartDate); //显示起期

            var options = { //实例化参数
                selector: '#J-datePicker',
                input: dates.minStartDate, //日期初始值
                title: '保险起期',
                min: dates.minStartDate,
                // max: dates.maxStartDate,
                onChange: function(picker) {
                    var dateString = $.map($(picker.container).find('.picker-selected'), function(item, index) {
                        return $(item).text().trim();
                    }).join('-'); //选择的日期

                    $('.ins-start-date').text(dateString);
                    if (planInfo.localProMap.isDynamicAmount == 0) { //非动态报价，才操作止期
                        var currentEndDate = tool.getFutureDate(new Date(dateString), 0, dates.maxInsuranceMonth, dates.maxInsuranceDay - 1);
                        $('.ins-end-date').text(currentEndDate);
                    }
                }
            };
            tool.datetimePicker(options); //实例化起期

        },

        //保险止期
        initEndDate: function(productData, planCode, hasRecoveryData) { //hasRecoveryData 用了判断是否是缓存数据
            var dom = $('.dynamic-date-select');
            var planInfo = pageCrl.getPlanInfo(productData, planCode);
            var dates = pageCrl.getDatesFromPlanInfo(planInfo);

            $('#J-datePicker-dynamic').remove(); //切换套餐时先删除，之后再判断是否加入，即使都是动态报价，但也需要重新初始化插件
            dom.removeClass('active'); //切换套餐时，先回到初始状态
            hasRecoveryData && (dates.minEndDate = hasRecoveryData);
            $('.ins-end-date').text(dates.minEndDate); //显示止期

            if (planInfo.localProMap.isDynamicAmount == 1) { //动态报价

                dom.addClass('active'); //动态报价时的样式
                dom.find('p').append('<input class="datePicker" type="text" id="J-datePicker-dynamic">');

                var options = { //实例化参数
                    selector: '#J-datePicker-dynamic',
                    input: dates.minEndDate, //日期初始值
                    title: '保险止期',
                    onChange: function(picker) {
                        var dateString = $.map($(picker.container).find('.picker-selected'), function(item, index) {
                            return $(item).text().trim();
                        }).join('-'); //选择的日期
                        $('.ins-end-date').text(dateString);
                    }
                };
                tool.datetimePicker(options); //实例化起期
            } //end 动态报价
        },

        //恢复页面数据
        recoveryData: function(productData, submit) {
            var planCode = submit.planCode;

            //恢复标题
            $('header .title').text(submit.planName);

            //恢复套餐
            $('.plan').val(planCode);

            //恢复日期
            $('.ins-start-date').text(submit.insuranceBeginTime);
            $('.ins-end-date').text(submit.insuranceEndTime);
            pageCrl.initbeginDate(productData, planCode, submit.insuranceBeginTime);
            pageCrl.initEndDate(productData, planCode, submit.insuranceEndTime);

            //恢复责任列表
            var className = '.plan' + submit.planCode;
            $('.insurance-section').removeClass('selected');
            $(className).addClass('selected');

            //恢复价格
            $('.insurance-section.selected').find('.standard-fee-digit').text(submit.amount);
        },

        //保险起止日期是否有效
        isInsuranceTimeValid: function(planInfo, startOrEnd, toastTitle) {
            var insuranceBeginTime = $('.ins-start-date').text().trim();
            var insuranceEndTime = $('.ins-end-date').text().trim();
            var dates = pageCrl.getDatesFromPlanInfo(planInfo);

            if (startOrEnd === 'start') { //起期
                var result = tool.isDateInRange(insuranceBeginTime, dates.minStartDate, dates.maxStartDate, toastTitle);
            } else { //止期
                var dynamicEndDate = tool.getFutureDate(new Date(insuranceBeginTime), 0, dates.maxInsuranceMonth, dates.maxInsuranceDay - 1);
                var result = tool.isDateInRange(insuranceEndTime, insuranceBeginTime, dynamicEndDate, toastTitle);
            }

            if (!result.isDateInRange) {
                window.wAlert(result.msg);
                return false
            }
            return true
        },
        //用套餐码获取套餐对象信息，返回一个planInfoList数组中的对象元素
        getPlanInfo: function(productData, planCode) {
            var planInfoList = productData.planInfoList;
            var planInfo = {};

            for (var i = planInfoList.length - 1; i >= 0; i--) {
                if (planInfoList[i].localProMap.planCode === planCode + '') {
                    planInfo = planInfoList[i];
                    break;
                }
            }
            return planInfo
        },

        //获取承保期限和保险期限,返回对象
        getDatesFromPlanInfo: function(planInfo) {
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

        //页面初始化函数
        init: function() {

                //begin 渲染
                var productData = tool.getSessionStorage('productData');
                var submit = tool.getSessionStorage('submit');
                pageCrl.render(productData); //渲染页面

                if (!submit) { //初次进入页面
                    var planCode = $('.insurance-section.selected').data('plancode'); //当前套餐码
                    pageCrl.initbeginDate(productData, planCode); //初始化保险起期
                    pageCrl.initEndDate(productData, planCode); //初始化保险止期
                } else {
                    pageCrl.recoveryData(productData, submit);
                }

                $('.loading').hide(); //完成页面渲染
                //end 渲染

                //begin event 选择套餐
                var planDom = $('.plan');
                if (planDom.length > 0) {
                    planDom.on('change', function() {

                        //切换责任列表
                        var planCode = $(this).val();
                        var className = '.plan' + planCode;
                        $('.insurance-section').removeClass('selected');
                        $(className).addClass('selected');

                        //切换标题
                        var productData = tool.getSessionStorage('productData');
                        var planInfo = pageCrl.getPlanInfo(productData, planCode);
                        $('header .title').text(planInfo.localProMap.planName);

                        //切换价格
                        $('.insurance-section.selected').find('.standard-fee-digit').text(planInfo.localProMap.amount);

                        //重新初始化日期插件
                        pageCrl.initbeginDate(productData, planCode);
                        pageCrl.initEndDate(productData, planCode);

                        //切换套餐时，清除提示信息
                        $('.ui-toast').remove();
                    });
                }
                //end event 选择套餐

                //begin event 动态报价
                $(document).on('click', '.close-picker', function(event) {
                    var productData = tool.getSessionStorage('productData');
                    var planCode = $('.insurance-section.selected').data('plancode'); //当前套餐码
                    var planInfo = pageCrl.getPlanInfo(productData, planCode);
                    var insuranceBeginTime = $('.ins-start-date').text().trim();
                    var insuranceEndTime = $('.ins-end-date').text().trim();

                    $('.ui-toast').remove(); //点击日期组件完成按钮，先清除提示信息
                    //起期是否合法
                    if (!pageCrl.isInsuranceTimeValid(planInfo, 'start', '保险起期')) {
                        return false
                    }

                    if (planInfo.localProMap.isDynamicAmount == 0) return; //非动态报价直接返回

                    //以下为动态报价
                    //止期是否合法
                    if (!pageCrl.isInsuranceTimeValid(planInfo, 'end', '保险止期')) {
                        return false
                    }

                    $.ajax({
                        url: '/icp/mobile_single_insurance/newCalculationPremium.do',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            planCode: planInfo.localProMap.planCode,
                            insuranceBeginTime: insuranceBeginTime,
                            insuranceEndTime: insuranceEndTime,
                            insuranceMonth: planInfo.remoteProMap.insuranceMonth,
                            insuranceDay: planInfo.remoteProMap.insuranceDay,
                            source: 'ashInsuranceForGroup2' //不传就走默认的动态报价接口
                        },
                        success: function(data) {
                            typeof data === 'string' && (data = JSON.parse(data));

                            if (data && data.mesgCode === '0000') { //成功
                                $('.insurance-section.selected  .standard-fee-digit').text(data.fee);
                            } else {
                                window.wAlert('动态报价失败，请重新选择保险起止日期');
                                pageCrl.initbeginDate(productData, planCode);
                                pageCrl.initEndDate(productData, planCode);
                                $('.insurance-section.selected  .standard-fee-digit').text(planInfo.localProMap.amount);
                            }
                        },
                        error: function() {
                            window.wAlert('网络出错，请刷新页面重试');
                            pageCrl.initbeginDate(productData, planCode);
                            pageCrl.initEndDate(productData, planCode);
                            $('.insurance-section.selected  .standard-fee-digit').text(planInfo.localProMap.amount);
                        }
                    }); //end ajax

                });
                //end event 动态报价

                //begin  event 点击购买
                $('#J-btn-buy').on('click', function() {
                    var urlParameters = tool.getSessionStorage('urlParameters');
                    var productData = tool.getSessionStorage('productData');
                    var planCode = $('.insurance-section.selected').data('plancode'); //当前套餐码
                    var planInfo = pageCrl.getPlanInfo(productData, planCode);
                    var insuranceBeginTime = $('.ins-start-date').text().trim();
                    var insuranceEndTime = $('.ins-end-date').text().trim();
                    var amount = $('.insurance-section.selected  .standard-fee-digit').text().trim();

                    //起期是否合法                      
                    if (!pageCrl.isInsuranceTimeValid(planInfo, 'start', '保险起期')) {
                        return false
                    }
                    //止期是否合法
                    if (planInfo.localProMap.isDynamicAmount == 1 && !pageCrl.isInsuranceTimeValid(planInfo, 'end', '保险止期')) {
                        return false
                    }

                    //组装数据
                    var localProMap = planInfo.localProMap;
                    var remoteProMap = planInfo.remoteProMap;
                    var submit = {
                        insuranceBeginTime: insuranceBeginTime,
                        insuranceEndTime: insuranceEndTime,
                        amount: amount,
                        account: productData.ACCOUNT,
                        productCode: productData.PRODUCTCODE,
                        planCode: planCode + ''
                    };

                    submit = $.extend({}, localProMap, remoteProMap, urlParameters, submit); //业务数据
                    tool.setSessionStorage('submit', submit);
                    window.sessionStorage.setItem('color', productData.color); //支付成功结果页面需要用到
                    window.location.href = 'applicant.html';
                });
                //end  event 点击购买
                $('head').addClass('close-picker').trigger('click').removeClass('close-picker');
            } //end init

    }; //end pageCrl

    $(function() {
        pageCrl && pageCrl.init();
    });

})();
