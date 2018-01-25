define(function(require) {

    var $ = require("jquery"),
        FastClick = require("fastClick"),
        commonTools = require("tools/commonTools");

    var $body = $(document.body);

    var actionList = {

      	nextStep :function(){
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

			if($('#needEmail').css('display') == 'table-row'){
				if($('#applicantEmail').val() == ''){
					$("#error").text("投保人邮箱不能为空！");
					return false;
				}
				if($("#applicantEmail").val()!=""&&($("#applicantEmail").val()).indexOf("@")<=-1){
					$("#error").text("投保人邮箱格式不正确！");
					return false;
				}
			}
			sessionStorage.removeItem('saveDatas');
			sessionStorage.removeItem('allAmount');
			sessionStorage.removeItem('standardAmount');
			saveApplicantInfoToSessionStorage();

			$('.loadingDiv').show();
			var formObj = document.getElementById('savepolicyholder');

			console.log(formObj)
			// formObj.action="./addInsuredRelationship.do";
			// formObj.target="_self";
			// formObj.method = "post";
			// formObj.submit();

        },

        needEmail:function(){
        	var checked = $('#needEmailCheckbox').prop('checked');
		    if(checked){
				$('#needEmail').css('display','table-row');
			}else{
				$('#needEmail').hide();
			}
        }


    }

    $body.on('click','[data-action]',function(){

      var actionName = $(this).data('action');
      
      var action = actionList[actionName];

      if($.isFunction(action)) action();

    });

    //拓展方法
    $.extend(actionList,{

    });




    window.functions = {
    	assignmentToInput:function(val){
    		console.log(val);
    		$('input[name=applicantSex]').val(val);
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

	}



});
