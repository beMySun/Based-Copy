
$(function(){
	
	var pageManager = {
		init: function() {
			console.log('init');
			var self  = this;

			var DATA = {};

			self.resetFrom(DATA);

		},

		resetFrom: function(obj){
			var self = this;

	        $('input[name=account]').val(obj.account || '');
	        $('input[name=plansId]').val(obj.plansId || '');
	        $('input[name=productCode]').val(obj.productCode || '');
	        $('input[name=productName]').val(obj.PRODUCT_NAME || '');
	        $('input[name=insuranceBeginTime]').val(obj.insuranceBeginTime || '');
	        $('input[name=insuranceEndTime]').val(obj.insuranceEndTime || '');
	        $('input[name=oldDigestTexts]').val(obj.oldDigestTexts || '');
	        $('input[name=startDate]').val(obj.startDate || '');
	        $('input[name=endDate]').val(obj.endDate || '');

	        $('input[name=insuranceMonth]').val(obj.applicantCertType || '');
	        $('input[name=insuranceDay]').val(obj.insuranceDay || '');

	        $('input[name=topAcceptInsurAge]').val(obj.topAcceptInsurAge || '');
	        $('input[name=leastAcceptInsurAge]').val(obj.leastAcceptInsurAge || '');
	        $('input[name=insuredLimitedSex]').val(obj.insuredLimitedSex || '');
	        $('input[name=insuranceCategory]').val(obj.insuranceCategory || '');
	        $('input[name=pageView]').val(obj.pageView || '');
	        $('input[name=amount]').val(obj.amount || '');
	        $('input[name=discountAmount]').val(obj.discountAmount || '');


	        $('input[name=linkManName]').val(obj.linkManName || '');
	        $('input[name=linkManMobileTelephone]').val(obj.linkManMobileTelephone || '');
	        $('input[name=applicantCertType]').val(obj.applicantCertType || '');
	        $('input[name=applicantCertNo]').val(obj.applicantCertNo || '');

	        $('input[name=applicantBirthday]').val(obj.applicantCertNo || '');
	        $('input[name=applicantCertNo]').val(obj.applicantCertNo || '');
	        $('input[name=applicantCertNo]').val(obj.applicantCertNo || '');

	        // 团意产品
	        $('input[name=groupName]').val(obj.groupName || '');
	        $('input[name=industryCode]').val(obj.industryCode || '');
	        $('input[name=applicantSex]').val(obj.applicantSex || '');
	        $('input[name=applicantEmail]').val(obj.applicantEmail || '');


	        var userId = self.getUrlParam('userId') || '';
	        var mediaSource = self.getUrlParam('mediaSource') || '';
	        var orderNo = self.getUrlParam('orderNo') || '';
	        var callBackUrl = self.getUrlParam('callBackUrl') || '';
	        var salesManCode = self.getUrlParam('salesManCode') || '';
	        var saleCode = self.getUrlParam('saleCode') || '';
	        var applicantIdNo = self.getUrlParam('applicantIdNo') || '';
	        var recommendCode = self.getUrlParam('recommendCode') || '';
	        var currentUserRecommendCode = self.getUrlParam('currentUserRecommendCode') || '';
	        var remark = self.getUrlParam('remark') || '';

	        $('input[name=secondMediaSource]').val(decodeURIComponent(userId));
	        $('input[name=mediaSource]').val(mediaSource);
	        $('input[name=orderNo]').val(orderNo);
	        $('input[name=salesManCode]').val(salesManCode);
	        $('input[name=saleCode]').val(saleCode);
	        $('input[name=applicantIdNo]').val(decodeURIComponent(applicantIdNo));
	        $('input[name=recommendCode]').val(recommendCode);
	        $('input[name=currentUserRecommendCode]').val(currentUserRecommendCode);
	        $('input[name=remark]').val(remark);

		},
		getUrlParam:function(name) {
			var reg = new RegExp('(^|&)'+ name + '=([^&]*)(&|$)');
			 var r = window.location.search.substr(1).match(reg);
			 if (r != null)
				return unescape(r[2]);
			 return '';
		}
	}



	function saveApplicantInfoToSessionStorage() {
		var applicantShow = {};	
			applicantShow.groupName=$('#groupName').val();
			applicantShow.industryCode=$('#industryCode').val();
			applicantShow.industry=$('#industry').text();
			applicantShow.groupCertificateType=$('#groupCertificateType').val();
			applicantShow.groupCertificateNo=$('#groupCertificateNo').val();
			applicantShow.linkManName = $('#linkManName').val();
			applicantShow.applicantNamePY = $('#applicantNamePY').val();
			applicantShow.applicantCertType = $('#applicantCertType').children('option:selected').val();
			applicantShow.for_paperNo1 = $('#for-paperNo1').val();
			applicantShow.for_paperNo_other1 = $('#for-paperNo_other1').val();
			applicantShow.insuredBirthdayNew = $('#insuredBirthdayNew').val();
			applicantShow.applicantSex = $('#savepolicyholder input[name=applicantSex]').val();
			applicantShow.linkManMobileTelephone = $('#linkManMobileTelephone').val();
			applicantShow.needEmailCheckbox = $('#needEmailCheckbox').attr('checked') ? 1 : 0;
			applicantShow.applicantEmail = $('#applicantEmail').val();
			sessionStorage.setItem('applicantShow', JSON.stringify(applicantShow));

	};

	$('#email-label').on('click',function(){
        	var checked = $('#email').is(':checked');
		    if(checked){
				$('#show-email').css('display','block');
			}else{
				$('#show-email').css('display','none');
			}		
	});

	$('#nextStep').on('click', function(){
			console.log('next');
            $('#error').text('');

			if ($("#groupName").val().trim() == "") {
				$('#error').text('客户名称不能为空！');
				return false;
			}

			if ($("#groupCertificateNo").val().trim() == "") {
				$('#error').text('证件号码不能为空！');
				return false;
			}

			if ($("#linkManName").val() == "") {
				$('#error').text('联系人姓名不能为空！');
				return false;
			}

			if ($("#linkManMobileTelephone").val() == "") {
				$('#error').text('联系人电话不能为空！');
				return false;
			}
			var telNum = $("#linkManMobileTelephone").val();

			var patn = /1[3-8]+\d{9}/;

			if(!patn.test(telNum)){
				$("#error").text("您输入的手机号格式不合规范！");
				return false;
			}

			if($('#show-email').css('display') == 'block'){
				if($('#applicantEmail').val() == ''){
					$("#error").text("投保人邮箱不能为空！");
					return false;
				}
				if($("#applicantEmail").val()!=""&&($("#applicantEmail").val()).indexOf("@")<=-1){
					$("#error").text("投保人邮箱格式不正确！");
					return false;
				}
			}


			// 投保人信息
		    $('input[name=groupName]').val($('#groupName').val()); // 客户名称
			$('input[name=groupCertificateType]').val($('#groupCertificateType').val());//证件类型
			$('input[name=groupCertificateNo]').val($('#groupCertificateNo').val());

			// 联系人信息
			$('input[name=linkManName]').val($('#linkManName').val()); //姓名
			$('input[name=linkManMobileTelephone]').val($('#linkManMobileTelephone').val()); //手机号
			$('input[name=applicantEmail]').val($('#applicantEmail').val()); //邮箱

			//缓存投保人数据
			window.sessionStorage.setItem('groupName',$('#groupName').val());
			window.sessionStorage.setItem('groupCertificateType',$('#groupCertificateType').val());
			window.sessionStorage.setItem('groupCertificateNo',$('#groupCertificateNo').val());
			window.sessionStorage.setItem('linkManName',$('#linkManName').val());
			window.sessionStorage.setItem('linkManMobileTelephone',$('#linkManMobileTelephone').val());


			sessionStorage.removeItem('saveDatas');
			sessionStorage.removeItem('allAmount');
			sessionStorage.removeItem('standardAmount');

			saveApplicantInfoToSessionStorage();

			var formObj = document.getElementById('savepolicyholder');

			console.log(formObj);

			formObj.action="./addInsuredRelationship.do";
			formObj.target="_self";
			formObj.method = "post";
			//formObj.submit();		
			console.log('f')
	});
    function androidInputBugFix(){
        if (/Android/gi.test(navigator.userAgent)) {
            window.addEventListener('resize', function () {
                if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
                    window.setTimeout(function () {
                        document.activeElement.scrollIntoViewIfNeeded();
                    }, 0);
                }
            })
        }
    }
    function fastClick(){
        var supportTouch = function(){
            try {
                document.createEvent("TouchEvent");
                return true;
            } catch (e) {
                return false;
            }
        }();
        var _old$On = $.fn.on;

        $.fn.on = function(){
            if(/click/.test(arguments[0]) && typeof arguments[1] == 'function' && supportTouch){ // 只扩展支持touch的当前元素的click事件
                var touchStartY, callback = arguments[1];
                _old$On.apply(this, ['touchstart', function(e){
                    touchStartY = e.changedTouches[0].clientY;
                }]);
                _old$On.apply(this, ['touchend', function(e){
                    if (Math.abs(e.changedTouches[0].clientY - touchStartY) > 10) return;

                    e.preventDefault();
                    callback.apply(this, [e]);
                }]);
            }else{
                _old$On.apply(this, arguments);
            }
            return this;
        };
    }

	function init() {
		androidInputBugFix();
		fastClick();
		pageManager.init();
	}

	init();


});