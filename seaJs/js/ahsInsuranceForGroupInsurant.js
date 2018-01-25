define(function(require) {

    var $ = require("jquery"),
        FastClick = require("fastClick"),
        commonTools = require("tools/commonTools");
        pinYin = require("components/pinYin"),
        dateUtils = require("components/dateUtil"),
        setDate = require("components/setDate"),
        validator = require("components/validator"),
        stroage = require("components/stroage");
        
	$(function(){
		    var $body = $(document.body);
			var count = 0;

			window.functions = {
				getSpell:function(){
					console.log('spell ');
					var $name = $.trim($('#insurantNameVpopWin').val());
			        var name = pinYin.convert($name);
			        $("#insurantNameVpopWinSpell").val(name);
				},
				changeType_02:function(val, ids, obj){
						var parent = obj.parent().parent().parent();
					if (val == '01') {
						parent.find("#for-paperNo" + ids).show();
						parent.find("#for-paperNo_other" + ids).hide();
						parent.find("#for-paperNo" + ids).removeAttr("disabled");
						parent.find("#for-paperNo_other" + ids)
								.attr("disabled", "disabled");
						selectFlag = 0;//选择身份证
						$("#alertVpopWin").find('#birthdaybox').hide();
						$("#alertVpopWin").find('#sexbox').hide();
					} else {
						parent.find("#for-paperNo" + ids).hide();
						parent.find("#for-paperNo_other" + ids).show();
						parent.find("#for-paperNo_other" + ids).removeAttr("disabled");
						parent.find("#for-paperNo" + ids).attr("disabled", "disabled");
						selectFlag = 1;
						$('.vPopWin-inner').css('top','16%')
						$("#alertVpopWin").find('#birthdaybox').css('display','table-row');
						$("#alertVpopWin").find('#sexbox').css('display','table-row');
						var birthdayControl = $('#insurantCertBirthdayVpopWin') , currentDate = new Date(new Date().getTime() + 24*60*60*1000) , curr = currentDate.getFullYear();
						var opt = {};
						opt.date = {preset : 'date'}; 
						birthdayControl.val(curr-25 + '-' + dateUtils.handleStr((currentDate.getMonth() + 1)) + '-' + dateUtils.handleStr(currentDate.getDate())).scroller('destroy').scroller($.extend(opt.date, {theme: 'default', mode: 'scroller', display: 'modal', lang: 'zh' , startYear: curr-100 , endYear: curr}));
					}

				},
				//删除 被保人信息
				deleteThisRows:function(obj) {	
					$(obj).parent().parent().remove();
					count--;
					
					var edu = $('input[name=amount]').val();
					var dat = $('input[name=discountAmount]').val();
					if(dat != ''){
						$('#allAmount').html((count)*dat);
					}else{
						$('#allAmount').html((count)*edu);
					}
					$('#standardAmount').html((count)*edu);
					
				},
				agree_02:function(obj){
					var gotopay = $("#gotopay");
					if(obj.checked){
						gotopay.removeAttr("disabled");
						gotopay.removeClass("submitBut_disabled");
						gotopay.addClass("submitBut");
					}
					else{
						gotopay.attr("disabled","disabled");
						gotopay.removeClass("submitBut");
						gotopay.addClass("submitBut_disabled");
					}
				},
				assignmentToInput:function(val){
					$('#insurantCertSexVpopWin').val(val);
				},
				fucosDate:function(obj) {
					obj.value = obj.value.replace(/\*/g, 'X');
				},

			}

			/* 进入的时候带出投保人信息  */
		   $('#insurantName_show').text($('input[name=applicantName]').val());
		   $('#insurantCertNo_show').val($('input[name=applicantCertNo]').val());
		   $('input[name=insurantName]').val($('input[name=applicantName]').val());
		   $('input[name=insurantCertType]').val($('input[name=applicantCertType]').val());
		   $('input[name=insurantCertNo]').val($('input[name=applicantCertNo]').val());
		   $('#shoInsurantCertBirthday').val($('input[name=applicantBirthday]').val());
		   $('#shoInsurantCertSex').val($('input[name=applicantSex]').val());
		   if (sessionStorage.getItem('saveDatas') && sessionStorage.getItem('allAmount')){
				stroage.getDataFromSessionStorage();
			}
			$('.loadingDiv').hide();



			$('#gotopay').on('click',function(){
				if($('#beInsuredList p').length < 3){
					$('#error').text('被投保人不得少于三人');
					return false;
				}else if($('#beInsuredList p').length > 50){
					$('#error').text('被投保人不得多于五十人');
					return false;
				}

				var limitedSex = $('input[name=applicantLimitedSex]').val();
				var presetSex;
				if(limitedSex == '1'){
					presetSex = 'M';
				}else if(limitedSex == '2'){
					presetSex = 'F';
				}else{
					presetSex = 'N';
				}
				var judgeSex = document.getElementsByName('insurantCertSex');
				var judgeSexLength = judgeSex.length;
				for(var i = 0;i<judgeSexLength;i++){
					if(presetSex == 'M'){
						if(judgeSex[i].value != presetSex){
							$('#error').text('第'+(i+1)+'被保人必须是男性');
							return false;
						}
					}else if(presetSex == 'F'){
						if(judgeSex[i].value != presetSex){
							$('#error').text('第'+(i+1)+'被保人必须是女性');
							return false;
						}
					}
				}

				var judgeAge = $('input[name=insurantCertBirthday]');
				var judgeAgeLength = judgeAge.length;
				for (var index = 0; index < judgeAgeLength; index++) {
					var birthday = $(judgeAge[index]).val();
					if (!validator.valiateOtherType(birthday, '2', 'error')) {
						return false;
					}
				}

				window.sessionStorage.removeItem("applicantData");
				stroage.saveFormDataToSessionStorage();
				$("input[name=recommendCode]").val(sessionStorage.getItem('sharedUserRecommendCode'));
				$("input[name=currentUserRecommendCode]").val(sessionStorage.getItem('currentUserRecommendCode'));

				$('.loadingDiv').show();
				$('#gotopay').attr('disabled', 'disabled');
				var formObj = document.getElementById('savebeinsured');
				formObj.action="./confirmInsurance.do";
				formObj.target="_self";
				formObj.method = "post";
				formObj.submit();
			});

			$('#shiyongTiaokuan').on('click',function(){
				var productCode = $('input[name=productCode]').val();
				var miuisProvision = document.createElement('iframe');
				var protocal = window.location.href.indexOf('https') === 0 ? 'https' : 'http';
				var urls = protocal + '://property.pingan.com/app/miuiProvision/' + productCode + '.html';
				miuisProvision.setAttribute('id', 'miuisProvision');
				document.body.appendChild(miuisProvision);
				$('#miuisProvision').attr('src', urls);
				$('header #contaitentTitle').html('保险条款');

				window.history.pushState({title: '#sytk'}, '#sytk', window.location.href + '#sytk');
				window.onpopstate = function(e) {
					document.body.removeChild(document.getElementById('miuisProvision'));
					$('#sytkInfo').hide();
					$('#mainInfo').show();
				}

				$('#sytkInfo').show();
				$('#mainInfo').hide();
			});

			$('#toubaorenState').on('click',function(){
				$('header #contaitentTitle').html('投保人声明');
				$('#cui_tbsm_container').html($('#cuiStatement').val());

				window.history.pushState({title: '#tbsm'}, '#tbsm', window.location.href + '#tbsm');
				window.onpopstate = function(e) {
					$('#cui_tbsm_container').html('');
					$('#sytkInfo').hide();
					$('#mainInfo').show();
				}

				$('#sytkInfo').show();
				$('#mainInfo').hide();
			});

			$('#addPerson').on('click',function(){
				$('#error').text("");
				var guanxi = document.getElementsByName('relationshipWithInsured');
				var guanxiLength = guanxi.length;
				var doCount;
				var guanxiA = new Array();
				var guanxiS
				for(var i=0;i<guanxiLength;i++){
					var n = guanxi[i].value;
					guanxiA.push(n);
				}
				guanxiS = guanxiA.join(',');
				//alert(guanxiS);
				if(guanxiS.indexOf('1') != -1){

					doCount = 1;

				} else {
					doCount = 2;
				}

				showAlert(1,doCount);
			});

			function showAlert(m,n) {
				if(m == 1){
					if (n == 1) {
						$.vPopWin({
							"tit" : "新增被保险人信息",
							"winID" : "alertVpopWin",
							"content" : '<div>'
								+ '<table class="dataTable" style="width:100%;font-size:14px;">'
								+ '<tr style="display:none"><td align="right" style="padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">家</span><span class="left tl" style="width:14px">庭</span><span class="left tl" style="width:14px">关</span><span class="left tl" style="width:14px">系</span></td><td style="padding-top:10px;padding-bottom:10px"><select id="relationshipWithInsuredVpopWin" name="relationshipWithInsuredVpopWin" class="inforinput" style="width: 91.3%;height: 2em;padding: 2px 0 2px 0px;" >'
								+ '<option value="00" >请选择</option>'
								+ '<option value="22" >父母</option>'
								+ '<option value="I" >子女</option>'
								+ '<option value="2" >配偶</option>'
								+ '<option value="9" selected="selected">其他</option>'
								+ '</select></td></tr>'
								+'<tr><td align="right" style="width: 33%;padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">姓</span><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">名</span></td><td style="padding-top:10px;padding-bottom:10px"><input type="text" name="insurantName" class="inforinput" maxlength="20" id="insurantNameVpopWin" onchange="getSpell($(this).val())" value="" style="height: 2em; padding-left: 1px;" /></td></tr>'
								
								+ '<tr><td align="right" style="padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">证</span><span class="left tl" style="width:14px">件</span><span class="left tl" style="width:14px">类</span><span class="left tl" style="width:14px">型</span></td><td style="padding-top:10px;padding-bottom:10px"><select id="insurantCertTypeVpopWin" name="insurantCertType" style="width: 91.3%;height: 2em;padding: 2px 0 2px 0px;" class="inforinput" onchange="functions.changeType_02($(this).val(),'
								+ "'VpopWin'"
								+ ',$(this))">'
								+ '<option value="01" selected="selected">身份证</option>'
								+ '<option value="02" >护照</option>'
								+ '<option value="03" >军官证</option>'
								+ '<option value="05" >驾驶证</option>'
								+ '<option value="06" >港澳回乡证或台胞证</option>'
								+ '<option value="99" >其他</option>'
								+ '</select></td></tr>'
								+ '<tr><td align="right" style="padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">证</span><span class="left tc" style="width:28px">件</span><span class="left tl" style="width:14px">号</span></td><td style="padding-top:10px;padding-bottom:10px"> <input type="tel" class="inforinput" name="insurantCertNo" id="for-paperNoVpopWin" value=""  placeholder="证件号码中X用*号代替" maxlength="18"  onchange="functions.fucosDate(this)" style="height: 2em; padding-left: 1px;">'
								+ '<input type="text" id="for-paperNo_otherVpopWin"  name="insurantCertNo" maxlength="20"  disabled="disabled" style="display: none;height: 2em; padding-left: 1px;" class="inforinput" placeholder="必填"></td></tr>'
								+'<tr id="birthdaybox" style="display:none"><td align="right" style="width: 33%;padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">出</span><span class="left tl" style="width:14px">生</span><span class="left tl" style="width:14px">日</span><span class="left tl" style="width:14px">期</span></td><td style="padding-top:10px;padding-bottom:10px"><input type="text" class="inforinput" name="insurantCertBirthday" maxlength="20" id="insurantCertBirthdayVpopWin" style="height: 2em; padding-left: 1px;" /></td></tr>'
								+'<tr id="sexbox" style="display:none"><td align="right" style="width: 33%;padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">性</span><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">别</span></td><td style="padding-top:10px;padding-bottom:10px"><input type="hidden" class="inforinput" name="insurantCertSex" maxlength="20" id="insurantCertSexVpopWin" value="M" /><input name="sex" type="radio" value="M"  checked="checked" style="width:25%;height:20px;line-height:20px;margin-top: 6px;float: left;" onclick="functions.assignmentToInput($(this).val())" /><span style="float: left;margin-top: 7px;">男</span><input name="sex" type="radio" value="F" style="width:25%;height:20px;line-height:20px;margin-top: 6px;float: left;" onclick="functions.assignmentToInput($(this).val())" /><span style="float: left;margin-top: 7px;">女</span></td></tr>'
								+ '</table> <div id="vpopWinError"  align="center" style="color:red;font-weight:bold;font-size:14px;margin-top:10px;" >'
								+ '</div><table style="margin-top:10px;width:100%;height:100%;"><tr><td width="50%"><input type="button"  value="取消" id="cancelVpopWin"  class="submitBut" style="border-radius:14px;border:0;width:60%;margin-left:27%;height:30px;font-size:14px;background-color:#FF7614;color:#FFF"/></td><td width="50%"><input type="button" id="commfirVpopWin" value="确认"  class="submitBut" style="width:60%;margin-left:11%;height:30px;font-size:14px;border:0;background-color:#FF7614;color:#FFF;border-radius:14px;"/></td></tr></table></div>'
						});
						$("#insurantCertTypeVpopWin").children().each(function() {
							if ($(this).val() == $("#applicantCertType").val()) {
								$(this).attr("selected", "selected");
							}
							
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
					} else {
						$.vPopWin({
							"tit" : "新增被保险人信息",
							"winID" : "alertVpopWin",
							"content" : '<div>'
								+ '<table class="dataTable" style="width:100%;font-size:14px;">'
								+ '<tr style="display:none"><td align="right" style="padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">家</span><span class="left tl" style="width:14px">庭</span><span class="left tl" style="width:14px">关</span><span class="left tl" style="width:14px">系</span></td><td style="padding-top:10px;padding-bottom:10px"><select id="relationshipWithInsuredVpopWin" name="relationshipWithInsuredVpopWin" class="inforinput" style="width: 91.3%;height: 2em;padding: 2px 0 2px 0px;" >'
								+ '<option value="00" selected="selected">请选择</option>'
								+ '<option value="1" >本人</option>'
								+ '<option value="22" >父母</option>'
								+ '<option value="I" >子女</option>'
								+ '<option value="2" >配偶</option>'
								+ '<option value="9" selected="selected">其他</option>'
								+ '</select></td></tr>'

								+'<tr><td align="right" style="width: 33%;padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">姓</span><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">名</span></td><td style="padding-top:10px;padding-bottom:10px"><input type="text" class="inforinput" name="insurantName" maxlength="20" id="insurantNameVpopWin" onchange="functions.getSpell($(this).val())" style="height: 2em; padding-left: 1px;"/></td></tr>'
								
								+'<tr><td align="right" style="width: 33%;padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">姓</span><span class="left tl" style="width:14px">名</span><span class="left tl" style="width:14px">拼</span><span class="left tl" style="width:14px">音</span></td><td style="padding-top:10px;padding-bottom:10px"><input type="text" name="insurantNameSpell" class="inforinput" maxlength="20" id="insurantNameVpopWinSpell" value="" style="height: 2em; padding-left: 1px;"  /></td></tr>'
				

								+ '<tr><td align="right" style="padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">证</span><span class="left tl" style="width:14px">件</span><span class="left tl" style="width:14px">类</span><span class="left tl" style="width:14px">型</span></td><td style="padding-top:10px;padding-bottom:10px"><select id="insurantCertTypeVpopWin" class="inforinput" name="insurantCertType" style="width: 91.3%;height: 2em;padding: 2px 0 2px 0px;" onchange="functions.changeType_02($(this).val(),'
								+ "'VpopWin'"
								+ ',$(this))">'
								+ '<option value="01" selected="selected">身份证</option>'
								+ '<option value="02" >护照</option>'
								+ '<option value="03" >军官证</option>'
								+ '<option value="05" >驾驶证</option>'
								+ '<option value="06" >港澳回乡证或台胞证</option>'
								+ '<option value="99" >其他</option>'
								+ '</select></td></tr>'
								+ '<tr><td align="right" style="padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">证</span><span class="left tc" style="width:28px">件</span><span class="left tl" style="width:14px">号</span></td><td style="padding-top:10px;padding-bottom:10px"> <input type="tel" class="inforinput" name="insurantCertNo" id="for-paperNoVpopWin" value=""  placeholder="证件号码中X用*号代替" maxlength="18" onchange="functions.fucosDate(this)" style="height: 2em; padding-left: 1px;">'
								+ '<input type="text" id="for-paperNo_otherVpopWin" class="inforinput"  name="insurantCertNo" maxlength="20"  style="display: none;height: 2em; padding-left: 1px;" placeholder="必填"></td></tr>'
								+'<tr id="birthdaybox" style="display:none"><td align="right" style="width: 33%;padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">出</span><span class="left tl" style="width:14px">生</span><span class="left tl" style="width:14px">日</span><span class="left tl" style="width:14px">期</span></td><td style="padding-top:10px;padding-bottom:10px"><input type="text" class="inforinput" name="insurantCertBirthday" maxlength="20" id="insurantCertBirthdayVpopWin" style="height: 2em; padding-left: 1px;" /></td></tr>'
								+'<tr id="sexbox" style="display:none"><td align="right" style="width: 33%;padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">性</span><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">别</span></td><td style="padding-top:10px;padding-bottom:10px"><input type="hidden" class="inforinput" name="insurantCertSex" maxlength="20" id="insurantCertSexVpopWin" value="M" /><input name="sex" class="man" type="radio" value="M"  checked="checked" style="width:25%;height:20px;line-height:20px;margin-top: 6px;float: left;" onclick="functions.assignmentToInput($(this).val())" /><span style="float: left;margin-top: 7px;">男</span><input name="sex" class="woman" type="radio" value="F" style="width:25%;height:20px;line-height:20px;margin-top: 6px;float: left;" onclick="functions.assignmentToInput($(this).val())" /><span style="float: left;margin-top: 7px;">女</span></td></tr>'
								+ '</table> <div id="vpopWinError"  align="center" style="color:red;font-weight:bold;font-size:14px;margin-top:10px;" >'
								+ '</div><table style="margin-top:10px;width:100%;height:100%;"><tr><td width="50%"><input type="button"  value="取消" id="cancelVpopWin"  class="submitBut" style="border-radius:14px;border:0;width:60%;margin-left:27%;height:30px;font-size:14px;background-color:#FF7614;color:#FFF"/></td><td width="50%"><input type="button" id="commfirVpopWin" value="确认"  class="submitBut" style="width:60%;margin-left:11%;height:30px;font-size:14px;border:0;background-color:#FF7614;color:#FFF;border-radius:14px;"/></td></tr></table></div>'
						});
					}
					$("#commfirVpopWin").click(function() {
						if ($("#insurantNameVpopWin").val() == "") {
							$("#alertVpopWin").find('#vpopWinError').text('被保人姓名不能为空！');
							return;
						}
						if ($("#insurantCertTypeVpopWin").val() == "01"
							&& $("#for-paperNoVpopWin").val() == "") {
							$("#alertVpopWin").find('#vpopWinError').text('被保人证件号码不能为空！');
							
							return;
						}
						if ($("#insurantCertTypeVpopWin").val() != "01"
							&& $("#for-paperNo_otherVpopWin").val() == "") {
							$("#alertVpopWin").find('#vpopWinError').text('被保人证件号码不能为空！');
							return;
						}
						
						if ($("#insurantCertTypeVpopWin").val() == "01"
							&& $("#for-paperNoVpopWin").val() != "") {
							if (!validator.valiateShenfenz($("#for-paperNoVpopWin").val(), '2', 'vpopWinError')) {
								return;
							}
						}
						if ($("#insurantCertTypeVpopWin").val() != "01" && $("#for-paperNo_otherVpopWin").val()){
							if(!validator.valiateOtherType($('#insurantCertBirthdayVpopWin').val(),'2','vpopWinError')){
								return false;
							}
						}
						if ($("#insurantCertTypeVpopWin").val() == "01") {
							var zjhaoma = $("#for-paperNoVpopWin").val();
							// 获取出生日期和性别
							var certMsg = validator.getCertInfoByCertNO(zjhaoma);
							var birthdaydate = certMsg.bothday;
							var sexdata = certMsg.autoSex;
						} else {
							var zjhaoma = $("#for-paperNo_otherVpopWin").val();
							var birthdaydate = $('#insurantCertBirthdayVpopWin').val();
							var sexdata = $('#insurantCertSexVpopWin').val();
						}
						if ($("#relationshipWithInsuredVpopWin").val() == "00") {
							$("#alertVpopWin").find('#vpopWinError').text('请选择关系！');
							return;
						}

						var cert = {};
						cert.certType = $('#insurantCertTypeVpopWin').val();
						if (cert.certType == '01') {
							cert.certNo = $("#for-paperNoVpopWin").val();
						} else {
							cert.certNo = $("#for-paperNo_otherVpopWin").val();
						}
						if (!validator.checkCertNoRepeat(cert, false)) {
							return;
						}

						var tr = $('<p>'
								+'<label id="insurantName_show" class="left color02" style="width: 75%;">'
								+$("#insurantNameVpopWin").val()
								+'</label>'
								+'<input id="insurantCertNo_show" type="hidden" class="left" value="'
								+zjhaoma
								+'" readonly="readonly">'
								+'<input name="insurantName" type="hidden" value="'+$("#insurantNameVpopWin").val()+'" />'
								+'<input name="insurantCertType" type="hidden" value="'+$("#insurantCertTypeVpopWin").val()+'" />'
								+'<input name="insurantCertNo" type="hidden" value="'+zjhaoma+'" />'
								+'<input name="insurantCertBirthday" type="hidden" value="'+birthdaydate+'" />'
								+'<input name="insurantCertSex" type="hidden" value="'+sexdata+'" />'
								+'<input name="relationshipWithInsured" type="hidden" value="'+$('#relationshipWithInsuredVpopWin').val()+'" />'
								+'<span class="right tc" style="margin-right: 3%;"><a href="javascript:;" onclick="functions.deleteThisRows($(this))" class="deleteThisRows">删除</a></span>'
								+'</p>')
								$(".contentnertimeer_2").append(tr);
						$("#alertVpopWin").remove();
						
						count++;
						var edu = $('input[name=amount]').val();
						var dat = $('input[name=discountAmount]').val();
						if(dat != ''){
							$('#allAmount').html((count)*dat);
						}else{
							$('#allAmount').html((count)*edu);
						}
						$('#standardAmount').html((count)*edu);
						
					})
				}else{
					if (n == 1) {
						$.vPopWin({
							"tit" : "新增被保险人信息",
							"winID" : "alertVpopWin",
							"content" : '<div>'
								+ '<table class="dataTable" style="width:100%;font-size:14px;">'
								+ '<tr style="display:none"><td align="right" style="padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">家</span><span class="left tl" style="width:14px">庭</span><span class="left tl" style="width:14px">关</span><span class="left tl" style="width:14px">系</span></td><td style="padding-top:10px;padding-bottom:10px"><select id="relationshipWithInsuredVpopWin" name="relationshipWithInsuredVpopWin" class="inforinput" style="width: 91.3%;height: 2em;padding: 2px 0 2px 0px;" >'
								+ '<option value="00" >请选择</option>'
								//+ '<option value="1" >本人</option>'
								+ '<option value="22" >父母</option>'
								+ '<option value="I" >子女</option>'
								+ '<option value="2" >配偶</option>'
								+ '<option value="9" selected="selected">其他</option>'
								+ '</select></td></tr>'
								+'<tr><td align="right" style="width: 33%;padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">姓</span><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">名</span></td><td style="padding-top:10px;padding-bottom:10px"><input type="text" name="insurantName" class="inforinput" maxlength="20" id="insurantNameVpopWin" onchange="getSpell($(this).val())" value="" style="height: 2em; padding-left: 1px;"/></td></tr>'
								+ '<tr><td align="right" style="padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">证</span><span class="left tl" style="width:14px">件</span><span class="left tl" style="width:14px">类</span><span class="left tl" style="width:14px">型</span></td><td style="padding-top:10px;padding-bottom:10px"><select id="insurantCertTypeVpopWin" name="insurantCertType" style="width: 91.3%;height: 2em;padding: 2px 0 2px 0px;" class="inforinput" onchange="functions.changeType_02($(this).val(),'
								+ "'VpopWin'"
								+ ',$(this))">'
								+ '<option value="01" selected="selected">身份证</option>'
								+ '<option value="02" >护照</option>'
								+ '<option value="03" >军官证</option>'
								+ '<option value="05" >驾驶证</option>'
								+ '<option value="06" >港澳回乡证或台胞证</option>'
								+ '<option value="99" >其他</option>'
								+ '</select></td></tr>'
								+ '<tr><td align="right" style="padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">证</span><span class="left tc" style="width:28px">件</span><span class="left tl" style="width:14px">号</span></td><td style="padding-top:10px;padding-bottom:10px"> <input type="tel" class="inforinput" name="insurantCertNo" id="for-paperNoVpopWin" value=""  placeholder="证件号码中X用*号代替" maxlength="18"  onchange="functions.fucosDate(this)" style="height: 2em; padding-left: 1px;">'
								+ '<input type="text" id="for-paperNo_otherVpopWin"  name="insurantCertNo" maxlength="20"  disabled="disabled" style="display: none;height: 2em; padding-left: 1px;" class="inforinput" placeholder="必填"></td></tr>'
								+'<tr id="birthdaybox" style="display:none"><td align="right" style="width: 33%;padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">出</span><span class="left tl" style="width:14px">生</span><span class="left tl" style="width:14px">日</span><span class="left tl" style="width:14px">期</span></td><td style="padding-top:10px;padding-bottom:10px"><input type="text" class="inforinput" name="insurantCertBirthday" maxlength="20" id="insurantCertBirthdayVpopWin" style="height: 2em; padding-left: 1px;" /></td></tr>'
								+'<tr id="sexbox" style="display:none"><td align="right" style="width: 33%;padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">性</span><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">别</span></td><td style="padding-top:10px;padding-bottom:10px"><input type="hidden" class="inforinput" name="insurantCertSex" maxlength="20" id="insurantCertSexVpopWin" value="M" /><input name="sex" type="radio" value="M"  checked="checked" style="width:25%;height:20px;line-height:20px;margin-top: 6px;float: left;" onclick="functions.assignmentToInput($(this).val())" /><span style="float: left;margin-top: 7px;">男</span><input name="sex" type="radio" value="F" style="width:25%;height:20px;line-height:20px;margin-top: 6px;float: left;" onclick="functions.assignmentToInput($(this).val())" /><span style="float: left;margin-top: 7px;">女</span></td></tr>'
								+ '</table> <div id="vpopWinError"  align="center" style="color:red;font-weight:bold;font-size:14px;margin-top:10px;" >'
								+ '</div><table style="margin-top:10px;width:100%;height:100%;"><tr><td width="50%"><input type="button"  value="取消" id="cancelVpopWin"  class="submitBut" style="border-radius:14px;border:0;width:60%;margin-left:27%;height:30px;font-size:14px;background-color:#FF7614;color:#FFF"/></td><td width="50%"><input type="button" id="commfirVpopWin" value="确认"  class="submitBut" style="width:60%;margin-left:11%;height:30px;font-size:14px;border:0;background-color:#FF7614;color:#FFF;border-radius:14px;"/></td></tr></table></div>'
						});
						$("#insurantCertTypeVpopWin").children().each(function() {
							if ($(this).val() == $("#applicantCertType").val()) {
								$(this).attr("selected", "selected");
							}
							
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
					} else {
						$.vPopWin({
							"tit" : "新增被保险人信息",
							"winID" : "alertVpopWin",
							"content" : '<div>'
								+ '<table class="dataTable" style="width:100%;font-size:14px;">'
								+ '<tr style="display:none"><td align="right" style="padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">家</span><span class="left tl" style="width:14px">庭</span><span class="left tl" style="width:14px">关</span><span class="left tl" style="width:14px">系</span></td><td style="padding-top:10px;padding-bottom:10px"><select id="relationshipWithInsuredVpopWin" name="relationshipWithInsuredVpopWin" class="inforinput" style="width: 91.3%;height: 2em;padding: 2px 0 2px 0px;" >'
								+ '<option value="00" selected="selected">请选择</option>'
								+ '<option value="1" >本人</option>'
								+ '<option value="22" >父母</option>'
								+ '<option value="I" >子女</option>'
								+ '<option value="2" >配偶</option>'
								+ '<option value="9" selected="selected">其他</option>'
								+ '</select></td></tr>'
								+'<tr><td align="right" style="width: 33%;padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">姓</span><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">名</span></td><td style="padding-top:10px;padding-bottom:10px"><input type="text" style="height: 2em; padding-left: 1px;" class="inforinput" name="insurantName" maxlength="20" id="insurantNameVpopWin" onchange="getSpell($(this).val())"/></td></tr>'
								+ '<tr><td align="right" style="padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">证</span><span class="left tl" style="width:14px">件</span><span class="left tl" style="width:14px">类</span><span class="left tl" style="width:14px">型</span></td><td style="padding-top:10px;padding-bottom:10px"><select id="insurantCertTypeVpopWin" class="inforinput" name="insurantCertType" style="width: 91.3%;height: 2em;padding: 2px 0 2px 0px;" onchange="functions.changeType_02($(this).val(),'
								+ "'VpopWin'"
								+ ',$(this))">'
								+ '<option value="01" selected="selected">身份证</option>'
								+ '<option value="02" >护照</option>'
								+ '<option value="03" >军官证</option>'
								+ '<option value="05" >驾驶证</option>'
								+ '<option value="06" >港澳回乡证或台胞证</option>'
								+ '<option value="99" >其他</option>'
								+ '</select></td></tr>'
								+ '<tr><td align="right" style="padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">证</span><span class="left tc" style="width:28px">件</span><span class="left tl" style="width:14px">号</span></td><td style="padding-top:10px;padding-bottom:10px"> <input type="tel" class="inforinput" style="height: 2em; padding-left: 1px;" name="insurantCertNo" id="for-paperNoVpopWin" value=""  placeholder="证件号码中X用*号代替" maxlength="18" onchange="functions.fucosDate(this)">'
								+ '<input type="text" id="for-paperNo_otherVpopWin" class="inforinput"  name="insurantCertNo" maxlength="20"   style="display: none;height: 2em; padding-left: 1px;" placeholder="必填"></td></tr>'
								+'<tr id="birthdaybox" style="display:none"><td align="right" style="width: 33%;padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">出</span><span class="left tl" style="width:14px">生</span><span class="left tl" style="width:14px">日</span><span class="left tl" style="width:14px">期</span></td><td style="padding-top:10px;padding-bottom:10px"><input type="text" class="inforinput" name="insurantCertBirthday" maxlength="20" id="insurantCertBirthdayVpopWin" style="height: 2em; padding-left: 1px;" /></td></tr>'
								+'<tr id="sexbox" style="display:none"><td align="right" style="width: 33%;padding-top:10px;padding-bottom:10px"><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">性</span><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">&nbsp;</span><span class="left tl" style="width:14px">别</span></td><td style="padding-top:10px;padding-bottom:10px"><input type="hidden" class="inforinput" name="insurantCertSex" maxlength="20" id="insurantCertSexVpopWin" value="M" /><input name="sex" class="man" type="radio" value="M"  checked="checked" style="width:25%;height:20px;line-height:20px;margin-top: 6px;float: left;" onclick="functions.assignmentToInput($(this).val())" /><span style="float: left;margin-top: 7px;">男</span><input name="sex" class="woman" type="radio" value="F" style="width:25%;height:20px;line-height:20px;margin-top: 6px;float: left;" onclick="functions.assignmentToInput($(this).val())" /><span style="float: left;margin-top: 7px;">女</span></td></tr>'
								+ '</table> <div id="vpopWinError"  align="center" style="color:red;font-weight:bold;font-size:14px;margin-top:10px;" >'
								+ '</div><table style="margin-top:10px;width:100%;height:100%;"><tr><td width="50%"><input type="button"  value="取消" id="cancelVpopWin"  class="submitBut" style="border-radius:14px;border:0;width:60%;margin-left:27%;height:30px;font-size:14px;background-color:#FF7614;color:#FFF"/></td><td width="50%"><input type="button" id="commfirVpopWin" value="确认"  class="submitBut" style="width:60%;margin-left:11%;height:30px;font-size:14px;border:0;background-color:#FF7614;color:#FFF;border-radius:14px;"/></td></tr></table></div>'
						});
					}
				}

				$("#cancelVpopWin").click(function() {
					$("#alertVpopWin").remove();

				})

			}
			$.vPopWin = function(options,callback){
				var setting = {
					"content": null,
					"tit": null,
					"btn": "ok",
					"winClass": "",
					"winID": "",
					"isRemove": true,
					"fullScreen": false
				};
				
				var settings = $.extend(setting,options);
				
				if($("#"+settings.winID).length > 0 && !settings.isRemove){
					$("#"+settings.winID).show();
				}else{
					var $vPopWinWrap = $("<div class='vPopWin "+settings.winClass+"' id="+settings.winID+">" +
							"<div class='vPopWin-inner'>" +
							"<div class='vPopWin-title'>" +
							"<span class='vPopWin-title-name'>"+settings.tit+"</span>" +
							"<span class='vPopWin-title-btn'><i class='flat-icon-"+settings.btn+"'></i></span>" +
							"</div>" +
							"<div class='vPopWin-content'>"+settings.content+"</div>" +
							"</div>" +
					"</div>");
					
					if(options && typeof settings.content === "object"){
						$vPopWinWrap.find(".vPopWin-content").html(settings.content);
					}
					
					if(settings.fullScreen){
						$vPopWinWrap.addClass("fullScreen");
					}
					
					$vPopWinWrap.find(".vPopWin-title-btn").click(function(){
						//callback
						if(typeof callback === "function"){
							callback();
						}
						if(settings.isRemove){
							//remove
							$vPopWinWrap.remove();
						}
						if(!settings.isRemove){
							//hide
							$vPopWinWrap.hide();
						}
						
					});
					
					$("body").append($vPopWinWrap);
				}

			};

	});


});
