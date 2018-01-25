(function() {
    var c = JSON.parse(sessionStorage.getItem("submit"));
    var b = JSON.parse(sessionStorage.getItem("applicantInfo"));
    var a = {
        init: function() {
            var e = c.planName;
            $(".title").text(e);
            $(".loading").hide();
            var d = JSON.parse(sessionStorage.getItem("insurantInfo"));
            var f = "",
                g = c.discount ? c.discount : "";
            if (c) {
                if (g == "") {
                    f = c.amount
                } else {
                    f = c.discountAmount
                }
            }
            $("#show-amount").text(f);
            if (d) {
                a.renderInsurant(d)
            }
        },
        renderInsurant: function(d) {
            $("#licenseNo").val(d.licenseNo);
            $("#skeletonNo").val(d.skeletonNo);
            $("#magineNo").val(d.magineNo)
        },
        checkData: function() {
            $("#errorMain").text("");
            if ($("#licenseNo").val() == "") {
                window.wAlert("手机品牌不能为空");
                return false
            }
            if ($("#skeletonNo").val() == "") {
                window.wAlert("手机型号不能为空");
                return false
            }
            if ($("#magineNo").val() == "") {
                window.wAlert("手机IMEI码不能为空");
                return false
            }
            if ($("#magineNo").val() != "") {
                if (!validate.checkIMEI($("#magineNo").val(), $("#errorMain"), true)) {
                    return false
                }
            }
            return true
        },
        saveInsurantInfoToSessionStorage: function() {
            var d = {};
            d.relationshipWithInsured = "01";
            d.insurantName = b.applicantName;
            d.insurantCertType = b.applicantCertType;
            d.insurantCertNo = b.applicantCertNo;
            d.insurantCertBirthday = b.applicantBirthday;
            d.insurantCertSex = b.applicantGender;
            d.licenseNo = $("#licenseNo").val();
            d.skeletonNo = $("#skeletonNo").val();
            d.magineNo = $("#magineNo").val();
            sessionStorage.setItem("insurantInfo", JSON.stringify(d))
        },
        sendForm: function() {
            var d = JSON.parse(sessionStorage.getItem("insurantInfo"));
            var g = $.extend({}, c, b, d);
            var f = [];
            for (var e in g) {
                if (typeof(g[e]) == "object") {
                    continue
                }
                f.push('<input type="hidden" name="' + e + '" value="' + g[e] + '">')
            }
            inutArr = f.join("");
            $("#sendForm").append(f);
            $("#sendForm").attr({
                action: "/icp/mobile_single_insurance/newConfirmInsurance.do",
                method: "post",
                target: "_self"
            });
            $("#sendForm").submit()
        },
        announcement: function(e) {
            var g, d, h, i, j, f, k, planCode, protocal;
            switch (e) {
                case 1:
                    g = "保险条款";
                    d = "";
                    h = "#sytk";
                    j = document.createElement("iframe");
                    //        k = "https://test-iicp-dmzstg.pingan.com.cn/icp_core_dmz/web/55062.html";
                    planCode = c.planCode;
                    protocal = window.location.href.indexOf('https') === 0 ? 'https' : 'http';
                    k = protocal + '://' + window.location.host + '/icp_core_dmz/web/' + planCode + '.html';
                    j.setAttribute("id", "miuisProvision");
                    document.body.appendChild(j);
                    $("#miuisProvision").attr("src", k);
                    break;
                case 2:
                    g = "投保人声明";
                    //        d = c.insuranceClause;
                    d = c.policyHolderDeclare;
                    h = "#tbsm";
                    break
            }
            $("header #contaitentTitle").html(g);
            $("#cui_tbsm_container").html(d);
            window.history.pushState({
                title: h
            }, h, window.location.href + h);
            window.onpopstate = function(l) {
                e === 1 && document.body.removeChild(document.getElementById("miuisProvision"));
                $("#sytkInfo").hide();
                $("#mainInfo").show()
            };
            $("#sytkInfo").show();
            $("#mainInfo").hide()
        }
    };
    a.init();
    $("#isAgree").on("click", function() {
        var d = $("#gotopay").hasClass("btn-buy-disabled");
        if ($("#isAgree").prop("checked")) {
            d && $("#gotopay").removeClass("btn-buy-disabled")
        } else {
            d || $("#gotopay").addClass("btn-buy-disabled")
        }
    });
    $("#clause").on("click", function() {
        a.announcement(1)
    });
    $("#statement").on("click", function() {
        a.announcement(2)
    });
    $("#gotopay").on("click", function() {
        if (!a.checkData()) {
            return
        }
        a.saveInsurantInfoToSessionStorage();
        $("#isAgree").prop("checked") && a.sendForm()
    });
    $("#insurant-back").on("click", function() {
        sessionStorage.removeItem("insurantInfo")
    })
})();
