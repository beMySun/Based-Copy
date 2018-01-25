/**
 * Created by yanyongkang697 on 16/12/27.
 */

define("components/setDate",["jquery","dateUtil","mobiscrollCore","mobiscrollCoreZh","mobiscrollCoredatetime","mobiscrollCoredatetimeZh"], function(require,exports, module) {

    var DateUtil = require("dateUtil"),
        mobiscrollCore = require("mobiscrollCore"),
        mobiscrollCoreZh = require("mobiscrollCoreZh"),
        mobiscrollCoredatetime = require("mobiscrollCoredatetime"),
        mobiscrollCoredatetimeZh = require("mobiscrollCoredatetimeZh");

    var nowDate = new Date(),
        nowDateNext = DateUtil ? DateUtil.addDays(nowDate, 1) : new Date(new Date(nowDate).getTime() + 1 * 24 * 60 * 60 * 1000),
        nowDateYear = nowDateNext.getFullYear(); var nowDateMonth = DateUtil.handleStr(nowDateNext.getMonth()+1),
        nowDateDay = DateUtil.handleStr(nowDateNext.getDate()),
        nowDateData = nowDateYear + '-' + nowDateMonth + '-' + nowDateDay;

    var days = '2';
    var oneYearFixed = false;
    var startDate = nowDateData;
    var isErrorDateStart = false; 
    var isErrorDateEnd = false;
    var cui_getThisDataD;

    var initDate = {

        init:function(){
            var self = this;

            console.log('init');

            $('#dateInput').on('change',function(){
                self.chooseStartDate($('#dateInput').val());
            });

            $('#drivingCardBirthday').on('change',function(){
                self.chooseEndDate();
            });

            var reinsuranceDay;

            if ($('#newDateMethod').val() == '1') { //启用新方法处理
                if($('input[name=insuranceMonth]').val() != '') {//最大可承保日期选择的是月份
                    reinsuranceMonth = parseInt($('input[name=insuranceMonth]').val());
                    var endDate = window.DateUtil.addMonths(nowDateNext, reinsuranceMonth);
                    reinsuranceDay = (endDate - nowDateNext) / (24 * 60 * 60 * 1000);
                    oneYearFixed = reinsuranceMonth == 12;
                } else{//最大可承保日期选择的是日
                    reinsuranceDay = $('input[name=insuranceDay]').val() - 1;
                    oneYearFixed = false;
                }
            } else {
                if($('input[name=insuranceMonth]').val() != ''){//最大可承保日期选择的是月份
                    reinsuranceMonth = $('input[name=insuranceMonth]').val();
                    cui_getDataY = nowDateYear;
                    cui_getDataM = nowDate.getMonth() + 1;
                    cui_getDataD = nowDate.getDate();
                    reinsuranceDay = self.getDateYMD(reinsuranceDay,reinsuranceMonth,cui_getDataY,cui_getDataM,0);
                    cui_getThisDataD = self.getMonthsDay(cui_getDataM,cui_getThisDataD,cui_getDataY);
                    if(cui_getDataM == '1'){
                        if(cui_getDataD == cui_getThisDataD){
                            reinsuranceDay = self.getDateYMD(reinsuranceDay,parseInt(reinsuranceMonth)+1,cui_getDataY,cui_getDataM,1);
                        }else{
                            reinsuranceDay = self.getDateYMD(reinsuranceDay,reinsuranceMonth,cui_getDataY,cui_getDataM,0);
                        }
                        reinsuranceDay = reinsuranceDay -1;
                    }else{
                        if(cui_getDataM+parseInt(reinsuranceMonth) > 12){
                            reinsuranceDay = self.getDateYMD(reinsuranceDay,parseInt(reinsuranceMonth)+1,cui_getDataY,cui_getDataM,1);
                            if((((parseInt(cui_getDataY)+1) % 4)==0) && (((parseInt(cui_getDataY)+1) % 100)!=0) || (((parseInt(cui_getDataY)+1) % 400)==0)){
                                if(cui_getDataM+parseInt(reinsuranceMonth) - 12 >= 2){
                                    reinsuranceDay = reinsuranceDay + 1;
                                }
                            }
                            reinsuranceDay = reinsuranceDay -1;
                        }else{
                            if(parseInt(reinsuranceMonth) == 8 && cui_getDataM == 3){
                                reinsuranceDay = self.getDateYMD(reinsuranceDay,parseInt(reinsuranceMonth)+1,cui_getDataY,cui_getDataM,1);
                            }else{
                                reinsuranceDay = self.getDateYMD(reinsuranceDay,reinsuranceMonth,cui_getDataY,cui_getDataM,0);
                                var reinsuranceDay01 = self.getMonthsDay(cui_getDataM,reinsuranceDay01,cui_getDataY);
                                var reinsuranceDay02 = self.getMonthsDay(parseInt(cui_getDataM)+1,reinsuranceDay02,cui_getDataY);
                                if(reinsuranceDay01 > reinsuranceDay02){
                                    reinsuranceDay = reinsuranceDay -1;
                                }
                            }
                            reinsuranceDay = reinsuranceDay -1;
                        }
                    }
                    if(reinsuranceMonth == '12'){
                         //oneYearFixed = true;
                        if((((parseInt(cui_getDataY)+1) % 4)==0) && (((parseInt(cui_getDataY)+1) % 100)!=0) || (((parseInt(cui_getDataY)+1) % 400)==0)){
                            if(cui_getDataM > '02'){
                                reinsuranceDay = 365;
                            }else{
                                reinsuranceDay = 364;
                            }
                        }else{
                            reinsuranceDay = 364;
                        }
                        if(((cui_getDataY % 4)==0) && ((cui_getDataY % 100)!=0) || ((cui_getDataY % 400)==0)){
                            if(cui_getDataM > '02'){
                                reinsuranceDay = 364;
                            }else{
                                reinsuranceDay = 365;
                            }
                        }
                    }
                } else {//最大可承保日期选择的是日
                    reinsuranceDay = $('input[name=insuranceDay]').val() - 1;
                    oneYearFixed = false;
                }
            }

            var curr= parseInt(startDate.substring(0,4));
            var dateInput = $("#dateInput");
            var opt = {};
            opt.date = {preset : 'date'};

            var reinsuranceDay = self.getDaySelectDays('insurance');
            var underwriteDay = self.getDaySelectDays('underwrite');

            console.log('insurance :' + reinsuranceDay);
            console.log('underwrite :' + underwriteDay);



            document.getElementById('dateInput').setAttribute('type','date');
            //设置保险起期限的可选范围
            dateInput.attr('min',startDate);
            dateInput.attr('max',self.getDateString(underwriteDay));

            dateInput.val(startDate).scroller('destroy').scroller($.extend(opt.date, {theme: 'default', mode: 'scroller', display: 'modal', lang: 'zh' , startYear: curr , endYear: curr + 10}));
            
            document.getElementById('dateInput').setAttribute('type','text');//日期组件type为date时存在bug


            if(sessionStorage.getItem('theDates')){
                var theDates=sessionStorage.getItem("theDates");
                theDates=JSON.parse(theDates);
                dateInput.val(theDates.startDate);
                //dateInput.scroller('destroy').scroller($.extend(opt.date, {theme: 'default', mode: 'scroller', display: 'modal', lang: 'zh' , startYear: selectDate.getFullYear() , endYear: selectDate.getFullYear() + 10}));
            }

            // if (days == reinsuranceDay || oneYearFixed) {
            //  console.log(reinsuranceMonth  +'; oneYearFixed : '+ oneYearFixed);
            //  self.showSelectDate('end', startDate, reinsuranceDay - 1);
            // } else {
            //  self.showSelectDate('end', startDate, 1);
            // }

            // 这里设置页面加载完成之后默认显示的日期区间，默认的止期为开始的时间 加上 保险区间 -1
            if( $('input[name=insuranceMonth]').val() != '') {

                if( $('input[name=insuranceMonth]').val() == '12') {
                    console.log('投保是月份，12个月');
                    self.showSelectDate('end', startDate, 0);
                }
                else {
                    console.log('投保是月份,开始日期是:' + startDate + ', 保险天数是: ' + reinsuranceDay);
                    self.showSelectDate('end', startDate,  reinsuranceDay);
                }

            }
             else {

                if($('input[name=insuranceDay]').val() == '365') {
                    console.log('投保是天数,开始日期是:' + startDate + ', 保险天数是: ' + $('input[name=insuranceDay]').val());
                    self.showSelectDate('end', startDate, 0);
                } else {
                    console.log('投保是天数,开始日期是:' + startDate + ', 保险天数是: ' + $('input[name=insuranceDay]').val() );
                    self.showSelectDate('end', startDate, $('input[name=insuranceDay]').val()-1);
                }

            }

            self.getPremium();
        },

        getDaySelectDays : function(inputName){
                var self = this;
                var reinsuranceDay=0;
                if(inputName=='insurance'){
                    var month=$('input[name=insuranceMonth]').val(),
                    day=$('input[name=insuranceDay]').val(),
                    num=0;
                }else if(inputName=='underwrite'){
                    var month=$('input[name=underwriteMonth]').val(),
                    day=$('input[name=underwriteDay]').val(),
                    num=1;
                }

                if(month != ''){//最大可承保日期选择的是月份
                    var reinsuranceMonth = month,
                    cui_getDataY = nowDateYear,
                    cui_getThisDataD,
                    cui_getDataM = nowDate.getMonth() + 1,
                    cui_getDataD = nowDate.getDate();

                    reinsuranceDay = self.getDateYMD(reinsuranceDay,reinsuranceMonth,cui_getDataY,cui_getDataM,0);
                    cui_getThisDataD = self.getMonthsDay(cui_getDataM,cui_getThisDataD,cui_getDataY);
                    if(cui_getDataM == '1'){
                        if(cui_getDataD == cui_getThisDataD){
                            reinsuranceDay = self.getDateYMD(reinsuranceDay,parseInt(reinsuranceMonth)+1,cui_getDataY,cui_getDataM,1);
                        }else{
                            reinsuranceDay = self.getDateYMD(reinsuranceDay,reinsuranceMonth,cui_getDataY,cui_getDataM,0);
                        }
                        reinsuranceDay = reinsuranceDay -1;
                    }else{
                        if(cui_getDataM+parseInt(reinsuranceMonth) > 12){
                            reinsuranceDay = self.getDateYMD(reinsuranceDay,parseInt(reinsuranceMonth)+1,cui_getDataY,cui_getDataM,1);
                            if((((parseInt(cui_getDataY)+1) % 4)==0) && (((parseInt(cui_getDataY)+1) % 100)!=0) || (((parseInt(cui_getDataY)+1) % 400)==0)){
                                if(cui_getDataM+parseInt(reinsuranceMonth) - 12 >= 2){
                                    reinsuranceDay = reinsuranceDay + 1;
                                }
                            }
                            reinsuranceDay = reinsuranceDay -1;
                        }else{
                            if(parseInt(reinsuranceMonth) == 8 && cui_getDataM == 3){
                                reinsuranceDay = self.getDateYMD(reinsuranceDay,parseInt(reinsuranceMonth)+1,cui_getDataY,cui_getDataM,1);
                            }else{
                                reinsuranceDay = self.getDateYMD(reinsuranceDay,reinsuranceMonth,cui_getDataY,cui_getDataM,0);
                                var reinsuranceDay01 = self.getMonthsDay(cui_getDataM,reinsuranceDay01,cui_getDataY);
                                var reinsuranceDay02 = self.getMonthsDay(parseInt(cui_getDataM)+1,reinsuranceDay02,cui_getDataY);
                                if(reinsuranceDay01 > reinsuranceDay02){
                                    reinsuranceDay = reinsuranceDay -1;
                                }
                            }
                            reinsuranceDay = reinsuranceDay -1;
                        }
                    }
                    if(reinsuranceMonth == '12'){
                        if(inputName=='insurance'){oneYearFixed = true;}
                        if((((parseInt(cui_getDataY)+1) % 4)==0) && (((parseInt(cui_getDataY)+1) % 100)!=0) || (((parseInt(cui_getDataY)+1) % 400)==0)){
                            if(cui_getDataM > '02'){
                                reinsuranceDay = 365;
                            }else{
                                reinsuranceDay = 364;
                            }
                        }else{
                            reinsuranceDay = 364;
                        }
                        if(((cui_getDataY % 4)==0) && ((cui_getDataY+num% 100)!=0) || ((cui_getDataY % 400)==0)){
                            if(cui_getDataM > '02'){
                                reinsuranceDay = 364;
                            }else{
                                reinsuranceDay = 365;
                            }
                        }
                    }
                    } else {//最大可承保日期选择的是日
                        reinsuranceDay = day - 1+num;
                        if(inputName=='insurance'){oneYearFixed = false;}
                    }

            return reinsuranceDay;
        },
        showSelectDate: function(type,date,num) {
            var self = this;
            var selectDate = month = day = weekArr = week = null;
            date = date || '';
            if(typeof date == 'string'){
                date = date.replace(/-/g,'/');
            }
            if(type == 'end'){
                selectDate = new Date(new Date(date).getTime() + num*24*60*60*1000);
                //selectDate = new Date(new Date(date).getTime());
                endDate = selectDate.getFullYear()   + '-' + DateUtil.handleStr(selectDate.getMonth() + 1) + '-' + DateUtil.handleStr(selectDate.getDate());
            }

            var drivingCardBirthday = $("#drivingCardBirthday");
            drivingCardBirthday.removeAttr("disabled");
            var opt = {};
            opt.date = {preset : 'date'};



            var start = $('#dateInput').val();

            var drivingCardBirthday = $("#drivingCardBirthday");

            document.getElementById('drivingCardBirthday').setAttribute('type','date');

            drivingCardBirthday.attr('min',startDate);

            // start year -1 ,初始化为明年的今天的昨天，但是去年也要是可选的，endDate 是一年后的时间，所以开始的年份要减一
            drivingCardBirthday.val(endDate).scroller('destroy').scroller($.extend(opt.date, {theme: 'default', mode: 'scroller', display: 'modal', lang: 'zh' , startYear: selectDate.getFullYear() - 1 , endYear: selectDate.getFullYear() + 10}));


            document.getElementById('drivingCardBirthday').setAttribute('type','text');//日期组件type为date时存在bug

            var  reinsuranceDay = self.getDaySelectDays('insurance'),
                  maxEndDate = reinsuranceDay + parseInt((new Date(date).getTime()-new Date().getTime())/3600/1000/24+1);

            drivingCardBirthday.attr("max",self.getDateString(maxEndDate));


          document.getElementById('drivingCardBirthday').setAttribute('type','text');//日期组件type为date时存在bug


            // MARK 缓存用户选择的时间
            if(sessionStorage.getItem("theDates")){
                var theDates=sessionStorage.getItem('theDates');
                theDates=JSON.parse(theDates);
                drivingCardBirthday.val(theDates.endDate);
                //window.sessionStorage.clear();
                //drivingCardBirthday.scroller('destroy').scroller($.extend(opt.date, {theme: 'default', mode: 'scroller', display: 'modal', lang: 'zh' , startYear: selectDate.getFullYear() , endYear: selectDate.getFullYear() + 10}));
            }

            var reinsuranceDay;
            if ($('#newDateMethod').val() == '1') { //启用新方法处理
                if($('input[name=insuranceMonth]').val() != '') {//最大可承保日期选择的是月份
                    reinsuranceMonth = parseInt($('input[name=insuranceMonth]').val());
                    var endDate = window.DateUtil.addMonths(nowDateNext, reinsuranceMonth);
                    reinsuranceDay = (endDate - nowDateNext) / (24 * 60 * 60 * 1000);
                    oneYearFixed = reinsuranceMonth == 12;
                } else{//最大可承保日期选择的是日
                    reinsuranceDay = $('input[name=insuranceDay]').val() - 1;
                }
            } else {
                if($('input[name=insuranceMonth]').val() != ''){//最大可承保日期选择的是月份
                    var reinsuranceMonth = $('input[name=insuranceMonth]').val();
                    var cui_getCurr = new Date($('#drivingCardBirthday').val());
                    cui_getDataY = cui_getCurr.getFullYear();
                    cui_getDataM = cui_getCurr.getMonth() + 1;
                    cui_getDataD = cui_getCurr.getDate();
                    reinsuranceDay = self.getDateYMD(reinsuranceDay,reinsuranceMonth,cui_getDataY,cui_getDataM,0);
                    cui_getThisDataD = self.getMonthsDay(cui_getDataM,cui_getThisDataD,cui_getDataY);
                    if(cui_getDataM == '1'){
                        if(cui_getDataD == cui_getThisDataD){
                            reinsuranceDay = self.getDateYMD(reinsuranceDay,parseInt(reinsuranceMonth)+1,cui_getDataY,cui_getDataM,1);
                        }else{
                            reinsuranceDay = self.getDateYMD(reinsuranceDay,reinsuranceMonth,cui_getDataY,cui_getDataM,0);
                        }
                        reinsuranceDay = reinsuranceDay -1;
                    }else{
                        if(cui_getDataM+parseInt(reinsuranceMonth) > 12){
                            reinsuranceDay = self.getDateYMD(reinsuranceDay,parseInt(reinsuranceMonth)+1,cui_getDataY,cui_getDataM,1);
                            if((((parseInt(cui_getDataY)+1) % 4)==0) && (((parseInt(cui_getDataY)+1) % 100)!=0) || (((parseInt(cui_getDataY)+1) % 400)==0)){
                                if(cui_getDataM+parseInt(reinsuranceMonth) - 12 >= 2){
                                    reinsuranceDay = reinsuranceDay + 1;
                                }
                            }
                            reinsuranceDay = reinsuranceDay -1;
                        }else{
                            if(parseInt(reinsuranceMonth) == 8 && cui_getDataM == 3){
                                reinsuranceDay = self.getDateYMD(reinsuranceDay,parseInt(reinsuranceMonth)+1,cui_getDataY,cui_getDataM,1);
                            }else{
                                reinsuranceDay = self.getDateYMD(reinsuranceDay,reinsuranceMonth,cui_getDataY,cui_getDataM,0);
                                var reinsuranceDay01 = self.getMonthsDay(cui_getDataM,reinsuranceDay01,cui_getDataY);
                                var reinsuranceDay02 = self.getMonthsDay(parseInt(cui_getDataM)+1,reinsuranceDay02,cui_getDataY);
                                if(reinsuranceDay01 > reinsuranceDay02){
                                    reinsuranceDay = reinsuranceDay -1;
                                }
                            }
                            reinsuranceDay = reinsuranceDay -1;
                        }
                    }
                    if(reinsuranceMonth == '12'){
                        // oneYearFixed = true;
                        if((((parseInt(cui_getDataY)+1) % 4)==0) && (((parseInt(cui_getDataY)+1) % 100)!=0) || (((parseInt(cui_getDataY)+1) % 400)==0)){
                            if(cui_getDataM > '02'){
                                reinsuranceDay = 365;
                            }else{
                                reinsuranceDay = 364;
                            }
                        }else{
                            reinsuranceDay = 364;
                        }
                        if(((cui_getDataY % 4)==0) && ((cui_getDataY % 100)!=0) || ((cui_getDataY % 400)==0)){
                            if(cui_getDataM > '02'){
                                reinsuranceDay = 364;
                            }else{
                                reinsuranceDay = 365;
                            }
                        }
                    }
                }else{//最大可承保日期选择的是日
                    reinsuranceDay = $('input[name=insuranceDay]').val() - 1;
                }
            }

            // mark  这里判断如果传入的承保月份如果是12 ，则止期不可点击
            // if (days == reinsuranceDay || oneYearFixed) {
            //  drivingCardBirthday.attr("disabled", "disabled");
            // }
        },

        getDateString: function(num) {

            var date = new Date(new Date().getTime() + num*1000*24*60*60);
            var dateStr = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();

            return dateStr;
        },
        getPremium : function(){
                var productCode = $('input[name=productCode]').val();
                var insuranceBeginTime = $('#dateInput').val();
                var insuranceEndTime = $('#drivingCardBirthday').val();

                var urls = 'calculationPremium.do';

                //var urls = '../js/debug/mock.json';

                $.ajax({
                    type : "POST",
                    dataType : "json",
                    url : urls,
                    data:{
                        productCode:productCode,
                        insuranceBeginTime:insuranceBeginTime,
                        insuranceEndTime:insuranceEndTime,
                        source:'ashInsuranceForGroup2'
                    },
                    success : function(response){
                        if(response.mesgCode == "0000"){//成功

                            $('#amount').html(response.fee);
                            $('input[name=amount]').val(response.fee); // 应付价格
                            
                            if($('input[name=premiumDiscount]').val()) { //
                                console.log('有优惠');
                                $('#standardAmount').html(response.fee); // 优惠价格

                                var zk = Number($('input[name=premiumDiscount]').val()); // 折扣比例

                                var discountAmount = Number(response.fee)*zk; // 折扣之后的价格

                                $('input[name=discountAmount]').val(discountAmount);

                                $('#standardAmount').html(discountAmount); // 优惠价格
                            } else {
                                console.log('没有优惠');
                            }

                        }  else {
                            alert(response.resultMsg);
                        }
                    },
                    error:function(){
                        var ua = navigator.userAgent.toLowerCase();
                        var IS_ANYDOOR = ua.indexOf('ANDROID') != -1;
                        if (IS_ANYDOOR) {
                            alert(" 提示: 系统异常！");
                        } else {
                            alert("系统异常！");
                        }
                    }
                });
        },
        chooseStartDate:function(value){
            console.log(value);
            var self = this;
            window.sessionStorage.removeItem('saveDates');
            $('#error').text('');
            var reunderwriteDay;
            if ($('#newDateMethod').val() == '1') { //启用新方法处理
                if($('input[name=underwriteMonth]').val() != '') {//最大可承保日期选择的是月份
                    var reinsuranceMonth = $('input[name=underwriteMonth]').val();
                    var endDate = window.DateUtil.addMonths(nowDateNext, reinsuranceMonth);
                    reunderwriteDay = (endDate - nowDateNext) / (24 * 60 * 60 * 1000);
                    oneYearFixed = reinsuranceMonth == 12;
                } else{//最大可承保日期选择的是日
                    reunderwriteDay = $('input[name=underwriteDay]').val() - 1;
                    oneYearFixed = false;
                }
            } else {
                if($('input[name=underwriteMonth]').val() != ''){//最大可承保日期选择的是月份
                    var reinsuranceMonth = $('input[name=underwriteMonth]').val();
                    var cui_getCurr = new Date(value);
                    cui_getDataY = cui_getCurr.getFullYear();
                    cui_getDataM = cui_getCurr.getMonth() + 1;
                    cui_getDataD = cui_getCurr.getDate();
                    reunderwriteDay = self.getDateYMD(reunderwriteDay,reinsuranceMonth,cui_getDataY,cui_getDataM,0);
                    cui_getThisDataD = self.getMonthsDay(cui_getDataM,cui_getThisDataD,cui_getDataY);
                    if(cui_getDataM == '1'){
                        if(cui_getDataD == cui_getThisDataD){
                            reunderwriteDay = self.getDateYMD(reunderwriteDay,parseInt(reinsuranceMonth)+1,cui_getDataY,cui_getDataM,1);
                        }else{
                            reunderwriteDay = self.getDateYMD(reunderwriteDay,reinsuranceMonth,cui_getDataY,cui_getDataM,0);
                        }
                        reinsuranceDay = reinsuranceDay -1;
                    }else{
                        if(cui_getDataM+parseInt(reinsuranceMonth) > 12){
                            reunderwriteDay = self.getDateYMD(reunderwriteDay,parseInt(reinsuranceMonth)+1,cui_getDataY,cui_getDataM,1);
                            if((((parseInt(cui_getDataY)+1) % 4)==0) && (((parseInt(cui_getDataY)+1) % 100)!=0) || (((parseInt(cui_getDataY)+1) % 400)==0)){
                                if(cui_getDataM+parseInt(reinsuranceMonth) - 12 >= 2){
                                    reunderwriteDay = reunderwriteDay + 1;
                                }
                            }
                            reunderwriteDay = reunderwriteDay -1;
                        }else{
                            if(parseInt(reinsuranceMonth) == 8 && cui_getDataM == 3){
                                reunderwriteDay = self.getDateYMD(reunderwriteDay,parseInt(reinsuranceMonth)+1,cui_getDataY,cui_getDataM,1);
                            }else{
                                reunderwriteDay = self.getDateYMD(reunderwriteDay,reinsuranceMonth,cui_getDataY,cui_getDataM,0);
                                var reinsuranceDay01 = self.getMonthsDay(cui_getDataM,reinsuranceDay01,cui_getDataY);
                                var reinsuranceDay02 = self.getMonthsDay(parseInt(cui_getDataM)+1,reinsuranceDay02,cui_getDataY);
                                if(reinsuranceDay01 > reinsuranceDay02){
                                    reunderwriteDay = reunderwriteDay -1;
                                }
                            }
                            reunderwriteDay = reunderwriteDay -1;
                        }
                    }
                    if(reinsuranceMonth == '12'){
                          // oneYearFixed = true;
                        if((((parseInt(cui_getDataY)+1) % 4)==0) && (((parseInt(cui_getDataY)+1) % 100)!=0) || (((parseInt(cui_getDataY)+1) % 400)==0)){
                            if(cui_getDataM > '02'){
                                reunderwriteDay = 365;
                            }else{
                                reunderwriteDay = 364;
                            }
                        }else{
                            reunderwriteDay = 364;
                        }
                        if(((cui_getDataY % 4)==0) && ((cui_getDataY+1 % 100)!=0) || ((cui_getDataY % 400)==0)){
                            if(cui_getDataM > '02'){
                                reunderwriteDay = 364;
                            }else{
                                reunderwriteDay = 365;
                            }
                        }
                    }
                }else{//最大可承保日期选择的是日
                    reunderwriteDay = $('input[name=underwriteDay]').val();
                    oneYearFixed = false;
                }
            }
            value = value.replace(/-/g,'/');
            var selectDate = new Date(value);
            if(selectDate.getTime() < self.setDateTime(0).getTime()){
                $('#error').text('保险起期不能早于当天');
                isErrorDateStart = true;
                return false;
            }else if(selectDate.getTime() > self.setDateTime(reunderwriteDay).getTime()){
                if($('input[name=underwriteMonth]').val() != ''){
                    $('#error').text('保险起期必须在'+reinsuranceMonth+'个月内');
                }else{
                    $('#error').text('保险起期必须在'+reunderwriteDay+'天内');
                }
                isErrorDateStart = true;
                return false;
            }else{
                isErrorDateStart = false;
            }


            if($('input[name=insuranceMonth]').val()) {

                if ($('input[name=insuranceMonth]').val() == '12'){
                    console.log('12');
                    self.showSelectDate('end',value,0);
                } else {
                    reinsuranceMonth = $('input[name=insuranceMonth]').val();
                    cui_getDataY = nowDateYear;
                    cui_getDataM = nowDate.getMonth() + 1;
                    cui_getDataD = nowDate.getDate();
                    var reinsuranceDay = self.getDateYMD(reinsuranceDay,reinsuranceMonth,cui_getDataY,cui_getDataM,0);
                    cui_getThisDataD = self.getMonthsDay(cui_getDataM,cui_getThisDataD,cui_getDataY);
                    if(cui_getDataM == '1'){
                        if(cui_getDataD == cui_getThisDataD){
                            reinsuranceDay = self.getDateYMD(reinsuranceDay,parseInt(reinsuranceMonth)+1,cui_getDataY,cui_getDataM,1);
                        }else{
                            reinsuranceDay = self.getDateYMD(reinsuranceDay,reinsuranceMonth,cui_getDataY,cui_getDataM,0);
                        }
                        reinsuranceDay = reinsuranceDay -1;
                    }else{
                        if(cui_getDataM+parseInt(reinsuranceMonth) > 12){
                            reinsuranceDay = self.getDateYMD(reinsuranceDay,parseInt(reinsuranceMonth)+1,cui_getDataY,cui_getDataM,1);
                            if((((parseInt(cui_getDataY)+1) % 4)==0) && (((parseInt(cui_getDataY)+1) % 100)!=0) || (((parseInt(cui_getDataY)+1) % 400)==0)){
                                if(cui_getDataM+parseInt(reinsuranceMonth) - 12 >= 2){
                                    reinsuranceDay = reinsuranceDay + 1;
                                }
                            }
                            reinsuranceDay = reinsuranceDay -1;
                        }else{
                            if(parseInt(reinsuranceMonth) == 8 && cui_getDataM == 3){
                                reinsuranceDay = self.getDateYMD(reinsuranceDay,parseInt(reinsuranceMonth)+1,cui_getDataY,cui_getDataM,1);
                            }else{
                                reinsuranceDay = self.getDateYMD(reinsuranceDay,reinsuranceMonth,cui_getDataY,cui_getDataM,0);
                                var reinsuranceDay01 = self.getMonthsDay(cui_getDataM,reinsuranceDay01,cui_getDataY);
                                var reinsuranceDay02 = self.getMonthsDay(parseInt(cui_getDataM)+1,reinsuranceDay02,cui_getDataY);
                                if(reinsuranceDay01 > reinsuranceDay02){
                                    reinsuranceDay = reinsuranceDay -1;
                                }
                            }
                            reinsuranceDay = reinsuranceDay -1;
                        }
                    }
                    if(reinsuranceMonth == '12'){
                        //oneYearFixed = true;
                        if((((parseInt(cui_getDataY)+1) % 4)==0) && (((parseInt(cui_getDataY)+1) % 100)!=0) || (((parseInt(cui_getDataY)+1) % 400)==0)){
                            if(cui_getDataM > '02'){
                                reinsuranceDay = 365;
                            }else{
                                reinsuranceDay = 364;
                            }
                        }else{
                            reinsuranceDay = 364;
                        }
                        if(((cui_getDataY % 4)==0) && ((cui_getDataY % 100)!=0) || ((cui_getDataY % 400)==0)){
                            if(cui_getDataM > '02'){
                                reinsuranceDay = 364;
                            }else{
                                reinsuranceDay = 365;
                            }
                        }
                    }

                    console.log('区间:'+reinsuranceDay);

                    self.showSelectDate('end',value,reinsuranceDay);

                }
            } else {

                if ($('input[name=insuranceDay]').val() == '365'){
                    console.log('365');
                    self.showSelectDate('end',value,0);
                }
                else {
                    self.showSelectDate('end',value,$('input[name=insuranceDay]').val()-1);
                }
            }

            self.updateStartDate('end',value,0);
            
        },
        chooseEndDate:function(){
            var self = this;
            window.sessionStorage.removeItem('saveDates');
            var reinsuranceDay;
            if ($('#newDateMethod').val() == '1') { //启用新方法处理
                if($('input[name=insuranceMonth]').val() != '') {//最大可承保日期选择的是月份
                    reinsuranceMonth = parseInt($('input[name=insuranceMonth]').val());
                    var endDate = window.DateUtil.addMonths(nowDateNext, reinsuranceMonth);
                    reinsuranceDay = (endDate - nowDateNext) / (24 * 60 * 60 * 1000);
                    oneYearFixed = reinsuranceMonth == 12;
                } else{//最大可承保日期选择的是日
                    reinsuranceDay = $('input[name=insuranceDay]').val() - 1;
                    oneYearFixed = false;
                }
            } else {
                if($('input[name=insuranceMonth]').val() != ''){//最大可承保日期选择的是月份
                    var reinsuranceMonth = $('input[name=insuranceMonth]').val();
                    var cui_getCurr = new Date($('#dateInput').val());
                    cui_getDataY = cui_getCurr.getFullYear();
                    cui_getDataM = cui_getCurr.getMonth() + 1;
                    cui_getDataD = cui_getCurr.getDate();
                    reinsuranceDay = self.getDateYMD(reinsuranceDay,reinsuranceMonth,cui_getDataY,cui_getDataM,0);
                    cui_getThisDataD = self.getMonthsDay(cui_getDataM,cui_getThisDataD,cui_getDataY);
                    if(cui_getDataM == '1'){
                        if(cui_getDataD == cui_getThisDataD){
                            reinsuranceDay = self.getDateYMD(reinsuranceDay,parseInt(reinsuranceMonth)+1,cui_getDataY,cui_getDataM,1);
                        }else{
                            reinsuranceDay = self.getDateYMD(reinsuranceDay,reinsuranceMonth,cui_getDataY,cui_getDataM,0);
                        }
                        reinsuranceDay = reinsuranceDay -1;
                    }else{
                        if(cui_getDataM+parseInt(reinsuranceMonth) > 12){
                            reinsuranceDay = self.getDateYMD(reinsuranceDay,parseInt(reinsuranceMonth)+1,cui_getDataY,cui_getDataM,1);
                            if((((parseInt(cui_getDataY)+1) % 4)==0) && (((parseInt(cui_getDataY)+1) % 100)!=0) || (((parseInt(cui_getDataY)+1) % 400)==0)){
                                if(cui_getDataM+parseInt(reinsuranceMonth) - 12 >= 2){
                                    reinsuranceDay = reinsuranceDay + 1;
                                }
                            }
                            reinsuranceDay = reinsuranceDay -1;
                        }else{
                            if(parseInt(reinsuranceMonth) == 8 && cui_getDataM == 3){
                                reinsuranceDay = self.getDateYMD(reinsuranceDay,parseInt(reinsuranceMonth)+1,cui_getDataY,cui_getDataM,1);
                            }else{
                                reinsuranceDay = self.getDateYMD(reinsuranceDay,reinsuranceMonth,cui_getDataY,cui_getDataM,0);
                                var reinsuranceDay01 = self.getMonthsDay(cui_getDataM,reinsuranceDay01,cui_getDataY);
                                var reinsuranceDay02 = self.getMonthsDay(parseInt(cui_getDataM)+1,reinsuranceDay02,cui_getDataY);
                                if(reinsuranceDay01 > reinsuranceDay02){
                                    reinsuranceDay = reinsuranceDay -1;
                                }
                            }
                            reinsuranceDay = reinsuranceDay -1;
                        }
                    }
                    if(reinsuranceMonth == '12'){
                        // oneYearFixed = true;
                        if((((parseInt(cui_getDataY)+1) % 4)==0) && (((parseInt(cui_getDataY)+1) % 100)!=0) || (((parseInt(cui_getDataY)+1) % 400)==0)){
                            if(cui_getDataM > '02'){
                                reinsuranceDay = 365;
                            }else{
                                reinsuranceDay = 364;
                            }
                        }else{
                            reinsuranceDay = 364;
                        }
                        if(((cui_getDataY % 4)==0) && ((cui_getDataY % 100)!=0) || ((cui_getDataY % 400)==0)){
                            if(cui_getDataM > '02'){
                                reinsuranceDay = 364;
                            }else{
                                reinsuranceDay = 365;
                            }
                        }
                    }
                }else{//最大可承保日期选择的是日
                    reinsuranceDay = $('input[name=insuranceDay]').val() - 1;
                    oneYearFixed = false;
                }
            }
            var tishiinsuranceDay = $('input[name=insuranceDay]').val();
            if(days!= reinsuranceDay){
                $('#error').text('');
                var endVal = $('#drivingCardBirthday').val();
                var strVal = $('#dateInput').val();
                endVal = endVal.replace(/-/g,'/');
                strVal = strVal.replace(/-/g,'/');
                var endDate = new Date(endVal);
                var startDate = new Date(strVal);
                var dcount = (endDate.getTime()-startDate.getTime())/(1000*3600*24);
                if(dcount<0){
                    $('#error').text('保险止期不能早于保险起期!');
                    isErrorDateEnd = true;
                    return false;
                }else if(dcount>reinsuranceDay){
                    if($('input[name=insuranceMonth]').val() != ''){
                        $('#error').text('保险止期必须在'+reinsuranceMonth+'个月内');
                    }else{
                        $('#error').text('保险止期必须在'+tishiinsuranceDay+'天内');
                    }
                    isErrorDateEnd = true;
                    return false;
                }else{
                    isErrorDateEnd = false;
                }
            }
            if (oneYearFixed) {
                var value = $('#dateInput').val();
                value = value.replace(/-/g, '/');
                self.showSelectDate('end', value, reinsuranceDay - 1);
            }
            self.getPremium();
        },

        updateStartDate:function(type,date,num){
            var self = this;
            var selectDate = month = day = weekArr = week = null;
            date = date || '';
            if(typeof date == 'string'){
                date = date.replace(/-/g,'/');
            }
            if(type == 'end'){
                selectDate = new Date(new Date(date).getTime() + num*24*60*60*1000);
                //selectDate = new Date(new Date(date).getTime());
                endDate = selectDate.getFullYear()   + '-' + DateUtil.handleStr(selectDate.getMonth() + 1) + '-' + DateUtil.handleStr(selectDate.getDate());
            }

            var drivingCardBirthday = $("#drivingCardBirthday");
            drivingCardBirthday.removeAttr("disabled");
            var opt = {};
            opt.date = {preset : 'date'};




            var drivingCardBirthday = $("#drivingCardBirthday");
            var  reinsuranceDay = self.getDaySelectDays('insurance'),
                  maxEndDate = reinsuranceDay + parseInt((new Date(date).getTime()-new Date().getTime())/3600/1000/24+1);


            document.getElementById('drivingCardBirthday').setAttribute('type','date');

            drivingCardBirthday.attr('min',$('#dateInput').val());

            drivingCardBirthday.attr("max",self.getDateString(maxEndDate));

            // start year -1 ,初始化为明年的今天的昨天，但是去年也要是可选的，endDate 是一年后的时间，所以开始的年份要减一
            drivingCardBirthday.val(endDate).scroller('destroy').scroller($.extend(opt.date, {theme: 'default', mode: 'scroller', display: 'modal', lang: 'zh' , startYear: selectDate.getFullYear() - 1 , endYear: selectDate.getFullYear() + 10}));

            document.getElementById('drivingCardBirthday').setAttribute('type','text');//日期组件type为date时存在bug

            self.chooseEndDate();

        },

        setDateTime:function(num){
            var newDate = new Date(new Date().getTime() +num*24*60*60*1000);
            return newDate;
        },

        getDateYMD:function(obj,num,getDataY,getDataM,numI){//传来的有几个月
            var self = this;
            var nowday;
            var obj = 0;
            for(var i=numI;i<num;i++){
                obj += self.getMonthsDay(getDataM+i,nowday,getDataY);
            }
            return obj;
        },
         getMonthsDay:function(m,getDay,getDataY){// 每个月的月份对应的天数
            if(m % 12 == 1){ //传进来的月份
                getDay = 31;
            }else if(m % 12 == 2){
                if (((getDataY % 4)==0) && ((getDataY % 100)!=0) || ((getDataY % 400)==0)) {// 是闰年
                    getDay = 29;
                } else { // 不是闰年
                    getDay = 28;
                }
            }else if(m % 12 == 3){
                getDay = 31;
            }else if(m % 12 == 4){
                getDay = 30;
            }else if(m % 12 == 5){
                getDay = 31;
            }else if(m % 12 == 6){
                getDay = 30;
            }else if(m % 12 == 7){
                getDay = 31;
            }else if(m % 12 == 8){
                getDay = 31;
            }else if(m % 12 == 9){
                getDay = 30;
            }else if(m % 12 == 10){
                getDay = 31;
            }else if(m % 12 == 11){
                getDay = 30;
            }else if(m % 12 == 0){
                getDay = 31;
            }
            return getDay;
        }


    }

    module.exports = {
        
        isErrorDateStart : isErrorDateStart,
        isErrorDateEnd : isErrorDateEnd ,
        dateTime : initDate
    }


});
