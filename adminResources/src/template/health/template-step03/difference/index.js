/*var script = document.createElement('script');
script.src = 'template/health/template-step03/person/session.js';
document.querySelector('body').appendChild(script);
console.log('diff')*/

;
(function($) {
    $.vPopWin = function(options, callback) {
        var setting = {
            "content": null,
            "tit": null,
            "btn": "ok",
            "winClass": "",
            "winID": "",
            "isRemove": true,
            "fullScreen": false
        };

        var settings = $.extend(setting, options);

        if ($("#" + settings.winID).length > 0 && !settings.isRemove) {
            $("#" + settings.winID).show();
        } else {
            var $vPopWinWrap = $("<div class='vPopWin " + settings.winClass + "' id=" + settings.winID + ">" +
                "<div class='vPopWin-inner'>" +
                "<div class='vPopWin-title'>" +
                "<span class='vPopWin-title-name'>" + settings.tit + "</span>" +
                "<span class='vPopWin-title-btn'><i class='flat-icon-" + settings.btn + "'></i></span>" +
                "</div>" +
                "<div class='vPopWin-content'>" + settings.content + "</div>" +
                "</div>" +
                "</div>");

            if (options && typeof settings.content === "object") {
                $vPopWinWrap.find(".vPopWin-content").html(settings.content);
            }

            if (settings.fullScreen) {
                $vPopWinWrap.addClass("fullScreen");
            }

            $vPopWinWrap.find(".vPopWin-title-btn").click(function() {
                //callback
                if (typeof callback === "function") {
                    callback();
                }
                if (settings.isRemove) {
                    //remove
                    $vPopWinWrap.remove();
                }
                if (!settings.isRemove) {
                    //hide
                    $vPopWinWrap.hide();
                }

            });

            $("body").append($vPopWinWrap);
        }

    };
})($);

$(function() {
    window.insured = {
        init: function() {
            var that = this;
            window.count = 0;
            that.resetForm({});
            $('#mainInfo  .title').text($('#savebeinsured input[name=planName]').val());
            getDataFromSessionStorage();
            $('#clause').click(miuiProvision);
            $('#statement').click(showInsuredlincet);
            $('#gotopay').click(gotoPay);
            $('#agreed').click(agreed);
            $('#addPerson').click(addPerson);
            var saveDatas = sessionStorage.getItem('saveDatas');
            if (!saveDatas || JSON.parse(saveDatas).length == 0) {
                $('#addPerson').click()
            }
        },
        resetForm: function() {
            //todo
            var step01 = JSON.parse(sessionStorage.getItem('submit')) || {};
            var step02 = JSON.parse(sessionStorage.getItem('applicantInfo')) || {};
            var obj = $.extend(step01, step02);
            if (!obj) return;
            for (var key in obj) {
                if (typeof obj[key] == 'string' || typeof obj[key] == 'number') {
                    $('#savebeinsured').append('<input type="hidden" name="' + key + '" value="' + obj[key] + '"/>')
                };
            }
        },
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
        getUrlParam: function(name) {
            if (name != "callBackUrl") {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if (r != null)
                    return unescape(r[2]);
                return null;
            } else {
                var reg = new RegExp("(^|&)" + name + "=(.*)");
                var r = window.location.search.substr(1).match(reg);
                if (r != null)
                    return unescape(r[2]);
                return null;
            }
        }
    }
    insured.init();
})


function saveFormDataToSessionStorage() {
    $pElements = $('#beInsuredList p');
    var length = $pElements.length;
    var saveDatas = new Array(length);
    for (var i = 0; i < length; i++) {
        var obj = {};
        obj.insurantName_show = $('#beInsuredList .insurantName_show').eq(i).html();
        obj.insurantCertNo_show = $('#beInsuredList input.insurantCertNo_show').eq(i).val();
        obj.insurantName = $('#beInsuredList input[name=insurantName]').eq(i).val();
        obj.insurantNamePY = $('#beInsuredList input[name=insurantNamePY]').eq(i).val();
        obj.insurantCertType = $('#beInsuredList input[name=insurantCertType]').eq(i).val();
        obj.insurantCertNo = $('#beInsuredList input[name=insurantCertNo]').eq(i).val();
        obj.insurantCertBirthday = $.trim($('#beInsuredList input[name=insurantCertBirthday]').eq(i).val());
        obj.insurantCertSex = $('#beInsuredList input[name=insurantCertSex]').eq(i).val();
        obj.relationshipWithInsured = $('#beInsuredList input[name=relationshipWithInsured]').eq(i).val();
        saveDatas[i] = obj;
    }
    //todo
    sessionStorage.setItem('saveDatas', JSON.stringify(saveDatas));
    if ($('#standardAmount').length) {
        sessionStorage.setItem('standardAmount', $('#standardAmount').html());
    }
}

/**
 * 从sessionStorage中取数据并显示在页面
 * @return {[type]} [description]
 */
function getDataFromSessionStorage() {
    var $beInsuredList = $('#beInsuredList');

    var saveDatas = sessionStorage.getItem('saveDatas');
    if (saveDatas) {
        saveDatas = JSON.parse(saveDatas);
        var index = 0;
        var length = saveDatas.length;
        //todo
        count = length;
        for (index = 0; index < length; index++) {
            var pElement = '<p>' + '<label class="insurantName_show left color02"  style="width: 75%;">' + saveDatas[index].insurantName_show + '</label>' + '<input class="insurantCertNo_show left" type="hidden" value="' + saveDatas[index].insurantCertNo_show + '" readonly="readonly">' + '<input name="insurantName" type="hidden" value="' + saveDatas[index].insurantName + '">' + '<input name="insurantNamePY" id="insurantNamePY" type="hidden" value="' + saveDatas[index].insurantNamePY + '">' + '<input name="insurantCertType" type="hidden" value="' + saveDatas[index].insurantCertType + '">' + '<input name="insurantCertNo" type="hidden" value="' + saveDatas[index].insurantCertNo + '">' + '<input name="insurantCertBirthday" type="hidden" value="' + saveDatas[index].insurantCertBirthday + '">' + '<input name="insurantCertSex" type="hidden" value="' + saveDatas[index].insurantCertSex + '">' + '<input name="relationshipWithInsured" type="hidden" value="' + saveDatas[index].relationshipWithInsured + '">' + '<span class="right tc" ><a href="javascript:;" onclick="deleteThisRows($(this))" class="deleteThisRows">删除</a></span>';
            $($beInsuredList).append(pElement);
        }
    } else {
        count = 0;
    }
    //todo
    var standard = parseFloat($('input[name=amount]').val()) * count,
        discount = parseFloat($('input[name=discountAmount]').val()) * count;

    if (discount) {
        $('.standardAmount').text(standard);
        $('#discountAmount').text(discount);
        $('#discount').show();
        $('.payMoney').hide()
    } else {
        $('.standardAmount').text(standard);
        $('#discount').hide();
        $('.payMoney').show();
    }
}

/**
 * 检测当前添加的被保人信息是否与已有的人员信息相同
 */
function checkCertNoRepeat(cert, isModified) {
    var certType = cert.certType;
    var certNo = cert.certNo;
    var certTypes = $('input[name=insurantCertType]');
    var certNos = $('input[name=insurantCertNo]');
    //判断是否与被保人证件号相同
    var length = $('input[name=insurantCertType]').length;
    var index = (isModified ? 1 : 0);

    for (index; index < length; index++) {
        if (certType == certTypes[index].value && certNo == certNos[index].value) {
            window.wAlert('证件号码与第' + (index + 1) + '个被保人相同！');
            return false;
        }
    }
    return true;
}



function addPerson() {
    $('#error').text("");
    showAlert(1, 1);
}
// 第一次进入这个页面，页面中已经插入了投保人信息（默认的被保人），被保人的值是1，所以 n = 1 ,再次添加被保人的时候，进入（1,2）;
// showAlert(M,N)

// M ==1 , 添加被保人
//     | n == 1   (1, 1) 添加自己之外的关系
//     | n != 1   (1, *) 可以包含自己的关系

// M != 1 , 修改被保人
//     | n ==1   添加自己之外的关系
//     | n != 1  可以包含自己的关系

function showAlert(m, n) {
    $.vPopWin({
        "tit": "新增被保险人信息",
        "winID": "alertVpopWin",
        "content": '<div>' + '<table class="dataTable" style="width:100%;font-size:14px;">' + '<tr><td align="right" style="padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">家</span><span class="left tl" style="width:14px">庭</span><span class="left tl" style="width:14px">关</span><span class="left tl" style="width:14px">系</span></td><td style="padding-top:10px;padding-bottom:10px"><select id="relationshipWithInsuredVpopWin" name="relationshipWithInsuredVpopWin" class="inforinput" style="width: 91.3%;height: 2em;padding: 2px 0 2px 0px;" >' + '<option value="00" selected="selected">请选择</option>' + '<option value="22" >父母</option>' + '<option value="I" >子女</option>' + '<option value="2" >配偶</option>' + '<option value="9" >其他</option>' + '</select></td></tr>' + '<tr><td align="right" style="width: 33%;padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">姓</span><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">名</span></td><td style="padding-top:10px;padding-bottom:10px"><input type="text" name="insurantName" class="inforinput" maxlength="20" id="insurantNameVpopWin" value="" style="height: 2em; padding-left: 1px;" /></td></tr>' + '<tr><td align="right" style="padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">证</span><span class="left tl" style="width:14px">件</span><span class="left tl" style="width:14px">类</span><span class="left tl" style="width:14px">型</span></td><td style="padding-top:10px;padding-bottom:10px"><select id="insurantCertTypeVpopWin" name="insurantCertType" style="width: 91.3%;height: 2em;padding: 2px 0 2px 0px;" class="inforinput" onchange="changeType_02($(this).val(),' + "'VpopWin'" + ',$(this))">' + '<option value="01" selected="selected">身份证</option>' + '<option value="02" >护照</option>' + '<option value="03" >军官证</option>' + '<option value="05" >驾驶证</option>' + '<option value="06" >港澳回乡证或台胞证</option>' + '<option value="99" >其他</option>' + '</select></td></tr>' + '<tr><td align="right" style="padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">证</span><span class="left tc" style="width:14px">件</span><span class="left tl" style="width:14px">号</span><span class="left tl" style="width:14px">码</span></td><td style="padding-top:10px;padding-bottom:10px"> <input type="tel" class="inforinput" name="insurantCertNo" id="for-paperNoVpopWin" value=""  placeholder="证件号码中X用*号代替" maxlength="18"  onchange="fucosDate(this)" style="height: 2em; padding-left: 1px;">' + '<input type="text" id="for-paperNo_otherVpopWin"  name="insurantCertNo" maxlength="20"  disabled="disabled" style="display: none;height: 2em; padding-left: 1px;" class="inforinput" placeholder="必填"></td></tr>' + '<tr id="birthdaybox" style="display:none"><td align="right" style="width: 33%;padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">出</span><span class="left tl" style="width:14px">生</span><span class="left tl" style="width:14px">日</span><span class="left tl" style="width:14px">期</span></td><td style="padding-top:10px;padding-bottom:10px">' + '<span class="ins-date ins-start-date"></span><input class="datePicker" type="text" id="J-datePicker" readonly>' + '</td></tr>' + '<tr id="sexbox" style="display:none"><td align="right" style="width: 33%;padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">性</span><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">别</span></td><td style="padding-top:10px;padding-bottom:10px"><input type="hidden" class="inforinput" name="insurantCertSex" maxlength="20" id="insurantCertSexVpopWin" value="M" /><input name="sex" type="radio" value="M"  checked="checked" style="width:25%;height:20px;line-height:20px;margin-top: 6px;float: left;" onclick="assignmentToInput($(this).val())" /><span style="float: left;margin-top: 7px;">男</span><input name="sex" type="radio" value="F" style="width:25%;height:20px;line-height:20px;margin-top: 6px;float: left;" onclick="assignmentToInput($(this).val())" /><span style="float: left;margin-top: 7px;">女</span></td></tr>' + '</table> <div id="vpopWinError"  align="center" style="color:red;font-weight:bold;font-size:14px;margin-top:10px;" >' + '</div><table style="margin-top:10px;width:100%;height:100%;"><tr><td width="50%"><a href="javascript:;" id="cancelVpopWin" class="submitBut">取消</a></td><td width="50%"><a href="javascript:;" id="commfirVpopWin" class="submitBut">确认</a></td></tr></table></div>'
    });

    if ($("#insurantCertTypeVpopWin").val() == "01") {
        $("#for-paperNoVpopWin").show();
        $("#for-paperNoVpopWin").removeAttr("disabled");
        $("#for-paperNo_otherVpopWin").hide();
        $("#for-paperNo_otherVpopWin").attr("disabled", "disabled");
        $("#for-paperNoVpopWin").val($("#for-paperNo1").val());
    } else {
        $("#for-paperNo_otherVpopWin").show();
        $("#for-paperNoVpopWin").hide();
        $("#for-paperNo_otherVpopWin").removeAttr("disabled");
        $("#for-paperNoVpopWin").attr("disabled", "disabled");
        $("#for-paperNo_otherVpopWin").val(
            $("#for-paperNo_other1").val());
    }

    $("#commfirVpopWin").click(function() {
        if ($("#insurantNameVpopWin").val() == "") {
            window.wAlert('被保人姓名不能为空！');
            return;
        }
        if ($("#insurantCertTypeVpopWin").val() == "01" && $("#for-paperNoVpopWin").val() == "") {
            window.wAlert('被保人证件号码不能为空！');

            return;
        }
        if ($("#insurantCertTypeVpopWin").val() != "01" && $("#for-paperNo_otherVpopWin").val() == "") {
            window.wAlert('被保人证件号码不能为空！');
            return;
        }

        if ($("#insurantCertTypeVpopWin").val() == "01" && $("#for-paperNoVpopWin").val() != "") {
            if (!valiateShenfenz($("#for-paperNoVpopWin").val(), '2', 'vpopWinError')) {
                return;
            }
        }
        if ($("#insurantCertTypeVpopWin").val() != "01" && $("#for-paperNo_otherVpopWin").val()) {
            if (!valiateOtherType($('.ins-start-date').text(), '2', 'vpopWinError')) {
                return false;
            }
        }
        if ($("#insurantCertTypeVpopWin").val() == "01") {
            var zjhaoma = $("#for-paperNoVpopWin").val();
            // 获取出生日期和性别
            var certMsg = getCertInfoByCertNO(zjhaoma);
            var birthdaydate = certMsg.bothday;
            var sexdata = certMsg.autoSex;
        } else {
            var zjhaoma = $("#for-paperNo_otherVpopWin").val();
            var birthdaydate = $('.ins-start-date').text();
            var sexdata = $('#insurantCertSexVpopWin').val();
        }
        if ($("#relationshipWithInsuredVpopWin").val() == "00") {
            window.wAlert('请选择关系！');
            return;
        }

        var cert = {};
        cert.certType = $('#insurantCertTypeVpopWin').val();
        if (cert.certType == '01') {
            cert.certNo = $("#for-paperNoVpopWin").val();
        } else {
            cert.certNo = $("#for-paperNo_otherVpopWin").val();
        }
        if (!checkCertNoRepeat(cert, false)) {
            return;
        }

        var tr = $('<p>' + '<label class="insurantName_show left color02" style="width: 75%;">' + $("#insurantNameVpopWin").val() + '</label>' + '<input type="hidden" class="insurantCertNo_show left" value="' + zjhaoma + '" readonly="readonly">' + '<input name="insurantName" type="hidden" value="' + $("#insurantNameVpopWin").val() + '" />' + '<input name="insurantCertType" type="hidden" value="' + $("#insurantCertTypeVpopWin").val() + '" />' + '<input name="insurantCertNo" type="hidden" value="' + zjhaoma + '" />' + '<input name="insurantCertBirthday" type="hidden" value="' + birthdaydate + '" />' + '<input name="insurantCertSex" type="hidden" value="' + sexdata + '" />' + '<input name="relationshipWithInsured" type="hidden" value="' + $('#relationshipWithInsuredVpopWin').val() + '" />' + '<span class="right tc" ><a href="javascript:;" onclick="deleteThisRows($(this))" class="deleteThisRows">删除</a></span>' + '</p>')
        $(".beInsuredList").append(tr);
        $("#alertVpopWin").remove();
        count++;
        var edu = $('input[name=amount]').val();
        var dat = $('input[name=discountAmount]').val();
        if (dat != '') {
            $('#discountAmount').html((count) * dat);
        }
        $('.standardAmount').html((count) * edu);
    })

    $("#cancelVpopWin").click(function() {
        $("#alertVpopWin").remove();
    })

}

function changeInsuredRelationship(obj) {
    if (obj.val() == '1') {
        //当选择本人的时候。赋值
        $('#insurantNameVpopWin').val($('input[name=applicantName]').val());
        $('#insurantCertTypeVpopWin').val($('input[name=applicantCertType]').val());
        if ($('#insurantCertTypeVpopWin').val() == '1') {
            $('#for-paperNoVpopWin').val($('input[name=applicantCertNo]').val());
        } else {
            $('#for-paperNo_otherVpopWin').val($('input[name=applicantCertNo]').val());
        }
    } else {
        showAlert();
    }
}


//删除 被保人信息
function deleteThisRows(obj) {
    $(obj).parent().parent().remove();
    //todo
    count--;
    var edu = $('input[name=amount]').val();
    var dat = $('input[name=discountAmount]').val();
    if (dat != '') {
        $('#discountAmount').html((count) * dat);
    }
    $('.standardAmount').html((count) * edu);
}

// 支付
function gotoPay() {
    $('#error').text('');
    if (!$('#agreed').is(':checked')) {
        return
    }

    if (count < 1) {
        window.wAlert("被保险人最少有1个！");
        return;
    }

    var limitedSex = $('input[name=applicantLimitedSex]').val();
    var presetSex;
    if (limitedSex == '1') {
        presetSex = 'M';
    } else if (limitedSex == '2') {
        presetSex = 'F';
    } else {
        presetSex = 'N';
    }
    var judgeSex = $('#beInsuredList input[name=insurantCertSex]');
    var judgeSexLength = judgeSex.length;
    for (var i = 0; i < judgeSexLength; i++) {
        if (presetSex == 'M') {
            if (judgeSex[i].value != presetSex) {
                window.wAlert('第' + (i + 1) + '被保人必须是男性');
                return false;
            }
        } else if (presetSex == 'F') {
            if (judgeSex[i].value != presetSex) {
                window.wAlert('第' + (i + 1) + '被保人必须是女性');
                return false;
            }
        }
    }
    var judgeAge = $('input[name=insurantCertBirthday]');
    var judgeAgeLength = judgeAge.length;
    for (var index = 0; index < judgeAgeLength; index++) {
        var birthday = $(judgeAge[index]).val();
        if (!valiateOtherType(birthday, '2', 'error')) {
            return false;
        }
    }


    saveFormDataToSessionStorage();
    var formObj = document.getElementById('savebeinsured');
    formObj.action = "/icp/mobile_single_insurance/newConfirmInsurance.do";
    formObj.target = "_self";
    formObj.method = "post";
    formObj.submit();
}

function valiateLegality(certNo, showDiv) {
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
        window.wAlert('输入的身份证号长度不对，或者号码不符合规定！\n身份证号码为15位时，应全为数字，\n身份证号码为18位时，末位可以为数字或X。');
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
            window.wAlert('输入的15位身份证号里出生日期不对！');
            return false;
        }
    } else if (len == 18) { //当身份证号为18位时，校验出生日期和校验位。 
        var year = num.substr(6, 4);
        var nowDate = new Date();
        var nowYear = nowDate.getYear();
        if ((nowYear - year) > 112) {
            window.wAlert("依照输入的身份证出生日期截止到当前，本人已经超过112岁！");
            return false;
        }
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re);
        //检查生日日期是否正确  
        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
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
            if (valnum != num.substr(17, 1)) {
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
    }
    if (aCity[parseInt(num.substr(0, 2))] == null) {
        window.wAlert("输入的身份证号前两位地区不对！");
        return false;
    }
    return true;
}

function showInsuredlincet() {
    $('header #contaitentTitle').html('投保人声明');
    $('#cui_tbsm_container').html($('input[name=insuranceClause]').val());

    window.history.pushState({
        title: '#tbsm'
    }, '#tbsm', window.location.href + '#tbsm');
    window.onpopstate = function(e) {
        $('#cui_tbsm_container').html('');
        $('#sytkInfo').hide();
        $('#mainInfo').show();
    }

    $('#sytkInfo').show();
    $('#mainInfo').hide();
}

function agreed() {
    var bool = $('#agreed').is(':checked')
    var gotopay = $("#gotopay");
    if (bool) {
        gotopay.removeClass("submitBut_disabled");
        gotopay.addClass("btn-buy");
    } else {
        gotopay.removeClass("btn-buy");
        gotopay.addClass("submitBut_disabled");
    }
}

function miuiProvision() {
    var planCode = $('input[name=planCode]').val();
    var miuisProvision = document.createElement('iframe');
    var protocal = window.location.href.indexOf('https') === 0 ? 'https' : 'http';
    var urls = protocal + '://' + window.location.host + '/icp_core_dmz/web/' + planCode + '.html';
    miuisProvision.setAttribute('id', 'miuisProvision');
    document.body.appendChild(miuisProvision);
    $('#miuisProvision').attr('src', urls);
    $('header #contaitentTitle').html('保险条款');

    window.history.pushState({
        title: '#sytk'
    }, '#sytk', window.location.href + '#sytk');
    window.onpopstate = function(e) {
        document.body.removeChild(document.getElementById('miuisProvision'));
        $('#sytkInfo').hide();
        $('#mainInfo').show();
    }

    $('#sytkInfo').show();
    $('#mainInfo').hide();
}

function assignmentToInput(val) {
    $('#insurantCertSexVpopWin').val(val);
}
/* 投保人证件类型选择   */
var selectFlag;

function changeType_02(val, ids, obj) {
    var parent = obj.parent().parent().parent();
    if (val == '01') {
        parent.find("#for-paperNo" + ids).show();
        parent.find("#for-paperNo_other" + ids).hide();
        parent.find("#for-paperNo" + ids).removeAttr("disabled");
        parent.find("#for-paperNo_other" + ids)
            .attr("disabled", "disabled");
        selectFlag = 0; //选择身份证
        $("#alertVpopWin").find('#birthdaybox').hide();
        $("#alertVpopWin").find('#sexbox').hide();
    } else {
        parent.find("#for-paperNo" + ids).hide();
        parent.find("#for-paperNo_other" + ids).show();
        parent.find("#for-paperNo_other" + ids).removeAttr("disabled");
        parent.find("#for-paperNo" + ids).attr("disabled", "disabled");
        selectFlag = 1;
        $('.vPopWin-inner').css('top', '16%')
        $("#alertVpopWin").find('#birthdaybox').css('display', 'table-row');
        $("#alertVpopWin").find('#sexbox').css('display', 'table-row');
        //todo
        setPickerTime()
    }
}

function setPickerTime() {

    var currentDate = insured.getFutureDate(0, 0, 0);
    var dateTitle = '出生日期';
    if ($('input[name=topAcceptInsurAge]').length && $.trim($('input[name=topAcceptInsurAge]').val()) !== '') {
        var num = parseInt($('input[name=topAcceptInsurAge]').val()) + 1;
        var dateMin = insured.getFutureDate(-num, 0, 0);
    } else {
        var dateMin = insured.getFutureDate(-100, 0, 0);
    }
    if ($('input[name=leastAcceptInsurAge]').length && $.trim($('input[name=leastAcceptInsurAge]').val()) !== '') {
        var num = parseInt($('input[name=leastAcceptInsurAge]').val()) + 1;
        var dateMax = insured.getFutureDate(-num, 0, 0);
    } else {
        var dateMax = currentDate;
    }

    $('#J-datePicker').val(dateMax); //初始化日期（即初始化input的值），插件默认为当前日期
    $('.ins-start-date').text(dateMax);
    $('#J-datePicker').datetimePicker({
        title: dateTitle, //modal标题
        min: dateMin, // YYYY-MM-DD 最大最小值只比较年月日，不比较时分秒
        max: dateMax, // YYYY-MM-DD
        yearSplit: '-', //年和月之间的分隔符
        monthSplit: '-', //月和日之间的分隔符
        datetimeSplit: ' ', // 日期和时间之间的分隔符，不可为空
        times: function() { //不显示时间
            return []
        },
        onChange: function(picker, values, displayValues) {
            var selectMax = new Date(values.join('/')).getTime() - new Date(dateMax.split('-').join('/')).getTime();
            var selectMin = new Date(values.join('/')).getTime() - new Date(dateMin.split('-').join('/')).getTime();
            if (selectMax > 0 || selectMin < 0) return;
            $('.ins-start-date').text(values.join('-'));
        }
    });
}

function getCertInfoByCertNO(certNo) {
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
}

var submitData = JSON.parse(window.sessionStorage.getItem('submit'));

function valiateOtherType(val, flag, msg) {
    var description = '';
    if ('1' == flag) {
        description = "投保人";
    } else if ('2' == flag) {
        description = "被保人";
    }
    //todo
    // lessInsuranceAge = parseInt($('input[name=leastAcceptInsurAge]').val());
    // topInsuranceAge = parseInt($('input[name=topAcceptInsurAge]').val());

    var lessInsuranceAge = parseInt(submitData.leastAcceptInsurAge, 10) || parseInt(submitData.insuredMiniAge, 10) || 0;
    var topInsuranceAge = parseInt(submitData.topAcceptInsurAge, 10) || parseInt(submitData.topInsuranceAge, 10) || 80;

    var cui_getDataY = val.substr(0, 4);
    var cui_getDataM = parseInt(val.substr(5, 2));
    var cui_getDataD = parseInt(val.substr(8, 2));

    var date1 = (parseInt(cui_getDataY) + lessInsuranceAge) + "-" + cui_getDataM + "-" + cui_getDataD;
    var date3 = (parseInt(cui_getDataY) + topInsuranceAge) + "-" + cui_getDataM + "-" + cui_getDataD;
    var d = new Date();
    var date2 = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    if (dateCompare(date1, date2) || dateCompare(date2, date3)) {
        window.wAlert(description + "必须在" + lessInsuranceAge + "到" + topInsuranceAge + "周岁之间");
        return false;
    }
    return true;
}

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

function handleStr(str) {
    var handledStr = str < 10 ? ('0') + str : str;
    return handledStr;
}

function valiateShenfenz(certNo, flag, showDiv) {
    certNo = certNo.replace(/\*/g, 'X');
    var booble = valiateLegality(certNo);
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
        window.wAlert(description + "身份证不正确。（只能是15或18位）");
        return false;
    }

    // lessInsuranceAge = parseInt($('input[name=leastAcceptInsurAge]').val());
    // topInsuranceAge = parseInt($('input[name=topAcceptInsurAge]').val());

    var lessInsuranceAge = parseInt(submitData.leastAcceptInsurAge, 10) || parseInt(submitData.insuredMiniAge, 10) || 0;
    var topInsuranceAge = parseInt(submitData.topAcceptInsurAge, 10) || parseInt(submitData.topInsuranceAge, 10) || 80;

    if (certNo.length == 15) {
        var year = "19" + certNo.substring(6, 8);
        var month = certNo.substring(8, 10);
        var day = certNo.substring(10, 12);
        var date1 = (parseInt(year) + lessInsuranceAge) + "-" + month + "-" + day;
        var date3 = (parseInt(year) + topInsuranceAge) + "-" + month + "-" + day;
        var d = new Date();
        var date2 = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        if (dateCompare(date1, date2) || dateCompare(date2, date3)) {
            window.wAlert(description + "必须在" + lessInsuranceAge + "到" + topInsuranceAge + "周岁之间");
            return false;
        }
    } else if (certNo.length == 18) {
        var year = certNo.substring(6, 10);
        var month = certNo.substring(10, 12);
        var day = certNo.substring(12, 14);
        var date1 = (parseInt(year) + lessInsuranceAge) + "-" + month + "-" + day;
        var date3 = (parseInt(year) + topInsuranceAge) + "-" + month + "-" + day;
        var d = new Date();
        var date2 = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        if (dateCompare(date1, date2) || dateCompare(date2, date3)) {
            window.wAlert(description + "必须在" + lessInsuranceAge + "到" + topInsuranceAge + "周岁之间");
            return false;
        }
    }
    return true;
}

function fucosDate(obj) {
    obj.value = obj.value.replace(/\*/g, 'X');
}
