$(function() {

    // "insuredMaxAge":"被保人最大年龄",
    // "insuredMiniAge":"被保人最小年龄",
    // "insuredLimitedSex":"被保人限制性别 0无限制1男2女",
    // "applicantMaxAge":"投保最大年龄",
    // "applicantMiniAge":"投保最小年龄",
    // "applicantLimitedSex":"投保人限制性别 0无限制1男2女",

    // 通用模版默认只显示联系人信息
    // 联系人为默认被保人，这里进行顶层控制，按需设置。

    // 选择行业分类
    $(function() {

        var industryData = [];

        $.ajax({
            type: "POST",
            contentType: "application/json;utf-8",
            url: '/mobileSinglePlatform/queryGroupAhsIndustry.do',
            async: false,
            dataType: 'json',
            success: function(res) {
                industryData = res.industryList;
            },
            error: function(res) {}
        });

        var titleArr = ['请选择'];
        var selectList = [];
        window.selectIndustry = {
            createHTML: function() {

                if (!selectList.length) {
                    selectList = selectIndustry.getData();
                }

                console.log(titleArr, 'a');
                var str = '<p class="hadSelected">' + titleArr.join('/') + '</p>';
                selectList.forEach(function(value, i) {
                    str += ['<p class="selectList" onclick="window.selectIndustry.changeIndustryHTML(' + i + ')" datacode="' + value[0] + '" index="' + i + '">',
                        '<span>' + value[1] + '</span>',
                        '<i class="iconRight icon-right"></i>',
                        '</p>'
                    ].join("");
                });

                $('#selectIndustry').html(str).show();
                $('.content').hide();
            },
            getData: function(level1, level2) {
                var list = [];
                if (!level1) {
                    industryData.forEach(function(value, index) {
                        if (list.length) {
                            for (var i = 0, len = list.length; i < len; i++) {
                                if (list[i][0] == value.industry_code_level1) return;
                            }
                        };
                        var ele = [];
                        ele.push(value.industry_code_level1);
                        ele.push(value.industry_name_level1);
                        list.push(ele);
                    })
                } else if (level1 && !level2) {
                    industryData.forEach(function(value, index) {
                        var ele = [];
                        if (value.industry_name_level1 == level1) {
                            if (list.length) {
                                for (var i = 0, len = list.length; i < len; i++) {
                                    if (list[i][1] == value.industry_name_level2) return;
                                }
                            };
                            ele.push(value.industry_code_level1);
                            ele.push(value.industry_name_level2);
                            list.push(ele);
                        }
                    })
                } else if (level2) {
                    industryData.forEach(function(value, index) {
                        var ele = [];
                        if (value.industry_name_level1 == level1 && value.industry_name_level2 == level2) {
                            if (list.length) {
                                for (var i = 0, len = list.length; i < len; i++) {
                                    if (list[i][1] == value.industry_name_level3) return;
                                }
                            };
                            ele.push(value.industry_code_level1);
                            ele.push(value.industry_name_level3);
                            ele.push(value.industry_statement);
                            list.push(ele);
                        }
                    })
                }

                return list;
            },
            changeIndustryHTML: function(i) {
                if (titleArr[0] == '请选择') {
                    titleArr.shift()
                };
                console.log(titleArr, 'b')
                var target = $('.selectList').eq(i);
                if (titleArr.length == 2) {
                    $('#industryCode').val(target.attr('datacode'));
                    $('#industryText').val(selectList[target.attr('index')][1]);
                    if (selectList[target.attr('index')][2]) {
                        $('#descriptionParent').show();
                        $('#description').text(selectList[target.attr('index')][2])
                    } else {
                        $('#descriptionParent').hide();
                    };
                    titleArr = ['请选择'];
                    selectList = [];
                    window.history.back(-1);
                    return;
                }
                titleArr.push(selectList[target.attr('index')][1]);
                selectList = this.getData(titleArr[0], titleArr[1]);

                console.log(titleArr, 'c')
                this.createHTML();
            }
        }

        $('#industry').click(function() {
            window.history.pushState({
                title: '#selectIndustry'
            }, '#selectIndustry', window.location.href + '#selectIndustry');
            selectIndustry.createHTML();
        });

        window.onpopstate = function(e) {
            $('.content').show();
            $('#selectIndustry').hide();
            titleArr = ['请选择'];
            selectList = [];
        }
    });


    var CONFIG = {
        need_group_show: true, // 是否需要显示输入团体信息	
        need_LinkMan_ID: false // 是否需要输入联系人的身份信息
    };

    //缓存选择器
    var DOM = {

        $loading: $('.loading'),
        $groupDatas: $('#groupDatas'),
        $groupName: $('#groupName'), // 团体险所需 客户名称，证件类型和号码
        $groupCertificateType: $('#groupCertificateType'),
        $groupCertificateNo: $('#groupCertificateNo'),
        $industryCode: $('#industryCode'),
        $industryText: $('#industryText'),
        $link_man_datas: $('#link_man_datas'),
        $linkManName: $('#linkManName'), // 联系人信息， 联系人为默认被保人
        $linkManMobileTelephone: $('#linkManMobileTelephone'), // 联系人手机号
        $applicantCertType: $('#applicantCertType'), // 证件类型
        $for_paperNo1: $('#for_paperNo1'), // 身份证号
        $for_paperNo_other1: $('#for_paperNo_other1'), // 其它证件号
        $sex_box: $('#sex_box'),
        $birth_box: $('#birth_box'),
        $datePicker: $('#datePicker'),
        $ins_start_date: $('.ins_start_date'),
        $boy: $('#boy'),
        $girl: $('#girl'),
        $email_box: $('#email_box'),
        $email_label: $('#email_label'),
        $email_checkbox: $('#email_checkbox'),
        $applicantEmail: $('#applicantEmail'),
        $error: $('#error')
    };

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

            return futureDate;
        },

        getUrlParam: function(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
            var r = window.location.search.substr(1).match(reg);
            if (r !== null)
                return unescape(r[2]);
            return '';
        }

    };

    var pageManager = {

        init: function() {
            var submit = JSON.parse(window.sessionStorage.getItem('submit'));
            $(".title").text(submit.planName);
            DOM.$loading.hide();

            var self = this;
            var applicantInfoData = JSON.parse(window.sessionStorage.getItem('applicantInfo'));
            if (applicantInfoData) {
                self.initTime();
            }

            self.render(applicantInfoData);

        },
        render: function(data) {

            DOM.$boy.attr('checked', 'true'); // 设置默认性别

            //需要输入联系人的身份信息 则初始化时间选择组件
            if (CONFIG.need_LinkMan_ID) {
                DOM.$link_man_datas.show();
            }
            if (CONFIG.need_group_show) {
                DOM.$groupDatas.show();
            } else {
                DOM.$groupDatas.hide();
            }


            if (data) { //填充缓存数据

                if (data.needEmailCheckbox) {
                    DOM.$email_checkbox.prop('checked', true);
                    DOM.$applicantEmail.val(data.applicantEmail);
                    DOM.$email_box.show();
                }



                if (data.applicantCertType === '01') {

                    $('#for_paperNo1').show().removeAttr("disabled").val(data.for_paperNo1);
                    $('#for_paperNo_other1').hide();

                    DOM.$sex_box.hide();
                    DOM.$birth_box.hide();

                } else {

                    $('#for_paperNo1').hide();

                    $('#for_paperNo_other1').show().removeAttr("disabled").val(data.for_paperNo_other1);

                    DOM.$birth_box.show().val(data.insuredBirthdayNew);
                    DOM.$sex_box.show();

                    if (data.applicantGender === 'M') {
                        DOM.$boy.attr('checked', 'true');
                    } else {
                        DOM.$girl.attr('checked', 'true');
                    }
                }

                DOM.$groupName.val(data.groupName);
                DOM.$industryText.val(data.industryText);
                DOM.$industryCode.val(data.industryCode);
                DOM.$groupCertificateType.val(data.groupCertificateType);
                DOM.$groupCertificateNo.val(data.groupCertificateNo);
                DOM.$linkManName.val(data.linkManName);
                DOM.$linkManMobileTelephone.val(data.linkManMobileTelephone);
                DOM.$datePicker.val(data.insuredBirthdayNew);
                DOM.$applicantCertType.val(data.applicantCertType);
                DOM.$for_paperNo1.val(data.for_paperNo1);
                DOM.$for_paperNo_other1.val(data.for_paperNo_other1);
            }
        },

        initTime: function(startDate, endDate) {

            var self = this;

            self.initPageData();

            var defaultDate = '1950-01-01';
            var currentDate = tool.getFutureDate(0, 0, 0);

            var dateTitle = $('.start-date-label').text().trim();
            var dateMax = '2100-01-01';
            var dateMin = '1900-01-01';

            DOM.$datePicker.val(defaultDate); //初始化日期（即初始化input的值），插件默认为当前日期
            $('.ins_start_date').text(defaultDate);

            var applicantInfoData = JSON.parse(window.sessionStorage.getItem('applicantInfo'));

            if (applicantInfoData) {
                var recordData = applicantInfoData.applicantBirthday;

                $('#datePicker').val(recordData);
                $('.ins_start_date').text(recordData);
            }


            $('#datePicker').datetimePicker({
                title: dateTitle, //modal标题
                min: dateMin, // YYYY-MM-DD 最大最小值只比较年月日，不比较时分秒
                max: dateMax, // YYYY-MM-DD
                yearSplit: '-', //年和月之间的分隔符
                monthSplit: '-', //月和日之间的分隔符
                datetimeSplit: ' ', // 日期和时间之间的分隔符，不可为空
                times: function() { //不显示时间
                    return [];
                },
                onChange: function(picker, values, displayValues) { //回调

                    var selectMax = new Date(values.join('/')).getTime() - new Date(dateMax.split('-').join('/')).getTime();
                    var selectMin = new Date(values.join('/')).getTime() - new Date(dateMin.split('-').join('/')).getTime();
                    if (selectMax > 0 || selectMin < 0) return;
                    $('.ins_start_date').text(values.join('-'));

                }


            });
        },
        initPageData: function() {

            var productData = JSON.parse(sessionStorage.getItem('submit'));

            if (productData) {

                DOM.$loading.hide();

            } else {

                var urlParameters = JSON.parse(sessionStorage.getItem('urlParameters'));
                var url = '/icp/mobile_single_insurance/newQueryProductDetails.do';

                DOM.$loading.show();

                $.ajax({
                    url: url,
                    data: {
                        productCode: urlParameters.productCode,
                        mediaSource: urlParameters.mediaSource,
                        account: urlParameters.account
                    },
                    type: 'GET',
                    success: function(productData) {

                        productData = JSON.parse(productData);
                        if (productData.code === '00') { //成功
                            DOM.$loading.hide();

                            sessionStorage.setItem('productData', JSON.stringify(productData)); //存产品数据

                            DataSource = JSON.parse(sessionStorage.getItem('productData'));

                            var dataMap = DataSource.planInfoList[0].localProMap;

                            insuredMaxAge = parseInt(dataMap.insuredMaxAge);
                            insuredMiniAge = parseInt(dataMap.insuredMiniAge);
                            insuredLimitedSex = dataMap.insuredLimitedSex;
                            applicantMaxAge = parseInt(dataMap.applicantMaxAge);
                            applicantMiniAge = parseInt(dataMap.applicantMiniAge);
                            applicantLimitedSex = dataMap.applicantLimitedSex;
                            console.log('success.');
                        } else {
                            DOM.$loading.hide();
                            window.wAlert(productData.msg);
                        }
                    },
                    fail: function() {
                        DOM.$loading.hide();
                        console.log('reload failed');
                        window.wAlert('数据加载失败，请刷新页面');
                    },
                    error: function() {
                        DOM.$loading.hide();
                        console.log('reload failed');
                        window.wAlert('网络出错，请刷新页面');
                    }
                });
            }
            //end 渲染数据 

        }

    };
    var DataSource = JSON.parse(sessionStorage.getItem('submit'));
    if (DataSource) {
        var dataMap = DataSource;
        var insuredMaxAge = parseInt(dataMap.insuredMaxAge, 10) || 80;
        var insuredMiniAge = parseInt(dataMap.insuredMiniAge, 10) || 18;
        var insuredLimitedSex = dataMap.insuredLimitedSex || 0;
        var applicantMaxAge = parseInt(dataMap.applicantMaxAge, 10) || 80;
        var applicantMiniAge = parseInt(dataMap.applicantMiniAge, 10) || 18;
        var applicantLimitedSex = dataMap.applicantLimitedSex || 0;

    } else {

        pageManager.initPageData();
    }

    // 缓存投保人信息
    function saveApplicantInfoToSessionStorage() {

        var applicantShow = {};

        applicantShow.groupName = DOM.$groupName.val();
        //行业代码
        applicantShow.industryCode = $('#industryCode').val();
        //行业代码名称
        applicantShow.industryText = $('#industryText').val();
        // 证件类型
        applicantShow.groupCertificateType = DOM.$groupCertificateType.val();
        //证件号码
        applicantShow.groupCertificateNo = DOM.$groupCertificateNo.val();

        applicantShow.applicantName = DOM.$linkManName.val();

        // 联系人信息	
        applicantShow.linkManName = DOM.$linkManName.val();

        //姓名拼音
        applicantShow.applicantNamePY = $('#applicantNamePY').val();

        // 证件类型
        applicantShow.applicantCertType = DOM.$applicantCertType.val();

        applicantShow.applicantCertNo = DOM.$applicantCertType.val() === '01' ? DOM.$for_paperNo1.val() : DOM.$for_paperNo_other1.val();

        //身份证
        applicantShow.for_paperNo1 = DOM.$for_paperNo1.val();

        // 其它证件
        applicantShow.for_paperNo_other1 = DOM.$for_paperNo_other1.val();


        if (CONFIG.need_LinkMan_ID) {
            if ($('#applicantCertType').val() === '01') {
                var data = getSFZBirthDay(DOM.$for_paperNo1.val());
                applicantShow.insuredBirthdayNew = data.birthday;
                applicantShow.applicantBirthday = data.birthday;
                applicantShow.applicantGender = data.sex;
            } else {
                applicantShow.insuredBirthdayNew = $('#datePicker').val().trim();
                applicantShow.applicantBirthday = $('#datePicker').val().trim();
                applicantShow.applicantGender = DOM.$boy.is(':checked') ? 'M' : 'F';
            }
        }

        // 手机号码
        applicantShow.linkManMobileTelephone = DOM.$linkManMobileTelephone.val();

        // 是否发送邮件
        applicantShow.needEmailCheckbox = DOM.$email_checkbox.is(':checked') ? true : false;

        //邮箱地址
        applicantShow.applicantEmail = DOM.$applicantEmail.val();
        sessionStorage.setItem('applicantInfo', JSON.stringify(applicantShow));

    }

    // $("select[name=provience] option").not(function(){ return !this.selected }).text();
    // 是否需要显示邮箱
    DOM.$email_label.on('click', function() {

        var checked = DOM.$email_checkbox.is(':checked');
        if (checked) {
            DOM.$email_box.show();
        } else {
            DOM.$email_box.hide();
        }
    });


    $('#applicantCertType').on('change', function() {

        var selected = $(this).val();

        // 选择身份证
        if (selected === '01') {

            $('#for_paperNo1').show().removeAttr("disabled");
            $('#for_paperNo_other1').hide();
            DOM.$sex_box.hide();
            DOM.$birth_box.hide();

        } else { // 其它证件

            $('#for_paperNo1').hide();
            $('#for_paperNo_other1').show().removeAttr("disabled");
            DOM.$sex_box.hide();
            DOM.$birth_box.hide();
            pageManager.initTime();
            DOM.$sex_box.show();
            DOM.$birth_box.show();
        }

    });

    $('#nextStep').on('click', function() {

        DOM.$error.text('');

        if (CONFIG.need_group_show) {
            //团体意外 投保人信息
            if (DOM.$groupName.val().trim() === "") {
                window.wAlert('客户名称不能为空！');
                return false;
            }

            if (DOM.$groupCertificateNo.val().trim() === "") {
                window.wAlert('证件号码不能为空！');
                return false;
            }

            if ($('#industryText').val() == '') {
                window.wAlert('请选择行业分类!');
                return false;
            }
        }


        if (CONFIG.need_LinkMan_ID) {

            if (DOM.$applicantCertType.val() === "01" && DOM.$for_paperNo1.val() === "") {
                window.wAlert('联系人证件号码不能为空！');
                return false;
            }

            if (DOM.$applicantCertType.val() !== "01" && $("#for_paperNo_other1").val() === "") {
                window.wAlert('联系人证件号码不能为空！');
                return false;
            }

            if (DOM.$applicantCertType.val() === "01" && DOM.$for_paperNo1.val() !== "") {
                if (!valiateShenfenz(DOM.$for_paperNo1.val(), '1', 'error')) {
                    return false;
                }
            }

            if (DOM.$applicantCertType.val() !== "01") {
                if (!valiateOtherType(DOM.$datePicker.val(), '1', 'error')) {
                    return false;
                }
            }

            switch (applicantLimitedSex) {

                case '0':
                    break;
                case '1':
                    var data = getSFZBirthDay(DOM.$for_paperNo1.val());
                    if (DOM.$applicantCertType.val() == "01") {
                        if (data.sex === 'F') {
                            window.wAlert("投保人必须是男性");
                            return false;
                        }
                    } else {
                        if (DOM.$girl.is(':checked')) {
                            window.wAlert("投保人必须是男性");
                            return false;
                        }
                    }
                    break;
                case '2':

                    var data = getSFZBirthDay(DOM.$for_paperNo1.val());
                    if (DOM.$applicantCertType.val() == "01") {
                        if (data.sex === 'M') {
                            window.wAlert("投保人必须是女性");
                            return false;
                        }
                    } else {
                        if (DOM.$boy.is(':checked')) {
                            window.wAlert("投保人必须是女性");
                            return false;
                        }
                    }
                    break;
            }


        }



        // 联系人信息
        if (DOM.$linkManName.val() === "") {
            window.wAlert('联系人姓名不能为空！');
            return false;
        }

        if (DOM.$linkManMobileTelephone.val() === "") {
            window.wAlert('联系人电话不能为空！');
            return false;
        }

        var telNum = DOM.$linkManMobileTelephone.val();
        var emialNum = DOM.$applicantEmail.val();

        var patn = /^1(3|4|5|7|8)[0-9]\d{8}$/;
        var emailReg = /^\w+([-+_.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

        if (!patn.test(telNum)) {
            window.wAlert("您输入的手机号格式不合规范！");
            return false;
        }

        if (DOM.$email_box.css('display') === 'block') {

            if (!emailReg.test(emialNum)) {
                window.wAlert("投保人邮箱格式不正确！");
                return false;
            }
        }
        sessionStorage.removeItem("saveDatas");
        saveApplicantInfoToSessionStorage();
        window.location.href = 'insurants.html';

    });


    /* 判断身份验证 */
    function valiateShenfenz(certNo, flag, showDiv) {
        certNo = certNo.replace(/\*/g, 'X');
        var booble = valiateLegality(certNo);
        if (!booble) {
            return false;
        }
        var description = '';

        if ('1' === flag) {
            description = "投保人";

        } else if ('2' === flag) {

            description = "被保人";
        } else if (flag === '3') {

            description = "联系人";
        }

        if (certNo.length != 15 && certNo.length != 18) {
            $("#" + showDiv).text(description + "身份证不正确。（只能是15或18位）");
            return false;
        }
        var lessInsuranceAge = applicantMiniAge;
        var topInsuranceAge = applicantMaxAge;


        if (certNo.length == 15) {
            var year = "19" + certNo.substring(6, 8);
            var month = certNo.substring(8, 10);
            var day = certNo.substring(10, 12);
            if (window.DateUtil) {
                if (!validateDateRange(year, month, day, lessInsuranceAge, topInsuranceAge)) {
                    $('#' + showDiv).text(description + '必须在' + lessInsuranceAge + '到' + topInsuranceAge + '周岁之间');
                    return false;
                }
            } else {
                var date1 = (parseInt(year) + lessInsuranceAge) + "-" + month + "-" + day;
                var date3 = (parseInt(year) + topInsuranceAge) + "-" + month + "-" + day;
                var d = new Date();
                var date2 = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
                if (dateCompare(date1, date2) || dateCompare(date2, date3)) {
                    $("#" + showDiv).text(description + "必须在" + lessInsuranceAge + "到" + topInsuranceAge + "周岁之间");
                    return false;
                }
            }
        } else if (certNo.length == 18) {
            var year = certNo.substring(6, 10);
            var month = certNo.substring(10, 12);
            var day = certNo.substring(12, 14);
            if (window.DateUtil) {
                if (!validateDateRange(year, month, day, lessInsuranceAge, topInsuranceAge)) {
                    $('#' + showDiv).text(description + '必须在' + lessInsuranceAge + '到' + topInsuranceAge + '周岁之间');
                    return false;
                }
            } else {
                var date1 = (parseInt(year) + lessInsuranceAge) + "-" + month + "-" + day;
                var date3 = (parseInt(year) + topInsuranceAge) + "-" + month + "-" + day;
                var d = new Date();
                var date2 = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
                if (dateCompare(date1, date2) || dateCompare(date2, date3)) {
                    $("#" + showDiv).text(description + "必须在" + lessInsuranceAge + "到" + topInsuranceAge + "周岁之间");
                    return false;
                }
            }
        }
        return true;
    }

    // 判断身份证号码合法性
    function valiateLegality(certNo) {
        var num = certNo;
        num = num.toUpperCase();
        //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。    
        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
            window.wAlert('身份证号长度不对或者不符合规定！');
            return false;
        }
        var len, re;
        len = num.length;
        //当身份证为15位时的验证出生日期。 
        if (len == 15) {
            re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
            var arrSplit = num.match(re);
            //检查生日日期是否正确  
            var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getYear() === Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) === Number(arrSplit[3])) && (dtmBirth.getDate() === Number(arrSplit[4]));
            if (!bGoodDay) {
                window.wAlert('输入的15位身份证号里出生日期不对！');
                return false;
            }
        } else if (len === 18) { //当身份证号为18位时，校验出生日期和校验位。 
            var year = num.substr(6, 4);
            var nowDate = new Date();
            var nowYear = nowDate.getYear();
            if ((nowYear - year) > 112) {
                window.wAlert("您已经超过112岁，不能投保！");
                return false;
            }
            re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
            var arrSplit = num.match(re);
            //检查生日日期是否正确  
            var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getFullYear() === Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) === Number(arrSplit[3])) && (dtmBirth.getDate() === Number(arrSplit[4]));
            if (!bGoodDay) {
                window.wAlert('输入的18位身份证号里出生日期不对！');
                return false;
            } else {
                //检验18位身份证的校验码是否正确。  
                //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。  
                var valnum;
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0,
                    i;
                for (i = 0; i < 17; i++) {
                    nTemp += num.substr(i, 1) * arrInt[i];
                }
                valnum = arrCh[nTemp % 11];
                if (valnum !== num.substr(17, 1)) {
                    window.wAlert('18位身份证的最后一位校验码不正确！'); //应该为：' + valnum 
                    return false;
                }
            }
        }
        //验证地区是否有效 
        var aCity = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江 ",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北 ",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏 ",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外 "
        };
        if (aCity[parseInt(num.substr(0, 2))] === null) {
            window.wAlert("输入的身份证号前两位地区不对！");
            return false;
        }
        return true;
    }

    function validateDateRange(year, month, day, lessInsuranceAge, topInsuranceAge) {
        //检验规则：9个月是0岁，10岁9个月算成10岁
        //ps:safiri不支持YYYY-MM-DD　hh:mm:ss格式，只支持YYYY/MM/DD　hh:mm:ss
        var beginDate = new Date((parseInt(year) + lessInsuranceAge) + '/' + month + '/' + day + ' 23:59:59');
        var endDate = new Date((parseInt(year) + topInsuranceAge + 1) + '/' + month + '/' + day + ' 23:59:59');
        var now = new Date();
        if (!window.DateUtil.dateCompare(now, beginDate) || !window.DateUtil.dateCompare(endDate, now)) {
            return false;
        }
        return true;
    }


    // 验证其他证件类型时生日 insuredBirthdayNew
    function valiateOtherType(val, flag, msg) {
        var description = '';
        if ('1' === flag) {
            description = "投保人";

        } else if ('2' === flag) {
            description = "被保人";

        } else if ('3' === flag) {

            description = "联系人";
        }
        // "applicantMaxAge":"投保最大年龄",
        // "applicantMiniAge":"投保最小年龄",
        var lessInsuranceAge = applicantMiniAge;
        var topInsuranceAge = applicantMaxAge;


        var cui_getDataY = val.substr(0, 4);
        var cui_getDataM = parseInt(val.substr(5, 2));
        var cui_getDataD = parseInt(val.substr(8, 2));

        if (window.DateUtil) {
            if (!validateDateRange(cui_getDataY, cui_getDataM, cui_getDataD, lessInsuranceAge, topInsuranceAge)) {
                $('#' + msg).text(description + '必须在' + lessInsuranceAge + '到' + topInsuranceAge + '周岁之间');
                return false;
            }
        } else {
            var date1 = (parseInt(cui_getDataY) + lessInsuranceAge) + "-" + cui_getDataM + "-" + cui_getDataD;
            var date3 = (parseInt(cui_getDataY) + topInsuranceAge) + "-" + cui_getDataM + "-" + cui_getDataD;
            var d = new Date();
            var date2 = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            if (dateCompare(date1, date2) || dateCompare(date2, date3)) {
                $("#" + msg).text(description + "必须在" + lessInsuranceAge + "到" + topInsuranceAge + "周岁之间");
                return false;
            }
        }
        return true;
    }

    function getSFZBirthDay(iIdNo) {
        var tmpStr = "",
            data = {};
        iIdNo = $.trim(iIdNo);
        if (iIdNo.length == 15) {
            tmpStr = iIdNo.substring(6, 12);
            tmpStr = "19" + tmpStr;
            tmpStr = tmpStr.substring(0, 4) + "-" + tmpStr.substring(4, 6) + "-" + tmpStr.substring(6);
            sexStr = parseInt(iIdNo.substring(14, 1), 10) % 2 ? "M" : "F";
        } else {
            tmpStr = iIdNo.substring(6, 14);
            tmpStr = tmpStr.substring(0, 4) + "-" + tmpStr.substring(4, 6) + "-" + tmpStr.substring(6);
            sexStr = parseInt(iIdNo.substring(17, 1), 10) % 2 ? "M" : "F";
        };
        data.sex = sexStr;
        data.birthday = tmpStr;
        return data;
    };

    function dateCompare(date1, date2) {
        date1 = date1.replace(/\-/gi, "/");
        date2 = date2.replace(/\-/gi, "/");
        var time1 = new Date(date1).getTime();
        var time2 = new Date(date2).getTime();
        if (time1 >= time2) {
            return true;
        } else {
            return false;
        }
    }

    $('#for_paperNo1').on('change', function() {
        var obj = $(this).val();
        obj = obj.replace(/\*/g, 'X');
    });

    pageManager.init();

});
