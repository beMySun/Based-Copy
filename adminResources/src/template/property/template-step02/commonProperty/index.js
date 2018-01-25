(function() {
    var d = JSON.parse(sessionStorage.getItem("submit"));
    var f = parseInt(d.applicantMaxAge),
        g = parseInt(d.applicantMiniAge),
        e = d.applicantLimitedSex,
        a = d.planName;
    var b = {
        getBirthdayAndSex: function(h) {
            var i = new Object();
            var k, m, j, l;
            if (h.length == 15) {
                k = h.substring(6, 8);
                m = h.substring(8, 10);
                j = h.substring(10, 12);
                i.cBirthday = "19" + k + "-" + m + "-" + j;
                l = h.substring(13, 14)
            } else {
                if (h.length == 18) {
                    k = h.substring(6, 10);
                    m = h.substring(10, 12);
                    j = h.substring(12, 14);
                    i.cBirthday = k + "-" + m + "-" + j;
                    l = h.substring(16, 17)
                }
            }
            if (l % 2 == 1) {
                i.cSex = "M"
            } else {
                i.cSex = "F"
            }
            return i
        }
    };
    var c = {
        init: function() {
            $(".title").text(a);
            $(".loading").hide();
            var h = JSON.parse(sessionStorage.getItem("applicantInfo"));
            if (h) {
                c.render(h)
            } else {
                c.initstruc();
                c.initDateTime()
            }
        },
        render: function(h) {
            $("#applicantName").val(h.applicantName);
            $("#applicantCertType").val(h.applicantCertType);
            $("#applicantCertNo").val(h.applicantCertNo);
            if (h.applicantCertType == "01") {
                $("#birthData").hide();
                $("#sexData").hide()
            } else {
                $("#birthData").show();
                $("#applicantBirthday").val(h.applicantBirthday);
                $("#sexData").show();
                $("#boy").val() == h.applicantGender ? $("#boy").prop("checked", "true") : $("#girl").prop("checked", "true")
            }
            $("#telephone").val(h.telephone);
            if (h.needEmailCheckbox) {
                $("#email").prop("checked", "true");
                $("#show-email").show();
                $("#applicantEmail").val(h.applicantEmail)
            } else {
                $("#show-email").hide()
            }
            c.initstruc();
            c.initDateTime()
        },
        initstruc: function() {
            $("#applicantCertType").on("change", function() {
                $("#error").text("");
                if ($("#applicantCertType").val() == "01") {
                    $("#applicantCertNo").attr("placeholder", "证件号码中X用*号代替");
                    $("#birthData").hide();
                    $("#sexData").hide()
                } else {
                    $("#applicantCertNo").attr("placeholder", "请输入证件号码");
                    $("#birthData").show();
                    $("#sexData").show();
                    $("#boy").prop("checked", "true")
                }
                $("#applicantCertNo").val("")
            });
            $("#email").on("click", function() {
                if ($("#email").prop("checked")) {
                    $("#show-email").show()
                } else {
                    $("#show-email").hide();
                    $("#applicantEmail").val("")
                }
            })
        },
        initDateTime: function() {
            $("#applicantBirthday").datetimePicker({
                title: "出生日期",
                min: "1900-01-01",
                max: "2020-01-01",
                yearSplit: "-",
                monthSplit: "-",
                datetimeSplit: " ",
                times: function() {
                    return []
                },
                onChange: function(i, h, j) {}
            })
        },
        checkData: function() {
            $("#error").text("");
            if ($("#applicantName").val() == "") {
                window.wAlert("投保人姓名不能为空！");
                return false
            }
            if ($("#applicantName").val() != "") {
                if (!validate.checkName($("#applicantName").val(), $("#error"), true)) {
                    return false
                }
            }
            if ($("#applicantCertNo").val() == "") {
                window.wAlert("投保人证件号码不能为空！");
                return false
            }
            if ($("#applicantCertType").val() == "01" && $("#applicantCertNo").val() != "") {
                if (!validate.checkCertNo($("#applicantCertNo").val(), $("#error"), true)) {
                    return false
                }
                if (!validate.checkSexLimit(validate.getSex($("#applicantCertNo").val()), e, $("#error"), "1", true)) {
                    return false
                }
                if (!validate.checkCertNoAge($("#applicantCertNo").val(), "1", g, f, $("#error"), true)) {
                    return false
                }
            }
            if ($("#applicantCertType").val() != "01" && $("#applicantBirthday").val() == "") {
                window.wAlert("出生日期不应为空！");
                return false
            }
            if ($("#applicantCertType").val() != "01" && $("#applicantBirthday").val() != "") {
                if (!validate.checkOtherTypeAge($("#applicantBirthday").val(), "1", g, f, $("#error"), true)) {
                    return false
                }
            }
            if ($("#applicantCertType").val() != "01") {
                var h = $("#boy").is(":checked") ? "M" : "F";
                if (!validate.checkSexLimit(h, e, $("#error"), "1", true)) {
                    return false
                }
            }
            if ($("#telephone").val() == "") {
                window.wAlert("投保人手机号码不能为空！");
                return false
            }
            if ($("#telephone").val() != "") {
                if (!validate.checkMobile($("#telephone").val(), $("#error"), true)) {
                    return false
                }
            }
            if ($("#email").is(":checked") && $("#applicantEmail").val() == "") {
                window.wAlert("邮箱地址不应为空！");
                return false
            }
            if ($("#email").is(":checked") && $("#applicantEmail").val() != "") {
                if (!validate.checkEmail($("#applicantEmail").val(), $("#error"), true)) {
                    return false
                }
            }
            return true
        },
        saveApplicantInfoToSessionStorage: function() {
            var i = {};
            i.applicantName = $("#applicantName").val();
            i.applicantCertType = $("#applicantCertType").val();
            i.applicantCertNo = $("#applicantCertNo").val();
            if ($("#applicantCertType").val() == "01") {
                var h = b.getBirthdayAndSex($("#applicantCertNo").val());
                i.applicantBirthday = h.cBirthday;
                i.applicantGender = h.cSex
            } else {
                i.applicantBirthday = $("#applicantBirthday").val().trim();
                i.applicantGender = $("#boy").is(":checked") ? "M" : "F"
            }
            i.telephone = $("#telephone").val();
            i.needEmailCheckbox = $("#email").is(":checked") ? true : false;
            i.applicantEmail = $("#applicantEmail").val();
            sessionStorage.setItem("applicantInfo", JSON.stringify(i))
        }
    };
    c.init();
    $("#nextStep").on("click", function() {
        if (!c.checkData()) {
            return
        }
        c.saveApplicantInfoToSessionStorage();
        window.location.href = "insurants.html"
    })
})();
