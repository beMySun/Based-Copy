$(function() {
    var CONFIG = {
        need_group_show: false,
        need_LinkMan_ID: true
    };
    var DOM = {
        $loading: $('.loading'),
        $groupDatas: $('#groupDatas'),
        $groupName: $('#groupName'),
        $groupCertificateType: $('#groupCertificateType'),
        $groupCertificateNo: $('#groupCertificateNo'),
        $link_man_datas: $('#link_man_datas'),
        $linkManName: $('#linkManName'),
        $linkManMobileTelephone: $('#linkManMobileTelephone'),
        $applicantCertType: $('#applicantCertType'),
        $for_paperNo1: $('#for_paperNo1'),
        $for_paperNo_other1: $('#for_paperNo_other1'),
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
        getFutureDate: function(startDate, afterYear, afterMonth, afterDay) {
            var futureDate, year, month, day;
            if (arguments.length === 3) {
                afterDay = arguments[2];
                afterMonth = arguments[1];
                afterYear = arguments[0];
                startDate = new Date()
            }
            if (arguments.length === 4 && Object.prototype.toString.call(startDate) !== "[object Date]") {
                startDate = new Date()
            }
            futureDate = startDate.setFullYear(startDate.getFullYear() + afterYear);
            futureDate = new Date(futureDate);
            futureDate = futureDate.setMonth(futureDate.getMonth() + afterMonth);
            futureDate = new Date(futureDate);
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
        getUrlParam: function(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
            var r = window.location.search.substr(1).match(reg);
            if (r !== null) return unescape(r[2]);
            return ''
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
                self.initTime()
            }
            self.render(applicantInfoData)
        },
        render: function(data) {
            DOM.$boy.attr('checked', 'true');
            if (CONFIG.need_LinkMan_ID) {
                DOM.$link_man_datas.show()
            }
            if (CONFIG.need_group_show) {
                DOM.$groupDatas.show()
            } else {
                DOM.$groupDatas.hide()
            }
            if (data) {
                if (data.needEmailCheckbox) {
                    DOM.$email_checkbox.prop('checked', true);
                    DOM.$applicantEmail.val(data.applicantEmail);
                    DOM.$email_box.show()
                }
                if (data.applicantCertType === '01') {
                    $('#for_paperNo1').show().removeAttr("disabled").val(data.for_paperNo1);
                    $('#for_paperNo_other1').hide();
                    DOM.$sex_box.hide();
                    DOM.$birth_box.hide()
                } else {
                    $('#for_paperNo1').hide();
                    $('#for_paperNo_other1').show().removeAttr("disabled").val(data.for_paperNo_other1);
                    DOM.$birth_box.show().val(data.insuredBirthdayNew);
                    DOM.$sex_box.show();
                    if (data.applicantGender === 'M') {
                        DOM.$boy.attr('checked', 'true')

                    } else {
                        DOM.$girl.attr('checked', 'true')
                    }
                }
                DOM.$groupName.val(data.groupName);
                DOM.$groupCertificateType.val(data.groupCertificateType);
                DOM.$groupCertificateNo.val(data.groupCertificateNo);
                DOM.$linkManName.val(data.linkManName);
                DOM.$linkManMobileTelephone.val(data.linkManMobileTelephone);
                DOM.$datePicker.val(data.insuredBirthdayNew);
                DOM.$applicantCertType.val(data.applicantCertType);
                DOM.$for_paperNo1.val(data.for_paperNo1);
                DOM.$for_paperNo_other1.val(data.for_paperNo_other1)
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
            DOM.$datePicker.val(defaultDate);
            $('.ins_start_date').text(defaultDate);
            var applicantInfoData = JSON.parse(window.sessionStorage.getItem('applicantInfo'));
            $('#datePicker').val(defaultDate);
            $('.ins_start_date').text(defaultDate);
            if (applicantInfoData) {
                var recordData = applicantInfoData.applicantBirthday;
                $('#datePicker').val(recordData);
                $('.ins_start_date').text(recordData);
            }
            $('#datePicker').datetimePicker({
                title: dateTitle,
                min: dateMin,
                max: dateMax,
                yearSplit: '-',
                monthSplit: '-',
                datetimeSplit: ' ',
                times: function() {
                    return []
                },
                onChange: function(picker, values, displayValues) {
                    var selectMax = new Date(values.join('/')).getTime() - new Date(dateMax.split('-').join('/')).getTime();
                    var selectMin = new Date(values.join('/')).getTime() - new Date(dateMin.split('-').join('/')).getTime();
                    if (selectMax > 0 || selectMin < 0) return;
                    $('.ins_start_date').text(values.join('-'));
                }
            })
        },
        initPageData: function() {
            var productData = JSON.parse(sessionStorage.getItem('submit'));
            if (productData) {
                DOM.$loading.hide()
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
                        if (productData.code === '00') {
                            DOM.$loading.hide();
                            sessionStorage.setItem('productData', JSON.stringify(productData));
                            DataSource = JSON.parse(sessionStorage.getItem('productData'));
                            var dataMap = DataSource.planInfoList[0].localProMap;
                            insuredMaxAge = parseInt(dataMap.insuredMaxAge);
                            insuredMiniAge = parseInt(dataMap.insuredMiniAge);
                            insuredLimitedSex = dataMap.insuredLimitedSex;
                            applicantMaxAge = parseInt(dataMap.applicantMaxAge);
                            applicantMiniAge = parseInt(dataMap.applicantMiniAge);
                            applicantLimitedSex = dataMap.applicantLimitedSex;
                            console.log('success.')
                        } else {
                            DOM.$loading.hide();
                            window.wAlert(productData.msg)
                        }
                    },
                    fail: function() {
                        DOM.$loading.hide();
                        console.log('reload failed');
                        window.wAlert('数据加载失败，请刷新页面')
                    },
                    error: function() {
                        DOM.$loading.hide();
                        console.log('reload failed');
                        window.wAlert('网络出错，请刷新页面')
                    }
                })
            }
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

    function saveApplicantInfoToSessionStorage() {


        var applicantShow = {};

        applicantShow.groupName = DOM.$groupName.val();
        applicantShow.industryCode = $('#industryCode').val();
        applicantShow.industry = $('#industry').text();
        applicantShow.groupCertificateType = DOM.$groupCertificateType.val();
        applicantShow.groupCertificateNo = DOM.$groupCertificateNo.val();
        applicantShow.applicantName = DOM.$linkManName.val();
        applicantShow.linkManName = DOM.$linkManName.val();
        applicantShow.applicantNamePY = $('#applicantNamePY').val();
        applicantShow.applicantCertType = DOM.$applicantCertType.val();
        applicantShow.applicantCertNo = DOM.$applicantCertType.val() === '01' ? DOM.$for_paperNo1.val() : DOM.$for_paperNo_other1.val();
        applicantShow.for_paperNo1 = DOM.$for_paperNo1.val();
        applicantShow.for_paperNo_other1 = DOM.$for_paperNo_other1.val();

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

        applicantShow.telephone = DOM.$linkManMobileTelephone.val();
        applicantShow.needEmailCheckbox = DOM.$email_checkbox.is(':checked') ? true : false;
        applicantShow.applicantEmail = DOM.$applicantEmail.val();
        sessionStorage.setItem('applicantInfo', JSON.stringify(applicantShow));

    }
    DOM.$email_label.on('click', function() {
        var checked = DOM.$email_checkbox.is(':checked');
        if (checked) {
            DOM.$email_box.show()
        } else {
            DOM.$email_box.hide()
        }
    });
    $('#applicantCertType').on('change', function() {
        var selected = $(this).val();
        if (selected === '01') {
            $('#for_paperNo1').show().removeAttr("disabled");
            $('#for_paperNo_other1').hide();
            DOM.$sex_box.hide();
            DOM.$birth_box.hide()
        } else {
            $('#for_paperNo1').hide();
            $('#for_paperNo_other1').show().removeAttr("disabled");
            DOM.$sex_box.hide();
            DOM.$birth_box.hide();
            pageManager.initTime();
            DOM.$sex_box.show();
            DOM.$birth_box.show()
        }
    });
    $('#nextStep').on('click', function() {
        DOM.$error.text('');
        if (CONFIG.need_group_show) {
            if (DOM.$groupName.val().trim() === "") {
                window.wAlert('客户名称不能为空！');
                return false
            }
            if (DOM.$groupCertificateNo.val().trim() === "") {
                window.wAlert('证件号码不能为空！');
                return false
            }
        }
        if (DOM.$linkManName.val() === "") {
            window.wAlert('联系人姓名不能为空！');
            return false
        }
        if (DOM.$applicantCertType.val() === "01" && DOM.$for_paperNo1.val() === "") {
            window.wAlert('联系人证件号码不能为空！');
            return false
        }
        if (DOM.$applicantCertType.val() !== "01" && $("#for_paperNo_other1").val() === "") {
            window.wAlert('联系人证件号码不能为空！');
            return false
        }
        if (DOM.$applicantCertType.val() === "01" && DOM.$for_paperNo1.val() !== "") {
            if (!valiateShenfenz(DOM.$for_paperNo1.val(), '1', 'error')) {
                return false
            }
        }
        if (DOM.$applicantCertType.val() !== "01") {
            if (!valiateOtherType(DOM.$datePicker.val(), '1', 'error')) {
                return false
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

        if (DOM.$linkManMobileTelephone.val() === "") {
            window.wAlert('联系人电话不能为空！');
            return false
        }
        var telNum = DOM.$linkManMobileTelephone.val();
        var emialNum = DOM.$applicantEmail.val();
        var patn = /^1(3|4|5|7|8)[0-9]\d{8}$/;
        var emailReg = /^\w+([-+_.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (!patn.test(telNum)) {
            window.wAlert("您输入的手机号格式不合规范！");
            return false
        }
        if (DOM.$email_box.css('display') === 'block') {
            if (!emailReg.test(emialNum)) {
                window.wAlert("投保人邮箱格式不正确！");
                return false
            }
        }
        sessionStorage.removeItem("saveDatas");
        saveApplicantInfoToSessionStorage();
        window.location.href = 'insurants.html'
    });

    function valiateShenfenz(certNo, flag, showDiv) {
        certNo = certNo.replace(/\*/g, 'X');
        var booble = valiateLegality(certNo);
        if (!booble) {
            return false
        }
        var description = '';
        if ('1' === flag) {
            description = "投保人"
        } else if ('2' === flag) {
            description = "被保人"
        } else if (flag === '3') {
            description = "联系人"
        }
        if (certNo.length != 15 && certNo.length != 18) {
            $("#" + showDiv).text(description + "身份证不正确。（只能是15或18位）");
            return false
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
                    return false
                }
            } else {
                var date1 = (parseInt(year) + lessInsuranceAge) + "-" + month + "-" + day;
                var date3 = (parseInt(year) + topInsuranceAge) + "-" + month + "-" + day;
                var d = new Date();
                var date2 = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
                if (dateCompare(date1, date2) || dateCompare(date2, date3)) {
                    $("#" + showDiv).text(description + "必须在" + lessInsuranceAge + "到" + topInsuranceAge + "周岁之间");
                    return false
                }
            }
        } else if (certNo.length == 18) {
            var year = certNo.substring(6, 10);
            var month = certNo.substring(10, 12);
            var day = certNo.substring(12, 14);
            if (window.DateUtil) {
                if (!validateDateRange(year, month, day, lessInsuranceAge, topInsuranceAge)) {
                    $('#' + showDiv).text(description + '必须在' + lessInsuranceAge + '到' + topInsuranceAge + '周岁之间');
                    return false
                }
            } else {
                var date1 = (parseInt(year) + lessInsuranceAge) + "-" + month + "-" + day;
                var date3 = (parseInt(year) + topInsuranceAge) + "-" + month + "-" + day;
                var d = new Date();
                var date2 = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
                if (dateCompare(date1, date2) || dateCompare(date2, date3)) {
                    $("#" + showDiv).text(description + "必须在" + lessInsuranceAge + "到" + topInsuranceAge + "周岁之间");
                    return false
                }
            }
        }
        return true
    }

    function valiateLegality(certNo) {
        var num = certNo;
        num = num.toUpperCase();
        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
            window.wAlert('身份证号长度不对或者不符合规定！');
            return false
        }
        var len, re;
        len = num.length;
        if (len == 15) {
            re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
            var arrSplit = num.match(re);
            var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getYear() === Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) === Number(arrSplit[3])) && (dtmBirth.getDate() === Number(arrSplit[4]));
            if (!bGoodDay) {
                window.wAlert('输入的15位身份证号里出生日期不对！');
                return false
            }
        } else if (len === 18) {
            var year = num.substr(6, 4);
            var nowDate = new Date();
            var nowYear = nowDate.getYear();
            if ((nowYear - year) > 112) {
                window.wAlert("您已经超过112岁，不能投保！");
                return false
            }
            re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
            var arrSplit = num.match(re);
            var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getFullYear() === Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) === Number(arrSplit[3])) && (dtmBirth.getDate() === Number(arrSplit[4]));
            if (!bGoodDay) {
                window.wAlert('输入的18位身份证号里出生日期不对！');
                return false
            } else {
                var valnum;
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0,
                    i;
                for (i = 0; i < 17; i++) {
                    nTemp += num.substr(i, 1) * arrInt[i]
                }
                valnum = arrCh[nTemp % 11];
                if (valnum !== num.substr(17, 1)) {
                    window.wAlert('18位身份证的最后一位校验码不正确！');
                    return false
                }
            }
        }
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
            return false
        }
        return true
    }

    function validateDateRange(year, month, day, lessInsuranceAge, topInsuranceAge) {
        var beginDate = new Date((parseInt(year) + lessInsuranceAge) + '/' + month + '/' + day + ' 23:59:59');
        var endDate = new Date((parseInt(year) + topInsuranceAge + 1) + '/' + month + '/' + day + ' 23:59:59');
        var now = new Date();
        if (!window.DateUtil.dateCompare(now, beginDate) || !window.DateUtil.dateCompare(endDate, now)) {
            return false
        }
        return true
    }

    function valiateOtherType(val, flag, msg) {
        var description = '';
        if ('1' === flag) {
            description = "投保人"
        } else if ('2' === flag) {
            description = "被保人"
        } else if ('3' === flag) {
            description = "联系人"
        }

        var lessInsuranceAge = applicantMiniAge;
        var topInsuranceAge = applicantMaxAge;
        var cui_getDataY = val.substr(0, 4);
        var cui_getDataM = parseInt(val.substr(5, 2));
        var cui_getDataD = parseInt(val.substr(8, 2));

        if (window.DateUtil) {
            if (!validateDateRange(cui_getDataY, cui_getDataM, cui_getDataD, lessInsuranceAge, topInsuranceAge)) {
                $('#' + msg).text(description + '必须在' + lessInsuranceAge + '到' + topInsuranceAge + '周岁之间');
                return false
            }
        } else {
            var date1 = (parseInt(cui_getDataY) + lessInsuranceAge) + "-" + cui_getDataM + "-" + cui_getDataD;
            var date3 = (parseInt(cui_getDataY) + topInsuranceAge) + "-" + cui_getDataM + "-" + cui_getDataD;
            var d = new Date();
            var date2 = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            if (dateCompare(date1, date2) || dateCompare(date2, date3)) {
                $("#" + msg).text(description + "必须在" + lessInsuranceAge + "到" + topInsuranceAge + "周岁之间");
                return false
            }
        }
        return true
    }

    function dateCompare(date1, date2) {
        date1 = date1.replace(/\-/gi, "/");
        date2 = date2.replace(/\-/gi, "/");
        var time1 = new Date(date1).getTime();
        var time2 = new Date(date2).getTime();
        if (time1 >= time2) {
            return true
        } else {
            return false
        }
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

    $('#for_paperNo1').on('change', function() {
        var obj = $(this).val();
        obj = obj.replace(/\*/g, 'X')
    });
    pageManager.init()
});
