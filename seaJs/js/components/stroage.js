
define("components/stroage", [], function(require,exports, module) {

	var stroage = {
		saveApplicantInfoToSessionStorage:function() {
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
		},
		/**
		 * 保存form表单到sessionStorage
		 */
		 saveFormDataToSessionStorage:function() {
			$pElements = $('#beInsuredList').children();
			var index = 0;
			var length = $pElements.length;
			var saveData = {};
			var saveDatas = new Array(length);
			for (index = 0; index < length; index++) {
				var insurantName_show = $($pElements[index]).children('label#insurantName_show').html();
				var insurantCertNo_show = $($pElements[index]).children('input#insurantCertNo_show').val();
				var insurantName = $($pElements[index]).children('input[name=insurantName]').val();
				var insurantNamePY = $($pElements[index]).children('input[name=insurantNamePY]').val();
				var insurantCertType = $($pElements[index]).children('input[name=insurantCertType]').val();
				var insurantCertNo = $($pElements[index]).children('input[name=insurantCertNo]').val();
				var insurantCertBirthday = $($pElements[index]).children('input[name=insurantCertBirthday]').val();
				var insurantCertSex = $($pElements[index]).children('input[name=insurantCertSex]').val();
				var relationshipWithInsured = $($pElements[index]).children('input[name=relationshipWithInsured]').val();
				saveData.insurantName_show = insurantName_show;
				saveData.insurantCertNo_show = insurantCertNo_show;
				saveData.insurantName = insurantName;
				saveData.insurantNamePY = insurantNamePY;
				saveData.insurantCertType = insurantCertType;
				saveData.insurantCertNo = insurantCertNo;
				saveData.insurantCertBirthday = insurantCertBirthday;
				saveData.insurantCertSex = insurantCertSex;
				saveData.relationshipWithInsured = relationshipWithInsured;
				saveDatas[index] = saveData;
				saveData = {};
			}
			sessionStorage.setItem('saveDatas', JSON.stringify(saveDatas));
			sessionStorage.setItem('allAmount', $('#allAmount').html());
			if ($('#standardAmount').length) {
				sessionStorage.setItem('standardAmount', $('#standardAmount').html());
			}
		},

		/**
		 * 从sessionStorage中取数据并显示在页面
		 * @return {[type]} [description]
		 */
		 getDataFromSessionStorage:function() {
			var $beInsuredList = $('#beInsuredList');
			var saveDatas = sessionStorage.getItem('saveDatas');
			if (saveDatas) {
				saveDatas = JSON.parse(saveDatas);
				var index = 0;
				var length = saveDatas.length;
				count = length;
				for (index = 0; index < length; index++) {
						var pElement = '<p>'
									   + '<label id="insurantName_show" class="left color02" style="width: 75%;">' + saveDatas[index].insurantName_show + '</label>'
									   + '<input id="insurantCertNo_show" type="hidden" class="left" value="' + saveDatas[index].insurantCertNo_show + '" readonly="readonly">'
									   + '<input name="insurantName" type="hidden" value="' + saveDatas[index].insurantName + '">'
									   + '<input name="insurantNamePY" id="insurantNamePY" type="hidden" value="' + saveDatas[index].insurantNamePY + '">'
									   + '<input name="insurantCertType" type="hidden" value="' + saveDatas[index].insurantCertType + '">'
									   + '<input name="insurantCertNo" type="hidden" value="' + saveDatas[index].insurantCertNo + '">'
									   + '<input name="insurantCertBirthday" type="hidden" value="' + saveDatas[index].insurantCertBirthday + '">'
									   + '<input name="insurantCertSex" type="hidden" value="' + saveDatas[index].insurantCertSex + '">'
									   + '<input name="relationshipWithInsured" type="hidden" value="' + saveDatas[index].relationshipWithInsured + '">'
									   + '<span class="right tc" style="margin-right: 3%;"><a href="javascript:;" onclick="deleteThisRows($(this))" class="deleteThisRows">删除</a></span>';
						$($beInsuredList).append(pElement);
						if ('undefined' != typeof birthDays) {
							birthDays.push(saveDatas[index].insurantCertBirthday);
						}
						if ('undefined' != typeof sexs) {
							sexs.push(saveDatas[index].insurantCertSex);
						}
				}
				$('#allAmount').html(sessionStorage.getItem('allAmount'));
				if ($('#standardAmount').length) {
					$('#standardAmount').html(sessionStorage.getItem('standardAmount'));
				}
			}

			var gotopay = $("#gotopay");
			if ($('#isagreeinsuredbox').attr('checked')) {
				gotopay.removeAttr("disabled");
				gotopay.removeClass("submitBut_disabled");
				gotopay.addClass("submitBut");
			} else {
				gotopay.attr("disabled","disabled");
				gotopay.removeClass("submitBut");
				gotopay.addClass("submitBut_disabled");
			}
		}



	};

  module.exports = stroage;

})