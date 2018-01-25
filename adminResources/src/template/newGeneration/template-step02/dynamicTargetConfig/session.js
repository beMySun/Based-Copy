;(function() {
	'use strict';
	var backRender = {
		backRender: function() {
			// payData
			var pageData = window.sessionStorage.getItem('pageData');
			var payData = JSON.parse(window.sessionStorage.getItem('payData'));
			var applicantData = JSON.parse(window.sessionStorage.getItem('applicantData'));
			var submit = JSON.parse(window.sessionStorage.getItem('submit'));
			var $applicantDom = $('#applicantInfo');
			if (pageData && payData) {
				var insurantList = payData.insurantInfoList;
				$('#packageAmount').text(applicantData.packageAmount);
				$applicantDom.find('.to-validate-name').val(applicantData.name);
				$applicantDom.find('.certificate-type').val(applicantData.type);
				if (applicantData.type !== '01') {
					backRender.getBirdthAndSexHtml($applicantDom, applicantData);
				};
				$applicantDom.find('.to-validate-certificate').val(applicantData.typeNo);
				$applicantDom.find('.to-validate-phone').val(applicantData.phone);
				$applicantDom.find('.to-validate-email').val(applicantData.email);
				if (!submit.maxInsuredNumber || parseInt(submit.maxInsuredNumber) <= 1) {
					$('#insurantInfo h2').next().remove();
					$('#insurantInfo').append(pageData);
					var $ulDom = $('#onlyOneSelfUl');
					if (applicantData.isSelf === '0') {
						var insurantInfo = insurantList[0];
						$ulDom.find('.is-self').removeAttr('checked');
						$('.only-other-name').val(insurantInfo.name);
						$('.only-other-type').val(insurantInfo.certificateType);
						$('.only-other-no').val(insurantInfo.certificateNo);
						if (insurantInfo.certificateType !== '01') {
							backRender.getBirdthAndSexHtml($ulDom, insurantInfo);
						}
						$('.only-other-phone').val(insurantInfo.mobileTelephone);
					} else {
						$($ulDom).find('.is-self').attr('checked', 'checked');
					}
				} else if (parseInt(submit.maxInsuredNumber) > 1) {
					$('#insurantInfo h2').next().remove();
					$('.section-footer').remove();
					$('#insurantInfo').append(pageData);
					var $uls = $('#moreInsurance').find('ul');
					var len = insurantList.length;
					for (var i=0; i<len; i++) {
						$($uls[i]).find('.select-certificate-type').val(insurantList[i].relationshipWithApplicant);
						$($uls[i]).find('.to-validate-name').val(insurantList[i].name);
						$($uls[i]).find('.certificate-type').val(insurantList[i].certificateType);
						$($uls[i]).find('.to-validate-certificate').val(insurantList[i].certificateNo);
						if (insurantList[i].certificateType !== '01') {
							backRender.getBirdthAndSexHtml($($uls[i]), insurantList[i]);
						}
						$($uls[i]).find('.insurance-phone').val(insurantList[i].mobileTelephone);
						if (insurantList[i].relationshipWithApplicant === '1') {
							$($uls[i]).find('input').attr('disabled', true);
                    		$($uls[i]).find('.certificate-type').attr('disabled', true);
						}
					}
				}
			}
		},
		initBirthdayTime: function() {
            var domList = $('.form-control-birthday');
            for (var i = 0; i < domList.length; i++) {
                domList.eq(i).datetimePicker({
                    title: '选择日期',
                    yearSplit: '-',
                    monthSplit: '-',
                    datetimeSplit: ' ',
                    times: function() {
                        return [];
                    }
                });
            }
        },
		getBirdthAndSexHtml: function(dom, data) {
			dom.find('.cancel').remove();
			var html = '<li class="dynamic-item self cancel"> <div class="form-group">  <p class="form-group-label"> <span class="icon"><i class="icon-birthday"></i></span>出生日期 </p> <label> <input type="text" class="form-control form-control-birthday  to-validate  to-validate-birthday" placeholder="必填" value='+ data.birthday +'> </label> </div> </li> <li class="dynamic-item self cancel"> <div class="form-group">  <p class="form-group-label"><span class="icon"><i class="icon-sex"></i></span>性别 </p> <form> <span class="form-control-radio"><input class="to-validate to-validate-man" type="radio" name="sex" checked>男</span> <span class="form-control-radio"><input class="to-validate to-validate-woman" type="radio" name="sex">女</span> </form> </div> </li>';
			dom.find('li').eq(2).after(html);
			if (data.sexCode === 'M') {
                dom.find('.to-validate-woman').removeAttr('checked');
                dom.find('.to-validate-man').attr('checked',true) 
            } else {
                dom.find('.to-validate-man').removeAttr('checked');
                dom.find('.to-validate-woman').attr('checked',true)
            };
            backRender.initBirthdayTime();
		}
	};
	backRender.backRender();
})();