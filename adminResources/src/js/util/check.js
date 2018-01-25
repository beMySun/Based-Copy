var validate = {
    checkName: function(a, c, isAlert) {
        var b = /^([a-zA-Z\u2022\u00b7]{4,30}|[\u2022\u00b7\u4e00-\u9fa5]{2,15}|[a-zA-Z\u2022\u00b7\u4e00-\u9fa5]{4,15})$/;
        if (!b.test(a)) {
            if (isAlert) {
                window.wAlert("姓名需2-15个汉字或4-30个字母或•组成");
                return false
            }
            c.text("姓名需2-15个汉字或4-30个字母或•组成");
            return false
        }
        return true
    },
    checkMobile: function(a, c, isAlert) {
        var b = /^1[3|4|5|7|8]\d{9}$/;
        if (!b.test(a)) {
            if (isAlert) {
                window.wAlert("手机号码错误，请重新输入");
                return false
            }
            c.text("手机号码错误，请重新输入");
            return false
        }
        return true
    },
    checkEmail: function(b, c, isAlert) {
        var a = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/g;
        if (!a.test(b)) {
            if (isAlert) {
                window.wAlert("邮箱格式不正确，请重新输入");
                return false
            }
            c.text("邮箱格式不正确，请重新输入");
            return false
        }
        return true
    },
    checkIMEI: function(b, c, isAlert) {
        var a = /^[0-9A-Fa-f]{14}$|^[0-9]{15}$/;
        if (!a.test(b)) {
            if (isAlert) {
                window.wAlert("IMEI码错误，请重新输入");
                return false
            }
            c.text("IMEI码错误，请重新输入");
            return false
        }
        return true
    },
    checkCertNo: function(c, g, isAlert) {
        c = c.replace(/\*/g, "X");
        var j = c.toUpperCase();
        var l = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
        if (!l.test(j)) {
            if (isAlert) {
                window.wAlert("身份证号长度不对或者不符合规定");
                return false
            }
            g.text("身份证号长度不对或者不符合规定");
            return false
        }
        var k = j.length;
        var r, a, q, e;
        if (k == 15) {
            r = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
            q = j.match(r);
            e = new Date("19" + q[2] + "/" + q[3] + "/" + q[4]);
            a = (e.getYear() == Number(q[2])) && ((e.getMonth() + 1) == Number(q[3])) && (e.getDate() == Number(q[4]));
            if (!a) {
                if (isAlert) {
                    window.wAlert("输入的15位身份证号里出生日期不对");
                    return false
                }
                g.text("输入的15位身份证号里出生日期不对");
                return false
            }
        } else {
            if (k == 18) {
                r = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
                q = j.match(r);
                e = new Date(q[2] + "/" + q[3] + "/" + q[4]);
                a = (e.getFullYear() == Number(q[2])) && ((e.getMonth() + 1) == Number(q[3])) && (e.getDate() == Number(q[4]));
                if (!a) {
                    if (isAlert) {
                        window.wAlert("输入的18位身份证号里出生日期不对");
                        return false
                    }
                    g.text("输入的18位身份证号里出生日期不对");
                    return false
                } else {
                    var b;
                    var o = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                    var p = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
                    var n = 0,
                        h;
                    for (h = 0; h < 17; h++) {
                        n += j.substr(h, 1) * o[h]
                    }
                    b = p[n % 11];
                    if (b != j.substr(17, 1)) {
                        if (isAlert) {
                            window.wAlert("18位身份证的最后一位校验码不正确");
                            return false
                        }
                        g.text("18位身份证的最后一位校验码不正确");
                        return false
                    }
                }
            }
        }
        var f = {
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
        if (f[parseInt(j.substr(0, 2))] == null) {
            if (isAlert) {
                window.wAlert("输入的身份证号前两位地区不对");
                return false
            }
            g.text("输入的身份证号前两位地区不对");
            return false
        }
        return true
    },
    checkCertNoAge: function(c, l, p, q, h, isAlert) {
        var s;
        if ("1" == l) {
            s = "投保人"
        } else {
            if (("2" == l)) {
                s = "被保人"
            }
        }
        var n, k, o;
        if (c.length == 15) {
            n = "19" + c.substring(6, 8);
            k = c.substring(8, 10);
            o = c.substring(10, 12)
        } else {
            if (c.length == 18) {
                n = c.substring(6, 10);
                k = c.substring(10, 12);
                o = c.substring(12, 14)
            }
        }
        var j = new Date(n + "/" + k + "/" + o + " 23:59:59").getTime();
        var e = new Date();
        var y = e.getFullYear();
        var m = e.getMonth() + 1;
        var d = e.getDate();
        var r = new Date(y + "/" + m + "/" + d + " 23:59:59").getTime();
        var g = new Date(y - p + "/" + m + "/" + d + " 23:59:59").getTime();
        var b = new Date(y - q + "/" + m + "/" + d + " 23:59:59").getTime();
        var i = r - b;
        var a = r - g;
        var f = r - j;
        if (f < a || f > i) {
            if (isAlert) {
                window.wAlert(s + "的年龄必须在" + p + "到" + q + "周岁之间");
                return false
            }
            h.text(s + "的年龄必须在" + p + "到" + q + "周岁之间");
            return false
        }
        return true
    },
    checkOtherTypeAge: function(c, l, n, o, h, isAlert) {
        var q, k;
        if ("1" == l) {
            q = "投保人"
        } else {
            if (("2" == l)) {
                q = "被保人"
            }
        }
        k = c.replace(/-/g, "/");
        var j = new Date(k + " 23:59:59").getTime();
        var e = new Date();
        var y = e.getFullYear();
        var m = e.getMonth() + 1;
        var d = e.getDate();
        var p = new Date(y + "/" + m + "/" + d + " 23:59:59").getTime();
        var g = new Date(y - n + "/" + m + "/" + d + " 23:59:59").getTime();
        var b = new Date(y - o + "/" + m + "/" + d + " 23:59:59").getTime();
        var i = p - b;
        var a = p - g;
        var f = p - j;
        if (f < a || f > i) {
            if (isAlert) {
                window.wAlert(q + "的年龄必须在" + n + "到" + o + "周岁之间");
                return false
            }
            h.text(q + "的年龄必须在" + n + "到" + o + "周岁之间");
            return false
        }
        return true
    },
    checkSexLimit: function(e, b, f, a, isAlert) {
        var c;
        if ("1" == a) {
            c = "投保人"
        } else {
            if ("2" == a) {
                c = "被保人"
            }
        }
        if (b != "0") {
            if (b == "1") {
                if (e != "M") {
                    if (isAlert) {
                        window.wAlert(c + "必须是男性");
                        return false
                    }
                    f.text(c + "必须是男性");
                    return false
                }
            } else {
                if (e != "F") {
                    if (isAlert) {
                        window.wAlert(c + "必须是女性");
                        return false
                    }
                    f.text(c + "必须是女性");
                    return false
                }
            }
        }
        return true
    },
    getSex: function(a) {
        var c, b;
        if (a.length == 15) {
            c = a.substring(13, 14)
        } else {
            if (a.length == 18) {
                c = a.substring(16, 17)
            }
        }
        if (c % 2 == 1) {
            b = "M"
        } else {
            b = "F"
        }
        return b
    },
    getSFZBirthDay: function(iIdNo) {
        var tmpStr = "",
            arr = [];
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
        arr[0] = sexStr;
        arr[1] = tmpStr;
        return arr;
    },
    getAgeByIdNo: function(UUserCard) {
        var myDate = new Date();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
        if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
            age++;
        }
        return age;
    },
    getAgeByDate: function(strBirthday) {
        var returnAge;
        var strBirthdayArr = strBirthday.split("-");
        var birthYear = strBirthdayArr[0];
        var birthMonth = strBirthdayArr[1];
        var birthDay = strBirthdayArr[2];

        d = new Date();
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
    },
    getSFZBirthdayAndSex: function(iIdNo) {
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
    }

};
