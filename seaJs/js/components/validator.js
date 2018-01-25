define("components/validator", [], function(require, exports, module) {

    var validator = {
        /* 判断身份验证 */
        valiateShenfenz: function(certNo, flag, showDiv) {
            var self = this;
            certNo = certNo.replace(/\*/g, 'X');
            var booble = self.valiateLegality(certNo);
            if (!booble) {
                return false;
            }
            var description = '';
            if ('1' == flag) {
                description = "投保人";
            } else if ('2' == flag) {
                description = "被保人";
            }
            if (certNo.length != 15 && certNo.length != 18) {
                $("#" + showDiv).text(description + "身份证不正确。（只能是15或18位）");
                return false;
            }
            lessInsuranceAge = parseInt($('input[name=leastAcceptInsurAge]').val());
            topInsuranceAge = parseInt($('input[name=topAcceptInsurAge]').val());
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
                    if (self.dateCompare(date1, date2) || self.dateCompare(date2, date3)) {
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
                    if (self.dateCompare(date1, date2) || self.dateCompare(date2, date3)) {
                        $("#" + showDiv).text(description + "必须在" + lessInsuranceAge + "到" + topInsuranceAge + "周岁之间");
                        return false;
                    }
                }
            }
            return true;
        },


        validateDateRange: function(year, month, day, lessInsuranceAge, topInsuranceAge) {
            //检验规则：9个月是0岁，10岁9个月算成10岁
            //ps:safiri不支持YYYY-MM-DD　hh:mm:ss格式，只支持YYYY/MM/DD　hh:mm:ss
            var beginDate = new Date((parseInt(year) + lessInsuranceAge) + '/' + month + '/' + day + ' 23:59:59');
            var endDate = new Date((parseInt(year) + topInsuranceAge + 1) + '/' + month + '/' + day + ' 23:59:59');
            var now = new Date();
            if (!self.dateCompare(now, beginDate) || !self.dateCompare(endDate, now)) {
                return false;
            }
            return true;
        },
        // 验证其他证件类型时生日 insuredBirthdayNew
        valiateOtherType: function(val, flag, msg) {
            var self = this;
            var description = '';
            if ('1' == flag) {
                description = "投保人";
            } else if ('2' == flag) {
                description = "被保人";
            }
            lessInsuranceAge = parseInt($('input[name=leastAcceptInsurAge]').val());
            topInsuranceAge = parseInt($('input[name=topAcceptInsurAge]').val());
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
                if (self.dateCompare(date1, date2) || self.dateCompare(date2, date3)) {
                    $("#" + msg).text(description + "必须在" + lessInsuranceAge + "到" + topInsuranceAge + "周岁之间");
                    return false;
                }
            }
            return true;
        },

        getCertInfoByCertNO: function(certNo) {
            var certInfo = new Object();
            if (certNo.length == 15) {
                var year = certNo.substring(4, 8);
                var month = certNo.substring(8, 10);
                var day = certNo.substring(10, 12);
                certInfo.bothday = year + "-" + month + "-" + day;
                var aSex = certNo.substring(13, 14);
                if (aSex % 2 == 1) {
                    certInfo.autoSex = 'M';
                } else {
                    certInfo.autoSex = 'F';
                }
                //certInfo.autoSex = certNo.substring(13,14);

            } else if (certNo.length == 18) {
                var year = certNo.substring(6, 10);
                var month = certNo.substring(10, 12);
                var day = certNo.substring(12, 14);
                certInfo.bothday = year + "-" + month + "-" + day;
                var aSex = certNo.substring(16, 17);
                if (aSex % 2 == 1) {
                    certInfo.autoSex = 'M';
                } else {
                    certInfo.autoSex = 'F';
                }
            }

            return certInfo;
        },
        /**
         * 检测当前添加的被保人信息是否与已有的人员信息相同
         */
        checkCertNoRepeat: function(cert, isModified) {
            var certType = cert.certType;
            var certNo = cert.certNo;
            var certTypes = $('input[name=insurantCertType]');
            var certNos = $('input[name=insurantCertNo]');
            //判断是否与被保人证件号相同
            var length = $('input[name=insurantCertType]').length;
            var index = (isModified ? 1 : 0);
            for (index; index < length; index++) {
                if (certType == certTypes[index].value && certNo == certNos[index].value) {
                    $('#vpopWinError').text('证件号码与第' + (index + 1) + '个被保人相同！');
                    return false;
                }
            }
            return true;
        },
        dateCompare: function(date1, date2) {
            date1 = date1.replace(/\-/gi, "/");
            date2 = date2.replace(/\-/gi, "/");
            var time1 = new Date(date1).getTime();
            var time2 = new Date(date2).getTime();
            if (time1 >= time2) {
                return true;
            } else {
                return false;
            }
        },
        valiateLegality: function(certNo, showDiv) {
            var num = certNo;
            num = num.toUpperCase();
            var showMessageDiv;
            if (showDiv) {
                showMessageDiv = $("#" + showDiv);
            } else {
                showMessageDiv = $("#vpopWinError").length ? $("#vpopWinError") : $('#error');
            }
            //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。    
            if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
                showMessageDiv.text('输入的身份证号长度不对，或者号码不符合规定！\n身份证号码为15位时，应全为数字，\n身份证号码为18位时，末位可以为数字或X。');
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
                bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
                if (!bGoodDay) {
                    showMessageDiv.text('输入的15位身份证号里出生日期不对！');
                    return false;
                }
            } else if (len == 18) { //当身份证号为18位时，校验出生日期和校验位。 
                var year = num.substr(6, 4);
                var nowDate = new Date();
                var nowYear = nowDate.getYear();
                if ((nowYear - year) > 112) {
                    showMessageDiv.text("依照输入的身份证出生日期截止到当前，本人已经超过112岁！");
                    return false;
                }
                re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
                var arrSplit = num.match(re);
                //检查生日日期是否正确  
                var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
                var bGoodDay;
                bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
                if (!bGoodDay) {
                    showMessageDiv.text('输入的18位身份证号里出生日期不对！');
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
                    if (valnum != num.substr(17, 1)) {
                        showMessageDiv.text('18位身份证的最后一位校验码不正确！'); //应该为：' + valnum 
                        return false;
                    }
                }
            }
            //验证地区是否有效 
            var aCity = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " }
            if (aCity[parseInt(num.substr(0, 2))] == null) {
                showMessageDiv.text("输入的身份证号前两位地区不对！");
                return false;
            }
            return true;


        }

    };

    module.exports = validator;

});