(function() {
    'use strict';

    var validate = {

        validateNull: function(input, label) {
            var result = {
                isValid: true,
                msg: 'ok'
            };

            if (!input) {
                result.isValid = false;
                result.msg = (label || '') + '不能为空';
                return result;
            }

            return result;
        },

        validateName: function(name) { //姓名
            var reg = /^([a-zA-Z\u2022\u00b7]{1,30}|[\u2022\u00b7\u4e00-\u9fa5]{1,15}|[a-zA-Z\u2022\u00b7\u4e00-\u9fa5]{1,15})$/;

            var result = {
                isValid: true,
                msg: 'ok'
            };

            if (!name) {
                result.msg = '姓名不能为空';
                result.isValid = false;
            } else if (!reg.test(name)) {
                result.msg = '姓名只能输入汉字或字母';
                result.isValid = false;
            }

            return result;
        },

        validateCertificate: function(certificateNo, limitedArray) { //证件号码
            var result = {
                isValid: true,
                msg: 'ok'
            };

            if (!certificateNo) {
                result.isValid = false;
                result.msg = '证件号码不能为空';
                return result;
            }

            if (Object.prototype.toString.call(limitedArray) === '[object Array]') { //limitedArray=[minAge,maxAge,sex]
                var resultObj = validate.validateIdentification(certificateNo);
                if (!resultObj.isValid) {
                    return resultObj;
                }

                resultObj = validate.validateAgeFromIdentification(certificateNo, limitedArray[0], limitedArray[1]);
                if (!resultObj.isValid) {
                    return resultObj;
                }

                resultObj = validate.validateSexFromIdentification(certificateNo, limitedArray[2]);
                if (!resultObj.isValid) {
                    return resultObj;
                }
            }

            return result;
        },

        validateBirthday: function(val, leastAge, biggestAge) { //出生日期
            var result = {
                isValid: true,
                msg: 'ok'
            };

            if (!val) {
                result.isValid = false;
                result.msg = '出生日期不能为空';
                return result;
            }

            val = val.replace(/-/g, "/");
            var birthTime = new Date(val + " 23:59:59").getTime();
            var date = new Date(),
                y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate();
            var nowTime = new Date(y + "/" + m + "/" + d + " 23:59:59").getTime(),
                minTime = new Date(y - leastAge + "/" + m + "/" + d + " 23:59:59").getTime(),
                MaxTime = new Date(y - biggestAge + "/" + m + "/" + d + " 23:59:59").getTime(),
                nowToMax = nowTime - MaxTime,
                nowToMin = nowTime - minTime,
                nowToBirth = nowTime - birthTime;
            if (nowToBirth < nowToMin || nowToBirth > nowToMax) {
                result.isValid = false;
                result.msg = "年龄应在" + leastAge + "到" + biggestAge + "周岁之间";
                return result;
            }
            return result;
        },

        validateSex: function(sexSelected, limitSex) {
            var result = {
                isValid: true,
                msg: 'ok'
            };

            if (limitSex === '0') {
                return result;
            }

            if (sexSelected !== limitSex) {
                result.isValid = false;
                result.msg = "必须是" + (limitSex === '1' ? '男性' : '女性');
            }

            return result;
        },

        validatePhone: function(val) {
            var result = {
                isValid: true,
                msg: 'ok'
            };

            if (!val) {
                result.isValid = false;
                result.msg = '手机号码不能为空';
                return result;
            }

            var pat = /^1[3|4|5|7|8]\d{9}$/;
            if (!pat.test(val)) {
                result.isValid = false;
                result.msg = '手机号码不正确';
            }
            return result;
        },

        validateEmail: function(val) {
            var result = {
                isValid: true,
                msg: 'ok'
            };

            if (!val) {
                result.isValid = false;
                result.msg = '邮箱不能为空';
                return result;
            }

            var pat = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/g;
            if (!pat.test(val)) {
                result.isValid = false;
                result.msg = '邮箱格式不正确';
            }

            return result;
        },

        validateIdentification: function(val) { //身份证
            var result = {
                isValid: true,
                msg: 'ok'
            };

            val = val.replace(/\*/g, "X").toUpperCase();
            var pat = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
            if (!pat.test(val)) {
                result.isValid = false;
                result.msg = '身份证号长度不正确';
                return result;
            }
            var len = val.length;
            var reg, bBirth, aBirth, getBirth;
            if (len == 15) {
                getBirth = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
                aBirth = val.match(reg);
                getBirth = new Date("19" + aBirth[2] + "/" + aBirth[3] + "/" + aBirthv[4]);
                bBirth = (getBirth.getYear() == Number(aBirth[2])) && ((getBirth.getMonth() + 1) == Number(aBirth[3])) && (getBirth.getDate() == Number(aBirth[4]));
                if (!bBirth) {
                    result.isValid = false;
                    result.msg = '身份证出生日期不正确';
                    return result;
                }
            } else {
                if (len == 18) {
                    reg = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
                    aBirth = val.match(reg);
                    getBirth = new Date(aBirth[2] + "/" + aBirth[3] + "/" + aBirth[4]);
                    bBirth = (getBirth.getFullYear() == Number(aBirth[2])) && ((getBirth.getMonth() + 1) == Number(aBirth[3])) && (getBirth.getDate() == Number(aBirth[4]));
                    if (!bBirth) {
                        result.isValid = false;
                        result.msg = '身份证出生日期不正确';
                        return result;
                    } else {
                        var nTemp = 0,
                            getLast,
                            i;
                        var aInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2),
                            sLast = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
                        for (i = 0; i < 17; i++) {
                            nTemp += val.substr(i, 1) * aInt[i];
                        }
                        getLast = sLast[nTemp % 11];
                        if (getLast != val.substr(17, 1)) {
                            result.isValid = false;
                            result.msg = '身份证最后一位校验码不正确';
                            return result;
                        }
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
                23: "黑龙江",
                31: "上海",
                32: "江苏",
                33: "浙江",
                34: "安徽",
                35: "福建",
                36: "江西",
                37: "山东",
                41: "河南",
                42: "湖北",
                43: "湖南",
                44: "广东",
                45: "广西",
                46: "海南",
                50: "重庆",
                51: "四川",
                52: "贵州",
                53: "云南",
                54: "西藏",
                61: "陕西",
                62: "甘肃",
                63: "青海",
                64: "宁夏",
                65: "新疆",
                71: "台湾",
                81: "香港",
                82: "澳门",
                91: "国外"
            };
            if (!aCity[val.substr(0, 2)]) {
                result.isValid = false;
                result.msg = '身份证号前两位地区不对';
                return result;
            }
            return result;
        },

        validateAgeFromIdentification: function(val, minAge, maxAge) { //根据身份证校验年龄
            var result = {
                isValid: true,
                msg: 'ok'
            };

            var year, month, day;
            if (val.length == 15) {
                year = "19" + val.substring(6, 8);
                month = val.substring(8, 10);
                day = val.substring(10, 12)
            } else {
                if (val.length == 18) {
                    year = val.substring(6, 10);
                    month = val.substring(10, 12);
                    day = val.substring(12, 14);
                }
            }
            var birthTime = new Date(year + "/" + month + "/" + day + " 23:59:59").getTime();
            var date = new Date(),
                y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate();
            var nowTime = new Date(y + "/" + m + "/" + d + " 23:59:59").getTime(),
                minTime = new Date(y - minAge + "/" + m + "/" + d + " 23:59:59").getTime(),
                MaxTime = new Date(y - maxAge + "/" + m + "/" + d + " 23:59:59").getTime(),
                nowToMax = nowTime - MaxTime,
                nowToMin = nowTime - minTime,
                nowToBirth = nowTime - birthTime;
            if (nowToBirth < nowToMin || nowToBirth > nowToMax) {
                result.isValid = false;
                result.msg = "年龄应在" + minAge + "到" + maxAge + "周岁之间";
                return result;
            }

            return result;
        },

        validateSexFromIdentification: function(val, sex) { //根据身份证校验性别，sex：男'1'女'2'，无限制'0'
            var result = {
                isValid: true,
                msg: 'ok'
            };
            if (sex === '0') {
                return result;
            }

            var tSex, sSex;
            if (val.length == 15) {
                tSex = val.substring(13, 14);
            } else if (val.length == 18) {
                tSex = val.substring(16, 17);
            }
            if (tSex % 2 == 1) {
                sSex = "1";
            } else {
                sSex = "2";
            }

            if (sex !== sSex) {
                result.isValid = false;
                result.msg = "必须是" + (sex === '1' ? '男性' : '女性');
            }
            return result;
        },

        getBirthdayAndSexFromID: function(iIdNo) {
            var tmpStr = "",
                sexStr = '',
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
        },

        getAgeFromBirthday: function(strBirthday) {
            var returnAge;
            var strBirthdayArr = strBirthday.split("-");
            var birthYear = strBirthdayArr[0];
            var birthMonth = strBirthdayArr[1];
            var birthDay = strBirthdayArr[2];

            var d = new Date();
            var nowYear = d.getFullYear();
            var nowMonth = d.getMonth() + 1;
            var nowDay = d.getDate();

            if (nowYear == birthYear) {
                returnAge = 0; //同年 则为0岁
            } else {
                var ageDiff = nowYear - birthYear; //年之差
                if (ageDiff > 0) {
                    if (nowMonth == birthMonth) {
                        var dayDiff = nowDay - birthDay; //日之差
                        if (dayDiff < 0) {
                            returnAge = ageDiff - 1;
                        } else {
                            returnAge = ageDiff;
                        }
                    } else {
                        var monthDiff = nowMonth - birthMonth; //月之差
                        if (monthDiff < 0) {
                            returnAge = ageDiff - 1;
                        } else {
                            returnAge = ageDiff;
                        }
                    }
                } else {
                    returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
                }
            }

            return returnAge; //返回周岁年龄
        }

    };

    window.validate = validate;
})();
